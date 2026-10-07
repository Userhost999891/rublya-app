'use strict';
/* =========================================================
   Привет! · rdzeń: narzędzia, tekst, biblioteka, stan, SRS
   ========================================================= */

/* ---------- narzędzia ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rand = n => Math.floor(Math.random() * n);
const pick = a => a[rand(a.length)];
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const MIN = 60e3, HOUR = 36e5, DAY = 864e5;

const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const keyDate = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (k, n) => { const d = keyDate(k); d.setDate(d.getDate() + n); return dayKey(d.getTime()); };
const daysBetween = (a, b) => Math.round((keyDate(b) - keyDate(a)) / DAY);
const dayStart = (t = Date.now()) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
const plural = (n, one, few, many) => {
  if (n === 1) return one;
  const d = n % 10, dd = n % 100;
  return (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) ? few : many;
};
const DAYS_PL = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const MONTHS_PL = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
function fmtIvl(ms) {
  const m = Math.round(ms / MIN);
  if (m < 60) return `${Math.max(1, m)} min`;
  const h = Math.round(ms / HOUR);
  if (h < 24) return `${h} godz.`;
  const d = Math.round(ms / DAY);
  if (d < 31) return `${d} d`;
  if (d < 365) return `${Math.round(d / 30)} mies.`;
  return `${(d / 365).toFixed(1).replace('.0', '')} r.`;
}
const fmtDays = d => d < 31 ? `${d} d` : d < 365 ? `${Math.round(d / 30)} mies.` : `${(d / 365).toFixed(1).replace('.0', '')} r.`;
/* etykieta terminu: karty w powtórkach liczone w dniach, w nauce w minutach */
function ivlLabel(c, now = Date.now()) {
  if (c.s === 2) return fmtDays(Math.max(1, Math.round((dayStart(c.due) - dayStart(now)) / DAY)));
  return fmtIvl(c.due - now);
}
function dueLabel(c, now = Date.now()) {
  if (!c || c.s === 0) return '—';
  if (c.due <= now) return 'teraz';
  if (c.s !== 2) return 'za ' + fmtIvl(c.due - now);
  const d = Math.round((dayStart(c.due) - dayStart(now)) / DAY);
  return d <= 0 ? 'dziś' : d === 1 ? 'jutro' : 'za ' + fmtDays(d);
}
function fmtDuration(ms) { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }

