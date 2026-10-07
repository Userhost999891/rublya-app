'use strict';
/* =========================================================
   Привет! · ekrany
   ========================================================= */

let ROUTE = (location.hash || '#today').slice(1) || 'today';
let lastRoute = '';
const PARENT = { cat: 'library', alphabet: 'library', deck: 'decks', fav: 'decks', settings: 'profile' };
const TAB_OF = { today: 'today', practice: 'practice', library: 'library', alphabet: 'library', cat: 'library', decks: 'decks', fav: 'decks', deck: 'decks', profile: 'profile', settings: 'profile' };

function go(r) {
  ROUTE = r;
  try { if (location.hash.slice(1) !== r) history.pushState(null, '', '#' + r); } catch (e) { /* ramka bez historii */ }
  render();
}
window.addEventListener('popstate', () => { ROUTE = (location.hash || '#today').slice(1) || 'today'; render(); });

function render() {
  const v = $('#view');
  if (!v) return;
  $$('.kb-dock').forEach(e => e.remove());
  document.body.classList.remove('kb-open');
  const m = ROUTE.match(/^([a-z]+)(?:-(.+))?$/) || [];
  const name = VIEWS[m[1]] ? m[1] : 'today';
  const same = lastRoute === ROUTE;
  const y = same ? window.scrollY : 0;
  VIEWS[name](v, m[2]);
  lastRoute = ROUTE;
  window.scrollTo(0, y);
  $$('.tab').forEach(t => t.classList.toggle('on', t.dataset.tab === TAB_OF[name]));
  if (!same) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); }
}

/* nawigacja i wspólne akcje */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g && !e.defaultPrevented) { e.preventDefault(); go(g.dataset.go); return; }
  const b = e.target.closest('[data-back]');
  if (b) { e.preventDefault(); const name = ROUTE.split('-')[0]; go(PARENT[name] || 'today'); return; }
  const w = e.target.closest('[data-word]');
  if (w && !e.target.closest('button:not([data-word])')) { openWordSheet(w.dataset.word); }
});

