import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');

test('course and personal chronology remain coherent after revision',()=>{
 const p=loadContent(root).profile;
 const person=p.personalInterests;
 assert.match(person,/nel 2026, ha seguito anche un Teacher Training di 60 ore/);
 assert.match(person,/imparato l’arrampicata indoor con Luca Pani/);
 assert.doesNotMatch(person,/teacher training.{0,70}2025|Nel 2025 ha (?:seguito|frequentato) un Teacher Training/i);
 for(const name of ['Giada Merli','Alessandra Martin','Alexandra Santos','Camilla Vigorelli','Luca Pani'])assert.equal(person.split(name).length-1,1,name);
 assert.match(p.biography,/marzo 2026/);
 assert.match(p.biography,/Quantum e post-quantum computing/);
 assert.match(p.biography,/progetto MUSA/);
});
test('markdown and public content agree and avoid invented personal roles',()=>{
 const p=loadContent(root).profile;
 const md=fs.readFileSync(path.join(root,'docs/BIOGRAFIA.md'),'utf8');
 for(const s of [p.biography,p.personalInterests,p.intro])assert.ok(md.includes(s),'divergence between generated content and biographical document');
 for(const text of [p.biography,p.personalInterests])assert.doesNotMatch(text,/non solo.{0,120}ma|nel curriculum|nel CV|come intelligenza artificiale|certificato di insegnante/i);
});
