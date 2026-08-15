(function () {
/* ============================================================
   EKRANY DODATKOWE
   Zadania poboczne · Sklep · Klawiatura · Układacz zdań · Czytelnia
   Rejestrują się w App.VIEWS i App.KINDS, żeby app.js nie puchł.
   ============================================================ */

const { h, esc, shuffle, pick, bar, fmtTime } = UI;
const ST = () => Store.s;
const $ = (s, r) => (r || App.view).querySelector(s);

function head(eyebrow, title, lead, actions) {
  return '<div class="view-head">' +
    '<span class="eyebrow">' + esc(eyebrow) + '</span>' +
    '<h1>' + esc(title) + '</h1>' +
    (lead ? '<p>' + esc(lead) + '</p>' : '') +
    (actions ? '<div class="now-actions">' + actions + '</div>' : '') +
  '</div>';
}

/* ============================================================
   ZADANIA POBOCZNE
   ============================================================ */

function viewQuests() {
  const v = App.view;
  const quests = Store.dailyQuests();
  const weakT = Store.weakTopics();
  const weakW = Store.weakWords(40);
  const due = Store.dueCount();

  const questCards = quests.map((q) => {
    const p = Store.questProgress(q);
    const claimed = Store.questClaimed(q);
    const pct = Math.round((p.now / p.max) * 100);
    return (
      '<div class="quest' + (claimed ? ' done' : '') + '">' +
        '<div class="quest-top">' +
          '<div>' +
            '<div class="quest-ru cyr">' + esc(q.ru) + '</div>' +
            '<div class="quest-pl">' + esc(q.pl) + '</div>' +
          '</div>' +
          '<div class="quest-pay">' +
            '<span class="coin">+' + q.coin + ' ₽</span>' +
            '<span class="dim">+' + q.xp + ' XP</span>' +
          '</div>' +
        '</div>' +
        '<p class="quest-desc">' + esc(q.desc) + '</p>' +
        bar(pct, claimed ? 'green' : '') +
        '<div class="quest-foot">' +
          (claimed ? '<span class="chip green">Odebrane</span>'
                   : '<span class="mono">' + p.now + ' / ' + p.max + '</span>') +
        '</div>' +
      '</div>'
    );
  }).join('');

  /* Sesje naprawcze — proponowane tylko wtedy, gdy naprawdę jest co naprawiać */
  const fixes = [];
  if (due > 0) {
    fixes.push(fixCard('Kolejka powtórek', due + ' ' + UI.plural(due, 'karta czeka', 'karty czekają', 'kart czeka'),
      'Najtańszy sposób, żeby nie stracić tego, co już umiesz.', 'review', null));
  }
  if (weakW.length >= 5) {
    fixes.push(fixCard('Słowa, które uciekają', weakW.length + ' ' + UI.plural(weakW.length, 'słowo', 'słowa', 'słów'),
      'Te pomyliłeś najczęściej. Sesja złożona wyłącznie z nich.', 'weak', null));
  }
  weakT.slice(0, 4).forEach((t) => {
    const pct = Math.round(t.rate * 100);
    fixes.push(fixCard(t.cat, pct + '% błędów',
      'Na ' + t.n + ' pytań z tego tematu pomyliłeś ' + t.bad + '. Powtórka skupiona na tym jednym.',
      'fix-topic', t.cat));
  });

  const noFix =
    '<div class="empty"><div class="g cyr">✓</div>' +
    'Nie ma czego naprawiać. Kolejka pusta, żaden temat Cię nie gubi.<br>' +
    'Wróć tu po kilku sesjach — wtedy będzie z czego wyciągać wnioski.</div>';

  v.innerHTML =
    head('Odświeżają się codziennie o północy', 'Zadania',
      'Trzy wyzwania na dziś i osobna lista tego, co warto nadrobić. Nic tu nie blokuje ścieżki — to dodatek dla chętnych.') +
    '<div class="group-head"><h3>Na dziś</h3><span class="d">losowane raz dziennie</span></div>' +
    '<div class="grid g3 stagger">' + questCards + '</div>' +
    '<div class="group-head"><h3>Do nadrobienia</h3><span class="d">wyliczone z Twoich błędów</span></div>' +
    (fixes.length ? '<div class="grid g2 stagger">' + fixes.join('') + '</div>' : noFix);

  v.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fix]');
    if (!b) return;
    if (b.dataset.fix === 'fix-topic') startTopicFix(b.dataset.topic);
  });
  App.wireCommon();
}

