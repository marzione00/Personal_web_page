import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {loadContent} from '../src/content.mjs';import {renderPages,shellHtml} from '../src/render.mjs';
const root=new URL('../',import.meta.url).pathname,read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
function entry(options={}){
 const events={},dialogEvents={},jobs=new Map(),storage=new Map(options.seen?[['mdc-entry-v36','seen']]:[]);let listener,id=0,focus=0;
 const button={disabled:false,addEventListener(n,fn){events.replay=fn;}};
 const skip={addEventListener(n,fn){events.skip=fn;}};
 const dialog={open:false,querySelector(){return skip;},addEventListener(n,fn){dialogEvents[n]=fn;},showModal(){this.open=true;},close(){this.open=false;dialogEvents.close?.();}};
 const fx={intro:true,transitions:true,ambient:'on',reduced:false,...options.fx,subscribe(fn){listener=fn;}};
 const document={hidden:false,activeElement:{isConnected:true,focus(){focus++;}},querySelector(q){return q==='[data-entry-dialog]'?dialog:dialog.open?dialog:null;},querySelectorAll(){return [button];},addEventListener(n,fn){events[n]=fn;}};
 const window={MDCEffects:fx,dispatchEvent(){},addEventListener(n,fn){events[n]=fn;}};
 vm.runInNewContext(read('src/cinema.js'),{window,document,location:{hash:options.hash||''},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout(fn,ms){jobs.set(++id,{fn,ms});return id;},clearTimeout(n){jobs.delete(n);},Event:class{}});
 return {dialog,jobs,button,document,events,storage,get focus(){return focus;},finish(){[...jobs.values()].forEach(j=>j.fn());},set(v){Object.assign(fx,v);listener();}};
}
test('entry finishes within 2.2 seconds, records the session and leaves no timer',()=>{const a=entry();assert.ok(a.dialog.open);assert.equal(a.jobs.size,1);assert.equal([...a.jobs.values()][0].ms,2200);assert.equal(a.storage.get('mdc-entry-v36'),'seen');a.finish();assert.equal(a.dialog.open,false);assert.equal(a.jobs.size,0);});
test('entry never interrupts a deep link, a repeat visit, or disabled motion',()=>{for(const option of [{hash:'#main'},{seen:true},{fx:{reduced:true}},{fx:{transitions:false}},{fx:{intro:false}},{fx:{ambient:'static'}},{fx:{ambient:'off'}}]){const a=entry(option);assert.equal(a.dialog.open,false);assert.equal(a.jobs.size,0);}});
test('skip, visibility and changed preferences dismiss entry; replay restores focus',()=>{
 const a=entry();a.events.skip();assert.equal(a.dialog.open,false);a.events.replay();assert.ok(a.dialog.open);a.finish();assert.equal(a.focus,1);
 a.events.replay();a.document.hidden=true;a.events.visibilitychange();assert.equal(a.dialog.open,false);assert.equal(a.jobs.size,0);
 a.document.hidden=false;a.events.replay();a.set({intro:false});assert.equal(a.dialog.open,false);assert.ok(a.button.disabled);
});
test('the opening is homepage-only, with replay and bilingual labels',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language});for(const p of renderPages(d)){const h=shellHtml({data:d,page:p,css:'',js:'',csp:"default-src 'none'"});assert.equal(h.includes('data-entry-dialog'),p.file==='index.html');if(p.file==='index.html'){assert.match(h,/data-entry-replay/);assert.ok(h.includes(language==='en'?'Enter the site':'Entra nel sito'));}}}
});
test('wireframe contains unique real mesh edges, without degenerate lines',()=>{
 const window={};vm.runInNewContext(read('public/assets/geometry-viewer.js'),{window,Uint16Array});
 const result=Array.from(window.MDCGeometry.edgeIndices(new Uint16Array([0,1,2,2,1,3,3,3,0])));
 const pairs=[];for(let i=0;i<result.length;i+=2){assert.ok(result[i]<result[i+1]);pairs.push(result[i]+','+result[i+1]);}
 assert.equal(new Set(pairs).size,pairs.length);assert.deepEqual(pairs,['0,1','1,2','0,2','1,3','2,3','0,3']);
});
test('all 24 models can provide bounded nonempty wireframes without modifying geometry',()=>{
 const window={};vm.runInNewContext(read('public/assets/geometry-viewer.js'),{window,ArrayBuffer,DataView,Float32Array,Int16Array,Uint16Array,Uint8Array,Math});
 const manifest=JSON.parse(read('public/geometry/manifest.json'));
 for(const g of manifest){const b=fs.readFileSync(new URL('../public/geometry/'+g.scene,import.meta.url));const m=window.MDCGeometry.decode(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),edges=window.MDCGeometry.edgeIndices(m.ix);assert.ok(edges.length>0&&edges.length<=m.ix.length*2);assert.ok(edges.every(n=>n<m.p.length/3));}
});
test('geometry controls remain bilingual and explicit in immersive mode',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language}),p=renderPages(d).find(p=>p.file==='geometrie.html'),h=shellHtml({data:d,page:p,css:'',js:'',csp:"default-src 'none'"});for(const control of ['data-geo-style','data-geo-expand','data-geo-close','data-geo-spin'])assert.ok(h.includes(control));assert.ok(h.includes(language==='en'?'Wireframe':'Reticolo'));assert.ok(h.includes(language==='en'?'Immersive view':'Vista immersiva'));}
});
test('all models render with Canvas 2D when WebGL is unavailable, with bounded zoom and cleanup',()=>{
 const calls={fill:0,stroke:0,image:0},frames=new Map();let next=0;
 const ctx={setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){calls.fill++;},stroke(){calls.stroke++;},drawImage(){calls.image++;},createImageData(w,h){return {data:new Uint8ClampedArray(w*h*4)};},putImageData(){}};
 const canvas=()=>({width:0,height:0,setAttribute(){},getContext(type){return type==='2d'?ctx:null;},remove(){}});
 const document={hidden:false,createElement:canvas},window={devicePixelRatio:3};
 vm.runInNewContext(read('public/assets/geometry-viewer.js'),{document,window,performance,ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},requestAnimationFrame(fn){frames.set(++next,fn);return next;},cancelAnimationFrame(id){frames.delete(id);},ArrayBuffer,DataView,Float32Array,Int16Array,Uint16Array,Uint8Array,Math});
 const v=new window.MDCGeometry.Viewer();assert.ok(v.software);
 const host={classList:{add(){},remove(){}},append(){},getBoundingClientRect(){return {width:1600,height:1200};}};v.attach(host);
 for(const g of JSON.parse(read('public/geometry/manifest.json'))){const b=fs.readFileSync(new URL('../public/geometry/'+g.scene,import.meta.url));v.load(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength));for(const mode of ['glow','surface','wire'])v.setMode(mode);assert.ok(v.projected.every(Number.isFinite));assert.ok(v.canvas.width<=1400&&v.canvas.height<=1100);}
 assert.ok(calls.fill&&calls.stroke&&calls.image);v.setZoom(99);assert.equal(v.zoom,2.4);v.setZoom(-1);assert.equal(v.zoom,.65);v.auto=true;v.start();v.start();assert.equal(frames.size,1);v.detach();assert.equal(frames.size,0);assert.equal(v.host,null);assert.equal(v.auto,false);v.dispose();assert.equal(v.alive,false);
});
test('asynchronous geometry labels are translated after interactions',()=>{
 const window={},document={documentElement:{lang:'en'},addEventListener(){}};vm.runInNewContext(read('src/i18n-client.js'),{window,document});
 for(const [it,en] of [['Ferma rotazione','Stop rotation'],['Ruota','Rotate'],['Mostra spiegazione','Show explanation'],['Vista immersiva','Immersive view'],['Disattiva le animazioni automatiche','Disable automatic animations']])assert.equal(window.MDCTranslate(it),en);
});
