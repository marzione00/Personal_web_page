import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(fn){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-md-'));
 try{
  fs.cpSync(path.join(root,'content'),path.join(dir,'content'),{recursive:true});
  fs.cpSync(path.join(root,'public'),path.join(dir,'public'),{recursive:true});
  return fn(dir);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
function page(data,filename){return renderPages(data).find(p=>p.file===filename)?.body||'';}
test('approved home wording and three complete epigraphs remain on the appropriate pages',()=>{
 const data=loadContent(root),home=page(data,'index.html');
 for(const phrase of ['Cybersecurity · Explainable AI · Teoria dell’informazione · Quantum Computing · Finanza quantitativa','proprietà ottiche e vibrazionali delle nanostrutture di grafene','yoga e','Platone','Wheeler','Engel'])assert.ok(['index.html','cv.html','manifold.html'].some(f=>page(data,f).includes(phrase)),phrase);
 assert.equal((page(data,'manifold.html').match(/class="epigraph-card"/g)||[]).length,3);
 assert.equal((home.match(/class="epigraph-card"/g)||[]).length,0);
 assert.doesNotMatch(home,/Fisica computazionale\.<br>Intelligenza artificiale spiegabile|in prospettiva sociale|altresì|motivo geometrico/i);
 assert.equal((home.match(/class="hero-portrait"/g)||[]).length,1);
});
test('editing only Markdown changes the public homepage without JSON edits',()=>fixture(dir=>{
 const file=path.join(dir,'content/markdown/homepage.md');
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('sicurezza informatica','sicurezza informatica avanzata'));
 assert.match(page(loadContent(dir),'index.html'),/sicurezza informatica avanzata/);
}));
test('editing only biography Markdown updates the CV',()=>fixture(dir=>{
 const file=path.join(dir,'content/markdown/profilo.md');
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('Giada Merli','Giada Merli (prova)'));
 assert.match(page(loadContent(dir),'cv.html'),/Giada Merli \(prova\)/);
}));
test('new second article is published from a standalone Markdown file',()=>fixture(dir=>{
 const source=`---
title: Nuovo articolo di prova
date: 2026-11-08
category: Analisi
excerpt: Sintesi di prova, completa e autonoma.
draft: false
---

## Introduzione

Testo di un secondo articolo dimostrativo.`;
 fs.writeFileSync(path.join(dir,'content/markdown/posts/secondo-articolo.md'),source);
 const data=loadContent(dir);
 assert.ok(data.posts.length>=2);
 assert.ok(page(data,'blog.html').includes('Nuovo articolo di prova'));
 assert.match(page(data,'articolo-secondo-articolo.html'),/secondo articolo dimostrativo/);
}));
test('a new draft Markdown post stays excluded from the public site',()=>fixture(dir=>{
 const source=`---
title: Bozza di prova
date: 2026-11-08
category: Appunti
excerpt: Sintesi di una bozza.
draft: true
---

Una bozza privata dalla pubblicazione.`;
 fs.writeFileSync(path.join(dir,'content/markdown/posts/bozza-prova.md'),source);
 assert.ok(!loadContent(dir).posts.some(x=>x.id==='bozza-prova'));
 assert.ok(!page(loadContent(dir),'blog.html').includes('Bozza di prova'));
 assert.ok(loadContent(dir,{preview:true}).posts.some(x=>x.id==='bozza-prova'));
}));
test('unsafe markup in Markdown is never executed as HTML',()=>fixture(dir=>{
 const file=path.join(dir,'content/markdown/homepage.md');
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace('sicurezza informatica','<script>alert(1)</script>'));
 const html=page(loadContent(dir),'index.html');
 assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
 assert.ok(!html.includes('<script>alert(1)</script>'));
}));