const pageHead = (title, sub = '', right = '') => `<header class="page-head"><div class="ph-text"><h1 class="display">${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div>${right}</header>`;
const subHead = (eyebrow, title, sub = '', right = '') => `<header class="sub-head"><button class="icon-btn back" data-back aria-label="Wstecz">${icon('back')}</button><div class="sh-text">${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h1 class="display sm">${title}</h1>${sub ? `<div class="muted">${sub}</div>` : ''}</div>${right}</header>`;
function wordRow(id, { edit = false } = {}) {
  const w = getWord(id);
  if (!w) return '';
  return `<div class="word-row" data-word="${id}" role="button" tabindex="0">
    <div class="wr-main"><div class="wr-ru cyr">${esc(w.ru)}</div><div class="wr-pl">${esc(w.pl)}</div></div>
    ${masteryBars(id)}${speakBtn(w.ru, 'sm')}${edit ? `<button class="icon-btn sm" data-edit="${id}" aria-label="Edytuj">${icon('edit')}</button>` : ''}
  </div>`;
}
function catProgress(cat) {
  let learned = 0;
  for (const id of cat.ids) if (S.cards[id]?.s >= 2) learned++;
  return { learned, total: cat.ids.length, pct: cat.ids.length ? learned / cat.ids.length : 0 };
}
function wordOfDay() {
  const ids = [...LIB.words.keys()].filter(id => { const w = LIB.words.get(id); return w.level !== 'B2' && w.pos !== 'phrase'; });
  let h = 7;
  for (const ch of dayKey()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ids[h % ids.length];
}
function weekStrip() {
  const k = dayKey(), now = keyDate(k);
  const dow = (now.getDay() + 6) % 7;
  const labels = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
  return `<div class="week">${labels.map((l, i) => {
    const dk = addDays(k, i - dow), d = S.days[dk];
    const cls = dk > k ? 'future' : d?.goal ? 'goal' : d?.frozen ? 'frozen' : d?.xp ? 'part' : dk === k ? '' : 'miss';
    return `<div class="wd ${cls} ${dk === k ? 'today' : ''}"><span class="wd-dot">${d?.goal ? icon('flame') : d?.frozen ? icon('ice') : ''}</span><small>${l}</small></div>`;
  }).join('')}</div>`;
}

/* ================= DZIŚ ================= */
function vToday(v) {
  const h = new Date().getHours();
  const greet = h < 5 ? ['Доброй ночи', 'Dobrej nocy'] : h < 12 ? ['Доброе утро', 'Dzień dobry'] : h < 18 ? ['Добрый день', 'Dzień dobry'] : ['Добрый вечер', 'Dobry wieczór'];
  const now = new Date();
  const st = streakState(), d = today(), goal = S.settings.goal;
  const due = dueIds();
  const rev = Math.min(due.length, 12);
  const newNext = nextNewWords(Math.min(5, newLeftToday()));
  const nNew = rev >= 10 ? Math.min(2, newNext.length) : newNext.length;
  const has = nNew + rev > 0;
  const cat = currentPathCat();
  const mins = Math.max(2, Math.round((nNew * 4 + rev * 1.3) * 0.22));
  const wid = wordOfDay(), wod = getWord(wid);
  const lv = levelInfo();
  const cp = cat ? catProgress(cat) : null;
  const firstWord = newNext[0] ? getWord(newNext[0]) : null;
  const ctaTitle = nNew && firstWord ? (firstWord.custom ? wordCatName(firstWord) : LIB.catMap[firstWord.cat].name) : 'Powtórka';
  v.innerHTML = `
    <header class="today-head">
      <div class="th-text">
        <div class="eyebrow">${DAYS_PL[now.getDay()]}, ${now.getDate()} ${MONTHS_PL[now.getMonth()]}</div>
        <h1 class="display greet">${greet[0]}</h1>
        <div class="muted">${greet[1]}${S.stats.lessons ? '' : ' — zacznijmy naukę rosyjskiego'}</div>
      </div>
      <button class="streak-chip ${st.today ? 'lit' : st.atRisk ? 'risk' : ''}" data-go="profile" aria-label="Seria: ${st.n} dni">${icon('flame')}<b>${st.n}</b></button>
    </header>

    <section class="card goal-card">
      <div class="goal-top">
        <div class="goal-ring">${ring(d.xp / goal, 78, 8)}<div class="gr-label"><b>${d.xp}</b><small>/ ${goal} XP</small></div></div>
        <div class="goal-text">
          <div class="h3">${d.goal ? 'Cel dnia osiągnięty' : 'Cel dnia'}</div>
          <p class="muted small">${d.goal ? `Seria ${st.n} ${plural(st.n, 'dzień', 'dni', 'dni')}. Wróć jutro, żeby ją przedłużyć.` : st.atRisk ? `Brakuje ${goal - d.xp} XP, żeby uratować serię ${st.n} ${plural(st.n, 'dnia', 'dni', 'dni')}.` : `Zdobądź jeszcze ${goal - d.xp} XP, żeby ${st.n ? 'przedłużyć' : 'zacząć'} serię.`}</p>
          ${S.streak.freezes ? `<div class="freeze-note">${icon('ice')} ${S.streak.freezes} ${plural(S.streak.freezes, 'zamrożenie', 'zamrożenia', 'zamrożeń')} serii w zapasie</div>` : ''}
        </div>
      </div>
      ${weekStrip()}
    </section>

    <section class="cta ${has ? '' : 'done'}">
      ${gzhel('cta-orn')}
      ${has ? `
        <div class="cta-eyebrow">Lekcja na dziś</div>
        <h2 class="cta-title">${esc(ctaTitle)}</h2>
        <div class="cta-meta">${nNew ? `<span>${nNew} ${plural(nNew, 'nowe słowo', 'nowe słowa', 'nowych słów')}</span>` : ''}${rev ? `<span>${rev} ${plural(rev, 'powtórka', 'powtórki', 'powtórek')}</span>` : ''}<span>ok. ${mins} min</span></div>
        <button class="btn btn-light" data-act="lesson">${icon('play')} ${S.stats.lessons ? 'Ucz się' : 'Zacznij pierwszą lekcję'}</button>`
      : `
        <div class="cta-eyebrow">Na dziś wszystko zrobione</div>
        <h2 class="cta-title">Отлично!</h2>
        <div class="cta-meta"><span>Powtórki są aktualne</span><span>limit nowych słów wykorzystany</span></div>
        <div class="cta-btns"><button class="btn btn-light" data-act="extra">${icon('plus')} Dodatkowa lekcja</button><button class="btn btn-ghost-light" data-go="practice">Trening</button></div>`}
    </section>

    <div class="tile-row">
      <button class="tile-btn" data-act="review">
        <span class="tb-ic cobalt">${icon('cards')}</span>
        <span class="tb-text"><b>Fiszki</b><small>${due.length ? `${due.length} do powtórki` : 'brak zaległości'}</small></span>
      </button>
      <button class="tile-btn" data-go="practice">
        <span class="tb-ic gold">${icon('target')}</span>
        <span class="tb-text"><b>Trening</b><small>8 rodzajów ćwiczeń</small></span>
      </button>
    </div>

    ${wod ? `<section class="card wod" data-word="${wid}">
      <div class="wod-head"><span class="eyebrow">Słowo dnia</span><span class="tag">${esc(wod.level)}</span></div>
      <div class="wod-body">
        <div><div class="ru-lg cyr">${esc(wod.ru)}</div>${S.settings.phon ? `<div class="phon">[${phonHtml(wod.ru)}]</div>` : ''}<div class="wod-pl">${esc(wod.pl)}</div></div>
        ${speakBtn(wod.ru, 'lg')}
      </div>
      ${isNewId(wid) ? `<button class="btn btn-soft sm" data-act="wod" data-id="${wid}">${icon('plus')} Naucz się teraz</button>` : `<div class="muted small">${icon('check', 'ok-ic')} Już w nauce · ${MASTERY_LABEL[mastery(wid)]}</div>`}
    </section>` : ''}

    ${cat ? `<section class="card path-card" data-go="cat-${cat.id}">
      <div class="pc-head"><span class="eyebrow">${icon('path')} Twoja ścieżka</span><span class="link">Zmień</span></div>
      <div class="pc-body">${monogram(cat.ru, 'lv-' + cat.level)}<div class="pc-text"><b>${esc(cat.name)}</b><small>${esc(cat.ru)} · ${cp.learned} z ${cp.total} słów</small><span class="pbar"><i style="width:${cp.pct * 100}%"></i></span></div></div>
    </section>` : ''}

    <div class="mini-stats">
      <div><b>${learnedCount()}</b><small>nauczone</small></div>
      <div><b>${masteredCount()}</b><small>opanowane</small></div>
      <div><b>${lv.lvl}</b><small>poziom</small></div>
      <div><b>${S.xp}</b><small>XP łącznie</small></div>
    </div>`;

  v.querySelector('[data-act="lesson"]')?.addEventListener('click', () => { if (!startSession(buildLesson())) toast('Brak słów do nauki — wybierz kategorię w bibliotece'); });
  v.querySelector('[data-act="extra"]')?.addEventListener('click', () => { if (!startSession(buildLesson({ extra: true }))) toast('Wszystkie słowa z Twojej ścieżki są już w nauce. Dodaj kategorie w bibliotece.'); });
  v.querySelector('[data-act="review"]').addEventListener('click', () => { if (!startSession(buildReview())) toast(`${icon('check')} Brak fiszek do powtórki — wszystko aktualne`, 'ok'); });
  v.querySelector('[data-act="wod"]')?.addEventListener('click', e => { e.stopPropagation(); startSession(buildLesson({ focus: { t: 'ids', ids: [e.currentTarget.dataset.id] } })); });
}

/* ================= TRENING ================= */
function practiceSrc() {
  const s = S.settings.practiceSrc;
  if (s && sourceIds(s).length >= 4) return s;
  return sourceIds({ t: 'learning' }).length >= 6 ? { t: 'learning' } : { t: 'cat', id: (currentPathCat() || LIB.cats[0]).id };
}
function vPractice(v) {
  const src = practiceSrc();
  const n = sourceIds(src).length;
  const dueN = dueIds(Date.now(), new Set(sourceIds(src))).length;
  const weak = Object.keys(S.cards).filter(id => S.cards[id].s > 0 && S.cards[id].bad > 0 && getWord(id)).sort((a, b) => weakness(b) - weakness(a)).slice(0, 5);
  const extra = {
    flash: dueN ? `${dueN} do powtórki` : 'przegląd bez oceny',
    match: S.stats.matchBest ? `rekord ${fmtDuration(S.stats.matchBest)}` : MODES.match.desc,
    sprint: S.stats.sprintBest ? `rekord ${S.stats.sprintBest} pkt` : MODES.sprint.desc
  };
  v.innerHTML = `
    ${pageHead('Trening', 'Utrwalaj słowa różnymi sposobami. Wyniki trafiają do systemu powtórek.')}
    <button class="src-picker" data-act="src">
      <span class="sp-ic">${icon('book')}</span>
      <span class="sp-text"><small>Ćwiczysz słowa z</small><b>${esc(sourceLabel(src))}</b></span>
      <span class="sp-count">${n}</span>${icon('chev')}
    </button>
    <div class="mode-grid">
      ${['flash', 'choice', 'type', 'listen', 'scramble', 'match', 'sprint', 'alphabet'].map(m => `
        <button class="mode" data-mode="${m}">
          <span class="mode-ic m-${m}">${icon(MODES[m].icon)}</span>
          <b>${MODES[m].name}</b><small>${extra[m] || MODES[m].desc}</small>
        </button>`).join('')}
    </div>
    ${weak.length ? `<section class="section">
      <div class="sec-head"><h2 class="h2">Najtrudniejsze słowa</h2><button class="link" data-act="weak">Ćwicz je</button></div>
      <div class="word-list card">${weak.map(id => wordRow(id)).join('')}</div>
    </section>` : ''}`;
  $$('.mode', v).forEach(b => b.addEventListener('click', () => {
    const m = b.dataset.mode;
    const s = buildPractice(m, src);
    if (s) s.open();
    else if (m === 'flash') toast('Brak słów w tym źródle', 'bad');
  }));
  $('[data-act="src"]', v).addEventListener('click', () => openSourceSheet(src, s => { S.settings.practiceSrc = s; save(); render(); }));
  $('[data-act="weak"]', v)?.addEventListener('click', () => { S.settings.practiceSrc = { t: 'weak' }; save(); render(); toast('Źródło: najtrudniejsze słowa'); });
}
function openSourceSheet(cur, onPick) {
  const opt = (src, label, count, sub = '') => `<button class="src-opt ${JSON.stringify(src) === JSON.stringify(cur) ? 'on' : ''}" data-src='${esc(JSON.stringify(src))}' ${count < 4 ? 'disabled' : ''}><span><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="count">${count}</span></button>`;
  const learning = sourceIds({ t: 'learning' }).length;
  const html = `<div class="sheet-body"><h3 class="sheet-title">Ćwicz słowa z…</h3><div class="src-list">
    ${opt({ t: 'learning' }, 'Wszystkie moje słowa', learning, 'wszystko, czego się uczysz')}
    ${opt({ t: 'weak' }, 'Najtrudniejsze słowa', Math.min(40, learning), 'najwięcej pomyłek')}
    ${opt({ t: 'fav' }, 'Ulubione', sourceIds({ t: 'fav' }).length)}
    ${S.decks.length ? `<div class="src-group">Moje talie</div>${S.decks.map(d => opt({ t: 'deck', id: d.id }, d.name, sourceIds({ t: 'deck', id: d.id }).length)).join('')}` : ''}
    ${LIB.levels.map(l => `<div class="src-group">${LEVEL_NAMES[l]}</div>${l !== 'PL' ? opt({ t: 'level', id: l }, `Cały poziom ${l}`, sourceIds({ t: 'level', id: l }).length) : ''}${LIB.cats.filter(c => c.level === l).map(c => opt({ t: 'cat', id: c.id }, c.name, c.ids.length, `${c.ru} · nauczone ${catProgress(c).learned}`)).join('')}`).join('')}
  </div></div>`;
  const s = openSheet(html, { cls: 'tall' });
  s.el.addEventListener('click', e => {
    const b = e.target.closest('[data-src]'); if (!b || b.disabled) return;
    onPick(JSON.parse(b.dataset.src)); s.close();
  });
}

/* ================= BIBLIOTEKA ================= */
let libLevel = 'all', libQuery = '';
function vLibrary(v) {
  const levels = [['all', 'Wszystkie'], ['A1', 'A1'], ['A2', 'A2'], ['B1', 'B1'], ['B2', 'B2'], ['PL', 'Pułapki']];
  const cats = LIB.cats.filter(c => libLevel === 'all' || c.level === libLevel);
  let lastLevel = '';
  v.innerHTML = `
    ${pageHead('Biblioteka', `${LIB.size} słów w ${LIB.cats.length} kategoriach · nauczone ${learnedCount()}`)}
    <label class="search">${icon('search')}<input id="lib-search" type="search" placeholder="Szukaj po polsku lub po rosyjsku" autocomplete="off" autocorrect="off" spellcheck="false" value="${esc(libQuery)}"></label>
    <div id="lib-results"></div>
    <div id="lib-browse">
      <div class="chips">${levels.map(([k, l]) => `<button class="chip ${libLevel === k ? 'on' : ''}" data-lvl="${k}">${l}</button>`).join('')}</div>
      <button class="alpha-banner" data-go="alphabet">
        <span class="ab-letters cyr">Аа Бб Вв<br>Гг Дд Жж</span>
        <span class="ab-text"><b>Alfabet i wymowa</b><small>33 litery, zasady czytania, quiz z cyrylicy</small></span>${icon('chev')}
      </button>
      <div class="cat-list">${cats.map(c => {
        const p = catProgress(c);
        const head = c.level !== lastLevel && libLevel === 'all' ? `<div class="lvl-head">${LEVEL_NAMES[c.level]}</div>` : '';
        lastLevel = c.level;
        return `${head}<button class="cat-row" data-go="cat-${c.id}">
          ${monogram(c.ru, 'lv-' + c.level)}
          <span class="cr-main"><b>${esc(c.name)}</b><small class="cyr">${esc(c.ru)}</small><span class="pbar"><i style="width:${p.pct * 100}%"></i></span></span>
          <span class="cr-side"><span class="cr-num"><b>${p.learned}</b> / ${p.total}</span>${S.plan.focus === c.id ? `<span class="tag tag-cobalt">priorytet</span>` : S.plan.skip[c.id] ? `<span class="tag">poza ścieżką</span>` : ''}</span>
        </button>`;
      }).join('')}</div>
    </div>`;
  const inp = $('#lib-search', v), res = $('#lib-results', v), browse = $('#lib-browse', v);
  const run = () => {
    libQuery = inp.value;
    const ids = searchWords(libQuery);
    browse.hidden = !!libQuery.trim();
    res.innerHTML = libQuery.trim() ? (ids.length ? `<div class="muted small res-count">${ids.length >= 60 ? 'Pierwsze 60 wyników' : `${ids.length} ${plural(ids.length, 'wynik', 'wyniki', 'wyników')}`}</div><div class="word-list card">${ids.map(id => wordRow(id)).join('')}</div>` : `<div class="empty small">Nic nie znaleziono dla „${esc(libQuery)}”. Możesz dodać to słowo do własnej talii w zakładce Fiszki.</div>`) : '';
  };
  inp.addEventListener('input', run);
  if (libQuery) run();
  $$('[data-lvl]', v).forEach(b => b.addEventListener('click', () => { libLevel = b.dataset.lvl; render(); }));
}

function vAlphabet(v) {
  const A = window.ALPHABET, R = window.READING_RULES;
  const groups = { same: 'Jak po polsku', false: 'Podobne, ale inne', new: 'Nowe kształty', sign: 'Znaki' };
  v.innerHTML = `
    ${subHead('Cyrylica', 'Alfabet i wymowa', '33 litery · stuknij literę, aby usłyszeć przykład')}
    <button class="btn btn-primary btn-block" data-act="abc-quiz">${icon('play')} Quiz alfabetu</button>
    <div class="legend">${Object.entries(groups).map(([k, l]) => `<span class="lg lg-${k}"><i></i>${l}</span>`).join('')}</div>
    <div class="alpha-grid">${A.map((a, i) => `<button class="alpha g-${a.group}" data-a="${i}"><span class="al-big cyr">${a.up}${a.lo}</span><small>${esc(a.sound)}</small></button>`).join('')}</div>
    <section class="section"><h2 class="h2">Zasady czytania</h2>
      <div class="rules">${R.map((r, i) => `<div class="rule card"><div class="rule-n">${i + 1}</div><div><b>${esc(r.title)}</b><p class="muted small">${esc(r.body)}</p>
        <div class="rule-ex"><span class="cyr">${esc(stressify(r.ex))}</span><span class="phon">[${esc(r.read).replace(/\{(.+?)\}/g, '<b>$1</b>')}]</span>${speakBtn(stressify(r.ex).split(' → ')[0], 'sm')}</div></div></div>`).join('')}</div>
    </section>
    <section class="section card tip">
      <div class="tip-head">${icon('keyboard')}<b>Rosyjska klawiatura na iPhonie</b></div>
      <p class="small muted">Aplikacja ma wbudowaną klawiaturę cyrylicy. Jeśli wolisz systemową: <b>Ustawienia → Ogólne → Klawiatura → Klawiatury → Dodaj nową klawiaturę → Rosyjska</b>. Potem przełącz w aplikacji: Profil → Ustawienia → Klawiatura → Systemowa.</p>
    </section>`;
  $('[data-act="abc-quiz"]', v).addEventListener('click', () => startSession(buildAlphabetQuiz()));
  $$('[data-a]', v).forEach(b => b.addEventListener('click', () => {
    const a = A[+b.dataset.a];
    const ex = stressify(a.ex);
    Speech.speak(ex);
    openSheet(`<div class="sheet-body center letter-sheet">
      <div class="ls-big cyr">${a.up} ${a.lo}</div>
      <div class="tag">${groups[a.group]}</div>
      <div class="ls-sound">czytamy: <b>${esc(a.sound)}</b></div>
      <p class="muted">${esc(a.hint)}</p>
      <div class="ls-ex card"><span class="cyr ru-lg">${esc(ex)}</span>${S.settings.phon ? `<span class="phon">[${phonHtml(ex)}]</span>` : ''}<span>${esc(a.exPl)}</span>${speakBtn(ex, 'lg')}</div>
      <p class="muted small">Nazwa litery: <span class="cyr">${esc(stressify(a.name))}</span> ${speakBtn(stressify(a.name), 'sm')}</p>
      <button class="btn btn-soft btn-block" data-close>Zamknij</button></div>`);
  }));
}

function vCategory(v, id) {
  const cat = LIB.catMap[id];
  if (!cat) return go('library');
  const dist = [0, 0, 0, 0, 0];
  for (const wid of cat.ids) dist[mastery(wid)]++;
  const p = catProgress(cat);
  const newLeft = cat.ids.filter(isNewId).length;
  const colors = ['m0', 'm1', 'm2', 'm3', 'm4'];
  v.innerHTML = `
    ${subHead(`${cat.level === 'PL' ? 'Pułapki' : cat.level} · ${cat.ids.length} słów`, esc(cat.name), `<span class="cyr">${esc(cat.ru)}</span>`)}
    <section class="card cat-card">
      <div class="dist">${dist.map((n, i) => n ? `<i class="${colors[i]}" style="flex:${n}"></i>` : '').join('')}</div>
      <div class="dist-legend">${dist.map((n, i) => `<span><i class="${colors[i]}"></i>${MASTERY_LABEL[i]} <b>${n}</b></span>`).join('')}</div>
      <div class="btn-row">
        <button class="btn btn-primary" data-act="learn">${icon('play')} ${newLeft ? 'Ucz się' : 'Powtórz'}</button>
        <button class="btn btn-soft" data-act="practice">${icon('target')} Ćwicz</button>
        <button class="btn btn-soft" data-act="flash">${icon('cards')} Fiszki</button>
      </div>
      <label class="set-row compact"><span><b>Priorytet w lekcjach dnia</b><small>nowe słowa najpierw z tej kategorii</small></span><input type="checkbox" class="switch" data-act="focus" ${S.plan.focus === id ? 'checked' : ''}></label>
      <label class="set-row compact"><span><b>W ścieżce nauki</b><small>wyłącz, jeśli nie chcesz tych słów w lekcjach</small></span><input type="checkbox" class="switch" data-act="path" ${S.plan.skip[id] ? '' : 'checked'}></label>
    </section>
    <div class="word-list card">${cat.ids.map(wid => wordRow(wid)).join('')}</div>
    ${newLeft ? `<button class="link center-link" data-act="known">Znam już wszystkie słowa z tej kategorii</button>` : ''}`;
  $('[data-act="learn"]', v).addEventListener('click', () => {
    if (!startSession(buildLesson({ focus: { t: 'cat', id } }))) startSession(buildReview({ t: 'cat', id }));
  });
  $('[data-act="practice"]', v).addEventListener('click', () => { S.settings.practiceSrc = { t: 'cat', id }; save(); go('practice'); });
  $('[data-act="flash"]', v).addEventListener('click', () => startSession(buildReview({ t: 'cat', id })));
  $('[data-act="focus"]', v).addEventListener('change', e => { S.plan.focus = e.target.checked ? id : null; save(); toast(e.target.checked ? 'Nowe słowa w lekcjach będą najpierw z tej kategorii' : 'Usunięto priorytet'); });
  $('[data-act="path"]', v).addEventListener('change', e => { if (e.target.checked) delete S.plan.skip[id]; else S.plan.skip[id] = 1; save(); });
  $('[data-act="known"]', v)?.addEventListener('click', async () => {
    if (!await confirmBox({ title: 'Oznaczyć wszystko jako znane?', text: `${newLeft} nowych słów trafi do rzadkich powtórek (co ok. 2 miesiące).`, ok: 'Oznacz jako znane' })) return;
    cat.ids.filter(isNewId).forEach(markKnown);
    checkAchievements(); render();
  });
}

/* ================= SŁOWO ================= */
function openWordSheet(id) {
  const w = getWord(id);
  if (!w) return;
  const c = S.cards[id];
  const m = mastery(id);
  const tot = c ? c.ok + c.bad : 0;
  const next = dueLabel(c);
  const s = openSheet(`<div class="sheet-body word-sheet">
    <div class="ws-top"><span class="eyebrow">${esc(wordCatName(w))}${w.level && w.level !== '★' ? ' · ' + w.level : ''}</span>
      <button class="icon-btn star ${S.fav[id] ? 'on' : ''}" data-act="fav" aria-label="Ulubione">${icon('star')}</button></div>
    <div class="ws-ru cyr">${esc(w.ru)}</div>
    ${S.settings.phon ? `<div class="phon">[${phonHtml(w.ru)}]</div>` : ''}
    <div class="audio-row">${speakBtn(w.ru, 'lg')}${speakBtn(w.ru, 'lg', true)}</div>
    <div class="ws-pl">${esc(w.pl)}</div>
    ${w.note ? `<div class="note">${icon('info')}<span>${esc(w.note)}</span></div>` : ''}
    ${w.ex ? `<div class="example"><div class="ex-ru">${esc(w.ex)} ${speakBtn(w.ex, 'sm')}</div><div class="ex-pl">${esc(w.exPl)}</div></div>` : ''}
    <div class="ws-stats">
      <div><small>Status</small><b>${masteryBars(id)} ${MASTERY_LABEL[m]}</b></div>
      <div><small>Następna powtórka</small><b>${next}</b></div>
      <div><small>Trafność</small><b>${tot ? Math.round(c.ok / tot * 100) + '%' : '—'}</b></div>
    </div>
    <div class="btn-grid">
      <button class="btn btn-soft" data-act="deck">${icon('cards')} Dodaj do talii</button>
      ${m === 0 ? `<button class="btn btn-soft" data-act="known">${icon('check')} Znam to</button><button class="btn btn-primary span2" data-act="learn">${icon('play')} Naucz się teraz</button>`
      : `<button class="btn btn-soft" data-act="reset">${icon('refresh')} Ucz od nowa</button>`}
    </div>
  </div>`);
  const el = s.el;
  $('[data-act="fav"]', el).addEventListener('click', e => {
    if (S.fav[id]) delete S.fav[id]; else S.fav[id] = Date.now();
    e.currentTarget.classList.toggle('on', !!S.fav[id]);
    save(); toast(S.fav[id] ? 'Dodano do ulubionych' : 'Usunięto z ulubionych');
  });
  $('[data-act="deck"]', el).addEventListener('click', () => { s.close(); pickDeckFor(id); });
  $('[data-act="known"]', el)?.addEventListener('click', () => { markKnown(id); checkAchievements(); s.close(); render(); toast('Oznaczono jako znane'); });
  $('[data-act="learn"]', el)?.addEventListener('click', () => { s.close(); startSession(buildLesson({ focus: { t: 'ids', ids: [id] } })); });
  $('[data-act="reset"]', el)?.addEventListener('click', () => { resetCard(id); s.close(); render(); toast('Słowo wróciło do puli nowych'); });
  if (S.settings.autoplay) Speech.speak(w.ru);
}
function pickDeckFor(id) {
  const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">Dodaj do talii</h3><div class="src-list">
    ${S.decks.map(d => `<button class="src-opt" data-deck="${d.id}" ${d.ids.includes(id) ? 'disabled' : ''}><span><b>${esc(d.name)}</b><small>${d.ids.length} słów${d.ids.includes(id) ? ' · już jest' : ''}</small></span></button>`).join('')}
    <button class="src-opt new" data-deck="__new"><span><b>${icon('plus')} Nowa talia</b></span></button></div></div>`);
  s.el.addEventListener('click', async e => {
    const b = e.target.closest('[data-deck]'); if (!b || b.disabled) return;
    let deck;
    if (b.dataset.deck === '__new') { s.close(); const name = await promptBox({ title: 'Nowa talia', label: 'Nazwa', placeholder: 'np. Słówka z serialu' }); if (!name) return; deck = createDeck(name); }
    else { deck = S.decks.find(d => d.id === b.dataset.deck); s.close(); }
    if (!deck.ids.includes(id)) deck.ids.push(id);
    save(); toast(`Dodano do talii „${esc(deck.name)}”`);
    if (ROUTE.startsWith('deck')) render();
  });
}

/* ================= MOJE FISZKI ================= */
function createDeck(name) { const d = { id: uid(), name, ids: [], created: Date.now() }; S.decks.push(d); save(); return d; }
function deckStats(ids) {
  let due = 0, learned = 0; const now = Date.now();
  for (const id of ids) { const c = S.cards[id]; if (isDue(c, now)) due++; if (c?.s >= 2) learned++; }
  return { due, learned };
}
function vDecks(v) {
  const fav = sourceIds({ t: 'fav' });
  const fs = deckStats(fav);
  v.innerHTML = `
    ${pageHead('Moje fiszki', 'Twoje własne talie: słowo po rosyjsku + tłumaczenie', `<button class="btn btn-primary sm" data-act="new">${icon('plus')} Nowa talia</button>`)}
    ${!S.decks.length ? `<section class="card empty-card">
      ${gzhel('empty-orn')}
      <h2 class="h2">Stwórz pierwszą talię</h2>
      <p class="muted">Dodawaj słowa, które spotykasz w filmach, piosenkach czy rozmowach. Twoje fiszki trafią do codziennych lekcji i powtórek razem ze słowami z biblioteki.</p>
      <ol class="steps"><li>Utwórz talię, np. „Słówka z pracy”.</li><li>Wpisz słowo cyrylicą (wbudowana klawiatura) i tłumaczenie.</li><li>Ucz się w lekcjach, fiszkach i ćwiczeniach.</li></ol>
      <button class="btn btn-primary" data-act="new">${icon('plus')} Utwórz talię</button>
    </section>` : ''}
    <div class="deck-list">
      ${S.decks.map(d => { const st = deckStats(d.ids); return `<button class="deck-row" data-go="deck-${d.id}">
        ${monogram(d.name, 'deck')}
        <span class="dr-main"><b>${esc(d.name)}</b><small>${d.ids.length} ${plural(d.ids.length, 'słowo', 'słowa', 'słów')} · nauczone ${st.learned}</small></span>
        ${st.due ? `<span class="tag tag-cobalt">${st.due} do powtórki</span>` : ''}${icon('chev')}
      </button>`; }).join('')}
      <button class="deck-row" data-go="fav">
        <span class="mono fav">${icon('star')}</span>
        <span class="dr-main"><b>Ulubione</b><small>${fav.length} ${plural(fav.length, 'słowo', 'słowa', 'słów')} · gwiazdka przy słowie dodaje je tutaj</small></span>
        ${fs.due ? `<span class="tag tag-cobalt">${fs.due} do powtórki</span>` : ''}${icon('chev')}
      </button>
    </div>`;
  $$('[data-act="new"]', v).forEach(b => b.addEventListener('click', async () => {
    const name = await promptBox({ title: 'Nowa talia', label: 'Nazwa talii', placeholder: 'np. Słówka z serialu', ok: 'Utwórz' });
    if (!name) return;
    const d = createDeck(name);
    go('deck-' + d.id);
  }));
}
function deckActions(ids, src) {
  return `<div class="btn-row">
    <button class="btn btn-primary" data-act="learn" ${ids.length ? '' : 'disabled'}>${icon('play')} Ucz się</button>
    <button class="btn btn-soft" data-act="practice" ${ids.length >= 4 ? '' : 'disabled'}>${icon('target')} Ćwicz</button>
    <button class="btn btn-soft" data-act="flash" ${ids.length ? '' : 'disabled'}>${icon('cards')} Fiszki</button>
  </div>`;
}
function bindDeckActions(v, src) {
  $('[data-act="learn"]', v)?.addEventListener('click', () => { if (!startSession(buildLesson({ focus: src }))) startSession(buildReview(src)); });
  $('[data-act="practice"]', v)?.addEventListener('click', () => { S.settings.practiceSrc = src; save(); go('practice'); });
  $('[data-act="flash"]', v)?.addEventListener('click', () => startSession(buildReview(src)));
}
function vFav(v) {
  const ids = sourceIds({ t: 'fav' });
  v.innerHTML = `${subHead('Moje fiszki', 'Ulubione', `${ids.length} ${plural(ids.length, 'słowo', 'słowa', 'słów')}`)}
    ${deckActions(ids)}
    ${ids.length ? `<div class="word-list card">${ids.map(id => wordRow(id)).join('')}</div>` : `<div class="empty">Stuknij gwiazdkę przy dowolnym słowie w bibliotece, żeby dodać je do ulubionych.</div>`}`;
  bindDeckActions(v, { t: 'fav' });
}
function vDeck(v, id) {
  const deck = S.decks.find(d => d.id === id);
  if (!deck) return go('decks');
  const ids = deck.ids.filter(getWord);
  const builtin = S.settings.keyboard === 'builtin';
  v.innerHTML = `
    ${subHead('Talia', esc(deck.name), `${ids.length} ${plural(ids.length, 'słowo', 'słowa', 'słów')}`, `<button class="icon-btn" data-act="menu" aria-label="Opcje talii">${icon('sliders')}</button>`)}
    ${deckActions(ids)}
    <form class="card add-card" id="add-form" autocomplete="off">
      <div class="h3">Nowa fiszka</div>
      <label class="field"><span>Słowo po rosyjsku</span>
        <div class="input-wrap"><input id="f-ru" class="input cyr" lang="ru" placeholder="например: собака" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ${builtin ? 'inputmode="none"' : ''}>
        <button type="button" class="kb-toggle ${builtin ? 'on' : ''}" data-act="kb" aria-label="Klawiatura cyrylicy">АБВ</button></div></label>
      <div id="f-sugg"></div>
      <label class="field"><span>Tłumaczenie</span><input id="f-pl" class="input" lang="pl" placeholder="np. pies" autocomplete="off"></label>
      <details class="more"><summary>Notatka i przykład (opcjonalnie)</summary>
        <label class="field"><span>Notatka</span><input id="f-note" class="input" placeholder="np. rodzaj żeński, dk: сделать"></label>
        <label class="field"><span>Przykład po rosyjsku</span><input id="f-ex" class="input cyr" lang="ru" placeholder="Это моя собака."></label>
        <label class="field"><span>Tłumaczenie przykładu</span><input id="f-expl" class="input" placeholder="To jest mój pies."></label>
      </details>
      <button class="btn btn-primary btn-block" type="submit">${icon('plus')} Dodaj fiszkę</button>
      <p class="hint">Akcent: wpisz apostrof po samogłosce (собa'ка) albo użyj klawisza ◌́ na wbudowanej klawiaturze.</p>
    </form>
    <div class="row-actions"><button class="btn btn-ghost sm" data-act="import">${icon('up')} Importuj listę</button><button class="btn btn-ghost sm" data-act="export" ${ids.length ? '' : 'disabled'}>${icon('down')} Eksportuj</button></div>
    ${ids.length ? `<div class="word-list card">${ids.slice().reverse().map(wid => wordRow(wid, { edit: true })).join('')}</div>` : `<div class="empty">Talia jest pusta. Dodaj pierwsze słowo powyżej albo zaimportuj całą listę.</div>`}`;
  const src = { t: 'deck', id };
  bindDeckActions(v, src);
  const ru = $('#f-ru', v), pl = $('#f-pl', v), sugg = $('#f-sugg', v);
  let kbEl = null;
  const showKb = on => {
    if (kbEl) { kbEl.remove(); kbEl = null; }
    $('[data-act="kb"]', v).classList.toggle('on', on);
    if (on) {
      ru.setAttribute('inputmode', 'none');
      kbEl = document.createElement('div');
      kbEl.className = 'kb-dock';
      kbEl.appendChild(buildKeyboard({ input: ru, stress: true, enterLabel: 'Dalej', onEnter: () => { showKb(false); pl.focus(); } }));
      document.body.appendChild(kbEl);
      document.body.classList.add('kb-open');
    } else { ru.removeAttribute('inputmode'); document.body.classList.remove('kb-open'); }
  };
  const cleanup = () => { if (kbEl) { kbEl.remove(); kbEl = null; } document.body.classList.remove('kb-open'); };
  window.addEventListener('popstate', cleanup, { once: true });
  v.addEventListener('click', e => { if (e.target.closest('[data-go],[data-back]')) cleanup(); });
  ru.addEventListener('focus', () => { if (S.settings.keyboard === 'builtin' && !kbEl) showKb(true); });
  pl.addEventListener('focus', () => { if (kbEl) showKb(false); });
  $('[data-act="kb"]', v).addEventListener('click', () => { const on = !kbEl; showKb(on); if (!on) { ru.blur(); setTimeout(() => ru.focus(), 50); } else ru.focus(); });
  attachPhysical(ru, () => pl.focus());
  const suggest = () => {
    const q = ru.value.trim() || pl.value.trim();
    if (q.length < 2) { sugg.innerHTML = ''; return; }
    const ids2 = searchWords(q, 4).filter(x => !x.startsWith('u:'));
    sugg.innerHTML = ids2.length ? `<div class="sugg"><small>Z biblioteki (z akcentem i wymową):</small>${ids2.map(x => { const w = getWord(x); const inDeck = deck.ids.includes(x); return `<button type="button" class="sugg-item" data-add="${x}" ${inDeck ? 'disabled' : ''}><span class="cyr">${esc(w.ru)}</span><span class="muted">${esc(w.pl)}</span>${inDeck ? '<small>w talii</small>' : icon('plus')}</button>`; }).join('')}</div>` : '';
  };
  ru.addEventListener('input', suggest); pl.addEventListener('input', suggest);
  sugg.addEventListener('click', e => {
    const b = e.target.closest('[data-add]'); if (!b) return;
    deck.ids.push(b.dataset.add); save(); cleanup();
    toast('Dodano słowo z biblioteki', 'ok'); render();
  });
  $('#add-form', v).addEventListener('submit', e => {
    e.preventDefault();
    const r = ru.value.trim(), p = pl.value.trim();
    if (!r || !isCyr(r)) { toast('Wpisz słowo cyrylicą', 'bad'); ru.focus(); return; }
    if (!p) { toast('Dodaj tłumaczenie', 'bad'); pl.focus(); return; }
    if (deck.ids.some(x => getWord(x) && normRu(getWord(x).ru) === normRu(r))) { toast('To słowo jest już w tej talii', 'bad'); return; }
    addCustomWord(deck, { ru: r, pl: p, note: $('#f-note', v).value, ex: $('#f-ex', v).value, exPl: $('#f-expl', v).value });
    cleanup(); render();
    toast(`${icon('check')} Dodano: ${esc(stressify(r))}`, 'ok');
    setTimeout(() => $('#f-ru')?.focus(), 80);
  });
  $('[data-act="import"]', v).addEventListener('click', () => { cleanup(); openImport(deck); });
  $('[data-act="export"]', v).addEventListener('click', () => exportDeck(deck));
  $('[data-act="menu"]', v).addEventListener('click', () => {
    const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">${esc(deck.name)}</h3><div class="btn-col">
      <button class="btn btn-soft" data-m="rename">${icon('edit')} Zmień nazwę</button>
      <button class="btn btn-danger" data-m="delete">${icon('trash')} Usuń talię</button>
      <button class="btn btn-ghost" data-close>Anuluj</button></div></div>`);
    s.el.addEventListener('click', async e => {
      const b = e.target.closest('[data-m]'); if (!b) return;
      s.close();
      if (b.dataset.m === 'rename') { const n = await promptBox({ title: 'Zmień nazwę', label: 'Nazwa talii', value: deck.name }); if (n) { deck.name = n; save(); render(); } }
      else if (await confirmBox({ title: 'Usunąć talię?', text: 'Własne fiszki z tej talii i ich postęp zostaną usunięte. Słowa z biblioteki zostają.', ok: 'Usuń', danger: true })) {
        for (const x of deck.ids) if (x.startsWith('u:') && !S.decks.some(d => d !== deck && d.ids.includes(x))) { delete S.custom[x]; delete S.cards[x]; delete S.fav[x]; }
        S.decks = S.decks.filter(d => d !== deck); save(); go('decks');
      }
    });
  });
  $$('[data-edit]', v).forEach(b => b.addEventListener('click', e => { e.stopPropagation(); cleanup(); editDeckWord(deck, b.dataset.edit); }));
}
function addCustomWord(deck, { ru, pl, note = '', ex = '', exPl = '' }) {
  const id = 'u:' + uid();
  S.custom[id] = { id, ru: stressify(ru.trim()), pl: pl.trim(), note: stressify(note.trim()), ex: stressify(ex.trim()), exPl: exPl.trim(), added: Date.now() };
  deck.ids.push(id);
  save(); checkAchievements();
  return id;
}
function editDeckWord(deck, id) {
  const w = getWord(id);
  if (!w) return;
  if (!w.custom) {
    const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title cyr">${esc(w.ru)}</h3><p class="muted center">${esc(w.pl)}</p><p class="small muted center">To słowo pochodzi z biblioteki, więc nie można go edytować.</p><div class="btn-col"><button class="btn btn-danger" data-rm>${icon('trash')} Usuń z talii</button><button class="btn btn-ghost" data-close>Anuluj</button></div></div>`);
    $('[data-rm]', s.el).addEventListener('click', () => { deck.ids = deck.ids.filter(x => x !== id); save(); s.close(); render(); });
    return;
  }
  const raw = S.custom[id];
  const s = openSheet(`<form class="sheet-body" id="edit-form"><h3 class="sheet-title">Edytuj fiszkę</h3>
    <label class="field"><span>Po rosyjsku</span><input class="input cyr" name="ru" value="${esc(raw.ru)}" lang="ru" autocomplete="off"></label>
    <label class="field"><span>Tłumaczenie</span><input class="input" name="pl" value="${esc(raw.pl)}" autocomplete="off"></label>
    <label class="field"><span>Notatka</span><input class="input" name="note" value="${esc(raw.note)}" autocomplete="off"></label>
    <label class="field"><span>Przykład</span><input class="input cyr" name="ex" value="${esc(raw.ex)}" autocomplete="off"></label>
    <label class="field"><span>Tłumaczenie przykładu</span><input class="input" name="exPl" value="${esc(raw.exPl)}" autocomplete="off"></label>
    <div class="btn-col"><button class="btn btn-primary" type="submit">Zapisz</button><button class="btn btn-danger" type="button" data-del>${icon('trash')} Usuń fiszkę</button></div></form>`);
  const f = $('#edit-form', s.el);
  attachPhysical(f.ru, () => f.pl.focus());
  f.addEventListener('submit', e => {
    e.preventDefault();
    if (!isCyr(f.ru.value) || !f.pl.value.trim()) { toast('Uzupełnij słowo i tłumaczenie', 'bad'); return; }
    Object.assign(raw, { ru: stressify(f.ru.value.trim()), pl: f.pl.value.trim(), note: stressify(f.note.value.trim()), ex: stressify(f.ex.value.trim()), exPl: f.exPl.value.trim() });
    save(); s.close(); render(); toast('Zapisano');
  });
  $('[data-del]', s.el).addEventListener('click', async () => {
    s.close();
    if (!await confirmBox({ title: 'Usunąć fiszkę?', text: esc(raw.ru), ok: 'Usuń', danger: true })) return;
    deck.ids = deck.ids.filter(x => x !== id);
    if (!S.decks.some(d => d.ids.includes(id))) { delete S.custom[id]; delete S.cards[id]; delete S.fav[id]; }
    save(); render();
  });
}
function parseImport(text) {
  const rows = [];
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    let parts = null;
    for (const sep of ['\t', '|', ';', ' — ', ' – ', ' - ', ' = ', ':', ',']) if (line.includes(sep)) { parts = line.split(sep).map(x => x.trim()); break; }
    if (!parts || parts.length < 2) continue;
    let [a, b, note = '', ex = '', exPl = ''] = parts;
    if (!isCyr(a) && isCyr(b)) [a, b] = [b, a];
    if (!isCyr(a) || !b) continue;
    rows.push({ ru: a, pl: b, note, ex, exPl });
  }
  return rows;
}
function openImport(deck) {
  const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">Importuj listę słów</h3>
    <p class="small muted">Jedno słowo w linii: rosyjski i polski oddzielone średnikiem, tabulatorem, myślnikiem lub znakiem |. Możesz wkleić kolumny z Excela lub Google Sheets.</p>
    <textarea id="imp-text" class="input area" rows="8" placeholder="собака - pies&#10;ко'шка; kot&#10;дом | dom"></textarea>
    <div id="imp-prev" class="small muted"></div>
    <div class="btn-col"><button class="btn btn-primary" data-imp disabled>Dodaj</button><button class="btn btn-ghost" data-close>Anuluj</button></div></div>`, { cls: 'tall' });
  const ta = $('#imp-text', s.el), prev = $('#imp-prev', s.el), btn = $('[data-imp]', s.el);
  ta.addEventListener('input', () => {
    const rows = parseImport(ta.value);
    btn.disabled = !rows.length;
    btn.textContent = rows.length ? `Dodaj ${rows.length} ${plural(rows.length, 'fiszkę', 'fiszki', 'fiszek')}` : 'Dodaj';
    prev.innerHTML = rows.slice(0, 3).map(r => `<div><span class="cyr">${esc(stressify(r.ru))}</span> → ${esc(r.pl)}</div>`).join('') + (rows.length > 3 ? `<div>…i ${rows.length - 3} więcej</div>` : '');
  });
  btn.addEventListener('click', () => {
    const rows = parseImport(ta.value);
    let added = 0;
    for (const r of rows) {
      if (deck.ids.some(x => getWord(x) && normRu(getWord(x).ru) === normRu(r.ru))) continue;
      addCustomWord(deck, r); added++;
    }
    s.close(); render();
    toast(`Zaimportowano ${added} ${plural(added, 'fiszkę', 'fiszki', 'fiszek')}`, 'ok');
  });
}
function exportDeck(deck) {
  const toApos = t => String(t || '').replace(/́/g, "'");
  const lines = deck.ids.map(getWord).filter(Boolean).map(w => [toApos(w.ru), w.pl, toApos(w.note), toApos(w.ex), w.exPl].join(';').replace(/;+$/, ''));
  const text = lines.join('\n');
  const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">Eksport talii</h3><p class="small muted">Format: rosyjski;polski;notatka;przykład;tłumaczenie przykładu. Akcent zapisany jako apostrof.</p>
    <textarea class="input area" rows="8" readonly>${esc(text)}</textarea>
    <div class="btn-col"><button class="btn btn-primary" data-copy>${icon('copy')} Kopiuj</button><button class="btn btn-soft" data-dl>${icon('down')} Pobierz plik .csv</button><button class="btn btn-ghost" data-close>Zamknij</button></div></div>`, { cls: 'tall' });
  $('[data-copy]', s.el).addEventListener('click', () => copyText(text, $('textarea', s.el)));
  $('[data-dl]', s.el).addEventListener('click', () => downloadFile(`${deck.name.replace(/[^\p{L}\p{N}]+/gu, '-')}.csv`, '﻿' + text, 'text/csv'));
}
function copyText(text, fallbackEl) {
  const ok = () => toast('Skopiowano do schowka', 'ok');
  const fail = () => { if (fallbackEl) { fallbackEl.focus(); fallbackEl.select(); } toast('Zaznaczono tekst — skopiuj go ręcznie'); };
  try { navigator.clipboard.writeText(text).then(ok, fail); } catch (e) { fail(); }
}
function downloadFile(name, content, type) {
  try {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const a = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (e) { toast('Pobieranie nie jest dostępne — użyj kopiowania', 'bad'); }
}

/* ================= PROFIL ================= */
function vProfile(v) {
  const lv = levelInfo(), st = streakState();
  const totOk = Object.values(S.days).reduce((a, d) => a + (d.ok || 0), 0), totBad = Object.values(S.days).reduce((a, d) => a + (d.bad || 0), 0);
  const acc = totOk + totBad ? Math.round(totOk / (totOk + totBad) * 100) : 0;
  const mins = Math.round(Object.values(S.days).reduce((a, d) => a + (d.ms || 0), 0) / MIN);
  const k = dayKey();
  const days7 = Array.from({ length: 7 }, (_, i) => addDays(k, i - 6));
  const xp7 = days7.map(dk => S.days[dk]?.xp || 0);
  const now = Date.now(), t0 = dayStart(now);
  const fc = Array(7).fill(0);
  for (const id in S.cards) { const c = S.cards[id]; if (c.s > 0 && getWord(id)) { const i = Math.max(0, Math.floor((dayStart(c.due) - t0) / DAY)); if (i < 7) fc[i]++; } }
  const unlocked = ACH.filter(a => S.ach[a.id]).length;
  v.innerHTML = `
    ${pageHead('Profil', '', `<button class="icon-btn" data-go="settings" aria-label="Ustawienia">${icon('sliders')}</button>`)}
    <section class="card level-card">
      <div class="lc-top"><div class="lc-badge"><small>poziom</small><b>${lv.lvl}</b></div>
      <div class="lc-text"><b>${S.xp} XP</b><small>${lv.need - lv.into} XP do poziomu ${lv.lvl + 1}</small><span class="pbar gold"><i style="width:${lv.pct * 100}%"></i></span></div></div>
    </section>
    <section class="card streak-card ${st.today ? 'lit' : ''}">
      <div class="sc-flame">${icon('flame')}</div>
      <div class="sc-text"><b>${st.n} ${plural(st.n, 'dzień', 'dni', 'dni')} z rzędu</b><small>Rekord: ${S.streak.best} · seria rośnie, gdy osiągniesz cel dnia (${S.settings.goal} XP)</small></div>
      <div class="sc-freeze" title="Zamrożenia serii">${[0, 1].map(i => `<span class="${i < S.streak.freezes ? 'on' : ''}">${icon('ice')}</span>`).join('')}</div>
    </section>
    <p class="small muted pad">Co 7 dni serii dostajesz zamrożenie (maks. 2). Chroni ono serię, jeśli opuścisz dzień.</p>
    <div class="stat-grid">
      <div class="stat"><b>${learnedCount()}</b><small>nauczonych słów</small></div>
      <div class="stat"><b>${masteredCount()}</b><small>opanowanych</small></div>
      <div class="stat"><b>${inProgressCount()}</b><small>w trakcie nauki</small></div>
      <div class="stat"><b>${acc ? acc + '%' : '—'}</b><small>skuteczność</small></div>
      <div class="stat"><b>${S.stats.lessons}</b><small>lekcji</small></div>
      <div class="stat"><b>${mins >= 60 ? Math.floor(mins / 60) + ' h ' + (mins % 60) + ' min' : mins + ' min'}</b><small>czasu nauki</small></div>
    </div>
    <section class="card"><div class="sec-head"><h2 class="h3">Aktywność</h2><span class="muted small">ostatnie 17 tygodni</span></div>${heatmap()}</section>
    <section class="card"><div class="sec-head"><h2 class="h3">XP w ostatnim tygodniu</h2><span class="muted small">cel ${S.settings.goal}</span></div>${barChart(xp7, days7.map(dk => ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'][keyDate(dk).getDay()]), S.settings.goal, 'xp')}</section>
    <section class="card"><div class="sec-head"><h2 class="h3">Prognoza powtórek</h2><span class="muted small">najbliższe 7 dni</span></div>${barChart(fc, ['dziś', 'jutro', ...Array.from({ length: 5 }, (_, i) => ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'][keyDate(addDays(k, i + 2)).getDay()])], 0, 'fc')}</section>
    <section class="section"><div class="sec-head"><h2 class="h2">Osiągnięcia</h2><span class="muted small">${unlocked} / ${ACH.length}</span></div>
      <div class="ach-grid">${ACH.map(a => `<div class="ach ${S.ach[a.id] ? 'on' : ''}"><span class="ach-ic">${icon(a.icon)}</span><b>${a.name}</b><small>${a.desc}</small></div>`).join('')}</div>
    </section>
    <button class="btn btn-soft btn-block" data-go="settings">${icon('sliders')} Ustawienia i kopia zapasowa</button>`;
}
function heatmap() {
  const k = dayKey(), today0 = keyDate(k);
  const dow = (today0.getDay() + 6) % 7;
  const start = addDays(k, -dow - 16 * 7);
  const lvl = xp => !xp ? 0 : xp < 15 ? 1 : xp < S.settings.goal ? 2 : xp < S.settings.goal * 2 ? 3 : 4;
  let cells = '';
  for (let w = 0; w < 17; w++) for (let d = 0; d < 7; d++) {
    const dk = addDays(start, w * 7 + d);
    const day = S.days[dk];
    const cls = dk > k ? 'fut' : day?.frozen && !day?.xp ? 'ice' : 'h' + lvl(day?.xp);
    cells += `<i class="${cls} ${dk === k ? 'now' : ''}" style="grid-column:${w + 1};grid-row:${d + 1}" title="${dk}: ${day?.xp || 0} XP"></i>`;
  }
  return `<div class="heat">${cells}</div><div class="heat-legend"><span>mniej</span><i class="h0"></i><i class="h1"></i><i class="h2"></i><i class="h3"></i><i class="h4"></i><span>więcej</span><i class="ice"></i><span>zamrożenie</span></div>`;
}
function barChart(vals, labels, goal, kind) {
  const W = 320, H = 150, pad = 22, bw = 26, max = Math.max(goal * 1.15, ...vals, 1);
  const gap = (W - pad * 2) / vals.length;
  const y = v => H - 24 - (v / max) * (H - 48);
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Wykres">
    <line x1="${pad}" x2="${W - pad}" y1="${H - 24}" y2="${H - 24}" class="ch-axis"/>
    ${goal ? `<line x1="${pad}" x2="${W - pad}" y1="${y(goal)}" y2="${y(goal)}" class="ch-goal"/>` : ''}
    ${vals.map((v, i) => { const x = pad + gap * i + (gap - bw) / 2; const yy = y(v); return `<rect x="${x}" y="${yy}" width="${bw}" height="${Math.max(0, H - 24 - yy)}" rx="5" class="ch-bar ${kind} ${goal && v >= goal ? 'hit' : ''} ${i === (kind === 'xp' ? vals.length - 1 : 0) ? 'cur' : ''}"/>${v ? `<text x="${x + bw / 2}" y="${yy - 6}" class="ch-val">${v}</text>` : ''}<text x="${x + bw / 2}" y="${H - 7}" class="ch-lbl">${labels[i]}</text>`; }).join('')}
  </svg>`;
}

/* ================= USTAWIENIA ================= */
function vSettings(v) {
  const s = S.settings;
  const seg = (key, opts) => `<div class="seg" data-seg="${key}">${opts.map(([val, l]) => `<button type="button" class="${String(s[key]) === String(val) ? 'on' : ''}" data-v="${val}">${l}</button>`).join('')}</div>`;
  const sw = (key, title, sub = '') => `<label class="set-row"><span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span><input type="checkbox" class="switch" data-sw="${key}" ${s[key] ? 'checked' : ''}></label>`;
  const voices = Speech.voices;
  v.innerHTML = `
    ${subHead('Profil', 'Ustawienia')}
    <section class="set-group"><h2 class="set-title">Nauka</h2>
      <div class="set-block"><b>Cel dzienny</b><small>Seria rośnie każdego dnia, w którym go osiągniesz</small>${seg('goal', [[10, 'Luźno<small>10 XP</small>'], [30, 'Normalnie<small>30 XP</small>'], [50, 'Poważnie<small>50 XP</small>'], [100, 'Intensywnie<small>100 XP</small>']])}</div>
      <div class="set-block"><b>Nowe słowa dziennie</b><small>Więcej nowych słów to także więcej powtórek w kolejnych dniach</small>${seg('newPerDay', [[5, '5'], [10, '10'], [15, '15'], [20, '20'], [30, '30']])}</div>
      ${sw('decksFirst', 'Najpierw moje fiszki', 'nowe słowa z Twoich talii trafiają do lekcji przed biblioteką')}
      <div class="set-block"><b>Kierunek fiszek</b>${seg('flashDir', [['ru-pl', 'RU → PL'], ['pl-ru', 'PL → RU'], ['mix', 'Losowo']])}</div>
    </section>
    <section class="set-group"><h2 class="set-title">Wymowa</h2>
      ${sw('autoplay', 'Automatyczne odtwarzanie', 'czytaj słowa na głos podczas nauki')}
      ${sw('phon', 'Pokazuj wymowę', 'zapis fonetyczny po polsku, np. [małakó]')}
      <div class="set-block"><b>Tempo mowy</b><div class="range-row"><input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${s.rate}"><span id="rate-v">${s.rate.toFixed(2)}×</span>${speakBtn('Здравствуйте! Как у вас дела?')}</div></div>
      ${voices.length > 1 ? `<div class="set-block"><b>Głos</b><select id="voice" class="input">${voices.map(x => `<option value="${esc(x.voiceURI)}" ${Speech.voice === x ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>` : ''}
      ${!Speech.ok || !voices.length ? `<p class="small muted pad">${Speech.ok ? 'Nie wykryto rosyjskiego głosu. Na iPhonie: Ustawienia → Dostępność → Treść mówiona → Głosy → Rosyjski.' : 'Ta przeglądarka nie obsługuje syntezy mowy.'}</p>` : ''}
    </section>
    <section class="set-group"><h2 class="set-title">Ćwiczenia i wygląd</h2>
      <div class="set-block"><b>Klawiatura do pisania cyrylicą</b><small>Wbudowana działa bez instalowania rosyjskiej klawiatury</small>${seg('keyboard', [['builtin', 'Wbudowana'], ['system', 'Systemowa']])}</div>
      ${sw('sounds', 'Dźwięki', 'sygnały dobrej i złej odpowiedzi')}
      <div class="set-block"><b>Motyw</b>${seg('theme', [['auto', 'Automatyczny'], ['light', 'Jasny'], ['dark', 'Ciemny']])}</div>
    </section>
    <section class="set-group"><h2 class="set-title">Twoje dane</h2>
      <p class="small muted pad">Postęp jest zapisany w tym urządzeniu${storageOk ? '' : ' — <b>uwaga: zapis jest teraz niedostępny</b>'}. Rób kopię zapasową, zanim zmienisz telefon lub wyczyścisz dane przeglądarki.</p>
      <div class="btn-col">
        <button class="btn btn-soft" data-act="backup">${icon('down')} Zapisz kopię zapasową</button>
        <button class="btn btn-soft" data-act="restore">${icon('up')} Przywróć z kopii</button>
        <button class="btn btn-ghost danger-text" data-act="reset">${icon('trash')} Wyczyść cały postęp</button>
      </div>
    </section>
    <section class="set-group"><h2 class="set-title">Aplikacja</h2>
      <button class="set-row link-row" data-act="install"><span><b>Zainstaluj na iPhonie</b><small>ikona na ekranie początkowym, działa offline</small></span>${icon('chev')}</button>
      <div class="about small muted">Привет! · ${LIB.size} słów w ${LIB.cats.length} kategoriach · system powtórek SM-2 · wersja ${APP_VERSION}</div>
    </section>`;
  $$('[data-seg]', v).forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const key = g.dataset.seg;
    const val = typeof DEFAULT_SETTINGS[key] === 'number' ? +b.dataset.v : b.dataset.v;
    S.settings[key] = val;
    if (key === 'goal') { const d = today(); if (!d.goal && d.xp >= val) { d.goal = true; goalReached(); } }
    if (key === 'theme') applyTheme();
    save(); render();
  }));
  $$('[data-sw]', v).forEach(i => i.addEventListener('change', () => { S.settings[i.dataset.sw] = i.checked; save(); }));
  const r = $('#rate', v);
  r.addEventListener('input', () => { S.settings.rate = +r.value; $('#rate-v', v).textContent = (+r.value).toFixed(2) + '×'; save(); });
  $('#voice', v)?.addEventListener('change', e => { S.settings.voice = e.target.value; Speech.pick(); save(); Speech.speak('Привет! Как дела?'); });
  $('[data-act="backup"]', v).addEventListener('click', openBackup);
  $('[data-act="restore"]', v).addEventListener('click', openRestore);
  $('[data-act="install"]', v).addEventListener('click', openInstall);
  $('[data-act="reset"]', v).addEventListener('click', async () => {
    if (!await confirmBox({ title: 'Wyczyścić cały postęp?', text: 'Usunie to serię, XP, historię powtórek i własne talie. Tej operacji nie można cofnąć.', ok: 'Wyczyść wszystko', danger: true })) return;
    const keep = { ...S.settings };
    S = defaultState(); S.settings = keep; S.seenIntro = true;
    saveNow(); go('today'); toast('Postęp wyczyszczony');
  });
}
function openBackup() {
  const data = JSON.stringify(S);
  const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">Kopia zapasowa</h3>
    <p class="small muted">Zapisz plik w aplikacji Pliki lub skopiuj tekst (np. do notatek). Kopia zawiera serię, XP, postęp wszystkich słów i Twoje talie.</p>
    <div class="btn-col"><button class="btn btn-primary" data-dl>${icon('down')} Pobierz plik</button><button class="btn btn-soft" data-copy>${icon('copy')} Kopiuj jako tekst</button><button class="btn btn-ghost" data-close>Zamknij</button></div>
    <textarea class="input area hidden-area" rows="3" readonly>${esc(data)}</textarea></div>`);
  $('[data-dl]', s.el).addEventListener('click', () => downloadFile(`privet-kopia-${dayKey()}.json`, data, 'application/json'));
  $('[data-copy]', s.el).addEventListener('click', () => { const ta = $('textarea', s.el); ta.classList.remove('hidden-area'); copyText(data, ta); });
}
function openRestore() {
  const s = openSheet(`<div class="sheet-body"><h3 class="sheet-title">Przywróć z kopii</h3>
    <p class="small muted">Wybierz plik kopii (.json) albo wklej skopiowany tekst. Obecny postęp zostanie zastąpiony.</p>
    <label class="btn btn-soft file-btn">${icon('up')} Wybierz plik<input type="file" accept=".json,application/json,text/plain" hidden></label>
    <textarea class="input area" rows="5" placeholder="…lub wklej tutaj tekst kopii"></textarea>
    <div class="btn-col"><button class="btn btn-primary" data-restore disabled>Przywróć</button><button class="btn btn-ghost" data-close>Anuluj</button></div></div>`, { cls: 'tall' });
  const ta = $('textarea', s.el), btn = $('[data-restore]', s.el);
  ta.addEventListener('input', () => { btn.disabled = !ta.value.trim(); });
  $('input[type=file]', s.el).addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { ta.value = rd.result; btn.disabled = false; };
    rd.readAsText(f);
  });
  btn.addEventListener('click', async () => {
    let data;
    try { data = JSON.parse(ta.value); } catch (e) { toast('To nie jest poprawna kopia zapasowa', 'bad'); return; }
    if (!data || typeof data !== 'object' || !data.cards || !data.settings) { toast('Plik nie zawiera danych aplikacji', 'bad'); return; }
    s.close();
    if (!await confirmBox({ title: 'Zastąpić obecny postęp?', text: `Kopia: ${Object.keys(data.cards).length} słów w nauce, ${data.xp || 0} XP.`, ok: 'Przywróć' })) return;
    S = migrate(data); saveNow(); applyTheme(); Speech.pick(); go('today'); toast('Przywrócono kopię', 'ok');
  });
}
function openInstall() {
  const standalone = navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  openSheet(`<div class="sheet-body install">
    <h3 class="sheet-title">Aplikacja na iPhonie</h3>
    ${standalone ? `<p class="center ok-text">${icon('check')} Aplikacja jest już zainstalowana na ekranie początkowym.</p>` : ''}
    <ol class="install-steps">
      <li><span class="is-n">1</span><span>Otwórz tę stronę w <b>Safari</b>.</span></li>
      <li><span class="is-n">2</span><span>Stuknij <b>Udostępnij</b> <span class="inline-ic">${icon('share')}</span> na dolnym pasku.</span></li>
      <li><span class="is-n">3</span><span>Przewiń w dół i wybierz <b>Do ekranu początkowego</b>.</span></li>
      <li><span class="is-n">4</span><span>Stuknij <b>Dodaj</b>. Ikona <b>Привет</b> pojawi się na ekranie.</span></li>
    </ol>
    <p class="small muted">Aplikacja działa offline i otwiera się na pełnym ekranie, bez paska Safari. Postęp zapisuje się w telefonie.</p>
    <button class="btn btn-primary btn-block" data-close>Rozumiem</button></div>`);
}

const VIEWS = { today: vToday, practice: vPractice, library: vLibrary, alphabet: vAlphabet, cat: vCategory, decks: vDecks, fav: vFav, deck: vDeck, profile: vProfile, settings: vSettings };
