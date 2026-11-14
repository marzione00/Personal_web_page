import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import vm from 'node:vm';
import {loadContent} from '../src/content.mjs';
import {articleReading} from '../src/paths.mjs';
import {solarwindsId,withArticleDiagrams} from '../src/article-diagrams.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
for(const language of ['it','en']){
 const data=loadContent(root,{language}),post=data.posts.find(p=>p.id===solarwindsId);
 const reading=articleReading(post,data);
 test(`SolarWinds ${language}: three figures preserve chapter navigation and unique IDs`,()=>{
  assert.equal((reading.body.match(/data-article-diagram=/g)||[]).length,3);
  assert.equal((reading.toc.match(/<a /g)||[]).length,5);
  const ids=[...reading.body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length);
  assert.ok(reading.body.indexOf('data-article-diagram="supply"')<reading.body.indexOf('id="capitolo-2"'));
  assert.ok(reading.body.indexOf('data-article-diagram="timeline"')>reading.body.indexOf('id="capitolo-2"'));
  assert.ok(reading.body.indexOf('data-article-diagram="defense"')<reading.body.indexOf('id="capitolo-5"'));
 });
 test(`SolarWinds ${language}: every graph link reaches a native, focusable explanation`,()=>{
  const links=[...reading.body.matchAll(/href="articolo-[^"]+#(sw-note-[^"]+)"/g)].map(m=>m[1]);
  assert.equal(links.length,10);
  assert.equal(new Set(links).size,5);
  for(const id of new Set(links))assert.match(reading.body,new RegExp('<details><summary>[^<]+</summary><p id="'+id+'" tabindex="-1">[^<]+</p></details>'));
  assert.equal((reading.body.match(/class="ad-timeline"/g)||[]).length,1);
  assert.doesNotMatch(reading.body,/<foreignObject|\son\w+=|\sstyle=/i);
 });
}
test('Other articles retain their original renderer and malformed chapter layouts fail explicitly',()=>{
 const body='<h2>Example</h2><p>Text</p>';
 assert.equal(withArticleDiagrams('another-article',body),body);
 assert.throws(()=>withArticleDiagrams(solarwindsId,body),/placement requires/);
});
test('Complete printing exposes all explanations and restores the reader’s choices',()=>{
 const details=Array.from({length:5},(_,i)=>({open:i===1})),events={};
 const main={querySelector:()=>null,querySelectorAll:()=>details.filter(d=>!d.open)};
 const document={documentElement:{lang:'it'},querySelector:q=>q==='main'?main:null,querySelectorAll:()=>[],addEventListener(){}};
 const window={addEventListener:(name,fn)=>events[name]=fn};
 vm.runInNewContext(fs.readFileSync(root+'src/reading.js','utf8'),{document,window,location:{hash:''},localStorage:{getItem:()=>null}});
 events.beforeprint();assert.equal(details.filter(d=>d.open).length,5);
 events.afterprint();assert.deepEqual(details.map(d=>d.open),[false,true,false,false,false]);
});
test('Diagram entrance uses finite animations, cancels for print, and respects reduced motion',()=>{
 const events={},animations=[];let observed,disconnected=0;
 const animated=()=>({animate(){const a={cancelled:false,cancel(){this.cancelled=true;},finished:new Promise(()=>{})};animations.push(a);return a;}});
 const steps=Array.from({length:5},animated),figure={...animated(),querySelectorAll:q=>q==='.ad-step'?steps:[]};
 const main={querySelector:()=>null,querySelectorAll:q=>q.includes('[data-article-diagram]')?[figure]:[]};
 const noop={textContent:'',addEventListener(){}},dialog={open:false,classList:{remove(){}},querySelector:()=>noop,querySelectorAll:()=>[],addEventListener(){}};
 const fx={transitions:true,reduced:false,intro:false,ambient:'off',subscribe(){}};
 const document={hidden:false,body:{dataset:{page:'article.html'}},querySelector:q=>q==='[data-entry-dialog]'?dialog:null,getElementById:()=>main,querySelectorAll:()=>[],addEventListener(){}};
 const window={MDCEffects:fx,addEventListener:(name,fn)=>events[name]=fn,dispatchEvent(){}};
 const context={document,window,location:{hash:''},clearTimeout(){},cancelAnimationFrame(){},Event:class{},IntersectionObserver:class{constructor(fn){observed=fn;}observe(){}unobserve(){}disconnect(){disconnected++;}}};
 vm.runInNewContext(fs.readFileSync(root+'src/cinema.js','utf8'),context);
 observed([{isIntersecting:true,target:figure}]);assert.equal(window.MDCCinema.activeAnimations,6);
 events.beforeprint();assert.ok(animations.every(a=>a.cancelled));assert.equal(window.MDCCinema.activeAnimations,0);assert.ok(disconnected>0);
 fx.reduced=true;window.MDCCinema.arrive();assert.equal(animations.length,6);
});
