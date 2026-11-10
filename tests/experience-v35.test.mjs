import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';
import {loadContent} from '../src/content.mjs';import {renderPages,shellHtml} from '../src/render.mjs';import {loadTeachingApps} from '../src/teaching-apps.mjs';import {shareMetadata,ambientContext} from '../src/experience.mjs';
const root=new URL('../',import.meta.url).pathname;
const dataset=(language='it')=>{const d=loadContent(root,{language});d.teachingApps=loadTeachingApps(root,language);return d;};
test('the homepage prioritises paths, research and writing before personal context',()=>{
 const d=dataset(),h=renderPages(d)[0].body;
 const indexes=['home-entry','home-research','home-latest-post','home-reading'].map(c=>h.indexOf(c));
 assert.ok(indexes.every(i=>i>=0));assert.deepEqual([...indexes].sort((a,b)=>a-b),indexes);
 assert.equal((h.match(/data-app-launch /g)||[]).length,2);
});
test('every quantum module has real activity URLs and retains its original PDF actions in both languages',()=>{
 for(const language of ['it','en']){
  const d=dataset(language),h=renderPages(d).find(p=>p.file==='corso-quantum-post-quantum-computing-2026-2027.html').body;
  assert.equal((h.match(/class="study-bridge"/g)||[]).length,7);
  for(const m of d.studyPaths.modules)for(const a of m.activities)assert.ok(h.includes(`https://marzione00.github.io/QuantumLab_Public/#modulo-${m.module}/${a.slug}`));
  assert.equal((h.match(/ download=/g)||[]).length,7);
  if(language==='en')assert.ok(h.includes('Laboratory interface: Italian.'));
 }
});
test('reviewed publications expose existing summaries and retain full references in native disclosures',()=>{
 const d=dataset(),h=renderPages(d).find(p=>p.file==='ricerca.html').body;
 assert.equal((h.match(/class="publication-contribution"/g)||[]).length,16);
 assert.equal((h.match(/class="publication-bibliographic"/g)||[]).length,16);
 assert.equal((h.match(/class="publication-pending"/g)||[]).length,1);
});
test('share metadata resolves exact same assets from root and English nested URLs',()=>{
 for(const language of ['it','en']){
  const d=dataset(language),pages=renderPages(d);
  for(const p of pages){
   const canonical='https://marzione00.github.io/Personal_web_page/'+(language==='en'?'en/':'')+(p.file==='index.html'?'':p.file);
   const h=shareMetadata(d,p,canonical),url=h.match(/property="og:image" content="([^"]+)"/)[1];
   assert.ok(url.startsWith('https://marzione00.github.io/Personal_web_page/media/images/share/'));
   assert.ok(fs.existsSync(path.join(root,'public',new URL(url).pathname.split('/Personal_web_page/')[1])));
   assert.match(h,/summary_large_image/);
  }
 }
});
test('shared bundles retain integrity and correct resource prefixes without inline duplication',()=>{
 for(const language of ['it','en']){
  const d=dataset(language),p=renderPages(d)[0],assets={css:{src:'assets/site-123.css',integrity:'sha256-test'},js:{src:'assets/site-456.js',integrity:'sha256-test'}};
  const h=shellHtml({data:d,page:p,css:'CSS_PROBE',js:'JS_PROBE',csp:"default-src 'none'",assets});
  assert.doesNotMatch(h,/CSS_PROBE|JS_PROBE|<style>/);
  assert.ok(h.includes(`src="${language==='en'?'../':''}assets/site-456.js"`));assert.match(h,/crossorigin="anonymous" defer/);
 }
});
test('header positioning has one owner and content never takes the modal top layer',()=>{
 for(const file of ['site.css','visual.css','ambient.css','identity.css'])assert.doesNotMatch(fs.readFileSync(path.join(root,'src',file),'utf8'),/\.(?:header-inner|header-tools|language-switch|menu-button)\s*\{/);
 const h=fs.readFileSync(path.join(root,'src/header.css'),'utf8');assert.match(h,/--layer-header:3/);assert.match(h,/--layer-content:1/);assert.doesNotMatch(h,/position:absolute;top:9px/);
 assert.equal(ambientContext('corso-quantum-post-quantum-computing-2026-2027.html'),'quantum');assert.equal(ambientContext('geometrie.html'),'geometry');
});
