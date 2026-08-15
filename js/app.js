(function () {
/* ============================================================
   RUBLYA — router, widoki, silnik sesji
   ============================================================ */

const $ = (s, r) => (r || document).querySelector(s);
const ST = () => Store.s;
const { h, esc, shuffle, pick, fmtTime, bar, ring, countUp } = UI;
const CYR = /[а-яА-ЯёЁ]/;

/* Most dla pozostałych plików z widokami — rejestrują tu swoje ekrany
   i tryby sesji, zamiast puchnąć razem z tym plikiem. */
const App = window.App = {
  VIEWS: {},
  KINDS: {},
  get view() { return view; },
  get session() { return session; },
  resetView: (c) => resetView(c),
  render: () => render(),
  go: (r) => go(r),
  newSession: (cfg) => newSession(cfg),
  advance: (d) => advance(d),
  scoreAnswer: (ok, id) => scoreAnswer(ok, id),
  sessTop: () => sessTop(),
  tile: (a, b, c, d) => tile(a, b, c, d),
  wireCommon: () => wireCommon(),
  choiceItem: (w, dir) => choiceItem(w, dir),
  itemForWord: (w) => itemForWord(w),
  CYR,
};

let view = null;      // kontener treści
let route = '';       // aktualna trasa
let session = null;   // aktywna sesja nauki

/* ============================================================
   NAWIGACJA
   ============================================================ */

const NAV = [
  { r: 'home',   ico: 'П', label: 'Pulpit' },
  { r: 'path',   ico: '↗', label: 'Ścieżka' },
  { r: 'quests', ico: '✦', label: 'Zadania' },
  { r: 'train',  ico: 'Т', label: 'Trening' },
  { r: 'dict',   ico: '≡', label: 'Słownik' },
  { r: 'shop',   ico: '₽', label: 'Sklep' },
  { r: 'notes',  ico: 'З', label: 'Notatki' },
  { r: 'stats',  ico: '▦', label: 'Postępy' },
];

/* Trasy, które nie mają własnej pozycji w menu, ale podświetlają rodzica */
const NAV_PARENT = {
  vocab: 'train', grammar: 'train', refs: 'train',
  keyboard: 'train', sentences: 'train', reading: 'train',
  translator: 'train',
};

function go(r) {
  location.hash = '#/' + r;
}

function currentRoute() {
  return (location.hash || '#/home').replace(/^#\//, '');
}

window.addEventListener('hashchange', () => {
  const next = currentRoute();
  if (session && !next.startsWith('session')) { stopClock(); session = null; }
  render();
});

/* ============================================================
   SZKIELET
   ============================================================ */

function buildShell() {
  document.body.innerHTML = '';
  const app = h('<div id="app"></div>');

  const rail = h(
    '<aside class="rail">' +
      '<div class="brand">' +
        '<div class="brand-mark">РУБ<span>ЛЯ</span></div>' +
        '<div class="brand-sub">rublya · rosyjski krok po kroku</div>' +
      '</div>' +
      '<nav class="nav" id="nav"></nav>' +
      '<div class="rail-foot" id="railfoot"></div>' +
    '</aside>'
  );

  const main = h(
    '<div class="main">' +
      '<header class="hud" id="hud"></header>' +
      '<main class="view" id="view"></main>' +
    '</div>'
  );

  app.appendChild(rail);
  app.appendChild(main);
  document.body.appendChild(app);
  view = $('#view');

  $('#nav').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (b) go(b.dataset.r);
  });
}

function paintNav() {
  const due = Store.dueCount();
  const base = route.split('/')[0];
  const active = NAV_PARENT[base] || base;
  const questsLeft = Store.dailyQuests().filter((q) => !Store.questClaimed(q)).length;

  $('#nav').innerHTML = NAV.map((n) => {
    const on = active === n.r;
    const count = n.r === 'train' ? due : n.r === 'quests' ? questsLeft : 0;
    const badge = count ? '<span class="nav-badge">' + count + '</span>' : '';
    return (
      '<button class="nav-item' + (on ? ' on' : '') + '" data-r="' + n.r + '">' +
        '<span class="ico">' + n.ico + '</span>' +
        '<span>' + n.label + '</span>' + badge +
      '</button>'
    );
  }).join('');

  const p = Store.pathProgress();
  $('#railfoot').innerHTML = 'ścieżka ' + p.done + '/' + p.total + ' · ' + p.pct + '%';

  /* Na telefonie osiem pozycji nie mieści się w pasku i trzy ostatnie
     leżą poza kadrem. Bez tego wejście w „Postępy" wyglądało tak, jakby
     nic się nie podświetliło — zaznaczona pozycja była po prostu poza
     zasięgiem wzroku. Dociągamy ją do widoku. */
  const aktywna = $('#nav .nav-item.on');
  if (aktywna && aktywna.scrollIntoView) {
    aktywna.scrollIntoView({ block: 'nearest', inline: 'center', behavior: UI.reduced ? 'auto' : 'smooth' });
  }
}

function paintHud() {
  const s = ST();
  const lv = Store.levelInfo(s.xp);
  const alive = Store.streakAlive();
  const dc = Store.todayCount();
  const goalPct = Math.min(100, Math.round((dc / s.dailyGoal) * 100));

  $('#hud').innerHTML =
    '<div class="hud-stat" title="Passa dni nauki">' +
      '<span class="k' + (alive && s.streak > 0 ? ' redc' : '') + '">' +
        '<span class="flame' + (alive && s.streak > 0 ? ' live' : '') + '">▲</span> ' + s.streak + '</span>' +
      '<span class="l">passa</span>' +
    '</div>' +
    '<div class="hud-stat" title="Słówka w pamięci długotrwałej">' +
      '<span class="k">' + Store.knownCount() + '</span>' +
      '<span class="l">słów</span>' +
    '</div>' +
    '<div class="hud-xp">' +
      '<div class="hud-xp-top"><span>' + lv.rank + ' · poz. ' + lv.lvl + '</span>' +
      '<span>' + lv.rest + '/' + lv.need + '</span></div>' +
      bar(lv.pct) +
    '</div>' +
    '<div style="margin-left:auto;display:flex;align-items:center;gap:10px">' +
      '<span class="hud-save" id="hudsave" title="Stan zapisu w bazie"></span>' +
      '<div class="hud-stat" style="text-align:right"><span class="k">' + dc + '<span class="dim" style="font-size:14px">/' + s.dailyGoal + '</span></span>' +
      '<span class="l">dziś</span></div>' +
      ring(goalPct, goalPct >= 100 ? '✓' : goalPct + '%', goalPct >= 100) +
    '</div>' +
    /* Zębatka musi być bezpośrednim dzieckiem paska, nie siedzieć w jego
       wnętrzu — inaczej przy przewijaniu w bok wyjeżdża razem z całym
       pojemnikiem i staje się nieosiągalna. */
    '<button class="hud-gear" id="hudgear" title="Ustawienia" aria-label="Ustawienia">⚙</button>';

  const gear = $('#hudgear');
  if (gear) gear.addEventListener('click', () => go('settings'));

  paintSave(API.status);
}

/* Kropka stanu zapisu. Skoro postęp mieszka na serwerze, użytkownik ma
   prawo widzieć, czy właśnie tam dotarł — zwłaszcza przed zamknięciem karty. */
function paintSave(stan) {
  const el = document.getElementById('hudsave');
  if (!el) return;
  const opis = { ok: 'zapisano', zapis: 'zapisuję…', blad: 'brak zapisu' }[stan] || '';
  el.className = 'hud-save ' + stan;
  el.textContent = stan === 'ok' ? '' : opis;
  el.title = 'Stan zapisu w bazie: ' + opis;
}

/* ============================================================
   RENDER
   ============================================================ */

/* Widoki podpinają własne listenery do kontenera. Gdybyśmy tylko czyścili
   jego wnętrze, listenery narastałyby z każdym renderem i jedno kliknięcie
   odpalałoby akcję wielokrotnie — dlatego wymieniamy cały węzeł. */
function resetView(cls) {
  const fresh = document.createElement('main');
  fresh.id = 'view';
  fresh.className = cls || 'view';
  view.replaceWith(fresh);
  view = fresh;
  return fresh;
}

function render() {
  const poprzednia = route;
  route = currentRoute();
  paintNav();
  paintHud();

  if (session) { renderSession(); return; }

  const [base, arg] = route.split('/');
  const map = Object.assign({
    home: viewHome, path: viewPath, vocab: viewVocab, grammar: viewGrammar,
    refs: viewRefs, dict: viewDict, notes: viewNotes, stats: viewStats,
    train: viewTrain, settings: viewSettings,
  }, App.VIEWS);
  const fn = map[base] || viewHome;

  /* Wejście z animacją i skok na górę należą się tylko przy przejściu
     na inny ekran. Ten sam widok przerysowujemy po byle drobiazgu —
     zmianie motywu, celu dziennego, włączeniu wymowy — a wtedy zgaszenie
     całej treści do zera i przewinięcie na górę wygląda jak przeładowanie
     strony. Przy odświeżeniu w miejscu treść ma po prostu zostać. */
  const tenSamEkran = poprzednia === route;
  resetView(tenSamEkran ? 'view bez-wejscia' : 'view enter');
  fn(arg);
  if (!tenSamEkran) window.scrollTo({ top: 0, behavior: UI.reduced ? 'auto' : 'smooth' });
}

/* ============================================================
   PULPIT
   ============================================================ */

function goalActionLabel(g) {
  return { ref: 'Otwórz ściągawkę', module: 'Ćwicz', vocab: 'Ucz się', drill: 'Trenuj', exam: 'Podejdź', review: 'Powtarzaj' }[g.type] || 'Zaczynaj';
}

function viewHome() {
  const s = ST();
  const next = Store.nextGoal();
  const due = Store.dueCount();
  const lv = Store.levelInfo(s.xp);
  const pp = Store.pathProgress();

  const glyph = next ? (next.ch.ru[0] || 'Р') : '✓';

  let now;
  if (next) {
    const p = Store.goalProgress(next.g);
    now =
      '<div class="now" data-glyph="' + esc(glyph) + '">' +
        '<div class="now-in">' +
          '<span class="eyebrow">Rozdział ' + next.ch.num + ' · ' + esc(next.ch.pl) + '</span>' +
          '<h2>' + esc(next.g.title) + '</h2>' +
          '<p>' + esc(next.g.desc) + '</p>' +
          '<div class="now-meta">' +
            '<div><span class="k">' + p.now + '<span class="dim">/' + p.max + (p.pct ? '%' : '') + '</span></span><span class="l">postęp celu</span></div>' +
            '<div><span class="k gold">+' + next.g.xp + '</span><span class="l">XP za cel</span></div>' +
            '<div><span class="k">' + pp.done + '<span class="dim">/' + pp.total + '</span></span><span class="l">cele ścieżki</span></div>' +
          '</div>' +
          '<div class="now-actions">' +
            '<button class="btn primary" data-act="start-goal">' + goalActionLabel(next.g) + ' →</button>' +
            (due ? '<button class="btn" data-act="review">Powtórki (' + due + ')</button>' : '') +
            '<button class="btn ghost" data-act="goto-path">Cała ścieżka</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  } else {
    now =
      '<div class="now" data-glyph="✵">' +
        '<div class="now-in">' +
          '<span class="eyebrow">Ścieżka przebyta</span>' +
          '<h2>Zostały już tylko słówka</h2>' +
          '<p>Wszystkie cele zamknięte. Teraz liczy się codzienna powtórka i dokładanie nowych słów — dokładnie tak, jak miało być.</p>' +
          '<div class="now-actions">' +
            '<button class="btn primary" data-act="review">Powtórki (' + due + ')</button>' +
            '<button class="btn" data-act="weak">Trenuj słabe punkty</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  const tiles =
    '<div class="tiles stagger">' +
      tile(Store.knownCount(), 'w pamięci', 'z ' + WORDS.length + ' słów', 'var(--gold)') +
      tile(due, 'do powtórki', due ? 'kolejka czeka' : 'kolejka pusta', due ? 'var(--red)' : 'var(--green)') +
      tile(s.streak, 'dni z rzędu', 'rekord: ' + s.bestStreak, 'var(--red)') +
      tile(lv.lvl, 'poziom', lv.rank, 'var(--violet)') +
      tile(accuracy() + '%', 'skuteczność', s.stats.answered + ' odpowiedzi', 'var(--green)') +
      tile(Object.keys(s.badges).length, 'odznaki', 'z ' + BADGES.length, 'var(--blue)') +
    '</div>';

  const wordOfDay = dailyWord();
  const woD =
    '<div class="card" style="position:relative;overflow:hidden">' +
      '<span class="eyebrow">Słowo dnia</span>' +
      '<div style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-top:8px">' +
        '<span class="cyr" style="font-size:40px">' + esc(wordOfDay.ru) + '</span>' +
        '<span style="font-size:18px">' + esc(wordOfDay.pl) + '</span>' +
        '<span class="mono dim" style="font-size:13px">' + esc(wordOfDay.tr) + '</span>' +
        '<button class="btn sm ghost" data-speak="' + esc(wordOfDay.ru) + '" data-tr="' + esc(wordOfDay.tr) + '" style="margin-left:auto">♪ Posłuchaj</button>' +
      '</div>' +
      (wordOfDay.ex ? '<div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line);font-size:14px">' +
        esc(wordOfDay.ex) + '<div class="dim" style="font-size:13px">' + esc(wordOfDay.exPl || '') + '</div></div>' : '') +
    '</div>';

  const quick =
    '<div class="grid g3 stagger" style="margin-top:14px">' +
      quickCard('Szybka runda', '10 pytań z tego, co już widziałeś', 'quick') +
      quickCard('Słabe punkty', 'Słowa, które najczęściej wracają', 'weak') +
      quickCard('Dopasuj pary', 'Pięć par na czas — rozgrzewka', 'match') +
      quickCard('Wpisz z pamięci', 'Klawiatura cyrylicy, bez podpowiedzi', 'typing') +
    '</div>';

  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">' + greeting() + '</span>' +
      '<h1>Pulpit</h1>' +
    '</div>' +
    now + tiles +
    '<div class="group-head"><h3>Dziś</h3><span class="d">jedno słowo, cztery skróty</span></div>' +
    woD + quick;

  wireCommon();
}

function tile(k, l, s, accent) {
  return '<div class="tile" style="--accent:' + accent + '"><div class="k">' + esc(k) + '</div>' +
    '<div class="l">' + esc(l) + '</div><div class="s">' + esc(s) + '</div></div>';
}

function quickCard(title, desc, act) {
  return '<button class="cat" data-act="' + act + '">' +
    '<div class="cat-name" style="margin-bottom:6px">' + esc(title) + '</div>' +
    '<div style="font-size:12.5px;color:var(--muted)">' + esc(desc) + '</div>' +
    '<div style="margin-top:12px" class="eyebrow gold">Start →</div>' +
    '</button>';
}

function greeting() {
  const hh = new Date().getHours();
  if (hh < 5) return 'Доброй ночи · późno już';
  if (hh < 11) return 'Доброе утро · dzień dobry';
  if (hh < 18) return 'Добрый день · dzień dobry';
  return 'Добрый вечер · dobry wieczór';
}

function accuracy() {
  const st = ST().stats;
  return st.answered ? Math.round((st.correct / st.answered) * 100) : 0;
}

function dailyWord() {
  const d = new Date();
  const seed = d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate();
  return WORDS[seed % WORDS.length];
}

/* ============================================================
   ŚCIEŻKA
   ============================================================ */

function viewPath() {
  const pp = Store.pathProgress();
  let html =
    '<div class="view-head">' +
      '<span class="eyebrow">Od zera do swobody · ' + pp.done + ' z ' + pp.total + ' celów</span>' +
      '<h1>Ścieżka</h1>' +
      '<p>Cele odblokowują się po kolei. Nie musisz decydować, co dalej — wystarczy schodzić w dół.</p>' +
      '<div style="max-width:420px;margin-top:16px">' + bar(pp.pct) + '</div>' +
    '</div>';

  let reachedOpen = false;

  html += PATH.map((ch) => {
    const done = ch.goals.filter((g) => Store.goalDone(g)).length;
    const goals = ch.goals.map((g) => {
      const isDone = Store.goalDone(g);
      const p = Store.goalProgress(g);
      const isActive = !isDone && !reachedOpen;
      if (!isDone && !reachedOpen) reachedOpen = true;
      const locked = !isDone && !isActive;
      const cls = isDone ? 'done' : isActive ? 'active' : 'locked';
      const mark = isDone ? '✓' : locked ? '·' : '→';
      const pct = Math.round((p.now / p.max) * 100);
      return (
        '<button class="goal ' + cls + '"' + (locked ? ' disabled' : '') +
          ' data-goal="' + g.id + '">' +
          '<span class="goal-mark">' + mark + '</span>' +
          '<span class="goal-body">' +
            '<span class="goal-title">' + esc(g.title) + '</span>' +
            '<span class="goal-desc">' + esc(g.desc) + '</span>' +
          '</span>' +
          '<span class="goal-side">' +
            '<span class="goal-prog">' + bar(pct, isDone ? 'green' : '') + '</span>' +
            '<span class="goal-xp">' + (isDone ? '✓ ' : '+') + g.xp + '</span>' +
          '</span>' +
        '</button>'
      );
    }).join('');

    return (
      '<section class="chapter">' +
        '<div class="chapter-head">' +
          '<div class="chapter-num">' + ch.num + '</div>' +
          '<div style="flex:1;min-width:0">' +
            '<div class="ru cyr">' + esc(ch.ru) + '</div>' +
            '<h2>' + esc(ch.pl) + '</h2>' +
            '<p>' + esc(ch.desc) + '</p>' +
          '</div>' +
          '<div class="chapter-prog"><div class="k">' + done + '<span class="dim">/' + ch.goals.length + '</span></div>' +
          '<div class="l">celów</div></div>' +
        '</div>' +
        '<div class="goals stagger">' + goals + '</div>' +
      '</section>'
    );
  }).join('');

  view.innerHTML = html;

  view.addEventListener('click', (e) => {
    const b = e.target.closest('[data-goal]');
    if (!b || b.disabled) return;
    const found = Store.allGoals().find(({ g }) => g.id === b.dataset.goal);
    if (found) startGoal(found.g);
  });
}

/* Uruchomienie celu — każdy typ trafia tam, gdzie trzeba */
function startGoal(g) {
  switch (g.type) {
    case 'ref':
      ST().refs[g.ref] = Date.now();
      Store.commit();
      go('refs');
      setTimeout(() => {
        const d = document.getElementById('ref-' + g.ref);
        if (d) { d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }, 90);
      break;
    case 'module': {
      const mod = MODULES.find((m) => m.id === g.ref);
      if (!mod) return;
      let idx = g.sec;
      if (idx === 'all') {
        idx = mod.sections.findIndex((_, i) => !Store.secDone(mod.id, i));
        if (idx < 0) idx = 0;
      }
      startQuiz(mod, idx);
      break;
    }
    case 'vocab':
      startVocabSession(g.ref);
      break;
    case 'drill':
      startDrill(g.ref);
      break;
    case 'exam':
      startExam(g.ref);
      break;
    case 'review':
      startReview();
      break;
  }
}

/* ============================================================
   SŁOWNICTWO
   ============================================================ */

/* ============================================================
   TRENING — rozdzielnia wszystkich ćwiczeń
   ============================================================ */

const TRAIN_CARDS = [
  { r: 'vocab',     ru: 'Слова',        pl: 'Słownictwo',        glyph: 'С',
    desc: 'Kategorie tematyczne, fiszki, pisanie, słuch i pary.' },
  { r: 'grammar',   ru: 'Грамматика',   pl: 'Gramatyka',         glyph: 'Г',
    desc: 'Dziewięć modułów, sprawdzian i egzamin końcowy.' },
  { r: 'keyboard',  ru: 'Клавиатура',   pl: 'Klawiatura ЙЦУКЕН', glyph: 'К',
    desc: 'Pisanie bezwzrokowe: układ, palce, prędkość.' },
  { r: 'sentences', ru: 'Предложения',  pl: 'Układacz zdań',     glyph: 'П',
    desc: 'Składaj zdania z rozsypanych słów — szyk i końcówki.' },
  { r: 'translator', ru: 'Переводчик',  pl: 'Tłumacz',           glyph: 'Т',
    desc: 'Przekład w obie strony, pisany z głowy — bez podpowiedzi.' },
  { r: 'reading',   ru: 'Читальня',     pl: 'Czytelnia',         glyph: 'Ч',
    desc: 'Wklej dowolny tekst — zobacz, ile już rozumiesz.' },
  { r: 'refs',      ru: 'Шпаргалки',    pl: 'Ściągawki',         glyph: 'Ш',
    desc: 'Tabele odmian i zasady do podejrzenia w każdej chwili.' },
];

function viewTrain() {
  const due = Store.dueCount();
  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">Siedem sposobów na to samo</span>' +
      '<h1>Trening</h1>' +
      '<p>Ten sam materiał widziany z różnych stron zapada głębiej niż jedno ćwiczenie powtarzane w kółko.</p>' +
      '<div class="now-actions">' +
        '<button class="btn primary" data-act="review">Powtórki' + (due ? ' (' + due + ')' : '') + '</button>' +
        '<button class="btn" data-act="quick">Szybka runda</button>' +
        '<button class="btn ghost" data-act="weak">Słabe punkty</button>' +
      '</div>' +
    '</div>' +
    '<div class="grid g2 stagger">' +
      TRAIN_CARDS.map((c) =>
        '<button class="cat" data-r="' + c.r + '">' +
          '<span class="cat-glyph cyr">' + c.glyph + '</span>' +
          '<div class="cat-ru cyr">' + c.ru + '</div>' +
          '<div class="cat-name">' + esc(c.pl) + '</div>' +
          '<div style="font-size:13px;color:var(--muted);line-height:1.5">' + esc(c.desc) + '</div>' +
          '<div class="eyebrow gold" style="margin-top:14px">Wejdź →</div>' +
        '</button>').join('') +
    '</div>';

  view.addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (b) go(b.dataset.r);
  });
  wireCommon();
}

function viewVocab(catId) {
  if (catId) return viewCategory(catId);

  const due = Store.dueCount();
  let html =
    '<div class="view-head">' +
      '<span class="eyebrow">' + WORDS.length + ' słów · ' + CATS.length + ' kategorii</span>' +
      '<h1>Słownictwo</h1>' +
      '<p>Wybierz temat i ucz się w swoim tempie. Każde słowo wraca wtedy, kiedy zaczynasz je zapominać.</p>' +
      '<div class="now-actions" style="margin-top:16px">' +
        '<button class="btn primary" data-act="review">Powtórki' + (due ? ' (' + due + ')' : '') + '</button>' +
        '<button class="btn" data-act="quick">Szybka runda</button>' +
        '<button class="btn ghost" data-act="weak">Słabe punkty</button>' +
      '</div>' +
    '</div>';

  for (const grp of CAT_GROUPS) {
    const cats = CATS.filter((c) => c.group === grp.id);
    if (!cats.length) continue;
    html += '<div class="group-head"><h3>' + esc(grp.name) + '</h3><span class="d">' + esc(grp.desc) + '</span></div>';
    html += '<div class="grid g3 stagger">' + cats.map(catCard).join('') + '</div>';
  }

  view.innerHTML = html;
  view.addEventListener('click', (e) => {
    const c = e.target.closest('[data-cat]');
    if (c) go('vocab/' + c.dataset.cat);
  });
  wireCommon();
}

function catCard(c) {
  const kn = Store.knownCount(c.id);
  const pct = Math.round((kn / c.count) * 100);
  return (
    '<button class="cat" data-cat="' + c.id + '">' +
      '<span class="cat-glyph cyr">' + esc(c.glyph) + '</span>' +
      '<div class="cat-ru cyr">' + esc(c.ru) + '</div>' +
      '<div class="cat-name">' + esc(c.name) + '</div>' +
      '<div class="cat-stat"><span>' + kn + ' / ' + c.count + '</span><span>' + pct + '%</span></div>' +
      bar(pct, pct === 100 ? 'green' : '') +
    '</button>'
  );
}

function viewCategory(catId) {
  const c = CATS.find((x) => x.id === catId);
  if (!c) { go('vocab'); return; }
  const words = WORDS.filter((w) => w.cat === catId);
  const kn = Store.knownCount(catId);
  const seen = Store.seenCount(catId);
  const pct = Math.round((kn / c.count) * 100);

  view.innerHTML =
    '<div class="view-head">' +
      '<button class="btn sm ghost" data-act="back-vocab" style="margin-bottom:14px">← Wszystkie kategorie</button>' +
      '<span class="eyebrow cyr">' + esc(c.ru) + '</span>' +
      '<h1>' + esc(c.name) + '</h1>' +
      '<div class="tiles" style="margin-top:18px">' +
        tile(c.count, 'słów w temacie', '', 'var(--bone)') +
        tile(kn, 'w pamięci', pct + '% tematu', 'var(--gold)') +
        tile(seen - kn < 0 ? 0 : seen - kn, 'w trakcie', 'jeszcze się utrwalają', 'var(--red)') +
        tile(c.count - seen, 'nietkniętych', '', 'var(--muted)') +
      '</div>' +
      '<div class="now-actions">' +
        '<button class="btn primary" data-act="learn-cat" data-cat="' + catId + '">Ucz się →</button>' +
        '<button class="btn" data-act="flash-cat" data-cat="' + catId + '">Fiszki</button>' +
        '<button class="btn" data-act="type-cat" data-cat="' + catId + '">Wpisz z pamięci</button>' +
        '<button class="btn ghost" data-act="match-cat" data-cat="' + catId + '">Dopasuj pary</button>' +
        '<button class="btn ghost" data-act="listen-cat" data-cat="' + catId + '">Ze słuchu</button>' +
      '</div>' +
    '</div>' +
    '<div class="tablewrap">' + wordTable(words) + '</div>';

  wireCommon();
}

function wordTable(words) {
  return (
    '<table><thead><tr>' +
      '<th style="width:34px"></th><th>Rosyjski</th><th>Polski</th><th>Wymowa</th><th style="width:96px">Pamięć</th>' +
    '</tr></thead><tbody>' +
    words.map((w) => {
      const c = ST().srs[w.id];
      const b = c ? c.b : -1;
      const dots = [0, 1, 2, 3, 4].map((i) =>
        '<span class="box-dot' + (b > i ? (b >= 5 ? ' max' : ' on') : '') + '"></span>').join('');
      return (
        '<tr>' +
          '<td><button class="speak" style="position:static;width:26px;height:26px;font-size:12px" data-speak="' + esc(w.ru) + '" data-tr="' + esc(w.tr) + '" title="Posłuchaj">♪</button></td>' +
          '<td class="ru cyr">' + esc(w.ru) + '</td>' +
          '<td>' + esc(w.pl) + '</td>' +
          '<td class="tr">' + esc(w.tr) + '</td>' +
          '<td>' + dots + '</td>' +
        '</tr>'
      );
    }).join('') +
    '</tbody></table>'
  );
}

/* ============================================================
   GRAMATYKA
   ============================================================ */

function viewGrammar() {
  const mods = MODULES.map((m) => {
    const done = Store.modSectionsDone(m.id);
    const pct = Math.round((done / m.sections.length) * 100);
    const qn = m.sections.reduce((a, s) => a + s.questions.length, 0);
    return (
      '<button class="cat" data-mod="' + m.id + '">' +
        '<span class="cat-glyph cyr">' + esc(m.sections[0] && m.sections[0].icon ? m.sections[0].icon : 'Г') + '</span>' +
        '<div class="cat-ru">' + m.sections.length + ' sekcji · ' + qn + ' pytań</div>' +
        '<div class="cat-name">' + esc(m.title) + '</div>' +
        '<div style="font-size:12.5px;color:var(--muted);margin-bottom:10px;min-height:34px">' + esc(m.desc) + '</div>' +
        '<div class="cat-stat"><span>' + done + ' / ' + m.sections.length + ' sekcji</span><span>' + pct + '%</span></div>' +
        bar(pct, pct === 100 ? 'green' : '') +
      '</button>'
    );
  }).join('');

  const exams = EXAMS.map((e) => {
    const r = ST().exams[e.id];
    const pct = r ? Math.round((r.best / r.total) * 100) : 0;
    return (
      '<button class="cat" data-exam="' + e.id + '">' +
        '<span class="cat-glyph cyr">' + (e.id === 'final' ? 'Э' : 'З') + '</span>' +
        '<div class="cat-ru">' + e.questions.length + ' pytań · na czas</div>' +
        '<div class="cat-name">' + esc(e.title) + '</div>' +
        '<div style="font-size:12.5px;color:var(--muted);margin-bottom:10px;min-height:34px">' + esc(e.desc) + '</div>' +
        '<div class="cat-stat"><span>' + (r ? 'Rekord: ' + r.best + '/' + r.total : 'Jeszcze nie podchodziłeś') + '</span><span>' + (r ? pct + '%' : '') + '</span></div>' +
        bar(pct, pct >= 80 ? 'green' : '') +
      '</button>'
    );
  }).join('');

  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">9 modułów · 475 pytań · 2 egzaminy</span>' +
      '<h1>Gramatyka</h1>' +
      '<p>Materiał, który już przerobiłeś — tu jest w całości, sekcja po sekcji, żeby było do czego wracać.</p>' +
    '</div>' +
    '<div class="group-head"><h3>Moduły</h3><span class="d">sekcja po sekcji</span></div>' +
    '<div class="grid g3 stagger">' + mods + '</div>' +
    '<div class="group-head"><h3>Sprawdź się</h3><span class="d">z timerem i oceną</span></div>' +
    '<div class="grid g2 stagger">' + exams + '</div>';

  view.addEventListener('click', (e) => {
    const m = e.target.closest('[data-mod]');
    if (m) return openModule(m.dataset.mod);
    const x = e.target.closest('[data-exam]');
    if (x) return startExam(x.dataset.exam);
  });
}

function openModule(id) {
  const mod = MODULES.find((m) => m.id === id);
  if (!mod) return;

  const secs = mod.sections.map((sec, i) => {
    const best = (ST().mod[id] && ST().mod[id].sec) ? ST().mod[id].sec[i] : null;
    const done = best != null;
    return (
      '<button class="goal ' + (done ? 'done' : 'active') + '" data-sec="' + i + '">' +
        '<span class="goal-mark cyr">' + esc(sec.icon || (i + 1)) + '</span>' +
        '<span class="goal-body">' +
          '<span class="goal-title">' + esc(sec.title) + '</span>' +
          '<span class="goal-desc">' + sec.questions.length + ' pytań' +
          (done ? ' · najlepszy wynik ' + best + '/' + sec.questions.length : '') + '</span>' +
        '</span>' +
        '<span class="goal-side"><span class="goal-xp">' + (done ? '✓' : '→') + '</span></span>' +
      '</button>'
    );
  }).join('');

  resetView('view enter');
  view.innerHTML =
    '<div class="view-head">' +
      '<button class="btn sm ghost" data-act="back-grammar" style="margin-bottom:14px">← Gramatyka</button>' +
      '<h1>' + esc(mod.title) + '</h1>' +
      '<p>' + esc(mod.desc) + '</p>' +
      '<div class="now-actions">' +
        '<button class="btn primary" data-act="drill-mod" data-mod="' + id + '">Losowy trening (20 pytań)</button>' +
      '</div>' +
    '</div>' +
    '<div class="goals stagger">' + secs + '</div>';

  view.addEventListener('click', (e) => {
    const b = e.target.closest('[data-sec]');
    if (b) startQuiz(mod, +b.dataset.sec);
  });
  wireCommon();
}

/* ============================================================
   ŚCIĄGAWKI
   ============================================================ */

function viewRefs() {
  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">Teoria w pigułce</span>' +
      '<h1>Ściągawki</h1>' +
      '<p>Dziewięć kart z zasadami i tabelami. Otwierasz, sprawdzasz, wracasz do ćwiczeń.</p>' +
    '</div>' +
    '<div class="stagger">' + REFS.map(refCard).join('') + '</div>';

  view.addEventListener('toggle', (e) => {
    const d = e.target;
    if (d.tagName !== 'DETAILS' || !d.open) return;
    const id = d.id.replace('ref-', '');
    if (!ST().refs[id]) { ST().refs[id] = Date.now(); Store.commit(); paintNav(); }
  }, true);
}

function refCard(r) {
  const read = !!ST().refs[r.id];
  return (
    '<details class="ref-card" id="ref-' + r.id + '">' +
      '<summary>' +
        '<span class="goal-mark" style="' + (read ? 'border-color:var(--green);color:var(--green)' : '') + '">' + (read ? '✓' : '§') + '</span>' +
        '<div style="flex:1;min-width:0">' +
          '<span class="chip" style="margin-bottom:5px">' + esc(r.tag) + '</span>' +
          '<div class="ref-title">' + esc(r.title) + '</div>' +
          '<div class="ref-lead">' + esc(r.lead) + '</div>' +
        '</div>' +
        '<span class="caret">›</span>' +
      '</summary>' +
      '<div class="ref-body">' + r.blocks.map(refBlock).join('') + '</div>' +
    '</details>'
  );
}

function refBlock(b) {
  if (b.t === 'rule') {
    return '<div class="rule"><h4>' + esc(b.title) + '</h4><p>' + esc(b.body) + '</p></div>';
  }
  if (b.t === 'pairs') {
    return '<div class="ref-block"><h4>' + esc(b.title) + '</h4><div class="pairs">' +
      b.items.map((i) =>
        '<div class="pair"><span class="a cyr">' + esc(i[0]) + '</span>' +
        '<span class="b">' + esc(i[1]) + '</span>' +
        '<span class="c">' + esc(i[2] || '') + '</span></div>').join('') +
      '</div></div>';
  }
  if (b.t === 'table') {
    return '<div class="ref-block"><h4>' + esc(b.title) + '</h4><div class="tablewrap"><table>' +
      '<thead><tr>' + b.head.map((x) => '<th>' + esc(x) + '</th>').join('') + '</tr></thead>' +
      '<tbody>' + b.rows.map((r) =>
        '<tr>' + r.map((c, i) => '<td' + (i > 0 ? ' class="cyr" style="font-size:16px"' : '') + '>' + esc(c) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div></div>';
  }
  return '';
}

/* ============================================================
   SŁOWNIK
   ============================================================ */

let dictQuery = '', dictCat = '', dictFilter = '';

function viewDict() {
  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">' + WORDS.length + ' haseł</span>' +
      '<h1>Słownik</h1>' +
    '</div>' +
    '<div class="tools">' +
      '<input class="search" id="dq" placeholder="Szukaj po rosyjsku, polsku lub w transkrypcji…" value="' + esc(dictQuery) + '">' +
      '<select class="sel" id="dc"><option value="">Wszystkie kategorie</option>' +
        CATS.map((c) => '<option value="' + c.id + '"' + (dictCat === c.id ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') +
      '</select>' +
      '<select class="sel" id="df">' +
        '<option value="">Cały stan</option>' +
        '<option value="new"' + (dictFilter === 'new' ? ' selected' : '') + '>Nietknięte</option>' +
        '<option value="learning"' + (dictFilter === 'learning' ? ' selected' : '') + '>W trakcie</option>' +
        '<option value="known"' + (dictFilter === 'known' ? ' selected' : '') + '>W pamięci</option>' +
        '<option value="weak"' + (dictFilter === 'weak' ? ' selected' : '') + '>Sprawiają kłopot</option>' +
      '</select>' +
    '</div>' +
    '<div id="dres"></div>';

  const run = () => {
    const q = dictQuery.trim().toLowerCase();
    let list = WORDS.filter((w) => {
      if (dictCat && w.cat !== dictCat) return false;
      const c = ST().srs[w.id];
      if (dictFilter === 'new' && c && c.s > 0) return false;
      if (dictFilter === 'learning' && !(c && c.s > 0 && c.b < Store.KNOWN_BOX)) return false;
      if (dictFilter === 'known' && !Store.known(w.id)) return false;
      if (dictFilter === 'weak' && !(c && c.w > 0)) return false;
      if (!q) return true;
      return w.ru.toLowerCase().includes(q) || w.pl.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q);
    });
    const shown = list.slice(0, 400);
    $('#dres').innerHTML = list.length
      ? '<div class="dim" style="margin-bottom:10px;font-size:13px">' + list.length + ' ' +
        UI.plural(list.length, 'wynik', 'wyniki', 'wyników') +
        (list.length > 400 ? ' · pokazuję pierwsze 400' : '') + '</div>' +
        '<div class="tablewrap">' + wordTable(shown) + '</div>'
      : '<div class="empty"><div class="g cyr">Ø</div>Nic nie pasuje do tych kryteriów.</div>';
  };
  run();

  $('#dq').addEventListener('input', (e) => { dictQuery = e.target.value; run(); });
  $('#dc').addEventListener('change', (e) => { dictCat = e.target.value; run(); });
  $('#df').addEventListener('change', (e) => { dictFilter = e.target.value; run(); });
  wireCommon();
}

/* ============================================================
   NOTATKI
   ============================================================ */

function viewNotes() {
  const notes = ST().notes;
  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">' + notes.length + ' ' + UI.plural(notes.length, 'notatka', 'notatki', 'notatek') + '</span>' +
      '<h1>Notatki</h1>' +
      '<p>Własne obserwacje, wyjątki, zdania zasłyszane w serialu. Wszystko zostaje na tym urządzeniu.</p>' +
    '</div>' +
    '<div class="editor">' +
      '<input id="nt" placeholder="Tytuł notatki" maxlength="90">' +
      '<textarea id="nb" rows="4" placeholder="Treść — zasada, przykład, cokolwiek chcesz zapamiętać"></textarea>' +
      '<div style="display:flex;gap:9px;align-items:center;flex-wrap:wrap">' +
        '<button class="btn primary" data-act="note-add">Zapisz notatkę</button>' +
        '<span class="dim" style="font-size:12px">Ctrl + Enter też działa</span>' +
      '</div>' +
    '</div>' +
    (notes.length
      ? '<div class="grid g2 stagger">' + notes.map(noteCard).join('') + '</div>'
      : '<div class="empty"><div class="g cyr">✎</div>Jeszcze nic tu nie ma. Pierwsza notatka to dobry moment,<br>żeby zapisać coś, co dziś Cię zaskoczyło.</div>');

  const add = () => {
    const t = $('#nt').value.trim(), b = $('#nb').value.trim();
    if (!t && !b) return;
    ST().notes.unshift({ id: 'n' + Date.now(), t: t || 'Bez tytułu', b, ts: Date.now() });
    Store.commit();
    UI.toast('Zapisano', 'Notatka trafiła do zbioru');
    render();
  };
  $('#nb').addEventListener('keydown', (e) => { if (e.ctrlKey && e.key === 'Enter') add(); });
  view.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="note-add"]')) return add();
    const d = e.target.closest('[data-del]');
    if (d) {
      ST().notes = ST().notes.filter((n) => n.id !== d.dataset.del);
      Store.commit();
      render();
    }
  });
}

function noteCard(n) {
  const d = new Date(n.ts);
  return (
    '<div class="note">' +
      '<div class="note-title">' + esc(n.t) + '</div>' +
      '<div class="note-body">' + esc(n.b) + '</div>' +
      '<div class="note-foot">' +
        d.toLocaleDateString('pl-PL') + ' ' + d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) +
        '<button class="note-del" data-del="' + n.id + '">usuń</button>' +
      '</div>' +
    '</div>'
  );
}

