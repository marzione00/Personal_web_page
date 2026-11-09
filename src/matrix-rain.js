/* Scientific rain: one full-viewport canvas, three cached glyph layers.
 * Native content remains above it. Mobile gets fewer columns, never an empty canvas.
 * No RAF in static/off/reduced-motion mode, hidden tabs or modal dialogs.
 */
(() => {
 'use strict';
 const config=window.MDCEffects,library=window.MDCFormulaCatalog;
 if(!config||!library)return;
 const body=document.body,canvas=document.createElement('canvas');
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 canvas.className='matrix-ambient';canvas.setAttribute('aria-hidden','true');canvas.setAttribute('role','presentation');body.append(canvas);
 let W=0,H=0,dpr=1,mobile=false,streams=[],layers=[],formulas=[],deck=[];
 let raf=0,last=0,clock=0,nextFormula=4,frames=0,meanCost=0,resizeTimer=0,burst=0,adaptive=1,slowFrames=0,qualityMode=config.quality;
 let light=false,rgb='113,224,153',formulaSetting=config.formulas,textureHeight=1536;
 const themes={quantum:['quantum','quantum-information','cryptography'],geometry:['quantitative'],research:['learning','information','statistical','solid-state'],probability:['probability','quantitative'],teaching:['quantum','probability','algorithms','quantitative']};
 const context=()=>body.dataset?.ambientContext||'general';
 const intensity=()=>({low:{alpha:.6,speed:.75},normal:{alpha:1,speed:1},cinema:{alpha:1.3,speed:1.25}}[config.intensity]||{alpha:1,speed:1});
 let reader=null,readingVisible=false;
 function readingState(){if(body.dataset)body.dataset.readingFocus=String(Boolean(config.reading!==false&&readingVisible));}
 function watchReading(){
  reader?.disconnect();readingVisible=false;readingState();
  if(typeof IntersectionObserver==='undefined')return;
  const content=document.querySelector('[data-view]:not([hidden]) .article-layout .prose, [data-view]:not([hidden]) .travel-diary, body:not([data-portable]) .article-layout .prose, body:not([data-portable]) .travel-diary');
  if(!content)return;
  reader=new IntersectionObserver(entries=>{readingVisible=entries.some(e=>e.isIntersecting);readingState();},{rootMargin:'-160px 0px -15% 0px',threshold:0});reader.observe(content);
 }
 const rand=(a,b)=>a+Math.random()*(b-a),choose=a=>a[Math.floor(Math.random()*a.length)];
 const occluded=()=>Boolean(document.querySelector('dialog[open]'));
 const canShow=()=>W>0&&H>0&&config.ambient!=='off';
 const canRun=()=>canShow()&&config.ambient==='on'&&!config.reduced&&!config.paused&&!document.hidden&&!occluded();
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 function refill(){
  const families=shuffle((themes[context()]||Object.keys(library.families)).filter(k=>library.families[k]));
  const groups=families.map(k=>shuffle(library.entries.filter(f=>f.family===k)));
  deck=[];for(let i=0;groups.some(g=>g.length>i);i++)for(const g of groups)if(g[i])deck.push(g[i]);
 }
 function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}
 function makeLayer(size,spacing,speed,alpha){
  const cell=Math.ceil(size*1.25),gap=Math.ceil(size*1.35),variants=12;
  const texture=document.createElement('canvas');texture.width=Math.ceil(cell*variants*dpr);texture.height=Math.ceil(textureHeight*dpr);
  const c=texture.getContext('2d');if(!c)return null;
  c.scale(dpr,dpr);c.font=`${size}px ui-monospace,Consolas,monospace`;c.textBaseline='top';
  const glyphs=config.formulas?'ψφ∇∂λΩΣπ∞01⊗αβδμ∫θℏ':'010123456789[]{}';
  for(let x=0;x<variants;x++){
   const period=25+Math.floor(rand(0,11)),phase=Math.floor(rand(0,period));
   for(let row=0;row*gap<textureHeight;row++){
    const behind=(row+phase)%period,tail=behind<19?Math.pow(1-behind/19,1.5):0;
    // The luminous head is below its fading trail: all streams fall downwards.
    const y=textureHeight-(row+1)*gap;
    c.fillStyle=behind===0?(light?'rgba(20,91,54,.75)':'rgba(204,255,219,.9)'):`rgba(${rgb},${.025+tail*.65})`;
    c.fillText(choose(glyphs),x*cell+1,y);
   }
  }
  const layer={texture,size,cell,alpha};layers.push(layer);
  for(let x=rand(0,spacing);x<W;x+=spacing){streams.push({layer,x,t:rand(0,textureHeight),speed:rand(speed*.65,speed*1.3),variant:Math.floor(rand(0,variants)),gain:rand(.65,1)});}
  return layer;
 }
 function makeTextures(){
  layers=[];streams=[];
  makeLayer(10,(mobile?37:30)/adaptive,17,.25);
  makeLayer(mobile?13:15,(mobile?33:28)/adaptive,35,.46);
  makeLayer(mobile?18:21,(mobile?104:81)/adaptive,59,.58);
 }
 function layout(){
  stop();refill();light=body.classList.contains('reading-mode');rgb=light?'23,107,66':'113,224,153';
  W=document.documentElement.clientWidth;H=innerHeight;mobile=W<700;
  dpr=Math.min(devicePixelRatio||1,adaptive<1?1:1.5,mobile?1.25:1.5,Math.sqrt(6000000/Math.max(1,W*H)));
  canvas.width=Math.max(1,Math.floor(W*dpr));canvas.height=Math.max(1,Math.floor(H*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
  makeTextures();formulas=[];burst=0;
  if(config.formulas){for(let i=0;i<(mobile?2:4);i++)addFormula(true);}
  sync();
 }
 function addFormula(initial=false){
  if(!config.formulas||formulas.length>=(mobile?3:5)||W<1||H<1)return;
  const size=mobile?13:15,maxWidth=Math.max(0,Math.min(W-32,mobile?W-32:360));
  ctx.font=`${size}px ui-monospace,Consolas,monospace`;
  if(!deck.length)refill();
  let index=deck.findIndex(f=>ctx.measureText(f.formula).width<=maxWidth);
  if(index<0){refill();index=deck.findIndex(f=>ctx.measureText(f.formula).width<=maxWidth);}if(index<0)return;
  const item=deck[index],width=ctx.measureText(item.formula).width;
  let box;
  for(let attempt=0;attempt<16;attempt++){
   const candidate={x:rand(16,Math.max(16,W-width-16)),y:rand(Math.min(100,H*.18),Math.max(110,H-100)),w:width,h:58};
   if(!formulas.some(f=>candidate.x<f.x+f.width+12&&candidate.x+width+12>f.x&&candidate.y<f.y+58&&candidate.y+58>f.y)){box=candidate;break;}
  }
  if(!box)return;
  deck.splice(index,1);
  formulas.push({item,x:box.x,y:box.y,born:clock-(initial?1.6:0),ttl:rand(9,12),size,width,speed:rand(3,6)});
 }
 function curtain(){
  const progress=1-burst/.72,alpha=Math.sin(progress*Math.PI)*.24;
  ctx.font=`${mobile?14:17}px ui-monospace,Consolas,monospace`;ctx.textBaseline='top';
  const bank=config.formulas?'ψφ∇∂λΩΣπ∞01⊗ℏ':'010101';
  const spacing=mobile?35:29;
  for(let column=0;column<W/spacing;column++){
   const delay=((column*13)%11)/65,head=(progress-delay)/.72*(H+210);
   for(let k=0;k<12;k++){
    const y=head-k*21;if(y<0||y>H)continue;
    ctx.fillStyle=`rgba(${rgb},${alpha*(1-k/12)})`;ctx.fillText(bank[(column*7+k)%bank.length],column*spacing+6,y);
   }
  }
 }
 function paint(dt){
  ctx.clearRect(0,0,W,H);if(!canShow())return;
  const acceleration=burst>0?1+Math.sin((1-burst/.72)*Math.PI)*2:1;
  for(const s of streams){
   s.t=(s.t+s.speed*dt*acceleration*intensity().speed)%textureHeight;
   const l=s.layer;ctx.globalAlpha=Math.min(1,l.alpha*s.gain*(light?.72:1)*intensity().alpha);
   for(let y=s.t-textureHeight;y<H;y+=textureHeight)ctx.drawImage(l.texture,s.variant*l.cell*dpr,0,l.cell*dpr,textureHeight*dpr,s.x,y,l.cell,textureHeight);
  }
  ctx.globalAlpha=1;
  if(config.formulas){
   formulas=formulas.filter(f=>clock-f.born<f.ttl);
   for(const f of formulas){
    f.y=Math.min(H-38,f.y+dt*f.speed);
    const age=clock-f.born,fade=clamp(Math.min(age/1.5,(f.ttl-age)/2),0,1);
    ctx.fillStyle=light?`rgba(243,243,235,${fade*.48})`:`rgba(9,17,14,${fade*.52})`;
    ctx.fillRect(f.x-5,f.y-4,f.width+10,26);
    ctx.font=`${f.size}px ui-monospace,Consolas,monospace`;ctx.textBaseline='top';ctx.fillStyle=`rgba(${rgb},${Math.min(.95,fade*(light?.55:.7)*intensity().alpha)})`;
    ctx.fillText(f.item.formula,f.x,f.y);
   }
  }
  if(burst>0)curtain();
  frames++;
 }
 function frame(now){
  raf=0;if(!canRun())return;
  const interval=1000/((mobile?20:24)*adaptive);
  if(!last)last=now-interval;
  const elapsed=now-last;
  if(elapsed>=interval){
   const start=performance.now(),dt=Math.min(elapsed/1000,.1);last=now;clock+=dt;
   if(clock>=nextFormula){addFormula();nextFormula=clock+rand(3,5);}
   burst=Math.max(0,burst-dt);paint(dt);meanCost=meanCost*.96+(performance.now()-start)*.04;
   if(config.quality==='auto'&&adaptive>.55){slowFrames=meanCost>12?slowFrames+1:Math.max(0,slowFrames-1);if(slowFrames>45){adaptive=Math.max(.55,adaptive-.2);slowFrames=0;makeTextures();}}
  }
  raf=requestAnimationFrame(frame);
 }
 function sync(){
  if(qualityMode!==config.quality){qualityMode=config.quality;adaptive=(qualityMode==='auto'&&navigator.connection?.saveData)?0.55:1;slowFrames=0;makeTextures();}
  stop();readingState();canvas.hidden=!canShow();
  if(formulaSetting!==config.formulas){formulaSetting=config.formulas;makeTextures();formulas=[];if(config.formulas)addFormula(true);}
  if(!config.formulas)formulas=[];
  if(!canRun())burst=0;
  if(canShow())paint(0);else ctx.clearRect(0,0,W,H);
  if(canRun())raf=requestAnimationFrame(frame);
 }
 config.subscribe(sync);
 window.addEventListener('mdc:content-change',()=>{refill();formulas=[];if(config.formulas){for(let i=0;i<(mobile?2:4);i++)addFormula(true);}watchReading();sync();});
 document.addEventListener('visibilitychange',sync);
 window.addEventListener('mdc:page-transition',()=>{if(canRun()&&config.transitions)burst=.72;});
 window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,120);},{passive:true});
 window.addEventListener('pageshow',sync);window.addEventListener('pagehide',stop);
 const classes=new MutationObserver(()=>{if(light!==body.classList.contains('reading-mode'))layout();});classes.observe(body,{attributes:true,attributeFilter:['class']});
 const modals=new MutationObserver(sync);modals.observe(body,{subtree:true,attributes:true,attributeFilter:['open']});
 window.MDCMatrixDebug={
  get context(){return context();},get intensity(){return config.intensity||'normal';},get readingFocus(){return readingVisible&&config.reading!==false;},get formulaFamilies(){return formulas.map(f=>f.item.family);},get active(){return Boolean(raf);},get frames(){return frames;},get regions(){return [{x:0,w:W}];},get columns(){return streams.length;},get direction(){return 'down';},
  get streams(){return streams.map(s=>({x:s.x,y:s.t,speed:s.speed,layer:s.layer.size}));},get texturePeriod(){return textureHeight;},get fontSize(){return layers[1]?.size||0;},
  get formulaIds(){return formulas.map(f=>f.item.id);},get formulaBoxes(){return formulas.map(f=>({x:f.x,y:f.y,w:f.width,h:22,side:0}));},get meanDrawMs(){return meanCost;},get qualityScale(){return adaptive;},get catalogSize(){return library.entries.length;},get layers(){return layers.length;},get mobile(){return mobile;},get burst(){return burst;}
 };
 if(config.quality==='auto'&&navigator.connection?.saveData)adaptive=.55;layout();watchReading();
})();
