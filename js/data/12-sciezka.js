/* ============================================================
   ŚCIEŻKA — jeden ciąg celów od zera do swobody.
   Cel odblokowuje się dopiero, gdy poprzedni jest zamknięty.

   typ:  ref     — przeczytaj ściągawkę
         module  — zalicz sekcję modułu gramatycznego (sec: indeks lub 'all')
         vocab   — opanuj n słówek z kategorii (SRS: pudełko >= 2)
         drill   — zrób n poprawnych odpowiedzi w treningu kategorii
         exam    — zdaj egzamin na min%
         review  — wyczyść n powtórek z kolejki
   ============================================================ */

window.PATH = [
  {
    id: 'ch1', num: 'I', ru: 'Алфавит', pl: 'Litery i pierwsze słowa',
    desc: 'Za tydzień będziesz czytać szyldy. Zaczynamy od znaków.',
    goals: [
      { id: 'g101', type: 'ref', ref: 'alphabet', title: 'Poznaj cyrylicę', desc: 'Ściągawka: 33 litery, w tym 7 fałszywych znajomych', xp: 30 },
      { id: 'g102', type: 'module', ref: 'basics', sec: 0, title: 'Rozszyfruj litery', desc: 'Sekcja „Cyrylica” z modułu Podstawy', xp: 50 },
      { id: 'g103', type: 'vocab', ref: 'greet', n: 12, title: 'Przywitaj się', desc: '12 słówek z kategorii Zwroty i uprzejmość', xp: 60 },
      { id: 'g104', type: 'ref', ref: 'sound', title: 'Usłysz różnicę', desc: 'Ściągawka: pięć zasad wymowy', xp: 30 },
      { id: 'g105', type: 'vocab', ref: 'people', n: 12, title: 'Nazwij ludzi', desc: '12 słówek: rodzina i znajomi', xp: 60 },
      { id: 'g106', type: 'review', n: 15, title: 'Pierwsza powtórka', desc: 'Wyczyść 15 kart z kolejki powtórek', xp: 40 },
    ],
  },
  {
    id: 'ch2', num: 'II', ru: 'Глаголы', pl: 'Czasownik w ruchu',
    desc: 'Rzeczowniki nazywają. Dopiero czasownik pozwala coś powiedzieć.',
    goals: [
      { id: 'g201', type: 'ref', ref: 'conj', title: 'Dwie koniugacje', desc: 'Ściągawka: końcówki -е- i -и-', xp: 30 },
      { id: 'g202', type: 'module', ref: 'basics', sec: 1, title: 'I koniugacja', desc: 'читать, работать, знать', xp: 50 },
      { id: 'g203', type: 'module', ref: 'basics', sec: 2, title: 'II koniugacja', desc: 'говорить, любить, учить', xp: 50 },
      { id: 'g204', type: 'module', ref: 'basics', sec: 3, title: 'Czas przeszły', desc: 'Końcówki -л, -ла, -ло, -ли', xp: 50 },
      { id: 'g205', type: 'vocab', ref: 'verbs', n: 25, title: '25 czasowników', desc: 'Najczęstsze akcje dnia codziennego', xp: 90 },
      { id: 'g206', type: 'module', ref: 'verbs', sec: 'all', title: 'Czasowniki w akcji', desc: 'Cały moduł: 6 sekcji, aspekt i pułapki', xp: 140 },
    ],
  },
  {
    id: 'ch3', num: 'III', ru: 'Чередования', pl: 'Miejsca, gdzie język się łamie',
    desc: 'Wymiany i nieregularne. Wygląda strasznie, a to ten sam mechanizm co w polskim.',
    goals: [
      { id: 'g301', type: 'ref', ref: 'mut', title: 'Wymiany spółgłosek', desc: 'Ściągawka: д→ж, т→ч, с→ш i reszta', xp: 30 },
      { id: 'g302', type: 'module', ref: 'mutations', sec: 'all', title: 'Przetrenuj wymiany', desc: 'Cały moduł czередований', xp: 140 },
      { id: 'g303', type: 'ref', ref: 'irreg', title: 'Piątka nieregularnych', desc: 'хотеть, есть, пить, жить, мочь', xp: 30 },
      { id: 'g304', type: 'module', ref: 'irregular', sec: 'all', title: 'Wbij je do głowy', desc: 'Cały moduł nieregularnych', xp: 140 },
      { id: 'g305', type: 'review', n: 40, title: 'Powtórka kontrolna', desc: 'Wyczyść 40 kart z kolejki', xp: 60 },
      { id: 'g306', type: 'exam', ref: 'test', min: 70, title: 'Sprawdzian', desc: '44 pytania — wynik minimum 70%', xp: 200 },
    ],
  },
  {
    id: 'ch4', num: 'IV', ru: 'Слова', pl: 'Słownictwo dnia codziennego',
    desc: 'Gramatyka bez słów jest pusta. Czas napełnić szkielet.',
    goals: [
      { id: 'g401', type: 'vocab', ref: 'food', n: 35, title: 'Jedzenie i napoje', desc: '35 słówek — zamówisz obiad', xp: 110 },
      { id: 'g402', type: 'drill', ref: 'gfood', n: 20, title: 'Trening kuchenny', desc: '20 poprawnych w module Jedzenie', xp: 60 },
      { id: 'g403', type: 'vocab', ref: 'home', n: 30, title: 'Dom i mieszkanie', desc: '30 słówek — opiszesz, gdzie mieszkasz', xp: 100 },
      { id: 'g404', type: 'vocab', ref: 'travel', n: 30, title: 'Podróże i transport', desc: '30 słówek — kupisz bilet', xp: 100 },
      { id: 'g405', type: 'drill', ref: 'gtravel', n: 20, title: 'Trening podróżny', desc: '20 poprawnych w module Podróże', xp: 60 },
      { id: 'g406', type: 'vocab', ref: 'shop', n: 25, title: 'Zakupy i pieniądze', desc: '25 słówek — zapytasz o cenę', xp: 90 },
      { id: 'g407', type: 'vocab', ref: 'time', n: 30, title: 'Czas i liczby', desc: '30 słówek — umówisz się na spotkanie', xp: 100 },
    ],
  },
  {
    id: 'ch5', num: 'V', ru: 'Падежи', pl: 'Struktura zdania',
    desc: 'Tu Polak wyprzedza wszystkich. Sześć przypadków, które już czujesz.',
    goals: [
      { id: 'g501', type: 'ref', ref: 'cases', title: 'Sześć przypadków', desc: 'Ściągawka z pełną tabelą końcówek', xp: 30 },
      { id: 'g502', type: 'module', ref: 'cases', sec: 'all', title: 'Odmieniaj rzeczowniki', desc: 'Cały moduł падежей', xp: 140 },
      { id: 'g503', type: 'ref', ref: 'pron', title: 'Zaimki i zasada Н-', desc: 'его → у него, ей → к ней', xp: 30 },
      { id: 'g504', type: 'module', ref: 'pronouns', sec: 'all', title: 'Opanuj zaimki', desc: 'Cały moduł местоимений', xp: 140 },
      { id: 'g505', type: 'ref', ref: 'num', title: 'Liczby 1–1000', desc: 'Wyjątki: сорок i девяносто', xp: 30 },
      { id: 'g506', type: 'module', ref: 'numbers', sec: 'all', title: 'Licz po rosyjsku', desc: 'Cały moduł числительных', xp: 140 },
      { id: 'g507', type: 'ref', ref: 'aspect', title: 'Aspekt czasownika', desc: 'читать vs прочитать', xp: 30 },
    ],
  },
  {
    id: 'ch6', num: 'VI', ru: 'Живая речь', pl: 'Tak mówią naprawdę',
    desc: 'Podręcznikowy rosyjski to nie ten, który usłyszysz w Moskwie.',
    goals: [
      { id: 'g601', type: 'vocab', ref: 'phrases', n: 30, title: 'Zwroty jak native', desc: '30 gotowych fraz do wrzucenia w rozmowę', xp: 110 },
      { id: 'g602', type: 'vocab', ref: 'slang', n: 30, title: 'Slang i mowa potoczna', desc: 'блин, круто, короче, забей', xp: 110 },
      { id: 'g603', type: 'vocab', ref: 'falsefriend', n: 25, title: 'Fałszywi przyjaciele', desc: 'магазин to sklep, a диван to kanapa', xp: 100 },
      { id: 'g604', type: 'vocab', ref: 'emo', n: 25, title: 'Emocje i charakter', desc: 'Powiedz, co czujesz', xp: 90 },
      { id: 'g605', type: 'vocab', ref: 'adj', n: 30, title: 'Przymiotniki', desc: 'Opisz, jak coś wygląda', xp: 100 },
      { id: 'g606', type: 'review', n: 100, title: 'Wielka powtórka', desc: 'Wyczyść 100 kart z kolejki', xp: 150 },
      { id: 'g607', type: 'exam', ref: 'final', min: 80, title: 'Egzamin końcowy', desc: '76 pytań — wynik minimum 80%', xp: 400 },
    ],
  },
  {
    id: 'ch7', num: 'VII', ru: 'Мастерство', pl: 'Mistrzostwo',
    desc: 'Materiał się kończy, język nie. Tu zostają już tylko słówka.',
    goals: [
      { id: 'g701', type: 'vocab', ref: 'city', n: 35, title: 'Miasto od podszewki', desc: '35 słówek miejskich', xp: 110 },
      { id: 'g702', type: 'vocab', ref: 'work', n: 30, title: 'Praca i zawody', desc: '30 słówek zawodowych', xp: 100 },
      { id: 'g703', type: 'vocab', ref: 'nature', n: 30, title: 'Przyroda i pogoda', desc: '30 słówek o świecie za oknem', xp: 100 },
      { id: 'g704', type: 'vocab', ref: 'body', n: 30, title: 'Ciało i zdrowie', desc: '30 słówek — dogadasz się u lekarza', xp: 100 },
      { id: 'g705', type: 'vocab', ref: 'abstract', n: 25, title: 'Pojęcia abstrakcyjne', desc: 'cel, sens, wolność, wybór', xp: 100 },
      { id: 'g706', type: 'vocab', ref: 'tech', n: 25, title: 'Technologia', desc: 'Internet po rosyjsku', xp: 90 },
      { id: 'g707', type: 'review', n: 300, title: 'Trzysta powtórek', desc: 'Łącznie 300 kart wyczyszczonych z kolejki', xp: 250 },
    ],
  },
];

