/* Reading behaviour has one owner: anchors, contents, local study position and complete printing. */
(() => {
 'use strict';
 const en=document.documentElement.lang==='en';
 function activeRoot(){return document.querySelector('[data-view]:not([hidden])')||document.querySelector('main');}
 function revealHash(){const root=activeRoot();if(!root)return;const raw=location.hash.startsWith('#/')?location.hash.split('#')[2]:location.hash.slice(1);if(!raw)return;let id;try{id=decodeURIComponent(raw);}catch{return;}const target=root.querySelector('#'+CSS.escape(id));if(!target)return;let p=target.parentElement;while(p&&p!==root){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}target.scrollIntoView({block:'start'});}
 let observer=null;
 function contents(){observer?.disconnect();const root=activeRoot();if(!root)return;const nav=root.querySelector('[data-section-nav]');if(!nav||typeof IntersectionObserver==='undefined')return;const links=Array.from(nav.querySelectorAll('a'));
  observer=new IntersectionObserver(entries=>{const entry=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!entry)return;for(const a of links){if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}},{rootMargin:'-145px 0px -55% 0px'});
  root.querySelectorAll('.prose h2[id]').forEach(el=>observer.observe(el));
 }
 function restoreStudy(){let saved;try{saved=JSON.parse(localStorage.getItem('mdc-study-position')||'null');}catch{}document.querySelectorAll('[data-study-resume]').forEach(box=>{const valid=saved&&/^quantum-2026-2027-modulo-0[1-7]$/.test(saved.id)&&Number.isInteger(saved.page)&&saved.page>0&&saved.page<1000&&typeof saved.title==='string'&&saved.title.length<301;box.hidden=!valid;if(valid){const a=box.querySelector('[data-study-resume-link]');a.href=`corso-quantum-post-quantum-computing-2026-2027.html#argomento-${saved.id}-${saved.page}`;a.textContent=(en?'Resume: ':'Riprendi: ')+saved.title+' · PDF p. '+saved.page;}});}
 document.addEventListener('click',async ev=>{
  const dest=ev.target.closest('[data-study-destination]');if(dest){try{localStorage.setItem('mdc-study-position',JSON.stringify({id:dest.dataset.studyId,page:Number(dest.dataset.studyPage),title:dest.dataset.studyTitle}));restoreStudy();}catch{}}
  if(ev.target.closest('[data-study-forget]')){try{localStorage.removeItem('mdc-study-position');}catch{}restoreStudy();}
  const copy=ev.target.closest('[data-copy-citation]');if(copy){const status=copy.parentElement.querySelector('[data-copy-status]');try{await navigator.clipboard.writeText(copy.dataset.copyCitation);status.textContent=en?'Citation copied':'Riferimento copiato';}catch{status.textContent=copy.dataset.copyCitation;}}
  if(ev.target.closest('[data-print]'))window.print();
 });
 let closed=[];window.addEventListener('beforeprint',()=>{closed=Array.from(activeRoot()?.querySelectorAll('details:not([open])')||[]);closed.forEach(d=>d.open=true);});window.addEventListener('afterprint',()=>{closed.forEach(d=>d.open=false);closed=[];});
 window.addEventListener('hashchange',revealHash);window.addEventListener('mdc:content-change',ev=>{contents();restoreStudy();if(!ev.detail?.positionManaged)requestAnimationFrame(revealHash);});
 revealHash();contents();restoreStudy();
})();
