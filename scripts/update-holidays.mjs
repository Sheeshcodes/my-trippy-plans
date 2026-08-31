#!/usr/bin/env node
/* Maintenance for src/data/holidays-in.json.
 *
 * Why this exists: India's holidays cannot be pulled from a free API below the
 * national level, and the big ones (Diwali, Holi, Eid, Dussehra) are lunar, so
 * they move every year. This script does the part a machine can do honestly:
 *   - generates the fixed-date holidays for any year (they are arithmetic),
 *   - tells you which years are thin and which entries still need verifying,
 *   - never invents a lunar date.
 *
 *   node scripts/update-holidays.mjs                 report coverage + what needs checking
 *   node scripts/update-holidays.mjs --add-year 2029 append that year's fixed-date holidays
 *   node scripts/update-holidays.mjs --verified <id> [<id>...]   clear the verify flag
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/holidays-in.json');
const db = JSON.parse(readFileSync(FILE, 'utf8'));

// Statutory / calendar-fixed. Everything else is lunar and must come from a human.
const FIXED = [
  ['01-01', 'New Year’s Day', 'observance'],
  ['01-26', 'Republic Day', 'gazetted'],
  ['04-14', 'Ambedkar Jayanti', 'gazetted'],
  ['08-15', 'Independence Day', 'gazetted'],
  ['10-02', 'Gandhi Jayanti', 'gazetted'],
  ['12-25', 'Christmas', 'gazetted'],
];
const slug = (s) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const save = () => { writeFileSync(FILE, JSON.stringify(db, null, 2) + '\n'); };

const args = process.argv.slice(2);
const flag = (n) => args.indexOf(n);

if (flag('--add-year') > -1) {
  const year = Number(args[flag('--add-year') + 1]);
  if (!Number.isInteger(year)) { console.error('--add-year needs a year, e.g. 2029'); process.exit(1); }
  let added = 0;
  for (const [md, name, type] of FIXED) {
    const id = `${slug(name)}-${year}`;
    if (db.holidays.some((h) => h.id === id)) continue;
    db.holidays.push({ id, date: `${year}-${md}`, name, scope: 'national', type, fixed: true, verify: false });
    added++;
  }
  db.holidays.sort((a, b) => a.date.localeCompare(b.date));
  db.updated = new Date().toISOString().slice(0, 10);
  if (db.coverage.to < `${year}-12-31`) db.coverage.to = `${year}-12-31`;
  save();
  console.log(`Added ${added} fixed-date holidays for ${year}.`);
  console.log('Lunar holidays for that year (Diwali, Holi, Eid, Dussehra, Guru Nanak Jayanti,');
  console.log('Janmashtami, Ganesh Chaturthi, Onam, Pongal) must still be added by hand.');
  process.exit(0);
}

if (flag('--verified') > -1) {
  const ids = args.slice(flag('--verified') + 1).filter((a) => !a.startsWith('--'));
  let n = 0;
  for (const h of db.holidays) if (ids.includes(h.id) && h.verify) { h.verify = false; h.verifiedOn = new Date().toISOString().slice(0, 10); n++; }
  if (n) { db.updated = new Date().toISOString().slice(0, 10); save(); }
  console.log(`Cleared the verify flag on ${n} entr${n === 1 ? 'y' : 'ies'}.`);
  const missed = ids.filter((id) => !db.holidays.some((h) => h.id === id));
  if (missed.length) console.log('Not found:', missed.join(', '));
  process.exit(0);
}

// default: report
const today = new Date().toISOString().slice(0, 10);
const upcoming = db.holidays.filter((h) => h.date >= today).sort((a, b) => a.date.localeCompare(b.date));
const byYear = {};
for (const h of upcoming) (byYear[h.date.slice(0, 4)] ||= []).push(h);

console.log(`holidays-in.json  ·  updated ${db.updated}  ·  covers ${db.coverage.from} to ${db.coverage.to}`);
console.log(`${db.holidays.length} entries, ${upcoming.length} still ahead of today (${today}).\n`);

for (const [year, list] of Object.entries(byYear)) {
  const lunar = list.filter((h) => !h.fixed).length;
  const thin = lunar < 6 ? '   <-- thin: lunar holidays likely missing' : '';
  console.log(`  ${year}: ${list.length} entries (${lunar} lunar/state)${thin}`);
}

const needsCheck = upcoming.filter((h) => h.verify);
if (needsCheck.length) {
  console.log(`\n${needsCheck.length} upcoming entr${needsCheck.length === 1 ? 'y needs' : 'ies need'} verifying against the gazette:`);
  for (const h of needsCheck) {
    const d = new Date(h.date + 'T00:00:00Z');
    console.log(`  ${h.date} (${d.toUTCString().slice(0, 3)})  ${h.name}${h.note ? '  — ' + h.note : ''}`);
  }
  console.log('\nOnce confirmed:  node scripts/update-holidays.mjs --verified <id> <id> ...');
}

const lastYear = db.coverage.to.slice(0, 4);
if (Number(lastYear) - Number(today.slice(0, 4)) < 2) {
  console.log(`\nCoverage ends ${db.coverage.to}. Add the next year:  node scripts/update-holidays.mjs --add-year ${Number(lastYear) + 1}`);
}
