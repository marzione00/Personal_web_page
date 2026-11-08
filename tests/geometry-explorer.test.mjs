import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';
import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';import {renderPages} from '../src/render.mjs';
import {loadGeometry,geometryInfo} from '../src/geometry.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=loadContent(root),pages=renderPages(data),hash=b=>createHash('sha256').update(b).digest('hex');
test('24 distinct geometry models have matching binary snapshots and image previews',()=>{
 assert.equal(data.geometry.items.length,24);const seen=new Set();
 for(const g of data.geometry.items){const b=fs.readFileSync(path.join(root,'public/geometry',g.scene));
  assert.equal(b.toString('ascii',0,4),'MDC3');assert.equal(hash(b),g.sceneSha256);assert.ok(!seen.has(hash(b)));seen.add(hash(b));
  assert.equal(b.readUInt32LE(4),g.vertices);assert.equal(b.readUInt32LE(8),g.triangles*3);
  const size=24+g.vertices*9;assert.equal(b.length,size+(size%2)+g.triangles*6);
  assert.equal(hash(fs.readFileSync(path.join(root,'public/geometry',g.file))),g.sha256);
 }
});
test('graphics obey the declared lightweight budgets',()=>{
 assert.ok(data.geometry.items.reduce((n,g)=>n+g.bytes,0)<1000000);
 assert.ok(data.geometry.items.reduce((n,g)=>n+g.sceneBytes,0)<2000000);
 for(const g of data.geometry.items)assert.ok(g.sceneBytes<210000,g.id);
 assert.ok(fs.statSync(path.join(root,'public/assets/geometry-viewer.js')).size<12000);
});
test('no geometry repeats within an editorial page; atlas presents each once',()=>{
 for(const p of pages){const ids=[...p.body.matchAll(/data-geometry="([a-z-]+)"/g)].map(x=>x[1]);assert.equal(new Set(ids).size,ids.length,p.file);}
 const home=pages.find(x=>x.file==='index.html');assert.equal([...home.body.matchAll(/data-geometry="/g)].length,6);
 assert.equal([...pages.find(x=>x.file==='geometrie.html').body.matchAll(/data-geometry="/g)].length,24);
});
test('delivered editorial illustrations are not recycled across sections',()=>{
 const placements=new Map();for(const p of pages.filter(x=>x.file!=='geometrie.html'))for(const m of p.body.matchAll(/data-geometry="([a-z-]+)"/g)){assert.ok(!placements.has(m[1]),m[1]+' repeated on '+p.file);placements.set(m[1],p.file);}
 assert.ok(placements.size>=20);
});
test('quantum / post-quantum explanations use different appropriate subjects',()=>{
 const c=pages.find(x=>x.file==='corso-quantum-post-quantum-computing-2026-2027.html').body;
 assert.match(c,/data-geometry="bloch-sphere"/);assert.match(c,/data-geometry="lattice"/);assert.doesNotMatch(c,/data-geometry="schwarz-d"/);
});
test('every model includes an editable explanation, formula and explicit limitations',()=>{
 for(const g of data.geometry.items){for(const k of ['titolo','tema','formula','spiegazione','limiti','fonti'])assert.ok(g[k]);
 assert.match(geometryInfo(g),/role="math"/);assert.match(geometryInfo(g),/Come leggere il modello/);}
 assert.match(data.geometry.byId['schwarz-network'].limiti,/Non è un modello atomistico/);
 assert.match(data.geometry.byId['vibrational-mode'].limiti,/Non è un modo normale/);
 assert.match(data.geometry.byId.julia.limiti,/frattale è piano/);
});
test('only Markdown is needed to change a geometric explanation',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-geometry-'));
 try{fs.mkdirSync(path.join(tmp,'public/geometry'),{recursive:true});fs.copyFileSync(path.join(root,'public/geometry/manifest.json'),path.join(tmp,'public/geometry/manifest.json'));fs.mkdirSync(path.join(tmp,'content/markdown'),{recursive:true});fs.cpSync(path.join(root,'content/markdown/geometrie'),path.join(tmp,'content/markdown/geometrie'),{recursive:true});
 const f=path.join(tmp,'content/markdown/geometrie/gyroid.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('## spiegazione','## spiegazione\nTest editoriale autonomo.'));
 assert.match(loadGeometry(tmp).byId.gyroid.spiegazione,/Test editoriale autonomo/);
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('geometry copy cannot introduce executable HTML',()=>{
 const g={...data.geometry.byId.gyroid,spiegazione:'<img src=x onerror=alert(1)>',formula:'</pre><script>x</script>'};const h=geometryInfo(g);assert.ok(!h.includes('<script>'));assert.ok(h.includes('&lt;script&gt;'));
});
test('the home renders full Markdown quotations without editorial truncation',()=>{
 const home=pages.find(p=>p.file==='index.html').body;
 for(const q of data.epigraphs){assert.ok(q.quote.length>100);assert.ok(!q.quote.includes('[...]'));assert.ok(home.includes(q.quote.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')));}
 assert.match(home,/immaterial source and explanation/);assert.match(home,/most passionate years of his life/);
});
test('progressive loader avoids content-to-code conversion and has bounded cache',()=>{
 const s=fs.readFileSync(path.join(root,'src/geometry-loader.js'),'utf8');assert.doesNotMatch(s,/innerHTML|\beval\s*\(|new Function/);assert.match(s,/cache.size>5/);assert.match(s,/prefers-reduced-motion/);assert.match(s,/visibilitychange/);assert.match(s,/IntersectionObserver/);
});