/* ============================================================
   POSTĘPY
   ============================================================ */

function viewStats() {
  const s = ST();
  const lv = Store.levelInfo(s.xp);
  const pp = Store.pathProgress();

  const catRows = CATS.map((c) => {
    const kn = Store.knownCount(c.id);
    const pct = Math.round((kn / c.count) * 100);
    return '<div class="barrow"><span class="n">' + esc(c.name) + '</span>' +
      bar(pct, pct === 100 ? 'green' : '') +
      '<span class="v">' + kn + '/' + c.count + '</span></div>';
  }).join('');

  const modRows = MODULES.map((m) => {
    const d = Store.modSectionsDone(m.id);
    const pct = Math.round((d / m.sections.length) * 100);
    return '<div class="barrow"><span class="n">' + esc(m.title) + '</span>' +
      bar(pct, pct === 100 ? 'green' : '') +
      '<span class="v">' + d + '/' + m.sections.length + '</span></div>';
  }).join('');

  const badges = BADGES.map((b) => {
    const got = !!s.badges[b.id];
    return (
      '<div class="badge' + (got ? ' got' : '') + '" title="' + esc(b.desc) + '">' +
        '<div class="badge-ico cyr">' + esc(b.icon) + '</div>' +
        '<div class="badge-ru">' + esc(b.ru) + '</div>' +
        '<div class="badge-pl">' + esc(b.pl) + '</div>' +
        '<div class="badge-desc">' + esc(b.desc) + '</div>' +
      '</div>'
    );
  }).join('');

  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">' + lv.rank + ' · poziom ' + lv.lvl + ' · ' + s.xp + ' XP</span>' +
      '<h1>Postępy</h1>' +
    '</div>' +
    '<div class="tiles stagger">' +
      tile(Store.knownCount(), 'słów w pamięci', 'z ' + WORDS.length, 'var(--gold)') +
      tile(pp.pct + '%', 'ścieżki', pp.done + '/' + pp.total + ' celów', 'var(--red)') +
      tile(s.stats.answered, 'odpowiedzi', accuracy() + '% trafnych', 'var(--green)') +
      tile(s.stats.reviews, 'powtórek', 'kart przerobionych', 'var(--blue)') +
      tile(s.bestStreak, 'rekord passy', 'obecnie ' + s.streak, 'var(--red)') +
      tile(s.stats.bestCombo, 'najdłuższa seria', 'bez pomyłki', 'var(--violet)') +
    '</div>' +

    '<div class="group-head"><h3>Aktywność</h3><span class="d">ostatnie 20 tygodni</span></div>' +
    '<div class="card">' + heatmap() +
      '<div class="legend"><span>mniej</span>' +
        '<span class="heat-cell"></span><span class="heat-cell l1"></span><span class="heat-cell l2"></span>' +
        '<span class="heat-cell l3"></span><span class="heat-cell l4"></span><span>więcej</span></div>' +
    '</div>' +

    '<div class="group-head"><h3>Cel dzienny</h3><span class="d">ile pytań dziennie</span></div>' +
    '<div class="card">' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">' +
        [10, 20, 30, 50, 80].map((n) =>
          '<button class="btn sm' + (s.dailyGoal === n ? ' primary' : '') + '" data-goalset="' + n + '">' + n + '</button>').join('') +
        '<span class="dim" style="font-size:12.5px;margin-left:8px">Dziś: ' + Store.todayCount() + ' / ' + s.dailyGoal + '</span>' +
      '</div>' +
    '</div>' +

    '<div class="group-head"><h3>Odznaki</h3><span class="d">' + Object.keys(s.badges).length + ' z ' + BADGES.length + '</span></div>' +
    '<div class="grid g4 stagger">' + badges + '</div>' +

    '<div class="group-head"><h3>Słownictwo wg tematów</h3></div>' +
    '<div class="card">' + catRows + '</div>' +

    '<div class="group-head"><h3>Moduły gramatyczne</h3></div>' +
    '<div class="card">' + modRows + '</div>' +

    '<div class="group-head"><h3>Wymowa</h3></div>' +
    speechPanel();

    view.querySelectorAll('.tile .k').forEach((n) => {
      const v = parseInt(n.textContent, 10);
      if (!isNaN(v) && String(v) === n.textContent) countUp(n, v, 800);
    });

  view.addEventListener('click', (e) => {
    const g = e.target.closest('[data-goalset]');
    if (g) { ST().dailyGoal = +g.dataset.goalset; Store.commit(); render(); return; }
  });
  const vp = $('#voicepick');
  if (vp) vp.addEventListener('change', (e) => {
    Speech.setVoice(e.target.value || null);
    UI.toast('Głos zmieniony', 'Sprawdź próbką, czy brzmi jak trzeba');
  });

  wireCommon();
}