/* ---------- tekst rosyjski ---------- */
const ACC = '́';
const RU_V = 'аеёиоуыэюя';
/* apostrof po samogłosce cyrylicy → znak akcentu */
const stressify = s => String(s || '').replace(/([аеёиоуыэюяАЕЁИОУЫЭЮЯ])'/g, '$1' + ACC);
const stripAcc = s => String(s || '').replace(/[́̀]/g, '');
const plainRu = s => stripAcc(String(s).replace(/'/g, '')).toLowerCase().replace(/ё/g, 'е').trim();
const normRu = s => stripAcc(s).toLowerCase().replace(/ё/g, 'е').replace(/[-‐–—]/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
const normPl = s => String(s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[-‐–—]/g, ' ').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
const deburr = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
const isCyr = s => /[а-яё]/i.test(s);

function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m || !n) return m || n;
  let prev = Array.from({ length: n + 1 }, (_, j) => j), cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

/* warianty polskiego tłumaczenia: „dobry, życzliwy” → [dobry życzliwy, dobry, życzliwy] */
function plVariants(pl) {
  const parts = String(pl).replace(/\(.*?\)/g, '').split(/[,;/]/).map(normPl).filter(Boolean);
  return [...new Set([normPl(pl), ...parts])].filter(Boolean);
}

/* sprawdzanie odpowiedzi: {ok, typo, note} */
function checkAnswer(input, expected, lang) {
  const norm = lang === 'ru' ? normRu : normPl;
  const a = norm(input);
  if (!a) return { ok: false };
  const list = lang === 'ru' ? [expected] : plVariants(expected);
  for (const e of list) {
    const b = lang === 'ru' ? norm(e) : e;
    if (a === b || a.replace(/ /g, '') === b.replace(/ /g, '')) return { ok: true };
  }
  if (lang === 'pl') for (const e of list) if (deburr(a) === deburr(e)) return { ok: true, note: 'Uwaga na polskie znaki' };
  for (const e of list) {
    const b = lang === 'ru' ? norm(e) : e;
    const d = lev(a, b);
    if ((b.length >= 5 && d <= 1) || (b.length >= 10 && d <= 2)) return { ok: true, typo: true, note: 'Literówka — sprawdź pisownię' };
  }
  return { ok: false };
}

/* ---------- transkrypcja polska i przybliżona wymowa ---------- */
const IOT = { е: 'e', ё: 'o', ю: 'u', я: 'a' };
const CONS = { б: 'b', в: 'w', г: 'g', д: 'd', ж: 'ż', з: 'z', й: 'j', к: 'k', м: 'm', н: 'n', п: 'p', р: 'r', с: 's', т: 't', ф: 'f', х: 'ch', ц: 'c', ч: 'cz', ш: 'sz', щ: 'szcz' };
const SOFT = { н: 'ń', с: 'ś', з: 'ź', т: 'ć', д: 'dź' };
const CLITICS = new Set(['в', 'во', 'на', 'не', 'ни', 'по', 'до', 'за', 'от', 'ото', 'из', 'изо', 'у', 'о', 'об', 'обо', 'и', 'а', 'но', 'же', 'ли', 'бы', 'с', 'со', 'к', 'ко', 'без', 'для', 'под', 'над', 'про', 'при', 'то']);
const PHON_EXC = { что: 'што', чтобы: 'штобы', конечно: 'конешно', скучно: 'скушно', скучный: 'скушный', нарочно: 'нарошно', сегодня: 'севодня', сегодняшний: 'севодняшний' };
const NO_OGO = new Set(['много', 'немного', 'дорого', 'недорого', 'строго', 'убого']);
const DEV = { б: 'п', в: 'ф', г: 'к', д: 'т', ж: 'ш', з: 'с' };
const VOI = { п: 'б', ф: 'в', к: 'г', т: 'д', ш: 'ж', с: 'з' };
const OBS_VOICED = 'бгджз', OBS_VOICELESS = 'пфктшсхцчщ';

function toLetters(word, autoMono = true) {
  const L = [];
  for (const ch of word) {
    if (ch === ACC || ch === "'") { if (L.length) L[L.length - 1].st = true; continue; }
    const lo = ch.toLowerCase();
    L.push({ c: lo, up: ch !== lo, st: lo === 'ё' });
  }
  if (autoMono && !L.some(l => l.st)) {
    const vs = L.filter(l => RU_V.includes(l.c));
    if (vs.length === 1) vs[0].st = true;
  }
  return L;
}

function lettersToPl(L, mark) {
  let s = '';
  const isL = x => x && /[а-яё]/.test(x);
  for (let i = 0; i < L.length; i++) {
    const { c, st } = L[i], p = L[i - 1]?.c, n = L[i + 1]?.c;
    let pre = '', v = null;
    if (c in IOT) {
      v = IOT[c];
      if (!isL(p) || RU_V.includes(p) || p === 'ъ' || p === 'ь') pre = 'j';
      else if (p === 'л' || 'жшчщц'.includes(p)) pre = '';
      else pre = 'i';
    } else if (c === 'и') {
      v = (p && 'жшц'.includes(p)) ? 'y' : 'i';
      if (p === 'ь') pre = 'j';
    } else if (RU_V.includes(c)) {
      v = { а: 'a', о: 'o', у: 'u', ы: 'y', э: 'e' }[c];
    } else if (c === 'л') {
      s += (n && 'еёиюяь'.includes(n)) ? 'l' : 'ł'; continue;
    } else if (c === 'ь') {
      if (!(n && RU_V.includes(n)) && SOFT[p] && s.endsWith(CONS[p])) s = s.slice(0, -CONS[p].length) + SOFT[p];
      continue;
    } else if (c === 'ъ') continue;
    else { s += CONS[c] || c; continue; }
    s += pre + (mark && st ? `{${v}}` : v);
  }
  if (L[0]?.up) s = s.charAt(0) === '{' ? s : s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function phoneticWord(word) {
  const plainW = plainRu(word);
  const clitic = CLITICS.has(plainW) && !/['́]/.test(word);
  let L = toLetters(word, !clitic);
  if (PHON_EXC[plainW]) { const rep = PHON_EXC[plainW]; L.forEach((l, i) => { l.c = rep[i] ?? l.c; }); }
  const joined = () => L.map(l => l.c).join('');
  const splice = (from, len, txt) => L.splice(from, len, ...[...txt].map(c => ({ c, up: false, st: false })));
  for (const [a, b] of [['вств', 'ств'], ['стн', 'сн'], ['здн', 'зн'], ['лнц', 'нц'], ['рдц', 'рц'], ['стл', 'сл'], ['сч', 'щ'], ['зч', 'щ'], ['гк', 'хк']]) {
    let i; while ((i = joined().indexOf(a)) >= 0) splice(i, a.length, b);
  }
  let j = joined();
  if (/ться$/.test(j)) splice(j.length - 4, 4, 'ца'); else if (/тся$/.test(j)) splice(j.length - 3, 3, 'ца');
  j = joined();
  if (/[оеё]го$/.test(j) && L.length >= 3 && !NO_OGO.has(j.replace(/ё/g, 'е'))) L[L.length - 2].c = 'в';
  const stressed = L.some(l => l.st);
  if (stressed || clitic) {
    for (let i = 0; i < L.length; i++) {
      const l = L[i];
      if (!RU_V.includes(l.c) || l.st) continue;
      const p = L[i - 1]?.c, final = i === L.length - 1;
      const pCons = p && /[бвгджзйклмнпрстфхцчшщ]/.test(p);
      if (l.c === 'о') l.c = 'а';
      else if (l.c === 'е' || l.c === 'я') {
        if (l.c === 'е' && p && 'жшц'.includes(p)) { if (!final) l.c = 'ы'; }
        else if (!final) { l.c = 'и'; if (!pCons) { L.splice(i, 0, { c: 'й', up: l.up, st: false }); l.up = false; i++; } }
      } else if (l.c === 'а' && p && 'чщ'.includes(p) && !final) l.c = 'и';
    }
  }
  for (let i = L.length - 1; i >= 0; i--) {
    const c = L[i].c;
    if (!(c in DEV) && !(c in VOI)) continue;
    let k = i + 1; while (k < L.length && L[k].c === 'ь') k++;
    const n = L[k]?.c;
    if (n === undefined) { if (c in DEV) L[i].c = DEV[c]; }
    else if (c in DEV && OBS_VOICELESS.includes(n)) L[i].c = DEV[c];
    else if (c in VOI && OBS_VOICED.includes(n)) L[i].c = VOI[c];
  }
  return lettersToPl(L, true);
}

/* przybliżona wymowa całego tekstu: „{a}” = samogłoska akcentowana */
function phonetic(text) {
  return String(text || '').split(/([^а-яёА-ЯЁ́']+)/).map(part => isCyr(part) ? phoneticWord(part) : part).join('').toLowerCase();
}
const phonHtml = text => esc(phonetic(text)).replace(/\{(.+?)\}/g, '<b>$1</b>');

/* ---------- biblioteka ---------- */
const LIB = { cats: [], catMap: {}, words: new Map(), byPlain: new Map(), levels: ['A1', 'A2', 'B1', 'B2', 'PL'] };
const LEVEL_NAMES = { A1: 'A1 · początkujący', A2: 'A2 · podstawowy', B1: 'B1 · średni', B2: 'B2 · wyższy średni', PL: 'Pułapki dla Polaków' };

function buildLibrary() {
  const refs = [];
  for (const raw of (window.LIB || [])) {
    const cat = { id: raw.id, name: raw.name, ru: raw.ru, level: raw.level, pos: raw.pos, ids: [] };
    LIB.cats.push(cat); LIB.catMap[cat.id] = cat;
    for (const line of raw.words.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      if (t[0] === '@') { refs.push([cat, t.slice(1)]); continue; }
      const [ru, pl, note = '', ex = '', exPl = ''] = t.split('|');
      const key = plainRu(ru);
      const id = `${raw.id}:${key}`;
      const w = { id, ru: stressify(ru), pl, note: stressify(note), ex: stressify(ex), exPl, cat: raw.id, pos: raw.pos, level: raw.level };
      LIB.words.set(id, w);
      if (!LIB.byPlain.has(key)) LIB.byPlain.set(key, id);
      cat.ids.push(id);
    }
  }
  for (const [cat, ru] of refs) { const id = LIB.byPlain.get(plainRu(ru)); if (id) cat.ids.push(id); }
  LIB.size = LIB.words.size;
}

const getWord = id => LIB.words.get(id) || (S.custom[id] ? customWord(S.custom[id]) : null);
const customWord = c => ({ ...c, custom: true, pos: c.pos || 'mixed', level: '★' });
function allWordIds() { return [...LIB.words.keys(), ...Object.keys(S.custom)]; }
function wordCatName(w) { if (w.custom) { const d = S.decks.find(d => d.ids.includes(w.id)); return d ? d.name : 'Moje fiszki'; } return LIB.catMap[w.cat]?.name || ''; }

function searchWords(q, limit = 60) {
  const raw = q.trim().toLowerCase();
  if (!raw) return [];
  const qr = normRu(raw), qp = deburr(normPl(raw));
  const res = [];
  for (const id of allWordIds()) {
    const w = getWord(id);
    if (!w) continue;
    const r = normRu(w.ru), p = deburr(normPl(w.pl));
    let score = 0;
    if (isCyr(raw)) { if (r === qr) score = 100; else if (r.startsWith(qr)) score = 60; else if (r.includes(qr)) score = 30; }
    else {
      if (plVariants(w.pl).some(v => deburr(v) === qp)) score = 100;
      else if (p.startsWith(qp)) score = 60;
      else if (p.includes(qp)) score = 30;
      else if (deburr(phonetic(w.ru).replace(/[{}]/g, '')).includes(qp) && qp.length > 2) score = 15;
    }
    if (score) res.push([score - (w.custom ? 0 : 1) - r.length / 100, id]);
  }
  return res.sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1]);
}

/* ---------- stan i zapis ---------- */
const STORE_KEY = 'privet-ru-v1';
const DEFAULT_SETTINGS = { goal: 30, newPerDay: 10, decksFirst: true, autoplay: true, rate: 0.85, voice: '', phon: true, keyboard: 'builtin', sounds: true, theme: 'auto', flashDir: 'ru-pl' };
function defaultState() {
  return {
    v: 1, created: Date.now(), cards: {}, fav: {}, decks: [], custom: {}, days: {},
    streak: { cur: 0, best: 0, last: null, freezes: 0 }, xp: 0, ach: {},
    stats: { lessons: 0, perfect: 0, sprintBest: 0, matchBest: 0, abcPerfect: 0, sessions: 0 },
    plan: { focus: null, skip: {} }, settings: { ...DEFAULT_SETTINGS }, seenIntro: false
  };
}
let S = defaultState();
let storageOk = true;
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) S = migrate(JSON.parse(raw));
  } catch (e) { storageOk = false; }
  try { navigator.storage?.persist?.(); } catch (e) { /* brak wsparcia */ }
}
function migrate(s) {
  const d = defaultState();
  for (const k of Object.keys(d)) if (s[k] === undefined) s[k] = d[k];
  s.settings = { ...DEFAULT_SETTINGS, ...s.settings };
  s.stats = { ...d.stats, ...s.stats };
  s.plan = { ...d.plan, ...s.plan };
  s.streak = { ...d.streak, ...s.streak };
  return s;
}
let saveTimer = 0;
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 250); }
function saveNow() {
  clearTimeout(saveTimer);
  try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); storageOk = true; }
  catch (e) { storageOk = false; }
}
window.addEventListener('pagehide', saveNow);
document.addEventListener('visibilitychange', () => { if (document.hidden) saveNow(); });

