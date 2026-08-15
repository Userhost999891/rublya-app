/* ============================================================
   API — rozmowa z serwerem

   Cały postęp mieszka w bazie po stronie serwera. Ten plik jest
   jedynym miejscem, które o tym wie; reszta aplikacji woła Store
   dokładnie tak jak wcześniej.

   Zapis jest opóźniony o ułamek sekundy i sklejany w jeden — przy
   szybkim klikaniu odpowiedzi nie ma sensu wysyłać stanu po każdym
   kliknięciu. Przy zamykaniu karty dosyłamy zaległości sendBeaconem,
   bo zwykły fetch nie zdąży się wykonać.
   ============================================================ */

window.API = (function () {

const BASE = '/api/';
const DEBOUNCE = 700;

let pending = null;      // stan czekający na wysłanie
let timer = null;
let inFlight = false;
let status = 'ok';       // ok | zapis | blad
const watchers = [];

function setStatus(s) {
  if (status === s) return;
  status = s;
  watchers.forEach((fn) => { try { fn(s); } catch (e) {} });
}

function onStatus(fn) { watchers.push(fn); fn(status); }

/* ------------------------------------------------------------
   Warstwa transportowa
   ------------------------------------------------------------ */

async function call(path, opts) {
  const o = Object.assign({
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
  }, opts || {});

  let res;
  try {
    res = await fetch(BASE + path, o);
  } catch (e) {
    /* Brak sieci albo zgaszony serwer — komunikat musi mówić wprost,
       co się stało, bo bez serwera aplikacja nie ma skąd wziąć danych. */
    const err = new Error('Brak połączenia z serwerem.');
    err.offline = true;
    throw err;
  }

  let data = null;
  try { data = await res.json(); } catch (e) { data = null; }

  if (!res.ok) {
    const err = new Error((data && data.error) || 'Błąd serwera (' + res.status + ').');
    err.status = res.status;
    throw err;
  }
  return data;
}

const post = (path, body) => call(path, { method: 'POST', body: JSON.stringify(body || {}) });

/* ------------------------------------------------------------
   Konto
   ------------------------------------------------------------ */

/* Przy każdym starcie mówimy serwerowi, skąd się wzięliśmy. To jedyny
   sposób, żeby odróżnić zwykłe wejście od przeładowania strony przez
   przeglądarkę — a bez tego rozróżnienia diagnoza „aplikacja sama się
   restartuje" opiera się na wrażeniach. Wynik ląduje w logu serwera.
     navigate      — normalne wejście
     reload        — odświeżenie, także wymuszone przez przeglądarkę
     back_forward  — powrót przyciskiem wstecz
     prerender     — wstępne wczytanie w tle */
function skadStart() {
  try {
    const w = performance.getEntriesByType('navigation')[0];
    if (w && w.type) return w.type;
    /* Starsze Safari nie zna nowego interfejsu, ale zna poprzedni. */
    const stare = ['navigate', 'reload', 'back_forward', 'prerender'];
    if (performance.navigation) return stare[performance.navigation.type] || '?';
  } catch (e) { /* nieistotne */ }
  return '?';
}

const me = () => call('me?skad=' + encodeURIComponent(skadStart()));
const register = (login, haslo) => post('register', { login, haslo });
const login    = (l, haslo) => post('login', { login: l, haslo });
const logout   = () => post('logout');
const removeAccount = () => call('account', { method: 'DELETE' });

/* ------------------------------------------------------------
   Postęp
   ------------------------------------------------------------ */

async function loadState() {
  const out = await call('state');
  return out.dane;
}

/* Wysyłka właściwa. Trzyma jedno żądanie na raz — gdyby w trakcie
   pojawił się nowy stan, poleci zaraz po zakończeniu bieżącego. */
async function push() {
  if (inFlight || pending === null) return;
  const dane = pending;
  pending = null;
  inFlight = true;
  setStatus('zapis');

  try {
    await call('state', { method: 'PUT', body: JSON.stringify({ dane }) });
    setStatus(pending === null ? 'ok' : 'zapis');
  } catch (e) {
    /* Nieudany zapis nie może wyparować — wracamy do kolejki, o ile
       nic nowszego już tam nie czeka. */
    if (pending === null) pending = dane;
    setStatus('blad');
    if (e.status === 401) {
      window.dispatchEvent(new CustomEvent('rp-wylogowano'));
    }
  } finally {
    inFlight = false;
    if (pending !== null) schedule();
  }
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(push, DEBOUNCE);
}

function saveState(stan) {
  pending = stan;
  setStatus('zapis');
  schedule();
}

/* Ostatnia szansa na zapis przy zamykaniu karty. sendBeacon przeżywa
   zamknięcie strony, fetch nie. Wysyłamy jako text/plain, bo Beacon
   z typem application/json wywołałby preflight, na który nie ma czasu. */
function flushBeacon() {
  if (pending === null || !navigator.sendBeacon) return;
  try {
    const blob = new Blob([JSON.stringify({ dane: pending })], { type: 'text/plain;charset=UTF-8' });
    if (navigator.sendBeacon(BASE + 'state', blob)) pending = null;
  } catch (e) { /* trudno, zapis przepadnie */ }
}

/* Świadomy zapis „teraz", np. przed wylogowaniem. */
async function flushNow() {
  clearTimeout(timer);
  await push();
}

function hasPending() { return pending !== null || inFlight; }

window.addEventListener('pagehide', flushBeacon);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushBeacon();
});

/* Po powrocie sieci próbujemy dosłać to, co nie poszło. */
window.addEventListener('online', () => { if (pending !== null) schedule(); });

return {
  me, register, login, logout, removeAccount,
  loadState, saveState, flushNow, hasPending, onStatus,
  get status() { return status; },
};

})();
