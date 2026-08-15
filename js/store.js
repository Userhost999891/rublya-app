(function () {
/* ============================================================
   STAN — źródłem prawdy jest baza na serwerze

   W przeglądarce trzymamy tylko kopię roboczą bieżącej sesji.
   Nic nie ląduje w localStorage: po zalogowaniu stan przychodzi
   z serwera, a każda zmiana wraca do bazy przez API (zapis jest
   sklejany i opóźniony, patrz js/api.js).
   ============================================================ */

const DEFAULTS = {
  v: 1,
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: null,
  days: {},
  dailyGoal: 30,
  srs: {},
  mod: {},
  drill: {},
  exams: {},
  goals: {},
  refs: {},
  badges: {},
  notes: [],
  stats: { answered: 0, correct: 0, typed: 0, reviews: 0, bestCombo: 0, sessions: 0 },
  /* theme: null znaczy „jak w systemie" — dopiero świadome kliknięcie
     przełącznika zapisuje 'light' albo 'dark' na stałe. */
  settings: { tts: true, autoSpeak: false, voice: null, accent: null, theme: null },

  /* rozszerzenia: waluta, ekwipunek, zadania dnia, nowe tryby */
  coins: 0,
  inv: {},
  perks: {},
  quests: {},
  dstat: {},
  topics: {},
  kb: { chars: 0, errors: 0, bestCpm: 0, lessons: {} },
  sent: { done: 0, ok: 0, lvl: {} },
  reading: { texts: 0, added: 0, custom: [] },
  trans: { done: 0, ok: 0, near: 0, dir: {}, lvl: {} },
};

/* Do czasu zalogowania pracujemy na czystych domyślnych — żaden
   widok nie zdąży ich zobaczyć, bo aplikacja startuje dopiero po
   wczytaniu stanu z serwera. */
let S = structuredClone(DEFAULTS);

/* Scalamy z domyślnymi, żeby zapis ze starszej wersji nie gubił nowych pól */
function merge(parsed) {
  return Object.assign(structuredClone(DEFAULTS), parsed, {
    stats: Object.assign({}, DEFAULTS.stats, parsed.stats || {}),
    settings: Object.assign({}, DEFAULTS.settings, parsed.settings || {}),
    kb: Object.assign({}, DEFAULTS.kb, parsed.kb || {}),
    sent: Object.assign({}, DEFAULTS.sent, parsed.sent || {}),
    reading: Object.assign({}, DEFAULTS.reading, parsed.reading || {}),
    trans: Object.assign({}, DEFAULTS.trans, parsed.trans || {}),
  });
}

/* Wywoływane raz, przez Auth, zaraz po pobraniu stanu z bazy.
   `dane` równe null znaczy: świeże konto, nic jeszcze nie zapisano. */
function hydrate(dane) {
  S = dane ? merge(dane) : structuredClone(DEFAULTS);
}

function save() {
  API.saveState(S);
}

/* ------------------------------------------------------------
   Czas i passa
   ------------------------------------------------------------ */

const DAY = 86400000;

function today() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function dayKey(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}

function touchDay() {
  const t = today();
  if (S.lastDay === t) return;
  const yesterday = dayKey(new Date(Date.now() - DAY));
  S.streak = S.lastDay === yesterday ? S.streak + 1 : 1;
  S.bestStreak = Math.max(S.bestStreak, S.streak);
  S.lastDay = t;
}

function streakAlive() {
  if (!S.lastDay) return false;
  return S.lastDay === today() || S.lastDay === dayKey(new Date(Date.now() - DAY));
}

function todayCount() {
  return S.days[today()] || 0;
}

function dailyDone() {
  return todayCount() >= S.dailyGoal;
}

/* ------------------------------------------------------------
   Poziomy — rangi po rosyjsku
   ------------------------------------------------------------ */

const RANKS = [
  'Новичок', 'Ученик', 'Читатель', 'Собеседник', 'Знаток',
  'Мастер', 'Виртуоз', 'Профессор', 'Легенда', 'Носитель',
];

function levelCost(l) { return 120 + (l - 1) * 55; }

function levelInfo(xp) {
  let lvl = 1, rest = xp, need = levelCost(1);
  while (rest >= need) { rest -= need; lvl++; need = levelCost(lvl); }
  return {
    lvl,
    rest,
    need,
    pct: Math.round((rest / need) * 100),
    rank: RANKS[Math.min(lvl - 1, RANKS.length - 1)],
  };
}

function addXp(n) {
  const before = levelInfo(S.xp).lvl;
  S.xp += n;
  const after = levelInfo(S.xp);
  if (after.lvl > before) UI.levelUp(after);
  return after;
}

/* ------------------------------------------------------------
   Powtórki rozłożone w czasie
   Pudełka 0–5. Odstępy w dniach; pudełko 0 wraca po 10 minutach.
   Słowo uznajemy za „w pamięci”, gdy siedzi w pudełku 2 lub wyżej.
   ------------------------------------------------------------ */

const GAPS = [0.007, 1, 3, 7, 16, 40];
const KNOWN_BOX = 2;

function card(id) {
  if (!S.srs[id]) S.srs[id] = { b: 0, d: 0, s: 0, w: 0 };
  return S.srs[id];
}

function known(id) {
  const c = S.srs[id];
  return !!c && c.b >= KNOWN_BOX;
}

/* grade: 0 = nie znam, 1 = z trudem, 2 = dobrze, 3 = od ręki */
function grade(id, g) {
  const c = card(id);
  const firstTime = c.s === 0;
  c.s++;
  bump('rev');
  if (firstTime) bump('neu');
  if (g === 0) { c.w++; c.b = 0; }
  else if (g === 1) c.b = Math.max(0, c.b - 1);
  else if (g === 2) c.b = Math.min(5, c.b + 1);
  else c.b = Math.min(5, c.b + 2);
  c.d = Date.now() + GAPS[c.b] * DAY;
  S.stats.reviews++;
  return c;
}

function dueCards() {
  const now = Date.now();
  return Object.keys(S.srs).filter((id) => S.srs[id].d <= now && S.srs[id].s > 0);
}

function dueCount() {
  return dueCards().length;
}

function knownCount(catId) {
  let n = 0;
  for (const w of WORDS) {
    if (catId && w.cat !== catId) continue;
    if (known(w.id)) n++;
  }
  return n;
}

function seenCount(catId) {
  let n = 0;
  for (const w of WORDS) {
    if (catId && w.cat !== catId) continue;
    if (S.srs[w.id] && S.srs[w.id].s > 0) n++;
  }
  return n;
}

/* Słabe punkty — karty, które najczęściej wracają */
function weakWords(limit) {
  return Object.keys(S.srs)
    .filter((id) => S.srs[id].w > 0)
    .sort((a, b) => S.srs[b].w - S.srs[a].w || S.srs[a].b - S.srs[b].b)
    .slice(0, limit || 30)
    .map((id) => WORDS.find((w) => w.id === id))
    .filter(Boolean);
}

/* ------------------------------------------------------------
   Rejestrowanie odpowiedzi
   ------------------------------------------------------------ */

function logAnswer(ok) {
  touchDay();
  const t = today();
  S.days[t] = (S.days[t] || 0) + 1;
  S.stats.answered++;
  if (ok) S.stats.correct++;
}

/* ------------------------------------------------------------
   Moduły gramatyczne
   ------------------------------------------------------------ */

function modState(id) {
  if (!S.mod[id]) S.mod[id] = { sec: {}, };
  return S.mod[id];
}

function secDone(modId, i) {
  const m = S.mod[modId];
  return !!(m && m.sec && m.sec[i] != null);
}

function modSectionsDone(modId) {
  const m = S.mod[modId];
  if (!m || !m.sec) return 0;
  return Object.keys(m.sec).length;
}

function modComplete(modId) {
  const mod = MODULES.find((m) => m.id === modId);
  if (!mod) return false;
  return modSectionsDone(modId) >= mod.sections.length;
}

/* ------------------------------------------------------------
   Cele ścieżki
   ------------------------------------------------------------ */

function goalProgress(g) {
  switch (g.type) {
    case 'ref':
      return { now: S.refs[g.ref] ? 1 : 0, max: 1 };
    case 'module': {
      const mod = MODULES.find((m) => m.id === g.ref);
      if (!mod) return { now: 0, max: 1 };
      if (g.sec === 'all') return { now: modSectionsDone(g.ref), max: mod.sections.length };
      return { now: secDone(g.ref, g.sec) ? 1 : 0, max: 1 };
    }
    case 'vocab':
      return { now: Math.min(knownCount(g.ref), g.n), max: g.n };
    case 'drill':
      return { now: Math.min(S.drill[g.ref] || 0, g.n), max: g.n };
    case 'review':
      return { now: Math.min(S.stats.reviews, g.n), max: g.n };
    case 'exam': {
      const e = S.exams[g.ref];
      const pct = e ? Math.round((e.best / e.total) * 100) : 0;
      return { now: Math.min(pct, g.min), max: g.min, pct: true };
    }
    default:
      return { now: 0, max: 1 };
  }
}

function goalDone(g) {
  if (S.goals[g.id]) return true;
  const p = goalProgress(g);
  return p.now >= p.max;
}

function allGoals() {
  const out = [];
  PATH.forEach((ch) => ch.goals.forEach((g) => out.push({ ch, g })));
  return out;
}

/* Pierwszy niezamknięty cel — serce nawigacji „co teraz” */
function nextGoal() {
  for (const item of allGoals()) {
    if (!goalDone(item.g)) return item;
  }
  return null;
}

function goalUnlocked(goalId) {
  for (const item of allGoals()) {
    if (item.g.id === goalId) return true;
    if (!goalDone(item.g)) return false;
  }
  return false;
}

/* Domknięcie celów: przyznaje XP raz, przy pierwszym spełnieniu warunku */
function sweepGoals() {
  let gained = 0;
  const closed = [];
  for (const { g } of allGoals()) {
    if (S.goals[g.id]) continue;
    const p = goalProgress(g);
    if (p.now >= p.max) {
      S.goals[g.id] = Date.now();
      gained += g.xp;
      closed.push(g);
    }
  }
  if (gained) addXp(gained);
  return closed;
}

function pathProgress() {
  const all = allGoals();
  const done = all.filter(({ g }) => goalDone(g)).length;
  return { done, total: all.length, pct: Math.round((done / all.length) * 100) };
}

/* ------------------------------------------------------------
   Odznaki
   ------------------------------------------------------------ */

const BADGE_TESTS = {
  first:    () => Object.keys(S.goals).length >= 1,
  streak3:  () => S.bestStreak >= 3,
  streak7:  () => S.bestStreak >= 7,
  streak30: () => S.bestStreak >= 30,
  w100:     () => knownCount() >= 100,
  w300:     () => knownCount() >= 300,
  w600:     () => knownCount() >= 600,
  w1000:    () => knownCount() >= 1000,
  perfect:  () => !!S.flags_perfect,
  combo15:  () => S.stats.bestCombo >= 15,
  night:    () => !!S.flags_night,
  early:    () => !!S.flags_early,
  exam1:    () => { const e = S.exams.test; return !!e && e.best / e.total >= 0.7; },
  exam2:    () => { const e = S.exams.final; return !!e && e.best / e.total >= 0.8; },
  gram:     () => MODULES.every((m) => modComplete(m.id)),
  slangman: () => knownCount('slang') >= CATS.find((c) => c.id === 'slang').count,
  cheat:    () => REFS.every((r) => S.refs[r.id]),
  writer:   () => S.notes.length >= 10,
  typer:    () => S.stats.typed >= 50,
  path:     () => pathProgress().done === pathProgress().total,
  typist:   () => S.kb.bestCpm >= 80,
  blind:    () => KB_LESSONS.every((l) => S.kb.lessons[l.id]),
  builder:  () => S.sent.ok >= 50,
  reader:   () => S.reading.texts >= 10,
  rich:     () => S.coins >= 500,
  quester:  () => Object.keys(S.quests).length >= 15,
};

function sweepBadges() {
  const fresh = [];
  for (const b of BADGES) {
    if (S.badges[b.id]) continue;
    const test = BADGE_TESTS[b.id];
    if (test && test()) {
      S.badges[b.id] = Date.now();
      fresh.push(b);
    }
  }
  return fresh;
}

function markTimeFlags() {
  const h = new Date().getHours();
  if (h >= 0 && h < 5) S.flags_night = true;
  if (h >= 5 && h < 7) S.flags_early = true;
}

/* ------------------------------------------------------------
   Statystyki dnia — podstawa zadań pobocznych
   ------------------------------------------------------------ */

const EMPTY_DAY = { rev: 0, neu: 0, typed: 0, sent: 0, keys: 0, combo: 0, perfect: 0, gram: 0, read: 0, acc: 0 };

function dstat(day) {
  const k = day || today();
  if (!S.dstat[k]) S.dstat[k] = Object.assign({}, EMPTY_DAY);
  return S.dstat[k];
}

function bump(key, n) {
  const d = dstat();
  d[key] = (d[key] || 0) + (n == null ? 1 : n);
}

function raise(key, value) {
  const d = dstat();
  if (value > (d[key] || 0)) d[key] = value;
}

/* ------------------------------------------------------------
   Рубли — waluta za trafność
   ------------------------------------------------------------ */

function addCoins(n) {
  if (n <= 0) return 0;
  S.coins += n;
  return n;
}

function spendCoins(n) {
  if (S.coins < n) return false;
  S.coins -= n;
  return true;
}

/* Nagroda liczona tak, by opłacało się celować, a nie klikać */
function sessionReward(correct, total, bestCombo) {
  if (!total) return { coins: 0, parts: [] };
  const pct = Math.round((correct / total) * 100);
  const parts = [];
  let coins = correct;
  parts.push(['Trafione odpowiedzi', correct]);

  if (pct === 100 && total >= 8) { coins += 40; parts.push(['Sesja bez błędu', 40]); }
  else if (pct >= 90) { coins += 20; parts.push(['Trafność ponad 90%', 20]); }
  else if (pct >= 75) { coins += 8; parts.push(['Trafność ponad 75%', 8]); }

  const comboBonus = Math.floor(bestCombo / 5) * 4;
  if (comboBonus) { coins += comboBonus; parts.push(['Seria ×' + bestCombo, comboBonus]); }

  return { coins, parts, pct };
}

/* ------------------------------------------------------------
   Ekwipunek i ulepszenia
   ------------------------------------------------------------ */

function itemCount(id) { return S.inv[id] || 0; }
function hasPerk(id) { return !!S.perks[id]; }

function buy(id) {
  const item = SHOP.find((x) => x.id === id);
  if (!item) return { ok: false, why: 'Nie ma takiej pozycji' };
  if (item.kind === 'perk' && hasPerk(id)) return { ok: false, why: 'Masz już to na stałe' };
  if (item.kind === 'use' && itemCount(id) >= item.max) return { ok: false, why: 'Masz maksymalną liczbę' };
  if (!spendCoins(item.price)) return { ok: false, why: 'Za mało rubli' };
  if (item.kind === 'perk') S.perks[id] = Date.now();
  else S.inv[id] = itemCount(id) + 1;
  save();
  return { ok: true, item };
}

function useItem(id) {
  if (itemCount(id) <= 0) return false;
  S.inv[id] -= 1;
  save();
  return true;
}

/* ------------------------------------------------------------
   Zadania poboczne — trzy na dzień, losowane ziarnem z daty
   ------------------------------------------------------------ */

function seedFromDay(k) {
  let h = 2166136261;
  for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function dailyQuests() {
  const k = today();
  const pool = QUEST_POOL.slice();
  let seed = seedFromDay(k);
  const out = [];
  for (let i = 0; i < 3 && pool.length; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    out.push(pool.splice(seed % pool.length, 1)[0]);
  }
  return out;
}

function questProgress(q) {
  const d = dstat();
  const map = {
    answers: todayCount(),
    reviews: d.rev,
    newWords: d.neu,
    typed: d.typed,
    sentences: d.sent,
    combo: d.combo,
    keys: d.keys,
    reading: d.read,
    grammar: d.gram,
    accuracy: d.acc,
    perfect: d.perfect,
  };
  const now = map[q.type] || 0;
  return { now: Math.min(now, q.n), max: q.n, done: now >= q.n };
}

function questKey(q) { return today() + ':' + q.id; }

/* Wypłata następuje raz — przy pierwszym sprawdzeniu po spełnieniu warunku */
function sweepQuests() {
  const fresh = [];
  for (const q of dailyQuests()) {
    const key = questKey(q);
    if (S.quests[key]) continue;
    if (questProgress(q).done) {
      S.quests[key] = Date.now();
      addCoins(q.coin);
      addXp(q.xp);
      fresh.push(q);
    }
  }
  return fresh;
}

function questClaimed(q) { return !!S.quests[questKey(q)]; }

/* ------------------------------------------------------------
   Diagnoza — które tematy gubią najczęściej
   ------------------------------------------------------------ */

function noteTopic(cat, ok) {
  if (!cat) return;
  if (!S.topics[cat]) S.topics[cat] = { n: 0, bad: 0 };
  S.topics[cat].n++;
  if (!ok) S.topics[cat].bad++;
}

function weakTopics(min) {
  const floor = min == null ? 4 : min;
  return Object.keys(S.topics)
    .map((cat) => {
      const t = S.topics[cat];
      return { cat, n: t.n, bad: t.bad, rate: t.n ? t.bad / t.n : 0 };
    })
    .filter((t) => t.n >= floor && t.rate > 0.2)
    .sort((a, b) => b.rate - a.rate || b.bad - a.bad);
}

/* ------------------------------------------------------------
   Passa z uwzględnieniem zamrożenia
   ------------------------------------------------------------ */

function applyFreeze() {
  if (!S.lastDay || S.lastDay === today()) return false;
  const yesterday = dayKey(new Date(Date.now() - DAY));
  if (S.lastDay === yesterday) return false;
  if (itemCount('freeze') <= 0) return false;
  const twoAgo = dayKey(new Date(Date.now() - 2 * DAY));
  if (S.lastDay !== twoAgo) return false;
  useItem('freeze');
  S.lastDay = yesterday;
  return true;
}

/* ------------------------------------------------------------
   Domknięcie tury: cele, zadania, odznaki, zapis, powiadomienia
   ------------------------------------------------------------ */

function commit() {
  const goals = sweepGoals();
  const quests = sweepQuests();
  const badges = sweepBadges();
  save();
  goals.forEach((g) => UI.toast('Cel zamknięty', g.title + '  ·  +' + g.xp + ' XP'));
  quests.forEach((q) => UI.toast('Zadanie wykonane', q.pl + '  ·  +' + q.coin + ' ₽  +' + q.xp + ' XP'));
  badges.forEach((b) => UI.badgeToast(b));
  if (goals.length || badges.length || quests.length) UI.burst();
  return { goals, badges, quests };
}

function resetAll() {
  S = structuredClone(DEFAULTS);
  save();
}

window.Store = {
  get s() { return S; },
  save, commit, resetAll, hydrate,
  today, dayKey, touchDay, streakAlive, todayCount, dailyDone,
  levelInfo, addXp, RANKS,
  card, known, grade, dueCards, dueCount, knownCount, seenCount, weakWords, KNOWN_BOX,
  logAnswer, markTimeFlags,
  modState, secDone, modSectionsDone, modComplete,
  goalProgress, goalDone, allGoals, nextGoal, goalUnlocked, pathProgress,
  dstat, bump, raise,
  addCoins, spendCoins, sessionReward, itemCount, hasPerk, buy, useItem,
  dailyQuests, questProgress, questClaimed, sweepQuests,
  noteTopic, weakTopics, applyFreeze,
};
})();