/* ---------- dni, XP, seria ---------- */
const bus = new EventTarget();
const emit = (type, detail) => bus.dispatchEvent(new CustomEvent(type, { detail }));
function today() { const k = dayKey(); return S.days[k] || (S.days[k] = { xp: 0, rev: 0, nw: 0, ok: 0, bad: 0, ms: 0 }); }
function addXP(n) {
  if (n <= 0) return;
  const d = today();
  d.xp += n; S.xp += n;
  if (!d.goal && d.xp >= S.settings.goal) { d.goal = true; goalReached(); }
  save();
  emit('xp', n);
}
function goalReached() {
  const k = dayKey(), st = S.streak;
  if (st.last === k) return;
  st.cur = st.last === addDays(k, -1) ? st.cur + 1 : 1;
  st.last = k;
  st.best = Math.max(st.best, st.cur);
  if (st.cur % 7 === 0 && st.freezes < 2) { st.freezes++; emit('freeze-earned'); }
  emit('goal', st.cur);
}
/* przy starcie: brakujące dni pokrywa zamrożenie albo seria się zeruje */
function checkStreak() {
  const st = S.streak;
  if (!st.last || !st.cur) return null;
  const gap = daysBetween(st.last, dayKey());
  if (gap <= 1) return null;
  const missed = gap - 1;
  if (st.freezes >= missed) {
    st.freezes -= missed;
    for (let i = 1; i <= missed; i++) { const dk = addDays(st.last, i); (S.days[dk] ||= { xp: 0, rev: 0, nw: 0, ok: 0, bad: 0, ms: 0 }).frozen = true; }
    st.last = addDays(dayKey(), -1);
    save();
    return { saved: missed };
  }
  const lost = st.cur;
  st.cur = 0;
  save();
  return { lost };
}
function streakState() {
  const st = S.streak, k = dayKey();
  if (st.last === k) return { n: st.cur, today: true };
  if (st.last === addDays(k, -1)) return { n: st.cur, today: false, atRisk: true };
  return { n: 0, today: false };
}
function levelInfo(xp = S.xp) {
  const lvl = Math.floor((1 + Math.sqrt(1 + 4 * xp / 25)) / 2);
  const base = 25 * lvl * (lvl - 1), next = 25 * (lvl + 1) * lvl;
  return { lvl, into: xp - base, need: next - base, pct: (xp - base) / (next - base) };
}