/* ============================================================
   USTAWIENIA — własny ekran, wołany zębatką z paska górnego
   ============================================================ */

function viewSettings() {
  const s = ST();
  view.innerHTML =
    '<div class="view-head">' +
      '<span class="eyebrow">Konto i wygląd</span>' +
      '<h1>Ustawienia</h1>' +
    '</div>' +
    ustawieniaPanel(s);

  const tb = $('#themebox');
  if (tb) tb.addEventListener('change', (e) => {
    /* Kliknięcie jest świadomym wyborem, więc od teraz przestajemy
       słuchać systemu i trzymamy się tego, co wybrał użytkownik. */
    ST().settings.theme = e.target.checked ? 'dark' : 'light';
    applyTheme();
    Store.commit();

    /* Barwy przestawia sam motyw na korzeniu dokumentu, więc zamiast
       przerysowywać ekran poprawiamy dwa napisy. Wcześniej leciał tu
       pełny render i cała strona mrugała po każdym przełączeniu. */
    const napis = $('#motywNapis');
    if (napis) napis.textContent = 'Motyw: ' + (themeIsDark() ? 'ciemny' : 'jasny');
    const opis = $('#motywOpis');
    if (opis) opis.textContent = 'Wybrany ręcznie — trzyma się konta.';
  });
  wireCommon();
}

