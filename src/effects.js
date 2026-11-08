/* Preferences and readable formula catalogue. All user-editable copy is inserted as text. */
(() => {
 'use strict';
 const en=document.documentElement.lang==='en',reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const read=(k,f)=>{try{return localStorage.getItem(k)??f;}catch{return f;}};
 const put=(k,v)=>{try{localStorage.setItem(k,v);}catch{/* Preferences are optional. */}};
 const initial=read('mdc-ambient','on');
 const state={ambient:['on','static','off'].includes(initial)?initial:'on',formulas:read('mdc-formulas','on')!=='off',transitions:read('mdc-transitions','on')!=='off'};
 const listeners=new Set();
 function notify(){
  document.documentElement.dataset.fxMotion=state.transitions&&!reduced.matches?'on':'off';
  document.documentElement.dataset.ambient=state.ambient;
  const status=document.querySelector('[data-effects-status]');
  if(status)status.textContent=reduced.matches?(en?'Reduced motion is enabled: cascades remain still and page transitions are disabled.':'Movimento ridotto attivo: le cascate restano ferme e le transizioni sono disabilitate.'):(en?'Your choice is saved in this browser. Narrow screens keep the reading area clear.':'La scelta viene salvata in questo browser. Sugli schermi stretti viene preservato lo spazio di lettura.');
  listeners.forEach(fn=>fn());
 }
 window.MDCEffects={get ambient(){return state.ambient;},get formulas(){return state.formulas;},get transitions(){return state.transitions&&!reduced.matches;},get reduced(){return reduced.matches;},subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);}};
 reduced.addEventListener('change',notify);notify();
 const open=document.querySelector('[data-effects-open]'),dialog=document.querySelector('#effects-dialog'),catalog=document.querySelector('#formulas-dialog');
 if(!open||!dialog||typeof dialog.showModal!=='function'){if(open)open.hidden=true;return;}
 const select=dialog.querySelector('[data-effects-ambient]'),formulas=dialog.querySelector('[data-effects-formulas]'),transitions=dialog.querySelector('[data-effects-transitions]');
 select.value=state.ambient;formulas.checked=state.formulas;transitions.checked=state.transitions;
 select.addEventListener('change',()=>{state.ambient=select.value;put('mdc-ambient',state.ambient);notify();});
 formulas.addEventListener('change',()=>{state.formulas=formulas.checked;put('mdc-formulas',state.formulas?'on':'off');notify();});
 transitions.addEventListener('change',()=>{state.transitions=transitions.checked;put('mdc-transitions',state.transitions?'on':'off');notify();});
 open.addEventListener('click',()=>dialog.showModal());
 dialog.querySelector('[data-effects-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{if(!catalog?.open)open.focus({preventScroll:true});});
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
 catalog.addEventListener('close',()=>open.focus({preventScroll:true}));
})();