/* ============================================================
   ODZNAKI — nagrody za zachowania, nie tylko za postęp
   check(s) dostaje pełny stan i zwraca true/false
   ============================================================ */

window.BADGES = [
  { id: 'first',    ru: 'Начало',        pl: 'Pierwszy krok',        desc: 'Zamknij pierwszy cel na ścieżce',            icon: 'I' },
  { id: 'streak3',  ru: 'Три дня',       pl: 'Trzy dni z rzędu',     desc: 'Ucz się trzy dni pod rząd',                  icon: 'III' },
  { id: 'streak7',  ru: 'Неделя',        pl: 'Tydzień bez przerwy',  desc: 'Siedmiodniowa passa',                        icon: 'VII' },
  { id: 'streak30', ru: 'Месяц',         pl: 'Miesiąc dyscypliny',   desc: 'Trzydzieści dni z rzędu',                    icon: 'XXX' },
  { id: 'w100',     ru: 'Сто слов',      pl: 'Sto słów',             desc: 'Sto słówek w pamięci długotrwałej',          icon: '100' },
  { id: 'w300',     ru: 'Триста',        pl: 'Trzysta słów',         desc: 'Trzysta słówek opanowanych',                 icon: '300' },
  { id: 'w600',     ru: 'Шестьсот',      pl: 'Sześćset słów',        desc: 'Sześćset słówek opanowanych',                icon: '600' },
  { id: 'w1000',    ru: 'Тысяча',        pl: 'Tysiąc słów',          desc: 'Cała baza w głowie',                         icon: '1K' },
  { id: 'perfect',  ru: 'Без ошибок',    pl: 'Bez jednego błędu',    desc: 'Ukończ sesję 20 pytań bez pomyłki',          icon: '✓' },
  { id: 'combo15',  ru: 'Серия 15',      pl: 'Seria piętnastu',      desc: '15 poprawnych odpowiedzi pod rząd',          icon: '×15' },
  { id: 'night',    ru: 'Полуночник',    pl: 'Nocny marek',          desc: 'Sesja nauki po północy',                     icon: 'Н' },
  { id: 'early',    ru: 'Жаворонок',     pl: 'Ranny ptaszek',        desc: 'Sesja nauki przed siódmą rano',              icon: 'У' },
  { id: 'exam1',    ru: 'Зачёт',         pl: 'Sprawdzian zdany',     desc: 'Sprawdzian na minimum 70%',                  icon: '§' },
  { id: 'exam2',    ru: 'Диплом',        pl: 'Egzamin zdany',        desc: 'Egzamin końcowy na minimum 80%',             icon: '¶' },
  { id: 'gram',     ru: 'Грамматик',     pl: 'Gramatyk',             desc: 'Wszystkie moduły gramatyczne ukończone',     icon: '∑' },
  { id: 'slangman', ru: 'Свой',          pl: 'Swój człowiek',        desc: 'Cała kategoria slangu opanowana',            icon: 'Ж' },
  { id: 'cheat',    ru: 'Теоретик',      pl: 'Teoretyk',             desc: 'Przeczytaj wszystkie ściągawki',             icon: 'Т' },
  { id: 'writer',   ru: 'Писатель',      pl: 'Pisarz',               desc: 'Zapisz dziesięć własnych notatek',           icon: 'З' },
  { id: 'typer',    ru: 'Кириллица',     pl: 'Klawiatura cyrylicy',  desc: '50 słów wpisanych poprawnie z pamięci',      icon: 'Я' },
  { id: 'path',     ru: 'Путь пройден',  pl: 'Ścieżka przebyta',     desc: 'Zamknij wszystkie cele na ścieżce',          icon: '∞' },
  { id: 'typist',   ru: 'Машинистка',    pl: 'Maszynistka',          desc: '80 znaków na minutę na klawiaturze ЙЦУКЕН',  icon: 'К' },
  { id: 'blind',    ru: 'Вслепую',       pl: 'Na ślepo',             desc: 'Ukończ wszystkie lekcje klawiatury',         icon: '⌨' },
  { id: 'builder',  ru: 'Строитель',     pl: 'Budowniczy zdań',      desc: 'Ułóż poprawnie 50 zdań',                     icon: 'С' },
  { id: 'reader',   ru: 'Читатель книг', pl: 'Czytelnik',            desc: 'Przerób 10 tekstów w Czytelni',              icon: 'Ч' },
  { id: 'rich',     ru: 'Богач',         pl: 'Bogacz',               desc: 'Uzbieraj 500 rubli',                         icon: '₽' },
  { id: 'quester',  ru: 'Поручения',     pl: 'Wykonawca',            desc: 'Wykonaj 15 zadań pobocznych',                icon: '✦' },
];