/* Konto, motyw i dane — jeden panel, używany przez ekran ustawień */
function ustawieniaPanel(s) {
  return (
    '<div class="card">' +
      '<div class="acct">' +
        '<div class="acct-who">' +
          '<span class="acct-avatar" aria-hidden="true">' +
            esc((Auth.user && Auth.user.nazwa || '?').slice(0, 1).toUpperCase()) + '</span>' +
          '<div>' +
            '<div class="acct-name">' + esc(Auth.user ? Auth.user.nazwa : 'niezalogowany') + '</div>' +
            '<div class="acct-since dim">' + (Auth.user && Auth.user.utworzono
              ? 'od ' + new Date(Auth.user.utworzono).toLocaleDateString('pl-PL')
              : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="btn sm" data-act="logout">Wyloguj</button>' +
      '</div>' +

      '<div class="motyw" style="margin-top:18px;padding-top:18px;border-top:2px solid var(--border)">' +
        '<div>' +
          '<div style="font-weight:700" id="motywNapis">Motyw: ' +
            (themeIsDark() ? 'ciemny' : 'jasny') + '</div>' +
          '<p class="motyw-opis" id="motywOpis">' + (s.settings.theme
            ? 'Wybrany ręcznie — trzyma się konta.'
            : 'Jak w systemie. Kliknij, żeby ustawić na stałe.') + '</p>' +
        '</div>' +
        themeSwitch() +
      '</div>' +

      '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-top:18px;padding-top:18px;border-top:2px solid var(--border)">' +
        '<button class="btn sm" data-act="tts-toggle">Wymowa: ' + (s.settings.tts ? 'włączona' : 'wyłączona') + '</button>' +
        '<button class="btn sm" data-act="export">Zapisz kopię</button>' +
        '<button class="btn sm danger" data-act="wipe">Wyzeruj postęp</button>' +
        '<button class="btn sm danger" data-act="delete-account">Usuń konto</button>' +
      '</div>' +
    '</div>'
  );
}

/* Diagnostyka mowy — mówi wprost, co gra i czego brakuje */
function speechPanel() {
  const st = window.Speech ? Speech.status() : { mode: 'none', supported: false, all: [] };

  let banner;
  if (!st.supported) {
    banner =
      '<div class="verdict no"><div class="verdict-head">Brak syntezatora</div>' +
      '<p>Ta przeglądarka nie udostępnia syntezy mowy. Transkrypcja fonetyczna przy każdym słowie działa bez zmian.</p></div>';
  } else if (st.mode === 'native') {
    banner =
      '<div class="verdict ok"><div class="verdict-head">Głos rosyjski działa</div>' +
      '<p>Cyrylicę czyta <b>' + esc(st.voiceName) + '</b> — bezpośrednio, bez pośrednictwa transkrypcji.</p></div>';
  } else if (st.mode === 'polish') {
    banner =
      '<div class="verdict"><div class="verdict-head gold">Czytam przez transkrypcję</div>' +
      '<p>W tym systemie nie ma rosyjskiego głosu, więc rosyjskie słowa czyta polski głos ' +
      '<b>' + esc(st.voiceName) + '</b> z zapisu fonetycznego: <span class="mono">спасибо → spasiba</span>. ' +
      'Brzmi blisko oryginału, bo polska fonetyka leży niedaleko rosyjskiej.</p>' +
      '<div class="hint">Chcesz prawdziwy rosyjski głos? Ustawienia Windows → Czas i język → Język i region → ' +
      'Dodaj język → Rosyjski, i przy instalacji zaznacz „Zamiana tekstu na mowę”. Potem zrestartuj przeglądarkę.</div></div>';
  } else {
    banner =
      '<div class="verdict no"><div class="verdict-head">Żaden głos nie jest dostępny</div>' +
      '<p>System nie zgłasza ani rosyjskiego, ani polskiego głosu. Zostaje transkrypcja fonetyczna na ekranie.</p></div>';
  }

  const picker = st.all && st.all.length
    ? '<div style="margin-top:14px;display:flex;gap:9px;flex-wrap:wrap;align-items:center">' +
        '<select class="sel" id="voicepick">' +
          '<option value="">Wybór automatyczny</option>' +
          st.all.map((v) => '<option value="' + esc(v.uri) + '"' +
            (ST().settings.voice === v.uri ? ' selected' : '') + '>' +
            esc(v.name) + ' (' + esc(v.lang) + ')</option>').join('') +
        '</select>' +
        '<button class="btn sm primary" data-act="tts-test">Posłuchaj próbki</button>' +
      '</div>'
    : '';

  return '<div class="card">' + banner + picker + '</div>';
}

function heatmap() {
  const weeks = 20, cells = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const startOffset = (end.getDay() + 6) % 7;
  const start = new Date(end.getTime() - (weeks * 7 - 1 - (6 - startOffset)) * 86400000);

  let html = '<div class="heat">';
  for (let w = 0; w < weeks; w++) {
    html += '<div class="heat-col">';
    for (let d = 0; d < 7; d++) {
      const day = new Date(start.getTime() + (w * 7 + d) * 86400000);
      if (day > end) { html += '<span class="heat-cell" style="opacity:.25"></span>'; continue; }
      const n = ST().days[Store.dayKey(day)] || 0;
      const lvl = n === 0 ? '' : n < 10 ? ' l1' : n < 25 ? ' l2' : n < 50 ? ' l3' : ' l4';
      html += '<span class="heat-cell' + lvl + '" title="' + Store.dayKey(day) + ' · ' + n + ' odpowiedzi"></span>';
    }
    html += '</div>';
  }
  return html + '</div>';
}

/* ============================================================
   WSPÓLNE AKCJE
   ============================================================ */

function wireCommon() {
  view.addEventListener('click', (e) => {
    const sp = e.target.closest('[data-speak]');
    if (sp) { UI.speak({ ru: sp.dataset.speak, tr: sp.dataset.tr || null }, sp); return; }

    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    const cat = b.dataset.cat;

    switch (act) {
      case 'start-goal': { const n = Store.nextGoal(); if (n) startGoal(n.g); break; }
      case 'goto-path': go('path'); break;
      case 'back-vocab': go('vocab'); break;
      case 'back-grammar': go('grammar'); break;
      case 'review': startReview(); break;
      case 'quick': startQuick(); break;
      case 'weak': startWeak(); break;
      case 'match': startMatch(null); break;
      case 'typing': startTyping(null); break;
      case 'learn-cat': startVocabSession(cat); break;
      case 'flash-cat': startFlash(cat); break;
      case 'type-cat': startTyping(cat); break;
      case 'match-cat': startMatch(cat); break;
      case 'listen-cat': startListen(cat); break;
      case 'drill-mod': startDrill(b.dataset.mod); break;
      case 'tts-toggle': ST().settings.tts = !ST().settings.tts; Store.commit(); render(); break;
      case 'tts-test': UI.speak({ ru: 'Здравствуйте, я говорю по-русски', tr: 'zdrastwujtie ja gawariu pa ruski' }); break;
      case 'accent-set':
        ST().settings.accent = b.dataset.accent || null;
        Store.save(); applyAccent(); render();
        break;
      case 'export': exportData(); break;
      case 'wipe': wipe(); break;
      case 'logout': Auth.logout(); break;
      case 'delete-account': deleteAccount(); break;
    }
  });
}

/* Kasowanie konta jest nieodwracalne, więc prosimy o przepisanie
   nazwy — samo „OK" zbyt łatwo kliknąć przez pomyłkę. */
async function deleteAccount() {
  const nazwa = Auth.user ? Auth.user.nazwa : '';
  const wpis = prompt(
    'To skasuje z bazy konto i cały postęp — bezpowrotnie.\n\n' +
    'Żeby potwierdzić, przepisz swój login: ' + nazwa
  );
  if (wpis === null) return;
  if (wpis.trim().toLowerCase() !== nazwa.toLowerCase()) {
    UI.toast('Nie skasowano', 'Login się nie zgadza');
    return;
  }
  try {
    await API.removeAccount();
    location.reload();
  } catch (e) {
    UI.toast('Nie udało się', e.message || 'Spróbuj ponownie');
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(ST(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rublya-' + Store.today() + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  UI.toast('Kopia zapisana', 'Plik trafił do folderu pobrań');
}

function wipe() {
  if (!confirm('To skasuje cały postęp: słówka, cele, odznaki i notatki. Na pewno?')) return;
  Store.resetAll();
  UI.toast('Wyczyszczono', 'Zaczynamy od nowa');
  go('home');
  render();
}

/* ============================================================
   SILNIK SESJI
   ============================================================ */

function newSession(cfg) {
  Store.markTimeFlags();
  session = Object.assign({
    i: 0, correct: 0, combo: 0, best: 0, wrongIds: [],
    startedAt: Date.now(), answered: false, gainedXp: 0,
  }, cfg);
  ST().stats.sessions++;
  renderSession();
}

function endSession() {
  stopClock();
  const sess = session;
  const secs = Math.round((Date.now() - sess.startedAt) / 1000);
  const total = sess.items.length;
  const pct = total ? Math.round((sess.correct / total) * 100) : 0;

  let xp = sess.correct * 4 + (pct === 100 && total >= 10 ? 25 : 0);
  if (sess.onFinish) xp += sess.onFinish(sess, pct) || 0;
  if (pct === 100 && total >= 20) ST().flags_perfect = true;
  ST().stats.bestCombo = Math.max(ST().stats.bestCombo, sess.best);

  /* Podwójne XP zużywa się dokładnie na tej sesji, na której je włączono */
  const doubled = sess.x2;
  if (doubled) xp *= 2;

  Store.raise('acc', pct);
  if (pct === 100 && total >= 8) Store.bump('perfect');

  const reward = Store.sessionReward(sess.correct, total, sess.best);
  Store.addCoins(reward.coins);
  Store.addXp(xp);
  const res = Store.commit();

  resetView('view enter');
  view.innerHTML =
    '<div class="summary">' +
      '<span class="eyebrow">' + esc(sess.title) + '</span>' +
      '<div class="summary-score" id="scorenum">' + pct + '<small>%</small></div>' +
      '<h2 style="margin-bottom:22px">' + verdictWord(pct) + '</h2>' +
      '<div style="text-align:left;max-width:400px;margin:0 auto 26px">' +
        sLine('Poprawne', sess.correct + ' / ' + total) +
        sLine('Najdłuższa seria', sess.best) +
        sLine('Czas', fmtTime(secs)) +
        sLine('Zdobyte XP', '+' + xp + (doubled ? '  (×2)' : '')) +
        reward.parts.map((p) => sLine(p[0], '+' + p[1] + ' ₽')).join('') +
        sLine('Razem rubli', '+' + reward.coins + ' ₽') +
        (res.goals.length ? sLine('Zamknięte cele', res.goals.length) : '') +
      '</div>' +
      (sess.wrongIds.length
        ? '<p class="dim" style="font-size:13px">' + sess.wrongIds.length + ' ' +
          UI.plural(sess.wrongIds.length, 'pozycja wróci', 'pozycje wrócą', 'pozycji wróci') + ' w powtórkach.</p>'
        : '') +
      '<div class="now-actions" style="justify-content:center">' +
        (sess.repeat ? '<button class="btn primary" data-act="again">Jeszcze raz</button>' : '') +
        '<button class="btn" data-act="next-goal">Następny cel →</button>' +
        '<button class="btn ghost" data-act="home">Pulpit</button>' +
      '</div>' +
    '</div>';

  if (pct >= 80) UI.burst(innerWidth / 2, innerHeight * 0.3, pct === 100 ? 80 : 40);

  const repeat = sess.repeat;
  session = null;
  paintHud();
  paintNav();

  view.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'again' && repeat) repeat();
    if (b.dataset.act === 'home') { go('home'); render(); }
    if (b.dataset.act === 'next-goal') {
      const n = Store.nextGoal();
      if (n) startGoal(n.g); else { go('home'); render(); }
    }
  });
}

function sLine(l, v) {
  return '<div class="summary-line"><span class="l">' + esc(l) + '</span><span class="v">' + esc(v) + '</span></div>';
}

function verdictWord(pct) {
  if (pct === 100) return 'Идеально · bezbłędnie';
  if (pct >= 90) return 'Отлично · świetnie';
  if (pct >= 75) return 'Хорошо · dobrze';
  if (pct >= 50) return 'Неплохо · nieźle';
  return 'Ещё раз · jeszcze raz';
}

function sessTop() {
  const total = session.items.length;
  const pct = Math.round((session.i / total) * 100);
  return (
    '<div class="sess-top">' +
      '<button class="btn sm ghost" data-act="quit">✕</button>' +
      bar(pct) +
      '<span class="sess-count">' + (session.i + 1) + '/' + total + '</span>' +
      (session.combo >= 3 ? '<span class="combo">×' + session.combo + '</span>' : '') +
      (session.exam ? '<span class="sess-count mono" id="clock">' + fmtTime(elapsed()) + '</span>' : '') +
    '</div>'
  );
}

function elapsed() {
  return Math.round((Date.now() - session.startedAt) / 1000);
}

/* Zegar egzaminu — jeden interwał na pytanie, sprzątany przy każdej zmianie ekranu */
function stopClock() {
  if (session && session.clockId) { clearInterval(session.clockId); session.clockId = null; }
}

function startClock() {
  stopClock();
  session.clockId = setInterval(() => {
    const el = document.getElementById('clock');
    if (!el || !session) { stopClock(); return; }
    el.textContent = fmtTime(elapsed());
  }, 1000);
}

function renderSession() {
  if (!session) { render(); return; }
  if (session.i >= session.items.length) { endSession(); return; }
  resetView('view');
  view.innerHTML = '<div class="session" id="sess"></div>';
  const box = $('#sess');
  const item = session.items[session.i];
  session.answered = false;

  const kinds = Object.assign(
    { choice: renderChoice, flash: renderFlash, type: renderType, match: renderMatch },
    App.KINDS
  );
  (kinds[item.kind] || renderChoice)(box, item);
  mountItems(box, item);
  if (session.exam) startClock();

  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="quit"]')) {
      if (session.i > 0) Store.commit();
      stopClock();
      session = null;
      render();
    }
    const sp = e.target.closest('[data-speak]');
    if (sp) UI.speak({ ru: sp.dataset.speak, tr: sp.dataset.tr || null }, sp);
  });
}

