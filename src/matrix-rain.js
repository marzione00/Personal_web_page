/* Microcode C: full available side columns, cached glyph strips, 24 fps maximum.
 * A single decorative canvas. No drawing in the central content corridor.
 * Stops its RAF while hidden, static, reduced-motion or behind a dialog.
 */
(() => {
 'use strict';
 const config=window.MDCEffects,library=window.MDCFormulaCatalog;
 if(!config||!library)return;
 const body=document.body,canvas=document.createElement('canvas');
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 canvas.className='matrix-ambient';canvas.setAttribute('aria-hidden','true');canvas.setAttribute('role','presentation');body.append(canvas);
 let texture=null,textureHeight=0,textureScale=1,streams=[],regions=[],W=0,H=0,dpr=1,font=6.5,cell=9;
 let raf=0,last=0,clock=0,nextFormula=3.2,formulas=[],deck=[],frames=0,meanCost=0,resizeTimer=0;
 let rgb='149,229,183',light=false,disposed=false;
 const rand=(a,b)=>a+Math.random()*(b-a),choose=a=>a[Math.floor(Math.random()*a.length)];
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function refill(){
  const families=shuffle(Object.keys(library.families));
  const groups=families.map(k=>shuffle(library.entries.filter(f=>f.family===k)));
  deck=[];for(let i=0;groups.some(g=>g.length>i);i++)for(const g of groups)if(g[i])deck.push(g[i]);
 }
 const canShow=()=>!disposed&&regions.length>0&&config.ambient!=='off';
 const occluded=()=>Boolean(document.querySelector('dialog[open]'));
 const canRun=()=>canShow()&&config.ambient==='on'&&!config.reduced&&!document.hidden&&!occluded();
 function palette(){
  light=body.classList.contains('reading-mode');rgb=light?'23,107,66':'149,229,183';
 }
 function makeTexture(){
  texture=document.createElement('canvas');textureScale=dpr;textureHeight=1536;
  texture.width=Math.ceil(cell*16*dpr);texture.height=Math.ceil(textureHeight*dpr);
  const c=texture.getContext('2d');if(!c)return;
  c.scale(dpr,dpr);c.font=`${font}px ${getComputedStyle(body).getPropertyValue('--mono')||'monospace'}`;c.textBaseline='top';
  const digits='010101234567890123456789',rows=Math.ceil(textureHeight/10);
  for(let x=0;x<16;x++){
   const phase=Math.floor(rand(0,35)),period=37+Math.floor(rand(0,16));
   for(let row=0;row<rows;row++){
    const step=(row+phase)%period,behind=period-1-step,trail=behind<29?Math.pow(1-behind/29,1.8):0;
    const alpha=(light?.05:.04)+(light?.24:.36)*trail;
    c.fillStyle=behind===0?(light?'rgba(23,107,66,.48)':'rgba(193,247,217,.57)'):`rgba(${rgb},${alpha.toFixed(3)})`;
    c.fillText(digits[Math.floor(Math.random()*digits.length)],x*cell+1,row*10);
   }
  }
 }
 function layout(){
  stop();palette();W=document.documentElement.clientWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5,Math.sqrt(6000000/Math.max(1,W*H)));
  const area=document.querySelector('main .shell')||document.querySelector('.header .shell');
  const r=area?.getBoundingClientRect();
  const left=Math.max(0,Math.floor((r?.left??0)-16));
  const rightStart=Math.min(W,Math.ceil((r?.right??W)+16));
  regions=W>=1000?[{x:0,w:left},{x:rightStart,w:W-rightStart}].filter(x=>x.w>=18):[];
  canvas.width=Math.max(1,Math.ceil(W*dpr));canvas.height=Math.max(1,Math.ceil(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
  font=W>=1440?6.5:7;cell=Math.max(9,Math.ceil(regions.reduce((n,r)=>n+r.w,0)/180));
  streams=[];makeTexture();
  regions.forEach((r,side)=>{for(let x=5;x+font<r.w;x+=cell)streams.push({side,x:r.x+x,t:rand(0,textureHeight),speed:rand(13,32),variant:Math.floor(rand(0,16)),gain:rand(.55,1)});});
  formulas=[];last=0;canvas.hidden=!canShow();paint(0);sync();
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}
 function fits(f,region){
  const size=region.w>260?12:10;ctx.font=`${size}px ui-monospace,Consolas,monospace`;
  return ctx.measureText(f.formula).width<=region.w-24;
 }
 function addFormula(){
  if(!config.formulas||!regions.length)return;
  const vacant=regions.map((r,i)=>({r,i})).filter(o=>o.r.w>=90&&!formulas.some(f=>f.side===o.i));if(!vacant.length)return;
  const {r,i}=choose(vacant);if(!deck.length)refill();
  // Prefer a complete equation that fits; long expressions remain in the readable catalogue.
  let index=deck.findIndex(f=>fits(f,r));if(index<0){refill();index=deck.findIndex(f=>fits(f,r));}if(index<0)return;
  const item=deck.splice(index,1)[0],size=r.w>260?12:10;
  ctx.font=`${size}px ui-monospace,Consolas,monospace`;const tw=ctx.measureText(item.formula).width;
  formulas.push({item,side:i,x:r.x+(r.w-tw)/2,y:rand(Math.min(140,H*.25),Math.max(160,H-120)),born:clock,ttl:9,size,width:tw});
 }
 function paint(dt){
  ctx.clearRect(0,0,W,H);if(!canShow())return;
  for(const r of regions){
   ctx.save();ctx.beginPath();ctx.rect(r.x,0,r.w,H);ctx.clip();
   for(const s of streams){if(regions[s.side]!==r)continue;s.t=(s.t+s.speed*dt)%textureHeight;
    const edgeDistance=Math.min(s.x-r.x+8,r.x+r.w-s.x);ctx.globalAlpha=s.gain*Math.min(1,edgeDistance/28);
    const sy=s.t;for(let y=sy-textureHeight;y<H;y+=textureHeight)ctx.drawImage(texture,s.variant*cell*textureScale,0,cell*textureScale,textureHeight*textureScale,s.x,y,cell,textureHeight);
   }
   ctx.globalAlpha=1;
   // Fade only at the top/bottom and near the protected corridor; keep the entire margin populated.
   ctx.globalCompositeOperation='destination-in';
   const vertical=ctx.createLinearGradient(0,0,0,H);vertical.addColorStop(0,'rgba(0,0,0,.1)');vertical.addColorStop(.06,'#000');vertical.addColorStop(.94,'#000');vertical.addColorStop(1,'rgba(0,0,0,.1)');
   ctx.fillStyle=vertical;ctx.fillRect(r.x,0,r.w,H);ctx.restore();
  }
  if(config.formulas){
   formulas=formulas.filter(f=>clock-f.born<f.ttl);
   for(const f of formulas){
    const age=clock-f.born,fade=Math.min(1,age/1.8,(f.ttl-age)/2.5);
    ctx.save();const r=regions[f.side];ctx.beginPath();ctx.rect(r.x,0,r.w,H);ctx.clip();
    ctx.fillStyle=light?`rgba(243,243,235,${fade*.65})`:`rgba(9,17,14,${fade*.72})`;ctx.fillRect(f.x-5,f.y-5,f.width+10,26);
    ctx.font=`${f.size}px ui-monospace,Consolas,monospace`;ctx.textBaseline='top';ctx.fillStyle=`rgba(${rgb},${fade*(light?.65:.67)})`;ctx.fillText(f.item.formula,f.x,f.y);ctx.restore();
   }
  }
  frames++;
 }
 function frame(now){
  raf=0;if(!canRun())return;
  if(!last)last=now-42;
  const elapsed=now-last;if(elapsed>=1000/24){const start=performance.now(),dt=Math.min(elapsed/1000,.12);last=now;clock+=dt;
   if(clock>=nextFormula){addFormula();nextFormula=clock+rand(10,17);}paint(dt);meanCost=meanCost*.96+(performance.now()-start)*.04;
  }
  raf=requestAnimationFrame(frame);
 }
 function sync(){
  stop();canvas.hidden=!canShow();if(!config.formulas)formulas=[];
  if(canShow())paint(0);else ctx.clearRect(0,0,W,H);
  if(canRun())raf=requestAnimationFrame(frame);
 }
 config.subscribe(sync);
 document.addEventListener('visibilitychange',sync);
 window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,120);},{passive:true});
 window.addEventListener('pageshow',sync);window.addEventListener('pagehide',stop);
 const classes=new MutationObserver(layout);classes.observe(body,{attributes:true,attributeFilter:['class']});
 const modals=new MutationObserver(sync);modals.observe(body,{subtree:true,attributes:true,attributeFilter:['open']});
 window.MDCMatrixDebug={get active(){return Boolean(raf);},get frames(){return frames;},get regions(){return regions.map(x=>({...x}));},get columns(){return streams.length;},get direction(){return 'down';},get streams(){return streams.map(s=>({y:s.t,speed:s.speed}));},get texturePeriod(){return textureHeight;},get fontSize(){return font;},get formulaIds(){return formulas.map(f=>f.item.id);},get formulaBoxes(){return formulas.map(f=>({x:f.x,y:f.y,w:f.width,h:22,side:f.side}));},get meanDrawMs(){return meanCost;},get catalogSize(){return library.entries.length;}};
 layout();
})();
