'use strict';
/* =========================================================
   Привет! · silnik sesji: lekcje, treningi, fiszki, sprint
   ========================================================= */

/* ---------- dobór zadań ---------- */
function distractors(id, n, field) {
  const w = getWord(id);
  const key = x => field === 'pl' ? normPl(x.pl) : normRu(x.ru);
  const used = new Set([key(w)]);
  const multi = normRu(w.ru).includes(' ');
  const out = [];
  const tryAdd = (ids, strict) => {
    for (const did of shuffle(ids)) {
      if (out.length >= n) return;
      if (did === id) continue;
      const d = getWord(did);
      if (!d) continue;
      const k = key(d);
      if (used.has(k)) continue;
      if (strict && normRu(d.ru).includes(' ') !== multi) continue;
      used.add(k); out.push(did);
    }
  };
  const own = w.custom ? (S.decks.find(d => d.ids.includes(id))?.ids || []) : (LIB.catMap[w.cat]?.ids || []);
  tryAdd(own, true);
  if (out.length < n) tryAdd(LIB.cats.filter(c => c.pos === w.pos).flatMap(c => c.ids), true);
  if (out.length < n) tryAdd([...LIB.words.keys()], false);
  return out;
}
function suitable(id, spec) {
  const w = getWord(id);
  if (!w) return false;
  const n = normRu(w.ru), words = n.split(' ').length;
  switch (spec) {
    case 'scramble': return (words >= 2 && words <= 8) || (words === 1 && n.length >= 3 && n.length <= 12);
    case 'type:pl-ru': return n.length <= 24;
    case 'type:dict': return Speech.ok && n.length <= 20;
    case 'type:ru-pl': return plVariants(w.pl).some(v => v.length <= 24);
    case 'choice:audio': return Speech.ok;
    default: return true;
  }
}
const makeTask = (id, spec) => { const [type, dir] = spec.split(':'); return { type, id, dir }; };
const pickSuitable = (id, specs, fallback = 'choice:ru-pl', ordered = false) => (ordered ? specs : shuffle(specs)).find(s => suitable(id, s)) || fallback;
/* do „Par”: bez powtarzających się tłumaczeń i słów */
function distinctIds(ids, n) {
  const seenPl = new Set(), seenRu = new Set(), out = [];
  for (const id of ids) {
    const w = getWord(id); if (!w) continue;
    const p = normPl(w.pl), r = normRu(w.ru);
    if (seenPl.has(p) || seenRu.has(r)) continue;
    seenPl.add(p); seenRu.add(r); out.push(id);
    if (out.length >= n) break;
  }
  return out;
}
function reviewTask(id) {
  const c = S.cards[id];
  const ivl = c && c.s === 2 ? c.ivl : 0;
  const specs = ivl < 4 ? ['choice:ru-pl', 'choice:pl-ru', 'choice:audio']
    : ivl < 15 ? ['scramble', 'type:ru-pl', 'choice:audio', 'type:pl-ru']
      : ['type:pl-ru', 'type:dict', 'scramble'];
  return makeTask(id, pickSuitable(id, specs));
}

/* ---------- budowanie sesji ---------- */
function buildLesson({ focus = null, extra = false } = {}) {
  const only = focus ? new Set(sourceIds(focus)) : null;
  const rev = dueIds(Date.now(), only).slice(0, 12);
  let nNew = focus || extra ? 5 : Math.min(5, newLeftToday());
  if (rev.length >= 10 && !focus) nNew = Math.min(nNew, 2);
  const news = nextNewWords(nNew, focus);
  if (!news.length && !rev.length) return null;
  const tasks = [];
  news.forEach((id, i) => {
    tasks.push({ type: 'intro', id });
    tasks.push({ type: 'choice', id, dir: 'ru-pl' });
    if (i > 0) tasks.push({ type: 'choice', id: news[i - 1], dir: 'pl-ru' });
  });
  if (news.length) tasks.push({ type: 'choice', id: news[news.length - 1], dir: 'pl-ru' });
  const pool = distinctIds(shuffle([...news, ...rev]), 5);
  if (news.length >= 3 && pool.length >= 4) tasks.push({ type: 'match', ids: pool });
  const HARD = ['scramble', 'type:pl-ru', 'choice:audio'];
  const off = rand(3);
  const rest = shuffle([...news.map((id, i) => makeTask(id, pickSuitable(id, [...HARD.slice((i + off) % 3), ...HARD.slice(0, (i + off) % 3)], 'choice:pl-ru', true))), ...rev.map(reviewTask)]);
  if (news.length < 3 && pool.length >= 4) rest.splice(Math.min(rest.length, 3), 0, { type: 'match', ids: pool });
  tasks.push(...rest);
  const title = focus ? sourceLabel(focus) : news.length ? (LIB.catMap[getWord(news[0]).cat]?.name || 'Moje fiszki') : 'Powtórka';
  return new Session({ kind: 'lesson', title, tasks, srs: 'lesson', newIds: news, again: () => buildLesson({ focus, extra: true }) });
}

