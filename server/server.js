'use strict';
/* ============================================================
   RUBLYA — serwer

   Robi dwie rzeczy: podaje pliki aplikacji i obsługuje API kont
   oraz postępu. Zero zależności z npm — wszystko stoi na modułach
   wbudowanych w Node.

   Uruchomienie:
     node server/server.js              tylko ten komputer
     node server/server.js --lan        także telefon w tej samej sieci
     node server/server.js --port 3000  inny port
   ============================================================ */

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const { q, driver, init } = require('./db');
const A = require('./auth');

const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const flag = (name) => args.includes('--' + name);
const opt = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
};

const PORT = +(process.env.PORT || opt('port', 8080));

/* Na własnym komputerze słuchamy tylko siebie — nikt z sieci nie wejdzie
   bez świadomego `--lan`. Ale hostingi (Fly, Railway, Render) podają port
   zmienną PORT i oczekują nasłuchu na wszystkich interfejsach; nasłuch na
   127.0.0.1 byłby stamtąd niewidoczny i wdrożenie wyglądałoby na zepsute
   bez żadnego błędu w logu. Obecność PORT traktujemy więc jako sygnał,
   że stoimy w kontenerze. */
const HOST = process.env.HOST || ((flag('lan') || process.env.PORT) ? '0.0.0.0' : '127.0.0.1');

/* ------------------------------------------------------------
   Pliki statyczne
   ------------------------------------------------------------ */

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.md': 'text/markdown; charset=utf-8',
  '.ogg': 'audio/ogg',
};

/* Czego nie wypuszczamy nigdy — baza z hasłami leży w server/data,
   a skrypty pomocnicze nie mają czego szukać w przeglądarce. */
const BLOCKED = [/^server[\\/]/i, /\.db(-wal|-shm)?$/i, /^\.git[\\/]/i, /\.ps1$/i, /\.bat$/i];

function serveStatic(req, res, urlPath) {
  let rel = decodeURIComponent(urlPath.replace(/^\/+/, ''));
  if (!rel) rel = 'index.html';

  /* Przeglądarki dopominają się o /favicon.ico niezależnie od tego, co
     stoi w <link rel="icon">. Bez tego każde wejście zostawiało w logu
     czterysta cztery i mieszało przy diagnozie. */
  if (rel === 'favicon.ico') rel = 'icons/icon-192.png';

  const full = path.resolve(ROOT, rel);
  /* Wyjście poza folder projektu przez ../ kończymy tutaj. */
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return send(res, 403, 'Zabronione');

  const relFromRoot = path.relative(ROOT, full);
  if (BLOCKED.some((re) => re.test(relFromRoot))) return send(res, 403, 'Zabronione');

  let st;
  try { st = fs.statSync(full); } catch (e) { return send(res, 404, 'Nie znaleziono: ' + rel); }
  if (st.isDirectory()) return serveStatic(req, res, urlPath.replace(/\/*$/, '/') + 'index.html');

  const ext = path.extname(full).toLowerCase();
  const type = TYPES[ext] || 'application/octet-stream';

  /* Słaby ETag z rozmiaru i czasu zapisu wystarcza dla plików z dysku
     i oszczędza przesyłania tego samego kodu przy każdym wejściu. */
  const etag = 'W/"' + st.size.toString(16) + '-' + st.mtimeMs.toString(16) + '"';
  if (req.headers['if-none-match'] === etag) {
    res.writeHead(304, { ETag: etag });
    return res.end();
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': st.size,
    'ETag': etag,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=300',
    'X-Content-Type-Options': 'nosniff',
  });
  fs.createReadStream(full).pipe(res);
}

/* ------------------------------------------------------------
   Pomocnicze
   ------------------------------------------------------------ */

function send(res, status, text, headers) {
  const body = Buffer.from(String(text), 'utf8');
  res.writeHead(status, Object.assign({
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
  }, headers || {}));
  res.end(body);
}

function json(res, status, obj, headers) {
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  }, headers || {}));
  res.end(body);
}

