'use strict';
/* =========================================================
   Привет! · komponenty interfejsu
   ========================================================= */

/* ---------- ikony (24×24, obrys) ---------- */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
  cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M7.5 3.5H19a2 2 0 0 1 2 2V17"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.1 3.6-7 8-7s8 2.9 8 7"/>',
  flame: '<path d="M12 22c4.2 0 7-2.8 7-6.6 0-3.5-2.4-6-4.1-8.1-.4 1.9-1.4 3.2-2.7 3.8.2-3.3-1.2-6.3-3.4-8.6.3 3.3-1.6 5.6-3.2 7.6C4.5 11.3 5 13.3 5 15.4 5 19.2 7.8 22 12 22z"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  speaker: '<path d="M11 5 6.5 9h-3v6h3l4.5 4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18.5 6a8.5 8.5 0 0 1 0 12"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  chev: '<path d="m9 5 7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  keyboard: '<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 15h10"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  crown: '<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  ice: '<path d="M12 2v20M3.3 7l17.4 10M20.7 7 3.3 17"/><path d="m9 3.5 3 2 3-2M9 20.5l3-2 3 2"/>',
  headphones: '<path d="M4 17v-5a8 8 0 0 1 16 0v5"/><rect x="3" y="13" width="5" height="8" rx="2"/><rect x="16" y="13" width="5" height="8" rx="2"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  shuffle: '<path d="M3 7h3c4 0 6 10 10 10h5M3 17h3c1.5 0 2.7-1.4 3.7-3M14.3 10c1-1.6 2.2-3 3.7-3h3"/><path d="m18 4 3 3-3 3M18 14l3 3-3 3"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
  abc: '<path d="M3 19 8 5l5 14M5 14h6"/><path d="M15 10.5c.8-.9 1.8-1.5 3-1.5 1.7 0 3 1 3 3v7M21 15c-1-.5-2-.7-3-.7-1.8 0-3 1-3 2.4S16.1 19 17.6 19c1.4 0 2.6-.6 3.4-1.6"/>',
  down: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  up: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
  play: '<path d="M7 4.5v15l12.5-7.5z"/>',
  snail: '<path d="M2.5 14.5a8 7 0 0 1 16 0z"/><path d="M7 14.5l2-6.3M14 14.5l-2-6.3M4.2 11h12.6"/><path d="M5.5 14.5V17M15.5 14.5V17"/><circle cx="20.6" cy="13.1" r="1.9"/>',
  path: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H16"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>'
};
const icon = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* ---------- komunikaty ---------- */
function toast(html, kind = '', ms = 2600) {
  let box = $('#toasts');
  const t = document.createElement('div');
  t.className = `toast ${kind}`;
  t.innerHTML = html;
  box.appendChild(t);
  requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, ms);
}

