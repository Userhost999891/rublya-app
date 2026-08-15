/* ============================================================
   RDZEŃ BAZY SŁÓWEK
   Format słowa: [rosyjski, polski, transkrypcja, przykład?, tłumaczenie przykładu?]
   Transkrypcja: zapis polski, WIELKIE LITERY = sylaba akcentowana.
   ============================================================ */

window.CATS = [];
window.WORDS = [];

window.addCat = function (id, name, ru, glyph, group, words) {
  const cat = { id, name, ru, glyph, group, count: words.length, from: WORDS.length };
  words.forEach((w, i) => {
    WORDS.push({
      id: id + ':' + i,
      cat: id,
      ru: w[0],
      pl: w[1],
      tr: w[2],
      ex: w[3] || null,
      exPl: w[4] || null,
    });
  });
  cat.to = WORDS.length;
  CATS.push(cat);
};

/* Grupy tematyczne kategorii — sterują kolejnością na ekranie „Słownictwo” */
window.CAT_GROUPS = [
  { id: 'core', name: 'Fundament', desc: 'Bez tego ani rusz' },
  { id: 'life', name: 'Życie codzienne', desc: 'Dom, jedzenie, zakupy' },
  { id: 'world', name: 'Świat wokół', desc: 'Miasto, podróż, przyroda' },
  { id: 'mind', name: 'Działanie i opis', desc: 'Czasowniki, cechy, emocje' },
  { id: 'build', name: 'Budulec zdania', desc: 'Liczby, przyimki, partykuły' },
  { id: 'street', name: 'Żywy rosyjski', desc: 'Tak mówią naprawdę' },
];
