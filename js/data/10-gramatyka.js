/* ============================================================
   MODULY GRAMATYCZNE
   Material przeniesiony 1:1 z wlasnych plikow .jsx uzytkownika.
   Format sekcji: { title, icon, questions: [{q, options, answer, hint?}] }
   ============================================================ */

window.MODULES = [];
window.EXAMS = [];
window.addModule = function (id, title, desc, group, sections) {
  MODULES.push({ id: id, title: title, desc: desc, group: group, sections: sections });
};
window.addExam = function (id, title, desc, questions) {
  EXAMS.push({ id: id, title: title, desc: desc, questions: questions });
};

addModule("basics", "Podstawy i cyrylica", "Alfabet, I i II koniugacja, czas przeszly, pierwsze slowa", "start", [
  {
    title: "Cyrylica — rozpoznaj literę",
    icon: "А",
    questions: [
      { q: "Jak czytamy rosyjską literę В?", options: ["B", "W", "F", "G"], answer: 1 },
      { q: "Jak czytamy rosyjską literę Н?", options: ["H", "M", "N", "P"], answer: 2 },
      { q: "Jak czytamy rosyjską literę Р?", options: ["P", "R", "G", "D"], answer: 1 },
      { q: "Jak czytamy rosyjską literę С?", options: ["K", "C", "S", "Z"], answer: 2 },
      { q: "Co oznacza znak Ь?", options: ["Twardy znak", "Miękki znak", "Samogłoska", "Spółgłoska"], answer: 1 },
    ],
  },
  {
    title: "Odmiana — I koniugacja",
    icon: "Г",
    questions: [
      { q: "Читать → Я ...?", options: ["читаю", "читаешь", "читает", "читаем"], answer: 0 },
      { q: "Читать → Ты ...?", options: ["читаю", "читаешь", "читает", "читаем"], answer: 1 },
      { q: "Читать → Они ...?", options: ["читает", "читаем", "читаете", "читают"], answer: 3 },
      { q: "Работать (pracować) → Мы ...?", options: ["работаю", "работаешь", "работаем", "работают"], answer: 2 },
      { q: "Знать (wiedzieć) → Он ...?", options: ["знаю", "знаешь", "знает", "знаем"], answer: 2 },
    ],
  },
  {
    title: "Odmiana — II koniugacja",
    icon: "Д",
    questions: [
      { q: "Говорить → Я ...?", options: ["говорю", "говоришь", "говорит", "говорим"], answer: 0 },
      { q: "Говорить → Вы ...?", options: ["говорим", "говорят", "говорите", "говоришь"], answer: 2 },
      { q: "Любить (kochać) → Она ...?", options: ["любю", "любишь", "любит", "любим"], answer: 2 },
      { q: "Учить (uczyć) → Мы ...?", options: ["учу", "учишь", "учим", "учат"], answer: 2 },
      { q: "Говорить → Они ...?", options: ["говорит", "говорят", "говорим", "говорите"], answer: 1 },
    ],
  },
  {
    title: "Czas przeszły",
    icon: "П",
    questions: [
      { q: "Читать → On czytał = Он ...?", options: ["читал", "читала", "читало", "читали"], answer: 0 },
      { q: "Читать → Ona czytała = Она ...?", options: ["читал", "читала", "читало", "читали"], answer: 1 },
      { q: "Говорить → Oni mówili = Они ...?", options: ["говорил", "говорила", "говорило", "говорили"], answer: 3 },
      { q: "Работать → Ona pracowała = Она ...?", options: ["работал", "работала", "работало", "работали"], answer: 1 },
      { q: "Писать (pisać) → Ono pisało = Оно ...?", options: ["писал", "писала", "писало", "писали"], answer: 2 },
    ],
  },
  {
    title: "Słówka i zwroty",
    icon: "С",
    questions: [
      { q: "Jak powiedzieć 'dziękuję' po rosyjsku?", options: ["Пожалуйста", "Спасибо", "Привет", "Хорошо"], answer: 1 },
      { q: "Co znaczy 'Как дела?'", options: ["Jak masz na imię?", "Co słychać?", "Skąd jesteś?", "Ile masz lat?"], answer: 1 },
      { q: "Co znaczy 'Здравствуйте'?", options: ["Do widzenia", "Przepraszam", "Dzień dobry (formalnie)", "Proszę"], answer: 2 },
      { q: "Jak powiedzieć 'tak' po rosyjsku?", options: ["Нет", "Да", "Ну", "Вот"], answer: 1 },
      { q: "Co znaczy 'книга'?", options: ["Kot", "Stół", "Okno", "Książka"], answer: 3 },
    ],
  },
]);