/* ------------------------------------------------------------
   Ekwipunek w trakcie sesji
   ------------------------------------------------------------ */

const ITEM_FIT = {
  hint:   (it) => it.kind === 'choice' && it.options && it.options.length > 2,
  skip:   () => true,
  letter: (it) => it.kind === 'type',
  retry:  () => true,
  x2:     () => true,
};

function mountItems(box, item) {
  const owned = SHOP.filter((s) => s.kind === 'use' && Store.itemCount(s.id) > 0);
  if (!owned.length) return;

  const bar = h('<div class="items" id="items"></div>');
  bar.innerHTML = owned.map((s) => {
    const fits = ITEM_FIT[s.id] ? ITEM_FIT[s.id](item) : false;
    const spent = (s.id === 'retry' && session.shield) || (s.id === 'x2' && session.x2);
    const late = s.id === 'x2' && session.i > 0;
    const off = !fits || spent || late || session.answered;
    return '<button class="item-btn" data-item="' + s.id + '"' + (off ? ' disabled' : '') +
      ' title="' + esc(s.pl + ' — ' + s.desc) + '">' +
      '<span class="i">' + esc(s.icon) + '</span>' +
      '<span class="n">' + Store.itemCount(s.id) + '</span>' +
    '</button>';
  }).join('');
  box.appendChild(bar);

  bar.addEventListener('click', (e) => {
    const b = e.target.closest('[data-item]');
    if (!b || b.disabled) return;
    applyItem(b.dataset.item, item);
  });
}

