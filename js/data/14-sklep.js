/* ============================================================
   SKLEP I ZADANIA POBOCZNE

   Waluta: рубли (₽). Płaci się nie za czas spędzony w aplikacji,
   tylko za trafność — sesja odklikana byle jak daje grosze,
   sesja bez błędu daje premię większą niż wszystkie odpowiedzi razem.
   ============================================================ */

window.SHOP = [
  /* --- zużywalne --- */
  {
    id: 'hint', kind: 'use', ru: 'Подсказка', pl: 'Podpowiedź', icon: '?',
    price: 40, desc: 'Usuwa dwie błędne odpowiedzi z pytania wyboru.',
    max: 30,
  },
  {
    id: 'skip', kind: 'use', ru: 'Пропуск', pl: 'Pominięcie', icon: '»',
    price: 30, desc: 'Przechodzi dalej bez zaliczenia błędu i bez utraty serii.',
    max: 30,
  },
  {
    id: 'letter', kind: 'use', ru: 'Буква', pl: 'Pierwsza litera', icon: 'Б',
    price: 25, desc: 'W trybie pisania odsłania początek słowa.',
    max: 30,
  },
  {
    id: 'retry', kind: 'use', ru: 'Вторая попытка', pl: 'Druga szansa', icon: '↺',
    price: 60, desc: 'Pierwszy błąd w sesji nie kasuje serii ani nie cofa słowa.',
    max: 20,
  },
  {
    id: 'x2', kind: 'use', ru: 'Двойной опыт', pl: 'Podwójne XP', icon: '×2',
    price: 90, desc: 'Najbliższa sesja daje dwa razy więcej XP.',
    max: 20,
  },
  {
    id: 'freeze', kind: 'use', ru: 'Заморозка', pl: 'Zamrożenie passy', icon: '❄',
    price: 120, desc: 'Jeden opuszczony dzień nie zeruje passy. Zużywa się sam.',
    max: 10,
  },

  /* --- na stałe --- */
  {
    id: 'autoplay', kind: 'perk', ru: 'Автозвук', pl: 'Automatyczna wymowa',
    icon: '♪', price: 150, desc: 'Każde rosyjskie słowo w sesji czyta się samo.',
  },
  {
    id: 'keyhint', kind: 'perk', ru: 'Подсветка клавиш', pl: 'Podświetlanie klawiszy',
    icon: '⌨', price: 120, desc: 'Trener klawiatury pokazuje następny klawisz i palec.',
  },
  {
    id: 'analyzer', kind: 'perk', ru: 'Анализатор', pl: 'Analizator błędów',
    icon: '◎', price: 220, desc: 'Rozbudowana diagnoza: które wzorce gramatyczne Cię gubią.',
  },
  {
    id: 'accent_jade', kind: 'perk', ru: 'Нефрит', pl: 'Akcent nefrytowy',
    icon: '◆', price: 300, desc: 'Zmienia kolor wiodący interfejsu na zielony.',
  },
  {
    id: 'accent_iris', kind: 'perk', ru: 'Ирис', pl: 'Akcent irysowy',
    icon: '◆', price: 300, desc: 'Zmienia kolor wiodący interfejsu na fioletowy.',
  },
];

/* ============================================================
   ZADANIA POBOCZNE
   Trzy losowane codziennie, ziarno = data, więc przez cały dzień
   są te same i nie da się ich przerolować odświeżeniem.
   ============================================================ */