function fixCard(title, badge, desc, act, topic) {
  return (
    '<button class="cat" ' + (act === 'fix-topic'
      ? 'data-fix="fix-topic" data-topic="' + esc(topic) + '"'
      : 'data-act="' + act + '"') + '>' +
      '<div class="cat-ru">' + esc(badge) + '</div>' +
      '<div class="cat-name">' + esc(title) + '</div>' +
      '<div style="font-size:13px;color:var(--muted);line-height:1.5">' + esc(desc) + '</div>' +
      '<div class="eyebrow gold" style="margin-top:14px">Napraw →</div>' +
    '</button>'
  );
}

/* Sesja naprawcza z jednego tematu gramatycznego */
function startTopicFix(cat) {
  const all = [];
  MODULES.forEach((m) => m.sections.forEach((s) =>
    s.questions.forEach((q) => { if ((q.cat || s.title) === cat) all.push(q); })));
  EXAMS.forEach((e) => e.questions.forEach((q) => { if (q.cat === cat) all.push(q); }));

  if (!all.length) { UI.toast('Brak pytań', 'Nie mam materiału akurat na ten temat'); return; }

  App.newSession({
    title: 'Naprawa: ' + cat,
    items: pick(all, Math.min(15, all.length)).map(quizItemLocal),
    repeat: () => startTopicFix(cat),
    onFinish: () => 25,
  });
}

function quizItemLocal(q) {
  const opts = q.options.slice();
  return {
    kind: 'choice',
    kindLabel: q.cat || 'Gramatyka',
    gramCat: q.cat || 'Gramatyka',
    q: q.q,
    options: opts,
    answer: q.answer,
    bigOptions: opts.some((o) => App.CYR.test(o)),
    hint: q.hint || null,
    speak: App.CYR.test(opts[q.answer]) ? opts[q.answer] : null,
  };
}

/* ============================================================
   SKLEP
   ============================================================ */

function viewShop() {
  const v = App.view;
  const s = ST();

  const card = (item) => {
    const owned = item.kind === 'perk' ? Store.hasPerk(item.id) : Store.itemCount(item.id);
    const maxed = item.kind === 'use' && owned >= item.max;
    const afford = s.coins >= item.price;
    const blocked = (item.kind === 'perk' && owned) || maxed;
    return (
      '<div class="shop-item' + (blocked ? ' owned' : '') + '">' +
        '<div class="shop-ico cyr">' + esc(item.icon) + '</div>' +
        '<div class="shop-body">' +
          '<div class="shop-ru cyr">' + esc(item.ru) + '</div>' +
          '<div class="shop-name">' + esc(item.pl) + '</div>' +
          '<p class="shop-desc">' + esc(item.desc) + '</p>' +
        '</div>' +
        '<div class="shop-buy">' +
          (item.kind === 'use' && owned ? '<span class="chip gold">masz ' + owned + '</span>' : '') +
          (item.kind === 'perk' && owned ? '<span class="chip green">kupione</span>' :
            '<button class="btn sm' + (afford ? ' primary' : '') + '" data-buy="' + item.id + '"' +
            (afford && !blocked ? '' : ' disabled') + '>' + item.price + ' ₽</button>') +
        '</div>' +
      '</div>'
    );
  };

  const accents = ['jade', 'iris'].filter((a) => Store.hasPerk('accent_' + a));
  const accentRow = accents.length
    ? '<div class="group-head"><h3>Kolor wiodący</h3></div>' +
      '<div class="card"><div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<button class="btn sm' + (!s.settings.accent ? ' primary' : '') + '" data-act="accent-set">Bursztyn</button>' +
        accents.map((a) =>
          '<button class="btn sm' + (s.settings.accent === a ? ' primary' : '') +
          '" data-act="accent-set" data-accent="' + a + '">' +
          (a === 'jade' ? 'Nefryt' : 'Irys') + '</button>').join('') +
      '</div></div>'
    : '';

  v.innerHTML =
    head('Płaci się za celność, nie za czas', 'Sklep',
      'Rubli nie zdobywa się klikaniem w kółko. Sesja bez błędu daje więcej niż wszystkie poprawne odpowiedzi razem wzięte.') +
    '<div class="wallet">' +
      '<div class="wallet-sum"><span class="cyr">' + s.coins + '</span> ₽</div>' +
      '<div class="wallet-note">' +
        'Za odpowiedź 1 ₽ · trafność ponad 90% +20 ₽ · sesja bez błędu +40 ₽ · każde pięć serii +4 ₽' +
      '</div>' +
    '</div>' +
    '<div class="group-head"><h3>Do zużycia</h3><span class="d">działają w trakcie sesji</span></div>' +
    '<div class="grid g2 stagger">' + SHOP.filter((i) => i.kind === 'use').map(card).join('') + '</div>' +
    '<div class="group-head"><h3>Na stałe</h3><span class="d">kupujesz raz</span></div>' +
    '<div class="grid g2 stagger">' + SHOP.filter((i) => i.kind === 'perk').map(card).join('') + '</div>' +
    accentRow;

  v.addEventListener('click', (e) => {
    const b = e.target.closest('[data-buy]');
    if (!b || b.disabled) return;
    const res = Store.buy(b.dataset.buy);
    if (!res.ok) { UI.toast('Nie udało się', res.why); return; }
    UI.toast('Kupione', res.item.pl);
    UI.burst(innerWidth / 2, innerHeight / 3, 24);
    App.render();
  });
  App.wireCommon();
}

