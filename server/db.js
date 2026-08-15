'use strict';
/* ============================================================
   BAZA — SQLite

   Sterownik wybieramy w czasie startu. Node od wersji 24 ma SQLite
   w standardzie (`node:sqlite`) i wtedy projekt nie potrzebuje ani
   jednej paczki z npm. Na starszym Node sięgamy po better-sqlite3,
   jeśli ktoś go doinstalował. Obie biblioteki mają praktycznie ten
   sam interfejs (exec / prepare / run / get / all), więc reszta
   serwera nie musi wiedzieć, która z nich pracuje pod spodem.

   Wszystkie zapytania używają parametrów pozycyjnych `?` — to
   jedyna składnia, którą rozumieją oba sterowniki tak samo.
   ============================================================ */

const fs = require('node:fs');
const path = require('node:path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = process.env.RP_DB || path.join(DB_DIR, 'rublya.db');

/* ------------------------------------------------------------
   Wybór sterownika
   ------------------------------------------------------------ */

function openDatabase(file) {
  /* 1. SQLite wbudowany w Node */
  try {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(file);
    return { db, driver: 'node:sqlite' };
  } catch (e) {
    /* Node 22 zna ten moduł, ale wpuszcza go dopiero z flagą
       --experimental-sqlite. Rozróżniamy to od zwykłego braku
       modułu, bo podpowiedź dla użytkownika jest zupełnie inna. */
    var builtinErr = e;
  }

  /* 2. better-sqlite3 z npm */
  try {
    const Database = require('better-sqlite3');
    return { db: new Database(file), driver: 'better-sqlite3' };
  } catch (e) {
    const msg = String(builtinErr && builtinErr.message || '');
    const needsFlag = msg.includes('experimental') || msg.includes('--experimental-sqlite');

    console.error('\n  Nie udało się otworzyć bazy SQLite.\n');
    if (needsFlag) {
      console.error('  Twój Node zna SQLite, ale wymaga flagi. Uruchom tak:');
      console.error('    node --experimental-sqlite server/server.js\n');
      console.error('  Albo zainstaluj Node 24 lub nowszy — tam działa bez flagi.');
    } else {
      console.error('  Potrzebny jest Node 24+ (ma SQLite w standardzie)');
      console.error('  albo doinstalowany sterownik:');
      console.error('    npm install better-sqlite3');
    }
    console.error('');
    throw new Error('Brak sterownika SQLite');
  }
}

fs.mkdirSync(DB_DIR, { recursive: true });

const { db, driver } = openDatabase(DB_FILE);

/* WAL pozwala czytać w trakcie zapisu — przy jednym użytkowniku nie robi
   różnicy, ale przy kilku telefonach na raz oszczędza blokad. */
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA busy_timeout = 5000');

/* ------------------------------------------------------------
   Schemat
   ------------------------------------------------------------ */

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    login      TEXT    NOT NULL UNIQUE,   -- zawsze małymi literami, do wyszukiwania
    nazwa      TEXT    NOT NULL,          -- tak jak wpisał użytkownik, do wyświetlania
    hash       TEXT    NOT NULL,          -- scrypt: N:r:p:sól:klucz
    utworzono  INTEGER NOT NULL,
    widziano   INTEGER
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT    PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    utworzono  INTEGER NOT NULL,
    wygasa     INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

  CREATE TABLE IF NOT EXISTS progress (
    user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    dane       TEXT    NOT NULL,          -- cały stan aplikacji jako JSON
    rev        INTEGER NOT NULL DEFAULT 0,
    zapisano   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS answers (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ts         INTEGER NOT NULL,
    ok         INTEGER NOT NULL,
    temat      TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_answers_user_ts ON answers(user_id, ts);
`);

/* ------------------------------------------------------------
   Zapytania
   ------------------------------------------------------------ */

const q = {
  userByLogin:   db.prepare('SELECT * FROM users WHERE login = ?'),
  userById:      db.prepare('SELECT * FROM users WHERE id = ?'),
  createUser:    db.prepare('INSERT INTO users (login, nazwa, hash, utworzono) VALUES (?, ?, ?, ?)'),
  touchUser:     db.prepare('UPDATE users SET widziano = ? WHERE id = ?'),
  countUsers:    db.prepare('SELECT COUNT(*) AS n FROM users'),

  createSession: db.prepare('INSERT INTO sessions (token, user_id, utworzono, wygasa) VALUES (?, ?, ?, ?)'),
  sessionByToken:db.prepare('SELECT * FROM sessions WHERE token = ?'),
  dropSession:   db.prepare('DELETE FROM sessions WHERE token = ?'),
  dropExpired:   db.prepare('DELETE FROM sessions WHERE wygasa < ?'),

  getProgress:   db.prepare('SELECT dane, rev, zapisano FROM progress WHERE user_id = ?'),
  putProgress:   db.prepare(
    'INSERT INTO progress (user_id, dane, rev, zapisano) VALUES (?, ?, 1, ?) ' +
    'ON CONFLICT(user_id) DO UPDATE SET dane = excluded.dane, ' +
    'rev = progress.rev + 1, zapisano = excluded.zapisano'
  ),
  dropUser:      db.prepare('DELETE FROM users WHERE id = ?'),

  logAnswer:     db.prepare('INSERT INTO answers (user_id, ts, ok, temat) VALUES (?, ?, ?, ?)'),
  answerStats:   db.prepare(
    'SELECT COUNT(*) AS n, SUM(ok) AS ok FROM answers WHERE user_id = ? AND ts > ?'
  ),
};

/* Sprzątanie wygasłych sesji — raz przy starcie i potem co godzinę.
   Tabela sesji rośnie tylko przy logowaniu, więc częściej nie ma po co. */
function sweepSessions() {
  try { q.dropExpired.run(Date.now()); } catch (e) { /* nieistotne */ }
}
sweepSessions();
const sweeper = setInterval(sweepSessions, 3600e3);
if (sweeper.unref) sweeper.unref();

module.exports = { db, q, driver, DB_FILE, sweepSessions };
