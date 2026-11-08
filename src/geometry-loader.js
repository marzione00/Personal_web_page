/* Progressive geometry interaction. Static images and explanatory links work without this file. */
(() => {
 'use strict';
 const tr=window.MDCTranslate||((x)=>x),resourceBase=document.body.dataset.resourceBase||'';
 const dialog=document.querySelector('#geometry-dialog');if(!dialog)return;
 const stage=dialog.querySelector('#geometry-stage'),detail=dialog.querySelector('[data-geo-detail]'),status=dialog.querySelector('[data-geo-status]'),fallback=dialog.querySelector('[data-geo-fallback]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let disabled=false;try{disabled=localStorage.getItem('mdc-geometry-motion')==='off';}catch{}
 let viewer=null,libraryPromise=null,owner=null,opener=null,hoverTimer=0,generation=0,activeId='',modal=false;
 const cache=new Map(),pending=new Map();
 const motionAllowed=()=>!disabled&&!reduced.matches&&!navigator.connection?.saveData;
 function setMotionLabels(){document.querySelectorAll('[data-geo-motion]').forEach(b=>{b.setAttribute('aria-pressed',String(disabled||reduced.matches));b.textContent=reduced.matches?tr("Movimento ridotto: animazioni automatiche disattivate"):disabled?tr("Attiva le animazioni al passaggio del puntatore"):tr("Disattiva le animazioni al passaggio del puntatore");});}
 setMotionLabels();
 function stopHover(){clearTimeout(hoverTimer);generation++;observer.disconnect();if(!modal){viewer?.detach();owner=null;activeId='';}}
 const observer=new IntersectionObserver(entries=>{if(!modal&&entries.some(x=>!x.isIntersecting))stopHover();},{threshold:.05});
 function getLibrary(){
  if(window.MDCGeometry)return Promise.resolve(window.MDCGeometry);
  if(libraryPromise)return libraryPromise;
  libraryPromise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=resourceBase+(dialog.dataset.viewerSrc||'assets/geometry-viewer.js');if(dialog.dataset.viewerIntegrity){s.integrity=dialog.dataset.viewerIntegrity;s.crossOrigin='anonymous';}s.async=true;s.onload=()=>window.MDCGeometry?resolve(window.MDCGeometry):reject(Error(tr("Visualizzatore non disponibile.")));s.onerror=()=>{libraryPromise=null;s.remove();reject(Error(tr("Caricamento del visualizzatore non riuscito.")));};document.head.append(s);});return libraryPromise;
 }
 async function getScene(id,source){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(id)||source!==`geometry/scenes/${id}.bin`)throw Error(tr("Percorso modello non valido."));
  if(cache.has(id)){const b=cache.get(id);cache.delete(id);cache.set(id,b);return b;}
  if(pending.has(id))return pending.get(id);
  const task=(async()=>{
   let buffer;
   if(window.MDCEmbeddedScenes?.[id]){const raw=atob(window.MDCEmbeddedScenes[id]);buffer=Uint8Array.from(raw,c=>c.charCodeAt(0)).buffer;}
   else {const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const r=await fetch(resourceBase+source,{credentials:'same-origin',signal:controller.signal});if(!r.ok)throw Error(tr("Modello non disponibile."));buffer=await r.arrayBuffer();}finally{clearTimeout(timeout);}}
   if(buffer.byteLength>1500000)throw Error(tr("Modello troppo grande."));cache.set(id,buffer);while(cache.size>5)cache.delete(cache.keys().next().value);return buffer;
  })();pending.set(id,task);try{return await task;}finally{pending.delete(id);}
 }
 async function activate(a,host,token){
  const id=a.dataset.geometryOpen;
  const [lib,buffer]=await Promise.all([getLibrary(),getScene(id,a.dataset.scene)]);
  if(token!==generation)return;
  if(!viewer||!viewer.alive){viewer?.dispose();viewer=new lib.Viewer();viewer.onlost=()=>{status.textContent=tr("Il contesto 3D è stato interrotto. Immagine, formula e spiegazione restano disponibili.");dialog.querySelector('[data-geo-spin]').setAttribute('aria-pressed','false');};window.MDCGeometryDebug={get viewer(){return viewer;},get cacheSize(){return cache.size;}};}
  viewer.attach(host);viewer.load(buffer);activeId=id;owner=a;
  if(modal)status.textContent=tr("Trascina per esplorare il modello. Formula e spiegazione sono accanto alla figura.");
 }
 document.addEventListener('pointerover',e=>{
  const a=e.target.closest('[data-geometry-open]');if(!a||modal||!fine.matches||!motionAllowed()||a===owner)return;
  clearTimeout(hoverTimer);const token=++generation;
  hoverTimer=setTimeout(()=>{if(!a.matches(':hover')||token!==generation)return;observer.disconnect();observer.observe(a);activate(a,a,token).catch(()=>{/* Static link remains available. */});},300);
 });
 document.addEventListener('pointerout',e=>{const a=e.target.closest('[data-geometry-open]');if(a&&!a.contains(e.relatedTarget)&&!modal)stopHover();});
 document.addEventListener('pointermove',e=>{if(modal||!owner||!viewer?.model||!motionAllowed())return;const r=owner.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;viewer.move(viewer.model.camera[0]+y*.75,viewer.model.camera[1]+x*1.3);});
 function open(a){
  if(typeof dialog.showModal!=='function')return false;
  stopHover();modal=true;opener=a;const id=a.dataset.geometryOpen;
  const scope=a.closest('[data-view]')||document;
  const template=scope.querySelector(`template[data-geometry-info="${id}"]`)||document.querySelector(`template[data-geometry-info="${id}"]`);if(!template){modal=false;return false;}
  detail.replaceChildren(template.content.cloneNode(true));const title=detail.querySelector('[data-geo-info-title]')?.textContent||tr("Esplora il modello");dialog.querySelector('#geometry-title').textContent=title;
  fallback.src=a.querySelector('img').src;fallback.alt=title;status.textContent=tr("Caricamento del modello 3D…");dialog.querySelector('[data-geo-spin]').setAttribute('aria-pressed','false');
  dialog.showModal();document.body.classList.add('geometry-modal-open');dialog.querySelector('[data-geo-close]').focus();setMotionLabels();
  const token=++generation;activate(a,stage,token).catch(error=>{if(token===generation){status.textContent=tr(error.message)||tr("3D non disponibile. La spiegazione resta consultabile.");viewer?.detach();}});return true;
 }
 document.addEventListener('click',e=>{const a=e.target.closest('[data-geometry-open]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;if(open(a)){e.preventDefault();e.stopImmediatePropagation();}},true);
 dialog.querySelector('[data-geo-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{generation++;modal=false;viewer?.detach();owner=null;activeId='';document.body.classList.remove('geometry-modal-open');opener?.focus({preventScroll:true});opener=null;});
 const ready=()=>!!(modal&&viewer?.alive&&viewer?.model&&viewer.host===stage);
 const spin=dialog.querySelector('[data-geo-spin]');
 spin.addEventListener('click',()=>{if(!ready())return;if(!motionAllowed()){status.textContent=tr("La preferenza di movimento ridotto è attiva. Puoi orientare il modello con le frecce.");return;}viewer.auto=!viewer.auto;spin.setAttribute('aria-pressed',String(viewer.auto));if(viewer.auto)viewer.start();else viewer.stop();});
 dialog.querySelector('[data-geo-left]').addEventListener('click',()=>{if(ready())viewer.move(viewer.angle[0],viewer.angle[1]-.22,false);});
 dialog.querySelector('[data-geo-right]').addEventListener('click',()=>{if(ready())viewer.move(viewer.angle[0],viewer.angle[1]+.22,false);});
 dialog.querySelector('[data-geo-in]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom*1.15);});
 dialog.querySelector('[data-geo-out]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom/1.15);});
 dialog.querySelector('[data-geo-reset]').addEventListener('click',()=>{if(ready()){viewer.reset();spin.setAttribute('aria-pressed','false');}});
 document.addEventListener('click',e=>{if(!e.target.closest('[data-geo-motion]'))return;disabled=!disabled;try{localStorage.setItem('mdc-geometry-motion',disabled?'off':'on');}catch{}if(disabled){viewer?.stop();spin.setAttribute('aria-pressed','false');if(!modal)stopHover();}setMotionLabels();});
 const pointers=new Map();let previousDistance=0;
 stage.addEventListener('pointerdown',e=>{if(!ready())return;stage.focus({preventScroll:true});stage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);viewer.stop();spin.setAttribute('aria-pressed','false');});
 stage.addEventListener('pointermove',e=>{
  if(!ready()||!pointers.has(e.pointerId))return;const before=pointers.get(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);
  if(pointers.size===2){const [a,b]=[...pointers.values()];const dist=Math.hypot(a[0]-b[0],a[1]-b[1]);if(previousDistance)viewer.setZoom(viewer.zoom*dist/previousDistance);previousDistance=dist;}
  else viewer.move(viewer.angle[0]+(e.clientY-before[1])*.008,viewer.angle[1]+(e.clientX-before[0])*.008,false);
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,e=>{pointers.delete(e.pointerId);previousDistance=0;});
 stage.addEventListener('wheel',e=>{if(!ready())return;e.preventDefault();viewer.setZoom(viewer.zoom*Math.exp(-e.deltaY*.001));},{passive:false});
 stage.addEventListener('keydown',e=>{if(!ready())return;let handled=true;
  if(e.key==='ArrowLeft')viewer.move(viewer.angle[0],viewer.angle[1]-.15,false);
  else if(e.key==='ArrowRight')viewer.move(viewer.angle[0],viewer.angle[1]+.15,false);
  else if(e.key==='ArrowUp')viewer.move(viewer.angle[0]-.15,viewer.angle[1],false);
  else if(e.key==='ArrowDown')viewer.move(viewer.angle[0]+.15,viewer.angle[1],false);
  else if(['+','='].includes(e.key))viewer.setZoom(viewer.zoom*1.15);
  else if(e.key==='-')viewer.setZoom(viewer.zoom/1.15);
  else if(e.key==='Home')viewer.reset();else handled=false;
  if(handled)e.preventDefault();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer?.stop();spin.setAttribute('aria-pressed','false');if(!modal)stopHover();}});
 reduced.addEventListener('change',()=>{viewer?.stop();spin.setAttribute('aria-pressed','false');setMotionLabels();if(!modal)stopHover();});
 window.addEventListener('hashchange',()=>{if(modal)dialog.close();stopHover();});
 window.addEventListener('pagehide',()=>{viewer?.dispose();viewer=null;cache.clear();});
})();