/* ============================================================
   KLAWIATURA ЙЦУКЕН
   ============================================================ */

let kbState = null;

function viewKeyboard(lessonId) {
  const v = App.view;
  if (lessonId) return kbLesson(lessonId);

  const kb = ST().kb;
  const cards = KB_LESSONS.map((l, i) => {
    const st = kb.lessons[l.id];
    const done = !!st;
    return (
      '<button class="goal ' + (done ? 'done' : i === 0 || kb.lessons[KB_LESSONS[i - 1].id] ? 'active' : '') + '"' +
        ' data-lesson="' + l.id + '">' +
        '<span class="goal-mark cyr">' + (done ? '✓' : i + 1) + '</span>' +
        '<span class="goal-body">' +
          '<span class="goal-title">' + esc(l.title) + '  <span class="dim cyr" style="font-weight:400">' + esc(l.ru) + '</span></span>' +
          '<span class="goal-desc">' + esc(l.desc) + '</span>' +
        '</span>' +
        '<span class="goal-side">' +
          (st ? '<span class="goal-xp">' + st.cpm + ' zn/min</span>' : '<span class="goal-xp">→</span>') +
        '</span>' +
      '</button>'
    );
  }).join('');

  v.innerHTML =
    head('Pisanie bezwzrokowe', 'Klawiatura ЙЦУКЕН',
      'Nie musisz dodawać rosyjskiego układu do Windowsa. Trener czyta pozycję klawisza, nie znak — naciskasz F, pojawia się а, palec uczy się właściwego miejsca.') +
    '<div class="tiles">' +
      App.tile(kb.chars, 'wystukanych znaków', '', 'var(--amber)') +
      App.tile(kb.bestCpm, 'rekord zn/min', 'znaków na minutę', 'var(--jade)') +
      App.tile(Object.keys(kb.lessons).length + '/' + KB_LESSONS.length, 'lekcji', '', 'var(--iris)') +
      App.tile(kb.chars ? Math.round(((kb.chars - kb.errors) / kb.chars) * 100) + '%' : '—', 'celność', kb.errors + ' pomyłek', 'var(--coral)') +
    '</div>' +
    kbBoard(null, null) +
    '<div class="group-head"><h3>Lekcje</h3><span class="d">od rzędu podstawowego w górę</span></div>' +
    '<div class="goals stagger">' + cards + '</div>';

  v.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lesson]');
    if (b) App.go('keyboard/' + b.dataset.lesson);
  });
}

/* Rysunek klawiatury; next = litera do podświetlenia */
function kbBoard(next, wrong) {
  const showHint = Store.hasPerk('keyhint');
  const rows = KB_ROWS.map((row, ri) =>
    '<div class="kbrow">' +
      (ri === 2 ? '<span class="kbpad"></span>' : '') +
      row.map((key) => {
        const hot = next && key.k === next;
        const cls = ['kbkey', 'f' + key.f];
        if (key.home) cls.push('home');
        if (hot) cls.push('next');
        if (hot && wrong) cls.push('wrong');
        return '<span class="' + cls.join(' ') + '" data-k="' + esc(key.k) + '">' + esc(key.k) + '</span>';
      }).join('') +
    '</div>').join('');

  const fingerName = next ? fingerFor(next) : null;
  return (
    '<div class="kbboard' + (showHint ? ' hinted' : '') + '">' +
      rows +
      '<div class="kbrow"><span class="kbkey space' + (next === ' ' ? ' next' : '') + '" data-k=" ">пробел</span></div>' +
      '<div class="kbfoot">' +
        (fingerName
          ? '<span class="chip gold">' + esc(FINGERS[fingerName].name) + '</span>'
          : '<span class="dim" style="font-size:12px">Palce spoczywają na <b class="cyr">фыва</b> i <b class="cyr">олдж</b> — wypustki są na <b class="cyr">а</b> i <b class="cyr">о</b>.</span>') +
      '</div>' +
    '</div>'
  );
}