const MAX_BODY = 4 * 1024 * 1024;

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      /* Ucinamy nadmiarowe żądanie zamiast zjadać pamięć serwera. */
      if (size > MAX_BODY) { reject(new Error('too-big')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readBody(req);
  if (!raw) return {};
  /* sendBeacon wysyła text/plain, więc nie patrzymy na nagłówek,
     tylko próbujemy sparsować treść. */
  return JSON.parse(raw);
}

/* Wersja, która zamiast wysadzać żądanie zwraca czytelny błąd 400.
   Popsuty JSON to wina klienta, nie awaria serwera. */
async function readJsonSafe(req, res) {
  try {
    return await readJson(req);
  } catch (e) {
    json(res, 400, { error: e.message === 'too-big' ? 'Za duże żądanie.' : 'Nieczytelne dane.' });
    return null;
  }
}

/* Proste dławienie prób logowania — pamięć procesu w zupełności
   wystarcza przy jednym serwerze i chroni przed zgadywaniem hasła. */
const attempts = new Map();
const WINDOW = 15 * 60e3;
const MAX_TRIES = 12;

function tooManyTries(ip) {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.since > WINDOW) { attempts.set(ip, { since: now, n: 1 }); return false; }
  rec.n++;
  return rec.n > MAX_TRIES;
}

function clearTries(ip) { attempts.delete(ip); }

function clientIp(req) {
  const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return fwd || req.socket.remoteAddress || '?';
}

/* Mapa czyszczona co kwadrans, żeby nie puchła od przypadkowych adresów. */
const cleaner = setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of attempts) if (now - rec.since > WINDOW) attempts.delete(ip);
}, WINDOW);
if (cleaner.unref) cleaner.unref();

/* ------------------------------------------------------------
   API
   ------------------------------------------------------------ */