addModule("verbs", "Czasowniki w akcji", "Odmiany, aspekt dokonany i niedokonany, pulapki koniugacji", "core", [
  {
    title: "I koniugacja — różne czasowniki",
    subtitle: "думать, знать, делать, гулять, слушать",
    icon: "I",
    questions: [
      { q: "Думать (myśleć) → Я ...?", options: ["думаю", "думаешь", "думает", "думаем"], answer: 0 },
      { q: "Делать (robić) → Ты ...?", options: ["делаю", "делаешь", "делает", "делаем"], answer: 1 },
      { q: "Гулять (spacerować) → Мы ...?", options: ["гуляю", "гуляешь", "гуляем", "гуляют"], answer: 2 },
      { q: "Слушать (słuchać) → Они ...?", options: ["слушает", "слушаем", "слушаете", "слушают"], answer: 3 },
      { q: "Знать (wiedzieć) → Вы ...?", options: ["знаю", "знаешь", "знаем", "знаете"], answer: 3 },
      { q: "Играть (grać) → Она ...?", options: ["играю", "играешь", "играет", "играем"], answer: 2 },
    ],
  },
  {
    title: "II koniugacja — różne czasowniki",
    subtitle: "учить, любить, смотреть, ходить, видеть",
    icon: "II",
    questions: [
      { q: "Учить (uczyć się) → Я ...?", options: ["учу", "учишь", "учит", "учим"], answer: 0 },
      { q: "Любить (kochać) → Ты ...?", options: ["любю", "любишь", "любит", "любим"], answer: 1 },
      { q: "Смотреть (patrzeć) → Он ...?", options: ["смотрю", "смотришь", "смотрит", "смотрим"], answer: 2 },
      { q: "Ходить (chodzić) → Мы ...?", options: ["хожу", "ходишь", "ходит", "ходим"], answer: 3 },
      { q: "Видеть (widzieć) → Я ...?", options: ["видю", "вижу", "видишь", "видит"], answer: 1, hint: "Uwaga! Я вижу — zmiana д→ж w 1. osobie!" },
      { q: "Ходить (chodzić) → Я ...?", options: ["ходю", "ходу", "хожу", "ходишь"], answer: 2, hint: "Zmiana д→ж w 1. osobie!" },
    ],
  },
  {
    title: "Nieregularne czasowniki",
    subtitle: "хотеть, есть, пить, жить, мочь",
    icon: "⚡",
    questions: [
      { q: "Хотеть (chcieć) → Я ...?", options: ["хочу", "хотю", "хотею", "хочешь"], answer: 0 },
      { q: "Хотеть → Мы ...?", options: ["хочем", "хотем", "хотим", "хочим"], answer: 2, hint: "Хотеть jest mieszany: l.poj. jak I konj., l.mn. jak II!" },
      { q: "Есть (jeść) → Я ...?", options: ["ею", "ем", "ешь", "ест"], answer: 1 },
      { q: "Есть → Они ...?", options: ["ест", "есят", "едят", "едат"], answer: 2 },
      { q: "Пить (pić) → Ты ...?", options: ["пиешь", "пьёшь", "питьёшь", "пишь"], answer: 1 },
      { q: "Жить (żyć/mieszkać) → Мы ...?", options: ["жиём", "живём", "жуём", "жилём"], answer: 1 },
      { q: "Мочь (móc) → Я ...?", options: ["можу", "мочу", "могу", "мочью"], answer: 2 },
      { q: "Мочь → Они ...?", options: ["можут", "могут", "мочут", "можат"], answer: 1 },
    ],
  },
  {
    title: "Aspekt: dokonany vs niedokonany",
    subtitle: "читать/прочитать, писать/написать...",
    icon: "⟷",
    questions: [
      { q: "\"Codziennie czytam książki\" — który aspekt?", options: ["Dokonany (прочитать)", "Niedokonany (читать)"], answer: 1, hint: "Czynność powtarzająca się → niedokonany" },
      { q: "\"Wczoraj przeczytałem książkę\" — który aspekt?", options: ["Dokonany (прочитать)", "Niedokonany (читать)"], answer: 0, hint: "Czynność zakończona → dokonany" },
      { q: "Jaka jest para dokonana do: писать (pisać)?", options: ["пописать", "написать", "списать", "выписать"], answer: 1 },
      { q: "Jaka jest para dokonana do: делать (robić)?", options: ["выделать", "доделать", "сделать", "наделать"], answer: 2 },
      { q: "\"Я буду читать\" oznacza:", options: ["Przeczytam (jednorazowo)", "Będę czytać (proces)", "Czytałem", "Czytam teraz"], answer: 1, hint: "буду + bezokolicznik niedok. = czas przyszły niedokonany" },
      { q: "\"Я прочитаю\" oznacza:", options: ["Będę czytać (proces)", "Przeczytam (zakończę)", "Czytałem", "Czytam"], answer: 1, hint: "Forma dokonana w czasie przyszłym = jednorazowe zakończenie" },
    ],
  },
  {
    title: "Czas przeszły — rozszerzony",
    subtitle: "Różne czasowniki i rodzaje",
    icon: "⏪",
    questions: [
      { q: "Жить → On mieszkał = Он ...?", options: ["жил", "жила", "жило", "жили"], answer: 0 },
      { q: "Мочь → Ona mogła = Она ...?", options: ["мог", "могла", "могло", "могли"], answer: 1 },
      { q: "Есть → Oni jedli = Они ...?", options: ["ел", "ела", "ело", "ели"], answer: 3 },
      { q: "Пить → On pił = Он ...?", options: ["пил", "пила", "пило", "пили"], answer: 0 },
      { q: "Хотеть → Ona chciała = Она ...?", options: ["хотел", "хотела", "хотело", "хотели"], answer: 1 },
      { q: "Идти (iść) → Oni szli = Они ...?", options: ["шёл", "шла", "шло", "шли"], answer: 3, hint: "Идти ma nieregularną formę przeszłą: шёл/шла/шло/шли" },
      { q: "Идти → On szedł = Он ...?", options: ["шёл", "шла", "идл", "идёл"], answer: 0, hint: "Шёл — zapamiętaj tę formę!" },
    ],
  },
  {
    title: "Która to koniugacja?",
    subtitle: "Rozpoznaj typ odmiany",
    icon: "?",
    questions: [
      { q: "Читать (-ать) → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 0 },
      { q: "Говорить (-ить) → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 1 },
      { q: "Смотреть (-еть) → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 1, hint: "Wyjątek! Смотреть kończy się na -еть, ale odmienia się jak II!" },
      { q: "Хотеть → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Mieszany / nieregularny"], answer: 2 },
      { q: "Писать (-ать) → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 0 },
      { q: "Видеть (-еть) → która koniugacja?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 1, hint: "Kolejny wyjątek! Видеть odmienia się jak II koniugacja." },
    ],
  },
]);

addModule("mutations", "Wymiany spolglosek", "Czeredowanija: d-z, t-cz, s-sz - tylko w 1. osobie", "core", [
  {
    title: "\u0434 \u2192 \u0436, \u0442 \u2192 \u0447, \u0441 \u2192 \u0448",
    subtitle: "Podstawowe wymiany",
    icon: "\u0434\u0436",
    questions: [
      { q: "\u0425\u043e\u0434\u0438\u0442\u044c (chodzic) \u2192 \u042f ...?", options: ["\u0445\u043e\u0434\u044e", "\u0445\u043e\u0436\u0443", "\u0445\u043e\u0434\u0443", "\u0445\u043e\u0436\u044e"], answer: 1, hint: "\u0434 \u2192 \u0436: \u0445\u043e\u0434\u0438\u0442\u044c \u2192 \u0445\u043e\u0436\u0443" },
      { q: "\u0412\u0438\u0434\u0435\u0442\u044c (widziec) \u2192 \u042f ...?", options: ["\u0432\u0438\u0434\u044e", "\u0432\u0438\u0436\u0443", "\u0432\u0438\u0434\u0435\u044e", "\u0432\u0438\u0436\u044e"], answer: 1, hint: "\u0434 \u2192 \u0436: \u0432\u0438\u0434\u0435\u0442\u044c \u2192 \u0432\u0438\u0436\u0443" },
      { q: "\u0412\u043e\u0434\u0438\u0442\u044c (prowadzic) \u2192 \u042f ...?", options: ["\u0432\u043e\u0434\u044e", "\u0432\u043e\u0436\u0443", "\u0432\u043e\u0434\u044e", "\u0432\u043e\u0436\u044c\u044e"], answer: 1, hint: "\u0434 \u2192 \u0436: \u0432\u043e\u0434\u0438\u0442\u044c \u2192 \u0432\u043e\u0436\u0443" },
      { q: "\u041f\u043b\u0430\u0442\u0438\u0442\u044c (placic) \u2192 \u042f ...?", options: ["\u043f\u043b\u0430\u0442\u044e", "\u043f\u043b\u0430\u0447\u0443", "\u043f\u043b\u0430\u0442\u044c\u044e", "\u043f\u043b\u0430\u0447\u044c\u044e"], answer: 1, hint: "\u0442 \u2192 \u0447: \u043f\u043b\u0430\u0442\u0438\u0442\u044c \u2192 \u043f\u043b\u0430\u0447\u0443" },
      { q: "\u041b\u0435\u0442\u0435\u0442\u044c (leciec) \u2192 \u042f ...?", options: ["\u043b\u0435\u0442\u044e", "\u043b\u0435\u0447\u0443", "\u043b\u0435\u0442\u0435\u044e", "\u043b\u0435\u0447\u044c\u044e"], answer: 1, hint: "\u0442 \u2192 \u0447: \u043b\u0435\u0442\u0435\u0442\u044c \u2192 \u043b\u0435\u0447\u0443" },
      { q: "\u041f\u0440\u043e\u0441\u0438\u0442\u044c (prosic) \u2192 \u042f ...?", options: ["\u043f\u0440\u043e\u0441\u044e", "\u043f\u0440\u043e\u0448\u0443", "\u043f\u0440\u043e\u0441\u044c\u044e", "\u043f\u0440\u043e\u0448\u044c\u044e"], answer: 1, hint: "\u0441 \u2192 \u0448: \u043f\u0440\u043e\u0441\u0438\u0442\u044c \u2192 \u043f\u0440\u043e\u0448\u0443" },
      { q: "\u041f\u0438\u0441\u0430\u0442\u044c (pisac) \u2192 \u042f ...?", options: ["\u043f\u0438\u0441\u0430\u044e", "\u043f\u0438\u0448\u0443", "\u043f\u0438\u0441\u044e", "\u043f\u0438\u0448\u044c\u044e"], answer: 1, hint: "\u0441 \u2192 \u0448: \u043f\u0438\u0441\u0430\u0442\u044c \u2192 \u043f\u0438\u0448\u0443" },
      { q: "\u041d\u043e\u0441\u0438\u0442\u044c (nosic) \u2192 \u042f ...?", options: ["\u043d\u043e\u0441\u044e", "\u043d\u043e\u0448\u0443", "\u043d\u043e\u0441\u044c\u044e", "\u043d\u043e\u0448\u044c\u044e"], answer: 1, hint: "\u0441 \u2192 \u0448: \u043d\u043e\u0441\u0438\u0442\u044c \u2192 \u043d\u043e\u0448\u0443" },
    ],
  },
  {
    title: "\u0431 \u2192 \u0431\u043b, \u0432 \u2192 \u0432\u043b, \u043f \u2192 \u043f\u043b, \u043c \u2192 \u043c\u043b",
    subtitle: "Wymiany z wstawka -\u043b-",
    icon: "\u0431\u043b",
    questions: [
      { q: "\u041b\u044e\u0431\u0438\u0442\u044c (kochac) \u2192 \u042f ...?", options: ["\u043b\u044e\u0431\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043b\u044e\u0431\u044c\u044e", "\u043b\u044e\u0431\u0443"], answer: 1, hint: "\u0431 \u2192 \u0431\u043b: \u043b\u044e\u0431\u0438\u0442\u044c \u2192 \u043b\u044e\u0431\u043b\u044e" },
      { q: "\u0413\u043e\u0442\u043e\u0432\u0438\u0442\u044c (gotowac) \u2192 \u042f ...?", options: ["\u0433\u043e\u0442\u043e\u0432\u044e", "\u0433\u043e\u0442\u043e\u0432\u043b\u044e", "\u0433\u043e\u0442\u043e\u0432\u044c\u044e", "\u0433\u043e\u0442\u043e\u0432\u0443"], answer: 1, hint: "\u0432 \u2192 \u0432\u043b: \u0433\u043e\u0442\u043e\u0432\u0438\u0442\u044c \u2192 \u0433\u043e\u0442\u043e\u0432\u043b\u044e" },
      { q: "\u041a\u0443\u043f\u0438\u0442\u044c (kupic) \u2192 \u042f ...?", options: ["\u043a\u0443\u043f\u044e", "\u043a\u0443\u043f\u043b\u044e", "\u043a\u0443\u043f\u044c\u044e", "\u043a\u0443\u043f\u0443"], answer: 1, hint: "\u043f \u2192 \u043f\u043b: \u043a\u0443\u043f\u0438\u0442\u044c \u2192 \u043a\u0443\u043f\u043b\u044e" },
      { q: "\u041a\u043e\u0440\u043c\u0438\u0442\u044c (karmic) \u2192 \u042f ...?", options: ["\u043a\u043e\u0440\u043c\u044e", "\u043a\u043e\u0440\u043c\u043b\u044e", "\u043a\u043e\u0440\u043c\u044c\u044e", "\u043a\u043e\u0440\u043c\u0443"], answer: 1, hint: "\u043c \u2192 \u043c\u043b: \u043a\u043e\u0440\u043c\u0438\u0442\u044c \u2192 \u043a\u043e\u0440\u043c\u043b\u044e" },
      { q: "\u0421\u0442\u0430\u0432\u0438\u0442\u044c (stawiac) \u2192 \u042f ...?", options: ["\u0441\u0442\u0430\u0432\u044e", "\u0441\u0442\u0430\u0432\u043b\u044e", "\u0441\u0442\u0430\u0432\u044c\u044e", "\u0441\u0442\u0430\u0432\u0443"], answer: 1, hint: "\u0432 \u2192 \u0432\u043b: \u0441\u0442\u0430\u0432\u0438\u0442\u044c \u2192 \u0441\u0442\u0430\u0432\u043b\u044e" },
      { q: "\u041b\u043e\u0432\u0438\u0442\u044c (lowic) \u2192 \u042f ...?", options: ["\u043b\u043e\u0432\u044e", "\u043b\u043e\u0432\u043b\u044e", "\u043b\u043e\u0432\u044c\u044e", "\u043b\u043e\u0432\u0443"], answer: 1, hint: "\u0432 \u2192 \u0432\u043b: \u043b\u043e\u0432\u0438\u0442\u044c \u2192 \u043b\u043e\u0432\u043b\u044e" },
    ],
  },
  {
    title: "\u0441\u0442 \u2192 \u0449, \u0437 \u2192 \u0436",
    subtitle: "Trudniejsze przypadki",
    icon: "\u0449",
    questions: [
      { q: "\u0427\u0438\u0441\u0442\u0438\u0442\u044c (czyscic) \u2192 \u042f ...?", options: ["\u0447\u0438\u0441\u0442\u044e", "\u0447\u0438\u0449\u0443", "\u0447\u0438\u0441\u0442\u044c\u044e", "\u0447\u0438\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449: \u0447\u0438\u0441\u0442\u0438\u0442\u044c \u2192 \u0447\u0438\u0449\u0443" },
      { q: "\u041f\u0443\u0441\u0442\u0438\u0442\u044c (puscic) \u2192 \u042f ...?", options: ["\u043f\u0443\u0441\u0442\u044e", "\u043f\u0443\u0449\u0443", "\u043f\u0443\u0441\u0442\u044c\u044e", "\u043f\u0443\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449: \u043f\u0443\u0441\u0442\u0438\u0442\u044c \u2192 \u043f\u0443\u0449\u0443" },
      { q: "\u0412\u043e\u0437\u0438\u0442\u044c (wozic) \u2192 \u042f ...?", options: ["\u0432\u043e\u0437\u044e", "\u0432\u043e\u0436\u0443", "\u0432\u043e\u0437\u044c\u044e", "\u0432\u043e\u0436\u044c\u044e"], answer: 1, hint: "\u0437 \u2192 \u0436: \u0432\u043e\u0437\u0438\u0442\u044c \u2192 \u0432\u043e\u0436\u0443" },
      { q: "\u0413\u0440\u0443\u0441\u0442\u0438\u0442\u044c (smucic sie) \u2192 \u042f ...?", options: ["\u0433\u0440\u0443\u0441\u0442\u044e", "\u0433\u0440\u0443\u0449\u0443", "\u0433\u0440\u0443\u0441\u0442\u044c\u044e", "\u0433\u0440\u0443\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449: \u0433\u0440\u0443\u0441\u0442\u0438\u0442\u044c \u2192 \u0433\u0440\u0443\u0449\u0443" },
      { q: "\u041f\u0440\u043e\u0441\u0442\u0438\u0442\u044c (przebaczyc) \u2192 \u042f ...?", options: ["\u043f\u0440\u043e\u0441\u0442\u044e", "\u043f\u0440\u043e\u0449\u0443", "\u043f\u0440\u043e\u0441\u0442\u044c\u044e", "\u043f\u0440\u043e\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449: \u043f\u0440\u043e\u0441\u0442\u0438\u0442\u044c \u2192 \u043f\u0440\u043e\u0449\u0443" },
      { q: "\u041c\u043e\u0440\u043e\u0437\u0438\u0442\u044c (mrozic) \u2192 \u042f ...?", options: ["\u043c\u043e\u0440\u043e\u0437\u044e", "\u043c\u043e\u0440\u043e\u0436\u0443", "\u043c\u043e\u0440\u043e\u0437\u044c\u044e", "\u043c\u043e\u0440\u043e\u0436\u044c\u044e"], answer: 1, hint: "\u0437 \u2192 \u0436: \u043c\u043e\u0440\u043e\u0437\u0438\u0442\u044c \u2192 \u043c\u043e\u0440\u043e\u0436\u0443" },
    ],
  },
  {
    title: "A co z reszta osob?",
    subtitle: "Wymiana TYLKO w Ja!",
    icon: "\uD83D\uDC41",
    questions: [
      { q: "\u0425\u043e\u0434\u0438\u0442\u044c: \u042f \u0445\u043e\u0436\u0443. A \u0422\u044b ...?", options: ["\u0445\u043e\u0436\u0438\u0448\u044c", "\u0445\u043e\u0434\u0438\u0448\u044c", "\u0445\u043e\u0436\u0435\u0448\u044c", "\u0445\u043e\u0434\u0435\u0448\u044c"], answer: 1, hint: "Wymiana TYLKO w 1. osobie! Reszta normalnie: \u0445\u043e\u0434\u0438\u0448\u044c" },
      { q: "\u041b\u044e\u0431\u0438\u0442\u044c: \u042f \u043b\u044e\u0431\u043b\u044e. A \u041e\u043d ...?", options: ["\u043e\u0431\u043b\u0438\u0442", "\u043b\u044e\u0431\u043b\u0438\u0442", "\u043b\u044e\u0431\u0438\u0442", "\u043b\u044e\u0431\u043b\u0451\u0442"], answer: 2, hint: "On, ona - bez wymiany: \u043b\u044e\u0431\u0438\u0442" },
      { q: "\u041f\u0440\u043e\u0441\u0438\u0442\u044c: \u042f \u043f\u0440\u043e\u0448\u0443. A \u041c\u044b ...?", options: ["\u043f\u0440\u043e\u0448\u0438\u043c", "\u043f\u0440\u043e\u0441\u0438\u043c", "\u043f\u0440\u043e\u0448\u0435\u043c", "\u043f\u0440\u043e\u0441\u0435\u043c"], answer: 1, hint: "\u041c\u044b - normalnie: \u043f\u0440\u043e\u0441\u0438\u043c" },
      { q: "\u0412\u0438\u0434\u0435\u0442\u044c: \u042f \u0432\u0438\u0436\u0443. A \u041e\u043d\u0438 ...?", options: ["\u0432\u0438\u0436\u0430\u0442", "\u0432\u0438\u0434\u044e\u0442", "\u0432\u0438\u0434\u044f\u0442", "\u0432\u0438\u0436\u0443\u0442"], answer: 2, hint: "\u041e\u043d\u0438 - bez wymiany: \u0432\u0438\u0434\u044f\u0442" },
      { q: "\u0413\u043e\u0442\u043e\u0432\u0438\u0442\u044c: \u042f \u0433\u043e\u0442\u043e\u0432\u043b\u044e. A \u0412\u044b ...?", options: ["\u0433\u043e\u0442\u043e\u0432\u043b\u0438\u0442\u0435", "\u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0435", "\u0433\u043e\u0442\u043e\u0432\u043b\u0435\u0442\u0435", "\u0433\u043e\u0442\u043e\u0432\u044c\u0442\u0435"], answer: 1, hint: "\u0412\u044b - normalnie: \u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0435" },
      { q: "\u041f\u043b\u0430\u0442\u0438\u0442\u044c: \u042f \u043f\u043b\u0430\u0447\u0443. A \u0422\u044b ...?", options: ["\u043f\u043b\u0430\u0447\u0438\u0448\u044c", "\u043f\u043b\u0430\u0442\u0438\u0448\u044c", "\u043f\u043b\u0430\u0447\u0435\u0448\u044c", "\u043f\u043b\u0430\u0442\u0435\u0448\u044c"], answer: 1, hint: "\u0422\u044b - normalnie: \u043f\u043b\u0430\u0442\u0438\u0448\u044c" },
      { q: "\u041a\u0443\u043f\u0438\u0442\u044c: \u042f \u043a\u0443\u043f\u043b\u044e. A \u041e\u043d\u0430 ...?", options: ["\u043a\u0443\u043f\u043b\u0438\u0442", "\u043a\u0443\u043f\u0438\u0442", "\u043a\u0443\u043f\u043b\u0451\u0442", "\u043a\u0443\u043f\u0435\u0442"], answer: 1, hint: "\u041e\u043d\u0430 - bez wymiany: \u043a\u0443\u043f\u0438\u0442" },
    ],
  },
  {
    title: "Mieszanka - rozpoznaj wymiane",
    subtitle: "Jaka spolgloska sie zmieni?",
    icon: "\uD83E\uDDE9",
    questions: [
      { q: "\u0421\u0438\u0434\u0435\u0442\u044c (siedziec) \u2192 \u042f \u0441\u0438\u0436\u0443. Jaka wymiana?", options: ["\u0434 \u2192 \u0436", "\u0442 \u2192 \u0447", "\u0441 \u2192 \u0448", "\u0437 \u2192 \u0436"], answer: 0 },
      { q: "\u041e\u0442\u0432\u0435\u0442\u0438\u0442\u044c (odpowiedziec) \u2192 \u042f \u043e\u0442\u0432\u0435\u0447\u0443. Jaka wymiana?", options: ["\u0434 \u2192 \u0436", "\u0442 \u2192 \u0447", "\u0441 \u2192 \u0448", "\u0432 \u2192 \u0432\u043b"], answer: 1 },
      { q: "\u041f\u043e\u043c\u0435\u0441\u0442\u0438\u0442\u044c (umiescic) \u2192 \u042f \u043f\u043e\u043c\u0435\u0449\u0443. Jaka wymiana?", options: ["\u0434 \u2192 \u0436", "\u0437 \u2192 \u0436", "\u0441\u0442 \u2192 \u0449", "\u0442 \u2192 \u0447"], answer: 2 },
      { q: "\u0413\u0440\u0430\u0444\u0438\u0442\u044c (liniowac) \u2192 \u042f \u0433\u0440\u0430\u0444\u043b\u044e. Jaka wymiana?", options: ["\u0431 \u2192 \u0431\u043b", "\u0432 \u2192 \u0432\u043b", "\u043f \u2192 \u043f\u043b", "\u0444 \u2192 \u0444\u043b"], answer: 3, hint: "\u0444 \u2192 \u0444\u043b - to rzadka, ale istniejaca wymiana!" },
      { q: "Ktora z tych form NIE istnieje?", options: ["\u0445\u043e\u0436\u0443", "\u0432\u0438\u0434\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043f\u0438\u0448\u0443"], answer: 1, hint: "\u0432\u0438\u0434\u044e nie istnieje! Poprawnie: \u0432\u0438\u0436\u0443 (\u0434 \u2192 \u0436)" },
      { q: "Ktora forma jest poprawna?", options: ["\u044f \u043f\u0440\u043e\u0441\u044e", "\u044f \u043d\u043e\u0448\u044e", "\u044f \u0432\u043e\u0436\u0443", "\u044f \u043b\u044e\u0431\u044e"], answer: 2, hint: "\u0432\u043e\u0436\u0443 (\u0437 \u2192 \u0436) - poprawne! Reszta: \u043f\u0440\u043e\u0448\u0443, \u043d\u043e\u0448\u0443, \u043b\u044e\u0431\u043b\u044e" },
    ],
  },
  {
    title: "Polskie paralele",
    subtitle: "Porownaj z polskim!",
    icon: "PL",
    questions: [
      { q: "PL: chodzic \u2192 chodze, RU: \u0445\u043e\u0434\u0438\u0442\u044c \u2192 \u0445\u043e\u0436\u0443. Widzisz wzor?", options: ["Tak, dz i \u0434\u2192\u0436", "Tak, oba miekna", "Nie ma zwiazku"], answer: 1, hint: "W obu jezykach spolgloska mieknie w 1. osobie!" },
      { q: "PL: prosic \u2192 prosze. RU: \u043f\u0440\u043e\u0441\u0438\u0442\u044c \u2192 ...?", options: ["\u043f\u0440\u043e\u0441\u044e", "\u043f\u0440\u043e\u0448\u0443", "\u043f\u0440\u043e\u0449\u0443", "\u043f\u0440\u043e\u0436\u0443"], answer: 1, hint: "PL: s\u2192sz, RU: \u0441\u2192\u0448 - identyczna wymiana!" },
      { q: "PL: lubic \u2192 lubie. RU: \u043b\u044e\u0431\u0438\u0442\u044c \u2192 ...?", options: ["\u043b\u044e\u0431\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043b\u044e\u0431\u0438\u044e", "\u043b\u044e\u0431\u043b\u044e"], answer: 1, hint: "PL: b\u2192bi, RU: \u0431\u2192\u0431\u043b - podobne zmiekczenie!" },
      { q: "PL: nosic \u2192 nosze. RU: \u043d\u043e\u0441\u0438\u0442\u044c \u2192 ...?", options: ["\u043d\u043e\u0441\u044e", "\u043d\u043e\u0448\u0443", "\u043d\u043e\u0449\u0443", "\u043d\u043e\u0436\u0443"], answer: 1, hint: "PL: s\u2192sz, RU: \u0441\u2192\u0448 - ta sama wymiana!" },
      { q: "PL: widziec \u2192 widze. RU: \u0432\u0438\u0434\u0435\u0442\u044c \u2192 ...?", options: ["\u0432\u0438\u0434\u044e", "\u0432\u0438\u0436\u0443", "\u0432\u0438\u0434\u0436\u0443", "\u0432\u0438\u0434\u0437\u044e"], answer: 1, hint: "PL: dz, RU: \u0434\u2192\u0436 - ten sam mechanizm!" },
      { q: "PL: kupic \u2192 kupie. RU: \u043a\u0443\u043f\u0438\u0442\u044c \u2192 ...?", options: ["\u043a\u0443\u043f\u044e", "\u043a\u0443\u043f\u043b\u044e", "\u043a\u0443\u043f\u0438\u044e", "\u043a\u0443\u043f\u044e"], answer: 1, hint: "PL: p\u2192pi, RU: \u043f\u2192\u043f\u043b - znowu paralela!" },
    ],
  },
]);

addModule("irregular", "Nieregularne", "chotiet, jest, pit, zyt, mocz - piec najwazniejszych", "core", [
  {
    title: "\u0425\u043e\u0442\u0435\u0442\u044c - chciec",
    subtitle: "Mieszany: l.poj. = I konj., l.mn. = II konj.",
    icon: "\u2764",
    tip: "\u042f \u0445\u043e\u0447\u0443, \u0422\u044b \u0445\u043e\u0447\u0435\u0448\u044c, \u041e\u043d \u0445\u043e\u0447\u0435\u0442, \u041c\u044b \u0445\u043e\u0442\u0438\u043c, \u0412\u044b \u0445\u043e\u0442\u0438\u0442\u0435, \u041e\u043d\u0438 \u0445\u043e\u0442\u044f\u0442",
    questions: [
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u042f ...?", options: ["\u0445\u043e\u0442\u044e", "\u0445\u043e\u0447\u0443", "\u0445\u043e\u0442\u0435\u044e", "\u0445\u043e\u0447\u044e"], answer: 1, hint: "\u0425\u043e\u0447\u0443! Wymiana \u0442\u2192\u0447 + koncowka -\u0443" },
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u0422\u044b ...?", options: ["\u0445\u043e\u0442\u0438\u0448\u044c", "\u0445\u043e\u0447\u0435\u0448\u044c", "\u0445\u043e\u0442\u0435\u0448\u044c", "\u0445\u043e\u0447\u0438\u0448\u044c"], answer: 1, hint: "L.poj. = I konj.: \u0445\u043e\u0447\u0435\u0448\u044c (-\u0435\u0448\u044c)" },
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0445\u043e\u0447\u0435\u0442", "\u0445\u043e\u0442\u0438\u0442", "\u0445\u043e\u0447\u0438\u0442", "\u0445\u043e\u0442\u0435\u0442"], answer: 0, hint: "L.poj. = I konj.: \u0445\u043e\u0447\u0435\u0442 (-\u0435\u0442)" },
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0445\u043e\u0447\u0435\u043c", "\u0445\u043e\u0442\u0435\u043c", "\u0445\u043e\u0442\u0438\u043c", "\u0445\u043e\u0447\u0438\u043c"], answer: 2, hint: "L.mn. = II konj.! \u0445\u043e\u0442\u0438\u043c (-\u0438\u043c)" },
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u0412\u044b ...?", options: ["\u0445\u043e\u0447\u0435\u0442\u0435", "\u0445\u043e\u0442\u0438\u0442\u0435", "\u0445\u043e\u0442\u0435\u0442\u0435", "\u0445\u043e\u0447\u0438\u0442\u0435"], answer: 1, hint: "L.mn. = II konj.! \u0445\u043e\u0442\u0438\u0442\u0435 (-\u0438\u0442\u0435)" },
      { q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0445\u043e\u0447\u0443\u0442", "\u0445\u043e\u0442\u044f\u0442", "\u0445\u043e\u0447\u0430\u0442", "\u0445\u043e\u0442\u0435\u044e\u0442"], answer: 1, hint: "L.mn. = II konj.! \u0445\u043e\u0442\u044f\u0442 (-\u044f\u0442)" },
    ],
  },
  {
    title: "\u0415\u0441\u0442\u044c - jesc",
    subtitle: "L.poj. bez \u0434, l.mn. z \u0434",
    icon: "\u{1F35E}",
    tip: "\u042f \u0435\u043c, \u0422\u044b \u0435\u0448\u044c, \u041e\u043d \u0435\u0441\u0442, \u041c\u044b \u0435\u0434\u0438\u043c, \u0412\u044b \u0435\u0434\u0438\u0442\u0435, \u041e\u043d\u0438 \u0435\u0434\u044f\u0442",
    questions: [
      { q: "\u0415\u0441\u0442\u044c \u2192 \u042f ...?", options: ["\u0435\u0434\u0443", "\u0435\u043c", "\u0435\u0448\u044c", "\u0435\u0441\u0442\u044c\u044e"], answer: 1, hint: "\u0415\u043c! Krotko i wyjatkowo." },
      { q: "\u0415\u0441\u0442\u044c \u2192 \u0422\u044b ...?", options: ["\u0435\u043c", "\u0435\u0434\u0438\u0448\u044c", "\u0435\u0448\u044c", "\u0435\u0441\u0442\u044c"], answer: 2, hint: "\u0415\u0448\u044c - bez \u0434 w l.poj.!" },
      { q: "\u0415\u0441\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0435\u043c", "\u0435\u0434\u0438\u0442", "\u0435\u0441\u0442", "\u0435\u0448\u044c"], answer: 2, hint: "\u0415\u0441\u0442 - wciaz bez \u0434!" },
      { q: "\u0415\u0441\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0435\u043c", "\u0435\u0441\u0442\u0438\u043c", "\u0435\u0434\u0438\u043c", "\u0435\u0448\u0438\u043c"], answer: 2, hint: "\u0415\u0434\u0438\u043c - \u0434 pojawia sie w l.mn.!" },
      { q: "\u0415\u0441\u0442\u044c \u2192 \u0412\u044b ...?", options: ["\u0435\u0441\u0442\u0438\u0442\u0435", "\u0435\u0434\u0438\u0442\u0435", "\u0435\u043c\u0438\u0442\u0435", "\u0435\u0448\u0438\u0442\u0435"], answer: 1, hint: "\u0415\u0434\u0438\u0442\u0435 - z \u0434!" },
      { q: "\u0415\u0441\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0435\u0441\u0442\u044f\u0442", "\u0435\u0434\u0430\u0442", "\u0435\u0434\u044f\u0442", "\u0435\u043c\u044f\u0442"], answer: 2, hint: "\u0415\u0434\u044f\u0442 - z \u0434 i koncowka -\u044f\u0442!" },
    ],
  },
  {
    title: "\u041f\u0438\u0442\u044c - pic",
    subtitle: "Temat: \u043f\u0438- zmienia sie w \u043f\u044c-",
    icon: "\u{1F4A7}",
    tip: "\u042f \u043f\u044c\u044e, \u0422\u044b \u043f\u044c\u0451\u0448\u044c, \u041e\u043d \u043f\u044c\u0451\u0442, \u041c\u044b \u043f\u044c\u0451\u043c, \u0412\u044b \u043f\u044c\u0451\u0442\u0435, \u041e\u043d\u0438 \u043f\u044c\u044e\u0442",
    questions: [
      { q: "\u041f\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043f\u0438\u044e", "\u043f\u044c\u044e", "\u043f\u0438\u0435\u044e", "\u043f\u044c\u0451\u044e"], answer: 1, hint: "\u041f\u044c\u044e! Temat \u043f\u044c- + \u044e" },
      { q: "\u041f\u0438\u0442\u044c \u2192 \u0422\u044b ...?", options: ["\u043f\u0438\u0435\u0448\u044c", "\u043f\u044c\u0451\u0448\u044c", "\u043f\u0438\u0448\u044c", "\u043f\u044c\u0435\u0448\u044c"], answer: 1, hint: "\u041f\u044c\u0451\u0448\u044c! Uwaga na \u0451!" },
      { q: "\u041f\u0438\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u043f\u0438\u0435\u0442", "\u043f\u044c\u0451\u0442", "\u043f\u0438\u0442", "\u043f\u044c\u0435\u0442"], answer: 1, hint: "\u041f\u044c\u0451\u0442!" },
      { q: "\u041f\u0438\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u043f\u0438\u0435\u043c", "\u043f\u044c\u0451\u043c", "\u043f\u0438\u043c", "\u043f\u044c\u0435\u043c"], answer: 1, hint: "\u041f\u044c\u0451\u043c!" },
      { q: "\u041f\u0438\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u043f\u0438\u044e\u0442", "\u043f\u044c\u044e\u0442", "\u043f\u044c\u0451\u0442", "\u043f\u0438\u0435\u044e\u0442"], answer: 1, hint: "\u041f\u044c\u044e\u0442! Ja i Oni maja \u044e, reszta \u0451." },
    ],
  },
  {
    title: "\u0416\u0438\u0442\u044c - zyc/mieszkac",
    subtitle: "Temat: \u0436\u0438- zmienia sie w \u0436\u0438\u0432-",
    icon: "\u{1F3E0}",
    tip: "\u042f \u0436\u0438\u0432\u0443, \u0422\u044b \u0436\u0438\u0432\u0451\u0448\u044c, \u041e\u043d \u0436\u0438\u0432\u0451\u0442, \u041c\u044b \u0436\u0438\u0432\u0451\u043c, \u0412\u044b \u0436\u0438\u0432\u0451\u0442\u0435, \u041e\u043d\u0438 \u0436\u0438\u0432\u0443\u0442",
    questions: [
      { q: "\u0416\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u0436\u0438\u044e", "\u0436\u0438\u0432\u0443", "\u0436\u0438\u0435\u044e", "\u0436\u0438\u0432\u044e"], answer: 1, hint: "\u0416\u0438\u0432\u0443! Pojawia sie \u0432." },
      { q: "\u0416\u0438\u0442\u044c \u2192 \u0422\u044b ...?", options: ["\u0436\u0438\u0435\u0448\u044c", "\u0436\u0438\u0432\u0451\u0448\u044c", "\u0436\u0438\u0448\u044c", "\u0436\u0438\u0432\u0435\u0448\u044c"], answer: 1, hint: "\u0416\u0438\u0432\u0451\u0448\u044c! \u0432 + \u0451" },
      { q: "\u0416\u0438\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0436\u0438\u0432\u0451\u0442", "\u0436\u0438\u0435\u0442", "\u0436\u0438\u0442", "\u0436\u0438\u0432\u0435\u0442"], answer: 0, hint: "\u0416\u0438\u0432\u0451\u0442!" },
      { q: "\u0416\u0438\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0436\u0438\u0435\u043c", "\u0436\u0438\u043c", "\u0436\u0438\u0432\u0451\u043c", "\u0436\u0438\u0432\u0435\u043c"], answer: 2, hint: "\u0416\u0438\u0432\u0451\u043c!" },
      { q: "\u0416\u0438\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0436\u0438\u0432\u0451\u0442", "\u0436\u0438\u0432\u0443\u0442", "\u0436\u0438\u044e\u0442", "\u0436\u0438\u0432\u044f\u0442"], answer: 1, hint: "\u0416\u0438\u0432\u0443\u0442! Ja i Oni maja -\u0443/\u0443\u0442, reszta -\u0451." },
    ],
  },
  {
    title: "\u041c\u043e\u0447\u044c - moc",
    subtitle: "Wymiana \u0433/\u0436: Ja i Oni = \u0433, reszta = \u0436",
    icon: "\u{1F4AA}",
    tip: "\u042f \u043c\u043e\u0433\u0443, \u0422\u044b \u043c\u043e\u0436\u0435\u0448\u044c, \u041e\u043d \u043c\u043e\u0436\u0435\u0442, \u041c\u044b \u043c\u043e\u0436\u0435\u043c, \u0412\u044b \u043c\u043e\u0436\u0435\u0442\u0435, \u041e\u043d\u0438 \u043c\u043e\u0433\u0443\u0442",
    questions: [
      { q: "\u041c\u043e\u0447\u044c \u2192 \u042f ...?", options: ["\u043c\u043e\u0436\u0443", "\u043c\u043e\u0433\u0443", "\u043c\u043e\u0447\u0443", "\u043c\u043e\u0433\u044e"], answer: 1, hint: "\u041c\u043e\u0433\u0443! \u042f = \u0433" },
      { q: "\u041c\u043e\u0447\u044c \u2192 \u0422\u044b ...?", options: ["\u043c\u043e\u0433\u0435\u0448\u044c", "\u043c\u043e\u0436\u0435\u0448\u044c", "\u043c\u043e\u0447\u0435\u0448\u044c", "\u043c\u043e\u0433\u0438\u0448\u044c"], answer: 1, hint: "\u041c\u043e\u0436\u0435\u0448\u044c! Ty/On/My/Vy = \u0436" },
      { q: "\u041c\u043e\u0447\u044c \u2192 \u041e\u043d ...?", options: ["\u043c\u043e\u0433\u0435\u0442", "\u043c\u043e\u0436\u0435\u0442", "\u043c\u043e\u0447\u0435\u0442", "\u043c\u043e\u0433\u0438\u0442"], answer: 1, hint: "\u041c\u043e\u0436\u0435\u0442! \u0436 w srodku" },
      { q: "\u041c\u043e\u0447\u044c \u2192 \u041c\u044b ...?", options: ["\u043c\u043e\u0433\u0435\u043c", "\u043c\u043e\u0436\u0435\u043c", "\u043c\u043e\u0447\u0435\u043c", "\u043c\u043e\u0433\u0438\u043c"], answer: 1, hint: "\u041c\u043e\u0436\u0435\u043c! Wciaz \u0436" },
      { q: "\u041c\u043e\u0447\u044c \u2192 \u0412\u044b ...?", options: ["\u043c\u043e\u0433\u0435\u0442\u0435", "\u043c\u043e\u0436\u0435\u0442\u0435", "\u043c\u043e\u0447\u0435\u0442\u0435", "\u043c\u043e\u0433\u0438\u0442\u0435"], answer: 1, hint: "\u041c\u043e\u0436\u0435\u0442\u0435!" },
      { q: "\u041c\u043e\u0447\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u043c\u043e\u0436\u0443\u0442", "\u043c\u043e\u0433\u0443\u0442", "\u043c\u043e\u0447\u0443\u0442", "\u043c\u043e\u0436\u0430\u0442"], answer: 1, hint: "\u041c\u043e\u0433\u0443\u0442! Oni = \u0433 (jak Ja)" },
    ],
  },
  {
    title: "Mieszanka - wszystkie 5",
    subtitle: "Losowe pytania ze wszystkich",
    icon: "\u{1F3B2}",
    tip: "Przypomnij sobie kazdy osobno i sprobuj!",
    questions: [
      { q: "\u041e\u043d\u0430 ... (\u0445\u043e\u0442\u0435\u0442\u044c) spac.", options: ["\u0445\u043e\u0447\u0435\u0442", "\u0445\u043e\u0442\u0438\u0442", "\u0445\u043e\u0447\u0438\u0442", "\u0445\u043e\u0442\u0435\u0442"], answer: 0 },
      { q: "\u041c\u044b ... (\u0435\u0441\u0442\u044c) obiad.", options: ["\u0435\u043c", "\u0435\u0441\u0442\u0438\u043c", "\u0435\u0434\u0438\u043c", "\u0435\u0448\u0438\u043c"], answer: 2 },
      { q: "\u042f ... (\u043f\u0438\u0442\u044c) kawe.", options: ["\u043f\u0438\u044e", "\u043f\u044c\u044e", "\u043f\u0438\u0435\u044e", "\u043f\u044c\u0451\u044e"], answer: 1 },
      { q: "\u041e\u043d\u0438 ... (\u0436\u0438\u0442\u044c) w Moskwie.", options: ["\u0436\u0438\u0435\u044e\u0442", "\u0436\u0438\u0432\u044f\u0442", "\u0436\u0438\u0432\u0443\u0442", "\u0436\u0438\u044e\u0442"], answer: 2 },
      { q: "\u0422\u044b ... (\u043c\u043e\u0447\u044c) mi pomoc?", options: ["\u043c\u043e\u0433\u0435\u0448\u044c", "\u043c\u043e\u0436\u0435\u0448\u044c", "\u043c\u043e\u0447\u0435\u0448\u044c", "\u043c\u043e\u0433\u0438\u0448\u044c"], answer: 1 },
      { q: "\u041c\u044b \u043d\u0435 ... (\u0445\u043e\u0442\u0435\u0442\u044c) pracowac.", options: ["\u0445\u043e\u0447\u0435\u043c", "\u0445\u043e\u0442\u0435\u043c", "\u0445\u043e\u0442\u0438\u043c", "\u0445\u043e\u0447\u0438\u043c"], answer: 2 },
      { q: "\u0412\u044b ... (\u0435\u0441\u0442\u044c) mieso?", options: ["\u0435\u0441\u0442\u0438\u0442\u0435", "\u0435\u0434\u0438\u0442\u0435", "\u0435\u043c\u0438\u0442\u0435", "\u0435\u0448\u0438\u0442\u0435"], answer: 1 },
      { q: "\u041e\u043d ... (\u043f\u0438\u0442\u044c) herbate.", options: ["\u043f\u0438\u0435\u0442", "\u043f\u044c\u0451\u0442", "\u043f\u0438\u0442", "\u043f\u044c\u0435\u0442"], answer: 1 },
      { q: "\u042f ... (\u0436\u0438\u0442\u044c) w Warszawie.", options: ["\u0436\u0438\u044e", "\u0436\u0438\u0432\u044e", "\u0436\u0438\u0432\u0443", "\u0436\u0438\u0435\u044e"], answer: 2 },
      { q: "\u041e\u043d\u0438 \u043d\u0435 ... (\u043c\u043e\u0447\u044c) przyjsc.", options: ["\u043c\u043e\u0436\u0443\u0442", "\u043c\u043e\u0433\u0443\u0442", "\u043c\u043e\u0447\u0443\u0442", "\u043c\u043e\u0436\u0430\u0442"], answer: 1 },
    ],
  },
]);