/* ---------- SRS (SM-2 z krokami nauki) ---------- */
const LEARN_STEPS = [1, 10], RELEARN_STEP = 10;
const newCard = () => ({ s: 0, step: 0, due: 0, ivl: 0, ease: 2.5, reps: 0, lapses: 0, ok: 0, bad: 0, added: Date.now(), last: 0 });
const ensureCard = id => S.cards[id] || (S.cards[id] = newCard());
const isNewId = id => !S.cards[id] || S.cards[id].s === 0;
const isDue = (c, now = Date.now()) => !!c && c.s > 0 && c.due <= now;
function graduate(c, ivl, now) { c.s = 2; c.step = 0; c.ivl = ivl; c.due = dayStart(now) + ivl * DAY; }
function fuzz(ivl) { if (ivl < 4) return ivl; const f = Math.max(1, Math.round(ivl * 0.05)); return ivl + rand(2 * f + 1) - f; }

/* r: 1 nie pamiętam, 2 trudne, 3 dobrze, 4 łatwe */
function schedule(card, r, now = Date.now(), preview = false) {
  const c = { ...card };
  c.reps++; c.last = now;
  if (c.s <= 1) {
    c.s = 1;
    if (r === 1) { c.step = 0; c.due = now + LEARN_STEPS[0] * MIN; }
    else if (r === 2) c.due = now + (c.step === 0 ? 6 : LEARN_STEPS[Math.min(c.step, LEARN_STEPS.length - 1)]) * MIN;
    else if (r === 3) { c.step++; if (c.step >= LEARN_STEPS.length) graduate(c, 1, now); else c.due = now + LEARN_STEPS[c.step] * MIN; }
    else graduate(c, 4, now);
  } else if (c.s === 2) {
    if (r === 1) { c.lapses++; c.ease = Math.max(1.3, c.ease - 0.2); c.s = 3; c.step = 0; c.ivl = Math.max(1, Math.round(c.ivl * 0.3)); c.due = now + RELEARN_STEP * MIN; }
    else {
      let ivl;
      if (r === 2) { ivl = Math.max(c.ivl + 1, c.ivl * 1.2); c.ease = Math.max(1.3, c.ease - 0.15); }
      else if (r === 3) ivl = Math.max(c.ivl + 1, c.ivl * c.ease);
      else { ivl = Math.max(c.ivl + 2, c.ivl * c.ease * 1.3); c.ease += 0.15; }
      ivl = Math.round(ivl);
      c.ivl = Math.min(3650, preview ? ivl : fuzz(ivl));
      c.due = dayStart(now) + c.ivl * DAY;
    }
  } else {
    if (r <= 2) c.due = now + RELEARN_STEP * MIN;
    else { c.s = 2; if (r === 4) c.ivl += 1; c.due = dayStart(now) + c.ivl * DAY; }
  }
  return c;
}
function rate(id, r) {
  const now = Date.now();
  const before = ensureCard(id);
  if (before.s === 0) today().nw++;
  const c = schedule(before, r, now);
  if (r > 1) c.ok++; else c.bad++;
  S.cards[id] = c;
  const d = today(); d.rev++; r > 1 ? d.ok++ : d.bad++;
  save();
  return c;
}
function introduce(id) {
  const c = ensureCard(id);
  if (c.s === 0) { c.s = 1; c.step = 0; c.due = Date.now(); today().nw++; save(); }
}
function markKnown(id) {
  const c = ensureCard(id);
  if (c.s === 0) today().nw++;
  Object.assign(c, { s: 2, ivl: 60, step: 0, due: dayStart() + 60 * DAY, known: true });
  save();
}
function resetCard(id) { delete S.cards[id]; save(); }