function fingerFor(ch) {
  for (const row of KB_ROWS) {
    for (const key of row) if (key.k === ch) return key.f;
  }
  return null;
}

function kbLesson(id) {
  const v = App.view;
  const lesson = KB_LESSONS.find((l) => l.id === id);
  if (!lesson) { App.go('keyboard'); return; }

  let lines = lesson.drills ? lesson.drills.slice() : [];
  if (lesson.fromVocab) {
    const seen = WORDS.filter((w) => ST().srs[w.id] && !/[^а-яё ]/i.test(w.ru));
    const pool = (seen.length >= 20 ? seen : WORDS).filter((w) => !/[^а-яё ]/i.test(w.ru));
    for (let i = 0; i < 5; i++) lines.push(pick(pool, 4).map((w) => w.ru.toLowerCase()).join(' '));
  }
  if (lesson.fromSentences) {
    lines = pick(SENTENCES, 5).map((s) => s.ru.toLowerCase());
  }

  kbState = {
    lesson, lines, li: 0, pos: 0, typed: '',
    errors: 0, chars: 0, started: 0, wrong: false, done: false,
  };

  drawKb();
  document.addEventListener('keydown', kbKey);
}

function drawKb() {
  const k = kbState;
  if (!k) return;
  const v = App.resetView('view');
  const line = k.lines[k.li] || '';
  const next = k.done ? null : line[k.pos];

  const elapsed = k.started ? (Date.now() - k.started) / 60000 : 0;
  const cpm = elapsed > 0.02 ? Math.round(k.chars / elapsed) : 0;
  const acc = k.chars ? Math.round(((k.chars - k.errors) / k.chars) * 100) : 100;

  const chars = line.split('').map((c, i) => {
    let cls = 'kc';
    if (i < k.pos) cls += ' ok';
    else if (i === k.pos) cls += k.wrong ? ' cur bad' : ' cur';
    return '<span class="' + cls + '">' + (c === ' ' ? '&nbsp;' : esc(c)) + '</span>';
  }).join('');

  v.innerHTML =
    '<div class="session" style="max-width:820px">' +
      '<div class="sess-top">' +
        '<button class="btn sm ghost" data-act="kb-quit">✕</button>' +
        bar(Math.round((k.li / k.lines.length) * 100)) +
        '<span class="sess-count">' + (k.li + 1) + '/' + k.lines.length + '</span>' +
        '<span class="sess-count mono">' + cpm + ' zn/min</span>' +
        '<span class="sess-count mono">' + acc + '%</span>' +
      '</div>' +
      (k.done ? kbSummary(cpm, acc) :
        '<div class="kbline">' + chars + '</div>' +
        kbBoard(next, k.wrong) +
        '<p class="dim" style="text-align:center;font-size:12.5px;margin-top:16px">' +
          'Pisz na swojej klawiaturze — liczy się pozycja klawisza, nie to, jaki masz układ w systemie.' +
        '</p>') +
    '</div>';

  App.view.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="kb-quit"]')) kbExit();
    if (e.target.closest('[data-act="kb-again"]')) kbLesson(k.lesson.id);
    if (e.target.closest('[data-act="kb-back"]')) kbExit();
  });
}

function kbSummary(cpm, acc) {
  return (
    '<div class="summary">' +
      '<span class="eyebrow">' + esc(kbState.lesson.title) + '</span>' +
      '<div class="summary-score">' + cpm + '<small> zn/min</small></div>' +
      '<h2>' + (cpm >= 120 ? 'Свободно · swobodnie' : cpm >= 70 ? 'Уверенно · pewnie' : 'Ещё раз · jeszcze raz') + '</h2>' +
      '<div style="text-align:left;max-width:400px;margin:0 auto 26px">' +
        '<div class="summary-line"><span class="l">Celność</span><span class="v">' + acc + '%</span></div>' +
        '<div class="summary-line"><span class="l">Znaki</span><span class="v">' + kbState.chars + '</span></div>' +
        '<div class="summary-line"><span class="l">Pomyłki</span><span class="v">' + kbState.errors + '</span></div>' +
      '</div>' +
      '<div class="now-actions" style="justify-content:center">' +
        '<button class="btn primary" data-act="kb-again">Jeszcze raz</button>' +
        '<button class="btn ghost" data-act="kb-back">Lista lekcji</button>' +
      '</div>' +
    '</div>'
  );
}

