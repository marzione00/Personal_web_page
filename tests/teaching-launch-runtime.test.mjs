import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {renderAppLaunchDialog} from '../src/teaching-apps.mjs';

const source=fs.readFileSync(new URL('../src/teaching-app-launch.js',import.meta.url),'utf8');
const url='https://marzione00.github.io/QuantumLab_Public/';

// Run the actual browser module with a controllable clock and minimal DOM events.
function launchFixture({reduced=false,transitions=true,hidden=false,lang='it'}={}) {
 let now=0,serial=0;
 const frames=new Map(),timers=new Map(),navigations=[];
 const element=()=>({
  handlers:new Map(),textContent:'',value:0,isConnected:true,
  addEventListener(type,fn){this.handlers.set(type,[...(this.handlers.get(type)||[]),fn]);},
  emit(type,props={}){const e={button:0,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},...props};for(const fn of this.handlers.get(type)||[])fn(e);return e;},
  focus(){document.activeElement=this;}
 });
 const document=element(),window=element(),media=element(),dialog=element();
 document.documentElement={lang};document.hidden=hidden;
 media.matches=reduced;window.matchMedia=()=>media;
 let preferenceChange;
 window.MDCEffects={transitions,subscribe(fn){preferenceChange=fn;}};
 const nodes=Object.fromEntries(['title','status','destination','direct','cancel','progress','percent'].map(key=>[key,element()]));
 const rows=[element(),element(),element()],classes=new Set();
 dialog.classList={add(...names){names.forEach(n=>classes.add(n));},remove(...names){names.forEach(n=>classes.delete(n));}};
 dialog.querySelector=selector=>nodes[selector.match(/data-launch-(.*)\]/)[1]];
 dialog.querySelectorAll=()=>rows;
 dialog.showModal=()=>{dialog.open=true;};dialog.close=()=>{dialog.open=false;};
 document.querySelector=()=>dialog;
 const trigger=Object.assign(element(),{href:url,target:'',dataset:{launchId:'quantum-lab',launchName:'Quantum Lab'},hasAttribute:()=>false});
 trigger.closest=()=>trigger;
 vm.runInNewContext(source,{document,window,URL,location:{assign:u=>navigations.push(u)},performance:{now:()=>now},
  requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},cancelAnimationFrame:id=>frames.delete(id),
  setTimeout(fn,delay){timers.set(++serial,{fn,at:now+delay});return serial;},clearTimeout:id=>timers.delete(id)
 });
 return {document,window,media,dialog,nodes,rows,classes,trigger,navigations,frames,timers,
  open:props=>document.emit('click',{target:trigger,...props}),
  frame(time){now=time;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now));},
  tick(time){now=time;for(const [id,t] of [...timers])if(t.at<=now){timers.delete(id);t.fn();}},
  disableTransitions(){window.MDCEffects.transitions=false;preferenceChange();}
 };
}

test('launch fills in five seconds, finishes the closing effect and navigates once',()=>{
 const f=launchFixture();assert.equal(f.open().defaultPrevented,true);
 assert.equal(f.nodes.progress.value,0);assert.equal(f.dialog.open,true);
 f.frame(2500);assert.equal(f.nodes.progress.value,50);assert.equal(f.nodes.percent.textContent,'50%');
 assert.equal(f.rows[0].textContent,'cd didattica');assert.ok(f.rows[1].textContent.length>0);assert.equal(f.rows[2].textContent,'');
 f.frame(4999);assert.equal(f.nodes.progress.value,99);assert.equal(f.classes.has('is-opening'),false);
 f.frame(5000);assert.equal(f.nodes.progress.value,100);assert.equal(f.classes.has('is-opening'),true);
 assert.equal(f.rows[2].textContent,'navigate --same-tab');assert.deepEqual(f.navigations,[]);
 f.frame(5349);assert.deepEqual(f.navigations,[]);
 f.frame(5350);assert.deepEqual(f.navigations,[url]);assert.equal(f.dialog.open,false);
 f.tick(6000);assert.deepEqual(f.navigations,[url]);assert.equal(f.frames.size+f.timers.size,0);
});

