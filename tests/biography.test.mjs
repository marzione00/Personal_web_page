import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('biography covers research, teaching and dated experience',()=>{
 const bio=loadContent(root).profile.biography;
 assert.ok(bio.split(/\n\s*\n/).length>=7);
 for(const word of ['grafene','ransomware','Cattolica','marzo 2026','ANNPR 2026','MUSA','Uni.ON','sicurezza informatica'])assert.ok(bio.includes(word),word);
});
test('public biography has no source narration or stock negated contrast',()=>{
 const p=loadContent(root).profile;
 for(const text of [p.biography,p.personalInterests,p.intro]){
  assert.doesNotMatch(text,/curriculum|\bCV\b|non solo|non soltanto|non.{0,100},? ma\b/i);
 }
});
test('personal interests cover practices without invented credentials',()=>{
 const interests=loadContent(root).profile.personalInterests;
 for(const word of ['Vinyasa Krama','Ashtanga Vinyasa','Yin Yoga','escursionismo','arrampicata'])assert.ok(interests.toLowerCase().includes(word.toLowerCase()));
 assert.doesNotMatch(interests,/istruttore|certificat|agonist|spedizion|ogni giorno|da bambino/i);
});
test('biography and personal interests render escaped and have navigation targets',()=>{
 const data=loadContent(root);
 data.profile.biography='<img src=x onerror=alert(1)>\n\nUna seconda frase.';
 data.profile.personalInterests='<script>alert(1)</script>';
 const page=renderPages(data).find(x=>x.file==='cv.html');
 assert.ok(page.body.includes('id="biografia"'));
 assert.ok(page.body.includes('id="interessi-personali"'));
 assert.ok(page.body.includes('href="cv.html#interessi-personali"'));
 assert.ok(page.body.includes('&lt;img'));assert.ok(!page.body.includes('<img src=x'));
 assert.ok(page.body.includes('&lt;script&gt;'));assert.ok(!page.body.includes('<script>alert'));
});