/* stopień opanowania 0–4 */
function mastery(id) {
  const c = S.cards[id];
  if (!c || c.s === 0) return 0;
  if (c.s === 1 || c.s === 3) return 1;
  if (c.ivl < 7) return 2;
  if (c.ivl < 21) return 3;
  return 4;
}
const MASTERY_LABEL = ['Nowe', 'W nauce', 'Utrwalane', 'Dobrze znane', 'Opanowane'];
function countWhere(fn) { let n = 0; for (const id in S.cards) if (fn(S.cards[id], id)) n++; return n; }
const learnedCount = () => countWhere(c => c.s >= 2);
const masteredCount = () => countWhere(c => c.s === 2 && c.ivl >= 21);
const inProgressCount = () => countWhere(c => c.s === 1 || c.s === 3);

function dueIds(now = Date.now(), only = null) {
  const learn = [], rev = [];
  for (const id in S.cards) {
    const c = S.cards[id];
    if (!isDue(c, now) || (only && !only.has(id)) || !getWord(id)) continue;
    (c.s === 2 ? rev : learn).push(id);
  }
  learn.sort((a, b) => S.cards[a].due - S.cards[b].due);
  rev.sort((a, b) => S.cards[a].due - S.cards[b].due);
  return [...learn, ...rev];
}
const newLeftToday = () => Math.max(0, S.settings.newPerDay - today().nw);