function practicePool(src, n) {
  const ids = sourceIds(src).filter(getWord);
  if (ids.length < 4) return null;
  const seen = ids.filter(id => S.cards[id]?.s > 0);
  const base = seen.length >= Math.min(n, 8) ? seen : ids;
  const top = base.slice().sort((a, b) => weakness(b) - weakness(a) || Math.random() - .5).slice(0, Math.max(n * 2, 24));
  return shuffle(top).slice(0, n);
}
const MODES = {
  choice: { name: 'Test wyboru', icon: 'list', desc: 'Cztery odpowiedzi, jedna dobra' },
  type: { name: 'Pisanie', icon: 'edit', desc: 'Wpisz słowo cyrylicą' },
  listen: { name: 'Słuchanie', icon: 'headphones', desc: 'Rozpoznaj i zapisz ze słuchu' },
  scramble: { name: 'Układanka', icon: 'shuffle', desc: 'Ułóż słowo z liter' },
  match: { name: 'Pary', icon: 'grid', desc: 'Połącz słowa na czas' },
  sprint: { name: 'Sprint', icon: 'timer', desc: '60 sekund: prawda czy fałsz' },
  flash: { name: 'Fiszki', icon: 'cards', desc: 'Powtórka z oceną pamięci' },
  alphabet: { name: 'Alfabet', icon: 'abc', desc: 'Quiz z cyrylicy' }
};
function buildPractice(mode, src) {
  if (mode === 'flash') return buildReview(src);
  if (mode === 'alphabet') return buildAlphabetQuiz();
  if (mode === 'sprint') return buildSprint(src);
  const n = mode === 'match' ? 15 : 10;
  const ids = practicePool(src, n);
  if (!ids) { toast('Za mało słów w tym źródle — wybierz inne (min. 4)', 'bad'); return null; }
  let tasks;
  if (mode === 'choice') tasks = ids.map(id => makeTask(id, pickSuitable(id, ['choice:ru-pl', 'choice:pl-ru'])));
  else if (mode === 'type') tasks = ids.map(id => makeTask(id, pickSuitable(id, Math.random() < .7 ? ['type:pl-ru'] : ['type:ru-pl'], 'scramble')));
  else if (mode === 'listen') tasks = ids.map((id, i) => makeTask(id, pickSuitable(id, i % 2 ? ['type:dict'] : ['choice:audio'], 'choice:audio')));
  else if (mode === 'scramble') tasks = ids.map(id => makeTask(id, pickSuitable(id, ['scramble'])));
  else if (mode === 'match') {
    tasks = [];
    const pool = distinctIds(ids.concat(shuffle(sourceIds(src))), 15);
    for (let i = 0; i + 4 <= pool.length; i += 5) tasks.push({ type: 'match', ids: pool.slice(i, i + 5) });
  }
  if (mode === 'listen' && !Speech.ok) { toast('Ta przeglądarka nie obsługuje syntezy mowy', 'bad'); return null; }
  return new Session({ kind: 'practice', mode, title: MODES[mode].name, tasks, srs: 'practice', again: () => buildPractice(mode, src) });
}
function buildReview(src = null) {
  const only = src ? new Set(sourceIds(src)) : null;
  let ids = dueIds(Date.now(), only).slice(0, 60);
  let cram = false;
  if (!ids.length) {
    if (!src) return null;
    ids = shuffle(sourceIds(src)).slice(0, 20);
    cram = true;
    if (!ids.length) { toast('Brak słów do powtórki', 'bad'); return null; }
  }
  return new Session({ kind: 'review', title: cram ? 'Przegląd fiszek' : 'Powtórka fiszek', tasks: ids.map(id => ({ type: 'flash', id })), srs: cram ? 'none' : 'review', cram, again: () => buildReview(src) });
}
function buildAlphabetQuiz() {
  const A = window.ALPHABET;
  const letters = shuffle(A.filter(a => a.group !== 'sign')).slice(0, 12);
  const tasks = letters.map((a, i) => {
    const others = shuffle(A.filter(x => x !== a && x.group !== 'sign' && x.sound !== a.sound)).slice(0, 3);
    if (i % 3 === 0) return { type: 'q', prompt: 'Jak czyta się tę literę?', big: `${a.up} ${a.lo}`, options: shuffle([a, ...others]).map(x => ({ label: x.sound, ok: x === a })), answer: `${a.up} — ${a.sound}`, speak: a.lo };
    if (i % 3 === 1) return { type: 'q', prompt: `Która litera brzmi jak „${a.sound}”?`, big: '', options: shuffle([a, ...others]).map(x => ({ label: `${x.up} ${x.lo}`, ok: x === a, cyr: true })), answer: `${a.up} ${a.lo}` };
    const w = stressify(a.ex);
    const wrong = shuffle(A.filter(x => x !== a)).slice(0, 3).map(x => stressify(x.ex));
    const opts = shuffle([w, ...wrong]).map(x => ({ label: phonetic(x).replace(/[{}]/g, ''), ok: x === w }));
    return { type: 'q', prompt: 'Przeczytaj słowo', big: w, options: opts, answer: `${w} — ${a.exPl}`, speak: w };
  });
  return new Session({ kind: 'alphabet', title: 'Alfabet', tasks, srs: 'none', again: buildAlphabetQuiz });
}
function buildSprint(src) {
  const ids = sourceIds(src).filter(getWord);
  if (ids.length < 6) { toast('Sprint potrzebuje co najmniej 6 słów w źródle', 'bad'); return null; }
  return new Session({ kind: 'sprint', title: 'Sprint', tasks: [], srs: 'none', pool: ids, again: () => buildSprint(src) });
}

