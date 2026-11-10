import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';

const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
function renderer(){
 const frames=new Map();let id=0,clock=0;
 const ctx={setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){},stroke(){}};
 const document={hidden:false,createElement:()=>({setAttribute(){},getContext:t=>t==='2d'?ctx:null,remove(){}})},window={devicePixelRatio:3};
 vm.runInNewContext(read('public/assets/geometry-viewer.js'),{window,document,performance:{now:()=>clock},ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},requestAnimationFrame:fn=>{frames.set(++id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),ArrayBuffer,DataView,Float32Array,Int16Array,Uint16Array,Uint8Array});
 const view=new window.MDCGeometry.Viewer({preview:true});
 const b=fs.readFileSync(new URL('../public/geometry/scenes/fullerene-cage.bin',import.meta.url));
 view.load(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));view.dynamicLight=true;
 view.attach({append(){},classList:{add(){},remove(){}},getBoundingClientRect:()=>({width:400,height:260})});
 return {view,frames,document,lightAt:window.MDCGeometry.lightAt,step(ms){clock+=ms;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(clock));}};
}
test('carbon rotation and lighting follow elapsed time at different rendering rates',()=>{
 const a=renderer(),b=renderer(),angle=a.view.angle[1],positions=Array.from(a.view.model.p);
 for(const r of [a,b]){r.view.auto=true;r.view.start();r.view.start();assert.equal(r.frames.size,1);}
 for(let i=0;i<60;i++)a.step(100);for(let i=0;i<30;i++)b.step(200);
 assert.ok(Math.abs(a.view.angle[1]-angle-.72)<1e-10);
 assert.ok(Math.abs(a.view.angle[1]-b.view.angle[1])<1e-10);
 assert.ok(Math.abs(a.view.lightPhase-b.view.lightPhase)<1e-10);
 assert.deepEqual(Array.from(a.view.model.p),positions,'animation must preserve atomic coordinates');
 assert.equal(a.view.canvas.width,400,'preview limits pixel density');
});
test('stopping, hiding and detaching cancel animation without a catch-up jump',()=>{
 const r=renderer(),v=r.view;v.auto=true;v.start();r.step(100);v.stop();
 const angle=v.angle[1],phase=v.lightPhase;r.step(60000);
 assert.equal(r.frames.size,0);assert.equal(v.angle[1],angle);assert.equal(v.lightPhase,phase);
 v.auto=true;v.start();r.step(100);assert.ok(Math.abs(v.angle[1]-angle-.012)<1e-10);
 r.document.hidden=true;r.step(100);assert.equal(r.frames.size,0);
 r.document.hidden=false;v.auto=true;v.start();v.detach();assert.equal(r.frames.size,0);assert.equal(v.host,null);
});
test('moving illumination stays normalized, gradual and bright enough to read bonds',()=>{
 const {lightAt}=renderer();let previous=lightAt(0);
 for(let i=1;i<=2000;i++){
  const current=lightAt(i*.01);assert.ok(Math.abs(Math.hypot(...current.direction)-1)<1e-12);
  assert.ok(current.direction[2]>.55);assert.ok(current.tint.every(x=>x>=.59&&x<=1));
  current.direction.forEach((v,k)=>assert.ok(Math.abs(v-previous.direction[k])<.02));previous=current;
 }
 assert.notDeepEqual(lightAt(0),lightAt(2));
});
test('sheet previews keep the hexagonal lattice visible throughout a full motion cycle',()=>{
 const r=renderer(),v=r.view;
 const b=fs.readFileSync(new URL('../public/geometry/scenes/carbon-nanoribbon.bin',import.meta.url));v.load(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));
 v.sway=true;v.auto=true;v.start();const yaw=[];
 for(let i=0;i<600;i++){r.step(100);yaw.push(v.angle[1]);assert.ok(Math.cos(v.angle[0])*Math.cos(v.angle[1])>.5,'sheet must not turn edge-on');}
 assert.ok(Math.max(...yaw)-Math.min(...yaw)>1.1,'the motion must cover both sides');
});