test('cancel and Escape clear pending work, restore focus and allow a fresh sequence',()=>{
 for(const action of [f=>f.nodes.cancel.emit('click'),f=>f.dialog.emit('cancel')]){
  const f=launchFixture();f.open();f.frame(3000);action(f);
  assert.equal(f.document.activeElement,f.trigger);assert.equal(f.dialog.open,false);
  assert.equal(f.frames.size+f.timers.size,0);f.tick(6000);assert.deepEqual(f.navigations,[]);
  f.open();assert.equal(f.nodes.progress.value,0);assert.equal(f.nodes.percent.textContent,'0%');
  assert.ok(f.rows.every(row=>row.textContent===''));f.frame(8500);assert.equal(f.nodes.progress.value,50);
 }
});

test('Open now and modified new-tab clicks preserve native navigation and stop the timer',()=>{
 for(const [type,props] of [['click',{}],['click',{ctrlKey:true}],['click',{metaKey:true}],['auxclick',{button:1}]]){
  const f=launchFixture();f.open();f.frame(1600);
  const event=f.nodes.direct.emit(type,props);assert.equal(event.defaultPrevented,false);
  assert.equal(f.nodes.direct.href,url);assert.equal(f.dialog.open,false);
  f.tick(6000);assert.deepEqual(f.navigations,[]);assert.equal(f.frames.size+f.timers.size,0);
 }
});

test('motion preferences and modified entry clicks bypass the five-second sequence',()=>{
 for(const options of [{reduced:true},{transitions:false},{hidden:true}]){
  const f=launchFixture(options);assert.equal(f.open().defaultPrevented,false);assert.equal(f.timers.size,0);
 }
 for(const props of [{ctrlKey:true},{metaKey:true},{shiftKey:true},{altKey:true},{button:1}]){
  const f=launchFixture();assert.equal(f.open(props).defaultPrevented,false);assert.equal(f.timers.size,0);
 }
});

test('switching to reduced motion or disabling transitions completes an active launch once',()=>{
 for(const action of [f=>{f.media.matches=true;f.media.emit('change');},f=>f.disableTransitions()]){
  const f=launchFixture();f.open();f.frame(1500);action(f);
  assert.deepEqual(f.navigations,[url]);assert.equal(f.frames.size+f.timers.size,0);
  f.tick(6000);assert.deepEqual(f.navigations,[url]);
 }
});

test('fallback completes navigation when animation frames stop',()=>{
 const f=launchFixture();f.open();f.tick(5649);assert.deepEqual(f.navigations,[]);
 f.tick(5650);assert.deepEqual(f.navigations,[url]);assert.equal(f.frames.size+f.timers.size,0);
 f.frame(6000);assert.deepEqual(f.navigations,[url]);
});

test('page lifecycle and externally closed dialog cancel pending navigation',()=>{
 for(const action of [f=>f.window.emit('pagehide'),f=>f.window.emit('pageshow'),f=>{f.dialog.open=false;f.dialog.emit('close');}]){
  const f=launchFixture();f.open();action(f);f.tick(6000);
  assert.deepEqual(f.navigations,[]);assert.equal(f.frames.size+f.timers.size,0);
 }
});

test('repeated launch clicks keep one sequence and keyboard focus cycles within it',()=>{
 const f=launchFixture();f.open();f.frame(2000);f.open();
 assert.equal(f.timers.size,1);assert.equal(f.frames.size,1);assert.equal(f.nodes.progress.value,40);
 assert.equal(f.document.activeElement,f.nodes.direct);
 assert.equal(f.dialog.emit('keydown',{key:'Tab'}).defaultPrevented,true);
 assert.equal(f.document.activeElement,f.nodes.cancel);
 f.dialog.emit('keydown',{key:'Tab',shiftKey:true});assert.equal(f.document.activeElement,f.nodes.direct);
});

test('progress has an accessible localized name, numeric value and one persistent owner',()=>{
 for(const [language,label] of [['it','Sequenza di apertura'],['en','Opening sequence']]){
  const html=renderAppLaunchDialog({language,teachingApps:[{enabled:true,launch:'terminal',url}]},'');
  assert.ok(html.includes(`<label for="tm-launch-progress">${label}</label>`));
  assert.match(html,/<progress[^>]*data-launch-progress max="100" value="0"/);
  assert.equal((html.match(/<progress /g)||[]).length,1);
 }
 const f=launchFixture({lang:'en'});f.open();assert.equal(f.nodes.status.textContent,'Opening Quantum Lab…');
});
