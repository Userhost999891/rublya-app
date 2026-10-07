/* Service worker: aplikacja działa offline.
   Po każdej zmianie plików podnieś VERSION, aby telefon pobrał nową wersję. */
const VERSION = 'privet-1.0.0';
const FONTS = 'privet-fonts';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css',
  'js/core.js', 'js/ui.js', 'js/session.js', 'js/views.js', 'js/main.js',
  'data/alphabet.js', 'data/a1-1.js', 'data/a1-2.js', 'data/a1-3.js', 'data/a2-1.js', 'data/a2-2.js', 'data/b1-1.js', 'data/b1-2.js',
  'icons/icon-32.png', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skip-waiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* czcionki Google: z pamięci, w tle odświeżane */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  /* pliki aplikacji: najpierw pamięć podręczna */
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      if (req.mode === 'navigate') return caches.match('index.html').then(r => r || fetch(req));
      return fetch(req);
    })
  );
});
