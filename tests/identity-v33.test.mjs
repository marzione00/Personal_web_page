import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const brand='Topological Manifolds';
const stale=/Topological Manifold(?!s)|\bMDC_LAB\b|\bMDC LAB\b/;

test('current release uses one plural public name and keeps existing page addresses',()=>{
 const site=JSON.parse(read('content/site.json'));
 const pkg=JSON.parse(read('package.json'));
 assert.equal(site.name,brand);
 assert.equal(site.version,'3.15.0');
 assert.equal(pkg.version,'3.15.0');
 assert.equal(pkg.name,'topological-manifolds-personal-site');
 for(const lang of ['it','en']){
  const data=loadContent(root,{language:lang});
  const pages=renderPages(data);
  assert.equal(data.site.name,brand);
  assert.ok(pages.some(p=>p.file==='manifold.html'),'stable name page URL');
  for(const page of pages){
   const html=shellHtml({data,page,css:'',js:'',csp:"default-src 'none'"});
   assert.match(html,/<span class="brand-word">Topological Manifolds<\/span>/);
   assert.doesNotMatch(html,stale,`${lang}/${page.file}`);
  }
 }
});

test('the name refers to plural manifolds while preserving mathematical distinctions',()=>{
 const it=read('content/markdown/manifold.md'),en=read('content/markdown/en/manifold.md');
 assert.match(it,/Perché Topological Manifolds/);
 assert.match(en,/Why Topological Manifolds/);
 assert.match(it,/pluralità delle varietà topologiche/);
 assert.match(en,/The plural reflects/);
 assert.match(it,/con bordo/);
 assert.match(en,/half-plane/);
 assert.match(it,/non sono tutti varietà/);
 assert.match(en,/not all of which are manifolds/);
});

test('active instructions do not present obsolete CV or empty blog as current facts',()=>{
 for(const f of ['README.md','docs/PUBBLICAZIONE.md','docs/PROVENIENZA.md','docs/NOTE_EDITORIALI.md','docs/RIPRESA_E_MANUTENZIONE.md']){
  const text=read(f);
  assert.doesNotMatch(text,/Topological Manifold(?!s)/,f);
  assert.doesNotMatch(text,/Il PDF incluso è `CV_Marzio_De_Corato_versione_web.pdf`/,f);
  assert.doesNotMatch(text,/Il blog contiene soltanto un esempio/,f);
 }
 assert.match(read('docs/PUBBLICAZIONE.md'),/CV\.pdf/);
 assert.match(read('docs/PROVENIENZA.md'),/Colpire i nervi del sistema/);
 assert.match(read('docs/IDENTITA.md'),/Topological Manifolds/);
});

test('audio album metadata matches the plural brand with verified file digest',()=>{
 const meta=JSON.parse(read('content/music-manifest.json'));
 assert.equal(meta.album,brand);
 assert.equal(meta.bytes,fs.statSync(path.join(root,'public',meta.file)).size);
});