/* ---------- arkusz od dołu ---------- */
let sheetStack = [];
function openSheet(html, { onOpen, onClose, cls = '' } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="sheet-backdrop"></div><div class="sheet ${cls}" role="dialog" aria-modal="true"><div class="sheet-grip"></div>${html}</div>`;
  document.body.appendChild(wrap);
  const api = {
    el: wrap.querySelector('.sheet'),
    close() {
      if (!wrap.isConnected) return;
      wrap.classList.remove('in');
      sheetStack = sheetStack.filter(s => s !== api);
      setTimeout(() => wrap.remove(), 260);
      onClose && onClose();
    }
  };
  wrap.querySelector('.sheet-backdrop').addEventListener('click', () => api.close());
  wrap.addEventListener('click', e => { if (e.target.closest('[data-close]')) api.close(); });
  sheetStack.push(api);
  requestAnimationFrame(() => wrap.classList.add('in'));
  onOpen && onOpen(api.el, api);
  return api;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheetStack.length) sheetStack[sheetStack.length - 1].close(); });

function confirmBox({ title, text = '', ok = 'OK', cancel = 'Anuluj', danger = false }) {
  return new Promise(resolve => {
    let done = false;
    const s = openSheet(`
      <div class="sheet-body center">
        <h3 class="sheet-title">${title}</h3>
        ${text ? `<p class="muted">${text}</p>` : ''}
        <div class="btn-col">
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-ok>${ok}</button>
          <button class="btn btn-ghost" data-close>${cancel}</button>
        </div>
      </div>`, { onClose: () => { if (!done) resolve(false); } });
    s.el.querySelector('[data-ok]').addEventListener('click', () => { done = true; resolve(true); s.close(); });
  });
}
function promptBox({ title, label = '', value = '', ok = 'Zapisz', placeholder = '' }) {
  return new Promise(resolve => {
    let done = false;
    const s = openSheet(`
      <form class="sheet-body" data-form>
        <h3 class="sheet-title">${title}</h3>
        <label class="field"><span>${label}</span><input id="prompt-input" class="input" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off" maxlength="60"></label>
        <div class="btn-col"><button class="btn btn-primary" type="submit">${ok}</button><button class="btn btn-ghost" type="button" data-close>Anuluj</button></div>
      </form>`, { onClose: () => { if (!done) resolve(null); } });
    const inp = s.el.querySelector('input');
    setTimeout(() => inp.focus(), 280);
    s.el.querySelector('[data-form]').addEventListener('submit', e => {
      e.preventDefault();
      const v = inp.value.trim();
      if (!v) { inp.focus(); return; }
      done = true; resolve(v); s.close();
    });
  });
}

/* ---------- wbudowana klawiatura cyrylicy ---------- */
const KB_ROWS = [
  ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х'],
  ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
  ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
];
/* pisanie fonetyczne na fizycznej klawiaturze (łacinka → cyrylica) */
const PHYS = { a: 'а', b: 'б', v: 'в', w: 'в', g: 'г', d: 'д', e: 'е', z: 'з', i: 'и', j: 'й', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', u: 'у', f: 'ф', h: 'х', c: 'ц', y: 'ы', x: 'ж', q: 'я', '`': 'ё', ż: 'ж', ł: 'л', ó: 'у', ś: 'сь', ć: 'ть', ń: 'нь', ź: 'зь' };
const DIGRAPHS = [['шц', 'щ'], ['сз', 'ш'], ['цз', 'ч'], ['цх', 'х'], ['йа', 'я'], ['йу', 'ю'], ['йо', 'ё'], ['йе', 'е'], ['жз', 'ж']];

function insertAt(input, text) {
  const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
  let before = input.value.slice(0, s) + text;
  for (const [a, b] of DIGRAPHS) if (text.length === 1 && before.endsWith(a)) { before = before.slice(0, -a.length) + b; break; }
  input.value = before + input.value.slice(e);
  try { input.setSelectionRange(before.length, before.length); } catch (err) { /* nieobsługiwane */ }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
function backspaceAt(input) {
  const s = input.selectionStart ?? input.value.length, e = input.selectionEnd ?? s;
  if (s === e && s === 0) return;
  let from = s === e ? s - 1 : s;
  if (s === e && input.value[from] === ACC) from--;
  input.value = input.value.slice(0, from) + input.value.slice(e);
  try { input.setSelectionRange(from, from); } catch (err) { /* nieobsługiwane */ }
  input.dispatchEvent(new Event('input', { bubbles: true }));
}
/* podpina tłumaczenie łacinki → cyrylica dla pola z rosyjskim */
function attachPhysical(input, onEnter) {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); onEnter && onEnter(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const k = e.key.toLowerCase();
    if (PHYS[k] !== undefined) {
      e.preventDefault();
      let ch = PHYS[k];
      if (e.key !== k && e.key.toUpperCase() === e.key) ch = ch.charAt(0).toUpperCase() + ch.slice(1);
      insertAt(input, ch);
    } else if (k === "'") { e.preventDefault(); insertAt(input, 'ь'); }
  });
}
function buildKeyboard({ input, onEnter, stress = false, enterLabel = 'OK' }) {
  const el = document.createElement('div');
  el.className = 'kb';
  el.innerHTML = KB_ROWS.map((row, i) => `<div class="kb-row">${row.map(k => `<button type="button" class="kb-key" data-k="${k}">${k}</button>`).join('')}${i === 2 ? `<button type="button" class="kb-key wide" data-k="⌫" aria-label="Usuń">⌫</button>` : ''}</div>`).join('')
    + `<div class="kb-row"><button type="button" class="kb-key" data-k="ё">ё</button><button type="button" class="kb-key" data-k="ъ">ъ</button>${stress ? `<button type="button" class="kb-key" data-k="${ACC}" aria-label="Akcent">◌́</button>` : ''}<button type="button" class="kb-key space" data-k=" ">spacja</button><button type="button" class="kb-key" data-k="-">-</button><button type="button" class="kb-key act wide" data-k="⏎">${enterLabel}</button></div>`;
  const press = k => {
    if (k === '⌫') backspaceAt(input);
    else if (k === '⏎') onEnter && onEnter();
    else insertAt(input, k);
  };
  el.addEventListener('pointerdown', e => { const b = e.target.closest('.kb-key'); if (!b) return; e.preventDefault(); b.classList.add('down'); });
  el.addEventListener('pointerup', e => { const b = e.target.closest('.kb-key'); $$('.kb-key.down', el).forEach(x => x.classList.remove('down')); if (!b) return; e.preventDefault(); press(b.dataset.k); });
  el.addEventListener('pointerleave', () => $$('.kb-key.down', el).forEach(x => x.classList.remove('down')));
  el.addEventListener('click', e => e.preventDefault());
  return el;
}

