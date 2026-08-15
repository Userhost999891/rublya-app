/* ============================================================
   KLAWIATURA ЙЦУКЕН — układ, palce, lekcje

   f: który palec obsługuje klawisz.
      L5 L4 L3 L2 = lewa: mały, serdeczny, środkowy, wskazujący
      R2 R3 R4 R5 = prawa: wskazujący, środkowy, serdeczny, mały
   home: klawisz rzędu podstawowego, na którym palec spoczywa
   ============================================================ */

window.KB_ROWS = [
  [
    { k: 'ё', f: 'L5' }, { k: '1', f: 'L5' }, { k: '2', f: 'L4' }, { k: '3', f: 'L3' },
    { k: '4', f: 'L2' }, { k: '5', f: 'L2' }, { k: '6', f: 'R2' }, { k: '7', f: 'R2' },
    { k: '8', f: 'R3' }, { k: '9', f: 'R4' }, { k: '0', f: 'R5' }, { k: '-', f: 'R5' },
  ],
  [
    { k: 'й', f: 'L5' }, { k: 'ц', f: 'L4' }, { k: 'у', f: 'L3' }, { k: 'к', f: 'L2' },
    { k: 'е', f: 'L2' }, { k: 'н', f: 'R2' }, { k: 'г', f: 'R2' }, { k: 'ш', f: 'R3' },
    { k: 'щ', f: 'R4' }, { k: 'з', f: 'R5' }, { k: 'х', f: 'R5' }, { k: 'ъ', f: 'R5' },
  ],
  [
    { k: 'ф', f: 'L5', home: true }, { k: 'ы', f: 'L4', home: true },
    { k: 'в', f: 'L3', home: true }, { k: 'а', f: 'L2', home: true },
    { k: 'п', f: 'L2' }, { k: 'р', f: 'R2' },
    { k: 'о', f: 'R2', home: true }, { k: 'л', f: 'R3', home: true },
    { k: 'д', f: 'R4', home: true }, { k: 'ж', f: 'R5', home: true },
    { k: 'э', f: 'R5' },
  ],
  [
    { k: 'я', f: 'L5' }, { k: 'ч', f: 'L4' }, { k: 'с', f: 'L3' }, { k: 'м', f: 'L2' },
    { k: 'и', f: 'L2' }, { k: 'т', f: 'R2' }, { k: 'ь', f: 'R2' }, { k: 'б', f: 'R3' },
    { k: 'ю', f: 'R4' }, { k: '.', f: 'R5' },
  ],
];

/* Fizyczna pozycja klawisza → litera w układzie ЙЦУКЕН.
   Czytamy event.code, nie event.key, więc trening działa tak samo
   z rosyjskim układem w systemie i bez niego — palec ląduje tam,
   gdzie ma lądować naprawdę. */
window.KB_CODES = {
  Backquote: 'ё',
  KeyQ: 'й', KeyW: 'ц', KeyE: 'у', KeyR: 'к', KeyT: 'е', KeyY: 'н',
  KeyU: 'г', KeyI: 'ш', KeyO: 'щ', KeyP: 'з', BracketLeft: 'х', BracketRight: 'ъ',
  KeyA: 'ф', KeyS: 'ы', KeyD: 'в', KeyF: 'а', KeyG: 'п', KeyH: 'р',
  KeyJ: 'о', KeyK: 'л', KeyL: 'д', Semicolon: 'ж', Quote: 'э',
  KeyZ: 'я', KeyX: 'ч', KeyC: 'с', KeyV: 'м', KeyB: 'и', KeyN: 'т',
  KeyM: 'ь', Comma: 'б', Period: 'ю', Slash: '.',
  Space: ' ',
};

window.FINGERS = {
  L5: { name: 'lewy mały',        short: 'L5', hand: 'L' },
  L4: { name: 'lewy serdeczny',   short: 'L4', hand: 'L' },
  L3: { name: 'lewy środkowy',    short: 'L3', hand: 'L' },
  L2: { name: 'lewy wskazujący',  short: 'L2', hand: 'L' },
  R2: { name: 'prawy wskazujący', short: 'R2', hand: 'R' },
  R3: { name: 'prawy środkowy',   short: 'R3', hand: 'R' },
  R4: { name: 'prawy serdeczny',  short: 'R4', hand: 'R' },
  R5: { name: 'prawy mały',       short: 'R5', hand: 'R' },
};

/* Litery, na których palce spoczywają — punkt wyjścia dla każdej lekcji */
window.KB_HOME = 'фывапролдж';

window.KB_LESSONS = [
  {
    id: 'k1', title: 'Rząd podstawowy', ru: 'Основной ряд',
    desc: 'Osiem palców na фыва i олдж. Nie patrz na klawiaturę — szukaj wypustek na а i о.',
    keys: 'фывaпролдж',
    drills: [
      'фыва олдж фыва олдж',
      'фыв олд ыва лдж фыв олд',
      'вол лов дал лад вода',
      'дала лады вода дров',
      'ждал лады вол одал',
    ],
  },
  {
    id: 'k2', title: 'Wskazujące i П Р', ru: 'Указательные',
    desc: 'Palce wskazujące sięgają po п i р, wracając zawsze na а i о.',
    keys: 'фывапролдж',
    drills: [
      'апр рпа апр рпа опа про',
      'пар рап пол лоп поп роп',
      'право поле пара порода',
      'вопрос продал повод',
      'правда порода прорва',
    ],
  },
  {
    id: 'k3', title: 'Górny rząd', ru: 'Верхний ряд',
    desc: 'Й Ц У К Е po lewej, Н Г Ш Щ З po prawej. Palce sięgają w górę i wracają.',
    keys: 'йцукенгшщзфывапролдж',
    drills: [
      'йцу кен нгш щзх йцу кен',
      'уже неже кеше нуже',
      'книга школа нужен город',
      'зеркало кошелек шкаф',
      'ученик щука гора зонт',
    ],
  },
  {
    id: 'k4', title: 'Dolny rząd', ru: 'Нижний ряд',
    desc: 'Я Ч С М И po lewej, Т Ь Б Ю po prawej. Najtrudniejszy rząd — nie spiesz się.',
    keys: 'ячсмитьбюфывапролдж',
    drills: [
      'ячс мит ьбю ячс мит',
      'мясо часы сила тьма',
      'быть мимо тихо любить',
      'систем читать событие',
      'мысль память статья',
    ],
  },
  {
    id: 'k5', title: 'Cała klawiatura', ru: 'Вся клавиатура',
    desc: 'Wszystkie litery razem. Teraz liczy się rytm, nie prędkość.',
    keys: null,
    drills: [
      'привет как дела спасибо',
      'сегодня хорошая погода',
      'я изучаю русский язык',
      'москва санкт петербург',
      'человек работа время дело',
    ],
  },
  {
    id: 'k6', title: 'Słowa z Twojej bazy', ru: 'Твои слова',
    desc: 'Losowane z tego, czego już się uczysz. Pisownia i pamięć naraz.',
    keys: null,
    fromVocab: true,
  },
  {
    id: 'k7', title: 'Całe zdania', ru: 'Предложения',
    desc: 'Pełne zdania ze spacjami. Docelowa prędkość: 120 znaków na minutę.',
    keys: null,
    fromSentences: true,
  },
];