addModule("cases", "Przypadki", "Szesc padiezy, trzy rodzaje, zywotnosc w bierniku", "deep", [
  {
    title: "Rozpoznaj przypadek",
    subtitle: "Ktory to padez?",
    icon: "\u{1F50D}",
    questions: [
      { q: "\u041a\u043e\u0442 \u0441\u043f\u0438\u0442. (Kot spi.) \u2192 \u043a\u043e\u0442 to jaki przypadek?", options: ["Mianownik", "Dopelniacz", "Biernik", "Narzednik"], answer: 0, hint: "Kto spi? Kot. \u2192 Mianownik" },
      { q: "\u042f \u0432\u0438\u0436\u0443 \u043a\u043e\u0442\u0430. (Widze kota.) \u2192 \u043a\u043e\u0442\u0430 to?", options: ["Mianownik", "Dopelniacz", "Biernik", "Celownik"], answer: 2, hint: "Widze kogo? Kota. \u2192 Biernik" },
      { q: "\u041d\u0435\u0442 \u043a\u043e\u0442\u0430. (Nie ma kota.) \u2192 \u043a\u043e\u0442\u0430 to?", options: ["Mianownik", "Dopelniacz", "Biernik", "Miejscownik"], answer: 1, hint: "Nie ma kogo? Kota. \u2192 Dopelniacz. Uwaga: biernik i dopelniacz zywotnych wygladaja tak samo!" },
      { q: "\u042f \u0434\u0430\u043b \u043a\u043e\u0442\u0443 \u043c\u043e\u043b\u043e\u043a\u043e. \u2192 \u043a\u043e\u0442\u0443 to?", options: ["Dopelniacz", "Celownik", "Biernik", "Narzednik"], answer: 1, hint: "Dalem komu? Kotu. \u2192 Celownik" },
      { q: "\u042f \u0438\u0434\u0443 \u0441 \u043a\u043e\u0442\u043e\u043c. (Ide z kotem.) \u2192 \u043a\u043e\u0442\u043e\u043c to?", options: ["Celownik", "Biernik", "Narzednik", "Miejscownik"], answer: 2, hint: "Z kim? Z kotem. \u2192 Narzednik" },
      { q: "\u042f \u0434\u0443\u043c\u0430\u044e \u043e \u043a\u043e\u0442\u0435. (Mysle o kocie.) \u2192 \u043a\u043e\u0442\u0435 to?", options: ["Celownik", "Narzednik", "Miejscownik", "Dopelniacz"], answer: 2, hint: "O kim? O kocie. \u2192 Miejscownik" },
    ],
  },
  {
    title: "Rodzaj meski",
    subtitle: "\u043a\u043e\u0442, \u0441\u0443\u043f, \u0433\u043e\u0440\u043e\u0434, \u0431\u0438\u043b\u0435\u0442...",
    icon: "\u2642",
    questions: [
      { q: "\u0423 \u043c\u0435\u043d\u044f \u043d\u0435\u0442 ___ (\u0431\u0438\u043b\u0435\u0442). Dopelniacz.", options: ["\u0431\u0438\u043b\u0435\u0442", "\u0431\u0438\u043b\u0435\u0442\u0430", "\u0431\u0438\u043b\u0435\u0442\u0443", "\u0431\u0438\u043b\u0435\u0442\u043e\u043c"], answer: 1, hint: "R. meski dop. = -\u0430" },
      { q: "\u042f \u0438\u0434\u0443 \u043d\u0430 ___ (\u0432\u043e\u043a\u0437\u0430\u043b). Biernik.", options: ["\u0432\u043e\u043a\u0437\u0430\u043b", "\u0432\u043e\u043a\u0437\u0430\u043b\u0430", "\u0432\u043e\u043a\u0437\u0430\u043b\u0443", "\u0432\u043e\u043a\u0437\u0430\u043b\u043e\u043c"], answer: 0, hint: "Biernik r. meskiego NIEZYWOTNEGO = mianownik!" },
      { q: "\u042f \u0434\u0430\u043b \u0434\u0440\u0443\u0433\u0443 ___ (\u0441\u0443\u043f). Biernik.", options: ["\u0441\u0443\u043f", "\u0441\u0443\u043f\u0430", "\u0441\u0443\u043f\u0443", "\u0441\u0443\u043f\u043e\u043c"], answer: 0, hint: "Sup jest niezywotny \u2192 biernik = mianownik" },
      { q: "\u041c\u044b \u0433\u043e\u0432\u043e\u0440\u0438\u043c \u043e ___ (\u0433\u043e\u0440\u043e\u0434). Miejscownik.", options: ["\u0433\u043e\u0440\u043e\u0434", "\u0433\u043e\u0440\u043e\u0434\u0430", "\u0433\u043e\u0440\u043e\u0434\u0443", "\u0433\u043e\u0440\u043e\u0434\u0435"], answer: 3, hint: "R. meski miejscownik = -\u0435" },
      { q: "\u042f \u0435\u043c \u0441\u0443\u043f \u0441 ___ (\u0445\u043b\u0435\u0431). Narzednik.", options: ["\u0445\u043b\u0435\u0431", "\u0445\u043b\u0435\u0431\u0430", "\u0445\u043b\u0435\u0431\u043e\u043c", "\u0445\u043b\u0435\u0431\u0435"], answer: 2, hint: "R. meski narzednik = -\u043e\u043c" },
      { q: "\u041e\u043d \u0434\u0430\u043b ___ (\u043a\u043e\u0442) \u043c\u043e\u043b\u043e\u043a\u043e. Celownik.", options: ["\u043a\u043e\u0442", "\u043a\u043e\u0442\u0430", "\u043a\u043e\u0442\u0443", "\u043a\u043e\u0442\u043e\u043c"], answer: 2, hint: "R. meski celownik = -\u0443" },
      { q: "\u042f \u0432\u0438\u0436\u0443 ___ (\u043a\u043e\u0442). Biernik.", options: ["\u043a\u043e\u0442", "\u043a\u043e\u0442\u0430", "\u043a\u043e\u0442\u0443", "\u043a\u043e\u0442\u043e\u043c"], answer: 1, hint: "Kot jest zywotny \u2192 biernik = dopelniacz = -\u0430!" },
    ],
  },
  {
    title: "Rodzaj zenski",
    subtitle: "\u043a\u043d\u0438\u0433\u0430, \u0432\u043e\u0434\u0430, \u0440\u044b\u0431\u0430, \u043a\u0430\u0440\u0442\u0430...",
    icon: "\u2640",
    questions: [
      { q: "\u042f \u0447\u0438\u0442\u0430\u044e ___ (\u043a\u043d\u0438\u0433\u0430). Biernik.", options: ["\u043a\u043d\u0438\u0433\u0430", "\u043a\u043d\u0438\u0433\u0438", "\u043a\u043d\u0438\u0433\u0443", "\u043a\u043d\u0438\u0433\u043e\u0439"], answer: 2, hint: "R. zenski biernik: -\u0430 \u2192 -\u0443" },
      { q: "\u041d\u0435\u0442 ___ (\u0432\u043e\u0434\u0430). Dopelniacz.", options: ["\u0432\u043e\u0434\u0430", "\u0432\u043e\u0434\u044b", "\u0432\u043e\u0434\u0443", "\u0432\u043e\u0434\u043e\u0439"], answer: 1, hint: "R. zenski dop.: -\u0430 \u2192 -\u044b" },
      { q: "\u042f \u043b\u044e\u0431\u043b\u044e ___ (\u0440\u044b\u0431\u0430). Biernik.", options: ["\u0440\u044b\u0431\u0430", "\u0440\u044b\u0431\u044b", "\u0440\u044b\u0431\u0443", "\u0440\u044b\u0431\u043e\u0439"], answer: 2, hint: "Biernik: -\u0430 \u2192 -\u0443" },
      { q: "\u041c\u043e\u0436\u043d\u043e ___ (\u043a\u0430\u0440\u0442\u0430)? Biernik.", options: ["\u043a\u0430\u0440\u0442\u0430", "\u043a\u0430\u0440\u0442\u044b", "\u043a\u0430\u0440\u0442\u0443", "\u043a\u0430\u0440\u0442\u043e\u0439"], answer: 2 },
      { q: "\u041c\u044b \u0436\u0438\u0432\u0451\u043c \u0432 ___ (\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430). Miejscownik.", options: ["\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430", "\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u044b", "\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0443", "\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435"], answer: 3, hint: "R. zenski miejscownik: -\u0430 \u2192 -\u0435" },
      { q: "\u042f \u0435\u043c \u0441\u0443\u043f \u0441 ___ (\u043a\u0443\u0440\u0438\u0446\u0430). Narzednik.", options: ["\u043a\u0443\u0440\u0438\u0446\u0430", "\u043a\u0443\u0440\u0438\u0446\u044b", "\u043a\u0443\u0440\u0438\u0446\u0443", "\u043a\u0443\u0440\u0438\u0446\u0435\u0439"], answer: 3, hint: "R. zenski narzednik: -\u0430 \u2192 -\u043e\u0439 (po \u0446 = -\u0435\u0439)" },
      { q: "\u042f \u0434\u0430\u043b \u043c\u043e\u043b\u043e\u043a\u043e ___ (\u043a\u0443\u0440\u0438\u0446\u0430). Celownik.", options: ["\u043a\u0443\u0440\u0438\u0446\u0430", "\u043a\u0443\u0440\u0438\u0446\u044b", "\u043a\u0443\u0440\u0438\u0446\u0435", "\u043a\u0443\u0440\u0438\u0446\u0443"], answer: 2, hint: "R. zenski celownik: -\u0430 \u2192 -\u0435" },
    ],
  },
  {
    title: "Rodzaj nijaki",
    subtitle: "\u043c\u043e\u043b\u043e\u043a\u043e, \u043e\u043a\u043d\u043e, \u043c\u044f\u0441\u043e, \u044f\u0439\u0446\u043e...",
    icon: "\u25cb",
    questions: [
      { q: "\u041d\u0435\u0442 ___ (\u043c\u043e\u043b\u043e\u043a\u043e). Dopelniacz.", options: ["\u043c\u043e\u043b\u043e\u043a\u043e", "\u043c\u043e\u043b\u043e\u043a\u0430", "\u043c\u043e\u043b\u043e\u043a\u0443", "\u043c\u043e\u043b\u043e\u043a\u043e\u043c"], answer: 1, hint: "R. nijaki dop.: -\u043e \u2192 -\u0430 (jak meski!)" },
      { q: "\u042f \u043f\u044c\u044e ___ (\u043c\u043e\u043b\u043e\u043a\u043e). Biernik.", options: ["\u043c\u043e\u043b\u043e\u043a\u043e", "\u043c\u043e\u043b\u043e\u043a\u0430", "\u043c\u043e\u043b\u043e\u043a\u0443", "\u043c\u043e\u043b\u043e\u043a\u043e\u043c"], answer: 0, hint: "Biernik nijakiego = mianownik!" },
      { q: "\u042f \u0441\u043c\u043e\u0442\u0440\u044e \u0432 ___ (\u043e\u043a\u043d\u043e). Biernik.", options: ["\u043e\u043a\u043d\u043e", "\u043e\u043a\u043d\u0430", "\u043e\u043a\u043d\u0443", "\u043e\u043a\u043d\u0435"], answer: 0 },
      { q: "\u042f \u0435\u043c \u0441\u0443\u043f \u0441 ___ (\u044f\u0439\u0446\u043e). Narzednik.", options: ["\u044f\u0439\u0446\u043e", "\u044f\u0439\u0446\u0430", "\u044f\u0439\u0446\u043e\u043c", "\u044f\u0439\u0446\u0435"], answer: 2, hint: "R. nijaki narzednik: -\u043e \u2192 -\u043e\u043c" },
      { q: "\u0412 ___ (\u043c\u044f\u0441\u043e) \u043c\u043d\u043e\u0433\u043e \u0431\u0435\u043b\u043a\u0430. Miejscownik.", options: ["\u043c\u044f\u0441\u043e", "\u043c\u044f\u0441\u0430", "\u043c\u044f\u0441\u0443", "\u043c\u044f\u0441\u0435"], answer: 3, hint: "R. nijaki miejscownik: -\u043e \u2192 -\u0435" },
    ],
  },
  {
    title: "Zywotny czy nie?",
    subtitle: "Biernik: kluczowa zasada",
    icon: "\u{1F431}",
    questions: [
      { q: "\u042f \u0432\u0438\u0436\u0443 ___ (\u043a\u043e\u0442). Zywotny!", options: ["\u043a\u043e\u0442", "\u043a\u043e\u0442\u0430", "\u043a\u043e\u0442\u0443", "\u043a\u043e\u0442\u043e\u043c"], answer: 1, hint: "Zywotny r. meski: biernik = dopelniacz (-\u0430)" },
      { q: "\u042f \u0432\u0438\u0436\u0443 ___ (\u0441\u0442\u043e\u043b). Niezywotny!", options: ["\u0441\u0442\u043e\u043b", "\u0441\u0442\u043e\u043b\u0430", "\u0441\u0442\u043e\u043b\u0443", "\u0441\u0442\u043e\u043b\u043e\u043c"], answer: 0, hint: "Niezywotny r. meski: biernik = mianownik" },
      { q: "\u042f \u0435\u043c ___ (\u0441\u0443\u043f). Niezywotny!", options: ["\u0441\u0443\u043f", "\u0441\u0443\u043f\u0430", "\u0441\u0443\u043f\u0443", "\u0441\u0443\u043f\u043e\u043c"], answer: 0 },
      { q: "\u042f \u043b\u044e\u0431\u043b\u044e ___ (\u043a\u0443\u0440\u0438\u0446\u0430). Zywotna!", options: ["\u043a\u0443\u0440\u0438\u0446\u0430", "\u043a\u0443\u0440\u0438\u0446\u044b", "\u043a\u0443\u0440\u0438\u0446\u0443", "\u043a\u0443\u0440\u0438\u0446\u0435\u0439"], answer: 2, hint: "R. zenski biernik ZAWSZE -\u0443 (niezaleznie od zywotnosci)" },
      { q: "\u042f \u0447\u0438\u0442\u0430\u044e ___ (\u043a\u043d\u0438\u0433\u0430). Niezywotna!", options: ["\u043a\u043d\u0438\u0433\u0430", "\u043a\u043d\u0438\u0433\u044b", "\u043a\u043d\u0438\u0433\u0443", "\u043a\u043d\u0438\u0433\u043e\u0439"], answer: 2, hint: "R. zenski biernik zawsze -\u0443!" },
      { q: "\u042f \u043f\u044c\u044e ___ (\u0432\u043e\u0434\u0430).", options: ["\u0432\u043e\u0434\u0430", "\u0432\u043e\u0434\u044b", "\u0432\u043e\u0434\u0443", "\u0432\u043e\u0434\u043e\u0439"], answer: 2 },
    ],
  },
  {
    title: "Mieszanka - wszystkie przypadki",
    subtitle: "Zdania z roznymi rodzajami",
    icon: "\u{1F9E9}",
    questions: [
      { q: "\u042f \u0445\u043e\u0447\u0443 ___ (\u0441\u0443\u043f).", options: ["\u0441\u0443\u043f", "\u0441\u0443\u043f\u0430", "\u0441\u0443\u043f\u0443", "\u0441\u0443\u043f\u043e\u043c"], answer: 0, hint: "Chce co? Zupe. Biernik niezywotny = mianownik" },
      { q: "\u041e\u043d\u0430 \u0436\u0438\u0432\u0451\u0442 \u0432 ___ (\u041c\u043e\u0441\u043a\u0432\u0430).", options: ["\u041c\u043e\u0441\u043a\u0432\u0430", "\u041c\u043e\u0441\u043a\u0432\u044b", "\u041c\u043e\u0441\u043a\u0432\u0443", "\u041c\u043e\u0441\u043a\u0432\u0435"], answer: 3, hint: "W czym? Miejscownik: -\u0430 \u2192 -\u0435" },
      { q: "\u042f \u043f\u044c\u044e \u043a\u043e\u0444\u0435 \u0441 ___ (\u043c\u043e\u043b\u043e\u043a\u043e).", options: ["\u043c\u043e\u043b\u043e\u043a\u043e", "\u043c\u043e\u043b\u043e\u043a\u0430", "\u043c\u043e\u043b\u043e\u043a\u0443", "\u043c\u043e\u043b\u043e\u043a\u043e\u043c"], answer: 3, hint: "Z czym? Narzednik: -\u043e \u2192 -\u043e\u043c" },
      { q: "\u0413\u0434\u0435 ___ (\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430)?", options: ["\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430", "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0438", "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0443", "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0435"], answer: 0, hint: "Gdzie jest co? Mianownik!" },
      { q: "\u042f \u0438\u0434\u0443 \u043d\u0430 ___ (\u0443\u043b\u0438\u0446\u0430).", options: ["\u0443\u043b\u0438\u0446\u0430", "\u0443\u043b\u0438\u0446\u044b", "\u0443\u043b\u0438\u0446\u0443", "\u0443\u043b\u0438\u0446\u0435"], answer: 2, hint: "Ide na co? Biernik: -\u0430 \u2192 -\u0443" },
      { q: "\u041d\u0435\u0442 ___ (\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d) \u0437\u0434\u0435\u0441\u044c.", options: ["\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d", "\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0430", "\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0443", "\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0435"], answer: 1, hint: "Nie ma czego? Dopelniacz: -\u0430" },
      { q: "\u041e\u043d \u0434\u0430\u043b ___ (\u0436\u0435\u043d\u0430) \u0446\u0432\u0435\u0442\u044b.", options: ["\u0436\u0435\u043d\u0430", "\u0436\u0435\u043d\u044b", "\u0436\u0435\u043d\u0443", "\u0436\u0435\u043d\u0435"], answer: 3, hint: "Dal komu? Zonie. Celownik: -\u0430 \u2192 -\u0435" },
      { q: "\u041c\u044b \u0433\u043e\u0432\u043e\u0440\u0438\u043c \u043e ___ (\u043f\u043e\u0433\u043e\u0434\u0430).", options: ["\u043f\u043e\u0433\u043e\u0434\u0430", "\u043f\u043e\u0433\u043e\u0434\u044b", "\u043f\u043e\u0433\u043e\u0434\u0443", "\u043f\u043e\u0433\u043e\u0434\u0435"], answer: 3, hint: "O czym? Miejscownik: -\u0430 \u2192 -\u0435" },
    ],
  },
]);

