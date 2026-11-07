import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const content=loadContent(root),html=Object.fromEntries(renderPages(content).map(x=>[x.file,x.body]));
test('Research groups scientific lines by evidence and activity',()=>{
 const a=content.research.areas;
 assert.equal(a.filter(x=>x.group==='ricerca').length,4);
 assert.equal(a.filter(x=>x.group==='trasversale').length,1);
 assert.equal(a.filter(x=>x.group==='approfondimenti').length,2);
 assert.match(html['ricerca.html'],/Linee di ricerca documentate/);
 assert.match(html['ricerca.html'],/Questioni trasversali/);
 assert.match(html['ricerca.html'],/Interessi e insegnamento/);
 assert.equal((html['ricerca.html'].match(/id="tema-/g)||[]).length,7);
});
test('outdated didactics notice is gone and PDF modules remain',()=>{
 assert.doesNotMatch(html['didattica.html'],/Non sono ancora stati caricati file di lezioni/);
 assert.match(html['didattica.html'],/sette moduli/);
 assert.equal((html['corso-quantum-post-quantum-computing-2026-2027.html'].match(/aria-label="Scarica PDF:/g)||[]).length,7);
});
test('CV introduction is separate from the long biography',()=>{
 assert.match(html['cv.html'],/Fisica computazionale · Intelligenza artificiale spiegabile/);
 assert.ok(!html['cv.html'].includes('<p>'+content.profile.intro+'</p>'));
 assert.match(content.profile.personalInterests,/deidentificazione/);
});
test('selected editorial boilerplate is absent from public fields',()=>{
 const p=content.profile,r=content.research;
 const fields=[p.intro,p.biography,p.personalInterests,r.introduction,r.connections,...r.areas.flatMap(a=>[a.summary,a.question,a.overview,a.approach]),...content.publications.flatMap(x=>[x.plainTitle,x.plainSummary,x.explanation].filter(Boolean))].join(' ');
 assert.doesNotMatch(fields,/in questa prospettiva|a questi temi si aggiungono|costituisce un interesse|si accompagna|non solo|non soltanto|nel panorama|in questo contesto|trova spazio/i);
});
test('no stale presentation copy and no old release number in current data',()=>{
 assert.equal(content.site.version,'1.5');
 assert.doesNotMatch(html['didattica.html'],/I titoli delle schede e dei file sono stati uniformati/);
 assert.doesNotMatch(html['ricerca.html'],/A questi ambiti si accompagna/);
});
test('all seven original lesson modules remain attached to original checksums',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/MATERIALI_MANIFEST.json')));
 assert.equal(manifest.files.length,7);
 const lectures=content.lectures.filter(x=>x.course==='quantum-post-quantum-computing-2026-2027');
 assert.deepEqual(lectures.map(x=>x.order),[1,2,3,4,5,6,7]);
 for(const f of manifest.files){
  const match=lectures.find(l=>l.files[0].endsWith(f.filename));assert.ok(match);
 }
});
