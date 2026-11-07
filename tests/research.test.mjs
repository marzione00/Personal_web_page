import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages,searchEntries} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-research-'));try{fs.cpSync(path.join(root,'content'),path.join(dir,'content'),{recursive:true});fs.cpSync(path.join(root,'public'),path.join(dir,'public'),{recursive:true});return fn(dir);}finally{fs.rmSync(dir,{recursive:true,force:true});}}
function change(dir,fn){const file=path.join(dir,'content/research.json');const data=JSON.parse(fs.readFileSync(file));fn(data);fs.writeFileSync(file,JSON.stringify(data));}
test('research separates research lines from method and teaching interests',()=>{
 const data=loadContent(root);assert.equal(data.research.areas.length,7);assert.deepEqual(data.research.areas.map(a=>a.group),['ricerca','ricerca','ricerca','ricerca','trasversale','approfondimenti','approfondimenti']);assert.equal(data.publications.length,17);
 const page=renderPages(data).find(x=>x.file==='ricerca.html');
 for(const area of data.research.areas)assert.ok(page.body.includes(`id="tema-${area.id}"`));
 assert.ok(page.body.includes('id="bibliografia"'));
 assert.equal((page.body.match(/class="publication-row publication-explained"/g)||[]).length,17);
});
test('research distinguishes quantum interest and teaching design from completed studies',()=>{
 const r=loadContent(root).research;
 const q=r.areas.find(a=>a.id==='calcolo-quantistico');assert.equal(q.group,'approfondimenti');assert.equal(q.publications.length,0);
 const t=r.areas.find(a=>a.id==='architettura-sistemi');assert.equal(t.group,'approfondimenti');
 assert.doesNotMatch(JSON.stringify(r),/curriculum|dal CV|nel CV/);
});
test('research themes and personal interests are searchable',()=>{
 const entries=searchEntries(loadContent(root));
 assert.ok(entries.some(e=>e.url==='ricerca.html#tema-calcolo-quantistico'));
 assert.ok(entries.some(e=>e.url==='cv.html#interessi-personali'));
});
test('research plain text cannot inject HTML',()=>{
 const data=loadContent(root);data.research.areas[0].overview='<script>window.evil=true</script>';
 data.research.areas[0].question='<img src=x onerror=alert(1)>';
 const html=renderPages(data).find(x=>x.file==='ricerca.html').body;
 assert.ok(html.includes('&lt;script&gt;'));assert.ok(!html.includes('<script>window'));
 assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img src=x'));
});
test('unknown publication references stop build',()=>fixture(dir=>{
 change(dir,r=>r.areas[0].publications=['invented-reference']);assert.throws(()=>loadContent(dir),/Riferimento bibliografico/);
}));
test('duplicate research IDs stop build',()=>fixture(dir=>{
 change(dir,r=>r.areas[1].id=r.areas[0].id);assert.throws(()=>loadContent(dir),/duplicato/);
}));
test('unsafe research IDs stop build',()=>fixture(dir=>{
 change(dir,r=>r.areas[0].id='../../injected');assert.throws(()=>loadContent(dir));
}));
test('oversized research text stops build',()=>fixture(dir=>{
 change(dir,r=>r.areas[0].overview='x'.repeat(6001));assert.throws(()=>loadContent(dir),/overview/);
}));
