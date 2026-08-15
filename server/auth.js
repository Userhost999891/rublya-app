'use strict';
/* ============================================================
   KONTA — rejestracja, logowanie, sesje

   Hasła trzymamy jako scrypt (wbudowany w Node). scrypt jest
   celowo pamięciożerny, więc łamanie go kartą graficzną jest
   dużo droższe niż przy zwykłym SHA. Zero paczek z npm.

   Sesja to losowy token w ciasteczku HttpOnly — JavaScript strony
   go nie odczyta, więc nawet udany XSS nie wyniesie logowania.
   ============================================================ */

const crypto = require('node:crypto');
const { q } = require('./db');

const COOKIE = 'rp_sesja';
const SESSION_DAYS = 90;

/* Parametry scrypt. N musi być potęgą dwójki; 2^15 to rozsądny
   kompromis między bezpieczeństwem a czasem logowania na słabym
   serwerze. Zapisujemy je razem z hashem, żeby dało się je kiedyś
   podnieść bez unieważniania starych haseł. */
const SCRYPT = { N: 32768, r: 8, p: 1, len: 64 };

/* scrypt przy tych parametrach potrzebuje więcej pamięci, niż wynosi
   domyślny limit Node — bez tego rzuca "memory limit exceeded". */
const MAXMEM = 128 * SCRYPT.N * SCRYPT.r * 2;

function scrypt(pass, salt, opts) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(pass, salt, opts.len, { N: opts.N, r: opts.r, p: opts.p, maxmem: MAXMEM },
      (err, key) => (err ? reject(err) : resolve(key)));
  });
}

async function hashPassword(pass) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(pass, salt, SCRYPT);
  return [SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString('hex'), key.toString('hex')].join(':');
}

async function verifyPassword(pass, stored) {
  const parts = String(stored).split(':');
  if (parts.length !== 5) return false;
  const opts = { N: +parts[0], r: +parts[1], p: +parts[2], len: parts[4].length / 2 };
  if (!opts.N || !opts.r || !opts.p || !opts.len) return false;

  let key;
  try {
    key = await scrypt(pass, Buffer.from(parts[3], 'hex'), opts);
  } catch (e) {
    return false;
  }
  const want = Buffer.from(parts[4], 'hex');
  /* Porównanie o stałym czasie — zwykłe === zdradza po czasie odpowiedzi,
     ile pierwszych bajtów się zgadzało. */
  return key.length === want.length && crypto.timingSafeEqual(key, want);
}

/* ------------------------------------------------------------
   Walidacja danych rejestracji
   ------------------------------------------------------------ */

/* Login: litery (też polskie), cyfry, kropka, podkreślnik, myślnik.
   Bez spacji, żeby nie dało się założyć dwóch kont wyglądających
   identycznie po wyświetleniu. */
const LOGIN_OK = /^[\p{L}\p{N}._-]{3,32}$/u;

function checkCredentials(login, pass) {
  if (typeof login !== 'string' || typeof pass !== 'string') {
    return 'Brakuje loginu albo hasła.';
  }
  const l = login.trim();
  if (l.length < 3) return 'Login musi mieć co najmniej 3 znaki.';
  if (l.length > 32) return 'Login może mieć najwyżej 32 znaki.';
  if (!LOGIN_OK.test(l)) return 'Login może zawierać tylko litery, cyfry, kropkę, myślnik i podkreślnik.';
  if (pass.length < 8) return 'Hasło musi mieć co najmniej 8 znaków.';
  if (pass.length > 200) return 'Hasło jest absurdalnie długie.';
  return null;
}

/* ------------------------------------------------------------
   Rejestracja i logowanie
   ------------------------------------------------------------ */

async function register(login, pass) {
  const bad = checkCredentials(login, pass);
  if (bad) return { error: bad, status: 400 };

  const nazwa = login.trim();
  const key = nazwa.toLowerCase();

  if (await q.userByLogin(key)) {
    return { error: 'Ten login jest już zajęty.', status: 409 };
  }

  const hash = await hashPassword(pass);
  let id;
  try {
    id = await q.createUser(key, nazwa, hash, Date.now());
  } catch (e) {
    /* Wyścig: ktoś zdążył zająć login między sprawdzeniem a zapisem.
       Klucz UNIQUE w bazie jest tu ostatnim i rozstrzygającym słowem.
       MySQL zgłasza to jako ER_DUP_ENTRY. */
    if (e.code === 'ER_DUP_ENTRY' || String(e.message).includes('Duplicate entry')) {
      return { error: 'Ten login jest już zajęty.', status: 409 };
    }
    throw e;
  }

  return { user: await q.userById(id) };
}

async function login(loginRaw, pass) {
  if (typeof loginRaw !== 'string' || typeof pass !== 'string') {
    return { error: 'Brakuje loginu albo hasła.', status: 400 };
  }
  const user = await q.userByLogin(loginRaw.trim().toLowerCase());

  /* Gdy loginu nie ma, i tak liczymy hash na atrapie. Inaczej czas
     odpowiedzi zdradzałby, które konta istnieją. */
  if (!user) {
    await verifyPassword(pass, '32768:8:1:' + '00'.repeat(16) + ':' + '00'.repeat(64));
    return { error: 'Zły login lub hasło.', status: 401 };
  }

  const ok = await verifyPassword(pass, user.hash);
  if (!ok) return { error: 'Zły login lub hasło.', status: 401 };

  await q.touchUser(Date.now(), user.id);
  return { user };
}

/* ------------------------------------------------------------
   Sesje
   ------------------------------------------------------------ */

async function startSession(userId) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  await q.createSession(token, userId, now, now + SESSION_DAYS * 86400e3);
  return token;
}

async function endSession(token) {
  if (token) await q.dropSession(token);
}

/* Zwraca użytkownika albo null. Wygasłą sesję od razu kasuje. */
async function userFromToken(token) {
  if (!token) return null;
  const s = await q.sessionByToken(token);
  if (!s) return null;
  if (s.wygasa < Date.now()) { await q.dropSession(token); return null; }
  return (await q.userById(s.user_id)) || null;
}

function readCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    if (part.slice(0, i).trim() === name) {
      return decodeURIComponent(part.slice(i + 1).trim());
    }
  }
  return null;
}

/* `secure` tylko po HTTPS — inaczej ciasteczko nie działałoby przy
   testach po zwykłym http w sieci domowej. Za odwrotnym proxy
   (Render, Railway) prawdę o protokole niesie X-Forwarded-Proto. */
function cookieHeader(token, req) {
  const proto = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  const https = proto === 'https' || (req.socket && req.socket.encrypted);
  const bits = [
    COOKIE + '=' + encodeURIComponent(token),
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=' + SESSION_DAYS * 86400,
  ];
  if (https) bits.push('Secure');
  return bits.join('; ');
}

function clearCookieHeader() {
  return COOKIE + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

/* Asynchroniczne, bo sprawdzenie sesji to teraz zapytanie do bazy.
   Każde wywołanie w server.js musi mieć `await`. */
function currentUser(req) {
  return userFromToken(readCookie(req, COOKIE));
}

/* Dane użytkownika bezpieczne do odesłania na front — bez hasha. */
function publicUser(u) {
  return { id: u.id, nazwa: u.nazwa, login: u.login, utworzono: u.utworzono };
}

module.exports = {
  COOKIE,
  register, login,
  startSession, endSession, currentUser, publicUser,
  readCookie, cookieHeader, clearCookieHeader,
};
