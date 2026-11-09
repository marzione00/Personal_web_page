/* Progressive geometry interaction. Static images and explanatory links work without this file. */
(() => {
 'use strict';
 const tr=window.MDCTranslate||((x)=>x),resourceBase=document.body.dataset.resourceBase||'';
 if(!['','../'].includes(resourceBase))return;
 const dialog=document.querySelector('#geometry-dialog');if(!dialog)return;
 const stage=dialog.querySelector('#geometry-stage'),detail=dialog.querySelector('[data-geo-detail]'),status=dialog.querySelector('[data-geo-status]'),fallback=dialog.querySelector('[data-geo-fallback]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
 let displayMode='glow';try{const saved=localStorage.getItem('mdc-geometry-style');if(['surface','glow','wire'].includes(saved))displayMode=saved;}catch{}
 const style=dialog.querySelector('[data-geo-style]'),expand=dialog.querySelector('[data-geo-expand]');style.value=displayMode;
 let disabled=false;try{disabled=localStorage.getItem('mdc-geometry-motion')==='off';}catch{}
 let viewer=null,libraryPromise=null,owner=null,opener=null,hoverTimer=0,generation=0,activeId='',modal=false;
 const cache=new Map(),pending=new Map();
 const motionAllowed=()=>!disabled&&!reduced.matches&&!navigator.connection?.saveData&&!window.MDCEffects?.paused;
 const motionReason=()=>reduced.matches?tr('Il sistema richiede movimento ridotto. Usa i controlli di orientamento.'):navigator.connection?.saveData?tr('Risparmio dati attivo. Usa i controlli di orientamento.'):window.MDCEffects?.paused?tr('Gli effetti sono in pausa. Usa i controlli di orientamento.'):tr('Le animazioni automatiche sono disattivate nelle preferenze del modello.');
 function setMotionLabels(){document.querySelectorAll('[data-geo-motion]').forEach(b=>{b.setAttribute('aria-pressed',String(disabled||reduced.matches));b.textContent=reduced.matches?tr("Movimento ridotto: animazioni automatiche disattivate"):disabled?tr("Attiva le animazioni automatiche"):tr("Disattiva le animazioni automatiche");});}
 setMotionLabels();
 function stopHover(){clearTimeout(hoverTimer);generation++;observer.disconnect();if(!modal){viewer?.detach();owner=null;activeId='';}}
 const observer=new IntersectionObserver(entries=>{if(!modal&&entries.some(x=>!x.isIntersecting))stopHover();},{threshold:.05});
 function getLibrary(){
  if(window.MDCGeometry)return Promise.resolve(window.MDCGeometry);
  if(libraryPromise)return libraryPromise;
  libraryPromise=new Promise((resolve,reject)=>{if(!/^assets\/geometry-viewer-[a-f0-9]{12}\.js$/.test(dialog.dataset.viewerSrc||'')||!/^sha256-[A-Za-z0-9+/]{43}=$/.test(dialog.dataset.viewerIntegrity||'')){reject(Error(tr('Visualizzatore non disponibile.')));return;}const s=document.createElement('script');s.src=resourceBase+(dialog.dataset.viewerSrc||'assets/geometry-viewer.js');if(dialog.dataset.viewerIntegrity){s.integrity=dialog.dataset.viewerIntegrity;s.crossOrigin='anonymous';}s.async=true;s.onload=()=>window.MDCGeometry?resolve(window.MDCGeometry):reject(Error(tr("Visualizzatore non disponibile.")));s.onerror=()=>{libraryPromise=null;s.remove();reject(Error(tr("Caricamento del visualizzatore non riuscito.")));};document.head.append(s);});return libraryPromise;
 }
 async function getScene(id,source,digest){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(id)||!([`geometry/scenes/${id}.bin`,`geometry/scenes/${id}-${digest?.slice(0,12)}.bin`].includes(source))||!/^[a-f0-9]{64}$/.test(digest||''))throw Error(tr("Percorso modello non valido."));
  const key=id+':'+digest,limit=300000;
  if(cache.has(key)){const b=cache.get(key);cache.delete(key);cache.set(key,b);return b;}if(pending.has(key))return pending.get(key);if(pending.size>=4)throw Error(tr("Modello non disponibile."));
  const task=(async()=>{let buffer;
   if(window.MDCEmbeddedScenes?.[id]){const encoded=window.MDCEmbeddedScenes[id];if(typeof encoded!=='string'||encoded.length>Math.ceil(limit/3)*4)throw Error(tr("Modello troppo grande."));const raw=atob(encoded);buffer=Uint8Array.from(raw,c=>c.charCodeAt(0)).buffer;}
   else{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const response=await fetch(resourceBase+source,{credentials:'omit',redirect:'error',signal:controller.signal});if(!response.ok)throw Error(tr("Modello non disponibile."));const length=response.headers.get('content-length');if(length&&(!/^\d+$/.test(length)||Number(length)>limit))throw Error(tr("Modello troppo grande."));if(!response.body?.getReader)throw Error(tr("Modello non disponibile."));const reader=response.body.getReader(),chunks=[];let total=0;
     try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>limit){controller.abort();throw Error(tr("Modello troppo grande."));}chunks.push(value);}}finally{reader.releaseLock();}
     const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}buffer=bytes.buffer;
    }finally{clearTimeout(timeout);}}
   if(buffer.byteLength<24||buffer.byteLength>limit||!globalThis.crypto?.subtle)throw Error(tr("Modello non disponibile."));const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==digest)throw Error(tr("Modello non valido."));cache.set(key,buffer);while(cache.size>5)cache.delete(cache.keys().next().value);return buffer;
  })();pending.set(key,task);try{return await task;}finally{pending.delete(key);}
 }
 async function activate(a,host,token){
  const id=a.dataset.geometryOpen;
  const [lib,buffer]=await Promise.all([getLibrary(),getScene(id,a.dataset.scene,a.dataset.sceneSha256)]);
  if(token!==generation)return;
  if(!viewer||!viewer.alive){viewer?.dispose();viewer=new lib.Viewer();viewer.onlost=()=>{status.textContent=tr("Il contesto 3D è stato interrotto. Immagine, formula e spiegazione restano disponibili.");setSpin(false);};window.MDCGeometryDebug={get viewer(){return viewer;},get cacheSize(){return cache.size;}};}
  viewer.attach(host);viewer.load(buffer);viewer.setMode(displayMode);activeId=id;owner=a;
  if(modal&&motionAllowed()){viewer.auto=true;viewer.start();setSpin(true);}
  if(modal){status.textContent=motionAllowed()?tr("Trascina per esplorare il modello. Usa i controlli per cambiare la visualizzazione."):motionReason();setSpin(viewer.auto);}
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
  const id=a.dataset.geometryOpen;if(!/^[a-z]+(?:-[a-z]+)*$/.test(id||''))return false;
  stopHover();modal=true;opener=a;
  const scope=a.closest('[data-view]')||document;
  const template=scope.querySelector(`template[data-geometry-info="${id}"]`)||document.querySelector(`template[data-geometry-info="${id}"]`);const source=scope.querySelector(`[data-geometry-detail-source="${id}"]`)||document.querySelector(`[data-geometry-detail-source="${id}"]`);if(!template&&!source){modal=false;return false;}
  detail.replaceChildren(template?template.content.cloneNode(true):source.cloneNode(true));detail.querySelectorAll('h4').forEach(h=>{const replacement=document.createElement('h3');replacement.textContent=h.textContent;h.replaceWith(replacement);});const title=detail.querySelector('[data-geo-info-title]')?.textContent||a.querySelector('img')?.alt||tr("Esplora il modello");dialog.querySelector('#geometry-title').textContent=title;
  fallback.src=a.querySelector('img').src;fallback.alt=title;status.textContent=tr("Caricamento del modello 3D…");setSpin(false);
  dialog.showModal();document.body.classList.add('geometry-modal-open');dialog.querySelector('[data-geo-close]').focus();setMotionLabels();
  const token=++generation;activate(a,stage,token).catch(error=>{if(token===generation){status.textContent=tr(error.message)||tr("3D non disponibile. La spiegazione resta consultabile.");viewer?.detach();}});return true;
 }
 document.addEventListener('click',e=>{const a=e.target.closest('[data-geometry-open]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;if(open(a)){e.preventDefault();e.stopImmediatePropagation();}},true);
 dialog.querySelector('[data-geo-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{dialog.classList.remove('is-expanded');expand.setAttribute('aria-pressed','false');expand.textContent=tr('Vista immersiva');generation++;modal=false;viewer?.detach();owner=null;activeId='';document.body.classList.remove('geometry-modal-open');opener?.focus({preventScroll:true});opener=null;});
 const ready=()=>!!(modal&&viewer?.alive&&viewer?.model&&viewer.host===stage);
 style.addEventListener('change',()=>{displayMode=style.value;try{localStorage.setItem('mdc-geometry-style',displayMode);}catch{}if(ready())viewer.setMode(displayMode);});
 expand.addEventListener('click',()=>{const expanded=dialog.classList.toggle('is-expanded');expand.setAttribute('aria-pressed',String(expanded));expand.textContent=tr(expanded?'Mostra spiegazione':'Vista immersiva');viewer?.render();});
 const spin=dialog.querySelector('[data-geo-spin]');
 function setSpin(on){spin.setAttribute('aria-disabled',String(!motionAllowed()));spin.setAttribute('aria-pressed',String(on));spin.textContent=tr(on?'Ferma rotazione':'Ruota');}
 spin.addEventListener('click',()=>{if(!ready())return;if(!motionAllowed()){status.textContent=motionReason();return;}viewer.auto=!viewer.auto;setSpin(viewer.auto);if(viewer.auto)viewer.start();else viewer.stop();});
 dialog.querySelector('[data-geo-left]').addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0],viewer.angle[1]-.22,false);}});
 dialog.querySelector('[data-geo-right]').addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0],viewer.angle[1]+.22,false);}});
 for(const [selector,delta] of [['[data-geo-up]',-.22],['[data-geo-down]',.22]])dialog.querySelector(selector).addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0]+delta,viewer.angle[1],false);}});
 dialog.querySelectorAll('[data-geo-view]').forEach(button=>button.addEventListener('click',()=>{if(!ready())return;const angles={front:[0,0],side:[0,Math.PI/2],top:[Math.PI/2,0]}[button.dataset.geoView];viewer.stop();setSpin(false);viewer.move(...angles,false);}));
 window.MDCEffects?.subscribe(()=>{if(!motionAllowed()){viewer?.stop();if(!modal)stopHover();}setSpin(!!viewer?.auto&&motionAllowed());});
 dialog.querySelector('[data-geo-in]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom*1.15);});
 dialog.querySelector('[data-geo-out]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom/1.15);});
 dialog.querySelector('[data-geo-reset]').addEventListener('click',()=>{if(ready()){viewer.reset();setSpin(false);}});
 document.addEventListener('click',e=>{if(!e.target.closest('[data-geo-motion]'))return;disabled=!disabled;try{localStorage.setItem('mdc-geometry-motion',disabled?'off':'on');}catch{}if(disabled){viewer?.stop();if(!modal)stopHover();}setSpin(!!viewer?.auto&&motionAllowed());setMotionLabels();});
 const pointers=new Map();let previousDistance=0;
 stage.addEventListener('pointerdown',e=>{if(!ready())return;stage.focus({preventScroll:true});stage.setPointerCapture(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);viewer.stop();setSpin(false);});
 stage.addEventListener('pointermove',e=>{
  if(!ready()||!pointers.has(e.pointerId))return;const before=pointers.get(e.pointerId);pointers.set(e.pointerId,[e.clientX,e.clientY]);
  if(pointers.size===2){const [a,b]=[...pointers.values()];const dist=Math.hypot(a[0]-b[0],a[1]-b[1]);if(previousDistance)viewer.setZoom(viewer.zoom*dist/previousDistance);previousDistance=dist;}
  else viewer.move(viewer.angle[0]+(e.clientY-before[1])*.008,viewer.angle[1]+(e.clientX-before[0])*.008,false);
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])stage.addEventListener(event,e=>{pointers.delete(e.pointerId);previousDistance=0;});
 stage.addEventListener('wheel',e=>{if(!ready()||(!e.ctrlKey&&!e.metaKey))return;e.preventDefault();viewer.setZoom(viewer.zoom*Math.exp(-e.deltaY*.001));},{passive:false});
 stage.addEventListener('keydown',e=>{if(!ready())return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){viewer.stop();setSpin(false);}let handled=true;
  if(e.key==='ArrowLeft')viewer.move(viewer.angle[0],viewer.angle[1]-.15,false);
  else if(e.key==='ArrowRight')viewer.move(viewer.angle[0],viewer.angle[1]+.15,false);
  else if(e.key==='ArrowUp')viewer.move(viewer.angle[0]-.15,viewer.angle[1],false);
  else if(e.key==='ArrowDown')viewer.move(viewer.angle[0]+.15,viewer.angle[1],false);
  else if(['+','='].includes(e.key))viewer.setZoom(viewer.zoom*1.15);
  else if(e.key==='-')viewer.setZoom(viewer.zoom/1.15);
  else if(e.key==='Home')viewer.reset();else handled=false;
  if(handled)e.preventDefault();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer?.stop();setSpin(false);if(!modal)stopHover();}});
 reduced.addEventListener('change',()=>{viewer?.stop();setSpin(false);setMotionLabels();if(!modal)stopHover();});
 window.addEventListener('hashchange',()=>{if(modal)dialog.close();stopHover();});
 window.addEventListener('pagehide',()=>{viewer?.dispose();viewer=null;cache.clear();});
})();