function kbKey(e) {
  const k = kbState;
  if (!k || k.done) return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (e.key === 'Escape') { kbExit(); return; }

  /* Litera z układu rosyjskiego, jeśli jest — inaczej z pozycji klawisza */
  let ch = null;
  if (e.key && e.key.length === 1 && /[а-яё ]/i.test(e.key)) ch = e.key.toLowerCase();
  else if (KB_CODES[e.code]) ch = KB_CODES[e.code];
  if (!ch) return;

  e.preventDefault();
  if (!k.started) k.started = Date.now();

  const line = k.lines[k.li];
  const want = line[k.pos];
  k.chars++;

  if (ch === want) {
    k.pos++;
    k.wrong = false;
    if (k.pos >= line.length) {
      k.li++;
      k.pos = 0;
      if (k.li >= k.lines.length) finishKb();
    }
  } else {
    k.errors++;
    k.wrong = true;
  }
  Store.bump('keys');
  drawKb();
}

function finishKb() {
  const k = kbState;
  k.done = true;
  const mins = (Date.now() - k.started) / 60000;
  const cpm = mins > 0 ? Math.round(k.chars / mins) : 0;
  const acc = k.chars ? Math.round(((k.chars - k.errors) / k.chars) * 100) : 100;

  const kb = ST().kb;
  kb.chars += k.chars;
  kb.errors += k.errors;
  kb.bestCpm = Math.max(kb.bestCpm, cpm);
  const prev = kb.lessons[k.lesson.id];
  if (!prev || cpm > prev.cpm) kb.lessons[k.lesson.id] = { cpm, acc, ts: Date.now() };

  const xp = Math.round(cpm / 3) + (acc >= 95 ? 25 : 0);
  Store.addXp(xp);
  Store.addCoins(Math.round(cpm / 6) + (acc === 100 ? 20 : 0));
  Store.commit();
  if (acc >= 95) UI.burst(innerWidth / 2, innerHeight / 3, 40);
}

function kbExit() {
  document.removeEventListener('keydown', kbKey);
  kbState = null;
  App.go('keyboard');
  App.render();
}

/* ============================================================
   UKŁADACZ ZDAŃ
   ============================================================ */

function viewSentences() {
  const v = App.view;
  const st = ST().sent;
  const levels = [
    { lvl: 1, name: 'Proste zdania', ru: 'Простые', desc: 'Teraźniejszość, szyk podstawowy' },
    { lvl: 2, name: 'Przypadki i przeszłość', ru: 'Падежи', desc: 'Odmiana w praktyce, sytuacje z życia' },
    { lvl: 3, name: 'Zdania złożone', ru: 'Сложные', desc: 'Spójniki, aspekt, tryb przypuszczający' },
    { lvl: 4, name: 'Mowa żywa', ru: 'Живая речь', desc: 'To, czego nie ma w podręczniku' },
  ];

  v.innerHTML =
    head(SENTENCES.length + ' zdań w czterech poziomach', 'Układacz zdań',
      'Pojedyncze słowa nie składają się same w zdanie. Tu ćwiczysz szyk, końcówki i to, czego rosyjski nie mówi wprost.') +
    '<div class="tiles">' +
      App.tile(st.done, 'ułożonych zdań', '', 'var(--amber)') +
      App.tile(st.done ? Math.round((st.ok / st.done) * 100) + '%' : '—', 'za pierwszym razem', '', 'var(--jade)') +
      App.tile(SENTENCES.length, 'zdań w bazie', '', 'var(--iris)') +
    '</div>' +
    '<div class="grid g2 stagger">' +
      levels.map((l) => {
        const total = SENTENCES.filter((s) => s.lvl === l.lvl).length;
        const done = (st.lvl && st.lvl[l.lvl]) || 0;
        const pct = Math.round((Math.min(done, total) / total) * 100);
        return (
          '<button class="cat" data-lvl="' + l.lvl + '">' +
            '<span class="cat-glyph num">' + l.lvl + '</span>' +
            '<div class="cat-ru cyr">' + esc(l.ru) + '</div>' +
            '<div class="cat-name">' + esc(l.name) + '</div>' +
            '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">' + esc(l.desc) + '</div>' +
            '<div class="cat-stat"><span>' + Math.min(done, total) + ' / ' + total + '</span><span>' + pct + '%</span></div>' +
            bar(pct, pct === 100 ? 'green' : '') +
          '</button>'
        );
      }).join('') +
    '</div>';

  v.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lvl]');
    if (b) startSentences(+b.dataset.lvl);
  });
}