/* ---------- źródła słów ---------- */
function pathCats() { return LIB.cats.filter(c => !S.plan.skip[c.id]); }
function currentPathCat() {
  if (S.plan.focus && LIB.catMap[S.plan.focus] && LIB.catMap[S.plan.focus].ids.some(isNewId)) return LIB.catMap[S.plan.focus];
  return pathCats().find(c => c.ids.some(isNewId)) || null;
}
function nextNewWords(n, focus) {
  const out = [];
  const add = ids => { for (const id of ids) { if (out.length >= n) return; if (!out.includes(id) && isNewId(id) && getWord(id)) out.push(id); } };
  if (focus) add(sourceIds(focus));
  if (S.settings.decksFirst) for (const d of S.decks) add(d.ids);
  if (S.plan.focus && LIB.catMap[S.plan.focus]) add(LIB.catMap[S.plan.focus].ids);
  for (const c of pathCats()) { if (out.length >= n) break; add(c.ids); }
  return out;
}
function weakness(id) {
  const c = S.cards[id];
  if (!c) return 0;
  const tot = c.ok + c.bad;
  return (tot ? c.bad / tot : 0) * 3 + c.lapses + (c.s === 2 ? 1 / Math.max(1, c.ivl) : 1.5) + (isDue(c) ? 2 : 0);
}
function sourceIds(src) {
  if (!src) return [];
  switch (src.t) {
    case 'cat': return LIB.catMap[src.id]?.ids || [];
    case 'deck': return (S.decks.find(d => d.id === src.id)?.ids || []).filter(getWord);
    case 'fav': return Object.keys(S.fav).filter(getWord);
    case 'learning': return Object.keys(S.cards).filter(id => S.cards[id].s > 0 && getWord(id));
    case 'weak': return Object.keys(S.cards).filter(id => S.cards[id].s > 0 && getWord(id)).sort((a, b) => weakness(b) - weakness(a)).slice(0, 40);
    case 'level': return LIB.cats.filter(c => c.level === src.id).flatMap(c => c.ids);
    case 'ids': return (src.ids || []).filter(getWord);
    default: return [];
  }
}
function sourceLabel(src) {
  switch (src?.t) {
    case 'cat': return LIB.catMap[src.id]?.name || 'Kategoria';
    case 'deck': return S.decks.find(d => d.id === src.id)?.name || 'Talia';
    case 'fav': return 'Ulubione';
    case 'learning': return 'Wszystkie moje słowa';
    case 'weak': return 'Najtrudniejsze słowa';
    case 'level': return `Poziom ${src.id}`;
    case 'ids': return src.ids?.length === 1 ? (getWord(src.ids[0])?.pl || 'Słowo') : 'Wybrane słowa';
    default: return '—';
  }
}

