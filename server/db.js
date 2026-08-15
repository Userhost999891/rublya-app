'use strict';
/* ============================================================
   BAZA — MySQL

   Wcześniej stało tu SQLite: plik na dysku, zero zależności,
   zapytania synchroniczne. Świetne na jednym komputerze, bezużyteczne
   w chmurze — hosting kasuje pliki przy każdym wdrożeniu, więc konta
   znikałyby razem z nimi.

   MySQL rozwiązuje to inaczej: dane leżą poza serwerem aplikacji, więc
   serwer może być jednorazowy. Cena jest dwojaka — dochodzi paczka
   `mysql2` z npm, a wszystkie zapytania stają się asynchroniczne.

   Dane dostępowe czytamy wyłącznie ze zmiennych środowiskowych. Nigdy
   nie zapisujemy ich w kodzie: to jedyny sposób, żeby ten sam plik mógł
   spokojnie leżeć w publicznym repozytorium.
   ============================================================ */

const mysql = require('mysql2/promise');

/* Plik .env jest wygodą lokalną. Na hostingu zmienne przychodzą z panelu,
   pliku tam nie ma i nie powinno być — stąd cicha obsługa jego braku. */
try {
  if (typeof process.loadEnvFile === 'function') process.loadEnvFile();
} catch (e) { /* brak .env to normalny stan w chmurze */ }

/* ------------------------------------------------------------
   Skąd wziąć dane połączenia

   Przyjmujemy jeden adres URL albo pięć osobnych zmiennych. URL jest
   wygodniejszy przy wklejaniu do panelu hostingu, osobne zmienne
   czytelniejsze przy pracy lokalnej.
   ------------------------------------------------------------ */