function startSentences(lvl) {
  const pool = SENTENCES.filter((s) => s.lvl === lvl);
  if (!pool.length) return;
  const chosen = pick(pool, Math.min(8, pool.length));

  App.newSession({
    title: 'Zdania · poziom ' + lvl,
    items: chosen.map((s, i) => (i % 3 === 2 ? sentenceChoice(s) : { kind: 'sentence', s })),
    repeat: () => startSentences(lvl),
    onFinish: (sess) => {
      const st = ST().sent;
      st.lvl = st.lvl || {};
      st.lvl[lvl] = (st.lvl[lvl] || 0) + sess.correct;
      return 20;
    },
  });
}

/* Wariant odwrotny: rosyjskie zdanie, wybierz polskie znaczenie */
function sentenceChoice(s) {
  const others = shuffle(SENTENCES.filter((x) => x !== s && x.lvl === s.lvl)).slice(0, 3).map((x) => x.pl);
  const options = shuffle([s.pl].concat(others));
  return {
    kind: 'choice',
    kindLabel: 'Co znaczy to zdanie?',
    big: s.ru,
    speak: s.ru,
    options,
    answer: options.indexOf(s.pl),
    explain: s.ru,
    hint: s.note || null,
  };
}

/* Kafelki do ułożenia */
function renderSentence(box, item) {
  const s = item.s;
  const words = s.ru.split(/\s+/);
  const decoys = shuffle(
    SENTENCES.filter((x) => x !== s).flatMap((x) => x.ru.split(/\s+/))
  ).filter((w) => !words.includes(w)).slice(0, words.length > 5 ? 2 : 3);

  const bank = shuffle(words.concat(decoys));
  let placed = [];

  box.innerHTML =
    App.sessTop() +
    '<div class="prompt" style="padding:30px 26px">' +
      '<span class="prompt-kind">Ułóż zdanie po rosyjsku</span>' +
      '<div class="prompt-q">' + esc(s.pl) + '</div>' +
    '</div>' +
    '<div class="slot" id="slot"><span class="slot-empty">Klikaj słowa w kolejności</span></div>' +
    '<div class="bank" id="bank">' +
      bank.map((w, i) => '<button class="tile-w" data-i="' + i + '">' + esc(w) + '</button>').join('') +
    '</div>' +
    '<div class="now-actions" style="justify-content:center;margin-top:18px">' +
      '<button class="btn primary" data-act="check-sent">Sprawdź</button>' +
      '<button class="btn ghost" data-act="clear-sent">Wyczyść</button>' +
    '</div>' +
    '<div id="verdict"></div>';

  const slot = $('#slot', box);
  const bankEl = $('#bank', box);

  const redraw = () => {
    slot.innerHTML = placed.length
      ? placed.map((p, i) => '<button class="tile-w in" data-p="' + i + '">' + esc(p.w) + '</button>').join('')
      : '<span class="slot-empty">Klikaj słowa w kolejności</span>';
  };

  bankEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-i]');
    if (!b || b.classList.contains('used') || App.session.answered) return;
    b.classList.add('used');
    placed.push({ w: b.textContent, el: b });
    redraw();
  });

  slot.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b || App.session.answered) return;
    const idx = +b.dataset.p;
    placed[idx].el.classList.remove('used');
    placed.splice(idx, 1);
    redraw();
  });

  const check = () => {
    if (App.session.answered) return;
    const guess = placed.map((p) => p.w).join(' ');
    const ok = guess === s.ru;
    App.scoreAnswer(ok, null);

    const st = ST().sent;
    st.done++;
    if (ok) st.ok++;
    Store.bump('sent');

    slot.querySelectorAll('.tile-w').forEach((n, i) => {
      n.classList.add(placed[i].w === words[i] ? 'good' : 'bad');
    });

    $('#verdict', box).innerHTML =
      '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="verdict-head">' + (ok ? 'Верно · dobrze' : 'Poprawnie: ' + esc(s.ru)) + '</div>' +
        '<p>' + esc(s.pl) + '</p>' +
        (s.note ? '<div class="hint">' + esc(s.note) + '</div>' : '') +
      '</div>';
    UI.speak({ ru: s.ru, tr: null });
    App.advance(ok ? 1400 : 3200);
  };

  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="check-sent"]')) check();
    if (e.target.closest('[data-act="clear-sent"]') && !App.session.answered) {
      placed.forEach((p) => p.el.classList.remove('used'));
      placed = [];
      redraw();
    }
  });
}

