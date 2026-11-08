/* Screen changes progressively enhance regular links. Never intercept normal navigation,
 * never delay loads, and never animate PDF, mail, external, hash or download links.
 */
(() => {
 'use strict';
 const fx=window.MDCEffects,root=document.documentElement,main=document.getElementById('main');if(!fx||!main)return;
 const native=Boolean(window.CSSViewTransitionRule&&'onpageswap' in window);
 let active=null,last='',fallbackAnimation=null;
 const stats={native:0,offline:0,fallback:0};
 const scan=document.createElement('div');scan.className='screen-scan';scan.setAttribute('aria-hidden','true');document.body.append(scan);
 function clear(){fallbackAnimation?.cancel();fallbackAnimation=null;root.classList.remove('screen-arriving');}
 function sweep(){root.classList.remove('screen-arriving');requestAnimationFrame(()=>root.classList.add('screen-arriving'));}
 scan.addEventListener('animationend',()=>root.classList.remove('screen-arriving'));
 function fallback(){
  if(!fx.transitions||document.hidden)return;stats.fallback++;
  fallbackAnimation=main.animate([{opacity:.45,transform:'translateX(28px)'},{opacity:1,transform:'translateX(0)'}],{duration:280,easing:'cubic-bezier(.2,.7,.2,1)'});
  sweep();
 }
 function run(update){
  window.MDCSound?.page(); // Portable navigation also works when the preview has an opaque origin.
  if(!fx.transitions||typeof document.startViewTransition!=='function'){update();fallback();return true;}
  active?.skipTransition();stats.offline++;active=document.startViewTransition(()=>{update();sweep();});
  const current=active;current.finished.catch(()=>{}).finally(()=>{if(active===current)active=null;});return true;
 }
 window.MDCPageTransition={run,get stats(){return {...stats};},get native(){return native;}};
 document.addEventListener('click',ev=>{
  if(ev.defaultPrevented||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
  const a=ev.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||a.hasAttribute('data-geometry-open')||a.hasAttribute('data-travel-photo')||document.body.dataset.portable==='true')return;
  try{const u=new URL(a.href,location.href);if(u.origin!==location.origin||!u.pathname.endsWith('.html')||u.pathname===location.pathname)return;
   if(!fx.transitions)return;last=u.href;sessionStorage.setItem('mdc-next-screen',JSON.stringify({to:u.href,time:Date.now()}));
  }catch{}
 });
 window.addEventListener('pageswap',ev=>{if(!fx.transitions){ev.viewTransition?.skipTransition();return;}if(ev.viewTransition)stats.native++;});
 window.addEventListener('pagereveal',ev=>{if(!fx.transitions){ev.viewTransition?.skipTransition();clear();return;}if(ev.viewTransition){stats.native++;sweep();}});
 window.addEventListener('pageshow',ev=>{if(ev.persisted)clear();});
 fx.subscribe(()=>{if(!fx.transitions){active?.skipTransition();clear();}});
 try{const n=JSON.parse(sessionStorage.getItem('mdc-next-screen')||'null');sessionStorage.removeItem('mdc-next-screen');if(n&&n.to===location.href&&Date.now()-n.time<10000&&!native)fallback();}catch{}
})();
