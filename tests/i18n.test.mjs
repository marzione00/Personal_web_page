import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';import {renderPages,shellHtml} from '../src/render.mjs';import {localiseHtml,prefixResources,languageSwitch,sections} from '../src/i18n.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const it=loadContent(root),en=loadContent(root,{language:'en'}),pi=renderPages(it),pe=renderPages(en);
const page=(d,f)=>renderPages(d).find(p=>p.file===f);
function fixture(fn){const d=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-i18n-'));try{for(const f of ['content','public'])fs.cpSync(path.join(root,f),path.join(d,f),{recursive:true});return fn(d);}finally{fs.rmSync(d,{recursive:true,force:true});}}
test('IT/EN contain corresponding paths with stable anchors and original assets',()=>{
 assert.deepEqual(pi.map(p=>p.file),pe.map(p=>p.file));assert.equal(it.language,'it');assert.equal(en.language,'en');
 for(const p of pi){const q=pe.find(q=>q.file===p.file);assert.deepEqual([...p.body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),[...q.body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));}
 assert.equal(it.profile.homepagePhoto.sha256,en.profile.homepagePhoto.sha256);
 assert.deepEqual(it.lectures.map(l=>l.files),en.lectures.map(l=>l.files));
});
test('English narrative, CV records and all geometry explanations are loaded from Markdown',()=>{
 assert.match(en.home.ricercaAttuale,/cybersecurity/);assert.match(en.profile.personalInterests,/Alessandra Martin/);
 assert.match(en.profile.personalInterests,/2026/);assert.match(en.profile.personalInterests,/indoor climbing/);
 assert.equal(en.geometry.items.length,it.geometry.items.length);for(const g of en.geometry.items){assert.ok(g.spiegazione.length>50);assert.ok(g.limiti.length>30);assert.equal(g.sceneSha256,it.geometry.byId[g.id].sceneSha256);}
 assert.match(en.profile.teaching[0].title,/Information|Informatics|Mathematics/);
});
test('Italian epigraphs are complete labelled translations; English sources retain originals',()=>{
 const examples={platone:['principio sovrano','Mind, the ruling power'],wheeler:['ogni particella','every particle'],engel:['anni più appassionati','most passionate years']};
 for(const q of it.epigraphs){const original=en.epigraphs.find(x=>x.id===q.id);assert.ok(original);assert.notEqual(q.quote,original.quote);assert.ok(q.quote.length>140);assert.ok(original.quote.length>100);assert.match(q.quote,new RegExp(examples[q.id][0]));assert.match(original.quote,new RegExp(examples[q.id][1]));assert.match(q.source,/traduzione italiana/i);assert.ok(!q.quote.includes('[...]'));}
});
test('English article preserves seven source figures and nineteen bibliography entries',()=>{
 const a=en.posts.find(p=>p.id==='colpire-i-nervi-del-sistema');const original=it.posts.find(p=>p.id===a.id);
 assert.match(a.title,/Striking the Nerves/);assert.ok(a.body.split(/\s+/).length>4000);
 const figures=s=>[...s.matchAll(/media\/images\/colpire-nervi-fig-[^\s)]+/g)].map(m=>m[0]);assert.deepEqual(figures(a.body),figures(original.body));assert.equal(figures(a.body).length,7);
 for(let n=1;n<=19;n++)assert.ok(a.body.includes('['+n+']'),n);
 assert.equal(a.pdf,original.pdf);
});
test('language controls link to the same page and identify target language',()=>{
 const p=page(it,'cv.html');const a=languageSwitch(it,p),b=languageSwitch(en,p);
 assert.match(a,/href="en\/cv.html"[^>]*lang="en" hreflang="en"/);assert.match(b,/href="\.\.\/cv.html"/);
 assert.match(a,/aria-current="true"/);assert.doesNotMatch(a,/flag|bandiera/);
});
test('English resource prefixes never rewrite data-viewer-src or model identity',()=>{
 const s='<img src="media/images/a.jpg"><a href="media/docs/a.pdf">PDF</a><dialog data-viewer-src="assets/viewer.js" data-scene="geometry/scenes/gyroid.bin">';
 const out=prefixResources(s,'en');assert.match(out,/src="\.\.\/media\/images\/a.jpg"/);assert.match(out,/href="\.\.\/media\/docs\/a.pdf"/);assert.match(out,/data-viewer-src="assets\/viewer.js"/);assert.doesNotMatch(out,/data-viewer-src="\.\./);
});
test('HTML localisation translates attributes and leaves script and formula/code data unchanged',()=>{
 const s='<button aria-label="Chiudi ricerca">Didattica</button><script>const s="Didattica";</script><pre>cos(x)+sin(y)</pre>';
 const out=localiseHtml(s,en);assert.match(out,/>Teaching<\/button>/);assert.match(out,/<script>const s="Didattica";<\/script>/);assert.match(out,/<pre>cos\(x\)\+sin\(y\)<\/pre>/);
});
test('editing only an English Markdown file updates EN without altering IT',()=>fixture(d=>{
 const f=path.join(d,'content/markdown/en/homepage.md'),originalIT=loadContent(d).home.ricercaAttuale;
 fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('cybersecurity','cybersecurity EDITTEST'));
 assert.match(page(loadContent(d,{language:'en'}),'index.html').body,/EDITTEST/);assert.equal(loadContent(d).home.ricercaAttuale,originalIT);
}));
test('English Markdown hostile markup is escaped, not executed',()=>fixture(d=>{
 const f=path.join(d,'content/markdown/en/homepage.md');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace('cybersecurity','<script>alert(77)</script>'));
 const out=page(loadContent(d,{language:'en'}),'index.html').body;assert.match(out,/&lt;script&gt;alert\(77\)&lt;\/script&gt;/);assert.ok(!out.includes('<script>alert(77)</script>'));
}));
test('a new Italian article has an honest EN notice and a functioning original link',()=>fixture(d=>{
 fs.writeFileSync(path.join(d,'content/markdown/posts/test-new.md'),'---\ntitle: Articolo nuovo\ndate: 2026-11-01\ncategory: Analisi\nexcerpt: Nuovo testo\ndraft: false\n---\n\nTesto sorgente.');
 const data=loadContent(d,{language:'en'});assert.ok(data.posts.find(p=>p.id==='test-new').translationMissing);
 const p=page(data,'articolo-test-new.html');assert.match(p.body,/not yet been provided/);assert.match(p.body,/\.\.\/articolo-test-new.html/);
}));
test('an English Markdown counterpart for a new post works without JavaScript edits',()=>fixture(d=>{
 fs.writeFileSync(path.join(d,'content/markdown/posts/test-new.md'),'---\ntitle: Articolo nuovo\ndate: 2026-11-01\ncategory: Analisi\nexcerpt: Nuovo testo\ndraft: false\n---\n\nTesto sorgente.');
 fs.writeFileSync(path.join(d,'content/markdown/en/posts/test-new.md'),'---\ntitle: New article\ncategory: Analysis\nexcerpt: New text\n---\n\nEnglish body.');
 const p=page(loadContent(d,{language:'en'}),'articolo-test-new.html');assert.equal(p.title,'New article');assert.match(p.body,/English body/);assert.doesNotMatch(p.body,/not yet been provided/);
}));
test('unsupported languages and duplicate translation sections fail clearly',()=>{
 assert.throws(()=>loadContent(root,{language:'xx'}),/Unsupported language/);
 const tmp=path.join(os.tmpdir(),'mdc-dup-'+process.pid+'.md');try{fs.writeFileSync(tmp,'## title\nOne\n## title\nTwo');assert.throws(()=>sections(tmp),/Duplicate/);}finally{fs.rmSync(tmp,{force:true});}
});