/* ============================================================
   CZYTELNIA
   ============================================================ */

let readText = '';

function normWord(w) {
  return w.toLowerCase().replace(/ё/g, 'е').replace(/[^а-я\- ]/g, '').trim();
}

/* Najpierw trafienie dokładne, potem po rdzeniu — odmienioną formę
   też chcemy rozpoznać, ale uczciwie oznaczyć jako domysł.
   Hasła wielowyrazowe pomijamy: pojedynczy token nigdy ich nie dopasuje,
   a w indeksie robiłyby tylko śmieci. */
const LOOKUP = (function () {
  const exact = new Map();
  const stems = new Map();
  for (const w of WORDS) {
    const n = normWord(w.ru);
    if (!n || n.includes(' ')) continue;
    if (!exact.has(n)) exact.set(n, w);
    if (n.length >= 5) {
      const st = n.slice(0, Math.max(4, n.length - 2));
      if (!stems.has(st)) stems.set(st, w);
    }
  }
  return { exact, stems };
})();

function lookup(token) {
  const n = normWord(token);
  if (!n) return null;
  if (LOOKUP.exact.has(n)) return { w: LOOKUP.exact.get(n), sure: true };
  for (let cut = 2; cut <= 3; cut++) {
    if (n.length - cut < 4) break;
    const st = n.slice(0, n.length - cut);
    if (LOOKUP.stems.has(st)) return { w: LOOKUP.stems.get(st), sure: false };
  }
  return null;
}

function viewReading() {
  const v = App.view;
  const r = ST().reading;

  v.innerHTML =
    head('Sprawdź, ile już rozumiesz', 'Czytelnia',
      'Wklej dowolny rosyjski tekst — piosenkę, wiadomość, fragment artykułu. Aplikacja pokaże, które słowa już masz w pamięci, a nieznane pozwoli dorzucić do powtórek jednym kliknięciem.') +
    '<div class="tiles">' +
      App.tile(r.texts, 'przerobionych tekstów', '', 'var(--amber)') +
      App.tile(r.added, 'słów dorzuconych', 'do kolejki powtórek', 'var(--jade)') +
    '</div>' +
    '<div class="editor">' +
      '<textarea id="rtext" rows="6" placeholder="Wklej tutaj rosyjski tekst…">' + esc(readText) + '</textarea>' +
      '<div style="display:flex;gap:9px;flex-wrap:wrap">' +
        '<button class="btn primary" data-act="analyze">Przeanalizuj</button>' +
        '<button class="btn ghost" data-act="clear-text">Wyczyść</button>' +
      '</div>' +
    '</div>' +
    '<div class="group-head"><h3>Gotowe teksty</h3><span class="d">na start, zanim wkleisz swój</span></div>' +
    '<div class="grid g3 stagger">' +
      READINGS.map((t) =>
        '<button class="cat" data-read="' + t.id + '">' +
          '<div class="cat-ru cyr">' + esc(t.title) + '</div>' +
          '<div class="cat-name">' + esc(t.pl) + '</div>' +
          '<div class="cat-stat"><span>poziom ' + t.lvl + '</span><span>' +
            t.text.split(/\s+/).length + ' słów</span></div>' +
        '</button>').join('') +
    '</div>' +
    '<div id="rout"></div>';

  v.addEventListener('click', (e) => {
    const rd = e.target.closest('[data-read]');
    if (rd) {
      const t = READINGS.find((x) => x.id === rd.dataset.read);
      readText = t.text;
      $('#rtext').value = t.text;
      analyze();
      return;
    }
    if (e.target.closest('[data-act="analyze"]')) { readText = $('#rtext').value; analyze(); }
    if (e.target.closest('[data-act="clear-text"]')) { readText = ''; $('#rtext').value = ''; $('#rout').innerHTML = ''; }
  });
}