/* ---------- sesja ---------- */
let SESSION = null;
class Session {
  constructor(o) {
    Object.assign(this, o);
    this.queue = (o.tasks || []).slice();
    this.i = 0; this.done = 0; this.xp = 0; this.okN = 0; this.badN = 0;
    this.combo = 0; this.bestCombo = 0; this.wstat = {}; this.retries = {};
    this.t0 = Date.now(); this.newSet = new Set(o.newIds || []);
    this.results = []; this.goalHit = null; this.finished = false;
  }
  open() {
    SESSION = this;
    const el = document.createElement('div');
    el.id = 'session';
    el.innerHTML = `<div class="s-wrap">
      <div class="s-top"><button class="icon-btn s-close" aria-label="Zakończ">${icon('x')}</button><div class="s-progress"><i></i></div><div class="s-combo"></div></div>
      <div class="s-body"></div><div class="s-foot"></div><div class="s-kb"></div></div>`;
    document.body.appendChild(el);
    document.body.classList.add('in-session');
    this.el = el; this.body = $('.s-body', el); this.foot = $('.s-foot', el); this.kb = $('.s-kb', el);
    $('.s-close', el).addEventListener('click', () => this.quit());
    this.onKey = e => this.key(e);
    document.addEventListener('keydown', this.onKey);
    this.onGoal = e => { this.goalHit = e.detail; };
    bus.addEventListener('goal', this.onGoal);
    requestAnimationFrame(() => el.classList.add('in'));
    if (this.kind === 'sprint') this.sprintStart(); else this.show();
  }
  get task() { return this.queue[this.i]; }
  updateTop() {
    const p = this.kind === 'sprint' ? 1 - this.left / 60 : this.done / Math.max(1, this.queue.length);
    $('.s-progress i', this.el).style.width = `${clamp(p, 0, 1) * 100}%`;
    const c = $('.s-combo', this.el);
    if (this.kind === 'sprint') c.innerHTML = `${icon('timer')}<b>${Math.ceil(this.left)}</b>`;
    else c.innerHTML = this.combo >= 3 ? `${icon('flame')}<b>${this.combo}</b>` : `${icon('bolt')}<b>${this.xp}</b>`;
    c.classList.toggle('hot', this.combo >= 3 && this.kind !== 'sprint');
  }
  show() {
    this.updateTop();
    const t = this.task;
    if (!t) return this.finish();
    this.state = 'answer'; this.pending = null;
    this.foot.className = 's-foot'; this.foot.innerHTML = ''; this.kb.innerHTML = '';
    this.body.scrollTop = 0;
    this.body.classList.remove('enter'); void this.body.offsetWidth; this.body.classList.add('enter');
    const fn = this['r_' + t.type];
    fn.call(this, t, getWord(t.id));
  }

  /* --- nowe słowo --- */
  r_intro(t, w) {
    introduce(t.id);
    this.body.innerHTML = `
      <div class="ex-label"><span class="tag tag-new">Nowe słowo</span></div>
      <div class="intro-card">
        <div class="eyebrow">${esc(wordCatName(w))}</div>
        <div class="ru-xl">${esc(w.ru)}</div>
        ${S.settings.phon ? `<div class="phon">[${phonHtml(w.ru)}]</div>` : ''}
        <div class="audio-row">${speakBtn(w.ru, 'lg')}${speakBtn(w.ru, 'lg', true)}</div>
        <div class="pl-lg">${esc(w.pl)}</div>
        ${w.note ? `<div class="note">${icon('info')}<span>${esc(w.note)}</span></div>` : ''}
        ${w.ex ? `<div class="example"><div class="ex-ru">${esc(w.ex)} ${speakBtn(w.ex, 'sm')}</div><div class="ex-pl">${esc(w.exPl)}</div></div>` : ''}
      </div>`;
    this.foot.innerHTML = `<button class="btn btn-primary btn-block" data-next>Dalej</button>`;
    $('[data-next]', this.foot).addEventListener('click', () => { this.done++; this.i++; this.show(); });
    if (S.settings.autoplay) setTimeout(() => Speech.speak(w.ru), 250);
  }