function ustawienia() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (url) {
    let u;
    try {
      u = new URL(url);
    } catch (e) {
      throw new Error('MYSQL_URL nie wygląda na poprawny adres. ' +
        'Oczekiwany kształt: mysql://uzytkownik:haslo@serwer:port/baza');
    }
    return {
      host: u.hostname,
      port: +(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
    };
  }

  return {
    host: process.env.DB_HOST,
    port: +(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

const cfg = ustawienia();

/* Wartości ze wzoru wyglądają jak poprawna konfiguracja, więc aplikacja
   próbowałaby się z nimi łączyć i milczała przez kilkanaście sekund, aż
   do przeterminowania. Lepiej powiedzieć od razu, co jest nie tak. */
const ZE_WZORU = /przyklad|mojlogin|mojehaslo|mojabaza|uzytkownik|nazwa_bazy|^haslo$/i;
if (cfg.host && (ZE_WZORU.test(cfg.host) || ZE_WZORU.test(cfg.user || '') ||
                 ZE_WZORU.test(cfg.database || '') || ZE_WZORU.test(cfg.password || ''))) {
  console.error('');
  console.error('  W konfiguracji bazy zostały przykładowe wartości ze wzoru.');
  console.error('');
  console.error('    serwer: ' + cfg.host);
  console.error('    login:  ' + cfg.user);
  console.error('    baza:   ' + cfg.database);
  console.error('');
  console.error('  Otwórz .env i wstaw dane swojej bazy. Jeśli wypełniłeś');
  console.error('  pola DB_HOST i pozostałe, upewnij się, że linia MYSQL_URL');
  console.error('  jest zakomentowana — ma pierwszeństwo i przesłania resztę.');
  console.error('');
  throw new Error('Konfiguracja bazy nie została wypełniona');
}

if (!cfg.host || !cfg.user || !cfg.database) {
  console.error('');
  console.error('  Brakuje danych połączenia z bazą.');
  console.error('');
  console.error('  Lokalnie: skopiuj .env.example na .env i wypełnij.');
  console.error('  Na hostingu: ustaw zmienne w panelu usługi.');
  console.error('');
  console.error('  Najprościej jedną zmienną:');
  console.error('    MYSQL_URL=mysql://uzytkownik:haslo@serwer:port/baza');
  console.error('');
  throw new Error('Brak konfiguracji bazy');
}

/* Pula połączeń zamiast pojedynczego. Hosting potrafi zerwać bezczynne
   połączenie bez ostrzeżenia, a pula sama otwiera nowe zamiast wywracać
   aplikację. Limit trzymamy nisko — darmowe bazy mają ciasne przydziały. */
const pool = mysql.createPool({
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  password: cfg.password,
  database: cfg.database,
  waitForConnections: true,
  connectionLimit: 5,
  maxIdle: 2,
  idleTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  charset: 'utf8mb4',          /* cyrylica i polskie znaki */
  timezone: 'Z',
});

const driver = 'mysql2 → ' + cfg.host + ':' + cfg.port + '/' + cfg.database;

/* ------------------------------------------------------------
   Schemat

   utf8mb4 jest tu wymogiem, nie ozdobą: aplikacja przechowuje rosyjski
   i polski w jednym polu. Czasy trzymamy jako BIGINT ze znacznikiem
   milisekundowym — tak jak liczy je JavaScript, bez przeliczania stref.
   ------------------------------------------------------------ */

const SCHEMAT = [
  `CREATE TABLE IF NOT EXISTS users (
     id        INT AUTO_INCREMENT PRIMARY KEY,
     login     VARCHAR(64)  NOT NULL,
     nazwa     VARCHAR(64)  NOT NULL,
     hash      VARCHAR(255) NOT NULL,
     utworzono BIGINT       NOT NULL,
     widziano  BIGINT,
     UNIQUE KEY uniq_login (login)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS sessions (
     token     VARCHAR(64) NOT NULL PRIMARY KEY,
     user_id   INT         NOT NULL,
     utworzono BIGINT      NOT NULL,
     wygasa    BIGINT      NOT NULL,
     KEY idx_sessions_user (user_id),
     CONSTRAINT fk_sessions_user FOREIGN KEY (user_id)
       REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS progress (
     user_id  INT      NOT NULL PRIMARY KEY,
     dane     LONGTEXT NOT NULL,
     rev      INT      NOT NULL DEFAULT 0,
     zapisano BIGINT   NOT NULL,
     CONSTRAINT fk_progress_user FOREIGN KEY (user_id)
       REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

  `CREATE TABLE IF NOT EXISTS answers (
     id      BIGINT AUTO_INCREMENT PRIMARY KEY,
     user_id INT     NOT NULL,
     ts      BIGINT  NOT NULL,
     ok      TINYINT NOT NULL,
     temat   VARCHAR(40),
     KEY idx_answers_user_ts (user_id, ts),
     CONSTRAINT fk_answers_user FOREIGN KEY (user_id)
       REFERENCES users(id) ON DELETE CASCADE
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function init() {
  for (const sql of SCHEMAT) await pool.query(sql);
  await sweepSessions();
}

/* ------------------------------------------------------------
   Zapytania

   Nazwy zostały te same co przy SQLite, żeby reszta serwera zmieniła się
   możliwie mało. Różnica jest jedna, za to wszędzie: to są teraz funkcje
   asynchroniczne i każde wywołanie potrzebuje `await`.
   ------------------------------------------------------------ */

const jeden = async (sql, args) => {
  const [w] = await pool.execute(sql, args);
  return w[0] || null;
};

const q = {
  userByLogin: (login) => jeden('SELECT * FROM users WHERE login = ?', [login]),
  userById:    (id)    => jeden('SELECT * FROM users WHERE id = ?', [id]),

  createUser: async (login, nazwa, hash, kiedy) => {
    const [w] = await pool.execute(
      'INSERT INTO users (login, nazwa, hash, utworzono) VALUES (?, ?, ?, ?)',
      [login, nazwa, hash, kiedy]
    );
    return w.insertId;
  },

  touchUser:  (kiedy, id) => pool.execute('UPDATE users SET widziano = ? WHERE id = ?', [kiedy, id]),
  countUsers: async () => (await jeden('SELECT COUNT(*) AS n FROM users')).n,

  createSession: (token, userId, teraz, wygasa) => pool.execute(
    'INSERT INTO sessions (token, user_id, utworzono, wygasa) VALUES (?, ?, ?, ?)',
    [token, userId, teraz, wygasa]
  ),
  sessionByToken: (token) => jeden('SELECT * FROM sessions WHERE token = ?', [token]),
  dropSession:    (token) => pool.execute('DELETE FROM sessions WHERE token = ?', [token]),
  dropExpired:    (teraz) => pool.execute('DELETE FROM sessions WHERE wygasa < ?', [teraz]),

  getProgress: (userId) => jeden('SELECT dane, rev, zapisano FROM progress WHERE user_id = ?', [userId]),

  /* MySQL nie zna `ON CONFLICT` z SQLite — odpowiednikiem jest
     ON DUPLICATE KEY UPDATE. `rev = rev + 1` odnosi się do wartości,
     która była w wierszu przed zapisem. */
  putProgress: (userId, dane, kiedy) => pool.execute(
    'INSERT INTO progress (user_id, dane, rev, zapisano) VALUES (?, ?, 1, ?) ' +
    'ON DUPLICATE KEY UPDATE dane = VALUES(dane), rev = rev + 1, zapisano = VALUES(zapisano)',
    [userId, dane, kiedy]
  ),

  dropUser: (id) => pool.execute('DELETE FROM users WHERE id = ?', [id]),

  logAnswer: (userId, ts, ok, temat) => pool.execute(
    'INSERT INTO answers (user_id, ts, ok, temat) VALUES (?, ?, ?, ?)',
    [userId, ts, ok, temat]
  ),
};

/* Sprzątanie wygasłych sesji — raz przy starcie i potem co godzinę. */
async function sweepSessions() {
  try { await q.dropExpired(Date.now()); } catch (e) { /* nieistotne */ }
}
const sweeper = setInterval(sweepSessions, 3600e3);
if (sweeper.unref) sweeper.unref();

module.exports = { pool, q, driver, init, sweepSessions, opis: driver };
