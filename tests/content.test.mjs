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
test('Il primo saggio approvato compare nel blog pubblico e nelle anteprime',()=>{assert.ok(loadContent(root,{preview:true}).posts.some(p=>p.id==='colpire-i-nervi-del-sistema'&&!p.draft));assert.ok(loadContent(root).posts.some(p=>p.id==='colpire-i-nervi-del-sistema'&&p.sourceStatus==='approved'));});
test('Six courses confirmed, including ongoing teaching and quantum',()=>{assert.equal(loadContent(root,{preview:true}).courses.length,6);assert.equal(loadContent(root).courses.length,6);assert.ok(loadContent(root).courses.every(c=>c.verified));});
test('Publication catalogue retains at least the 17 CV references',()=>assert.ok(loadContent(root).publications.length>=17));
test('Teaching retains the seven supplied modules',()=>assert.ok(loadContent(root).lectures.length>=7));
test('Expired postdoc is not rewritten as present',()=>assert.ok(loadContent(root).profile.experience[0].detail.includes('marzo 2026')));
test('Production and preview include every approved article',()=>{for(const d of [loadContent(root),loadContent(root,{preview:true})]){const pages=renderPages(d);assert.ok(pages.length>=16);for(const post of d.posts)assert.ok(pages.some(p=>p.file==='articolo-'+post.id+'.html'));}});
test('Real supplied PDF passes baseline checks',()=>assert.equal(validateMedia(root).files,24));
test('Publishing with a future date excludes the article',()=>fixture(dir=>{changePost(dir,p=>{p.draft=false;p.demo=false;p.sourceStatus='approved';p.body='Saggio reale con testo compiuto per la prova di validazione.';p.date='2099-01-01';});assert.equal(loadContent(dir).posts.length,0);}));
test('Approved past-dated article is included',()=>fixture(dir=>{changePost(dir,p=>{p.draft=false;p.demo=false;p.sourceStatus='approved';p.body='Testo completo di verifica editoriale.';p.date='2025-01-01';});assert.equal(loadContent(dir).posts.length,1);}));
test('Impossible calendar dates fail build',()=>fixture(dir=>{changePost(dir,p=>p.date='2026-02-31');assert.throws(()=>loadContent(dir),/Data articolo/);}));
test('Post status must be boolean',()=>fixture(dir=>{changePost(dir,p=>p.draft='false');assert.throws(()=>loadContent(dir),/Stato articolo/);}));
test('Cover requires local raster path and accessible description',()=>fixture(dir=>{changePost(dir,p=>p.cover='/media/docs/x.pdf');assert.throws(()=>loadContent(dir),/Copertina/);}));
test('Lecture cannot refer to unknown course',()=>fixture(dir=>{fs.writeFileSync(path.join(dir,'content/lectures/test.json'),JSON.stringify({id:'test',title:'Test',course:'nonexistent',order:1,files:[],draft:true}));assert.throws(()=>loadContent(dir),/Corso inesistente/);}));
test('Collection path must match ID',()=>fixture(dir=>{changePost(dir,p=>p.id='different');assert.throws(()=>loadContent(dir),/deve corrispondere/);}));
test('Hostile Markdown titles are escaped in generated HTML',()=>fixture(dir=>{const f=path.join(dir,'content/markdown/publications/pub-01.md');let md=fs.readFileSync(f,'utf8');md=md.replace(/(## title\n)[^\n]+/,'$1<img src=x onerror=alert(1)>');fs.writeFileSync(f,md);const page=renderPages(loadContent(dir)).find(p=>p.file==='ricerca.html');assert.ok(page.body.includes('&lt;img'));assert.ok(!page.body.includes('<img src=x'));}));

test('Un articolo non approvato non può essere pubblicato',()=>fixture(dir=>{changePost(dir,p=>p.sourceStatus='needs-review');assert.throws(()=>loadContent(dir),/Articolo non approvato/);}));
test('Il segnaposto Markdown non può diventare un articolo pubblicato',()=>fixture(dir=>{const f=path.join(dir,'content/markdown/posts/colpire-i-nervi-del-sistema.md');fs.writeFileSync(f,'__MDC_IN_ATTESA_SOURCE__');assert.throws(()=>loadContent(dir),/ancora privo del testo integrale/);}));