async function api(req, res, route) {
  const method = req.method;

  /* --- rejestracja --- */
  if (route === 'register' && method === 'POST') {
    const ip = clientIp(req);
    if (tooManyTries(ip)) return json(res, 429, { error: 'Za dużo prób. Odczekaj kwadrans.' });

    const body = await readJsonSafe(req, res);
    if (!body) return;
    const out = await A.register(body.login, body.haslo);
    if (out.error) return json(res, out.status, { error: out.error });

    clearTries(ip);
    const token = await A.startSession(out.user.id);
    return json(res, 200, { user: A.publicUser(out.user) }, { 'Set-Cookie': A.cookieHeader(token, req) });
  }

  /* --- logowanie --- */
  if (route === 'login' && method === 'POST') {
    const ip = clientIp(req);
    if (tooManyTries(ip)) return json(res, 429, { error: 'Za dużo prób. Odczekaj kwadrans.' });

    const body = await readJsonSafe(req, res);
    if (!body) return;
    const out = await A.login(body.login, body.haslo);
    if (out.error) return json(res, out.status, { error: out.error });

    clearTries(ip);
    const token = await A.startSession(out.user.id);
    return json(res, 200, { user: A.publicUser(out.user) }, { 'Set-Cookie': A.cookieHeader(token, req) });
  }

  /* --- wylogowanie --- */
  if (route === 'logout' && method === 'POST') {
    await A.endSession(A.readCookie(req, A.COOKIE));
    return json(res, 200, { ok: true }, { 'Set-Cookie': A.clearCookieHeader() });
  }

  /* --- kto jest zalogowany, razem z postępem ---
     Start aplikacji potrzebuje obu rzeczy naraz, a dwa żądania jedno
     po drugim to dwa nadłożenia opóźnienia sieci. Przy zalogowanym
     koncie odsyłamy od razu komplet, żeby wejście trwało jedno
     odbicie od serwera zamiast dwóch. */
  if (route === 'me' && method === 'GET') {
    const u = await A.currentUser(req);
    if (!u) return json(res, 200, { user: null, dane: null });

    const row = await q.getProgress(u.id);
    let dane = null;
    if (row) { try { dane = JSON.parse(row.dane); } catch (e) { dane = null; } }
    return json(res, 200, { user: A.publicUser(u), dane, rev: row ? row.rev : 0 });
  }

  /* Wszystko poniżej wymaga konta. */
  const user = await A.currentUser(req);
  if (!user) return json(res, 401, { error: 'Nie zalogowano' });

  /* --- odczyt postępu --- */
  if (route === 'state' && method === 'GET') {
    const row = await q.getProgress(user.id);
    if (!row) return json(res, 200, { dane: null, rev: 0 });
    let dane = null;
    try { dane = JSON.parse(row.dane); } catch (e) { dane = null; }
    return json(res, 200, { dane, rev: row.rev, zapisano: row.zapisano });
  }

  /* --- zapis postępu --- */
  if (route === 'state' && (method === 'PUT' || method === 'POST')) {
    let body;
    try { body = await readJson(req); } catch (e) {
      return json(res, 400, { error: e.message === 'too-big' ? 'Stan jest za duży.' : 'Nieczytelne dane.' });
    }
    if (!body || typeof body.dane !== 'object' || body.dane === null) {
      return json(res, 400, { error: 'Brak stanu do zapisania.' });
    }
    await q.putProgress(user.id, JSON.stringify(body.dane), Date.now());
    await q.touchUser(Date.now(), user.id);
    const row = await q.getProgress(user.id);
    return json(res, 200, { ok: true, rev: row ? row.rev : 1 });
  }

  /* --- dziennik odpowiedzi (statystyki długoterminowe) --- */
  if (route === 'answers' && method === 'POST') {
    let body;
    try { body = await readJson(req); } catch (e) { return json(res, 400, { error: 'Nieczytelne dane.' }); }
    const list = Array.isArray(body.lista) ? body.lista.slice(0, 500) : [];
    for (const a of list) {
      await q.logAnswer(user.id, +a.ts || Date.now(), a.ok ? 1 : 0, a.temat ? String(a.temat).slice(0, 40) : null);
    }
    return json(res, 200, { ok: true, zapisano: list.length });
  }

  /* --- usunięcie konta wraz z postępem --- */
  if (route === 'account' && method === 'DELETE') {
    /* ON DELETE CASCADE sprząta sesje, postęp i dziennik odpowiedzi. */
    await q.dropUser(user.id);
    return json(res, 200, { ok: true }, { 'Set-Cookie': A.clearCookieHeader() });
  }

  return json(res, 404, { error: 'Nie ma takiego zasobu' });
}

/* ------------------------------------------------------------
   Serwer
   ------------------------------------------------------------ */

/* Log żądań. Przy diagnozie „czemu aplikacja sama się przeładowuje"
   to jedyny świadek, który nie zgaduje: pobranie index.html znaczy
   pełne wczytanie strony, a nie przejście między ekranami.
   Wyłączenie: --cicho */
const CICHO = flag('cicho');
let ostatniKlient = '';

