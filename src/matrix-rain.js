/* MDC_LAB 2.7 — subtle side rain of micro-numerical code with occasional physics formulae.
 * Decorative only: it never blocks interaction, respects reduced motion and stays off on small viewports.
 */
(() => {
 'use strict';
 if(document.documentElement.dataset.matrixRain==='off')return;
 const supportsCanvas=!!document.createElement('canvas').getContext;
 if(!supportsCanvas)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const mobile=window.matchMedia?.('(max-width: 980px)');
 const body=document.body;
 if(!body)return;
 const charPool='0123456789+-=<>λΣπ∂∆xyzψφ[]{}()/*'.split('');
 const formulas=[
  'iħ ∂ψ/∂t = Ĥψ',
  '-ħ²/(2m) ∇²ψ + Vψ = Eψ',
  '∇ · E = ρ/ε₀',
  '∇ × B = μ₀J + μ₀ε₀ ∂E/∂t',
  'E² = p²c² + m²c⁴',
  'F = -∇V',
  'Hψ = Eψ',
  'Z = Σ e^{-βE_n}',
  'S = k_B ln Ω',
  'ω = √(k/m)',
  'Δx Δp ≥ ħ/2',
  'ds² = g_{μν} dx^μ dx^ν'
 ];
 
 const shell=document.createElement('div');
 shell.className='matrix-rain-shell';
 shell.setAttribute('aria-hidden','true');
 shell.innerHTML='<div class="matrix-rain-side left"><canvas></canvas></div><div class="matrix-rain-side right"><canvas></canvas></div>';
 body.append(shell);
 const sides=[...shell.querySelectorAll('.matrix-rain-side')].map((side,index)=>({
  side,
  canvas:side.querySelector('canvas'),
  ctx:side.querySelector('canvas').getContext('2d'),
  sign:index===0?1:-1,
  columns:[],
  formulas:[]
 }));
 let raf=0,last=0,lastFormula=0,visible=true;
 
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
 const rand=(min,max)=>min+Math.random()*(max-min);
 const rootStyle=()=>getComputedStyle(document.documentElement);
 const monoFont=()=>rootStyle().getPropertyValue('--mono').trim()||'monospace';
 function parseHexColor(value){
  const hex=(value||'').trim();
  const match=hex.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if(!match)return [149,229,183];
  let raw=match[1];
  if(raw.length===3)raw=raw.split('').map(ch=>ch+ch).join('');
  return [parseInt(raw.slice(0,2),16),parseInt(raw.slice(2,4),16),parseInt(raw.slice(4,6),16)];
 }
 function colors(){
  const rgb=parseHexColor(rootStyle().getPropertyValue('--green'));
  const ink=parseHexColor(rootStyle().getPropertyValue('--ink'));
  return {
   rgb,
   line:`rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.28)`,
   bright:`rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.78)`,
   formula:`rgba(${ink[0]},${ink[1]},${ink[2]},0.82)`
  };
 }
 function fontSize(){
  const w=window.innerWidth||1280;
  if(w>=1640)return 6;
  if(w>=1320)return 6.5;
  if(w>=1080)return 7;
  return 7.5;
 }
 function density(){
  return clamp((window.innerHeight||900)/900,0.9,1.25);
 }
 function setupSide(sideObj){
  const {canvas,ctx,side}=sideObj;
  const rect=side.getBoundingClientRect();
  const ratio=clamp(window.devicePixelRatio||1,1,1.5);
  canvas.width=Math.max(1,Math.round(rect.width*ratio));
  canvas.height=Math.max(1,Math.round(window.innerHeight*ratio));
  ctx.setTransform(ratio,0,0,ratio,0,0);
  const fs=fontSize();
  const step=Math.round(fs+3);
  const count=Math.max(4,Math.floor(rect.width/step));
  sideObj.fs=fs;sideObj.step=step;sideObj.width=rect.width;sideObj.height=window.innerHeight;
  sideObj.columns=Array.from({length:count},(_,i)=>({
   x:i*step+rand(0,2),
   y:rand(-window.innerHeight,window.innerHeight),
   speed:rand(22,54)*density(),
   length:Math.floor(rand(11,24)),
   phase:rand(0,Math.PI*2)
  }));
  sideObj.formulas=[];
 }
 function layout(){
  visible=!(mobile?.matches);
  shell.hidden=!visible;
  if(!visible)return;
  sides.forEach(setupSide);
 }
 function pushFormula(sideObj){
  const fs=sideObj.fs||7;
  sideObj.formulas.push({
   text:pick(formulas),
   x:sideObj.sign>0?8:Math.max(6,sideObj.width-rand(46,94)),
   y:rand(50,Math.max(90,sideObj.height-60)),
   life:0,
   ttl:rand(4.6,7.2),
   drift:rand(2,8)*sideObj.sign,
   size:fs+rand(2.2,4.2)
  });
  if(sideObj.formulas.length>4)sideObj.formulas.shift();
 }
 function drawColumn(sideObj,column,dt,palette){
  column.y+=column.speed*dt;
  if(column.y-column.length*sideObj.step>sideObj.height+30){
   column.y=rand(-160,-20);
   column.speed=rand(22,54)*density();
   column.length=Math.floor(rand(11,24));
  }
  const ctx=sideObj.ctx;
  for(let i=0;i<column.length;i++){
   const y=column.y-i*sideObj.step;
   if(y<-24||y>sideObj.height+24)continue;
   const ch=charPool[(Math.floor((performance.now()/80)+(column.x*0.3)+i*3+column.phase*10))%charPool.length];
   const alpha=(1-(i/column.length))*0.56;
   ctx.fillStyle=i===0?palette.bright:`rgba(${palette.rgb[0]},${palette.rgb[1]},${palette.rgb[2]},${alpha.toFixed(3)})`;
   ctx.fillText(ch,column.x,y);
  }
 }
 function drawFormula(sideObj,item,dt,palette){
  item.life+=dt;
  const t=item.life/item.ttl;
  if(t>=1)return false;
  const fade=t<0.22?t/0.22:t>0.82?(1-t)/0.18:1;
  sideObj.ctx.save();
  sideObj.ctx.font=`${item.size}px ${monoFont()}`;
  sideObj.ctx.fillStyle=palette.formula.replace(/0\.82\)$/,(0.24+fade*0.34).toFixed(2)+')');
  sideObj.ctx.fillText(item.text,item.x+item.drift*t,item.y);
  sideObj.ctx.restore();
  return true;
 }
 function frame(now){
  raf=window.requestAnimationFrame(frame);
  if(!visible||document.hidden)return;
  if(!last)last=now;
  const dt=Math.min((now-last)/1000,0.05);last=now;
  const palette=colors();
  if(now-lastFormula>rand(1800,3100)){
   pushFormula(pick(sides));
   lastFormula=now;
  }
  for(const sideObj of sides){
   const {ctx,width,height,fs}=sideObj;
   ctx.clearRect(0,0,width,height);
   ctx.fillStyle='rgba(0,0,0,0.03)';
   ctx.fillRect(0,0,width,height);
   ctx.font=`${fs}px ${monoFont()}`;
   ctx.textBaseline='top';
   sideObj.columns.forEach(col=>drawColumn(sideObj,col,dt,palette));
   sideObj.formulas=sideObj.formulas.filter(item=>drawFormula(sideObj,item,dt,palette));
  }
 }
 function start(){
  cancelAnimationFrame(raf);raf=0;last=0;lastFormula=0;
  if(reduced?.matches||mobile?.matches){layout();return;}
  layout();if(visible)raf=window.requestAnimationFrame(frame);
 }
 reduced?.addEventListener?.('change',start);
 mobile?.addEventListener?.('change',start);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)last=0;});
 window.addEventListener('resize',()=>{layout();last=0;},{passive:true});
 start();
})();