addModule("pronouns", "Zaimki", "Osobowe, dzierzawcze i zasada n- po przyimku", "deep", [
  {
    title: "Zaimki osobowe - Mian. i Dop.",
    subtitle: "\u044f/\u043c\u0435\u043d\u044f, \u0442\u044b/\u0442\u0435\u0431\u044f...",
    icon: "\u{1F464}",
    questions: [
      { q: "\u041e\u043d \u0437\u043d\u0430\u0435\u0442 ___ (\u044f). Dop.", options: ["\u044f", "\u043c\u0435\u043d\u044f", "\u043c\u043d\u0435", "\u043c\u043d\u043e\u0439"], answer: 1, hint: "\u041c\u0435\u043d\u044f = mnie (kogo?)" },
      { q: "\u042f \u0432\u0438\u0436\u0443 ___ (\u0442\u044b). Bier.", options: ["\u0442\u044b", "\u0442\u0435\u0431\u044f", "\u0442\u0435\u0431\u0435", "\u0442\u043e\u0431\u043e\u0439"], answer: 1, hint: "Biernik osobowy = dopelniacz: \u0442\u0435\u0431\u044f" },
      { q: "\u042f \u043b\u044e\u0431\u043b\u044e ___ (\u043e\u043d\u0430).", options: ["\u043e\u043d\u0430", "\u0435\u0439", "\u0435\u0451", "\u043d\u0435\u0439"], answer: 2, hint: "\u0415\u0451 = jej (kogo? co?). Bez przyimka \u2192 bez \u043d-!" },
      { q: "\u0423 ___ (\u043e\u043d) \u0435\u0441\u0442\u044c \u043a\u043e\u0442.", options: ["\u0435\u0433\u043e", "\u043d\u0435\u0433\u043e", "\u0435\u043c\u0443", "\u043d\u0435\u043c\u0443"], answer: 1, hint: "Po przyimku \u0443 \u2192 \u043d\u0435\u0433\u043e! (nie \u0435\u0433\u043e)" },
      { q: "\u041e\u043d \u043d\u0435 \u0437\u043d\u0430\u0435\u0442 ___ (\u043c\u044b).", options: ["\u043c\u044b", "\u043d\u0430\u0441", "\u043d\u0430\u043c", "\u043d\u0430\u043c\u0438"], answer: 1, hint: "\u041d\u0430\u0441 = nas (kogo?)" },
      { q: "\u042f \u0441\u043b\u044b\u0448\u0443 ___ (\u0432\u044b).", options: ["\u0432\u044b", "\u0432\u0430\u0441", "\u0432\u0430\u043c", "\u0432\u0430\u043c\u0438"], answer: 1, hint: "\u0412\u0430\u0441 = was" },
      { q: "\u0423 ___ (\u043e\u043d\u0438) \u0435\u0441\u0442\u044c \u0434\u043e\u043c.", options: ["\u0438\u0445", "\u043d\u0438\u0445", "\u0438\u043c", "\u043d\u0438\u043c"], answer: 1, hint: "Po przyimku \u2192 \u043d\u0438\u0445!" },
    ],
  },
  {
    title: "Celownik i Narzednik",
    subtitle: "\u043c\u043d\u0435/\u043c\u043d\u043e\u0439, \u0442\u0435\u0431\u0435/\u0442\u043e\u0431\u043e\u0439...",
    icon: "\u{1F91D}",
    questions: [
      { q: "\u041e\u043d \u0434\u0430\u043b ___ (\u044f) \u043a\u043d\u0438\u0433\u0443. Cel.", options: ["\u043c\u0435\u043d\u044f", "\u043c\u043d\u0435", "\u043c\u043d\u043e\u0439", "\u044f"], answer: 1, hint: "\u041c\u043d\u0435 = mnie (komu?)" },
      { q: "\u042f \u0438\u0434\u0443 \u0441 ___ (\u0442\u044b). Narz.", options: ["\u0442\u0435\u0431\u044f", "\u0442\u0435\u0431\u0435", "\u0442\u043e\u0431\u043e\u0439", "\u0442\u044b"], answer: 2, hint: "\u0422\u043e\u0431\u043e\u0439 = toba (z kim?)" },
      { q: "\u041f\u043e\u0437\u0432\u043e\u043d\u0438 ___ (\u043e\u043d\u0430). Cel.", options: ["\u0435\u0451", "\u0435\u0439", "\u043d\u0435\u0439", "\u043d\u0435\u0451"], answer: 1, hint: "\u0415\u0439 = jej (komu?). Bez przyimka \u2192 bez \u043d-!" },
      { q: "\u041c\u044b \u0433\u043e\u0432\u043e\u0440\u0438\u043c \u0441 ___ (\u043e\u043d\u0438). Narz.", options: ["\u0438\u043c\u0438", "\u043d\u0438\u043c\u0438", "\u0438\u0445", "\u043d\u0438\u0445"], answer: 1, hint: "Po przyimku \u0441 \u2192 \u043d\u0438\u043c\u0438!" },
      { q: "\u0414\u0430\u0439 ___ (\u043c\u044b) \u0432\u043e\u0434\u0443. Cel.", options: ["\u043d\u0430\u0441", "\u043d\u0430\u043c", "\u043d\u0430\u043c\u0438", "\u043c\u044b"], answer: 1, hint: "\u041d\u0430\u043c = nam (komu?)" },
      { q: "\u042f \u0440\u0430\u0431\u043e\u0442\u0430\u044e \u0441 ___ (\u043e\u043d). Narz.", options: ["\u0435\u0433\u043e", "\u0435\u043c\u0443", "\u0438\u043c", "\u043d\u0438\u043c"], answer: 3, hint: "Po przyimku \u0441 \u2192 \u043d\u0438\u043c!" },
      { q: "\u041f\u043e\u043c\u043e\u0433\u0438 ___ (\u044f). Cel.", options: ["\u043c\u0435\u043d\u044f", "\u043c\u043d\u0435", "\u043c\u043d\u043e\u0439", "\u044f"], answer: 1, hint: "Pomoz komu? \u041c\u043d\u0435!" },
    ],
  },
  {
    title: "Miejscownik",
    subtitle: "\u043e\u0431\u043e \u043c\u043d\u0435, \u043e \u0442\u0435\u0431\u0435, \u043e \u043d\u0451\u043c...",
    icon: "\u{1F4CD}",
    questions: [
      { q: "\u041e\u043d \u0434\u0443\u043c\u0430\u0435\u0442 \u043e ___ (\u044f).", options: ["\u043c\u043d\u0435", "\u043c\u0435\u043d\u044f", "\u043c\u043d\u043e\u0439", "\u044f"], answer: 0, hint: "\u041e\u0431\u043e \u043c\u043d\u0435 = o mnie" },
      { q: "\u042f \u0434\u0443\u043c\u0430\u044e \u043e ___ (\u0442\u044b).", options: ["\u0442\u0435\u0431\u044f", "\u0442\u0435\u0431\u0435", "\u0442\u043e\u0431\u043e\u0439", "\u0442\u044b"], answer: 1, hint: "\u041e \u0442\u0435\u0431\u0435 = o tobie" },
      { q: "\u041c\u044b \u0433\u043e\u0432\u043e\u0440\u0438\u043c \u043e ___ (\u043e\u043d).", options: ["\u0435\u0433\u043e", "\u0435\u043c\u0443", "\u043d\u0451\u043c", "\u0438\u043c"], answer: 2, hint: "Po przyimku \u043e \u2192 \u043e \u043d\u0451\u043c!" },
      { q: "\u041e\u043d\u0438 \u0433\u043e\u0432\u043e\u0440\u044f\u0442 \u043e ___ (\u043e\u043d\u0430).", options: ["\u0435\u0451", "\u0435\u0439", "\u043d\u0435\u0439", "\u043d\u0435\u0451"], answer: 2, hint: "Po przyimku \u2192 \u043e \u043d\u0435\u0439!" },
      { q: "\u041e\u043d \u0441\u043f\u0440\u043e\u0441\u0438\u043b \u043e ___ (\u043c\u044b).", options: ["\u043d\u0430\u0441", "\u043d\u0430\u043c", "\u043d\u0430\u043c\u0438", "\u043c\u044b"], answer: 0, hint: "\u041e \u043d\u0430\u0441 = o nas" },
      { q: "\u042f \u0434\u0443\u043c\u0430\u044e \u043e ___ (\u043e\u043d\u0438).", options: ["\u0438\u0445", "\u043d\u0438\u0445", "\u0438\u043c\u0438", "\u043d\u0438\u043c\u0438"], answer: 1, hint: "Po przyimku \u2192 \u043e \u043d\u0438\u0445!" },
    ],
  },
  {
    title: "Dzierzawcze: moj/twoj/nasz",
    subtitle: "\u043c\u043e\u0439/\u043c\u043e\u044f/\u043c\u043e\u0451/\u043c\u043e\u0438",
    icon: "\u{1F3E0}",
    questions: [
      { q: "\u042d\u0442\u043e ___ \u043a\u043e\u0442. (moj, r.m.)", options: ["\u043c\u043e\u044f", "\u043c\u043e\u0439", "\u043c\u043e\u0451", "\u043c\u043e\u0438"], answer: 1, hint: "\u041a\u043e\u0442 = r. meski \u2192 \u043c\u043e\u0439" },
      { q: "\u042d\u0442\u043e ___ \u043a\u043d\u0438\u0433\u0430. (moja, r.z.)", options: ["\u043c\u043e\u0439", "\u043c\u043e\u044f", "\u043c\u043e\u0451", "\u043c\u043e\u0438"], answer: 1, hint: "\u041a\u043d\u0438\u0433\u0430 = r. zenski \u2192 \u043c\u043e\u044f" },
      { q: "\u042d\u0442\u043e ___ \u043e\u043a\u043d\u043e. (moje, r.n.)", options: ["\u043c\u043e\u0439", "\u043c\u043e\u044f", "\u043c\u043e\u0451", "\u043c\u043e\u0438"], answer: 2, hint: "\u041e\u043a\u043d\u043e = r. nijaki \u2192 \u043c\u043e\u0451" },
      { q: "\u042d\u0442\u043e ___ \u0434\u0440\u0443\u0437\u044c\u044f. (moi, l.mn.)", options: ["\u043c\u043e\u0439", "\u043c\u043e\u044f", "\u043c\u043e\u0451", "\u043c\u043e\u0438"], answer: 3 },
      { q: "\u042d\u0442\u043e ___ \u0434\u043e\u043c. (nasz)", options: ["\u043d\u0430\u0448", "\u043d\u0430\u0448\u0430", "\u043d\u0430\u0448\u0435", "\u043d\u0430\u0448\u0438"], answer: 0, hint: "\u0414\u043e\u043c = r. meski \u2192 \u043d\u0430\u0448" },
      { q: "\u042d\u0442\u043e ___ \u0441\u0435\u043c\u044c\u044f. (nasza)", options: ["\u043d\u0430\u0448", "\u043d\u0430\u0448\u0430", "\u043d\u0430\u0448\u0435", "\u043d\u0430\u0448\u0438"], answer: 1 },
      { q: "___ \u043a\u043e\u0442 \u043e\u0447\u0435\u043d\u044c \u043a\u0440\u0430\u0441\u0438\u0432\u044b\u0439. (jej)", options: ["\u0435\u0433\u043e", "\u0435\u0451", "\u0438\u0445", "\u0441\u0432\u043e\u0439"], answer: 1, hint: "\u0415\u0451 \u2192 nie odmienia sie! Zawsze \u0435\u0451." },
      { q: "___ \u0434\u043e\u043c \u043e\u0447\u0435\u043d\u044c \u0431\u043e\u043b\u044c\u0448\u043e\u0439. (ich)", options: ["\u0435\u0433\u043e", "\u0435\u0451", "\u0438\u0445", "\u043d\u0438\u0445"], answer: 2, hint: "\u0418\u0445 \u2192 nie odmienia sie! Zawsze \u0438\u0445." },
    ],
  },
  {
    title: "\u041d- czy bez \u043d-?",
    subtitle: "Kluczowa zasada!",
    icon: "\u{26A0}",
    questions: [
      { q: "\u042f \u0432\u0438\u0436\u0443 ___. (on)", options: ["\u0435\u0433\u043e", "\u043d\u0435\u0433\u043e"], answer: 0, hint: "Bez przyimka \u2192 \u0435\u0433\u043e" },
      { q: "\u0423 ___ \u0435\u0441\u0442\u044c \u0431\u0438\u043b\u0435\u0442. (on)", options: ["\u0435\u0433\u043e", "\u043d\u0435\u0433\u043e"], answer: 1, hint: "Po przyimku \u0443 \u2192 \u043d\u0435\u0433\u043e!" },
      { q: "\u042f \u043b\u044e\u0431\u043b\u044e ___. (ona)", options: ["\u0435\u0451", "\u043d\u0435\u0451"], answer: 0, hint: "Bez przyimka \u2192 \u0435\u0451" },
      { q: "\u041a ___ \u043f\u0440\u0438\u0448\u043b\u0438 \u0433\u043e\u0441\u0442\u0438. (ona)", options: ["\u0435\u0439", "\u043d\u0435\u0439"], answer: 1, hint: "Po przyimku \u043a \u2192 \u043d\u0435\u0439!" },
      { q: "\u042f \u0437\u043d\u0430\u044e ___. (oni)", options: ["\u0438\u0445", "\u043d\u0438\u0445"], answer: 0, hint: "Bez przyimka \u2192 \u0438\u0445" },
      { q: "\u041c\u044b \u0438\u0434\u0451\u043c \u043a ___. (oni)", options: ["\u0438\u043c", "\u043d\u0438\u043c"], answer: 1, hint: "Po przyimku \u043a \u2192 \u043d\u0438\u043c!" },
      { q: "\u042f \u0434\u0443\u043c\u0430\u044e \u043e ___. (on)", options: ["\u043d\u0435\u043c", "\u043d\u0451\u043c", "\u0435\u043c", "\u0435\u0433\u043e"], answer: 1, hint: "Po przyimku \u043e \u2192 \u043e \u043d\u0451\u043c!" },
      { q: "\u0421\u043f\u0440\u043e\u0441\u0438 ___. (oni) Bez przyimka!", options: ["\u0438\u0445", "\u043d\u0438\u0445", "\u0438\u043c", "\u043d\u0438\u043c"], answer: 0, hint: "Spytaj kogo? Bez przyimka \u2192 \u0438\u0445" },
    ],
  },
  {
    title: "Mieszanka - zdania",
    subtitle: "Wszystko razem!",
    icon: "\u{1F9E9}",
    questions: [
      { q: "\u041f\u043e\u0437\u0432\u043e\u043d\u0438 ___ (\u044f) \u0437\u0430\u0432\u0442\u0440\u0430.", options: ["\u043c\u0435\u043d\u044f", "\u043c\u043d\u0435", "\u043c\u043d\u043e\u0439", "\u044f"], answer: 1, hint: "Zadzwon komu? Celownik: \u043c\u043d\u0435" },
      { q: "\u042d\u0442\u043e ___ (\u0442\u0432\u043e\u0439) \u043a\u043e\u0444\u0435?", options: ["\u0442\u0432\u043e\u0439", "\u0442\u0432\u043e\u044f", "\u0442\u0432\u043e\u0451", "\u0442\u0432\u043e\u0438"], answer: 0, hint: "\u041a\u043e\u0444\u0435 = r. meski \u2192 \u0442\u0432\u043e\u0439" },
      { q: "\u041e\u043d\u0430 \u0434\u0430\u043b\u0430 ___ (\u043c\u044b) \u043a\u0430\u0440\u0442\u0443.", options: ["\u043d\u0430\u0441", "\u043d\u0430\u043c", "\u043d\u0430\u043c\u0438", "\u043c\u044b"], answer: 1, hint: "Dala komu? Nam. Celownik: \u043d\u0430\u043c" },
      { q: "\u042f \u0445\u043e\u0447\u0443 \u0435\u0445\u0430\u0442\u044c \u0441 ___ (\u0442\u044b).", options: ["\u0442\u0435\u0431\u044f", "\u0442\u0435\u0431\u0435", "\u0442\u043e\u0431\u043e\u0439", "\u0442\u044b"], answer: 2, hint: "Z kim? Narzednik: \u0442\u043e\u0431\u043e\u0439" },
      { q: "\u0423 ___ (\u043e\u043d\u0430) \u0435\u0441\u0442\u044c \u0431\u0438\u043b\u0435\u0442.", options: ["\u0435\u0451", "\u043d\u0435\u0451", "\u0435\u0439", "\u043d\u0435\u0439"], answer: 1, hint: "Po przyimku \u0443 \u2192 \u043d\u0435\u0451!" },
      { q: "___ (\u043d\u0430\u0448) \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430 \u043e\u0447\u0435\u043d\u044c \u0445\u043e\u0440\u043e\u0448\u0430\u044f.", options: ["\u043d\u0430\u0448", "\u043d\u0430\u0448\u0430", "\u043d\u0430\u0448\u0435", "\u043d\u0430\u0448\u0438"], answer: 1, hint: "\u0413\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430 = r. zenski \u2192 \u043d\u0430\u0448\u0430" },
      { q: "\u042d\u0442\u043e ___ (\u0435\u0433\u043e) \u044f\u0431\u043b\u043e\u043a\u043e.", options: ["\u0435\u0433\u043e", "\u0435\u043c\u0443", "\u043d\u0435\u0433\u043e", "\u0441\u0432\u043e\u0439"], answer: 0, hint: "\u0415\u0433\u043e (dzierzawcze) nie zmienia sie i nie dodaje \u043d-!" },
      { q: "\u041e\u043d \u0440\u0430\u0441\u0441\u043a\u0430\u0437\u0430\u043b ___ (\u0432\u044b) \u043e ___ (\u043e\u043d\u0438).", options: ["\u0432\u0430\u043c / \u043d\u0438\u0445", "\u0432\u0430\u0441 / \u0438\u0445", "\u0432\u0430\u043c / \u0438\u0445", "\u0432\u0430\u0441 / \u043d\u0438\u0445"], answer: 0, hint: "Opowiedzial komu? \u0432\u0430\u043c (cel.) O kim? \u043e \u043d\u0438\u0445 (miejscownik + przyimek)" },
    ],
  },
]);

