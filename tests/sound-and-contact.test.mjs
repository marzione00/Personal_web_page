import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=name=>fs.readFileSync(path.join(root,'src',name),'utf8');
const html=lang=>{
 const data=loadContent(root,{language:lang});
 const page=renderPages(data).find(p=>p.file==='index.html');
 return shellHtml({data,page,css:source('site.css')+'\n'+source('visual.css'),js:source('app.js')+'\n'+source('sound.js'),csp:"default-src 'none'"});
};
test('contact email is Outlook in IT and EN, and the old institutional address is not the public contact',()=>{
 for(const lang of ['it','en']){
  const data=loadContent(root,{language:lang});
  assert.equal(data.profile.email,'marzio.decorato@outlook.it');
  const p=renderPages(data).find(x=>x.file==='contatti.html');
  assert.match(p.body,/mailto:marzio\.decorato@outlook\.it/);
  assert.doesNotMatch(p.body,/mailto:marzio\.decorato@unimi\.it/);
 }
});
test('sound toggle is accessible, muted by default, and present next to reading theme in both languages',()=>{
 for(const lang of ['it','en']){
  const h=html(lang);
  assert.match(h,/data-reading[^>]*>[\s\S]*?<\/button><button[^>]*data-sound-toggle/);
  assert.match(h,/data-sound-toggle aria-pressed="false"/);
  assert.match(h,/data-sound-off/);assert.match(h,/data-sound-on hidden/);
  assert.match(h,lang==='en'?/aria-label="Enable sound effects"/:/aria-label="Attiva gli effetti sonori"/);
 }
});
test('sound module is opt-in, rate-limited, generates oscillators without external media, and supports keyboard focus',()=>{
 const s=source('sound.js');
 assert.match(s,/read\(\)==='on'/);
 assert.match(s,/toggle\.addEventListener\('click'/);
 assert.match(s,/new AudioClass\(\)/);
 assert.match(s,/if\(now-lastChirp<360\)return/);
 assert.match(s,/createOscillator\(/);
 assert.match(s,/pointerover/);assert.match(s,/focusin/);
 assert.doesNotMatch(s,/fetch\(|\.mp3|\.wav|Audio\(/);
});
test('link-hover visual treatment is reversible, with reduced-motion and light-theme fallbacks',()=>{
 const c=source('visual.css')+source('header.css');
 assert.match(c,/\.nav a::after/);
 assert.match(c,/\.18s ease/);
 assert.match(c,/\.reading-mode\{--hover-ink:/);
 assert.match(c,/@media\(prefers-reduced-motion:reduce\)/);
});
