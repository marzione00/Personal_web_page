import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const digest=x=>createHash('sha256').update(x).digest('hex');
const data=loadContent(root),pages=renderPages(data);
test('homepage uses approved photograph rather than a silent fallback',()=>{
 const home=pages.find(p=>p.file==='index.html').body;
 assert.equal((home.match(/class="hero-portrait"/g)||[]).length,1);
 assert.match(home,/src="media\/images\/homepage-portrait.jpg"/);
 assert.match(home,/width="1274" height="2048"/);
});
test('all original photographs match approved file hashes',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'content/photo-manifest.json')));
 assert.equal(manifest.length,5);
 for(const m of manifest){const b=fs.readFileSync(path.join(root,'public',m.path));assert.equal(digest(b),m.sha256);assert.equal(b.length,m.bytes);assert.equal(m.transformation,'none');}
 assert.equal(manifest[0].sha256,'c848f8613827ad1a38443e61ccfe4ca9ef78ea9a93111055c239ac389a763e55');
});
test('photo presentation contains no filters or clipping',()=>{
 const css=fs.readFileSync(path.join(root,'src/visual.css'),'utf8');
 assert.match(css,/\.hero-portrait img\{[^}]*height:auto/);
 assert.match(css,/\.hero-portrait img\{[^}]*object-fit:contain/);
 assert.match(css,/\.hero-portrait img\{[^}]*filter:none/);
 assert.doesNotMatch(css,/\.hero-portrait img\{[^}]*object-fit:cover/);
});
test('heterogeneous geometry assets are complete and not repeated under different names',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json')));
 assert.equal(manifest.length,24);
 assert.equal(new Set(manifest.map(g=>g.sha256)).size,24);
 for(const g of manifest){assert.equal(digest(fs.readFileSync(path.join(root,'public/geometry',g.file))),g.sha256);assert.equal(g.labels,false);}
 for(const id of ['gyroid','schwarz-p','schwarz-d','julia','sierpinski','helicoid','torus'])assert.ok(manifest.some(g=>g.id===id));
});
test('SVGs contain shapes only, without captions, remote resources or scripts',()=>{
 for(const f of fs.readdirSync(path.join(root,'public/geometry')).filter(f=>f.endsWith('.svg'))){
  const svg=fs.readFileSync(path.join(root,'public/geometry',f),'utf8');
  assert.doesNotMatch(svg,/<(?:text|script|image|use|foreignObject)\b|\son\w+=|href=|style=/i);
  assert.match(svg,/viewBox="0 0 640 640"/);
 }
});
test('old decorative labels and photo placeholders are absent in rendered public pages',()=>{
 const publicText=pages.map(p=>p.body).join('\n');
 assert.doesNotMatch(publicText,/motivo geometrico|figure geometriche|FIG\. 01|STRUTTURE \/ CONNESSIONI|MDC \/ 001|TRAME \/ GEOMETRIE|VISUALIZZAZIONE ASTRATTA|FOTOGRAFIA<br>DA INSERIRE|__MDC_IN_ATTESA_SOURCE__/i);
 assert.doesNotMatch(publicText,/Fonte curriculum:|Fonte CV:/);
});
test('distinct mathematical geometry reaches real pages, not only source functions',()=>{
 const text=pages.map(p=>p.body).join('\n');
 for(const id of ['gyroid','schwarz-p','schwarz-d','julia','sierpinski','helicoid','torus'])assert.ok(text.includes(`data-geometry="${id}"`));
 for(const file of ['index.html','didattica.html','ricerca.html','cv.html','blog.html','geometrie.html'])assert.ok(pages.find(p=>p.file===file).body.includes('data-geometry='),file);
});
