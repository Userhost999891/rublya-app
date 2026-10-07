'use strict';
/* =========================================================
   Привет! · start aplikacji
   ========================================================= */
const APP_VERSION = '1.0.0';

function applyTheme() {
  const t = S.settings.theme, root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-theme'); else root.dataset.theme = t;
  const dark = t === 'dark' || (t === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  $$('meta[name="theme-color"]').forEach(m => m.setAttribute('content', dark ? '#0B1020' : '#F3F5FB'));
}

function welcome() {
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  let goal = S.settings.goal;
  const s = openSheet(`<div class="sheet-body welcome">
    ${gzhel('wel-orn')}
    <h2 class="display center">Привет!</h2>
    <p class="center muted">Rosyjski krok po kroku: ${LIB.size} słów z akcentami i wymową, własne fiszki, codzienne lekcje i powtórki w najlepszym momencie, zanim zapomnisz.</p>
    <div class="set-block"><b>Ile czasu dziennie chcesz się uczyć?</b>
      <div class="seg wel-goal">${[[10, 'ok. 3 min'], [30, 'ok. 8 min'], [50, 'ok. 12 min'], [100, 'ok. 25 min']].map(([v, l]) => `<button type="button" class="${v === goal ? 'on' : ''}" data-v="${v}">${v} XP<small>${l}</small></button>`).join('')}</div>
    </div>
    ${ios && !standalone ? `<div class="note">${icon('share')}<span>Zainstaluj na iPhonie: w Safari stuknij <b>Udostępnij</b>, potem <b>Do ekranu początkowego</b>.</span></div>` : ''}
    <button class="btn btn-primary btn-block" data-start>Zaczynamy</button>
  </div>`, { onClose: () => { S.seenIntro = true; save(); } });
  $('.wel-goal', s.el).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    goal = +b.dataset.v;
    $$('.wel-goal button', s.el).forEach(x => x.classList.toggle('on', x === b));
  });
  $('[data-start]', s.el).addEventListener('click', () => { S.settings.goal = goal; S.seenIntro = true; save(); s.close(); render(); });
}

function registerSW() {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  try { if (localStorage.getItem('privet-nosw')) return; } catch (e) { /* brak dostępu */ }
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
  navigator.serviceWorker.register('sw.js').then(reg => {
    const offer = w => {
      if (!w || $('.update-bar')) return;
      const bar = document.createElement('div');
      bar.className = 'update-bar';
      bar.innerHTML = `<span>Dostępna nowa wersja aplikacji</span><button class="btn btn-light sm">Odśwież</button>`;
      bar.querySelector('button').addEventListener('click', () => { if (SESSION) { toast('Najpierw zakończ sesję'); return; } w.postMessage('skip-waiting'); });
      document.body.appendChild(bar);
    };
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw && nw.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) offer(nw); });
    });
  }).catch(() => { /* bez trybu offline */ });
}

function init() {
  buildLibrary();
  loadState();
  applyTheme();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
  Speech.init();
  const sk = checkStreak();

  bus.addEventListener('achievement', e => toast(`<span class="t-ic gold">${icon('trophy')}</span><span><b>Osiągnięcie: ${esc(e.detail.name)}</b><small>${esc(e.detail.desc)}</small></span>`, 'ach', 4200));
  bus.addEventListener('goal', e => { if (!SESSION) toast(`<span class="t-ic flame">${icon('flame')}</span><span><b>Cel dnia osiągnięty!</b><small>Seria: ${e.detail} ${plural(e.detail, 'dzień', 'dni', 'dni')}</small></span>`, 'ach', 4000); });
  bus.addEventListener('freeze-earned', () => toast(`<span class="t-ic ice">${icon('ice')}</span><span><b>Zdobyto zamrożenie serii</b><small>Ochroni serię, jeśli opuścisz dzień</small></span>`, 'ach', 4200));

  $('#tabbar').addEventListener('click', e => {
    const t = e.target.closest('[data-tab]'); if (!t) return;
    e.preventDefault();
    go(t.dataset.tab);
  });
  render();
  document.body.classList.add('ready');

  if (!storageOk) toast('Przeglądarka blokuje zapis danych — postęp nie zostanie zachowany', 'bad', 6000);
  if (sk?.saved) setTimeout(() => toast(`<span class="t-ic ice">${icon('ice')}</span><span><b>Seria uratowana</b><small>Zamrożenie pokryło ${sk.saved} ${plural(sk.saved, 'opuszczony dzień', 'opuszczone dni', 'opuszczonych dni')}</small></span>`, 'ach', 5000), 600);
  else if (sk?.lost) setTimeout(() => toast(`Seria ${sk.lost} ${plural(sk.lost, 'dnia', 'dni', 'dni')} się skończyła. Zacznij nową już dziś!`, '', 5000), 600);
  if (!S.seenIntro) setTimeout(welcome, 350);

  /* odświeżenie ekranu „Dziś” po północy lub po powrocie do aplikacji */
  let lastDay = dayKey();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || SESSION) return;
    if (dayKey() !== lastDay) { lastDay = dayKey(); checkStreak(); }
    render();
  });
  registerSW();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