function zapiszWpis(req, status, sciezka) {
  if (CICHO) return;
  const ip = clientIp(req).replace('::ffff:', '');
  const czas = new Date().toLocaleTimeString('pl-PL');
  /* Osobne urządzenia rozdzielamy pustą linią — inaczej telefon
     i komputer zlewają się w jeden nieczytelny strumień. */
  if (ip !== ostatniKlient) { console.log(''); ostatniKlient = ip; }

  let barwa = '\x1b[90m';
  let dopisek = '';

  /* Pobranie strony znaczy pełne wczytanie aplikacji od zera. */
  if (sciezka === '/' || sciezka.startsWith('/index.html')) barwa = '\x1b[33m';

  /* A tutaj front sam mówi, czy to było zwykłe wejście, czy przeglądarka
     przeładowała stronę pod nim. „reload" przy kliknięciu w menu jest
     dowodem, że aplikacja nie restartuje się z własnej woli. */
  const m = /[?&]skad=([a-z_]+)/.exec(sciezka);
  if (m) {
    dopisek = '   ← start: ' + m[1];
    if (m[1] === 'reload') { barwa = '\x1b[31m'; dopisek += '  (PRZEŁADOWANIE)'; }
    else if (m[1] === 'back_forward') barwa = '\x1b[36m';
    else barwa = '\x1b[32m';
  }

  console.log(barwa + '  ' + czas + '  ' + status + '  ' + ip + '  ' + sciezka + dopisek + '\x1b[0m');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + (req.headers.host || 'localhost'));
  const pathname = url.pathname;

  res.on('finish', () => zapiszWpis(req, res.statusCode, pathname + url.search));

  if (pathname.startsWith('/api/')) {
    api(req, res, pathname.slice(5).replace(/\/+$/, ''))
      .catch((err) => {
        console.error('  API:', err && err.message);
        if (!res.headersSent) json(res, 500, { error: 'Błąd serwera' });
      });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Metoda niedozwolona');
  serveStatic(req, res, pathname);
});

const line = (t, c) => console.log(c ? '\x1b[' + c + 'm' + t + '\x1b[0m' : t);

/* Najpierw baza, dopiero potem nasłuch. Odwrotna kolejność wpuszczałaby
   ruch, zanim istnieją tabele — pierwsze wejście dostawałoby błąd
   serwera zamiast ekranu logowania. */
async function start() {
  try {
    await init();
  } catch (e) {
    console.error('');
    console.error('  Nie udało się połączyć z bazą MySQL.');
    console.error('  ' + (e.message || e));
    console.error('');
    if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  Baza odrzuciła login lub hasło — sprawdź dane w .env.');
    } else if (e.code === 'ENOTFOUND' || e.code === 'ETIMEDOUT' || e.code === 'ECONNREFUSED') {
      console.error('  Serwer bazy nie odpowiada. Sprawdź adres i port, a u dostawcy —');
      console.error('  czy baza w ogóle przyjmuje połączenia z zewnątrz.');
    }
    console.error('');
    process.exit(1);
  }

  let ilu = '?';
  try { ilu = await q.countUsers(); } catch (e) { /* nieistotne dla startu */ }

  server.listen(PORT, HOST, () => {
    console.log('');
    line('  RUBLYA  ₽', '33');
    line('  ' + driver, '90');
    line('  kont w bazie: ' + ilu, '90');
    console.log('');
    line('  Na tym komputerze:', '90');
    line('    http://localhost:' + PORT, '32');

    if (HOST === '0.0.0.0') {
      console.log('');
      line('  Na telefonie w tej samej sieci Wi-Fi:', '90');
      const nets = os.networkInterfaces();
      for (const name of Object.keys(nets)) {
        for (const n of nets[name] || []) {
          if (n.family === 'IPv4' && !n.internal) line('    http://' + n.address + ':' + PORT, '36');
        }
      }
    } else {
      console.log('');
      line('  Telefon się nie połączy — serwer słucha tylko tego komputera.', '33');
      line('  Chcesz go wpuścić? Uruchom z flagą --lan', '90');
    }
    console.log('');
    line('  Zatrzymanie: Ctrl+C', '90');
    console.log('');
  });
}

start();

server.on('error', (err) => {
  console.error('');
  if (err.code === 'EADDRINUSE') {
    console.error('  Port ' + PORT + ' jest zajęty — najpewniej serwer już działa.');
    console.error('  Użyj innego: node server/server.js --port 8090');
  } else if (err.code === 'EACCES') {
    console.error('  Brak uprawnień do portu ' + PORT + '. Wybierz port powyżej 1024.');
  } else {
    console.error('  Nie udało się wystartować: ' + err.message);
  }
  console.error('');
  process.exit(1);
});
