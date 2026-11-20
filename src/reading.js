/* Reading behaviour has one owner: anchors, contents, local study position and complete printing. */
(() => {
 'use strict';
 const en=document.documentElement.lang==='en';
 function activeRoot(){return document.querySelector('[data-view]:not([hidden])')||document.querySelector('main');}
 function revealHash(){const root=activeRoot();if(!root)return;const raw=location.hash.startsWith('#/')?location.hash.split('#')[2]:location.hash.slice(1);if(!raw)return;let id;try{id=decodeURIComponent(raw);}catch{return;}const target=root.querySelector('#'+CSS.escape(id));if(!target)return;let p=target.parentElement;while(p&&p!==root){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}target.scrollIntoView({block:'start'});}
 let observer=null;
 function contents(){observer?.disconnect();const root=activeRoot();if(!root)return;const nav=root.querySelector('[data-section-nav]');if(!nav||typeof IntersectionObserver==='undefined')return;const links=Array.from(nav.querySelectorAll('a'));
  const resume=root.querySelector('[data-reading-resume]'),key=resume?'mdc-reading:'+en+':'+resume.getAttribute('href'):null;
  if(resume){let saved;try{saved=localStorage.getItem(key);}catch{}const link=links.find(a=>a.hash===saved);
   if(link){resume.href=link.getAttribute('href');resume.hidden=false;resume.textContent+=' · '+link.textContent.trim();}
  }
  observer=new IntersectionObserver(entries=>{const entry=entries.filter(x=>x.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];if(!entry)return;for(const a of links){if(a.hash==='#'+entry.target.id){a.setAttribute('aria-current','location');if(key)try{localStorage.setItem(key,a.hash);}catch{}}else a.removeAttribute('aria-current');}},{rootMargin:'-145px 0px -55% 0px'});
  root.querySelectorAll('.prose h2[id]').forEach(el=>observer.observe(el));
 }
 function restoreStudy(){let saved;try{saved=JSON.parse(localStorage.getItem('mdc-study-position')||'null');}catch{}document.querySelectorAll('[data-study-resume]').forEach(box=>{const valid=saved&&/^quantum-2026-2027-modulo-0[1-7]$/.test(saved.id)&&Number.isInteger(saved.page)&&saved.page>0&&saved.page<1000;box.hidden=!valid;if(valid){const a=box.querySelector('[data-study-resume-link]');a.href=`corso-quantum-post-quantum-computing-2026-2027.html#argomento-${saved.id}-${saved.page}`;const title=saved[en?'en':'it'];a.textContent=(en?'Resume: ':'Riprendi: ')+(typeof title==='string'&&title.length<301?title:(en?'Module ':'Modulo ')+Number(saved.id.slice(-2)))+' · PDF p. '+saved.page;}});}
 document.addEventListener('click',async ev=>{
  const dest=ev.target.closest('[data-study-destination]');if(dest){try{localStorage.setItem('mdc-study-position',JSON.stringify({id:dest.dataset.studyId,page:Number(dest.dataset.studyPage),it:dest.dataset.studyTitleIt,en:dest.dataset.studyTitleEn}));restoreStudy();}catch{}}
  if(ev.target.closest('[data-study-forget]')){try{localStorage.removeItem('mdc-study-position');}catch{}restoreStudy();}
  const copy=ev.target.closest('[data-copy-citation],[data-copy-figure]');
  if(copy){
   const figure=copy.closest('.science-figure'),status=(figure||copy.parentElement).querySelector('[data-copy-status]');
   const link=new URL(location.href);
   if(figure)link.hash=document.body.dataset.portable==='true'?location.hash.split('#').slice(0,2).join('#')+'#'+figure.id:figure.id;
   const value=figure?link.href:copy.dataset.copyCitation;
   status.hidden=false;
   try{await navigator.clipboard.writeText(value);status.textContent=figure?(en?'Link copied':'Link copiato'):(en?'Citation copied':'Riferimento copiato');}
   catch{status.textContent=value;}
  }
  if(ev.target.closest('[data-print]'))window.print();
 });
 let closed=[];window.addEventListener('beforeprint',()=>{closed=Array.from(activeRoot()?.querySelectorAll('details:not([open])')||[]);closed.forEach(d=>d.open=true);});window.addEventListener('afterprint',()=>{closed.forEach(d=>d.open=false);closed=[];});
 window.addEventListener('hashchange',revealHash);window.addEventListener('mdc:content-change',ev=>{contents();restoreStudy();if(!ev.detail?.positionManaged)requestAnimationFrame(revealHash);});
 revealHash();contents();restoreStudy();
})();