function applyItem(id, item) {
  if (!Store.useItem(id)) return;

  if (id === 'hint') {
    const nodes = Array.from($('#opts').querySelectorAll('.opt'));
    const wrong = nodes.filter((n, i) => i !== item.answer && !n.classList.contains('faded'));
    UI.shuffle(wrong).slice(0, 2).forEach((n) => { n.classList.add('faded'); n.disabled = true; });
    UI.toast('Podpowiedź', 'Zostały dwie możliwości');
  }
  if (id === 'skip') {
    UI.toast('Pominięte', 'Bez straty serii');
    session.answered = true;
    advance(160);
  }
  if (id === 'letter') {
    const input = $('#tin');
    if (input) { input.value = item.word.ru[0]; input.focus(); }
  }
  if (id === 'retry') {
    session.shield = true;
    UI.toast('Druga szansa', 'Pierwszy błąd nie policzy się do serii');
  }
  if (id === 'x2') {
    session.x2 = true;
    UI.toast('Podwójne XP', 'Aktywne do końca tej sesji');
  }
  renderItems(item);
}

function renderItems(item) {
  const old = $('#items');
  if (!old) return;
  const box = old.parentElement;
  old.remove();
  mountItems(box, item);
}

function advance(delay) {
  setTimeout(() => {
    session.i++;
    renderSession();
    paintHud();
  }, delay == null ? 900 : delay);
}

function scoreAnswer(ok, wordId) {
  session.answered = true;

  /* Tarcza z „drugiej szansy” zamienia pierwszy błąd w sesji w remis:
     nie kasuje serii i nie cofa słowa w powtórkach. */
  let counted = ok;
  if (!ok && session.shield) {
    session.shield = false;
    counted = true;
    UI.toast('Tarcza zużyta', 'Ten błąd nie liczy się do serii');
  }

  Store.logAnswer(ok);
  if (session.grammarCat != null) {
    Store.bump('gram');
    Store.noteTopic(session.grammarCat, ok);
  }

  if (ok) session.correct++;

  if (counted) {
    session.combo++;
    session.best = Math.max(session.best, session.combo);
    Store.raise('combo', session.combo);
    if (session.combo === 5 || session.combo === 10 || session.combo === 20) {
      UI.toast('Seria ×' + session.combo, 'Nie zatrzymuj się');
    }
  } else {
    session.combo = 0;
    if (wordId) session.wrongIds.push(wordId);
  }
  return counted;
}

/* ---------- tryb: wybór z czterech ---------- */

function renderChoice(box, item) {
  const speakBtn = item.speak
    ? '<button class="speak" data-speak="' + esc(item.speak) + '" data-tr="' + esc(item.speakTr || '') + '" title="Posłuchaj">♪</button>' : '';

  box.innerHTML =
    sessTop() +
    '<div class="prompt">' +
      '<span class="prompt-kind">' + esc(item.kindLabel || 'Wybierz odpowiedź') + '</span>' + speakBtn +
      (item.big ? '<div class="prompt-word cyr">' + esc(item.big) + '</div>' : '') +
      (item.q ? '<div class="prompt-q">' + esc(item.q) + '</div>' : '') +
      (item.tr ? '<div class="prompt-tr">' + esc(item.tr) + '</div>' : '') +
    '</div>' +
    '<div class="opts" id="opts">' +
      item.options.map((o, i) => {
        /* Szeryf niesie rosyjski; polskie odpowiedzi zostają w kroju interfejsu */
        const ru = CYR.test(o);
        return '<button class="opt" data-i="' + i + '">' +
          '<span class="opt-key">' + (i + 1) + '</span>' +
          '<span' + (ru ? ' class="cyr"' : '') + ' style="font-size:' + (ru ? '22px' : '16px') + '">' + esc(o) + '</span>' +
        '</button>';
      }).join('') +
    '</div>' +
    '<div id="verdict"></div>';

  if ((item.autoSpeak || Store.hasPerk('autoplay')) && item.speak) {
    setTimeout(() => UI.speak({ ru: item.speak, tr: item.speakTr || null }), 300);
  }

  const opts = $('#opts');
  opts.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (b && !session.answered) answerChoice(+b.dataset.i, item);
  });
  session.keyHandler = (e) => {
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= item.options.length && !session.answered) answerChoice(n - 1, item);
  };
}

