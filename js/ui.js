(function () {
/* ============================================================
   UI — narzędzia wspólne: DOM, dźwięk, efekty
   ============================================================ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function h(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr, n) { return shuffle(arr).slice(0, n); }

function plural(n, one, few, many) {
  const m10 = n % 10, m100 = n % 100;
  if (n === 1) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return m + ':' + String(s).padStart(2, '0');
}

/* Licznik, który dobija do wartości zamiast po prostu się pojawić */
function countUp(node, to, dur) {
  if (reduced) { node.textContent = to; return; }
  const from = 0, t0 = performance.now(), d = dur || 900;
  function step(t) {
    const p = Math.min(1, (t - t0) / d);
    const e = 1 - Math.pow(1 - p, 3);
    node.textContent = Math.round(from + (to - from) * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ------------------------------------------------------------
   Wymowa — cała logika siedzi w module Speech
   ------------------------------------------------------------ */

function canSpeak() { return window.Speech ? Speech.mode() !== 'none' : false; }
function speak(input, btn) { return window.Speech ? Speech.speak(input, btn) : false; }

/* ------------------------------------------------------------
   Powiadomienia
   ------------------------------------------------------------ */

function toastHost() {
  let host = document.getElementById('toasts');
  if (!host) {
    host = h('<div class="toasts" id="toasts"></div>');
    document.body.appendChild(host);
  }
  return host;
}

function toast(title, desc, kind) {
  const el = h(
    '<div class="toast' + (kind ? ' ' + kind : '') + '">' +
      '<div class="toast-t">' + esc(title) + '</div>' +
      (desc ? '<div class="toast-d">' + esc(desc) + '</div>' : '') +
    '</div>'
  );
  toastHost().appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 3600);
}

function badgeToast(b) {
  const el = h(
    '<div class="toast badge-toast">' +
      '<div class="toast-t">Odznaka: ' + esc(b.pl) + '</div>' +
      '<div class="toast-d">' + esc(b.ru) + ' — ' + esc(b.desc) + '</div>' +
    '</div>'
  );
  toastHost().appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 320);
  }, 5200);
}

/* ------------------------------------------------------------
   Konfetti — kanwa, nie setki węzłów DOM
   ------------------------------------------------------------ */

let fx = null, fxCtx = null, parts = [], fxRunning = false;

function initFx() {
  if (fx) return;
  fx = document.createElement('canvas');
  fx.id = 'fx';
  document.body.appendChild(fx);
  fxCtx = fx.getContext('2d');
  sizeFx();
  window.addEventListener('resize', sizeFx);
}

function sizeFx() {
  if (!fx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fx.width = innerWidth * dpr;
  fx.height = innerHeight * dpr;
  fx.style.width = innerWidth + 'px';
  fx.style.height = innerHeight + 'px';
  fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

const FX_COLORS = ['#f2b705', '#e23b2e', '#ece6da', '#3fb27f'];

function burst(x, y, count) {
  if (reduced) return;
  initFx();
  const cx = x != null ? x : innerWidth / 2;
  const cy = y != null ? y : innerHeight * 0.38;
  const n = count || 46;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 3 + Math.random() * 8;
    parts.push({
      x: cx, y: cy,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 3,
      r: 2 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: FX_COLORS[(Math.random() * FX_COLORS.length) | 0],
      life: 1,
    });
  }
  if (!fxRunning) { fxRunning = true; requestAnimationFrame(tickFx); }
}

function tickFx() {
  fxCtx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.vy += 0.24;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= 0.0105;
    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rot);
    fxCtx.globalAlpha = Math.max(0, p.life);
    fxCtx.fillStyle = p.c;
    fxCtx.fillRect(-p.r, -p.r * 0.55, p.r * 2, p.r * 1.1);
    fxCtx.restore();
  }
  if (parts.length) requestAnimationFrame(tickFx);
  else { fxRunning = false; fxCtx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ------------------------------------------------------------
   Awans na kolejny poziom
   ------------------------------------------------------------ */

function levelUp(info) {
  const ov = h(
    '<div class="levelup">' +
      '<div class="levelup-in">' +
        '<div class="cap">Новый уровень</div>' +
        '<div class="lvl">' + info.lvl + '</div>' +
        '<div class="name cyr">' + esc(info.rank) + '</div>' +
      '</div>' +
    '</div>'
  );
  document.body.appendChild(ov);
  burst(innerWidth / 2, innerHeight * 0.42, 90);
  const close = () => { ov.remove(); };
  ov.addEventListener('click', close);
  setTimeout(close, 2600);
}

/* ------------------------------------------------------------
   Pierścień postępu
   ------------------------------------------------------------ */

function ring(pct, label, done) {
  const R = 15.5, C = 2 * Math.PI * R;
  const off = C * (1 - Math.min(1, pct / 100));
  return (
    '<div class="ring' + (done ? ' done' : '') + '">' +
      '<svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">' +
        '<circle class="track" cx="19" cy="19" r="' + R + '"></circle>' +
        '<circle class="fill" cx="19" cy="19" r="' + R + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle>' +
      '</svg>' +
      '<div class="txt">' + esc(label) + '</div>' +
    '</div>'
  );
}

function bar(pct, cls) {
  return '<div class="bar' + (cls ? ' ' + cls : '') + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>';
}

window.UI = {
  h, esc, shuffle, pick, plural, fmtTime, countUp,
  speak, canSpeak,
  toast, badgeToast, burst, levelUp,
  ring, bar, reduced,
};
})();
