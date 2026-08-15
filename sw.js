/* ============================================================
   SERVICE WORKER — szybkie otwieranie i ikona na ekranie głównym

   Strategia: najpierw sieć, pamięć jako zapas.

   Poprzednia wersja robiła odwrotnie i to był błąd. Podawała plik
   z pamięci, a przy dopasowaniu używała ignoreSearch — czyli
   ignorowała końcówkę `?v=…`, którą wymusza się odświeżenie po
   zmianie kodu. Efekt: telefon z zainstalowaną aplikacją potrafił
   tygodniami chodzić na starym JavaScripcie, a kolejne wydania
   po prostu do niego nie docierały.

   Skoro postęp i tak wymaga serwera, trzymanie starego kodu niczego
   nie ratuje. Przy dostępnej sieci bierzemy świeże pliki, a pamięć
   służy tylko do tego, żeby bez zasięgu aplikacja pokazała własny
   ekran „nie ma połączenia" zamiast błędu przeglądarki.

   Żądania do /api/ nie mogą tu wpaść nigdy. To one niosą stan konta
   i postęp — podanie ich z pamięci oznaczałoby cudze albo
   nieaktualne dane.
   ============================================================ */

const WERSJA = 'v9';
const CACHE = 'rublya-' + WERSJA;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './css/cartoon.css',
  './fonts/rubik-latin.woff2',
  './fonts/rubik-latin-ext.woff2',
  './fonts/rubik-cyrillic.woff2',
  './fonts/rubik-cyrillic-ext.woff2',
  './js/data/00-core.js',
  './js/data/01-fundament.js',
  './js/data/02-codzienne.js',
  './js/data/03-swiat.js',
  './js/data/04-praca-czas.js',
  './js/data/05-dzialanie.js',
  './js/data/06-zywy.js',
  './js/data/07-wiecej.js',
  './js/data/10-gramatyka.js',
  './js/data/11-sciagawki.js',
  './js/data/12-sciezka.js',
  './js/data/13-zdania.js',
  './js/data/14-sklep.js',
  './js/data/15-klawiatura.js',
  './js/data/16-tlumaczenia.js',
  './js/ui.js',
  './js/api.js',
  './js/store.js',
  './js/auth.js',
  './js/speech.js',
  './js/app.js',
  './js/views2.js',
  './js/views3.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      /* Pojedynczy brakujący plik nie może wywrócić całej instalacji */
      .then((c) => Promise.allSettled(ASSETS.map((a) => c.add(new Request(a, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      /* Kusiło, żeby odświeżyć stąd wszystkie otwarte okna i mieć pewność,
         że nikt nie siedzi na starym kodzie. Rezygnuję świadomie: Safari
         ma udokumentowany błąd, w którym wymiana workera w trakcie
         nawigacji zabija poprzednika i strona nie doczytuje się wcale.
         Odświeżeniem zajmuje się sama strona, przez nasłuch zmiany
         workera w index.html — łagodniej i bez wchodzenia w tę pułapkę. */
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* Konto i postęp zawsze prosto z serwera — bez pośrednictwa pamięci. */
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        /* Świeża odpowiedź od razu ląduje w pamięci jako zapas na później.
           Dopasowanie po pełnym adresie, razem z `?v=…` — bez tego wersje
           zlewałyby się w jedną i znowu podawalibyśmy stary kod. */
        if (res && res.ok) {
          const kopia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, kopia));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((hit) => {
          if (hit) return hit;
          /* Zapasowy index.html ma sens wyłącznie dla samej strony.
             Oddany zamiast skryptu czy czcionki wyglądałby jak plik
             uszkodzony i mieszał w diagnozie. */
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('Brak połączenia', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        })
      )
  );
});

/* Pozwala stronie kazać nam ustąpić miejsca nowej wersji od razu,
   bez czekania na zamknięcie wszystkich kart. */
self.addEventListener('message', (e) => {
  if (e.data === 'przejmij') self.skipWaiting();
});