window.QUEST_POOL = [
  { id: 'q_ans30',  type: 'answers',  n: 30,  ru: 'Тридцать ответов',   pl: 'Trzydzieści odpowiedzi',   desc: 'Odpowiedz dziś na 30 pytań',                 coin: 30, xp: 40 },
  { id: 'q_ans60',  type: 'answers',  n: 60,  ru: 'Шестьдесят',         pl: 'Sześćdziesiąt odpowiedzi', desc: 'Odpowiedz dziś na 60 pytań',                 coin: 60, xp: 80 },
  { id: 'q_rev20',  type: 'reviews',  n: 20,  ru: 'Повторение',         pl: 'Dwadzieścia powtórek',     desc: 'Wyczyść dziś 20 kart z kolejki',             coin: 40, xp: 50 },
  { id: 'q_rev40',  type: 'reviews',  n: 40,  ru: 'Большое повторение', pl: 'Czterdzieści powtórek',    desc: 'Wyczyść dziś 40 kart z kolejki',             coin: 75, xp: 90 },
  { id: 'q_new10',  type: 'newWords', n: 10,  ru: 'Десять новых',       pl: 'Dziesięć nowych słów',     desc: 'Poznaj dziś 10 słów, których nie widziałeś', coin: 45, xp: 60 },
  { id: 'q_new20',  type: 'newWords', n: 20,  ru: 'Двадцать новых',     pl: 'Dwadzieścia nowych słów',  desc: 'Poznaj dziś 20 nowych słów',                 coin: 85, xp: 110 },
  { id: 'q_typed15',type: 'typed',    n: 15,  ru: 'Кириллица',          pl: 'Piętnaście słów z pamięci',desc: 'Wpisz dziś 15 słów cyrylicą bez błędu',      coin: 55, xp: 70 },
  { id: 'q_sent8',  type: 'sentences',n: 8,   ru: 'Восемь фраз',        pl: 'Osiem zdań',               desc: 'Ułóż dziś 8 zdań w układaczu',               coin: 50, xp: 65 },
  { id: 'q_combo10',type: 'combo',    n: 10,  ru: 'Серия десять',       pl: 'Seria dziesięciu',         desc: 'Trafnij dziś 10 odpowiedzi pod rząd',        coin: 45, xp: 55 },
  { id: 'q_combo20',type: 'combo',    n: 20,  ru: 'Серия двадцать',     pl: 'Seria dwudziestu',         desc: 'Trafnij dziś 20 odpowiedzi pod rząd',        coin: 100, xp: 130 },
  { id: 'q_acc90',  type: 'accuracy', n: 90,  ru: 'Точность',           pl: 'Celność dziewięćdziesiąt', desc: 'Zamknij sesję z trafnością minimum 90%',     coin: 60, xp: 75 },
  { id: 'q_perfect',type: 'perfect',  n: 1,   ru: 'Без промаха',        pl: 'Sesja bez pudła',          desc: 'Zamknij całą sesję bez jednego błędu',       coin: 90, xp: 120 },
  { id: 'q_keys200',type: 'keys',     n: 200, ru: 'Двести знаков',      pl: 'Dwieście znaków',          desc: 'Wystukaj dziś 200 znaków w trenerze klawiatury', coin: 50, xp: 60 },
  { id: 'q_read1',  type: 'reading',  n: 1,   ru: 'Чтение',             pl: 'Jeden tekst',              desc: 'Przerób dziś tekst w Czytelni',              coin: 45, xp: 55 },
  { id: 'q_gram15', type: 'grammar',  n: 15,  ru: 'Грамматика',         pl: 'Piętnaście z gramatyki',   desc: 'Odpowiedz dziś na 15 pytań gramatycznych',   coin: 50, xp: 65 },
];

/* Teksty do Czytelni — gotowe na start, zanim wkleisz własne */
window.READINGS = [
  {
    id: 'r1', title: 'Утро', pl: 'Poranek', lvl: 1,
    text: 'Каждое утро я встаю в семь часов. Сначала я пью кофе и читаю новости. Потом я иду на работу. Дорога занимает двадцать минут. На улице всегда много людей. Я люблю утро, потому что город ещё тихий.',
  },
  {
    id: 'r2', title: 'В магазине', pl: 'W sklepie', lvl: 1,
    text: 'Вчера я ходил в магазин за продуктами. Мне нужно было купить хлеб, молоко и сыр. В магазине была большая очередь. Продавщица сказала, что хлеб закончился. Я купил только молоко и сыр и пошёл домой.',
  },
  {
    id: 'r3', title: 'Письмо другу', pl: 'List do przyjaciela', lvl: 2,
    text: 'Привет! Как дела? У меня всё хорошо. Я недавно переехал в новую квартиру. Она небольшая, но очень удобная. Из окна видно парк. Приезжай ко мне в гости, когда будет время. Я покажу тебе город. Пиши, как ты живёшь.',
  },
  {
    id: 'r4', title: 'Погода', pl: 'Pogoda', lvl: 2,
    text: 'Зимой в России очень холодно. Иногда температура опускается ниже тридцати градусов. Люди носят тёплую одежду: шапки, шарфы и перчатки. Летом наоборот бывает жарко. Весна и осень короткие, но красивые.',
  },
  {
    id: 'r5', title: 'Разговор', pl: 'Rozmowa', lvl: 3,
    text: '— Слушай, ты не знаешь, где здесь можно поесть?\n— Конечно. Тут за углом есть неплохое кафе. Там готовят домашнюю еду и цены нормальные.\n— А далеко идти?\n— Минут пять, не больше. Хочешь, пойдём вместе? Я всё равно собирался обедать.\n— Давай. Только мне нужно сначала снять деньги.',
  },
  {
    id: 'r6', title: 'Почему стоит учить язык', pl: 'Dlaczego warto uczyć się języka', lvl: 3,
    text: 'Многие думают, что выучить иностранный язык почти невозможно. На самом деле главное — заниматься регулярно, пусть даже понемногу. Двадцать минут каждый день дают больше, чем пять часов раз в неделю. Мозг запоминает то, что повторяется, а не то, что было один раз.',
  },
];