function answerChoice(idx, item) {
  const ok = idx === item.answer;
  session.grammarCat = item.gramCat || null;
  const counted = scoreAnswer(ok, item.wordId);
  if (item.wordId) Store.grade(item.wordId, counted ? (session.combo > 3 ? 3 : 2) : 0);
  if (item.onAnswer) item.onAnswer(ok);

  const nodes = $('#opts').querySelectorAll('.opt');
  nodes.forEach((n, i) => {
    n.disabled = true;
    if (i === idx) n.classList.add(ok ? 'good' : 'bad');
    if (!ok && i === item.answer) n.classList.add('reveal');
  });

  $('#verdict').innerHTML =
    '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' +
      '<div class="verdict-head">' + (ok ? 'Верно · dobrze' : 'Неверно · pudło') + '</div>' +
      (item.explain ? '<p>' + esc(item.explain) + '</p>' : '') +
      (item.hint ? '<div class="hint">' + esc(item.hint) + '</div>' : '') +
    '</div>';

  advance(ok ? 750 : 1900);
}

/* ---------- tryb: fiszka z samooceną ---------- */

function renderFlash(box, item) {
  const w = item.word;
  box.innerHTML =
    sessTop() +
    '<div class="flip" id="flip">' +
      '<div class="flip-in">' +
        '<div class="flip-face">' +
          '<span class="prompt-kind">' + (item.reverse ? 'Po polsku' : 'Po rosyjsku') + '</span>' +
          '<div class="prompt-word cyr">' + esc(item.reverse ? w.pl : w.ru) + '</div>' +
          '<div class="flip-hint">Kliknij, żeby odwrócić · spacja</div>' +
        '</div>' +
        '<div class="flip-face back">' +
          '<div class="prompt-word cyr">' + esc(item.reverse ? w.ru : w.pl) + '</div>' +
          '<div class="prompt-tr">' + esc(w.tr) + '</div>' +
          (w.ex ? '<div class="prompt-ex">' + esc(w.ex) + '<div class="pl">' + esc(w.exPl || '') + '</div></div>' : '') +
          '<div class="flip-hint">Jak poszło?</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div id="gradebox"></div>';

  const flip = $('#flip');
  const reveal = () => {
    if (flip.classList.contains('on')) return;
    flip.classList.add('on');
    UI.speak(w);
    $('#gradebox').innerHTML =
      '<div class="grade">' +
        '<button class="btn g0" data-g="0">Nie znam<small>od nowa</small></button>' +
        '<button class="btn g1" data-g="1">Z trudem<small>wkrótce</small></button>' +
        '<button class="btn g2" data-g="2">Dobrze<small>za kilka dni</small></button>' +
        '<button class="btn g3" data-g="3">Od ręki<small>za tydzień+</small></button>' +
      '</div>';
    $('#gradebox').addEventListener('click', (e) => {
      const b = e.target.closest('[data-g]');
      if (!b || session.answered) return;
      const g = +b.dataset.g;
      scoreAnswer(g >= 2, g < 2 ? w.id : null);
      Store.grade(w.id, g);
      advance(220);
    });
  };
  flip.addEventListener('click', reveal);
  session.keyHandler = (e) => {
    if (e.code === 'Space') { e.preventDefault(); reveal(); }
    const n = parseInt(e.key, 10);
    if (flip.classList.contains('on') && n >= 1 && n <= 4 && !session.answered) {
      const g = n - 1;
      scoreAnswer(g >= 2, g < 2 ? w.id : null);
      Store.grade(w.id, g);
      advance(220);
    }
  };
}

/* ---------- tryb: wpisz po rosyjsku ---------- */

const KEYS = [
  'йцукенгшщзхъ',
  'фывапролджэ',
  'ячсмитьбюё',
];

function renderType(box, item) {
  const w = item.word;
  box.innerHTML =
    sessTop() +
    '<div class="prompt">' +
      '<span class="prompt-kind">Napisz po rosyjsku</span>' +
      '<div class="prompt-word">' + esc(w.pl) + '</div>' +
      (item.showTr ? '<div class="prompt-tr">' + esc(w.tr) + '</div>' : '') +
    '</div>' +
    '<div class="typebox">' +
      '<input id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="wpisz cyrylicą…">' +
      '<button class="btn primary" data-act="check">Sprawdź</button>' +
    '</div>' +
    '<div class="keyb" id="kb">' +
      KEYS.map((r) => r.split('').map((c) => '<button data-k="' + c + '">' + c + '</button>').join('')).join('') +
      '<button data-k=" " class="wide">spacja</button>' +
      '<button data-k="\\b" class="wide">⌫</button>' +
    '</div>' +
    '<div style="text-align:center"><button class="btn sm ghost" data-act="dunno">Nie wiem — pokaż</button></div>' +
    '<div id="verdict"></div>';

  const input = $('#tin');
  input.focus();

  $('#kb').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = b.dataset.k;
    if (k === '\\b') input.value = input.value.slice(0, -1);
    else input.value += k;
    input.focus();
  });

  const check = (giveUp) => {
    if (session.answered) return;
    const guess = norm(input.value);
    const target = norm(w.ru);
    const ok = !giveUp && guess === target;
    const counted = scoreAnswer(ok, ok ? null : w.id);
    Store.grade(w.id, counted ? 3 : 0);
    if (ok) { ST().stats.typed++; Store.bump('typed'); }
    input.classList.add(ok ? 'good' : 'bad');
    input.disabled = true;
    UI.speak(w);
    $('#verdict').innerHTML =
      '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="verdict-head">' + (ok ? 'Верно · dobrze' : 'Poprawnie: ' + esc(w.ru)) + '</div>' +
        '<p>' + esc(w.tr) + (w.ex ? ' · ' + esc(w.ex) : '') + '</p>' +
      '</div>';
    advance(ok ? 800 : 2200);
  };

  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="check"]')) check(false);
    if (e.target.closest('[data-act="dunno"]')) check(true);
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(false); });
  session.keyHandler = null;
}

function norm(s) {
  return String(s).toLowerCase().replace(/ё/g, 'е').replace(/[^а-я\s]/g, '').replace(/\s+/g, ' ').trim();
}

/* ---------- tryb: dopasuj pary ---------- */

function renderMatch(box, item) {
  const pairs = item.pairs;
  const left = shuffle(pairs.slice());
  const right = shuffle(pairs.slice());
  let sel = null, hits = 0, misses = 0;

  box.innerHTML =
    sessTop() +
    '<div class="prompt" style="padding:20px"><span class="prompt-kind">Dopasuj pary</span>' +
      '<div class="prompt-q">Połącz rosyjskie słowa z polskimi znaczeniami</div></div>' +
    '<div class="match">' +
      '<div class="match-col">' + left.map((p) =>
        '<button class="match-item" data-side="l" data-id="' + p.id + '"><span class="ru">' + esc(p.ru) + '</span></button>').join('') + '</div>' +
      '<div class="match-col">' + right.map((p) =>
        '<button class="match-item" data-side="r" data-id="' + p.id + '">' + esc(p.pl) + '</button>').join('') + '</div>' +
    '</div>';

  box.addEventListener('click', (e) => {
    const b = e.target.closest('.match-item');
    if (!b || b.classList.contains('hit')) return;

    if (!sel) {
      box.querySelectorAll('.match-item.sel').forEach((n) => n.classList.remove('sel'));
      sel = b;
      b.classList.add('sel');
      const p = pairs.find((x) => x.id === b.dataset.id);
      if (b.dataset.side === 'l' && p) UI.speak(p);
      return;
    }
    if (sel === b) { b.classList.remove('sel'); sel = null; return; }
    if (sel.dataset.side === b.dataset.side) {
      box.querySelectorAll('.match-item.sel').forEach((n) => n.classList.remove('sel'));
      sel = b; b.classList.add('sel'); return;
    }

    if (sel.dataset.id === b.dataset.id) {
      sel.classList.remove('sel'); sel.classList.add('hit'); b.classList.add('hit');
      Store.grade(b.dataset.id, 2);
      hits++;
      sel = null;
      if (hits === pairs.length) {
        scoreAnswer(misses === 0, null);
        for (let k = 1; k < pairs.length; k++) { Store.logAnswer(true); session.correct++; }
        UI.burst(innerWidth / 2, innerHeight / 2, 30);
        advance(700);
      }
    } else {
      const a = sel;
      a.classList.add('miss'); b.classList.add('miss');
      Store.grade(b.dataset.id, 0);
      misses++;
      session.combo = 0;
      setTimeout(() => { a.classList.remove('miss', 'sel'); b.classList.remove('miss'); }, 440);
      sel = null;
    }
  });
  session.keyHandler = null;
}

/* ============================================================
   BUDOWANIE SESJI
   ============================================================ */

function distractors(word, key, n) {
  const pool = WORDS.filter((w) => w.cat === word.cat && w.id !== word.id);
  const extra = WORDS.filter((w) => w.id !== word.id);
  const chosen = [];
  const seen = new Set([word[key]]);
  for (const src of [shuffle(pool), shuffle(extra)]) {
    for (const w of src) {
      if (chosen.length >= n) break;
      if (seen.has(w[key])) continue;
      seen.add(w[key]);
      chosen.push(w[key]);
    }
    if (chosen.length >= n) break;
  }
  return chosen;
}

function choiceItem(word, dir) {
  const ruToPl = dir === 'ru>pl';
  const key = ruToPl ? 'pl' : 'ru';
  const correct = word[key];
  const options = shuffle([correct].concat(distractors(word, key, 3)));
  return {
    kind: 'choice',
    wordId: word.id,
    kindLabel: ruToPl ? 'Co to znaczy?' : 'Jak to po rosyjsku?',
    big: ruToPl ? word.ru : null,
    q: ruToPl ? null : word.pl,
    tr: ruToPl ? word.tr : null,
    speak: word.ru,
    speakTr: word.tr,
    bigOptions: !ruToPl,
    options,
    answer: options.indexOf(correct),
    explain: word.ru + ' · ' + word.pl + ' · ' + word.tr,
    hint: word.ex ? word.ex + (word.exPl ? '  —  ' + word.exPl : '') : null,
  };
}

function listenItem(word) {
  const options = shuffle([word.pl].concat(distractors(word, 'pl', 3)));
  return {
    kind: 'choice',
    wordId: word.id,
    kindLabel: 'Posłuchaj i wybierz',
    big: '♪',
    speak: word.ru,
    speakTr: word.tr,
    autoSpeak: true,
    options,
    answer: options.indexOf(word.pl),
    explain: word.ru + ' · ' + word.tr,
  };
}

/* Dobór ćwiczenia do stopnia znajomości słowa */
function itemForWord(w) {
  const c = ST().srs[w.id];
  const b = c ? c.b : 0;
  const seen = c && c.s > 0;
  if (!seen) return choiceItem(w, 'ru>pl');
  if (b <= 1) return Math.random() < 0.5 ? choiceItem(w, 'ru>pl') : choiceItem(w, 'pl>ru');
  if (b <= 2) return choiceItem(w, 'pl>ru');
  if (b <= 3) return UI.canSpeak() && Math.random() < 0.4 ? listenItem(w) : { kind: 'type', word: w, showTr: true };
  return { kind: 'type', word: w };
}

