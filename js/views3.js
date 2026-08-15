(function () {
/* ============================================================
   TŁUMACZ — przekład w obie strony, z klawiatury

   Układacz zdań podaje gotowe klocki, więc sprawdza szyk. Tutaj
   nie ma podpowiedzi: czytasz zdanie w jednym języku i piszesz je
   w drugim od zera. To jedyne ćwiczenie w aplikacji, w którym
   trzeba wyprodukować całe zdanie z głowy.

   Sprawdzanie jest celowo wyrozumiałe. Odrzucanie „Dzisiaj jest
   ładna pogoda", bo w bazie stoi „Dziś jest ładna pogoda", uczyłoby
   trafiania w cudzy zapis, a nie języka. Wybaczamy: interpunkcję,
   wielkość liter, ogonki, ё/е, pominięty zaimek i literówki.
   Warianty znaczeniowe siedzą w js/data/16-tlumaczenia.js.
   ============================================================ */

const { esc, shuffle, pick, bar } = UI;
const ST = () => Store.s;
const $ = (s, r) => (r || App.view).querySelector(s);

function head(eyebrow, title, lead) {
  return '<div class="view-head">' +
    '<span class="eyebrow">' + esc(eyebrow) + '</span>' +
    '<h1>' + esc(title) + '</h1>' +
    (lead ? '<p>' + esc(lead) + '</p>' : '') +
  '</div>';
}

/* ------------------------------------------------------------
   Normalizacja
   ------------------------------------------------------------ */

const OGONKI = { 'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ż': 'z', 'ź': 'z' };

/* Sprowadzamy zdanie do gołej treści: same litery i spacje.
   Po tej operacji „Dziś, jest ładna pogoda!" i „dzis jest ladna pogoda"
   to ten sam napis — i bardzo dobrze, bo znaczą to samo. */
function norm(s, lang) {
  let t = String(s == null ? '' : s).toLowerCase().trim();
  if (lang === 'ru') {
    t = t.replace(/ё/g, 'е').replace(/[^а-я0-9\s]/g, ' ');
  } else {
    t = t.replace(/[ąćęłńóśżź]/g, (c) => OGONKI[c]);
    t = t.replace(/[^a-z0-9\s]/g, ' ');
  }
  return t.replace(/\s+/g, ' ').trim();
}

/* Rosyjski i polski swobodnie opuszczają zaimek osobowy — „Иду домой"
   znaczy dokładnie to samo co „Я иду домой". Porównujemy więc też
   wersje bez niego, żeby obie formy przechodziły. */
const ZAIMEK = {
  pl: /^(ja|ty|on|ona|ono|my|wy|oni|one)\s+/,
  ru: /^(я|ты|он|она|оно|мы|вы|они)\s+/,
};

function bezZaimka(t, lang) { return t.replace(ZAIMEK[lang], ''); }

/* Odległość edycyjna — ile znaków trzeba zmienić, żeby dostać drugi
   napis. Służy tylko do odróżnienia literówki od innej odpowiedzi. */
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = new Array(b.length + 1);
  let cur = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    cur[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a.charCodeAt(i - 1) === b.charCodeAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    const tmp = prev; prev = cur; cur = tmp;
  }
  return prev[b.length];
}

/* Ile literówek wybaczamy: mniej więcej jedna na czternaście znaków,
   ale nigdy więcej niż trzy — przy dłuższym zdaniu większy luz
   zaczynałby przepuszczać naprawdę inne odpowiedzi. */
function tolerancja(t) {
  return Math.min(3, Math.max(1, Math.round(t.length / 14)));
}

/* ------------------------------------------------------------
   Ocena odpowiedzi
   ------------------------------------------------------------ */

/* Zwraca: ok (trafione), blisko (literówka), nie (inna odpowiedź). */
function ocen(wpis, cele, lang) {
  const g = norm(wpis, lang);
  if (!g) return { stan: 'puste', cel: cele[0] };

  const gb = bezZaimka(g, lang);
  let best = { d: Infinity, cel: cele[0] };

  for (const raw of cele) {
    const t = norm(raw, lang);
    if (!t) continue;
    const tb = bezZaimka(t, lang);
    if (g === t || gb === tb) return { stan: 'ok', cel: raw };

    const d = Math.min(lev(g, t), lev(gb, tb));
    if (d < best.d) best = { d, cel: raw };
  }

  if (best.d <= tolerancja(norm(best.cel, lang))) {
    return { stan: 'blisko', cel: best.cel, d: best.d };
  }
  return { stan: 'nie', cel: cele[0] };
}

/* Podświetla w poprawnym zdaniu słowa, których uczeń nie napisał.
   Porównujemy zbiorami, bo przy innym szyku zestawianie po indeksie
   pokazywałoby błąd w każdym słowie i niczego by nie uczyło. */
function roznice(wpis, cel, lang) {
  const mam = new Set(norm(wpis, lang).split(' ').filter(Boolean));
  return cel.split(/(\s+)/).map((kawalek) => {
    if (!kawalek.trim()) return kawalek;
    const czyste = norm(kawalek, lang);
    if (!czyste || mam.has(czyste)) return esc(kawalek);
    return '<em class="tr-miss">' + esc(kawalek) + '</em>';
  }).join('');
}

/* ------------------------------------------------------------
   Materiał
   ------------------------------------------------------------ */

const KIERUNKI = {
  ru2pl: { id: 'ru2pl', z: 'ru', na: 'pl', label: 'Rosyjski → polski', ru: 'С русского',
           opis: 'Czytasz cyrylicę, piszesz po polsku', pyt: 'Przetłumacz na polski' },
  pl2ru: { id: 'pl2ru', z: 'pl', na: 'ru', label: 'Polski → rosyjski', ru: 'На русский',
           opis: 'Czytasz po polsku, piszesz cyrylicą', pyt: 'Przetłumacz na rosyjski' },
};

/* Wszystkie brzmienia uznawane za poprawne dla danego zdania i kierunku. */
function cele(s, kier) {
  const alt = (window.TRANS_ALT && TRANS_ALT[s.ru]) || {};
  const podstawa = kier.na === 'pl' ? s.pl : s.ru;
  const dodatki = (kier.na === 'pl' ? alt.pl : alt.ru) || [];
  return [podstawa].concat(dodatki);
}

function pozycja(s, kier) {
  return {
    kind: 'translate',
    s,
    kier,
    zrodlo: kier.z === 'ru' ? s.ru : s.pl,
    cele: cele(s, kier),
  };
}

/* ------------------------------------------------------------
   Ekran wyboru
   ------------------------------------------------------------ */

const POZIOMY = [
  { lvl: 1, name: 'Proste zdania', ru: 'Простые', desc: 'Teraźniejszość, szyk podstawowy' },
  { lvl: 2, name: 'Przypadki i przeszłość', ru: 'Падежи', desc: 'Odmiana w praktyce, sytuacje z życia' },
  { lvl: 3, name: 'Zdania złożone', ru: 'Сложные', desc: 'Spójniki, aspekt, tryb przypuszczający' },
  { lvl: 4, name: 'Mowa żywa', ru: 'Живая речь', desc: 'Idiomy, których nie da się złożyć ze słówek' },
];

function viewTranslator() {
  const v = App.view;
  const t = ST().trans;
  const wybrany = t.ostatniKierunek || 'ru2pl';

  const skutecznosc = t.done ? Math.round((t.ok / t.done) * 100) + '%' : '—';

  v.innerHTML =
    head('Przekład w obie strony',
      'Tłumacz',
      'Bez kafelków i bez listy odpowiedzi. Czytasz zdanie i piszesz je w drugim języku z głowy — tak jak w rozmowie.') +

    '<div class="tiles">' +
      App.tile(t.done, 'przetłumaczonych zdań', '', 'var(--iris)') +
      App.tile(skutecznosc, 'trafionych', '', 'var(--jade)') +
      App.tile(SENTENCES.length * 2, 'zadań w bazie', '', 'var(--amber)') +
    '</div>' +

    '<div class="tr-dirs" role="tablist" aria-label="Kierunek tłumaczenia">' +
      Object.values(KIERUNKI).map((k) =>
        '<button class="tr-dir' + (k.id === wybrany ? ' on' : '') + '" data-dir="' + k.id + '" ' +
          'role="tab" aria-selected="' + (k.id === wybrany) + '">' +
          '<span class="tr-dir-ru cyr">' + esc(k.ru) + '</span>' +
          '<span class="tr-dir-name">' + esc(k.label) + '</span>' +
          '<span class="tr-dir-desc">' + esc(k.opis) + '</span>' +
        '</button>').join('') +
      '<button class="tr-dir' + (wybrany === 'mix' ? ' on' : '') + '" data-dir="mix" ' +
        'role="tab" aria-selected="' + (wybrany === 'mix') + '">' +
        '<span class="tr-dir-ru cyr">Оба</span>' +
        '<span class="tr-dir-name">Na przemian</span>' +
        '<span class="tr-dir-desc">Raz w jedną, raz w drugą stronę</span>' +
      '</button>' +
    '</div>' +

    '<div class="grid g2 stagger">' +
      POZIOMY.map((l) => {
        const total = SENTENCES.filter((s) => s.lvl === l.lvl).length;
        const done = (t.lvl && t.lvl[l.lvl]) || 0;
        const pct = Math.min(100, Math.round((done / (total * 2)) * 100));
        return (
          '<button class="cat" data-lvl="' + l.lvl + '">' +
            '<span class="cat-glyph num">' + l.lvl + '</span>' +
            '<div class="cat-ru cyr">' + esc(l.ru) + '</div>' +
            '<div class="cat-name">' + esc(l.name) + '</div>' +
            '<div style="font-size:13px;color:var(--muted);margin-bottom:12px">' + esc(l.desc) + '</div>' +
            '<div class="cat-stat"><span>' + total + ' zdań</span><span>' + pct + '%</span></div>' +
            bar(pct, pct === 100 ? 'green' : '') +
          '</button>'
        );
      }).join('') +
    '</div>' +

    '<div class="now-actions" style="justify-content:center;margin-top:22px">' +
      '<button class="btn primary" data-lvl="all">Wszystkie poziomy · 10 zdań</button>' +
    '</div>';

  v.addEventListener('click', (e) => {
    const d = e.target.closest('[data-dir]');
    if (d) {
      ST().trans.ostatniKierunek = d.dataset.dir;
      Store.save();
      App.render();
      return;
    }
    const b = e.target.closest('[data-lvl]');
    if (b) startTranslator(ST().trans.ostatniKierunek || 'ru2pl', b.dataset.lvl);
  });
}

function startTranslator(dirId, lvlRaw) {
  const lvl = lvlRaw === 'all' ? null : +lvlRaw;
  const pool = lvl ? SENTENCES.filter((s) => s.lvl === lvl) : SENTENCES.slice();
  if (!pool.length) return;

  const ile = Math.min(10, pool.length);
  const wybrane = pick(pool, ile);

  const items = wybrane.map((s, i) => {
    const kier = dirId === 'mix'
      ? (i % 2 === 0 ? KIERUNKI.ru2pl : KIERUNKI.pl2ru)
      : KIERUNKI[dirId] || KIERUNKI.ru2pl;
    return pozycja(s, kier);
  });

  App.newSession({
    title: 'Tłumacz' + (lvl ? ' · poziom ' + lvl : ''),
    items: dirId === 'mix' ? shuffle(items) : items,
    repeat: () => startTranslator(dirId, lvlRaw),
    onFinish: (sess) => {
      const t = ST().trans;
      t.lvl = t.lvl || {};
      if (lvl) t.lvl[lvl] = (t.lvl[lvl] || 0) + sess.correct;
      t.dir = t.dir || {};
      t.dir[dirId] = (t.dir[dirId] || 0) + sess.correct;
      return 22;
    },
  });
}

/* ------------------------------------------------------------
   Ćwiczenie
   ------------------------------------------------------------ */

function renderTranslate(box, item) {
  const { s, kier, zrodlo } = item;
  const doRu = kier.na === 'ru';
  const alt = item.cele.length - 1;

  box.innerHTML =
    App.sessTop() +

    '<div class="prompt tr-prompt">' +
      '<span class="prompt-kind">' + esc(kier.pyt) + '</span>' +
      '<div class="tr-source' + (kier.z === 'ru' ? ' cyr' : '') + '">' + esc(zrodlo) + '</div>' +
      (kier.z === 'ru'
        ? '<button class="tr-speak" data-act="speak" aria-label="Przeczytaj na głos">🔊</button>'
        : '') +
    '</div>' +

    '<div class="tr-answer">' +
      '<textarea id="tra" rows="2" autocomplete="off" autocorrect="off" ' +
        'autocapitalize="sentences" spellcheck="false" enterkeyhint="done" ' +
        (doRu ? 'lang="ru" ' : 'lang="pl" ') +
        'placeholder="' + (doRu ? 'napisz po rosyjsku…' : 'napisz po polsku…') + '"></textarea>' +
    '</div>' +

    '<div class="now-actions tr-acts">' +
      '<button class="btn primary" data-act="check">Sprawdź</button>' +
      '<button class="btn ghost sm" data-act="hint">Podpowiedz</button>' +
      '<button class="btn ghost sm" data-act="dunno">Nie wiem</button>' +
    '</div>' +

    '<div id="trhint" class="tr-hint" hidden></div>' +
    '<div id="verdict"></div>';

  const pole = $('#tra', box);

  /* Piszemy klawiaturą urządzenia — na telefonie rosyjski układ dokłada
     się w ustawieniach systemu i przełącza globusem. Sami klawiatury nie
     wywołujemy: ekran podskakiwałby przy każdym pytaniu, zasłaniając
     zdanie, które trzeba przetłumaczyć. */
  if (!matchMedia('(pointer: coarse)').matches) pole.focus();

  let podpowiedzi = 0;

  const podpowiedz = () => {
    if (App.session.answered) return;
    const cel = item.cele[0];
    const slowa = cel.split(/\s+/);
    const el = $('#trhint', box);
    podpowiedzi++;

    if (podpowiedzi === 1) {
      el.innerHTML = '<strong>' + slowa.length + '</strong> ' +
        UI.plural(slowa.length, 'słowo', 'słowa', 'słów') + ' · pierwsze litery: ' +
        '<span class="' + (kier.na === 'ru' ? 'cyr' : '') + '">' +
        esc(slowa.map((w) => w[0] + '…').join(' ')) + '</span>';
    } else {
      /* Druga podpowiedź odsłania połowę zdania — dalej trzeba już
         dopowiedzieć samemu, inaczej to nie jest tłumaczenie. */
      const pol = Math.ceil(slowa.length / 2);
      el.innerHTML = 'Początek: <span class="' + (kier.na === 'ru' ? 'cyr' : '') + '">' +
        esc(slowa.slice(0, pol).join(' ')) + '…</span>';
    }
    el.hidden = false;
  };

  const sprawdz = (poddanie) => {
    if (App.session.answered) return;

    const wynik = poddanie
      ? { stan: 'nie', cel: item.cele[0] }
      : ocen(pole.value, item.cele, kier.na);

    if (wynik.stan === 'puste') {
      pole.classList.add('shake');
      setTimeout(() => pole.classList.remove('shake'), 400);
      return;
    }

    const ok = wynik.stan === 'ok' || wynik.stan === 'blisko';
    /* Podpowiedź obniża wartość odpowiedzi: policzy się jako trafiona,
       ale nie zasila statystyki „za pierwszym razem". */
    const czyste = ok && podpowiedzi === 0 && !poddanie;

    App.scoreAnswer(ok, null);

    const t = ST().trans;
    t.done++;
    if (czyste) t.ok++;
    if (wynik.stan === 'blisko') t.near++;
    Store.bump('sent');

    pole.classList.add(ok ? 'good' : 'bad');
    pole.disabled = true;

    const naglowek = wynik.stan === 'ok' ? 'Верно · dobrze'
      : wynik.stan === 'blisko' ? 'Prawie — literówka'
      : poddanie ? 'Poprawna odpowiedź' : 'Niezupełnie';

    const pokazCel = '<span class="' + (kier.na === 'ru' ? 'cyr' : '') + '">' +
      (ok ? esc(wynik.cel) : roznice(pole.value, wynik.cel, kier.na)) + '</span>';

    $('#verdict', box).innerHTML =
      '<div class="verdict ' + (ok ? 'ok' : 'no') + '">' +
        '<div class="verdict-head">' + naglowek + '</div>' +
        '<p class="tr-target">' + pokazCel + '</p>' +
        (wynik.stan === 'blisko'
          ? '<div class="hint">Znaczenie trafione — poprawna pisownia wyżej.</div>' : '') +
        (alt > 0 && wynik.stan !== 'blisko'
          ? '<div class="dim" style="font-size:12.5px;margin-top:8px">Uznaję też ' + alt + ' ' +
            UI.plural(alt, 'inne brzmienie', 'inne brzmienia', 'innych brzmień') + '.</div>' : '') +
        (s.note ? '<div class="hint">' + esc(s.note) + '</div>' : '') +
      '</div>';

    UI.speak({ ru: s.ru, tr: null });
    App.advance(ok ? 1500 : 3400);
  };

  box.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="check"]')) sprawdz(false);
    if (e.target.closest('[data-act="dunno"]')) sprawdz(true);
    if (e.target.closest('[data-act="hint"]')) podpowiedz();
    if (e.target.closest('[data-act="speak"]')) UI.speak({ ru: s.ru, tr: null });
  });

  /* Enter zatwierdza, Shift+Enter robi nową linię — jak w komunikatorze. */
  pole.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sprawdz(false); }
  });

  /* Poprzednie pytanie mogło podpiąć skróty 1–4 do wyboru odpowiedzi.
     Tutaj cyfry są zwykłymi znakami, a stary handler działałby na
     nieaktualnym pytaniu, gdyby kursor stał poza polem tekstowym. */
  if (App.session) App.session.keyHandler = null;
}

/* ============================================================
   REJESTRACJA
   ============================================================ */

App.VIEWS.translator = viewTranslator;
App.KINDS.translate = renderTranslate;

/* Wystawione na potrzeby testów w konsoli przeglądarki. */
window.Translator = { norm, ocen, lev, cele };
})();