/* ---------- osiągnięcia ---------- */
const ACH = [
  { id: 'first', icon: 'spark', name: 'Pierwszy krok', desc: 'Ukończ pierwszą lekcję', test: () => S.stats.lessons >= 1 },
  { id: 'w10', icon: 'book', name: '10 słów', desc: 'Naucz się 10 słów', test: () => learnedCount() >= 10 },
  { id: 'w50', icon: 'book', name: '50 słów', desc: 'Naucz się 50 słów', test: () => learnedCount() >= 50 },
  { id: 'w100', icon: 'book', name: '100 słów', desc: 'Naucz się 100 słów', test: () => learnedCount() >= 100 },
  { id: 'w250', icon: 'book', name: '250 słów', desc: 'Naucz się 250 słów', test: () => learnedCount() >= 250 },
  { id: 'w500', icon: 'book', name: '500 słów', desc: 'Naucz się 500 słów', test: () => learnedCount() >= 500 },
  { id: 'w1000', icon: 'book', name: '1000 słów', desc: 'Naucz się 1000 słów', test: () => learnedCount() >= 1000 },
  { id: 'm50', icon: 'crown', name: 'Pamięć długotrwała', desc: 'Opanuj 50 słów (powtórka co 3+ tygodnie)', test: () => masteredCount() >= 50 },
  { id: 's3', icon: 'flame', name: 'Rozgrzewka', desc: 'Seria 3 dni', test: () => S.streak.best >= 3 },
  { id: 's7', icon: 'flame', name: 'Tydzień', desc: 'Seria 7 dni', test: () => S.streak.best >= 7 },
  { id: 's30', icon: 'flame', name: 'Miesiąc', desc: 'Seria 30 dni', test: () => S.streak.best >= 30 },
  { id: 's100', icon: 'flame', name: 'Sto dni', desc: 'Seria 100 dni', test: () => S.streak.best >= 100 },
  { id: 'xp1k', icon: 'bolt', name: '1000 XP', desc: 'Zdobądź łącznie 1000 XP', test: () => S.xp >= 1000 },
  { id: 'xp5k', icon: 'bolt', name: '5000 XP', desc: 'Zdobądź łącznie 5000 XP', test: () => S.xp >= 5000 },
  { id: 'perfect', icon: 'star', name: 'Bez błędu', desc: 'Ukończ lekcję bez pomyłki', test: () => S.stats.perfect >= 1 },
  { id: 'creator', icon: 'plus', name: 'Twórca', desc: 'Dodaj 10 własnych fiszek', test: () => Object.keys(S.custom).length >= 10 },
  { id: 'sprint', icon: 'timer', name: 'Błyskawica', desc: 'Zdobądź 20 punktów w sprincie', test: () => S.stats.sprintBest >= 20 },
  { id: 'match', icon: 'grid', name: 'Refleks', desc: 'Ułóż wszystkie pary w mniej niż 40 s', test: () => S.stats.matchBest > 0 && S.stats.matchBest < 40000 },
  { id: 'abc', icon: 'abc', name: 'Cyrylica', desc: 'Quiz alfabetu bez błędu', test: () => S.stats.abcPerfect >= 1 },
  { id: 'cat', icon: 'trophy', name: 'Kategoria zaliczona', desc: 'Naucz się wszystkich słów z jednej kategorii', test: () => LIB.cats.some(c => c.ids.length && c.ids.every(id => S.cards[id]?.s >= 2)) }
];
function checkAchievements() {
  const fresh = [];
  for (const a of ACH) if (!S.ach[a.id] && a.test()) { S.ach[a.id] = Date.now(); fresh.push(a); }
  if (fresh.length) { save(); fresh.forEach(a => emit('achievement', a)); }
  return fresh;
}

