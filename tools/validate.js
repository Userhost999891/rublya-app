// Walidacja danych słownika: node tools/validate.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = path.join(__dirname, '..', 'data');
const ctx = { window: {} };
vm.createContext(ctx);
const files = fs.readdirSync(dir).filter(f => /^(a|b)\d.*\.js$/.test(f)).sort();
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });

const LIB = ctx.window.LIB;
const VOW = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
const plain = s => s.replace(/'/g, '').toLowerCase().replace(/ё/g, 'е');
let problems = 0, total = 0, refs = 0, examples = 0;
const seen = new Map();
const warn = (cat, line, msg) => { problems++; console.log(`[${cat}] ${msg}  →  ${line}`); };

function checkRu(cat, line, text) {
  // każde słowo wielosylabowe powinno mieć dokładnie jeden akcent (lub ё)
  const words = text.split(/[\s\-—–,.!?…«»;:()]+/).filter(Boolean);
  for (const w of words) {
    const vowels = [...w].filter(c => VOW.includes(c)).length;
    const marks = (w.match(/'/g) || []).length;
    const hasYo = /[ёЁ]/.test(w);
    if (/'/.test(w) && !/[аеёиоуыэюяАЕЁИОУЫЭЮЯ]'/.test(w)) warn(cat, line, `akcent nie po samogłosce: "${w}"`);
    if (marks > 1) warn(cat, line, `kilka akcentów w "${w}"`);
    if (hasYo && marks) warn(cat, line, `ё + akcent w "${w}"`);
    if (vowels > 1 && !marks && !hasYo && !/^[А-ЯЁ]{2,}$/.test(w) && !/^(нибудь|либо|то)$/.test(w)) warn(cat, line, `brak akcentu w "${w}"`);
    if (false) warn(cat, line, `zbędny akcent w jednosylabowym "${w}"`);
    if (/[a-z]/i.test(w)) warn(cat, line, `łacińska litera w "${w}"`);
  }
}

for (const c of LIB) {
  const lines = c.words.split('\n').map(s => s.trim()).filter(Boolean);
  if (!lines.length) warn(c.id, '', 'pusta kategoria');
  for (const line of lines) {
    if (line.startsWith('@')) { refs++; continue; }
    total++;
    const f = line.split('|');
    if (f.length < 2 || !f[0] || !f[1]) warn(c.id, line, 'za mało pól');
    if (f.length > 5) warn(c.id, line, 'za dużo pól');
    if (f[3] && !f[4]) warn(c.id, line, 'przykład bez tłumaczenia');
    if (f[3]) { examples++; checkRu(c.id, line, f[3]); }
    checkRu(c.id, line, f[0]);
    const key = plain(f[0]);
    if (seen.has(key)) warn(c.id, line, `duplikat (także w ${seen.get(key)})`);
    else seen.set(key, c.id);
  }
}
// odnośniki
for (const c of LIB) for (const line of c.words.split('\n').map(s => s.trim()).filter(s => s.startsWith('@'))) {
  if (!seen.has(plain(line.slice(1)))) warn(c.id, line, 'odnośnik do nieistniejącego słowa');
}
console.log(`\nKategorie: ${LIB.length}, słowa: ${total}, odnośniki: ${refs}, przykłady: ${examples}, problemy: ${problems}`);
for (const c of LIB) console.log(`  ${c.level} ${c.id.padEnd(11)} ${c.words.split('\n').filter(s => s.trim()).length}`);