  /* --- wybór z czterech --- */
  r_choice(t, w) {
    const dir = t.dir;
    const field = dir === 'ru-pl' ? 'pl' : 'ru';
    const opts = shuffle([t.id, ...distractors(t.id, 3, field)]);
    let prompt;
    if (dir === 'ru-pl') prompt = `<div class="ex-label">Co to znaczy?</div><div class="prompt-ru">${esc(w.ru)} ${speakBtn(w.ru)}</div>${S.settings.phon ? `<div class="phon center">[${phonHtml(w.ru)}]</div>` : ''}`;
    else if (dir === 'pl-ru') prompt = `<div class="ex-label">Jak to jest po rosyjsku?</div><div class="prompt-pl">${esc(w.pl)}</div>`;
    else prompt = `<div class="ex-label">Co słyszysz?</div><div class="listen-wrap">${speakBtn(w.ru, 'xl')}${speakBtn(w.ru, 'lg', true)}</div>`;
    this.body.innerHTML = `${prompt}<div class="options">${opts.map((id, i) => {
      const o = getWord(id);
      const label = field === 'pl' ? o.pl : o.ru;
      return `<button class="option ${field === 'ru' ? 'cyr' : ''}" data-i="${i}"><span class="kbd">${i + 1}</span><span>${esc(label)}</span></button>`;
    }).join('')}</div>`;
    if (dir === 'audio' || (dir === 'ru-pl' && S.settings.autoplay)) setTimeout(() => Speech.speak(w.ru), 200);
    this.optionHandler(opts.map(id => id === t.id), () => this.answerHtml(w));
  }
  optionHandler(correctFlags, answerHtml, onResult) {
    const btns = $$('.option', this.body);
    btns.forEach((b, i) => b.addEventListener('click', () => {
      if (this.state !== 'answer') return;
      const ok = correctFlags[i];
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) btns[correctFlags.indexOf(true)].classList.add('right');
      btns.forEach(x => x.disabled = true);
      onResult && onResult(ok);
      this.answer(ok, { answerHtml: answerHtml() });
    }));
  }
  answerHtml(w) {
    return `<div class="fb-word"><span class="cyr">${esc(w.ru)}</span>${speakBtn(w.ru, 'sm')}<span class="fb-sep">—</span><span>${esc(w.pl)}</span></div>`;
  }

  /* --- pisanie --- */
  r_type(t, w) {
    const ru = t.dir !== 'ru-pl';
    let prompt;
    if (t.dir === 'pl-ru') prompt = `<div class="ex-label">Napisz po rosyjsku</div><div class="prompt-pl">${esc(w.pl)}</div>${w.note && !isCyr(w.note) ? `<div class="muted center small">${esc(w.note)}</div>` : ''}`;
    else if (t.dir === 'ru-pl') prompt = `<div class="ex-label">Przetłumacz na polski</div><div class="prompt-ru">${esc(w.ru)} ${speakBtn(w.ru)}</div>`;
    else prompt = `<div class="ex-label">Zapisz, co słyszysz</div><div class="listen-wrap">${speakBtn(w.ru, 'xl')}${speakBtn(w.ru, 'lg', true)}</div>`;
    const builtin = ru && S.settings.keyboard === 'builtin';
    this.body.innerHTML = `${prompt}
      <div class="answer-wrap">
        <input class="answer-input ${ru ? 'cyr' : ''}" id="answer" type="text" ${ru ? 'lang="ru"' : 'lang="pl"'} ${builtin ? 'inputmode="none"' : ''} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${ru ? 'по-русски…' : 'po polsku…'}">
        ${ru ? `<button class="icon-btn hint-btn" data-hint aria-label="Podpowiedź">${icon('bulb')}</button>` : ''}
      </div>
      ${ru && builtin && !matchMedia('(pointer:coarse)').matches ? `<p class="muted small center">Na klawiaturze komputera pisz fonetycznie: sz→ш, cz→ч, ch→х, x→ж, ja→я, ju→ю, y→ы, '→ь</p>` : ''}`;
    const inp = $('#answer', this.body);
    const check = () => {
      if (this.state !== 'answer') return;
      const val = inp.value.trim();
      if (!val) { inp.focus(); return; }
      const res = checkAnswer(val, ru ? w.ru : w.pl, ru ? 'ru' : 'pl');
      inp.disabled = true;
      inp.classList.add(res.ok ? 'right' : 'wrong');
      this.kb.innerHTML = '';
      this.answer(res.ok, { note: res.note, given: val, answerHtml: this.answerHtml(w), allowOverride: !res.ok });
    };
    if (ru) attachPhysical(inp, check); else inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(); } });
    if (builtin) this.kb.appendChild(buildKeyboard({ input: inp, onEnter: check, enterLabel: 'Sprawdź' }));
    this.foot.innerHTML = `<button class="btn btn-primary btn-block" data-check disabled>Sprawdź</button>`;
    const btn = $('[data-check]', this.foot);
    inp.addEventListener('input', () => { btn.disabled = !inp.value.trim(); });
    btn.addEventListener('click', check);
    const hint = $('[data-hint]', this.body);
    if (hint) hint.addEventListener('click', () => {
      const target = stripAcc(w.ru);
      const cur = inp.value;
      let k = 0;
      while (k < cur.length && k < target.length && cur[k].toLowerCase() === target[k].toLowerCase()) k++;
      inp.value = target.slice(0, k + 1);
      t.hint = true;
      inp.dispatchEvent(new Event('input'));
      if (!builtin) inp.focus();
    });
    if (t.dir === 'dict') setTimeout(() => Speech.speak(w.ru), 250);
    setTimeout(() => { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }, 60);
  }

  /* --- układanka --- */
  r_scramble(t, w) {
    const target = normRu(w.ru);
    const byWord = target.includes(' ');
    const pieces = byWord ? stripAcc(w.ru).replace(/[.,!?…«»—]/g, '').split(/\s+/).filter(Boolean) : [...target];
    let order = shuffle(pieces.map((p, i) => i));
    if (pieces.length > 1) for (let k = 0; k < 5 && order.every((v, i) => pieces[v] === pieces[i]); k++) order = shuffle(order);
    this.body.innerHTML = `<div class="ex-label">${byWord ? 'Ułóż zdanie' : 'Ułóż słowo'}</div><div class="prompt-pl">${esc(w.pl)}</div>
      <div class="tiles-answer ${byWord ? 'words' : ''}" aria-label="Twoja odpowiedź"></div>
      <div class="tiles-pool ${byWord ? 'words' : ''}">${order.map(i => `<button class="tile cyr" data-p="${i}">${esc(pieces[i])}</button>`).join('')}</div>`;
    const ans = $('.tiles-answer', this.body), pool = $('.tiles-pool', this.body);
    const placed = [];
    this.foot.innerHTML = `<button class="btn btn-primary btn-block" data-check disabled>Sprawdź</button>`;
    const btn = $('[data-check]', this.foot);
    const sync = () => { btn.disabled = !placed.length; };
    pool.addEventListener('click', e => {
      const b = e.target.closest('.tile'); if (!b || this.state !== 'answer' || b.classList.contains('used')) return;
      b.classList.add('used');
      placed.push(+b.dataset.p);
      const nb = document.createElement('button');
      nb.className = 'tile cyr'; nb.dataset.p = b.dataset.p; nb.textContent = b.textContent;
      ans.appendChild(nb); sync();
    });
    ans.addEventListener('click', e => {
      const b = e.target.closest('.tile'); if (!b || this.state !== 'answer') return;
      const idx = [...ans.children].indexOf(b);
      placed.splice(idx, 1); b.remove();
      const src = $(`.tile.used[data-p="${b.dataset.p}"]`, pool); if (src) src.classList.remove('used');
      sync();
    });
    btn.addEventListener('click', () => {
      if (this.state !== 'answer') return;
      const given = placed.map(i => pieces[i]).join(byWord ? ' ' : '');
      const ok = normRu(given) === target;
      ans.classList.add(ok ? 'right' : 'wrong');
      this.answer(ok, { answerHtml: this.answerHtml(w) });
    });
  }

  /* --- pary --- */
  r_match(t) {
    const ids = t.ids.filter(getWord);
    const left = shuffle(ids), right = shuffle(ids);
    this.body.innerHTML = `<div class="ex-label">Połącz w pary</div>
      <div class="match-grid"><div class="match-col">${left.map(id => `<button class="mtile cyr" data-id="${id}" data-side="l">${esc(getWord(id).ru)}</button>`).join('')}</div>
      <div class="match-col">${right.map(id => `<button class="mtile" data-id="${id}" data-side="r">${esc(getWord(id).pl)}</button>`).join('')}</div></div>`;
    let sel = null, matched = 0, errors = 0;
    const t0 = Date.now();
    this.foot.innerHTML = `<div class="muted center small">Stuknij słowo, a potem jego tłumaczenie</div>`;
    $('.match-grid', this.body).addEventListener('click', e => {
      const b = e.target.closest('.mtile'); if (!b || b.disabled) return;
      if (b.dataset.side === 'l') Speech.speak(getWord(b.dataset.id).ru);
      if (!sel || sel.dataset.side === b.dataset.side) { if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); return; }
      const L = sel.dataset.side === 'l' ? sel : b, R = sel.dataset.side === 'l' ? b : sel;
      if (L.dataset.id === R.dataset.id || normPl(getWord(L.dataset.id).pl) === normPl(getWord(R.dataset.id).pl)) {
        [sel, b].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); x.disabled = true; });
        Sfx.play('pair'); matched++; this.xp++; addXP(1);
        this.updateTop();
        sel = null;
        if (matched === ids.length) {
          const ms = Date.now() - t0;
          if (this.kind === 'practice') { this.matchMs = (this.matchMs || 0) + ms; }
          this.okN += ids.length; this.badN += Math.min(errors, ids.length);
          ids.forEach(id => this.results.push({ id, ok: true }));
          setTimeout(() => { this.done++; this.i++; this.show(); }, 450);
        }
      } else {
        errors++;
        const a = sel;
        [a, b].forEach(x => { x.classList.add('miss'); x.classList.remove('sel'); });
        Sfx.play('bad');
        setTimeout(() => [a, b].forEach(x => x.classList.remove('miss')), 450);
        sel = null;
      }
    });
  }

  /* --- fiszka --- */
  r_flash(t, w) {
    const d = S.settings.flashDir === 'mix' ? (Math.random() < .5 ? 'ru-pl' : 'pl-ru') : S.settings.flashDir;
    const front = d === 'ru-pl'
      ? `<div class="face-label">po rosyjsku</div><div class="ru-xl">${esc(w.ru)}</div>${speakBtn(w.ru, 'lg')}`
      : `<div class="face-label">po polsku</div><div class="pl-xl">${esc(w.pl)}</div>`;
    const back = `<div class="face-label">${d === 'ru-pl' ? 'tłumaczenie' : 'po rosyjsku'}</div>
      ${d === 'ru-pl' ? `<div class="pl-xl">${esc(w.pl)}</div><div class="ru-sm">${esc(w.ru)}</div>` : `<div class="ru-xl">${esc(w.ru)}</div><div class="pl-sm">${esc(w.pl)}</div>`}
      ${S.settings.phon ? `<div class="phon">[${phonHtml(w.ru)}]</div>` : ''}
      ${speakBtn(w.ru, 'lg')}
      ${w.note ? `<div class="note">${icon('info')}<span>${esc(w.note)}</span></div>` : ''}
      ${w.ex ? `<div class="example"><div class="ex-ru">${esc(w.ex)}</div><div class="ex-pl">${esc(w.exPl)}</div></div>` : ''}`;
    const c = S.cards[t.id] || newCard();
    this.body.innerHTML = `<div class="ex-label">${this.cram ? 'Przegląd' : (c.s === 0 ? '<span class="tag tag-new">Nowa</span>' : `Fiszka · ${MASTERY_LABEL[mastery(t.id)]}`)}</div>
      <div class="flash-wrap"><div class="flash"><div class="face front">${front}</div><div class="face back">${back}</div></div></div>`;
    const card = $('.flash', this.body);
    const reveal = () => {
      if (this.state !== 'answer') return;
      this.state = 'rate';
      card.classList.add('flipped');
      Sfx.play('flip');
      if (S.settings.autoplay) setTimeout(() => Speech.speak(w.ru), 300);
      const now = Date.now();
      const lbl = r => this.cram ? '' : `<small>${ivlLabel(schedule(c, r, now, true), now)}</small>`;
      this.foot.innerHTML = `<div class="rate-row">
        <button class="rate r1" data-r="1"><b>Nie pamiętam</b>${lbl(1)}</button>
        <button class="rate r2" data-r="2"><b>Trudne</b>${lbl(2)}</button>
        <button class="rate r3" data-r="3"><b>Dobrze</b>${lbl(3)}</button>
        <button class="rate r4" data-r="4"><b>Łatwe</b>${lbl(4)}</button></div>`;
      $$('.rate', this.foot).forEach(b => b.addEventListener('click', () => this.rateFlash(+b.dataset.r)));
    };
    card.addEventListener('click', reveal);
    this.foot.innerHTML = `<button class="btn btn-primary btn-block" data-reveal>${icon('eye')} Pokaż odpowiedź</button>`;
    $('[data-reveal]', this.foot).addEventListener('click', reveal);
    this.reveal = reveal;
    if (d === 'ru-pl' && S.settings.autoplay) setTimeout(() => Speech.speak(w.ru), 200);
  }
  rateFlash(r) {
    if (this.state !== 'rate') return;
    const t = this.task;
    this.state = 'done';
    let requeue = false;
    if (this.cram) requeue = r === 1;
    else {
      const c = rate(t.id, r);
      requeue = c.due - Date.now() < 15 * MIN;
    }
    const gained = r > 1 ? 2 : 1;
    this.xp += gained; addXP(gained);
    if (r > 1) { this.okN++; this.combo++; } else { this.badN++; this.combo = 0; }
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    this.results.push({ id: t.id, ok: r > 1 });
    if (requeue && (this.retries[t.id] = (this.retries[t.id] || 0) + 1) <= 3) {
      const pos = Math.min(this.queue.length, this.i + 4);
      this.queue.splice(pos, 0, { type: 'flash', id: t.id, retry: true });
    }
    this.done++; this.i++; this.show();
  }

  /* --- pytanie (alfabet) --- */
  r_q(t) {
    this.body.innerHTML = `<div class="ex-label">${esc(t.prompt)}</div>${t.big ? `<div class="prompt-ru big">${esc(t.big)} ${t.speak ? speakBtn(t.speak) : ''}</div>` : ''}
      <div class="options ${t.options.length === 4 ? 'two' : ''}">${t.options.map((o, i) => `<button class="option ${o.cyr ? 'cyr' : ''}" data-i="${i}"><span class="kbd">${i + 1}</span><span>${esc(o.label)}</span></button>`).join('')}</div>`;
    this.optionHandler(t.options.map(o => o.ok), () => `<div class="fb-word"><span class="cyr">${esc(t.answer)}</span></div>`);
  }

  /* --- ocena odpowiedzi --- */
  answer(ok, { answerHtml = '', note = '', given = '', allowOverride = false } = {}) {
    this.state = 'feedback';
    this.pending = { task: this.task, ok };
    Sfx.play(ok ? 'ok' : 'bad');
    if (!ok && navigator.vibrate && navigator.userActivation?.hasBeenActive) try { navigator.vibrate(40); } catch (e) { /* brak */ }
    const w = getWord(this.task.id);
    if (w && (this.task.type === 'choice' || this.task.type === 'type' || this.task.type === 'scramble')) setTimeout(() => Speech.speak(w.ru), 150);
    const praise = pick(['Świetnie!', 'Dobrze!', 'Brawo!', 'Tak jest!', 'Отлично!', 'Молодец!']);
    this.foot.className = `s-foot fb ${ok ? 'ok' : 'bad'}`;
    this.foot.innerHTML = `
      <div class="fb-head">${icon(ok ? 'check' : 'x')}<b>${ok ? praise : 'Poprawna odpowiedź:'}</b></div>
      ${note ? `<div class="fb-note">${esc(note)}</div>` : ''}
      ${answerHtml}
      ${!ok && given ? `<div class="fb-given">Twoja odpowiedź: <s>${esc(given)}</s></div>` : ''}
      ${allowOverride ? `<button class="link fb-override" data-override>Moja odpowiedź była poprawna</button>` : ''}
      <button class="btn ${ok ? 'btn-ok' : 'btn-bad'} btn-block" data-next>Dalej</button>`;
    $('[data-next]', this.foot).addEventListener('click', () => this.next());
    const ov = $('[data-override]', this.foot);
    if (ov) ov.addEventListener('click', () => {
      this.pending.ok = true;
      this.foot.className = 's-foot fb ok';
      $('.fb-head', this.foot).innerHTML = `${icon('check')}<b>Uznano jako poprawną</b>`;
      ov.remove();
      $('[data-next]', this.foot).className = 'btn btn-ok btn-block';
    });
    setTimeout(() => $('[data-next]', this.foot)?.focus({ preventScroll: true }), 50);
  }
  commit() {
    const p = this.pending; if (!p) return;
    this.pending = null;
    const { task, ok } = p;
    if (ok) { this.okN++; this.combo++; } else { this.badN++; this.combo = 0; }
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    if (task.id) { this.applySrs(task.id, ok); this.results.push({ id: task.id, ok }); }
    const gained = ok ? (task.retry || task.hint ? 1 : 2) : 0;
    if (gained) { this.xp += gained; addXP(gained); }
    if (!ok && task.id && (this.retries[task.id] = (this.retries[task.id] || 0) + 1) <= 2) {
      const pos = Math.min(this.queue.length, this.i + 3 + rand(3));
      this.queue.splice(Math.max(pos, this.i + 1), 0, { ...task, retry: true, hint: false });
    }
  }
  applySrs(id, ok) {
    if (this.srs === 'none' || !getWord(id)) return;
    const now = Date.now(), ws = this.wstat[id] || (this.wstat[id] = { ok: 0, bad: 0 });
    ok ? ws.ok++ : ws.bad++;
    const d = today();
    if (this.srs === 'lesson' && this.newSet.has(id)) {
      const c = ensureCard(id);
      if (!ok) { c.s = 1; c.step = 0; c.due = now + MIN; c.bad++; ws.failed = true; d.bad++; }
      else { c.ok++; d.ok++; if (ws.ok >= 2 && !ws.failed && c.s < 2) { graduate(c, 1, now); c.reps++; c.last = now; } }
      save();
      return;
    }
    const c = S.cards[id];
    if (!c || c.s === 0) return;
    if (!ok) {
      if (this.srs === 'practice') { c.bad++; d.bad++; if (c.s === 2) c.due = Math.min(c.due, now); save(); }
      else if (!ws.lapsed) { rate(id, 1); ws.lapsed = true; }
    } else if (!ws.applied && !ws.lapsed && isDue(c, now)) { rate(id, 3); ws.applied = true; }
    else { c.ok++; d.ok++; save(); }
  }
  next() {
    if (this.state !== 'feedback') return;
    this.commit();
    this.done++; this.i++;
    this.show();
  }
  key(e) {
    if (sheetStack.length) return;
    const typing = e.target.matches && e.target.matches('input, textarea');
    if (this.state === 'feedback' && e.key === 'Enter') { e.preventDefault(); this.next(); return; }
    if (this.kind === 'sprint' && this.state === 'answer') {
      if (e.key === 'ArrowLeft') this.sprintAnswer(false);
      if (e.key === 'ArrowRight') this.sprintAnswer(true);
      return;
    }
    if (typing) return;
    if (this.state === 'answer' && /^[1-4]$/.test(e.key)) { const b = $$('.option', this.body)[+e.key - 1]; if (b) b.click(); }
    if (this.state === 'answer' && this.task?.type === 'flash' && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); this.reveal(); }
    else if (this.state === 'rate' && /^[1-4]$/.test(e.key)) this.rateFlash(+e.key);
    else if (this.state === 'answer' && this.task?.type === 'intro' && e.key === 'Enter') $('[data-next]', this.foot)?.click();
  }

  /* --- sprint --- */
  sprintStart() {
    this.left = 60; this.score = 0;
    this.body.innerHTML = `<div class="sprint-intro"><div class="sprint-big">60</div><p>Czy tłumaczenie jest poprawne?<br>Odpowiadaj jak najszybciej.</p><p class="muted small">Klawiatura: ← fałsz · prawda →</p></div>`;
    this.foot.innerHTML = `<button class="btn btn-primary btn-block" data-go>Start</button>`;
    this.updateTop();
    $('[data-go]', this.foot).addEventListener('click', () => {
      this.tEnd = Date.now() + 60000;
      this.timer = setInterval(() => {
        this.left = Math.max(0, (this.tEnd - Date.now()) / 1000);
        this.updateTop();
        if (this.left <= 0) { clearInterval(this.timer); this.finish(); }
      }, 200);
      this.sprintNext();
    });
  }
  sprintNext() {
    const id = pick(this.pool), w = getWord(id);
    const truth = Math.random() < .5;
    const shown = truth ? w : getWord(distractors(id, 1, 'pl')[0]);
    this.sp = { id, truth };
    this.state = 'answer';
    this.body.innerHTML = `<div class="sprint-card"><div class="sprint-score">${this.score} pkt${this.combo >= 5 ? ` · ×2` : ''}</div><div class="ru-xl">${esc(w.ru)}</div><div class="sprint-eq">=</div><div class="pl-xl">${esc(shown.pl)}</div></div>`;
    this.foot.className = 's-foot';
    this.foot.innerHTML = `<div class="sprint-btns"><button class="btn btn-bad" data-a="0">${icon('x')} Fałsz</button><button class="btn btn-ok" data-a="1">${icon('check')} Prawda</button></div>`;
    $$('[data-a]', this.foot).forEach(b => b.addEventListener('click', () => this.sprintAnswer(b.dataset.a === '1')));
  }
  sprintAnswer(said) {
    if (this.state !== 'answer' || this.left <= 0) return;
    const ok = said === this.sp.truth;
    this.state = 'wait';
    if (ok) { this.combo++; this.okN++; this.score += this.combo >= 5 ? 2 : 1; Sfx.play('pair'); }
    else { this.combo = 0; this.badN++; Sfx.play('bad'); }
    this.results.push({ id: this.sp.id, ok });
    this.body.querySelector('.sprint-card')?.classList.add(ok ? 'right' : 'wrong');
    setTimeout(() => this.sprintNext(), ok ? 180 : 450);
  }

  /* --- koniec --- */
  finish() {
    if (this.finished) return;
    this.finished = true;
    clearInterval(this.timer);
    const ms = Date.now() - this.t0;
    today().ms += ms;
    let bonus = 0;
    if (this.kind === 'lesson') {
      S.stats.lessons++;
      bonus += 5;
      if (this.badN === 0 && this.okN >= 4) { S.stats.perfect++; bonus += 5; }
      const now = Date.now();
      for (const id of this.newSet) {
        const c = S.cards[id];
        if (c && c.s === 1) { c.step = 1; c.due = now + 10 * MIN; }
      }
    }
    let record = '';
    if (this.kind === 'sprint') {
      bonus += this.score;
      if (this.score > S.stats.sprintBest) { if (S.stats.sprintBest) record = 'Nowy rekord!'; S.stats.sprintBest = this.score; }
    }
    if (this.kind === 'practice' && this.mode === 'match' && this.matchMs) {
      if (!S.stats.matchBest || this.matchMs < S.stats.matchBest) { if (S.stats.matchBest) record = 'Nowy rekord!'; S.stats.matchBest = this.matchMs; }
    }
    if (this.kind === 'alphabet' && this.badN === 0) S.stats.abcPerfect++;
    S.stats.sessions++;
    if (bonus) { this.xp += bonus; addXP(bonus); }
    save();
    checkAchievements();
    const total = this.okN + this.badN;
    const acc = total ? Math.round(this.okN / total * 100) : 100;
    const title = this.kind === 'sprint' ? `${this.score} pkt` : acc === 100 ? 'Perfekcyjnie!' : acc >= 80 ? 'Świetna robota!' : acc >= 50 ? 'Dobra robota!' : 'Ćwiczenie czyni mistrza';
    const sub = { lesson: 'Lekcja ukończona', practice: 'Trening ukończony', review: 'Powtórka ukończona', alphabet: 'Quiz ukończony', sprint: 'Koniec czasu' }[this.kind];
    const byWord = {};
    for (const r of this.results) { const x = byWord[r.id] || (byWord[r.id] = { ok: 0, bad: 0 }); r.ok ? x.ok++ : x.bad++; }
    const wordIds = Object.keys(byWord).filter(getWord).sort((a, b) => byWord[b].bad - byWord[a].bad);
    const st = streakState();
    this.el.classList.add('finished');
    $('.s-progress i', this.el).style.width = '100%';
    this.kb.innerHTML = '';
    this.body.innerHTML = `
      <div class="results">
        ${gzhel('res-orn')}
        <div class="eyebrow">${sub}</div>
        <h2 class="res-title">${title}</h2>
        ${record ? `<div class="tag tag-gold">${record}</div>` : ''}
        <div class="res-stats">
          <div><span class="rs-ic xp">${icon('bolt')}</span><b>+${this.xp}</b><small>XP</small></div>
          <div><span class="rs-ic acc">${icon('target')}</span><b>${acc}%</b><small>skuteczność</small></div>
          <div><span class="rs-ic time">${icon('timer')}</span><b>${this.kind === 'practice' && this.mode === 'match' && this.matchMs ? fmtDuration(this.matchMs) : fmtDuration(ms)}</b><small>czas</small></div>
        </div>
        ${this.goalHit ? `<div class="goal-hit">${icon('flame')}<div><b>Cel dnia osiągnięty!</b><span>Seria: ${st.n} ${plural(st.n, 'dzień', 'dni', 'dni')}</span></div></div>` : `<div class="goal-line">${ring(Math.min(1, today().xp / S.settings.goal), 36, 5)}<span>Dziś: <b>${today().xp}</b> / ${S.settings.goal} XP</span></div>`}
        ${wordIds.length ? `<details class="res-words" ${this.kind === 'lesson' ? 'open' : ''}><summary>Słowa w tej sesji (${wordIds.length})</summary>
          ${wordIds.map(id => { const w = getWord(id); const b = byWord[id]; return `<div class="rw ${b.bad ? 'bad' : 'ok'}">${icon(b.bad ? 'x' : 'check')}<span class="cyr">${esc(w.ru)}</span><span class="muted">${esc(w.pl)}</span>${speakBtn(w.ru, 'sm')}</div>`; }).join('')}
        </details>` : ''}
      </div>`;
    this.foot.className = 's-foot';
    this.foot.innerHTML = `<div class="btn-col">${this.again ? `<button class="btn btn-soft" data-again>${icon('refresh')} Jeszcze raz</button>` : ''}<button class="btn btn-primary" data-close>Gotowe</button></div>`;
    $('[data-close]', this.foot).addEventListener('click', () => this.close());
    $('[data-again]', this.foot)?.addEventListener('click', () => {
      const s = this.again();
      this.close(true);
      if (s) s.open(); else toast('Na teraz nie ma więcej słów do nauki', '');
    });
    $('.s-combo', this.el).innerHTML = '';
    Sfx.play('done');
    if (acc >= 80 && total) confetti();
  }
  async quit() {
    if (this.finished || (this.done === 0 && this.kind !== 'sprint')) return this.close();
    if (this.kind === 'sprint' && !this.tEnd) return this.close();
    const ok = await confirmBox({ title: 'Zakończyć sesję?', text: 'Postęp z ukończonych zadań zostanie zapisany.', ok: 'Zakończ', cancel: 'Ucz się dalej' });
    if (!ok) return;
    if (this.kind === 'lesson') { const now = Date.now(); for (const id of this.newSet) { const c = S.cards[id]; if (c && c.s === 1 && c.due < now) c.due = now + 10 * MIN; } }
    today().ms += Date.now() - this.t0;
    save();
    this.close();
  }
  close(silent = false) {
    clearInterval(this.timer);
    document.removeEventListener('keydown', this.onKey);
    bus.removeEventListener('goal', this.onGoal);
    try { speechSynthesis.cancel(); } catch (e) { /* brak */ }
    this.el.classList.remove('in');
    const el = this.el;
    setTimeout(() => el.remove(), 220);
    document.body.classList.remove('in-session');
    SESSION = null;
    if (!silent) render();
  }
}
function startSession(s) { if (s) s.open(); return !!s; }
