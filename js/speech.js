(function () {
/* ============================================================
   MOWA — trzy poziomy, zawsze coś słychać

   1. Głos rosyjski, jeśli jest w systemie — czyta cyrylicę wprost.
   2. Brak rosyjskiego, jest polski — czyta transkrypcję fonetyczną.
      Polska fonetyka leży blisko rosyjskiej, więc „spasiba" wypowiedziane
      polskim głosem brzmi niemal jak спасибо. To nie proteza na siłę,
      tylko ta sama zasada, na której stoi cały kurs.
   3. Brak obu — cisza i uczciwy komunikat zamiast udawania.
   ============================================================ */

let voices = [];
let ruVoice = null;
let plVoice = null;
let chosenUri = null;
let primed = false;

const has = 'speechSynthesis' in window;

function refresh() {
  if (!has) return;
  const v = window.speechSynthesis.getVoices();
  if (!v || !v.length) return;
  voices = v;

  const pref = chosenUri && v.find((x) => x.voiceURI === chosenUri);
  ruVoice = pref && /^ru/i.test(pref.lang) ? pref
    : v.find((x) => x.lang === 'ru-RU') || v.find((x) => /^ru/i.test(x.lang)) || null;
  plVoice = pref && /^pl/i.test(pref.lang) ? pref
    : v.find((x) => x.lang === 'pl-PL') || v.find((x) => /^pl/i.test(x.lang)) || null;
}

if (has) {
  refresh();
  window.speechSynthesis.addEventListener('voiceschanged', refresh);
}

function mode() {
  if (!has) return 'none';
  if (ruVoice) return 'native';
  if (plVoice) return 'polish';
  return 'none';
}

function status() {
  const m = mode();
  return {
    mode: m,
    supported: has,
    voiceName: m === 'native' ? ruVoice.name : m === 'polish' ? plVoice.name : null,
    count: voices.length,
    russian: voices.filter((v) => /^ru/i.test(v.lang)).map((v) => v.name),
    all: voices.map((v) => ({ uri: v.voiceURI, name: v.name, lang: v.lang })),
  };
}

/* ------------------------------------------------------------
   Cyrylica → zapis, który polski syntezator przeczyta sensownie
   ------------------------------------------------------------ */

const SOFT_PAIRS = { 'е': 'ie', 'ё': 'io', 'ю': 'iu', 'я': 'ia' };
const IOT_PAIRS  = { 'е': 'je', 'ё': 'jo', 'ю': 'ju', 'я': 'ja' };
const VOWELS = 'аеёиоуыэюя';

const MAP = {
  'а': 'a', 'б': 'b', 'в': 'w', 'г': 'g', 'д': 'd', 'ж': 'ż', 'з': 'z',
  'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'ch',
  'ц': 'c', 'ч': 'cz', 'ш': 'sz', 'щ': 'szcz', 'ы': 'y', 'э': 'e',
  'ъ': '', 'ь': '',
};

/* Przybliżenie — bez znajomości akcentu nie da się oddać akania,
   więc „о" zostaje „o". Krzywdy nie robi, a nie zmyśla. */
function ruToPl(text) {
  const s = String(text).toLowerCase();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const prev = s[i - 1] || '';
    if (SOFT_PAIRS[ch]) {
      const iot = !prev || VOWELS.includes(prev) || prev === 'ъ' || prev === 'ь' || !/[а-я]/.test(prev);
      out += iot ? IOT_PAIRS[ch] : SOFT_PAIRS[ch];
      continue;
    }
    out += MAP[ch] != null ? MAP[ch] : ch;
  }
  return out;
}

/* Transkrypcja z bazy ma myślniki i WIELKIE litery na akcencie —
   czytelne dla oka, ale syntezator ma to wymówić, nie przeliterować. */
function trToSpeech(tr) {
  return String(tr)
    .replace(/[-–—]/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

/* ------------------------------------------------------------
   Wypowiadanie
   ------------------------------------------------------------ */

function prime() {
  if (primed || !has) return;
  primed = true;
  try {
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch (e) { /* część przeglądarek nie potrzebuje rozgrzewki */ }
}
['pointerdown', 'keydown'].forEach((ev) =>
  window.addEventListener(ev, prime, { once: true, capture: true }));

let lastCall = 0;

/*
  input: string z cyrylicą albo obiekt słowa { ru, tr }
*/
function speak(input, btn) {
  if (!Store.s.settings.tts || !has) return false;

  const word = typeof input === 'string' ? { ru: input, tr: null } : (input || {});
  const m = mode();
  if (m === 'none') return false;

  let text, lang, voice;
  if (m === 'native') {
    text = word.ru;
    lang = 'ru-RU';
    voice = ruVoice;
  } else {
    text = word.tr ? trToSpeech(word.tr) : ruToPl(word.ru);
    lang = 'pl-PL';
    voice = plVoice;
  }
  if (!text) return false;

  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.voice = voice;
    u.rate = m === 'native' ? 0.9 : 0.84;
    u.pitch = 1;

    /* Chrome potrafi zgubić wypowiedź zleconą w tej samej klatce co cancel() */
    const now = Date.now();
    const wait = now - lastCall < 120 ? 90 : 30;
    lastCall = now;
    setTimeout(() => { try { window.speechSynthesis.speak(u); } catch (e) {} }, wait);

    if (btn) {
      btn.classList.add('ringing');
      setTimeout(() => btn.classList.remove('ringing'), 700);
    }
    return true;
  } catch (e) {
    return false;
  }
}

function setVoice(uri) {
  chosenUri = uri || null;
  Store.s.settings.voice = chosenUri;
  refresh();
  Store.save();
}

function init() {
  chosenUri = Store.s.settings.voice || null;
  refresh();
}

window.Speech = { init, speak, status, setVoice, ruToPl, trToSpeech, refresh, mode };
})();