addModule("numbers", "Liczebniki", "Od 1 do 1000, wyjatki sorok i diewianosto", "deep", [
  {
    title: "1-10",
    subtitle: "Podstawy",
    icon: "1",
    questions: [
      { q: "Jak powiedziec '1' po rosyjsku?", options: ["\u043e\u0434\u0438\u043d", "\u043e\u0434\u043d\u0430", "\u043f\u0435\u0440\u0432\u044b\u0439", "\u0440\u0430\u0437"], answer: 0 },
      { q: "Jak powiedziec '3'?", options: ["\u0434\u0432\u0430", "\u0442\u0440\u0438", "\u0442\u0440\u043e\u0435", "\u0442\u0440\u0435\u0442\u0438\u0439"], answer: 1 },
      { q: "Jak powiedziec '5'?", options: ["\u0447\u0435\u0442\u044b\u0440\u0435", "\u043f\u044f\u0442\u044c", "\u0448\u0435\u0441\u0442\u044c", "\u0441\u0435\u043c\u044c"], answer: 1 },
      { q: "Jak powiedziec '7'?", options: ["\u0448\u0435\u0441\u0442\u044c", "\u0441\u0435\u043c\u044c", "\u0432\u043e\u0441\u0435\u043c\u044c", "\u0434\u0435\u0432\u044f\u0442\u044c"], answer: 1 },
      { q: "Co to jest \u0434\u0435\u0432\u044f\u0442\u044c?", options: ["7", "8", "9", "10"], answer: 2 },
      { q: "Co to jest \u0447\u0435\u0442\u044b\u0440\u0435?", options: ["3", "4", "5", "6"], answer: 1 },
      { q: "Co to jest \u0432\u043e\u0441\u0435\u043c\u044c?", options: ["6", "7", "8", "9"], answer: 2 },
      { q: "Co to jest \u0434\u0435\u0441\u044f\u0442\u044c?", options: ["8", "9", "10", "11"], answer: 2 },
    ],
  },
  {
    title: "11-19",
    subtitle: "\u043e\u0434\u0438\u043d\u043d\u0430\u0434\u0446\u0430\u0442\u044c...",
    icon: "11",
    questions: [
      { q: "Jak powiedziec '11'?", options: ["\u043e\u0434\u0438\u043d\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0432\u0435\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0435\u0441\u044f\u0442\u044c", "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c"], answer: 0 },
      { q: "Jak powiedziec '12'?", options: ["\u043e\u0434\u0438\u043d\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0432\u0435\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0442\u0440\u0438\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c"], answer: 1 },
      { q: "Co to jest \u043f\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c?", options: ["13", "14", "15", "16"], answer: 2 },
      { q: "Co to jest \u0441\u0435\u043c\u043d\u0430\u0434\u0446\u0430\u0442\u044c?", options: ["15", "16", "17", "18"], answer: 2 },
      { q: "Jak powiedziec '19'?", options: ["\u0432\u043e\u0441\u0435\u043c\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0435\u0432\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e", "\u0434\u0435\u0432\u044f\u0442\u044c"], answer: 1 },
      { q: "Co to jest \u0447\u0435\u0442\u044b\u0440\u043d\u0430\u0434\u0446\u0430\u0442\u044c?", options: ["13", "14", "15", "16"], answer: 1 },
    ],
  },
  {
    title: "Dziesiatki 20-90",
    subtitle: "Uwaga na 40 i 90!",
    icon: "20",
    questions: [
      { q: "Jak powiedziec '20'?", options: ["\u0434\u0432\u0430\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c", "\u0434\u0432\u0435\u0441\u0442\u0438", "\u0434\u0432\u0430"], answer: 1 },
      { q: "Jak powiedziec '30'?", options: ["\u0442\u0440\u0438\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044c", "\u0442\u0440\u0438\u0441\u0442\u0430", "\u0442\u0440\u0438"], answer: 1 },
      { q: "Jak powiedziec '40'? UWAGA!", options: ["\u0447\u0435\u0442\u044b\u0440\u0434\u0446\u0430\u0442\u044c", "\u0441\u043e\u0440\u043e\u043a", "\u0447\u0435\u0442\u044b\u0440\u0435\u0441\u0442\u0430", "\u0447\u0435\u0442\u044b\u0440\u0435\u0434\u0435\u0441\u044f\u0442"], answer: 1, hint: "\u0421\u043e\u0440\u043e\u043a! Wyjatek - nie pasuje do wzoru!" },
      { q: "Jak powiedziec '50'?", options: ["\u043f\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u043f\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442", "\u043f\u044f\u0442\u044c\u0441\u043e\u0442", "\u043f\u044f\u0442\u044c"], answer: 1 },
      { q: "Jak powiedziec '60'?", options: ["\u0448\u0435\u0441\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0448\u0435\u0441\u0442\u044c\u0434\u0435\u0441\u044f\u0442", "\u0448\u0435\u0441\u0442\u044c\u0441\u043e\u0442", "\u0448\u0435\u0441\u0442\u044c"], answer: 1 },
      { q: "Jak powiedziec '90'? UWAGA!", options: ["\u0434\u0435\u0432\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442", "\u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e", "\u0434\u0435\u0432\u044f\u0442\u044c\u0441\u043e\u0442", "\u0434\u0435\u0432\u044f\u0442\u044c"], answer: 1, hint: "\u0414\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e! Drugi wyjatek!" },
      { q: "Co to jest \u0432\u043e\u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442?", options: ["60", "70", "80", "90"], answer: 2 },
      { q: "Co to jest \u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442?", options: ["60", "70", "80", "90"], answer: 1 },
    ],
  },
  {
    title: "Zloz liczbe",
    subtitle: "21, 35, 99...",
    icon: "\u{1F522}",
    questions: [
      { q: "Jak powiedziec '21'?", options: ["\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c \u043e\u0434\u0438\u043d", "\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044c \u043f\u0435\u0440\u0432\u044b\u0439", "\u043e\u0434\u0438\u043d\u043d\u0430\u0434\u0446\u0430\u0442\u044c \u0434\u0432\u0430", "\u0434\u0432\u0430 \u0434\u0435\u0441\u044f\u0442\u044c \u043e\u0434\u0438\u043d"], answer: 0 },
      { q: "Jak powiedziec '35'?", options: ["\u043f\u044f\u0442\u044c \u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044c", "\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044c \u043f\u044f\u0442\u044c", "\u0442\u0440\u0438 \u043f\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c", "\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044c\u043f\u044f\u0442\u044c"], answer: 1 },
      { q: "Jak powiedziec '42'?", options: ["\u0441\u043e\u0440\u043e\u043a \u0434\u0432\u0430", "\u0447\u0435\u0442\u044b\u0440\u0435\u0434\u0446\u0430\u0442\u044c \u0434\u0432\u0430", "\u0434\u0432\u0430 \u0441\u043e\u0440\u043e\u043a", "\u0447\u0435\u0442\u044b\u0440\u0435 \u0434\u0432\u0430"], answer: 0, hint: "40 = \u0441\u043e\u0440\u043e\u043a + \u0434\u0432\u0430" },
      { q: "Jak powiedziec '58'?", options: ["\u043f\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442 \u0432\u043e\u0441\u0435\u043c\u044c", "\u0432\u043e\u0441\u0435\u043c\u044c \u043f\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442", "\u043f\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c \u0432\u043e\u0441\u0435\u043c\u044c", "\u043f\u044f\u0442\u044c\u0441\u043e\u0442 \u0432\u043e\u0441\u0435\u043c\u044c"], answer: 0 },
      { q: "Jak powiedziec '73'?", options: ["\u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442 \u0442\u0440\u0438", "\u0442\u0440\u0438 \u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442", "\u0441\u0435\u043c\u043d\u0430\u0434\u0446\u0430\u0442\u044c \u0442\u0440\u0438", "\u0441\u0435\u043c\u044c\u0441\u043e\u0442 \u0442\u0440\u0438"], answer: 0 },
      { q: "Jak powiedziec '99'?", options: ["\u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e \u0434\u0435\u0432\u044f\u0442\u044c", "\u0434\u0435\u0432\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442 \u0434\u0435\u0432\u044f\u0442\u044c", "\u0434\u0435\u0432\u044f\u0442\u044c \u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e", "\u0434\u0435\u0432\u044f\u0442\u043d\u0430\u0434\u0446\u0430\u0442\u044c \u0434\u0435\u0432\u044f\u0442\u044c"], answer: 0, hint: "90 = \u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e (wyjatek!)" },
      { q: "Jak powiedziec '100'?", options: ["\u0441\u043e\u0440\u043e\u043a", "\u0434\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e", "\u0441\u0442\u043e", "\u0442\u044b\u0441\u044f\u0447\u0430"], answer: 2 },
      { q: "Jak powiedziec '1000'?", options: ["\u0441\u0442\u043e", "\u0442\u044b\u0441\u044f\u0447\u0430", "\u043c\u0438\u043b\u043b\u0438\u043e\u043d", "\u0441\u043e\u0440\u043e\u043a"], answer: 1 },
    ],
  },
  {
    title: "Rozpoznaj liczbe",
    subtitle: "Ile to jest?",
    icon: "\u{1F9EE}",
    questions: [
      { q: "\u0414\u0432\u0430\u0434\u0446\u0430\u0442\u044c \u0447\u0435\u0442\u044b\u0440\u0435 = ?", options: ["22", "24", "34", "42"], answer: 1 },
      { q: "\u0421\u043e\u0440\u043e\u043a \u0441\u0435\u043c\u044c = ?", options: ["37", "47", "67", "74"], answer: 1 },
      { q: "\u041f\u044f\u0442\u044c\u0434\u0435\u0441\u044f\u0442 \u0442\u0440\u0438 = ?", options: ["35", "43", "53", "63"], answer: 2 },
      { q: "\u0414\u0435\u0432\u044f\u043d\u043e\u0441\u0442\u043e \u043e\u0434\u0438\u043d = ?", options: ["19", "81", "91", "99"], answer: 2 },
      { q: "\u0428\u0435\u0441\u0442\u044c\u0434\u0435\u0441\u044f\u0442 \u0432\u043e\u0441\u0435\u043c\u044c = ?", options: ["58", "68", "78", "86"], answer: 1 },
      { q: "\u0422\u0440\u0438\u0434\u0446\u0430\u0442\u044c \u0434\u0435\u0432\u044f\u0442\u044c = ?", options: ["29", "33", "39", "93"], answer: 2 },
      { q: "\u0412\u043e\u0441\u0435\u043c\u044c\u0434\u0435\u0441\u044f\u0442 \u0434\u0432\u0430 = ?", options: ["28", "72", "82", "88"], answer: 2 },
      { q: "\u0421\u043e\u0440\u043e\u043a = ?", options: ["4", "14", "40", "400"], answer: 2 },
    ],
  },
  {
    title: "Rodzaj: \u043e\u0434\u0438\u043d/\u043e\u0434\u043d\u0430, \u0434\u0432\u0430/\u0434\u0432\u0435",
    subtitle: "1 i 2 zmieniaja sie!",
    icon: "\u{2642}\u{2640}",
    questions: [
      { q: "___ \u0431\u0438\u043b\u0435\u0442 (1, r.m.)", options: ["\u043e\u0434\u0438\u043d", "\u043e\u0434\u043d\u0430", "\u043e\u0434\u043d\u043e", "\u043e\u0434\u043d\u0438"], answer: 0 },
      { q: "___ \u043a\u043d\u0438\u0433\u0430 (1, r.z.)", options: ["\u043e\u0434\u0438\u043d", "\u043e\u0434\u043d\u0430", "\u043e\u0434\u043d\u043e", "\u043e\u0434\u043d\u0438"], answer: 1 },
      { q: "___ \u043e\u043a\u043d\u043e (1, r.n.)", options: ["\u043e\u0434\u0438\u043d", "\u043e\u0434\u043d\u0430", "\u043e\u0434\u043d\u043e", "\u043e\u0434\u043d\u0438"], answer: 2 },
      { q: "___ \u0431\u0438\u043b\u0435\u0442\u0430 (2, r.m.)", options: ["\u0434\u0432\u0430", "\u0434\u0432\u0435", "\u0434\u0432\u043e\u0435", "\u0434\u0432\u0443\u0445"], answer: 0, hint: "\u0414\u0432\u0430 = dla m. i n. Dwa bilety." },
      { q: "___ \u043a\u043d\u0438\u0433\u0438 (2, r.z.)", options: ["\u0434\u0432\u0430", "\u0434\u0432\u0435", "\u0434\u0432\u043e\u0435", "\u0434\u0432\u0443\u0445"], answer: 1, hint: "\u0414\u0432\u0435 = dla zenskiego! Dwie ksiazki." },
      { q: "___ \u043e\u043a\u043d\u0430 (2, r.n.)", options: ["\u0434\u0432\u0430", "\u0434\u0432\u0435", "\u0434\u0432\u043e\u0435", "\u0434\u0432\u0443\u0445"], answer: 0, hint: "\u0414\u0432\u0430 = dla m. i n." },
      { q: "\u0414\u0432\u0430\u0434\u0446\u0430\u0442\u044c ___ \u043a\u043d\u0438\u0433\u0430 (21, r.z.)", options: ["\u043e\u0434\u0438\u043d", "\u043e\u0434\u043d\u0430", "\u043e\u0434\u043d\u043e", "\u043e\u0434\u043d\u0438"], answer: 1, hint: "21 konczy sie na 1 \u2192 \u043e\u0434\u043d\u0430 \u043a\u043d\u0438\u0433\u0430 (nie \u043a\u043d\u0438\u0433!)" },
    ],
  },
]);