function loader({reduced=false,saveData=false,paused=false}={}){
 const watchers=[],views=[],effectCallbacks=[],jobs=[];let anchors=[];
 const eventTarget=()=>({listeners:new Map(),addEventListener(type,fn){const list=this.listeners.get(type)||[];list.push(fn);this.listeners.set(type,list);},emit(type,event={}){for(const fn of this.listeners.get(type)||[])fn(event);}});
 const element=()=>({...eventTarget(),dataset:{},setAttribute(){},removeAttribute(name){if(name==='data-geometry-motion')delete this.dataset.geometryMotion;},querySelectorAll:()=>[],classList:{add(){},remove(){}}});
 const dialog=element(),controls=new Map();dialog.querySelector=s=>{if(!controls.has(s))controls.set(s,element());return controls.get(s);};
 const document={...eventTarget(),hidden:false,body:{dataset:{}},querySelector:()=>dialog,querySelectorAll:s=>s.includes('data-carbon-lattice')?anchors:[]};
 const motion={...eventTarget(),matches:reduced};
 class Viewer{
  constructor(){this.alive=true;this.angle=[.2,.4];views.push(this);}
  load(){this.model={};this.angle=[.2,.4];this.target=this.angle.slice();this.auto=false;}
  setMode(){}attach(a){this.host=a;}start(){this.running=true;}stop(){this.auto=false;this.running=false;}detach(){this.stop();this.host=null;}dispose(){this.detach();this.alive=false;}
 }
 const effects={paused,subscribe:fn=>effectCallbacks.push(fn)},window={...eventTarget(),MDCGeometry:{Viewer},MDCEffects:effects,MDCEmbeddedScenes:{}};
 const bytes=Buffer.alloc(24),digest=createHash('sha256').update(bytes).digest('hex');
 const connection={...eventTarget(),saveData};
 vm.runInNewContext(read('src/geometry-loader.js'),{document,window,navigator:{connection},matchMedia:()=>motion,localStorage:{getItem(){},setItem(){}},IntersectionObserver:class{constructor(callback){this.callback=callback;this.observed=new Set();watchers.push(this);}observe(a){this.observed.add(a);}disconnect(){this.observed.clear();}},crypto:{subtle:{digest:async()=>Buffer.from(digest,'hex')}},atob:s=>Buffer.from(s,'base64').toString('binary'),setTimeout:fn=>jobs.push(fn),clearTimeout(){}});
 const observer=watchers[1];
 return {views,document,window,motion,connection,observer,
  add(ids){anchors=ids.map(id=>{const a=element();a.isConnected=true;a.dataset={geometryOpen:id,scene:'geometry/scenes/'+id+'.bin',sceneSha256:digest};window.MDCEmbeddedScenes[id]=bytes.toString('base64');return a;});window.emit('mdc:content-change');return anchors;},
  show(as){observer.callback(as.map(a=>({target:a,isIntersecting:true,intersectionRatio:1})));},
  hide(as){observer.callback(as.map(a=>({target:a,isIntersecting:false,intersectionRatio:0})));},
  pause(value){effects.paused=value;effectCallbacks.forEach(fn=>fn());},
  async flush(){for(let i=0;i<30;i++)await Promise.resolve();}
 };
}
test('visible previews reuse at most three renderers and release detached page content',async()=>{
 const r=loader(),a=r.add(['alpha','beta','gamma','delta']);r.show(a);await r.flush();
 assert.equal(r.views.length,3);assert.equal(r.views.filter(v=>v.running).length,3);
 r.hide(a.slice(0,3));await r.flush();assert.equal(r.views.length,3);assert.equal(r.views.filter(v=>v.running).length,1);
 assert.equal(a[0].dataset.geometryMotion,undefined);assert.equal(a[3].dataset.geometryMotion,'running');
 r.window.emit('mdc:before-content-change');assert.equal(r.views.filter(v=>v.running).length,0);assert.ok(r.views.every(v=>!v.host));
 const next=r.add(['epsilon']);r.show(next);await r.flush();assert.equal(r.views.length,3);assert.equal(next[0].dataset.geometryMotion,'running');
 r.window.emit('pagehide');assert.ok(r.views.every(v=>!v.alive));
});
test('motion preferences and document visibility pause and resume visible previews',async()=>{
 const r=loader(),a=r.add(['alpha']);r.show(a);await r.flush();assert.equal(a[0].dataset.geometryMotion,'running');
 r.pause(true);assert.equal(a[0].dataset.geometryMotion,'paused');r.pause(false);assert.equal(a[0].dataset.geometryMotion,'running');
 r.document.hidden=true;r.document.emit('visibilitychange');assert.equal(a[0].dataset.geometryMotion,'paused');
 r.document.hidden=false;r.document.emit('visibilitychange');assert.equal(a[0].dataset.geometryMotion,'running');
 r.motion.matches=true;r.motion.emit('change');assert.equal(a[0].dataset.geometryMotion,'paused');
 r.motion.matches=false;r.motion.emit('change');assert.equal(a[0].dataset.geometryMotion,'running');
});
test('reduced motion, data saving and initial pause prevent automatic scene construction',async()=>{
 for(const options of [{reduced:true},{saveData:true},{paused:true}]){
  const r=loader(options);r.show(r.add(['alpha']));await r.flush();assert.equal(r.views.length,0);
 }
});
test('a preview that leaves the viewport before loading cannot attach a stale canvas',async()=>{
 const r=loader(),a=r.add(['alpha']);r.show(a);r.hide(a);await r.flush();assert.equal(r.views.length,0);
 r.show(a);r.window.emit('mdc:before-content-change');await r.flush();assert.equal(r.views.length,0);
});