function startVocabSession(catId) {
  const cat = CATS.find((c) => c.id === catId);
  const all = WORDS.filter((w) => w.cat === catId);
  const now = Date.now();
  const fresh = all.filter((w) => !ST().srs[w.id] || ST().srs[w.id].s === 0);
  const due = all.filter((w) => ST().srs[w.id] && ST().srs[w.id].s > 0 && ST().srs[w.id].d <= now);
  const rest = all.filter((w) => !fresh.includes(w) && !due.includes(w));

  /* Siedem nowych, pięć z kolejki — a gdy któraś pula jest pusta,
     dobieramy z pozostałych, żeby sesja zawsze miała pełne dwanaście pozycji. */
  const chosen = pick(fresh, 7).concat(pick(due, 5));
  const taken = new Set(chosen.map((w) => w.id));
  const filler = shuffle(fresh.concat(due, rest).filter((w) => !taken.has(w.id)));
  while (chosen.length < 12 && filler.length) chosen.push(filler.shift());
  if (!chosen.length) { UI.toast('Nic do nauki', 'Ten temat masz opanowany'); return; }

  newSession({
    title: cat ? cat.name : 'Nauka słówek',
    items: shuffle(chosen).map(itemForWord),
    repeat: () => startVocabSession(catId),
  });
}

function startFlash(catId) {
  const all = catId ? WORDS.filter((w) => w.cat === catId) : WORDS;
  const chosen = pick(all, Math.min(15, all.length));
  newSession({
    title: 'Fiszki' + (catId ? ' · ' + CATS.find((c) => c.id === catId).name : ''),
    items: chosen.map((w) => ({ kind: 'flash', word: w, reverse: Math.random() < 0.3 })),
    repeat: () => startFlash(catId),
  });
}

function startTyping(catId) {
  const all = (catId ? WORDS.filter((w) => w.cat === catId) : WORDS)
    .filter((w) => w.ru.length <= 14 && !w.ru.includes('?'));
  const seenFirst = all.filter((w) => ST().srs[w.id] && ST().srs[w.id].s > 0);
  const pool = seenFirst.length >= 10 ? seenFirst : all;
  newSession({
    title: 'Wpisz z pamięci',
    items: pick(pool, 12).map((w) => ({ kind: 'type', word: w, showTr: !catId })),
    repeat: () => startTyping(catId),
  });
}

function startListen(catId) {
  if (!UI.canSpeak()) { UI.toast('Brak syntezatora mowy', 'Ta przeglądarka nie umie czytać po rosyjsku'); return; }
  const all = catId ? WORDS.filter((w) => w.cat === catId) : WORDS;
  newSession({
    title: 'Ze słuchu',
    items: pick(all, 12).map(listenItem),
    repeat: () => startListen(catId),
  });
}

function startMatch(catId) {
  const all = catId ? WORDS.filter((w) => w.cat === catId) : WORDS;
  const rounds = 4;
  const items = [];
  const used = new Set();
  for (let r = 0; r < rounds; r++) {
    const batch = [];
    const shuffled = shuffle(all);
    for (const w of shuffled) {
      if (batch.length >= 5) break;
      if (used.has(w.id)) continue;
      used.add(w.id);
      batch.push({ id: w.id, ru: w.ru, pl: w.pl, tr: w.tr });
    }
    if (batch.length === 5) items.push({ kind: 'match', pairs: batch });
  }
  if (!items.length) { UI.toast('Za mało słów', 'Wybierz szerszy zakres'); return; }
  newSession({ title: 'Dopasuj pary', items, repeat: () => startMatch(catId) });
}

function startReview() {
  const due = Store.dueCards();
  if (!due.length) {
    UI.toast('Kolejka pusta', 'Wróć później albo poznaj nowe słowa');
    return;
  }
  const words = due.map((id) => WORDS.find((w) => w.id === id)).filter(Boolean);
  const chosen = pick(words, Math.min(20, words.length));
  newSession({
    title: 'Powtórki',
    items: chosen.map((w) => (Math.random() < 0.35
      ? { kind: 'flash', word: w, reverse: false }
      : itemForWord(w))),
    repeat: () => startReview(),
  });
}

function startQuick() {
  const seen = WORDS.filter((w) => ST().srs[w.id] && ST().srs[w.id].s > 0);
  const pool = seen.length >= 10 ? seen : WORDS;
  newSession({
    title: 'Szybka runda',
    items: pick(pool, 10).map(itemForWord),
    repeat: () => startQuick(),
  });
}

function startWeak() {
  const weak = Store.weakWords(20);
  if (!weak.length) {
    UI.toast('Brak słabych punktów', 'Jeszcze nic Cię nie pokonało');
    return;
  }
  newSession({
    title: 'Słabe punkty',
    items: pick(weak, Math.min(12, weak.length)).map((w) => choiceItem(w, Math.random() < 0.5 ? 'ru>pl' : 'pl>ru')),
    repeat: () => startWeak(),
  });
}

/* ---------- moduły gramatyczne ---------- */

function quizItem(q) {
  const opts = q.options.slice();
  return {
    kind: 'choice',
    kindLabel: q.cat || 'Gramatyka',
    gramCat: q.cat || 'Gramatyka',
    q: q.q,
    options: opts,
    answer: q.answer,
    bigOptions: opts.some((o) => CYR.test(o)),
    hint: q.hint || null,
    speak: CYR.test(opts[q.answer]) ? opts[q.answer] : null,
  };
}

function startQuiz(mod, secIdx) {
  const sec = mod.sections[secIdx];
  if (!sec) return;
  newSession({
    title: mod.title + ' · ' + sec.title,
    items: shuffle(sec.questions).map(quizItem),
    repeat: () => startQuiz(mod, secIdx),
    onFinish: (sess) => {
      const st = Store.modState(mod.id);
      const prev = st.sec[secIdx];
      if (prev == null || sess.correct > prev) st.sec[secIdx] = sess.correct;
      return 20;
    },
  });
}

function startDrill(modId) {
  const mod = MODULES.find((m) => m.id === modId);
  if (!mod) return;
  const all = [];
  mod.sections.forEach((s) => s.questions.forEach((q) => all.push(q)));
  newSession({
    title: mod.title + ' · trening',
    items: pick(all, Math.min(20, all.length)).map(quizItem),
    repeat: () => startDrill(modId),
    onFinish: (sess) => {
      ST().drill[modId] = (ST().drill[modId] || 0) + sess.correct;
      return 15;
    },
  });
}

/* ---------- egzaminy ---------- */

function startExam(examId) {
  const ex = EXAMS.find((e) => e.id === examId);
  if (!ex) return;
  newSession({
    title: ex.title,
    items: shuffle(ex.questions).map(quizItem),
    repeat: () => startExam(examId),
    exam: ex,
    onFinish: (sess, pct) => {
      const prev = ST().exams[examId];
      const rec = {
        best: Math.max(prev ? prev.best : 0, sess.correct),
        total: sess.items.length,
        attempts: (prev ? prev.attempts : 0) + 1,
        last: sess.correct,
        ts: Date.now(),
      };
      ST().exams[examId] = rec;
      return pct >= 80 ? 120 : pct >= 60 ? 60 : 20;
    },
  });
}

/* ============================================================
   KLAWIATURA I START
   ============================================================ */

document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea')) return;
  if (session && session.keyHandler) session.keyHandler(e);
  if (e.key === 'Escape' && session) { stopClock(); session = null; render(); }
});

function applyAccent() {
  const a = ST().settings.accent;
  document.documentElement.dataset.accent = (a && Store.hasPerk('accent_' + a)) ? a : '';
}

/* Zapisany wybór wygrywa z ustawieniem systemu. Dopóki go nie ma,
   idziemy za systemem — wieczorem ciemno, rano jasno. */
function applyTheme() {
  const wybor = ST().settings.theme;
  const ciemny = wybor
    ? wybor === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = ciemny ? 'dark' : 'light';
  return ciemny;
}

function themeIsDark() {
  return document.documentElement.dataset.theme === 'dark';
}

/* Przełącznik dnia i nocy — wzór Uiverse.io / Galahhad.
   Budowa jest jego, bo cały efekt (wschód księżyca, odjeżdżające
   chmury, wjeżdżające gwiazdy) siedzi w tych zagnieżdżonych węzłach
   i w regułach na :checked. */
function themeSwitch() {
  const gwiazdy =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">' +
      '<path fill-rule="evenodd" clip-rule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"></path>' +
    '</svg>';

  return (
    '<label class="theme-switch" title="Jasny albo ciemny">' +
      '<input type="checkbox" class="theme-switch__checkbox" id="themebox"' +
        (themeIsDark() ? ' checked' : '') + '>' +
      '<div class="theme-switch__container">' +
        '<div class="theme-switch__clouds"></div>' +
        '<div class="theme-switch__stars-container">' + gwiazdy + '</div>' +
        '<div class="theme-switch__circle-container">' +
          '<div class="theme-switch__sun-moon-container">' +
            '<div class="theme-switch__moon">' +
              '<div class="theme-switch__spot"></div>' +
              '<div class="theme-switch__spot"></div>' +
              '<div class="theme-switch__spot"></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</label>'
  );
}

function boot() {
  if (window.Speech) Speech.init();
  buildShell();
  applyAccent();
  applyTheme();

  /* Kropka zapisu żyje własnym życiem — odświeża się przy każdej zmianie
     stanu wysyłki, bez przerysowywania całego paska. */
  API.onStatus(paintSave);

  /* Zamrożenie passy działa samo, zanim policzymy cokolwiek innego */
  if (Store.applyFreeze()) {
    Store.save();
    setTimeout(() => UI.toast('Passa uratowana', 'Zużyto jedno zamrożenie'), 900);
  }

  if (!location.hash) location.hash = '#/home';
  render();

  const s = ST();
  if (s.lastDay && s.lastDay !== Store.today() && Store.streakAlive()) {
    setTimeout(() => UI.toast('Passa żyje: ' + s.streak + ' dni', 'Jedna sesja dziś i lecisz dalej'), 700);
  }
  const due = Store.dueCount();
  if (due >= 10) {
    setTimeout(() => UI.toast(due + ' kart czeka', 'Powtórki to najtańszy sposób na zapamiętanie'), 1300);
  }
}

/* Aplikacja nie może wystartować, zanim nie wiemy, czyj postęp wczytać —
   stan mieszka w bazie, nie w przeglądarce. Auth pokazuje ekran konta,
   pobiera stan z serwera i dopiero wtedy woła boot(). */
function start() { Auth.start(boot); }

/* Skrypty stoją na końcu body, ale w niektórych trybach podglądu wykonują się
   dopiero po DOMContentLoaded — wtedy nasłuch by nigdy nie zadziałał. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
})();
