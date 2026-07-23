/* KaizoDex — data-integrity tests.  Run: node tests/test-data.js
 *
 * KaizoDex is data-driven: the dex renders from trainers.json and changes.json.
 * A malformed data file is the most likely way to ship a broken dex, so these
 * tests validate the data the application depends on, and that the shipped HTML
 * still references both files.
 */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let pass = 0, fail = 0;
const chk = (c, m) => { if (c) { pass++; console.log('pass  ' + m); }
                        else   { fail++; console.log('FAIL  ' + m); } };

function loadJSON(name) {
  const p = path.join(root, name);
  chk(fs.existsSync(p), name + ' exists');
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { fail++; console.log('FAIL  ' + name + ' is not valid JSON: ' + e.message); return null; }
}

const trainers = loadJSON('trainers.json');
const changes  = loadJSON('changes.json');

// trainers.json: array of trainers, each with a location, name and a team of mons.
if (trainers) {
  chk(Array.isArray(trainers) && trainers.length > 0, 'trainers.json is a non-empty array');
  chk(trainers.every(t => t && typeof t.name === 'string' && typeof t.loc === 'string'),
      'every trainer has a name and a location');
  chk(trainers.every(t => Array.isArray(t.team) && t.team.length >= 1),
      'every trainer has at least one Pokémon');
  const mons = trainers.flatMap(t => t.team);
  chk(mons.every(m => m && typeof m.species === 'string' && Number.isFinite(m.lv)),
      'every Pokémon has a species and a numeric level');
  chk(mons.every(m => Array.isArray(m.moves)), 'every Pokémon has a moves array');
}

// changes.json: the romhack's stat/ability/type edits.
if (changes) {
  chk(changes && typeof changes === 'object' && !Array.isArray(changes),
      'changes.json is an object of change categories');
  chk(Array.isArray(changes.abilities) && changes.abilities.length > 0,
      'changes.abilities is a non-empty array');
  chk(changes.abilities.every(a => a && a.m && a.old !== undefined && a.new !== undefined),
      'every ability change names the mon, the old value and the new value');
}

// The shipped HTML must still load both data files.
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
chk(html.includes('trainers.json'), 'index.html references trainers.json');
chk(html.includes('changes.json'),  'index.html references changes.json');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
