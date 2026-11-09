import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('all five teachers are credited once in the public biography',()=>{
 const p=loadContent(root).profile.personalInterests;
 for (const name of ['Giada Merli','Alessandra Martin','Alexandra Santos','Camilla Vigorelli','Luca Pani']) assert.equal(p.split(name).length-1,1,name);
 for (const practice of ['Vinyasa Krama','Ashtanga Vinyasa','Yin Yoga','Vinyasa']) assert.ok(p.includes(practice),practice);
 assert.match(p,/Alessandra Martin.*?Teacher Training di 60 ore/s);
 assert.match(p,/Alexandra Santos.*?continuo a praticare/s);
 assert.match(p,/deidentificazione/);
 assert.match(p,/Teacher Training di 60 ore/);
 assert.match(p,/ho seguito, nel 2026, un Teacher Training/);
 assert.doesNotMatch(p,/Teacher Training[^\n]*2025|Nel 2025 ha seguito un Teacher Training/i);
 assert.match(p,/arrampicata indoor, che ho imparato con Luca Pani/s);
 assert.match(p,/Camilla Vigorelli/s);
 assert.match(p,/procedure condivisibili e riscontri indipendenti/);
 assert.doesNotMatch(p,/non solo|non soltanto|non.{0,100},? ma\b|nel curriculum|ha dimostrato che lo yoga/i);
});
test('teachers appear in rendered CV and standalone biography',()=>{
 const cv=renderPages(loadContent(root)).find(p=>p.file==='cv.html').body;
 const md=fs.readFileSync(path.join(root,'docs/BIOGRAFIA.md'),'utf8');
 for (const name of ['Giada Merli','Alessandra Martin','Alexandra Santos','Camilla Vigorelli','Luca Pani']) {
  assert.ok(cv.includes(name),name);assert.ok(md.includes(name),name);
 }
});