/* ---------- konfetti ---------- */
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv = document.createElement('canvas');
  cv.className = 'confetti';
  document.body.appendChild(cv);
  const dpr = Math.min(2, devicePixelRatio || 1);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  const ctx = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const cols = ['--cobalt', '--gold', '--flame', '--ok', '--ice'].map(v => css.getPropertyValue(v).trim() || '#3355dd');
  const P = Array.from({ length: 110 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 14 * dpr, vy: (-Math.random() * 13 - 4) * dpr, r: (Math.random() * 5 + 3) * dpr, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: pick(cols) }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of P) {
      p.vy += .35 * dpr; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.a += p.va;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
    }
    if (++f < 150) requestAnimationFrame(tick); else cv.remove();
  })();
}

/* ---------- drobne elementy ---------- */
function masteryBars(id) {
  const m = mastery(id);
  return `<span class="mbar m${m}" title="${MASTERY_LABEL[m]}"><i></i><i></i><i></i><i></i></span>`;
}
function monogram(text, cls = '') { return `<span class="mono ${cls}">${esc(String(text).charAt(0))}</span>`; }
function speakBtn(text, cls = '', slow = false) { return `<button class="icon-btn speak ${cls}" data-speak="${esc(text)}"${slow ? ' data-slow="1"' : ''} aria-label="${slow ? 'Odtwórz wolniej' : 'Odtwórz wymowę'}">${icon(slow ? 'snail' : 'speaker')}</button>`; }
function ring(pct, size = 64, stroke = 7) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - clamp(pct, 0, 1));
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" class="ring-bg"/><circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${off}" stroke-linecap="round" transform="rotate(-90 ${size / 2} ${size / 2})"/></svg>`;
}
/* kwiat w stylu gżelskim – ornament */
function gzhel(cls = '') {
  const petals = Array.from({ length: 8 }, (_, i) => `<path d="M60 49C51 40 50 21 60 8c10 13 9 32 0 41z" transform="rotate(${i * 45} 60 60)"/>`).join('');
  const dots = Array.from({ length: 8 }, (_, i) => `<circle cx="60" cy="27" r="2.6" transform="rotate(${i * 45 + 22.5} 60 60)"/>`).join('');
  return `<svg class="gzhel ${cls}" viewBox="0 0 120 120" aria-hidden="true"><g class="gz-petals">${petals}</g><g class="gz-dots">${dots}</g><circle cx="60" cy="60" r="9" class="gz-core"/></svg>`;
}

/* odtwarzanie wymowy dla każdego [data-speak] */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-speak]');
  if (!b) return;
  e.stopPropagation();
  if (!Speech.speak(b.dataset.speak, !!b.dataset.slow)) toast('Brak syntezy mowy w tej przeglądarce', 'bad');
  b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
}, true);
