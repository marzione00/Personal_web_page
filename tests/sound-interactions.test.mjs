import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/sound.js',import.meta.url),'utf8');

function harness(){
 let now=0,next=0;const timers=new Map(),oscillators=[],params=[];
 const target=()=>({listeners:new Map(),addEventListener(type,fn,options){const list=this.listeners.get(type)||[];list.push({fn,capture:options===true||options?.capture});this.listeners.set(type,list);},emit(type,event={}){let stopped=false;for(const {fn} of [...this.listeners.get(type)||[]].sort((a,b)=>Number(b.capture)-Number(a.capture))){if(stopped)break;fn({button:0,stopImmediatePropagation(){stopped=true;},...event});}}});
 function element(tag='button',parent=null,classes=[]){return {...target(),tag,parent,classes,isConnected:true,attrs:new Map(),dataset:{},value:'25',textContent:'',
  setAttribute(k,v){this.attrs.set(k,String(v));},getAttribute(k){return this.attrs.get(k)??null;},toggleAttribute(){},
  matches(selector){return selector.split(',').some(part=>{part=part.trim();if(part.startsWith('.'))return this.classes.includes(part.slice(1));if(part.startsWith('[')){const match=part.match(/^\[([^=\]]+)(?:="([^"]+)")?\]$/);return match&&this.attrs.has(match[1])&&(match[2]===undefined||this.attrs.get(match[1])===match[2]);}return part===this.tag||(part==='a[href]'&&this.tag==='a'&&this.attrs.has('href'));});},
  closest(selector){for(let node=this;node;node=node.parent)if(node.matches(selector))return node;return null;},contains(node){for(;node;node=node.parent)if(node===this)return true;return false;},querySelector(){return {toggleAttribute(){}};}};}
 const toggle=element();toggle.setAttribute('data-sound-toggle','');const slider=element('input'),output=element('output');
 const document={...target(),hidden:false,documentElement:{lang:'it'},querySelector:s=>s==='[data-sound-toggle]'?toggle:s==='[data-sound-volume]'?slider:output};
 const parameter=()=>{const p={events:[],value:0,setValueAtTime(v,t){this.events.push(['value',v,t]);},setTargetAtTime(v,t,c){this.events.push(['target',v,t,c]);},exponentialRampToValueAtTime(v,t){this.events.push(['ramp',v,t]);},cancelScheduledValues(){}};params.push(p);return p;};
 const node=()=>({connect(){},disconnect(){}});
 class Context{
  constructor(){this.state='suspended';this.destination={};Context.instance=this;}
  get currentTime(){return now/1000;}
  async resume(){this.state='running';}
  createGain(){return {...node(),gain:parameter()};}
  createDynamicsCompressor(){return {...node(),threshold:{},knee:{},ratio:{}};}
  createBiquadFilter(){return {...node(),frequency:{},Q:{}};}
  createOscillator(){const o={...node(),frequency:parameter(),start(){},stop(t){this.end=t;}};oscillators.push(o);return o;}
 }
 const window={...target(),AudioContext:Context},fine={...target(),matches:true};
 vm.runInNewContext(source,{window,document,matchMedia:()=>fine,localStorage:{getItem:()=>null,setItem(){}},performance:{now:()=>now},setTimeout(fn,delay){const id=++next;timers.set(id,{fn,at:now+delay});return id;},clearTimeout:id=>timers.delete(id)});
 const step=ms=>{now+=ms;for(const [id,job] of [...timers])if(job.at<=now){timers.delete(id);job.fn();}for(const o of oscillators)if(o.end<=now/1000&&!o.ended){o.ended=true;o.onended?.();}};
 return {api:window.MDCSound,document,window,toggle,slider,params,oscillators,fine,element,step,
  async enable(){await window.MDCSound.enable(true);step(1000);},
  enter(el,relatedTarget=null,pointerType='mouse'){document.emit('pointerover',{target:el,relatedTarget,pointerType});},
  leave(el,relatedTarget=null){document.emit('pointerout',{target:el,relatedTarget});},
  click(el){document.emit('pointerdown',{target:el});document.emit('click',{target:el});}};
}

test('hover stays silent until audio is explicitly enabled and unlocked',()=>{
 const h=harness(),card=h.element('article',null,['atlas-card']);h.enter(card);h.step(1000);
 assert.equal(h.api.enabled,false);assert.equal(h.api.counts.hover,0);assert.equal(h.oscillators.length,0);
});
test('entering a card emits one accent, child crossings and stationary pointer time do not repeat it',async()=>{
 const h=harness();await h.enable();const card=h.element('article',null,['atlas-card']),link=h.element('a',card),label=h.element('span',link);link.setAttribute('href','geometrie.html');
 h.enter(label);h.step(64);assert.equal(h.api.counts.hover,0);h.step(1);assert.equal(h.api.counts.hover,1);
 h.leave(label,link);h.enter(link,label);h.step(1000);assert.equal(h.api.counts.hover,1);
 h.leave(link);h.enter(card);h.step(65);assert.equal(h.api.counts.hover,2);
});
test('fast pass-throughs, touch pointers and scroll-triggered crossings are silent',async()=>{
 const h=harness();await h.enable();const card=h.element('article',null,['course-card']);
 h.enter(card);h.step(30);h.leave(card);h.step(80);assert.equal(h.api.counts.hover,0);
 h.enter(card,null,'touch');h.step(200);assert.equal(h.api.counts.hover,0);
 h.enter(card);h.document.emit('scroll');h.step(70);assert.equal(h.api.counts.hover,0);
 h.enter(card);h.step(90);assert.equal(h.api.counts.hover,0);
 h.step(100);h.enter(card);h.step(65);assert.equal(h.api.counts.hover,1);
});
test('keyboard focus receives the same accent and disabled controls receive none',async()=>{
 const h=harness();await h.enable();const button=h.element();h.document.emit('keydown',{key:'Tab'});h.document.emit('focusin',{target:button});h.step(65);assert.equal(h.api.counts.hover,1);
 h.document.emit('focusout');button.setAttribute('disabled','');h.step(300);h.document.emit('focusin',{target:button});h.step(65);h.click(button);assert.equal(h.api.counts.hover,1);assert.equal(h.api.counts.link,0);
});
test('click capture survives a modal handler stopping propagation and remains rate-limited',async()=>{
 const h=harness();await h.enable();const link=h.element('a');link.setAttribute('href','geometrie.html');h.document.addEventListener('click',e=>e.stopImmediatePropagation(),true);
 h.click(link);h.step(50);h.click(link);assert.equal(h.api.counts.link,1);h.step(400);h.click(link);assert.equal(h.api.counts.link,2);
});
test('navigation, mute and hidden documents cancel pending hover accents',async()=>{
 const h=harness();await h.enable();const card=h.element('article',null,['carbon-card']);
 h.enter(card);h.window.emit('mdc:before-content-change');h.step(250);assert.equal(h.api.counts.hover,0);
 h.enter(card);await h.api.enable(false);h.step(100);assert.equal(h.api.counts.hover,0);assert.equal(h.api.activeVoices,0);
 await h.enable();h.enter(card);h.document.hidden=true;h.document.emit('visibilitychange');h.step(250);assert.equal(h.api.counts.hover,0);
});
test('hover cooldown, voice cap and soft synthesis prevent overlapping bursts',async()=>{
 const h=harness();await h.enable();const a=h.element(),b=h.element();h.enter(a);h.step(65);h.leave(a);h.enter(b);h.step(65);assert.equal(h.api.counts.hover,1);
 h.click(b);h.api.page();assert.ok(h.api.activeVoices<=3);
 assert.ok(h.oscillators.every(o=>o.type==='sine'));assert.ok(h.params.flatMap(p=>p.events).filter(e=>e[0]==='ramp').every(e=>e[1]>0));
});
