import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {loadAmbientFormulas} from '../src/ambient-content.mjs';
const source=fs.readFileSync(new URL('../src/matrix-rain.js',import.meta.url),'utf8');
const catalog=loadAmbientFormulas(new URL('../',import.meta.url).pathname);
function setup(width=390,height=844,options={}){
 const events={},observers=[],jobs=new Map(),draws=[];let next=0,now=0,dialog=false,subscriber;
 const context={scale(){},setTransform(){},clearRect(){draws.length=0;},fillRect(){},fillText(){},drawImage(...args){draws.push(args);},measureText(text){return {width:text.length*7};}};
 const createCanvas=()=>({width:0,height:0,hidden:false,setAttribute(){},getContext(){return context;}});
 const body={dataset:{ambientContext:options.context||'general'},classList:{contains(){return false;}},append(c){this.canvas=c;}};
 const document={body,hidden:false,documentElement:{clientWidth:width},createElement:createCanvas,querySelector(){return dialog?{}:null;},addEventListener(name,fn){events[name]=fn;}};
 const state={ambient:'on',reduced:false,formulas:true,transitions:true,...options,subscribe(fn){subscriber=fn;}};
 const window={MDCEffects:state,MDCFormulaCatalog:catalog,addEventListener(name,fn){events[name]=fn;}};
 const sandbox={window,document,innerHeight:height,devicePixelRatio:3,performance:{now:()=>now},Math,MutationObserver:class{constructor(fn){this.fn=fn;observers.push(this);}observe(){}},requestAnimationFrame(fn){jobs.set(++next,fn);return next;},cancelAnimationFrame(id){jobs.delete(id);},setTimeout(fn){fn();return 1;},clearTimeout(){}};
 vm.runInNewContext(source,sandbox);
 return {state,document,canvas:body.canvas,debug:window.MDCMatrixDebug,jobs,draws,
  tick(){now+=60;const callbacks=[...jobs.values()];jobs.clear();callbacks.forEach(fn=>fn(now));},
  set(values){Object.assign(state,values);subscriber();},
  emit(name){events[name]?.();},
  modal(open){dialog=open;observers[1].fn();}
 };
}
test('animated scientific rain covers mobile, tablet and desktop including the center',()=>{
 for(const width of [320,390,768,1440,2160]){
  const p=setup(width);assert.equal(p.canvas.hidden,false);assert.equal(p.debug.active,true);
  assert.equal(p.debug.regions.length,1);assert.equal(p.debug.regions[0].w,width);assert.equal(p.debug.layers,3);
  assert.ok(p.debug.streams.some(s=>s.x>width*.35&&s.x<width*.65));
  assert.ok(p.debug.formulaIds.length>0);assert.ok(p.debug.formulaBoxes.every(f=>f.x>=0&&f.x+f.w<=width));
  const before=p.debug.streams.map(s=>s.y);p.tick();
  assert.ok(p.debug.streams.every((s,i)=>(s.y-before[i]+p.debug.texturePeriod)%p.debug.texturePeriod>0));
 }
});
test('static and reduced-motion show a complete scene without scheduling frames',()=>{
 for(const options of [{ambient:'static'},{reduced:true}]){
  const p=setup(390,844,options);assert.equal(p.canvas.hidden,false);assert.equal(p.debug.active,false);assert.equal(p.jobs.size,0);assert.ok(p.draws.length>0);assert.ok(p.debug.formulaIds.length>0);
  const before=p.debug.frames;p.tick();assert.equal(p.debug.frames,before);
 }
});
test('off, modal, visibility and preferences stop and resume the single RAF correctly',()=>{
 const p=setup();p.set({ambient:'off'});assert.equal(p.canvas.hidden,true);assert.equal(p.jobs.size,0);
 p.set({ambient:'on'});assert.equal(p.jobs.size,1);
 p.modal(true);assert.equal(p.jobs.size,0);p.modal(false);assert.equal(p.jobs.size,1);
 p.document.hidden=true;p.emit('visibilitychange');assert.equal(p.jobs.size,0);
 p.document.hidden=false;p.emit('visibilitychange');assert.equal(p.jobs.size,1);
 p.set({formulas:false});assert.equal(p.debug.formulaIds.length,0);assert.equal(p.jobs.size,1);
 p.set({formulas:true});assert.ok(p.debug.formulaIds.length>0);assert.equal(p.jobs.size,1);
 p.emit('pagehide');assert.equal(p.jobs.size,0);p.emit('pageshow');assert.equal(p.jobs.size,1);
});
test('transition impulse is bounded and respects static and motion preferences',()=>{
 const p=setup();p.emit('mdc:page-transition');assert.ok(p.debug.burst>0);
 for(let i=0;i<20;i++)p.tick();assert.equal(p.debug.burst,0);
 p.set({transitions:false});p.emit('mdc:page-transition');assert.equal(p.debug.burst,0);
 p.set({transitions:true,ambient:'static'});p.emit('mdc:page-transition');assert.equal(p.debug.burst,0);assert.equal(p.jobs.size,0);
});
test('raster memory stays bounded on high-resolution displays',()=>{
 const p=setup(3840,2160);assert.ok(p.canvas.width*p.canvas.height<=6000000);
});

test('page contexts restrict formula families and portable navigation refreshes the deck',()=>{
 const allowed={quantum:['quantum','quantum-information','cryptography'],geometry:['quantitative'],research:['learning','information','statistical','solid-state'],probability:['probability','quantitative']};
 const p=setup(1440,900);
 for(const [context,families] of Object.entries(allowed)){
  p.document.body.dataset.ambientContext=context;p.emit('mdc:content-change');
  assert.equal(p.debug.context,context);assert.ok(p.debug.formulaFamilies.length>0);
  assert.ok(p.debug.formulaFamilies.every(f=>families.includes(f)));assert.equal(p.jobs.size,1);
 }
});
test('intensity changes the existing rain speed without adding RAF jobs or raster layers',()=>{
 const p=setup(390,844,{intensity:'low'});const x=p.debug.streams[0];p.tick();
 const low=(p.debug.streams[0].y-x.y+p.debug.texturePeriod)%p.debug.texturePeriod;
 p.set({intensity:'cinema'});const y=p.debug.streams[0];p.tick();
 const cinema=(p.debug.streams[0].y-y.y+p.debug.texturePeriod)%p.debug.texturePeriod;
 assert.ok(cinema>low*1.5);assert.equal(p.jobs.size,1);assert.equal(p.debug.layers,3);assert.equal(p.debug.intensity,'cinema');
});
