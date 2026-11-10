/* Preferences and readable formula catalogue. All user-editable copy is inserted as text. */
(() => {
 'use strict';
 const en=document.documentElement.lang==='en',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const read=(k,f)=>{try{return localStorage.getItem(k)??f;}catch{return f;}};
 const put=(k,v)=>{try{localStorage.setItem(k,v);}catch{/* Preferences are optional. */}};
 const initial=read('mdc-ambient','on');
 const intensity=read('mdc-intensity','normal');
 const state={paused:read('mdc-effects-paused','off')==='on',quality:read('mdc-quality','auto')==='fixed'?'fixed':'auto',intro:read('mdc-intro','on')!=='off',intensity:['low','normal','cinema'].includes(intensity)?intensity:'normal',reading:read('mdc-reading-focus','on')!=='off',ambient:['on','static','off'].includes(initial)?initial:'on',formulas:read('mdc-formulas','on')!=='off',transitions:read('mdc-transitions','on')!=='off'};
 const listeners=new Set();
 function notify(){
  document.documentElement.dataset.fxMotion=state.transitions&&!reduced.matches&&!state.paused?'on':'off';
  document.documentElement.dataset.ambient=state.ambient;document.documentElement.dataset.effectsPaused=String(state.paused);
  document.querySelectorAll('[data-effects-pause]').forEach(b=>{b.setAttribute('aria-pressed',String(state.paused));b.textContent=state.paused?(en?'Resume effects':'Riprendi gli effetti'):(en?'Pause visual effects':'Ferma gli effetti visivi');});
  const status=document.querySelector('[data-effects-status]');
  if(status)status.textContent=reduced.matches?(en?'Reduced motion is enabled: cascades remain still and page transitions are disabled.':'Movimento ridotto attivo: le cascate restano ferme e le transizioni sono disabilitate.'):(en?'Your preferences are saved in this browser.':'Le preferenze vengono conservate in questo browser.');
  listeners.forEach(fn=>fn());
 }
 window.MDCEffects={get paused(){return state.paused;},get quality(){return state.quality;},get intro(){return state.intro&&!state.paused;},get intensity(){return state.intensity;},get reading(){return state.reading;},get ambient(){return state.ambient;},get formulas(){return state.formulas;},get transitions(){return state.transitions&&!reduced.matches&&!state.paused;},get reduced(){return reduced.matches;},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
 reduced.addEventListener('change',notify);notify();
 const open=document.querySelector('[data-effects-open]'),dialog=document.querySelector('#effects-dialog'),catalog=document.querySelector('#formulas-dialog');
 if(!open||!dialog||typeof dialog.showModal!=='function'){if(open)open.hidden=true;return;}
 const intro=dialog.querySelector('[data-effects-intro]');intro.checked=state.intro;intro.addEventListener('change',()=>{state.intro=intro.checked;put('mdc-intro',state.intro?'on':'off');notify();});
 const level=dialog.querySelector('[data-effects-intensity]'),reading=dialog.querySelector('[data-effects-reading]');
 level.value=state.intensity;reading.checked=state.reading;
 level.addEventListener('change',()=>{state.intensity=level.value;put('mdc-intensity',state.intensity);notify();});
 reading.addEventListener('change',()=>{state.reading=reading.checked;put('mdc-reading-focus',state.reading?'on':'off');notify();});
 const select=dialog.querySelector('[data-effects-ambient]'),formulas=dialog.querySelector('[data-effects-formulas]'),transitions=dialog.querySelector('[data-effects-transitions]');
 select.value=state.ambient;formulas.checked=state.formulas;transitions.checked=state.transitions;
 select.addEventListener('change',()=>{state.ambient=select.value;put('mdc-ambient',state.ambient);notify();});
 formulas.addEventListener('change',()=>{state.formulas=formulas.checked;put('mdc-formulas',state.formulas?'on':'off');notify();});
 transitions.addEventListener('change',()=>{state.transitions=transitions.checked;put('mdc-transitions',state.transitions?'on':'off');notify();});
 let preferenceOpener=null;const showPreferences=source=>{if(document.querySelector('dialog[open]'))return;preferenceOpener=source;dialog.showModal();};
 open.addEventListener('click',()=>showPreferences(open));
 const quality=dialog.querySelector('[data-effects-quality]');quality.value=state.quality;quality.addEventListener('change',()=>{state.quality=quality.value;put('mdc-quality',state.quality);notify();});
 document.querySelectorAll('[data-effects-pause]').forEach(b=>b.addEventListener('click',()=>{state.paused=!state.paused;put('mdc-effects-paused',state.paused?'on':'off');notify();}));
 notify();
 document.addEventListener('click',ev=>{const b=ev.target.closest?.('[data-music-open]');if(!b)return;if(!dialog.open)showPreferences(b);dialog.querySelector('[data-music-play]')?.focus();});
 dialog.querySelector('[data-effects-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{if(!catalog?.open&&!document.activeElement?.closest?.('#main'))(preferenceOpener?.isConnected?preferenceOpener:open).focus({preventScroll:true});});
 for(const d of [dialog,catalog]){if(!d)continue;d.addEventListener('click',ev=>{if(ev.target===d){const r=d.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)d.close();}});}
 let loaded=false;
 const data=window.MDCFormulaCatalog;
 const field=catalog.querySelector('[data-formula-family]'),list=catalog.querySelector('[data-formula-catalog]');
 function fill(){
  if(loaded||!data)return;loaded=true;
  Object.entries(data.families).forEach(([key,names])=>{const opt=document.createElement('option');opt.value=key;opt.textContent=names[en?1:0];field.append(opt);});
  for(const f of data.entries){
   const a=document.createElement('article');a.dataset.formulaRecord=f.id;a.dataset.family=f.family;
   const label=document.createElement('span');label.className='label';label.textContent=data.families[f.family][en?1:0];
   const title=document.createElement('h3');title.textContent=en?f.title_en:f.title;
   const math=document.createElement('p');math.className='catalog-math';math.setAttribute('role','math');math.textContent=f.formula;
   const note=document.createElement('p');note.textContent=en?f.conditions_en:f.conditions;
   const link=document.createElement('a');link.href=f.source;link.target='_blank';link.rel='noopener noreferrer';link.textContent=en?'Study reference ↗':'Riferimento di studio ↗';
   a.append(label,title,math,note,link);list.append(a);
  }
 }
 field.addEventListener('change',()=>list.querySelectorAll('article').forEach(a=>a.hidden=field.value!=='all'&&a.dataset.family!==field.value));
 dialog.querySelector('[data-formulas-open]').addEventListener('click',()=>{fill();dialog.close();catalog.showModal();catalog.querySelector('[data-formulas-close]').focus();});
 catalog.querySelector('[data-formulas-close]').addEventListener('click',()=>catalog.close());
 catalog.addEventListener('close',()=>{if(document.activeElement?.closest?.('#main'))return;if(preferenceOpener?.isConnected)preferenceOpener.focus({preventScroll:true});else open.focus({preventScroll:true});});
})();
