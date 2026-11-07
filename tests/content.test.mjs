import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
import {validateMedia} from '../src/media.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function fixture(fn){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-test-'));try{fs.cpSync(path.join(root,'content'),path.join(dir,'content'),{recursive:true});fs.cpSync(path.join(root,'public'),path.join(dir,'public'),{recursive:true});return fn(dir);}finally{fs.rmSync(dir,{force:true,recursive:true});}}
function changePost(dir,edit){const file=path.join(dir,'content/posts/colpire-i-nervi-del-sistema.json');const p=JSON.parse(fs.readFileSync(file));edit(p);fs.writeFileSync(file,JSON.stringify(p));}
test('Anteprima include soltanto la bozza non pubblicata; il pubblico la esclude',()=>{assert.ok(loadContent(root,{preview:true}).posts.some(p=>p.id==='colpire-i-nervi-del-sistema'&&p.draft));assert.ok(loadContent(root).posts.every(p=>!p.demo&&!p.draft));});
test('Six courses confirmed, including ongoing teaching and quantum',()=>{assert.equal(loadContent(root,{preview:true}).courses.length,6);assert.equal(loadContent(root).courses.length,6);assert.ok(loadContent(root).courses.every(c=>c.verified));});
test('Publication catalogue retains 17 CV references',()=>assert.equal(loadContent(root).publications.length,17));
test('Teaching includes exactly the seven supplied modules',()=>assert.equal(loadContent(root).lectures.length,7));
test('Expired postdoc is not rewritten as present',()=>assert.ok(loadContent(root).profile.experience[0].detail.includes('marzo 2026')));
test('Production and preview page counts',()=>{assert.equal(renderPages(loadContent(root)).length,15);assert.equal(renderPages(loadContent(root,{preview:true})).length,16);});
test('Real supplied PDF passes baseline checks',()=>assert.equal(validateMedia(root).files,16));
test('Publishing with a future date excludes the article',()=>fixture(dir=>{changePost(dir,p=>{p.draft=false;p.demo=false;p.sourceStatus='approved';p.body='Saggio reale con testo compiuto per la prova di validazione.';p.date='2099-01-01';});assert.equal(loadContent(dir).posts.length,0);}));
test('Approved past-dated article is included',()=>fixture(dir=>{changePost(dir,p=>{p.draft=false;p.demo=false;p.sourceStatus='approved';p.body='Testo completo di verifica editoriale.';p.date='2025-01-01';});assert.equal(loadContent(dir).posts.length,1);}));
test('Impossible calendar dates fail build',()=>fixture(dir=>{changePost(dir,p=>p.date='2026-02-31');assert.throws(()=>loadContent(dir),/Data articolo/);}));
test('Post status must be boolean',()=>fixture(dir=>{changePost(dir,p=>p.draft='false');assert.throws(()=>loadContent(dir),/Stato articolo/);}));
test('Cover requires local raster path and accessible description',()=>fixture(dir=>{changePost(dir,p=>p.cover='/media/docs/x.pdf');assert.throws(()=>loadContent(dir),/Copertina/);}));
test('Lecture cannot refer to unknown course',()=>fixture(dir=>{fs.writeFileSync(path.join(dir,'content/lectures/test.json'),JSON.stringify({id:'test',title:'Test',course:'nonexistent',order:1,files:[],draft:true}));assert.throws(()=>loadContent(dir),/Corso inesistente/);}));
test('Collection path must match ID',()=>fixture(dir=>{changePost(dir,p=>p.id='different');assert.throws(()=>loadContent(dir),/deve corrispondere/);}));
test('Hostile titles are escaped in generated HTML',()=>fixture(dir=>{const f=path.join(dir,'content/publications/pub-01.json');const p=JSON.parse(fs.readFileSync(f));p.title='<img src=x onerror=alert(1)>';fs.writeFileSync(f,JSON.stringify(p));const page=renderPages(loadContent(dir)).find(p=>p.file==='ricerca.html');assert.ok(page.body.includes('&lt;img'));assert.ok(!page.body.includes('<img src=x'));}));

test('La bozza Overleaf resta esclusa se si disattiva solo il flag draft',()=>fixture(dir=>{changePost(dir,p=>p.draft=false);assert.throws(()=>loadContent(dir),/Articolo non approvato/);}));
test('Il segnaposto non può diventare un articolo pubblicato',()=>fixture(dir=>{changePost(dir,p=>{p.draft=false;p.sourceStatus='approved';});assert.throws(()=>loadContent(dir),/ancora privo del testo integrale/);}));