function analyze() {
  const out = $('#rout');
  const text = readText.trim();
  if (!text) { out.innerHTML = '<div class="empty"><div class="g cyr">Ø</div>Najpierw wklej jakiś tekst.</div>'; return; }

  const tokens = text.split(/(\s+|[.,!?;:—«»()"\n])/);
  let known = 0, learning = 0, fresh = 0, unknown = 0;
  const freshWords = new Map();

  const html = tokens.map((tok) => {
    if (!/[а-яё]/i.test(tok)) return esc(tok).replace(/\n/g, '<br>');
    const hit = lookup(tok);
    if (!hit) { unknown++; return '<span class="tk out" data-w="' + esc(tok) + '">' + esc(tok) + '</span>'; }
    const w = hit.w;
    const c = ST().srs[w.id];
    let cls;
    if (Store.known(w.id)) { cls = 'know'; known++; }
    else if (c && c.s > 0) { cls = 'learn'; learning++; }
    else { cls = 'new'; fresh++; freshWords.set(w.id, w); }
    return '<span class="tk ' + cls + (hit.sure ? '' : ' guess') + '" data-id="' + w.id + '">' + esc(tok) + '</span>';
  }).join('');

  const total = known + learning + fresh + unknown;
  const pct = total ? Math.round(((known + learning) / total) * 100) : 0;

  out.innerHTML =
    '<div class="group-head"><h3>Tekst</h3><span class="d">kliknij słowo, żeby zobaczyć znaczenie</span></div>' +
    '<div class="readbar">' +
      '<div class="readbar-main">' + bar(pct, pct >= 70 ? 'green' : '') + '</div>' +
      '<div class="readbar-num"><span class="cyr">' + pct + '%</span> rozpoznanych</div>' +
    '</div>' +
    '<div class="readlegend">' +
      '<span><i class="tk know"></i> w pamięci: ' + known + '</span>' +
      '<span><i class="tk learn"></i> w trakcie: ' + learning + '</span>' +
      '<span><i class="tk new"></i> nowe ze słownika: ' + fresh + '</span>' +
      '<span><i class="tk out"></i> spoza bazy: ' + unknown + '</span>' +
    '</div>' +
    '<div class="readtext cyr" id="readtext">' + html + '</div>' +
    '<div id="wordpop"></div>' +
    (freshWords.size
      ? '<div class="now-actions"><button class="btn primary" data-act="add-fresh">' +
        'Ucz się ' + freshWords.size + ' nowych słów z tego tekstu →</button></div>'
      : '');

  const pop = $('#wordpop');
  $('#readtext').addEventListener('click', (e) => {
    const t = e.target.closest('.tk');
    if (!t) return;
    if (t.dataset.id) {
      const w = WORDS.find((x) => x.id === t.dataset.id);
      pop.innerHTML =
        '<div class="verdict ok"><div class="verdict-head cyr">' + esc(w.ru) + '</div>' +
        '<p>' + esc(w.pl) + ' · <span class="mono">' + esc(w.tr) + '</span></p>' +
        (w.ex ? '<div class="hint">' + esc(w.ex) + ' — ' + esc(w.exPl || '') + '</div>' : '') + '</div>';
      UI.speak(w);
    } else {
      const raw = t.dataset.w;
      pop.innerHTML =
        '<div class="verdict no"><div class="verdict-head cyr">' + esc(raw) + '</div>' +
        '<p>Tego słowa nie ma w bazie. Przybliżona wymowa: <span class="mono">' +
        esc(Speech.ruToPl(raw)) + '</span></p></div>';
      UI.speak({ ru: raw, tr: null });
    }
  });

  App.view.addEventListener('click', (e) => {
    if (!e.target.closest('[data-act="add-fresh"]')) return;
    const list = Array.from(freshWords.values());
    ST().reading.texts++;
    ST().reading.added += list.length;
    Store.bump('read');
    Store.commit();
    App.newSession({
      title: 'Słowa z tekstu',
      items: shuffle(list).map((w) => App.itemForWord(w)),
      repeat: null,
    });
  });
}

/* ============================================================
   REJESTRACJA
   ============================================================ */

App.VIEWS.quests = viewQuests;
App.VIEWS.shop = viewShop;
App.VIEWS.keyboard = viewKeyboard;
App.VIEWS.sentences = viewSentences;
App.VIEWS.reading = viewReading;
App.KINDS.sentence = renderSentence;
})();