/* ---------- mowa (TTS) ---------- */
const Speech = {
  ok: 'speechSynthesis' in window,
  voices: [], voice: null,
  init() {
    if (!this.ok) return;
    const load = () => {
      this.voices = speechSynthesis.getVoices().filter(v => /^ru/i.test(v.lang));
      this.pick();
    };
    load();
    try { speechSynthesis.addEventListener('voiceschanged', load); } catch (e) { speechSynthesis.onvoiceschanged = load; }
  },
  pick() {
    const pref = S.settings.voice;
    this.voice = this.voices.find(v => v.voiceURI === pref)
      || this.voices.find(v => /milena|katya|yuri|google/i.test(v.name))
      || this.voices[0] || null;
  },
  speak(text, slow = false) {
    if (!this.ok || !text) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(stripAcc(text).replace(/[…«»]/g, ''));
      u.lang = 'ru-RU';
      if (this.voice) u.voice = this.voice;
      u.rate = slow ? Math.max(0.4, S.settings.rate * 0.6) : S.settings.rate;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
};

/* ---------- efekty dźwiękowe (WebAudio, bez plików) ---------- */
const Sfx = {
  ctx: null,
  get() {
    if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  tone(f, t, d, type = 'sine', vol = 0.12) {
    const c = this.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + d + 0.05);
  },
  play(name) {
    if (!S.settings.sounds) return;
    const c = this.get(); if (!c) return;
    const t = c.currentTime + 0.01;
    if (name === 'ok') { this.tone(659.3, t, 0.12); this.tone(987.8, t + 0.08, 0.22); }
    else if (name === 'bad') { this.tone(220, t, 0.16, 'triangle', 0.14); this.tone(174.6, t + 0.12, 0.24, 'triangle', 0.14); }
    else if (name === 'done') [523.3, 659.3, 784, 1046.5].forEach((f, i) => this.tone(f, t + i * 0.1, 0.3));
    else if (name === 'pair') this.tone(880, t, 0.1, 'sine', 0.08);
    else if (name === 'flip') this.tone(520, t, 0.06, 'sine', 0.05);
  }
};
