import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/music.js',import.meta.url),'utf8');
function player({deferred=false}={}){
 const events={},controls=new Map(),instances=[],pending=[],local=new Map(),session=new Map();let changed;
 const control=selector=>{if(!controls.has(selector))controls.set(selector,{value:'18',checked:true,textContent:'',attributes:{},addEventListener(){},setAttribute(k,v){this.attributes[k]=v;}});return controls.get(selector);};
 class Audio{constructor(){this.paused=true;this.currentTime=0;this.duration=270;this.readyState=1;this.handlers={};instances.push(this);}addEventListener(k,fn){this.handlers[k]=fn;}play(){this.paused=false;this.handlers.play?.();return deferred?new Promise(resolve=>pending.push(resolve)):Promise.resolve();}pause(){this.paused=true;this.handlers.pause?.();}}
 const body={dataset:{resourceBase:''},classList:{contains:()=>false}},document={documentElement:{lang:'it'},body,querySelector:control,addEventListener(k,fn){events[k]=fn;}};
 const window={MDCSound:{setMusic(){}},addEventListener(k,fn){events[k]=fn;}};
 vm.runInNewContext(source,{window,document,Audio,performance:{now:()=>3000},localStorage:{getItem:k=>local.get(k)??null,setItem:(k,v)=>local.set(k,v)},sessionStorage:{getItem:k=>session.get(k)??null,setItem:(k,v)=>session.set(k,v)},MutationObserver:class{constructor(fn){changed=fn;}observe(){}},setTimeout,clearTimeout});
 return {api:window.ManifoldMusic,instances,events,body,pending,controls,session,focusReading(){body.dataset.readingFocus='true';changed();}};
}
test('music requests nothing before start and reuses one player through page changes',async()=>{
 const p=player();assert.equal(p.api.loaded,false);assert.equal(p.instances.length,0);assert.equal(await p.api.start(),true);assert.equal(p.instances.length,1);assert.equal(p.instances[0].preload,'none');assert.equal(p.instances[0].src,'audio/descending-fields.mp3');p.instances[0].currentTime=41;
 p.events['mdc:content-change']?.();assert.equal(p.api.position,41);assert.equal(p.api.playing,true);p.api.pause(true);assert.equal(p.api.playing,false);await p.api.start();assert.equal(p.instances.length,1);assert.equal(p.api.position,41);
 p.events.pagehide();assert.equal(p.api.playing,false);assert.equal(p.session.get('manifold-music-position-v2'),'41');
});
test('reading focus lowers the soundtrack while preserving the chosen music volume',async()=>{const p=player();await p.api.start();assert.equal(p.api.volume,.18);p.focusReading();assert.equal(p.api.reading,true);assert.ok(p.instances[0].volume<.18);assert.equal(p.api.volume,.18);p.api.pause(true);});
test('a cancelled pending start cannot stop a newer explicit play request',async()=>{const p=player({deferred:true});const first=p.api.start();p.api.pause(true);const second=p.api.start();p.pending[0]();assert.equal(await first,false);assert.equal(p.api.playing,true);p.pending[1]();assert.equal(await second,true);assert.equal(p.instances.length,1);p.api.pause(true);});