addModule("gfood", "Jedzenie - trening", "Slowka kuchenne z wymowa fonetyczna", "apply", [
  {
    title: "Poznaj slowa - jedzenie",
    subtitle: "Podstawowe produkty",
    icon: "\u{1F35E}",
    questions: [
      { q: "Co to jest \u0445\u043b\u0435\u0431?", pron: "chljeb", options: ["Ser", "Chleb", "Maslo", "Mieso"], answer: 1 },
      { q: "Co to jest \u043c\u044f\u0441\u043e?", pron: "mjasa", options: ["Mleko", "Maslo", "Mieso", "Marchewka"], answer: 2, hint: "Akcent na 1. sylabie: MJA-sa" },
      { q: "Co to jest \u0441\u044b\u0440?", pron: "syr", options: ["Zupa", "Sur (zupa)", "Sok", "Ser"], answer: 3 },
      { q: "Co to jest \u0440\u044b\u0431\u0430?", pron: "ryba", options: ["Ryz", "Ryba", "Rzodkiewka", "Rzepa"], answer: 1 },
      { q: "Co to jest \u044f\u0439\u0446\u043e?", pron: "jajco", options: ["Jablko", "Jajko", "Jagoda", "Jamnik"], answer: 1, hint: "Akcent na ostatniej: jaj-CO" },
      { q: "Co to jest \u043a\u0443\u0440\u0438\u0446\u0430?", pron: "kurica", options: ["Kukurydza", "Kurczak", "Kasza", "Kielbasa"], answer: 1 },
      { q: "Co to jest \u043a\u043e\u043b\u0431\u0430\u0441\u0430?", pron: "kalbasa", options: ["Kolacja", "Kasza", "Kielbasa", "Kapusta"], answer: 2, hint: "Nieakcentowane o czytamy jako 'a': kal-ba-SA" },
      { q: "Co to jest \u0441\u0443\u043f?", pron: "sup", options: ["Sok", "Sur", "Zupa", "Ser"], answer: 2 },
    ],
  },
  {
    title: "Poznaj slowa - napoje",
    subtitle: "Co pijemy?",
    icon: "\u{1F4A7}",
    questions: [
      { q: "Co to jest \u0432\u043e\u0434\u0430?", pron: "wada", options: ["Wino", "Woda", "Wodka", "Warzywo"], answer: 1, hint: "Akcent na ostatniej: wa-DA. Nieakcentowane o = a!" },
      { q: "Co to jest \u0447\u0430\u0439?", pron: "czaj", options: ["Herbata", "Kawa", "Sok", "Piwo"], answer: 0 },
      { q: "Co to jest \u043a\u043e\u0444\u0435?", pron: "kofje", options: ["Herbata", "Sok", "Kawa", "Kompot"], answer: 2, hint: "Akcent na 1. sylabie: KO-fje. Slowo nieodmienne!" },
      { q: "Co to jest \u043c\u043e\u043b\u043e\u043a\u043e?", pron: "malako", options: ["Mleko", "Maslo", "Mieso", "Marchewka"], answer: 0, hint: "Akcent na ostatniej: ma-la-KO. Oba o bez akcentu = a!" },
      { q: "Co to jest \u0441\u043e\u043a?", pron: "sok", options: ["Ser", "Sok", "Sol", "Zupa"], answer: 1 },
      { q: "Co to jest \u043f\u0438\u0432\u043e?", pron: "piwa", options: ["Piwo", "Wino", "Woda", "Pepsi"], answer: 0, hint: "Akcent na 1. sylabie: PI-wa" },
      { q: "Co to jest \u0432\u0438\u043d\u043e?", pron: "wino", options: ["Woda", "Piwo", "Wino", "Winogrona"], answer: 2, hint: "Akcent na ostatniej: wi-NO" },
    ],
  },
  {
    title: "Owoce i warzywa",
    subtitle: "\u0424\u0440\u0443\u043a\u0442\u044b \u0438 \u043e\u0432\u043e\u0449\u0438",
    icon: "\u{1F34E}",
    questions: [
      { q: "Co to jest \u044f\u0431\u043b\u043e\u043a\u043e?", pron: "jablaka", options: ["Jajko", "Jablko", "Jagoda", "Gruszka"], answer: 1, hint: "Akcent na 1.: JA-bla-ka. Nieakcentowane o = a!" },
      { q: "Co to jest \u043f\u043e\u043c\u0438\u0434\u043e\u0440?", pron: "pamidor", options: ["Pomarancza", "Pomidor", "Papryka", "Pietruszka"], answer: 1, hint: "Akcent na ostatniej: pa-mi-DOR" },
      { q: "Co to jest \u043e\u0433\u0443\u0440\u0435\u0446?", pron: "agurjec", options: ["Ogon", "Orzech", "Ogorek", "Owoc"], answer: 2, hint: "Akcent na 2.: a-GU-rjec" },
      { q: "Co to jest \u043b\u0443\u043a?", pron: "luk", options: ["Lod", "Lukier", "Cebula", "Czosnek"], answer: 2, hint: "\u041b\u0443\u043a = cebula, nie 'luk'!" },
      { q: "Co to jest \u043c\u043e\u0440\u043a\u043e\u0432\u044c?", pron: "markofj", options: ["Morela", "Marchewka", "Mango", "Malina"], answer: 1, hint: "Akcent na 2.: mar-KOFJ. \u044c = miekki znak" },
      { q: "Co to jest \u0430\u043f\u0435\u043b\u044c\u0441\u0438\u043d?", pron: "apjelsjin", options: ["Ananas", "Arbuz", "Pomarancza", "Banan"], answer: 2 },
    ],
  },
  {
    title: "Posilki i smaki",
    subtitle: "\u0417\u0430\u0432\u0442\u0440\u0430\u043a, \u043e\u0431\u0435\u0434, \u0443\u0436\u0438\u043d",
    icon: "\u{1F372}",
    questions: [
      { q: "Co to jest \u0437\u0430\u0432\u0442\u0440\u0430\u043a?", pron: "zawtrak", options: ["Kolacja", "Obiad", "Sniadanie", "Podwieczorek"], answer: 2 },
      { q: "Co to jest \u043e\u0431\u0435\u0434?", pron: "abjed", options: ["Sniadanie", "Obiad", "Kolacja", "Przekaska"], answer: 1, hint: "Akcent na 2.: a-BJED" },
      { q: "Co to jest \u0443\u0436\u0438\u043d?", pron: "uzyn", options: ["Sniadanie", "Obiad", "Podwieczorek", "Kolacja"], answer: 3, hint: "\u0436 czytamy twardo: U-zyn" },
      { q: "Co znaczy \u0432\u043a\u0443\u0441\u043d\u044b\u0439?", pron: "fkusnyj", options: ["Ostry", "Smaczny", "Slodki", "Gorzki"], answer: 1, hint: "\u0432 przed \u043a czytamy jako 'f': FKUS-nyj" },
      { q: "Co znaczy \u0441\u043b\u0430\u0434\u043a\u0438\u0439?", pron: "slatkij", options: ["Slony", "Kwasny", "Slodki", "Ostry"], answer: 2, hint: "\u0434 przed \u043a czytamy jako 't': SLAT-kij" },
      { q: "Co znaczy \u043e\u0441\u0442\u0440\u044b\u0439?", pron: "ostryj", options: ["Slodki", "Gorzki", "Slony", "Ostry/pikantny"], answer: 3 },
      { q: "Co znaczy \u0441\u043e\u043b\u0451\u043d\u044b\u0439?", pron: "salonyj", options: ["Slodki", "Slony", "Kwasny", "Smaczny"], answer: 1, hint: "Nieakcentowane o = a: sa-LO-nyj" },
    ],
  },
  {
    title: "Tlumacz na rosyjski",
    subtitle: "Jak to powiedziec?",
    icon: "\u{27A1}",
    questions: [
      { q: "Jak powiedziec 'chleb' po rosyjsku?", pron: "chljeb", options: ["\u043c\u044f\u0441\u043e", "\u0445\u043b\u0435\u0431", "\u0441\u044b\u0440", "\u0440\u0438\u0441"], answer: 1 },
      { q: "Jak powiedziec 'mleko' po rosyjsku?", pron: "malako", options: ["\u043c\u0430\u0441\u043b\u043e", "\u043c\u043e\u043b\u043e\u043a\u043e", "\u043c\u044f\u0441\u043e", "\u043c\u043e\u0440\u043a\u043e\u0432\u044c"], answer: 1 },
      { q: "Jak powiedziec 'herbata'?", pron: "czaj", options: ["\u043a\u043e\u0444\u0435", "\u0441\u043e\u043a", "\u0447\u0430\u0439", "\u0432\u043e\u0434\u0430"], answer: 2 },
      { q: "Jak powiedziec 'zupa'?", pron: "sup", options: ["\u0441\u043e\u043a", "\u0441\u0443\u043f", "\u0441\u044b\u0440", "\u0441\u0430\u043b\u0430\u0442"], answer: 1 },
      { q: "Jak powiedziec 'jablko'?", pron: "jablaka", options: ["\u044f\u0439\u0446\u043e", "\u044f\u0431\u043b\u043e\u043a\u043e", "\u0430\u043f\u0435\u043b\u044c\u0441\u0438\u043d", "\u043e\u0433\u0443\u0440\u0435\u0446"], answer: 1 },
      { q: "Jak powiedziec 'kurczak'?", pron: "kurica", options: ["\u043a\u0430\u0448\u0430", "\u043a\u043e\u043b\u0431\u0430\u0441\u0430", "\u043a\u0443\u0440\u0438\u0446\u0430", "\u043a\u0430\u0440\u0442\u043e\u0448\u043a\u0430"], answer: 2 },
      { q: "Jak powiedziec 'woda'?", pron: "wada", options: ["\u0432\u0438\u043d\u043e", "\u0432\u043e\u0434\u0430", "\u0432\u043e\u0434\u043a\u0430", "\u0432\u043a\u0443\u0441\u043d\u044b\u0439"], answer: 1 },
      { q: "Jak powiedziec 'ser'?", pron: "syr", options: ["\u0441\u0443\u043f", "\u0441\u043e\u043a", "\u0441\u044b\u0440", "\u0441\u0430\u043b\u0430\u0442"], answer: 2 },
    ],
  },
  {
    title: "Zdania z czasownikami!",
    subtitle: "Polacz slowka z gramatyka",
    icon: "\u{1F4AC}",
    questions: [
      { q: "Jak powiedziec: 'Chce jesc'?", pron: "ja chachu jest'", options: ["\u042f \u0445\u043e\u0447\u0443 \u043f\u0438\u0442\u044c", "\u042f \u0445\u043e\u0447\u0443 \u0435\u0441\u0442\u044c", "\u042f \u043c\u043e\u0433\u0443 \u0435\u0441\u0442\u044c", "\u042f \u043b\u044e\u0431\u043b\u044e \u0435\u0441\u0442\u044c"], answer: 1 },
      { q: "Jak powiedziec: 'Pije kawe'?", pron: "ja pju kofje", options: ["\u042f \u043f\u044c\u044e \u0447\u0430\u0439", "\u042f \u0435\u043c \u043a\u043e\u0444\u0435", "\u042f \u043f\u044c\u044e \u043a\u043e\u0444\u0435", "\u042f \u0445\u043e\u0447\u0443 \u043a\u043e\u0444\u0435"], answer: 2 },
      { q: "Jak powiedziec: 'Lubie rybe'?", pron: "ja ljublju rybu", options: ["\u042f \u043b\u044e\u0431\u043b\u044e \u0440\u044b\u0431\u0443", "\u042f \u043b\u044e\u0431\u043b\u044e \u0440\u044b\u0431\u0430", "\u042f \u043b\u044e\u0431\u0438\u0442\u044c \u0440\u044b\u0431\u0443", "\u042f \u043b\u044e\u0431\u044e \u0440\u044b\u0431\u0443"], answer: 0, hint: "\u041b\u044e\u0431\u043b\u044e (\u0431\u2192\u0431\u043b!) + biernik: \u0440\u044b\u0431\u0430 \u2192 \u0440\u044b\u0431\u0443" },
      { q: "Jak powiedziec: 'Ona je sniadanie'?", pron: "ana jest zawtrak", options: ["\u041e\u043d\u0430 \u0435\u0441\u0442 \u0437\u0430\u0432\u0442\u0440\u0430\u043a", "\u041e\u043d\u0430 \u0435\u043c \u0437\u0430\u0432\u0442\u0440\u0430\u043a", "\u041e\u043d\u0430 \u0435\u0434\u0438\u0442 \u0437\u0430\u0432\u0442\u0440\u0430\u043a", "\u041e\u043d\u0430 \u0435\u0448\u044c \u0437\u0430\u0432\u0442\u0440\u0430\u043a"], answer: 0, hint: "\u041e\u043d\u0430 \u0435\u0441\u0442 (3 osoba l.poj.)" },
      { q: "Jak powiedziec: 'Oni pija herbate'?", pron: "ani pjut czaj", options: ["\u041e\u043d\u0438 \u043f\u044c\u044e\u0442 \u0447\u0430\u0439", "\u041e\u043d\u0438 \u043f\u044c\u0451\u0442 \u0447\u0430\u0439", "\u041e\u043d\u0438 \u043f\u0438\u044e\u0442 \u0447\u0430\u0439", "\u041e\u043d\u0438 \u043f\u044c\u044e\u0442 \u0447\u0430\u044f"], answer: 0, hint: "\u041e\u043d\u0438 \u043f\u044c\u044e\u0442! (Ja i Oni maja \u044e)" },
      { q: "Jak powiedziec: 'Chcemy zupe'?", pron: "my chatim sup", options: ["\u041c\u044b \u0445\u043e\u0447\u0435\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0442\u0438\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0442\u0435\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0447\u0438\u043c \u0441\u0443\u043f"], answer: 1, hint: "\u041c\u044b \u0445\u043e\u0442\u0438\u043c! (l.mn. = II konj.)" },
      { q: "Jak powiedziec: 'Mozesz pic mleko?'", pron: "ty mozhesh pit' malako?", options: ["\u0422\u044b \u043c\u043e\u0433\u0435\u0448\u044c \u043f\u0438\u0442\u044c \u043c\u043e\u043b\u043e\u043a\u043e?", "\u0422\u044b \u043c\u043e\u0436\u0435\u0448\u044c \u043f\u0438\u0442\u044c \u043c\u043e\u043b\u043e\u043a\u043e?", "\u0422\u044b \u043c\u043e\u0447\u044c \u043f\u0438\u0442\u044c \u043c\u043e\u043b\u043e\u043a\u043e?", "\u0422\u044b \u043c\u043e\u0436\u0435\u0448\u044c \u043f\u044c\u044e \u043c\u043e\u043b\u043e\u043a\u043e?"], answer: 1, hint: "\u041c\u043e\u0436\u0435\u0448\u044c + bezokolicznik \u043f\u0438\u0442\u044c!" },
      { q: "'Zupa jest smaczna' = ?", pron: "sup fkusnyj", options: ["\u0421\u0443\u043f \u0432\u043a\u0443\u0441\u043d\u044b\u0439", "\u0421\u0443\u043f \u0441\u043b\u0430\u0434\u043a\u0438\u0439", "\u0421\u0443\u043f \u043e\u0441\u0442\u0440\u044b\u0439", "\u0421\u0443\u043f \u0441\u043e\u043b\u0451\u043d\u044b\u0439"], answer: 0, hint: "\u0412\u043a\u0443\u0441\u043d\u044b\u0439 = smaczny. \u0432 przed \u043a = f!" },
    ],
  },
]);

addModule("gtravel", "Podroze - trening", "Miasto, transport, kierunki - z audio", "apply", [
  {
    title: "Miejsca w miescie",
    subtitle: "\u0433\u043e\u0440\u043e\u0434, \u0443\u043b\u0438\u0446\u0430, \u043f\u043b\u043e\u0449\u0430\u0434\u044c...",
    icon: "\u{1F3D9}",
    questions: [
      { q: "Co to jest \u0433\u043e\u0440\u043e\u0434?", speak: "\u0433\u043e\u0440\u043e\u0434", pron: "gorad", options: ["Wies", "Miasto", "Kraj", "Ulica"], answer: 1, hint: "Nieakcentowane o = a: GO-rad" },
      { q: "Co to jest \u0443\u043b\u0438\u0446\u0430?", speak: "\u0443\u043b\u0438\u0446\u0430", pron: "ulica", options: ["Plac", "Most", "Ulica", "Park"], answer: 2 },
      { q: "Co to jest \u043f\u043b\u043e\u0449\u0430\u0434\u044c?", speak: "\u043f\u043b\u043e\u0449\u0430\u0434\u044c", pron: "ploszczadj", options: ["Plaza", "Plac", "Pole", "Plan"], answer: 1 },
      { q: "Co to jest \u043c\u0443\u0437\u0435\u0439?", speak: "\u043c\u0443\u0437\u0435\u0439", pron: "muzjej", options: ["Muzeum", "Muzyka", "Meczet", "Market"], answer: 0 },
      { q: "Co to jest \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d?", speak: "\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d", pron: "rjestaran", options: ["Recepcja", "Restauracja", "Remont", "Ratusz"], answer: 1 },
      { q: "Co to jest \u043c\u0430\u0433\u0430\u0437\u0438\u043d?", speak: "\u043c\u0430\u0433\u0430\u0437\u0438\u043d", pron: "magazin", options: ["Magazyn", "Sklep", "Galeria", "Market"], answer: 1, hint: "Falszywy przyjaciel! \u041c\u0430\u0433\u0430\u0437\u0438\u043d = sklep, nie magazyn!" },
      { q: "Co to jest \u0430\u043f\u0442\u0435\u043a\u0430?", speak: "\u0430\u043f\u0442\u0435\u043a\u0430", pron: "aptjeka", options: ["Apteka", "Antena", "Arena", "Aleja"], answer: 0 },
      { q: "Co to jest \u0446\u0435\u0440\u043a\u043e\u0432\u044c?", speak: "\u0446\u0435\u0440\u043a\u043e\u0432\u044c", pron: "cerkofj", options: ["Cyrk", "Centrum", "Cerkiew/kosciol", "Cmentarz"], answer: 2 },
    ],
  },
  {
    title: "Transport",
    subtitle: "\u0430\u0432\u0442\u043e\u0431\u0443\u0441, \u043f\u043e\u0435\u0437\u0434, \u0442\u0430\u043a\u0441\u0438...",
    icon: "\u{1F68C}",
    questions: [
      { q: "Co to jest \u0432\u043e\u043a\u0437\u0430\u043b?", speak: "\u0432\u043e\u043a\u0437\u0430\u043b", pron: "wakzal", options: ["Dworzec", "Wokol", "Wolontariat", "Wulkan"], answer: 0, hint: "Akcent na 2.: wak-ZAL" },
      { q: "Co to jest \u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442?", speak: "\u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442", pron: "aeraport", options: ["Aeroklub", "Lotnisko", "Helikopter", "Lot"], answer: 1 },
      { q: "Co to jest \u043f\u043e\u0435\u0437\u0434?", speak: "\u043f\u043e\u0435\u0437\u0434", pron: "pojezd", options: ["Przejazd", "Pojazd", "Pociag", "Prom"], answer: 2 },
      { q: "Co to jest \u0441\u0430\u043c\u043e\u043b\u0451\u0442?", speak: "\u0441\u0430\u043c\u043e\u043b\u0451\u0442", pron: "samaljot", options: ["Samolot", "Samochod", "Sanki", "Statek"], answer: 0 },
      { q: "Co to jest \u0431\u0438\u043b\u0435\u0442?", speak: "\u0431\u0438\u043b\u0435\u0442", pron: "biljet", options: ["Budynek", "Balkon", "Bilet", "Bagaz"], answer: 2 },
      { q: "Co to jest \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430?", speak: "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430", pron: "astanofka", options: ["Ostroga", "Przystanek", "Stacja", "Parking"], answer: 1, hint: "a-sta-NOF-ka. \u0432 przed \u043a = f!" },
      { q: "Co to jest \u0442\u0430\u043a\u0441\u0438?", speak: "\u0442\u0430\u043a\u0441\u0438", pron: "taksi", options: ["Taksowka", "Taksa", "Taksometru", "Taras"], answer: 0, hint: "Slowo nieodmienne, jak \u043a\u043e\u0444\u0435!" },
      { q: "Co to jest \u043c\u0435\u0442\u0440\u043e?", speak: "\u043c\u0435\u0442\u0440\u043e", pron: "mjetro", options: ["Metr", "Metro", "Mentor", "Meteor"], answer: 1 },
    ],
  },
  {
    title: "Kierunki i pozycja",
    subtitle: "\u043d\u0430\u043b\u0435\u0432\u043e, \u043d\u0430\u043f\u0440\u0430\u0432\u043e, \u043f\u0440\u044f\u043c\u043e...",
    icon: "\u{1F9ED}",
    questions: [
      { q: "Co znaczy \u043d\u0430\u043b\u0435\u0432\u043e?", speak: "\u043d\u0430\u043b\u0435\u0432\u043e", pron: "naljewa", options: ["Na prawo", "Na lewo", "Prosto", "Do tylu"], answer: 1 },
      { q: "Co znaczy \u043d\u0430\u043f\u0440\u0430\u0432\u043e?", speak: "\u043d\u0430\u043f\u0440\u0430\u0432\u043e", pron: "naprawa", options: ["Na lewo", "Prosto", "Na prawo", "W gore"], answer: 2 },
      { q: "Co znaczy \u043f\u0440\u044f\u043c\u043e?", speak: "\u043f\u0440\u044f\u043c\u043e", pron: "prjama", options: ["Na lewo", "Na prawo", "W dol", "Prosto"], answer: 3, hint: "Nieakcentowane o = a: PRJA-ma" },
      { q: "Co znaczy \u0434\u0430\u043b\u0435\u043a\u043e?", speak: "\u0434\u0430\u043b\u0435\u043a\u043e", pron: "daljeko", options: ["Blisko", "Daleko", "Wysoko", "Nisko"], answer: 1 },
      { q: "Co znaczy \u0431\u043b\u0438\u0437\u043a\u043e?", speak: "\u0431\u043b\u0438\u0437\u043a\u043e", pron: "bliska", options: ["Daleko", "Szybko", "Blisko", "Wolno"], answer: 2, hint: "BLI-ska. \u0437 przed \u043a = s!" },
      { q: "Co znaczy \u0437\u0434\u0435\u0441\u044c?", speak: "\u0437\u0434\u0435\u0441\u044c", pron: "zdjesj", options: ["Tam", "Tutaj", "Wszedzie", "Nigdzie"], answer: 1 },
      { q: "Co znaczy \u0442\u0430\u043c?", speak: "\u0442\u0430\u043c", pron: "tam", options: ["Tutaj", "Tam", "Tu", "Ten"], answer: 1 },
    ],
  },
  {
    title: "Podroze i dokumenty",
    subtitle: "\u043f\u0430\u0441\u043f\u043e\u0440\u0442, \u043a\u0430\u0440\u0442\u0430, \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430...",
    icon: "\u{1F6C2}",
    questions: [
      { q: "Co to jest \u043f\u0430\u0441\u043f\u043e\u0440\u0442?", speak: "\u043f\u0430\u0441\u043f\u043e\u0440\u0442", pron: "paspart", options: ["Paszport", "Paczka", "Przepustka", "Prawo jazdy"], answer: 0 },
      { q: "Co to jest \u043a\u0430\u0440\u0442\u0430?", speak: "\u043a\u0430\u0440\u0442\u0430", pron: "karta", options: ["Kartka", "Karta kredytowa", "Mapa", "Karton"], answer: 2, hint: "\u041a\u0430\u0440\u0442\u0430 = mapa! (karta kredytowa to \u043a\u0440\u0435\u0434\u0438\u0442\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430)" },
      { q: "Co to jest \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430?", speak: "\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430", pron: "gastinica", options: ["Gosciniec", "Hotel", "Gospoda", "Galeria"], answer: 1, hint: "ga-STI-ni-ca. Falszywy przyjaciel - to hotel, nie gosciniec!" },
      { q: "Co to jest \u043d\u043e\u043c\u0435\u0440?", speak: "\u043d\u043e\u043c\u0435\u0440", pron: "nomjer", options: ["Numer telefonu", "Pokoj hotelowy", "Nazwisko", "Numer domu"], answer: 1, hint: "\u041d\u043e\u043c\u0435\u0440 w kontekscie hotelu = pokoj" },
    ],
  },
  {
    title: "Tlumacz na rosyjski",
    subtitle: "Jak to powiedziec?",
    icon: "\u{27A1}",
    questions: [
      { q: "Jak powiedziec 'dworzec'?", pron: "wakzal", options: ["\u0430\u044d\u0440\u043e\u043f\u043e\u0440\u0442", "\u0432\u043e\u043a\u0437\u0430\u043b", "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430", "\u043c\u0435\u0442\u0440\u043e"], answer: 1 },
      { q: "Jak powiedziec 'sklep'?", pron: "magazin", options: ["\u043c\u0443\u0437\u0435\u0439", "\u043c\u0430\u0433\u0430\u0437\u0438\u043d", "\u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d", "\u0431\u0430\u043d\u043a"], answer: 1 },
      { q: "Jak powiedziec 'samolot'?", pron: "samaljot", options: ["\u0441\u0430\u043c\u043e\u043b\u0451\u0442", "\u043f\u043e\u0435\u0437\u0434", "\u0430\u0432\u0442\u043e\u0431\u0443\u0441", "\u0442\u0430\u043a\u0441\u0438"], answer: 0 },
      { q: "Jak powiedziec 'na lewo'?", pron: "naljewa", options: ["\u043d\u0430\u043f\u0440\u0430\u0432\u043e", "\u043f\u0440\u044f\u043c\u043e", "\u043d\u0430\u043b\u0435\u0432\u043e", "\u0434\u0430\u043b\u0435\u043a\u043e"], answer: 2 },
      { q: "Jak powiedziec 'pociag'?", pron: "pojezd", options: ["\u043f\u043e\u0447\u0442\u0430", "\u043f\u043e\u0435\u0437\u0434", "\u043f\u043e\u0440\u0442", "\u043f\u0430\u0441\u043f\u043e\u0440\u0442"], answer: 1 },
      { q: "Jak powiedziec 'mapa'?", pron: "karta", options: ["\u043a\u0430\u0440\u0442\u043e\u043d", "\u043a\u043d\u0438\u0433\u0430", "\u043a\u0430\u0440\u0442\u0430", "\u043a\u0430\u0440\u0442\u0438\u043d\u0430"], answer: 2 },
      { q: "Jak powiedziec 'przystanek'?", pron: "astanofka", options: ["\u0441\u0442\u0430\u043d\u0446\u0438\u044f", "\u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430", "\u0441\u0442\u043e\u044f\u043d\u043a\u0430", "\u043e\u0441\u0442\u0440\u043e\u0432"], answer: 1 },
      { q: "Jak powiedziec 'hotel'?", pron: "gastinica", options: ["\u0433\u043e\u0441\u0442\u044c", "\u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430", "\u0433\u043e\u0441\u0442\u0438\u043d\u0430\u044f", "\u0433\u043e\u0441\u0442\u0435\u0432\u043e\u0439"], answer: 1 },
    ],
  },
  {
    title: "Zdania podroznicze",
    subtitle: "Polacz slowka z gramatyka",
    icon: "\u{1F4AC}",
    questions: [
      { q: "'Gdzie jest dworzec?' = ?", speak: "\u0413\u0434\u0435 \u0432\u043e\u043a\u0437\u0430\u043b?", pron: "gdje wakzal?", options: ["\u0413\u0434\u0435 \u0432\u043e\u043a\u0437\u0430\u043b?", "\u041a\u0430\u043a \u0432\u043e\u043a\u0437\u0430\u043b?", "\u0427\u0442\u043e \u0432\u043e\u043a\u0437\u0430\u043b?", "\u041a\u0443\u0434\u0430 \u0432\u043e\u043a\u0437\u0430\u043b?"], answer: 0, hint: "\u0413\u0434\u0435 = gdzie. W rosyjskim nie trzeba 'jest'!" },
      { q: "'Chce bilet' = ?", speak: "\u042f \u0445\u043e\u0447\u0443 \u0431\u0438\u043b\u0435\u0442", pron: "ja chachu biljet", options: ["\u042f \u0445\u043e\u0442\u0438\u043c \u0431\u0438\u043b\u0435\u0442", "\u042f \u0445\u043e\u0447\u0443 \u0431\u0438\u043b\u0435\u0442", "\u042f \u043c\u043e\u0433\u0443 \u0431\u0438\u043b\u0435\u0442", "\u042f \u0445\u043e\u0447\u0435\u0448\u044c \u0431\u0438\u043b\u0435\u0442"], answer: 1 },
      { q: "'Idz prosto' = ?", speak: "\u0418\u0434\u0438\u0442\u0435 \u043f\u0440\u044f\u043c\u043e", pron: "iditje prjama", options: ["\u0418\u0434\u0438\u0442\u0435 \u043d\u0430\u043b\u0435\u0432\u043e", "\u0418\u0434\u0438\u0442\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043e", "\u0418\u0434\u0438\u0442\u0435 \u043f\u0440\u044f\u043c\u043e", "\u0418\u0434\u0438\u0442\u0435 \u0442\u0430\u043c"], answer: 2, hint: "\u0418\u0434\u0438\u0442\u0435 = idz (formalnie/Pan/Pani)" },
      { q: "'To daleko?' = ?", speak: "\u042d\u0442\u043e \u0434\u0430\u043b\u0435\u043a\u043e?", pron: "eta daljeko?", options: ["\u042d\u0442\u043e \u0431\u043b\u0438\u0437\u043a\u043e?", "\u042d\u0442\u043e \u0434\u0430\u043b\u0435\u043a\u043e?", "\u042d\u0442\u043e \u0437\u0434\u0435\u0441\u044c?", "\u042d\u0442\u043e \u0442\u0430\u043c?"], answer: 1, hint: "\u042d\u0442\u043e = to. Nieakcentowane \u044d = e: E-ta" },
      { q: "'Moge zobaczyc mape?' = ?", speak: "\u041c\u043e\u0436\u043d\u043e \u043a\u0430\u0440\u0442\u0443?", pron: "mozhna kartu?", options: ["\u041c\u043e\u0436\u043d\u043e \u043a\u0430\u0440\u0442\u0443?", "\u041c\u043e\u0433\u0443 \u043a\u0430\u0440\u0442\u0430?", "\u041c\u043e\u0436\u043d\u043e \u043a\u0430\u0440\u0442\u0430?", "\u041c\u043e\u0433\u0443 \u043a\u0430\u0440\u0442\u0443?"], answer: 0, hint: "\u041c\u043e\u0436\u043d\u043e = czy mozna. \u041a\u0430\u0440\u0442\u0430 \u2192 \u043a\u0430\u0440\u0442\u0443 (biernik)" },
      { q: "'Gdzie jest metro?' = ?", speak: "\u0413\u0434\u0435 \u043c\u0435\u0442\u0440\u043e?", pron: "gdje mjetro?", options: ["\u0413\u0434\u0435 \u043c\u0435\u0442\u0440\u043e?", "\u041a\u0430\u043a \u043c\u0435\u0442\u0440\u043e?", "\u041a\u0443\u0434\u0430 \u043c\u0435\u0442\u0440\u043e?", "\u041a\u043e\u0433\u0434\u0430 \u043c\u0435\u0442\u0440\u043e?"], answer: 0 },
      { q: "'Mieszkamy w hotelu' = ?", speak: "\u041c\u044b \u0436\u0438\u0432\u0451\u043c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435", pron: "my zhiwjom w gastinice", options: ["\u041c\u044b \u0436\u0438\u0432\u0435\u043c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430", "\u041c\u044b \u0436\u0438\u0432\u0451\u043c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435", "\u041c\u044b \u0436\u0438\u0432\u0443 \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435", "\u041c\u044b \u0436\u0438\u0442\u044c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435"], answer: 1, hint: "\u041c\u044b \u0436\u0438\u0432\u0451\u043c! + miejscownik: \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430 \u2192 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435" },
      { q: "'Oni chca jechac taksowka' = ?", speak: "\u041e\u043d\u0438 \u0445\u043e\u0442\u044f\u0442 \u0435\u0445\u0430\u0442\u044c \u043d\u0430 \u0442\u0430\u043a\u0441\u0438", pron: "ani chatjat jechatj na taksi", options: ["\u041e\u043d\u0438 \u0445\u043e\u0447\u0443\u0442 \u0435\u0445\u0430\u0442\u044c \u043d\u0430 \u0442\u0430\u043a\u0441\u0438", "\u041e\u043d\u0438 \u0445\u043e\u0442\u044f\u0442 \u0435\u0445\u0430\u0442\u044c \u043d\u0430 \u0442\u0430\u043a\u0441\u0438", "\u041e\u043d\u0438 \u0445\u043e\u0442\u0438\u043c \u0435\u0445\u0430\u0442\u044c \u043d\u0430 \u0442\u0430\u043a\u0441\u0438", "\u041e\u043d\u0438 \u0445\u043e\u0442\u044f\u0442 \u0435\u0434\u0443\u0442 \u043d\u0430 \u0442\u0430\u043a\u0441\u0438"], answer: 1, hint: "\u041e\u043d\u0438 \u0445\u043e\u0442\u044f\u0442 (II konj. w l.mn.!) + bezokolicznik \u0435\u0445\u0430\u0442\u044c" },
    ],
  },
]);

