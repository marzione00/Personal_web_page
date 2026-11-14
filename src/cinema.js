/* One finite choreography owns entry, page assembly and its cleanup. Content is
 * immediately available, even when animations, JavaScript or network fetches fail. */
(() => {
 'use strict';
 const fx=window.MDCEffects,dialog=document.querySelector('[data-entry-dialog]');if(!fx||!dialog)return;
 const code=dialog.querySelector('[data-entry-code]'),label='TOPOLOGICAL MANIFOLDS';
 let timer=0,frame=0,previous=null,entering=false,animations=[],decorations=[],cleanupTimers=new Set(),observer=null;
 const enabled=()=>fx.transitions&&!fx.reduced&&!document.hidden;
 const entryEnabled=()=>enabled()&&fx.intro&&fx.ambient==='on';
 const stats={entries:0,arrivals:0};
 function clearAssembly(){cleanupTimers.forEach(clearTimeout);cleanupTimers.clear();animations.forEach(a=>a.cancel());animations=[];decorations.forEach(n=>n.remove());decorations=[];observer?.disconnect();observer=null;}
 function animate(node,frames,options){if(!node?.animate)return;const a=node.animate(frames,{easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards',...options});animations.push(a);a.finished.then(()=>{animations=animations.filter(v=>v!==a);},()=>{});}
 function expire(node,delay){const id=setTimeout(()=>{node.remove();decorations=decorations.filter(n=>n!==node);cleanupTimers.delete(id);},delay);cleanupTimers.add(id);}
 function curtain(host,portrait=false){
  const node=document.createElement('span');node.className=portrait?'portrait-shutters':'construction-code';node.setAttribute('aria-hidden','true');
  for(let i=0;i<(portrait?12:22);i++){const col=document.createElement('i');if(!portrait)col.textContent='01 ψ λ 0 ∂ 1 Σ 0 Ψ 1 0 ∇ 0 1';node.append(col);}host.append(node);decorations.push(node);return node;
 }
 function assemble(root,opening){
  clearAssembly();if(!enabled())return;stats.arrivals++;
  const home=Boolean(root.querySelector('.hero')),duration=opening?1000:460;
  const h=root.querySelector('h1'),intro=root.querySelector('.hero-content')||root.querySelector('.page-head .lead');
  animate(h,[{opacity:.1,clipPath:'inset(0 100% 0 0)',transform:'translateY(8px)'},{opacity:1,clipPath:'inset(0)',transform:'translateY(0)'}],{duration,delay:opening?130:0});
  const items=home?Array.from(intro?.children||[]):[intro,root.querySelector('.page-body')].filter(Boolean);
  items.forEach((el,i)=>animate(el,[{opacity:.15,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:opening?700:360,delay:opening?280+i*130:80+i*70}));
  const portrait=root.querySelector('.hero-portrait');if(portrait){const masks=curtain(portrait,true);Array.from(masks.children).forEach((col,i)=>animate(col,[{transform:'translateY(0)'},{transform:'translateY(-102%)'}],{duration:opening?800:350,delay:opening?300+i*45:i*14}));expire(masks,opening?1650:600);}
  const head=root.querySelector('.hero,.page-head');if(head&&fx.ambient==='on'){
   const lines=curtain(head);Array.from(lines.children).forEach((col,i)=>animate(col,[{opacity:0,transform:'translateY(-65%)'},{opacity:.55,offset:.25},{opacity:0,transform:'translateY(32%)'}],{duration:opening?1300:480,delay:(i%5)*(opening?45:12)}));expire(lines,opening?1650:650);
  }
  const art=root.querySelector('.page-head-visual,.atlas-featured');animate(art,[{opacity:.12,transform:'scale(.9) rotate(-3deg)'},{opacity:1,transform:'scale(1) rotate(0)'}],{duration:home?duration:560});
  // Below-the-fold portals assemble once when reached; scrolling itself stays silent.
  if(typeof IntersectionObserver!=='undefined'){
   observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer?.unobserve(entry.target);if(!enabled())continue;animate(entry.target,[{opacity:.25,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:560});entry.target.querySelectorAll('.ad-step').forEach((node,i)=>animate(node,[{opacity:.15},{opacity:1}],{duration:360,delay:i*70}));entry.target.querySelectorAll('.orbit-mark').forEach(svg=>animate(svg,[{opacity:.08,strokeDasharray:'400',strokeDashoffset:'400'},{opacity:.62,strokeDasharray:'400',strokeDashoffset:'0'}],{duration:1100}));}},{threshold:.12});root.querySelectorAll('.portal-card,[data-article-diagram]').forEach(el=>observer.observe(el));
  }
  window.dispatchEvent(new Event('mdc:page-transition'));
 }
 function arrive(options={}){const root=document.querySelector('[data-view]:not([hidden])')||document.getElementById('main');if(root)assemble(root,Boolean(options.opening));}
 function stopEntry(){clearTimeout(timer);timer=0;cancelAnimationFrame(frame);frame=0;entering=false;dialog.classList.remove('is-entering');code.textContent=label;dialog.querySelectorAll('[data-entry-audio]').forEach(b=>b.disabled=false);}
 function close(build=false){stopEntry();if(build)previous=null;if(dialog.open)dialog.close();if(build){window.scrollTo({top:0,left:0,behavior:'instant'});document.querySelector('#main h1')?.focus({preventScroll:true});arrive({opening:true});}}
 function enter(audio){
  if(entering)return;entering=true;stats.entries++;dialog.classList.add('is-entering');dialog.querySelectorAll('[data-entry-audio]').forEach(b=>b.disabled=true);
  if(audio){void window.MDCSound?.enable(true);void window.ManifoldMusic?.start();}else{void window.MDCSound?.enable(false);window.ManifoldMusic?.pause();}
  const started=performance.now(),glyphs='01Σψλ∇∂';
  const decode=now=>{const n=Math.floor((now-started)/42);code.textContent=Array.from(label,(c,i)=>c===' '?c:i<n?c:glyphs[(i+Math.floor(now/90))%glyphs.length]).join('');if(now-started<1050)frame=requestAnimationFrame(decode);};frame=requestAnimationFrame(decode);
  timer=setTimeout(()=>close(true),1200);
 }
 function show(replay=false){
  if(!entryEnabled()||dialog.open||document.querySelector('dialog[open]'))return false;
  if(!replay){if(document.body.dataset.page!=='index.html'||location.hash)return false;try{if(sessionStorage.getItem('mdc-entry-v39')==='seen')return false;sessionStorage.setItem('mdc-entry-v39','seen');}catch{}}
  previous=replay?document.activeElement:null;stopEntry();dialog.showModal();return true;
 }
 dialog.querySelectorAll('[data-entry-audio]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.entryAudio==='on')));
 dialog.querySelector('[data-entry-skip]').addEventListener('click',()=>close());
 dialog.addEventListener('cancel',ev=>{ev.preventDefault();close();});
 dialog.addEventListener('close',()=>{stopEntry();const focus=previous?.isConnected?previous:document.querySelector('#main h1');focus?.setAttribute('tabindex','-1');focus?.focus({preventScroll:true});previous=null;});
 document.addEventListener('click',ev=>{if(ev.target.closest?.('[data-entry-replay]'))show(true);});
 function sync(){if(!entryEnabled())close();if(!enabled())clearAssembly();document.querySelectorAll('[data-entry-replay]').forEach(b=>b.disabled=!entryEnabled());}
 fx.subscribe(sync);window.addEventListener('mdc:content-change',sync);window.addEventListener('mdc:before-content-change',clearAssembly);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){close();clearAssembly();}});window.addEventListener('pagehide',()=>{close();clearAssembly();});window.addEventListener('beforeprint',clearAssembly);
 window.MDCCinema={arrive,get stats(){return {...stats};},get activeAnimations(){return animations.length;}};
 sync();if(!show()&&!location.hash)arrive();
})();