addExam("test", "Sprawdzian", "44 pytania z gramatyki czasownikowej", [
  // CYRYLICA (1-5)
  { cat: "Cyrylica", q: "Jak czytamy rosyjska litere \u0412?", options: ["B", "W", "F", "G"], answer: 1 },
  { cat: "Cyrylica", q: "Jak czytamy rosyjska litere \u0420?", options: ["P", "R", "G", "D"], answer: 1 },
  { cat: "Cyrylica", q: "Jak czytamy rosyjska litere \u0421?", options: ["K", "C", "S", "Z"], answer: 2 },
  { cat: "Cyrylica", q: "Jak czytamy rosyjska litere \u041d?", options: ["H", "M", "N", "P"], answer: 2 },
  { cat: "Cyrylica", q: "Co oznacza znak \u042c?", options: ["Twardy znak", "Miekki znak", "Samogloska", "Spolgloska"], answer: 1 },

  // I KONIUGACJA (6-10)
  { cat: "I koniugacja", q: "\u0414\u0443\u043c\u0430\u0442\u044c (myslec) \u2192 \u042f ...?", options: ["\u0434\u0443\u043c\u0430\u044e", "\u0434\u0443\u043c\u0430\u0435\u0448\u044c", "\u0434\u0443\u043c\u0430\u0435\u0442", "\u0434\u0443\u043c\u0430\u0435\u043c"], answer: 0 },
  { cat: "I koniugacja", q: "\u0427\u0438\u0442\u0430\u0442\u044c (czytac) \u2192 \u041e\u043d\u0438 ...?", options: ["\u0447\u0438\u0442\u0430\u0435\u0442", "\u0447\u0438\u0442\u0430\u0435\u043c", "\u0447\u0438\u0442\u0430\u0435\u0442\u0435", "\u0447\u0438\u0442\u0430\u044e\u0442"], answer: 3 },
  { cat: "I koniugacja", q: "\u0420\u0430\u0431\u043e\u0442\u0430\u0442\u044c (pracowac) \u2192 \u041c\u044b ...?", options: ["\u0440\u0430\u0431\u043e\u0442\u0430\u044e", "\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0448\u044c", "\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u043c", "\u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442"], answer: 2 },
  { cat: "I koniugacja", q: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c (sluchac) \u2192 \u0422\u044b ...?", options: ["\u0441\u043b\u0443\u0448\u0430\u044e", "\u0441\u043b\u0443\u0448\u0430\u0435\u0448\u044c", "\u0441\u043b\u0443\u0448\u0430\u0435\u0442", "\u0441\u043b\u0443\u0448\u0430\u0435\u043c"], answer: 1 },
  { cat: "I koniugacja", q: "\u0417\u043d\u0430\u0442\u044c (wiedziec) \u2192 \u0412\u044b ...?", options: ["\u0437\u043d\u0430\u044e", "\u0437\u043d\u0430\u0435\u0448\u044c", "\u0437\u043d\u0430\u0435\u043c", "\u0437\u043d\u0430\u0435\u0442\u0435"], answer: 3 },

  // II KONIUGACJA (11-15)
  { cat: "II koniugacja", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c (mowic) \u2192 \u042f ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u044e", "\u0433\u043e\u0432\u043e\u0440\u0438\u0448\u044c", "\u0433\u043e\u0432\u043e\u0440\u0438\u0442", "\u0433\u043e\u0432\u043e\u0440\u0438\u043c"], answer: 0 },
  { cat: "II koniugacja", q: "\u0423\u0447\u0438\u0442\u044c (uczyc) \u2192 \u041e\u043d ...?", options: ["\u0443\u0447\u0443", "\u0443\u0447\u0438\u0448\u044c", "\u0443\u0447\u0438\u0442", "\u0443\u0447\u0438\u043c"], answer: 2 },
  { cat: "II koniugacja", q: "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c (patrzec) \u2192 \u041c\u044b ...?", options: ["\u0441\u043c\u043e\u0442\u0440\u044e", "\u0441\u043c\u043e\u0442\u0440\u0438\u0448\u044c", "\u0441\u043c\u043e\u0442\u0440\u0438\u043c", "\u0441\u043c\u043e\u0442\u0440\u044f\u0442"], answer: 2 },
  { cat: "II koniugacja", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u0438\u0442", "\u0433\u043e\u0432\u043e\u0440\u044f\u0442", "\u0433\u043e\u0432\u043e\u0440\u0438\u043c", "\u0433\u043e\u0432\u043e\u0440\u0438\u0442\u0435"], answer: 1 },
  { cat: "II koniugacja", q: "Ktora koniugacja: \u0441\u043c\u043e\u0442\u0440\u0435\u0442\u044c (-\u0435\u0442\u044c)?", options: ["I koniugacja", "II koniugacja", "Nieregularny"], answer: 1, hint: "Wyjatek! \u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c konczy sie na -\u0435\u0442\u044c, ale odmienia sie jak II!" },

  // NIEREGULARNE (16-20)
  { cat: "Nieregularne", q: "\u0425\u043e\u0442\u0435\u0442\u044c (chciec) \u2192 \u042f ...?", options: ["\u0445\u043e\u0447\u0443", "\u0445\u043e\u0442\u044e", "\u0445\u043e\u0442\u0435\u044e", "\u0445\u043e\u0447\u0435\u0448\u044c"], answer: 0 },
  { cat: "Nieregularne", q: "\u0415\u0441\u0442\u044c (jesc) \u2192 \u041e\u043d\u0438 ...?", options: ["\u0435\u0441\u0442", "\u0435\u0441\u044f\u0442", "\u0435\u0434\u044f\u0442", "\u0435\u0434\u0430\u0442"], answer: 2 },
  { cat: "Nieregularne", q: "\u041f\u0438\u0442\u044c (pic) \u2192 \u0422\u044b ...?", options: ["\u043f\u0438\u0435\u0448\u044c", "\u043f\u044c\u0451\u0448\u044c", "\u043f\u0438\u0442\u044c\u0451\u0448\u044c", "\u043f\u0438\u0448\u044c"], answer: 1 },
  { cat: "Nieregularne", q: "\u041c\u043e\u0447\u044c (moc) \u2192 \u042f ...?", options: ["\u043c\u043e\u0436\u0443", "\u043c\u043e\u0447\u0443", "\u043c\u043e\u0433\u0443", "\u043c\u043e\u0447\u044c\u044e"], answer: 2 },
  { cat: "Nieregularne", q: "\u0416\u0438\u0442\u044c (zyc) \u2192 \u041c\u044b ...?", options: ["\u0436\u0438\u0451\u043c", "\u0436\u0438\u0432\u0451\u043c", "\u0436\u0443\u0451\u043c", "\u0436\u0438\u043b\u0451\u043c"], answer: 1 },

  // CZAS PRZESZLY (21-26)
  { cat: "Czas przeszly", q: "\u0427\u0438\u0442\u0430\u0442\u044c \u2192 On czytal = \u041e\u043d ...?", options: ["\u0447\u0438\u0442\u0430\u043b", "\u0447\u0438\u0442\u0430\u043b\u0430", "\u0447\u0438\u0442\u0430\u043b\u043e", "\u0447\u0438\u0442\u0430\u043b\u0438"], answer: 0 },
  { cat: "Czas przeszly", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u2192 Ona mowila = \u041e\u043d\u0430 ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u0438\u043b", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0430", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u043e", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0438"], answer: 1 },
  { cat: "Czas przeszly", q: "\u0415\u0441\u0442\u044c \u2192 Oni jedli = \u041e\u043d\u0438 ...?", options: ["\u0435\u043b", "\u0435\u043b\u0430", "\u0435\u043b\u043e", "\u0435\u043b\u0438"], answer: 3 },
  { cat: "Czas przeszly", q: "\u041c\u043e\u0447\u044c \u2192 Ona mogla = \u041e\u043d\u0430 ...?", options: ["\u043c\u043e\u0433", "\u043c\u043e\u0433\u043b\u0430", "\u043c\u043e\u0433\u043b\u043e", "\u043c\u043e\u0433\u043b\u0438"], answer: 1 },
  { cat: "Czas przeszly", q: "\u0418\u0434\u0442\u0438 (isc) \u2192 On szedl = \u041e\u043d ...?", options: ["\u0448\u0451\u043b", "\u0448\u043b\u0430", "\u0438\u0434\u043b", "\u0438\u0434\u0451\u043b"], answer: 0, hint: "\u0418\u0434\u0442\u0438 ma nieregularna forme przeszla: \u0448\u0451\u043b/\u0448\u043b\u0430/\u0448\u043b\u043e/\u0448\u043b\u0438" },
  { cat: "Czas przeszly", q: "\u041f\u0438\u0442\u044c \u2192 On pil = \u041e\u043d ...?", options: ["\u043f\u0438\u043b", "\u043f\u0438\u043b\u0430", "\u043f\u0438\u043b\u043e", "\u043f\u0438\u043b\u0438"], answer: 0 },

  // WYMIANY SPOLGLOSEK (27-34)
  { cat: "Wymiany", q: "\u0425\u043e\u0434\u0438\u0442\u044c (chodzic) \u2192 \u042f ...?", options: ["\u0445\u043e\u0434\u044e", "\u0445\u043e\u0436\u0443", "\u0445\u043e\u0434\u0443", "\u0445\u043e\u0436\u044e"], answer: 1, hint: "\u0434 \u2192 \u0436" },
  { cat: "Wymiany", q: "\u041f\u043b\u0430\u0442\u0438\u0442\u044c (placic) \u2192 \u042f ...?", options: ["\u043f\u043b\u0430\u0442\u044e", "\u043f\u043b\u0430\u0447\u0443", "\u043f\u043b\u0430\u0442\u044c\u044e", "\u043f\u043b\u0430\u0447\u044c\u044e"], answer: 1, hint: "\u0442 \u2192 \u0447" },
  { cat: "Wymiany", q: "\u041f\u0440\u043e\u0441\u0438\u0442\u044c (prosic) \u2192 \u042f ...?", options: ["\u043f\u0440\u043e\u0441\u044e", "\u043f\u0440\u043e\u0448\u0443", "\u043f\u0440\u043e\u0441\u044c\u044e", "\u043f\u0440\u043e\u0448\u044c\u044e"], answer: 1, hint: "\u0441 \u2192 \u0448" },
  { cat: "Wymiany", q: "\u041b\u044e\u0431\u0438\u0442\u044c (kochac) \u2192 \u042f ...?", options: ["\u043b\u044e\u0431\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043b\u044e\u0431\u044c\u044e", "\u043b\u044e\u0431\u0443"], answer: 1, hint: "\u0431 \u2192 \u0431\u043b" },
  { cat: "Wymiany", q: "\u041a\u0443\u043f\u0438\u0442\u044c (kupic) \u2192 \u042f ...?", options: ["\u043a\u0443\u043f\u044e", "\u043a\u0443\u043f\u043b\u044e", "\u043a\u0443\u043f\u044c\u044e", "\u043a\u0443\u043f\u0443"], answer: 1, hint: "\u043f \u2192 \u043f\u043b" },
  { cat: "Wymiany", q: "\u0427\u0438\u0441\u0442\u0438\u0442\u044c (czyscic) \u2192 \u042f ...?", options: ["\u0447\u0438\u0441\u0442\u044e", "\u0447\u0438\u0449\u0443", "\u0447\u0438\u0441\u0442\u044c\u044e", "\u0447\u0438\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449" },
  { cat: "Wymiany", q: "\u0425\u043e\u0434\u0438\u0442\u044c: \u042f \u0445\u043e\u0436\u0443. A \u0422\u044b ...?", options: ["\u0445\u043e\u0436\u0438\u0448\u044c", "\u0445\u043e\u0434\u0438\u0448\u044c", "\u0445\u043e\u0436\u0435\u0448\u044c", "\u0445\u043e\u0434\u0435\u0448\u044c"], answer: 1, hint: "Wymiana TYLKO w 1. osobie!" },
  { cat: "Wymiany", q: "Ktora forma NIE istnieje?", options: ["\u0445\u043e\u0436\u0443", "\u0432\u0438\u0434\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043f\u0438\u0448\u0443"], answer: 1, hint: "\u0432\u0438\u0434\u044e nie istnieje! Poprawnie: \u0432\u0438\u0436\u0443" },

  // ASPEKT (35-38)
  { cat: "Aspekt", q: "Codziennie czytam ksiazki - ktory aspekt?", options: ["Dokonany (\u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c)", "Niedokonany (\u0447\u0438\u0442\u0430\u0442\u044c)"], answer: 1, hint: "Czynnosc powtarzajaca sie = niedokonany" },
  { cat: "Aspekt", q: "Wczoraj przeczytalem ksiazke - ktory aspekt?", options: ["Dokonany (\u043f\u0440\u043e\u0447\u0438\u0442\u0430\u0442\u044c)", "Niedokonany (\u0447\u0438\u0442\u0430\u0442\u044c)"], answer: 0, hint: "Czynnosc zakonczona = dokonany" },
  { cat: "Aspekt", q: "Para dokonana do \u043f\u0438\u0441\u0430\u0442\u044c (pisac)?", options: ["\u043f\u043e\u043f\u0438\u0441\u0430\u0442\u044c", "\u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c", "\u0441\u043f\u0438\u0441\u0430\u0442\u044c", "\u0432\u044b\u043f\u0438\u0441\u0430\u0442\u044c"], answer: 1 },
  { cat: "Aspekt", q: "Para dokonana do \u0434\u0435\u043b\u0430\u0442\u044c (robic)?", options: ["\u0432\u044b\u0434\u0435\u043b\u0430\u0442\u044c", "\u0434\u043e\u0434\u0435\u043b\u0430\u0442\u044c", "\u0441\u0434\u0435\u043b\u0430\u0442\u044c", "\u043d\u0430\u0434\u0435\u043b\u0430\u0442\u044c"], answer: 2 },

  // SLOWKA (39-44)
  { cat: "Slowka", q: "Jak powiedziec 'dziekuje' po rosyjsku?", options: ["\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430", "\u0421\u043f\u0430\u0441\u0438\u0431\u043e", "\u041f\u0440\u0438\u0432\u0435\u0442", "\u0425\u043e\u0440\u043e\u0448\u043e"], answer: 1 },
  { cat: "Slowka", q: "Co znaczy '\u041a\u0430\u043a \u0434\u0435\u043b\u0430?'?", options: ["Jak masz na imie?", "Co slychac?", "Skad jestes?", "Ile masz lat?"], answer: 1 },
  { cat: "Slowka", q: "Co znaczy '\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435'?", options: ["Do widzenia", "Przepraszam", "Dzien dobry (formalnie)", "Prosze"], answer: 2 },
  { cat: "Slowka", q: "Co znaczy '\u043a\u043d\u0438\u0433\u0430'?", options: ["Kot", "Stol", "Okno", "Ksiazka"], answer: 3 },
  { cat: "Slowka", q: "Jak powiedziec 'tak' po rosyjsku?", options: ["\u041d\u0435\u0442", "\u0414\u0430", "\u041d\u0443", "\u0412\u043e\u0442"], answer: 1 },
  { cat: "Slowka", q: "Co znaczy '\u041f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430'?", options: ["Dziekuje", "Przepraszam", "Prosze", "Czesc"], answer: 2 },
]);

addExam("final", "Egzamin koncowy", "76 pytan z calego materialu", [
  // CYRYLICA (1-5)
  { cat: "Cyrylica", q: "Jak czytamy \u0412?", options: ["B", "W", "F", "G"], answer: 1 },
  { cat: "Cyrylica", q: "Jak czytamy \u0420?", options: ["P", "R", "G", "D"], answer: 1 },
  { cat: "Cyrylica", q: "Jak czytamy \u0421?", options: ["K", "C", "S", "Z"], answer: 2 },
  { cat: "Cyrylica", q: "Jak czytamy \u041d?", options: ["H", "M", "N", "P"], answer: 2 },
  { cat: "Cyrylica", q: "Co oznacza \u042c?", options: ["Twardy znak", "Miekki znak", "Samogloska", "Spolgloska"], answer: 1 },

  // I KONIUGACJA (6-10)
  { cat: "I konj.", q: "\u0414\u0443\u043c\u0430\u0442\u044c (myslec) \u2192 \u042f ...?", options: ["\u0434\u0443\u043c\u0430\u044e", "\u0434\u0443\u043c\u0430\u0435\u0448\u044c", "\u0434\u0443\u043c\u0430\u0435\u0442", "\u0434\u0443\u043c\u0430\u0435\u043c"], answer: 0 },
  { cat: "I konj.", q: "\u0427\u0438\u0442\u0430\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0447\u0438\u0442\u0430\u0435\u0442", "\u0447\u0438\u0442\u0430\u0435\u043c", "\u0447\u0438\u0442\u0430\u0435\u0442\u0435", "\u0447\u0438\u0442\u0430\u044e\u0442"], answer: 3 },
  { cat: "I konj.", q: "\u0420\u0430\u0431\u043e\u0442\u0430\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0440\u0430\u0431\u043e\u0442\u0430\u044e", "\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u0448\u044c", "\u0440\u0430\u0431\u043e\u0442\u0430\u0435\u043c", "\u0440\u0430\u0431\u043e\u0442\u0430\u044e\u0442"], answer: 2 },
  { cat: "I konj.", q: "\u0421\u043b\u0443\u0448\u0430\u0442\u044c \u2192 \u0422\u044b ...?", options: ["\u0441\u043b\u0443\u0448\u0430\u044e", "\u0441\u043b\u0443\u0448\u0430\u0435\u0448\u044c", "\u0441\u043b\u0443\u0448\u0430\u0435\u0442", "\u0441\u043b\u0443\u0448\u0430\u0435\u043c"], answer: 1 },
  { cat: "I konj.", q: "\u0417\u043d\u0430\u0442\u044c \u2192 \u0412\u044b ...?", options: ["\u0437\u043d\u0430\u044e", "\u0437\u043d\u0430\u0435\u0448\u044c", "\u0437\u043d\u0430\u0435\u043c", "\u0437\u043d\u0430\u0435\u0442\u0435"], answer: 3 },

  // II KONIUGACJA (11-15)
  { cat: "II konj.", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u044e", "\u0433\u043e\u0432\u043e\u0440\u0438\u0448\u044c", "\u0433\u043e\u0432\u043e\u0440\u0438\u0442", "\u0433\u043e\u0432\u043e\u0440\u0438\u043c"], answer: 0 },
  { cat: "II konj.", q: "\u0423\u0447\u0438\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0443\u0447\u0443", "\u0443\u0447\u0438\u0448\u044c", "\u0443\u0447\u0438\u0442", "\u0443\u0447\u0438\u043c"], answer: 2 },
  { cat: "II konj.", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u0438\u0442", "\u0433\u043e\u0432\u043e\u0440\u044f\u0442", "\u0433\u043e\u0432\u043e\u0440\u0438\u043c", "\u0433\u043e\u0432\u043e\u0440\u0438\u0442\u0435"], answer: 1 },
  { cat: "II konj.", q: "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c (-\u0435\u0442\u044c) \u2192 ktora konj.?", options: ["I konj.", "II konj.", "Nieregularny"], answer: 1, hint: "Wyjatek! Odmiana jak II konj." },
  { cat: "II konj.", q: "\u0412\u0438\u0434\u0435\u0442\u044c (-\u0435\u0442\u044c) \u2192 ktora konj.?", options: ["I konj.", "II konj.", "Nieregularny"], answer: 1, hint: "Kolejny wyjatek!" },

  // NIEREGULARNE (16-25)
  { cat: "Nieregularne", q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u042f ...?", options: ["\u0445\u043e\u0442\u044e", "\u0445\u043e\u0447\u0443", "\u0445\u043e\u0442\u0435\u044e", "\u0445\u043e\u0447\u044e"], answer: 1 },
  { cat: "Nieregularne", q: "\u0425\u043e\u0442\u0435\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0445\u043e\u0447\u0435\u043c", "\u0445\u043e\u0442\u0435\u043c", "\u0445\u043e\u0442\u0438\u043c", "\u0445\u043e\u0447\u0438\u043c"], answer: 2, hint: "L.mn. = II konj.! \u0445\u043e\u0442\u0438\u043c" },
  { cat: "Nieregularne", q: "\u0415\u0441\u0442\u044c \u2192 \u042f ...?", options: ["\u0435\u0434\u0443", "\u0435\u043c", "\u0435\u0448\u044c", "\u0435\u0441\u0442\u044e"], answer: 1 },
  { cat: "Nieregularne", q: "\u0415\u0441\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u0435\u0441\u0442", "\u0435\u0441\u044f\u0442", "\u0435\u0434\u044f\u0442", "\u0435\u0434\u0430\u0442"], answer: 2 },
  { cat: "Nieregularne", q: "\u041f\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043f\u0438\u044e", "\u043f\u044c\u044e", "\u043f\u0438\u0435\u044e", "\u043f\u044c\u0451\u044e"], answer: 1 },
  { cat: "Nieregularne", q: "\u041f\u0438\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u043f\u0438\u0435\u0442", "\u043f\u044c\u0451\u0442", "\u043f\u0438\u0442", "\u043f\u044c\u0435\u0442"], answer: 1 },
  { cat: "Nieregularne", q: "\u0416\u0438\u0442\u044c \u2192 \u041c\u044b ...?", options: ["\u0436\u0438\u0435\u043c", "\u0436\u0438\u0432\u0451\u043c", "\u0436\u0443\u0451\u043c", "\u0436\u0438\u043b\u0451\u043c"], answer: 1 },
  { cat: "Nieregularne", q: "\u041c\u043e\u0447\u044c \u2192 \u042f ...?", options: ["\u043c\u043e\u0436\u0443", "\u043c\u043e\u0447\u0443", "\u043c\u043e\u0433\u0443", "\u043c\u043e\u0447\u044c\u044e"], answer: 2 },
  { cat: "Nieregularne", q: "\u041c\u043e\u0447\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u043c\u043e\u0436\u0443\u0442", "\u043c\u043e\u0433\u0443\u0442", "\u043c\u043e\u0447\u0443\u0442", "\u043c\u043e\u0436\u0430\u0442"], answer: 1 },

  // CZAS PRZESZLY (26-31)
  { cat: "Przeszly", q: "\u0427\u0438\u0442\u0430\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0447\u0438\u0442\u0430\u043b", "\u0447\u0438\u0442\u0430\u043b\u0430", "\u0447\u0438\u0442\u0430\u043b\u043e", "\u0447\u0438\u0442\u0430\u043b\u0438"], answer: 0 },
  { cat: "Przeszly", q: "\u0413\u043e\u0432\u043e\u0440\u0438\u0442\u044c \u2192 \u041e\u043d\u0430 ...?", options: ["\u0433\u043e\u0432\u043e\u0440\u0438\u043b", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0430", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u043e", "\u0433\u043e\u0432\u043e\u0440\u0438\u043b\u0438"], answer: 1 },
  { cat: "Przeszly", q: "\u0418\u0434\u0442\u0438 \u2192 \u041e\u043d ...?", options: ["\u0448\u0451\u043b", "\u0448\u043b\u0430", "\u0438\u0434\u043b", "\u0438\u0434\u0451\u043b"], answer: 0, hint: "\u0418\u0434\u0442\u0438 \u2192 \u0448\u0451\u043b/\u0448\u043b\u0430/\u0448\u043b\u043e/\u0448\u043b\u0438" },
  { cat: "Przeszly", q: "\u041c\u043e\u0447\u044c \u2192 \u041e\u043d\u0430 ...?", options: ["\u043c\u043e\u0433", "\u043c\u043e\u0433\u043b\u0430", "\u043c\u043e\u0433\u043b\u043e", "\u043c\u043e\u0433\u043b\u0438"], answer: 1 },
  { cat: "Przeszly", q: "\u041f\u0438\u0442\u044c \u2192 \u041e\u043d\u0438 ...?", options: ["\u043f\u0438\u043b", "\u043f\u0438\u043b\u0430", "\u043f\u0438\u043b\u043e", "\u043f\u0438\u043b\u0438"], answer: 3 },
  { cat: "Przeszly", q: "\u0416\u0438\u0442\u044c \u2192 \u041e\u043d ...?", options: ["\u0436\u0438\u043b", "\u0436\u0438\u043b\u0430", "\u0436\u0438\u043b\u043e", "\u0436\u0438\u043b\u0438"], answer: 0 },

  // WYMIANY (32-39)
  { cat: "Wymiany", q: "\u0425\u043e\u0434\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u0445\u043e\u0434\u044e", "\u0445\u043e\u0436\u0443", "\u0445\u043e\u0434\u0443", "\u0445\u043e\u0436\u044e"], answer: 1, hint: "\u0434 \u2192 \u0436" },
  { cat: "Wymiany", q: "\u041f\u043b\u0430\u0442\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043f\u043b\u0430\u0442\u044e", "\u043f\u043b\u0430\u0447\u0443", "\u043f\u043b\u0430\u0442\u044c\u044e", "\u043f\u043b\u0430\u0447\u044c\u044e"], answer: 1, hint: "\u0442 \u2192 \u0447" },
  { cat: "Wymiany", q: "\u041f\u0440\u043e\u0441\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043f\u0440\u043e\u0441\u044e", "\u043f\u0440\u043e\u0448\u0443", "\u043f\u0440\u043e\u0441\u044c\u044e", "\u043f\u0440\u043e\u0448\u044c\u044e"], answer: 1, hint: "\u0441 \u2192 \u0448" },
  { cat: "Wymiany", q: "\u041b\u044e\u0431\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043b\u044e\u0431\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043b\u044e\u0431\u044c\u044e", "\u043b\u044e\u0431\u0443"], answer: 1, hint: "\u0431 \u2192 \u0431\u043b" },
  { cat: "Wymiany", q: "\u041a\u0443\u043f\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u043a\u0443\u043f\u044e", "\u043a\u0443\u043f\u043b\u044e", "\u043a\u0443\u043f\u044c\u044e", "\u043a\u0443\u043f\u0443"], answer: 1, hint: "\u043f \u2192 \u043f\u043b" },
  { cat: "Wymiany", q: "\u0427\u0438\u0441\u0442\u0438\u0442\u044c \u2192 \u042f ...?", options: ["\u0447\u0438\u0441\u0442\u044e", "\u0447\u0438\u0449\u0443", "\u0447\u0438\u0441\u0442\u044c\u044e", "\u0447\u0438\u0448\u0443"], answer: 1, hint: "\u0441\u0442 \u2192 \u0449" },
  { cat: "Wymiany", q: "\u0425\u043e\u0434\u0438\u0442\u044c: \u042f \u0445\u043e\u0436\u0443. A \u0422\u044b ...?", options: ["\u0445\u043e\u0436\u0438\u0448\u044c", "\u0445\u043e\u0434\u0438\u0448\u044c", "\u0445\u043e\u0436\u0435\u0448\u044c", "\u0445\u043e\u0434\u0435\u0448\u044c"], answer: 1, hint: "Wymiana TYLKO w 1. osobie!" },
  { cat: "Wymiany", q: "Ktora forma NIE istnieje?", options: ["\u0445\u043e\u0436\u0443", "\u0432\u0438\u0434\u044e", "\u043b\u044e\u0431\u043b\u044e", "\u043f\u0438\u0448\u0443"], answer: 1, hint: "Poprawnie: \u0432\u0438\u0436\u0443 (\u0434\u2192\u0436)" },

  // ASPEKT (40-43)
  { cat: "Aspekt", q: "'Codziennie czytam' \u2192 ktory aspekt?", options: ["Dokonany", "Niedokonany"], answer: 1 },
  { cat: "Aspekt", q: "'Wczoraj przeczytalem' \u2192 ktory aspekt?", options: ["Dokonany", "Niedokonany"], answer: 0 },
  { cat: "Aspekt", q: "Para dokonana do \u043f\u0438\u0441\u0430\u0442\u044c?", options: ["\u043f\u043e\u043f\u0438\u0441\u0430\u0442\u044c", "\u043d\u0430\u043f\u0438\u0441\u0430\u0442\u044c", "\u0441\u043f\u0438\u0441\u0430\u0442\u044c", "\u0432\u044b\u043f\u0438\u0441\u0430\u0442\u044c"], answer: 1 },
  { cat: "Aspekt", q: "Para dokonana do \u0434\u0435\u043b\u0430\u0442\u044c?", options: ["\u0432\u044b\u0434\u0435\u043b\u0430\u0442\u044c", "\u0434\u043e\u0434\u0435\u043b\u0430\u0442\u044c", "\u0441\u0434\u0435\u043b\u0430\u0442\u044c", "\u043d\u0430\u0434\u0435\u043b\u0430\u0442\u044c"], answer: 2 },

  // JEDZENIE (44-53)
  { cat: "Jedzenie", q: "Co to jest \u0445\u043b\u0435\u0431?", options: ["Ser", "Chleb", "Maslo", "Mieso"], answer: 1 },
  { cat: "Jedzenie", q: "Co to jest \u043c\u043e\u043b\u043e\u043a\u043e?", options: ["Mleko", "Maslo", "Mieso", "Marchewka"], answer: 0 },
  { cat: "Jedzenie", q: "Co to jest \u0447\u0430\u0439?", options: ["Herbata", "Kawa", "Sok", "Piwo"], answer: 0 },
  { cat: "Jedzenie", q: "Co to jest \u044f\u0431\u043b\u043e\u043a\u043e?", options: ["Jajko", "Jablko", "Jagoda", "Gruszka"], answer: 1 },
  { cat: "Jedzenie", q: "Co znaczy \u0437\u0430\u0432\u0442\u0440\u0430\u043a?", options: ["Kolacja", "Obiad", "Sniadanie", "Podwieczorek"], answer: 2 },
  { cat: "Jedzenie", q: "Co znaczy \u0432\u043a\u0443\u0441\u043d\u044b\u0439?", options: ["Ostry", "Smaczny", "Slodki", "Gorzki"], answer: 1 },
  { cat: "Jedzenie", q: "Co to jest \u043a\u0443\u0440\u0438\u0446\u0430?", options: ["Kukurydza", "Kurczak", "Kasza", "Kielbasa"], answer: 1 },
  { cat: "Jedzenie", q: "Jak powiedziec 'woda'?", options: ["\u0432\u0438\u043d\u043e", "\u0432\u043e\u0434\u0430", "\u0432\u043e\u0434\u043a\u0430", "\u0432\u043a\u0443\u0441\u043d\u044b\u0439"], answer: 1 },
  { cat: "Jedzenie", q: "Co znaczy \u0441\u043b\u0430\u0434\u043a\u0438\u0439?", options: ["Slony", "Kwasny", "Slodki", "Ostry"], answer: 2 },
  { cat: "Jedzenie", q: "Co to jest \u043e\u0433\u0443\u0440\u0435\u0446?", options: ["Ogon", "Orzech", "Ogorek", "Owoc"], answer: 2 },

  // PODROZE (54-63)
  { cat: "Podroze", q: "Co to jest \u0432\u043e\u043a\u0437\u0430\u043b?", options: ["Dworzec", "Wolontariat", "Wulkan", "Wokol"], answer: 0 },
  { cat: "Podroze", q: "Co to jest \u043c\u0430\u0433\u0430\u0437\u0438\u043d?", options: ["Magazyn", "Sklep", "Galeria", "Market"], answer: 1, hint: "Falszywy przyjaciel!" },
  { cat: "Podroze", q: "Co to jest \u0441\u0430\u043c\u043e\u043b\u0451\u0442?", options: ["Samolot", "Samochod", "Sanki", "Statek"], answer: 0 },
  { cat: "Podroze", q: "Co znaczy \u043d\u0430\u043b\u0435\u0432\u043e?", options: ["Na prawo", "Na lewo", "Prosto", "Do tylu"], answer: 1 },
  { cat: "Podroze", q: "Co znaczy \u043f\u0440\u044f\u043c\u043e?", options: ["Na lewo", "Na prawo", "W dol", "Prosto"], answer: 3 },
  { cat: "Podroze", q: "Co to jest \u043a\u0430\u0440\u0442\u0430?", options: ["Kartka", "Karta", "Mapa", "Karton"], answer: 2, hint: "\u041a\u0430\u0440\u0442\u0430 = mapa!" },
  { cat: "Podroze", q: "Co to jest \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430?", options: ["Gosciniec", "Hotel", "Gospoda", "Galeria"], answer: 1, hint: "Falszywy przyjaciel - to hotel!" },
  { cat: "Podroze", q: "Co to jest \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430?", options: ["Ostroga", "Przystanek", "Stacja", "Parking"], answer: 1 },
  { cat: "Podroze", q: "Co znaczy \u0437\u0434\u0435\u0441\u044c?", options: ["Tam", "Tutaj", "Wszedzie", "Nigdzie"], answer: 1 },
  { cat: "Podroze", q: "Co to jest \u043f\u043e\u0435\u0437\u0434?", options: ["Przejazd", "Pojazd", "Pociag", "Prom"], answer: 2 },

  // WYMOWA (64-68)
  { cat: "Wymowa", q: "Jak czytamy \u043c\u043e\u043b\u043e\u043a\u043e?", options: ["moloko", "malako", "molako", "maloko"], answer: 1, hint: "Nieakcentowane o = a!" },
  { cat: "Wymowa", q: "Jak czytamy \u0432\u043a\u0443\u0441\u043d\u044b\u0439?", options: ["wkusnyj", "fkusnyj", "vkusnyj", "ukusnyj"], answer: 1, hint: "\u0432 przed glucha = f" },
  { cat: "Wymowa", q: "Jak czytamy \u0432\u043e\u0434\u0430?", options: ["woda", "wada", "voda", "vada"], answer: 1, hint: "Akcent na -DA, wiec o = a" },
  { cat: "Wymowa", q: "Jak czytamy \u0441\u043b\u0430\u0434\u043a\u0438\u0439?", options: ["sladkij", "slatkij", "sladkoj", "slatkaj"], answer: 1, hint: "\u0434 przed \u043a = t" },
  { cat: "Wymowa", q: "Jak czytamy \u043e\u0441\u0442\u0430\u043d\u043e\u0432\u043a\u0430?", options: ["ostanowka", "astanofka", "ostanovka", "astanowka"], answer: 1, hint: "o = a, \u0432\u043a = fk" },

  // ZDANIA (69-76)
  { cat: "Zdania", q: "'Chce jesc' = ?", options: ["\u042f \u0445\u043e\u0447\u0443 \u043f\u0438\u0442\u044c", "\u042f \u0445\u043e\u0447\u0443 \u0435\u0441\u0442\u044c", "\u042f \u043c\u043e\u0433\u0443 \u0435\u0441\u0442\u044c", "\u042f \u043b\u044e\u0431\u043b\u044e \u0435\u0441\u0442\u044c"], answer: 1 },
  { cat: "Zdania", q: "'Pije kawe' = ?", options: ["\u042f \u043f\u044c\u044e \u0447\u0430\u0439", "\u042f \u0435\u043c \u043a\u043e\u0444\u0435", "\u042f \u043f\u044c\u044e \u043a\u043e\u0444\u0435", "\u042f \u0445\u043e\u0447\u0443 \u043a\u043e\u0444\u0435"], answer: 2 },
  { cat: "Zdania", q: "'Gdzie jest dworzec?' = ?", options: ["\u0413\u0434\u0435 \u0432\u043e\u043a\u0437\u0430\u043b?", "\u041a\u0430\u043a \u0432\u043e\u043a\u0437\u0430\u043b?", "\u0427\u0442\u043e \u0432\u043e\u043a\u0437\u0430\u043b?", "\u041a\u0443\u0434\u0430 \u0432\u043e\u043a\u0437\u0430\u043b?"], answer: 0 },
  { cat: "Zdania", q: "'Chcemy zupe' = ?", options: ["\u041c\u044b \u0445\u043e\u0447\u0435\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0442\u0438\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0442\u0435\u043c \u0441\u0443\u043f", "\u041c\u044b \u0445\u043e\u0447\u0438\u043c \u0441\u0443\u043f"], answer: 1 },
  { cat: "Zdania", q: "'Mieszkamy w hotelu' = ?", options: ["\u041c\u044b \u0436\u0438\u0432\u0435\u043c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0430", "\u041c\u044b \u0436\u0438\u0432\u0451\u043c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435", "\u041c\u044b \u0436\u0438\u0432\u0443 \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435", "\u041c\u044b \u0436\u0438\u0442\u044c \u0432 \u0433\u043e\u0441\u0442\u0438\u043d\u0438\u0446\u0435"], answer: 1 },
  { cat: "Zdania", q: "'Lubie rybe' = ?", options: ["\u042f \u043b\u044e\u0431\u043b\u044e \u0440\u044b\u0431\u0443", "\u042f \u043b\u044e\u0431\u043b\u044e \u0440\u044b\u0431\u0430", "\u042f \u043b\u044e\u0431\u044e \u0440\u044b\u0431\u0443", "\u042f \u043b\u044e\u0431\u0438\u0442\u044c \u0440\u044b\u0431\u0443"], answer: 0 },
  { cat: "Zdania", q: "'Idz prosto' = ?", options: ["\u0418\u0434\u0438\u0442\u0435 \u043d\u0430\u043b\u0435\u0432\u043e", "\u0418\u0434\u0438\u0442\u0435 \u043d\u0430\u043f\u0440\u0430\u0432\u043e", "\u0418\u0434\u0438\u0442\u0435 \u043f\u0440\u044f\u043c\u043e", "\u0418\u0434\u0438\u0442\u0435 \u0442\u0430\u043c"], answer: 2 },
  { cat: "Zdania", q: "'Co slychac?' = ?", options: ["\u041a\u0430\u043a \u0437\u043e\u0432\u0443\u0442?", "\u041a\u0430\u043a \u0434\u0435\u043b\u0430?", "\u0413\u0434\u0435 \u0442\u044b?", "\u041a\u0442\u043e \u0442\u044b?"], answer: 1 },
]);

