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
 let viewer=null,libraryPromise=null,owner=null,opener=null,hoverTimer=0,generation=0,activeId='',legendScene='',modal=false;
 function syncFigureKey(id=legendScene){
  legendScene=id;stage.dataset.geometryScene=id;
  detail.querySelectorAll('[data-geo-legend]').forEach(group=>{group.hidden=!group.dataset.geoLegend.split(' ').includes(id);});
  detail.querySelectorAll('.geometry-legend').forEach(key=>{key.hidden=displayMode==='wire';});
  dialog.querySelector('[data-geo-style-help]').textContent=tr(displayMode==='wire'?'La maglia triangolare mostra la suddivisione grafica del modello. Scegli Superficie per ritrovare i colori della legenda.':displayMode==='glow'?'I colori rimandano alla legenda; bagliori e fasce luminose sono effetti visivi.':'I colori rimandano alla legenda; la luce ne varia la luminosità.');
 }
 const cache=new Map(),pending=new Map();
 const motionAllowed=()=>!disabled&&!reduced.matches&&!navigator.connection?.saveData&&!window.MDCEffects?.paused;
 const motionReason=()=>reduced.matches?tr('Il sistema richiede movimento ridotto. Usa i controlli di orientamento.'):navigator.connection?.saveData?tr('Risparmio dati attivo. Usa i controlli di orientamento.'):window.MDCEffects?.paused?tr('Gli effetti sono in pausa. Usa i controlli di orientamento.'):tr('Le animazioni automatiche sono disattivate nelle preferenze del modello.');
 function setMotionLabels(){document.querySelectorAll('[data-geo-motion]').forEach(b=>{b.setAttribute('aria-pressed',String(disabled||reduced.matches));b.textContent=reduced.matches?tr("Movimento ridotto: animazioni automatiche disattivate"):disabled?tr("Attiva le animazioni automatiche"):tr("Disattiva le animazioni automatiche");});}
 setMotionLabels();
 function stopHover(){clearTimeout(hoverTimer);generation++;observer.disconnect();if(!modal){viewer?.detach();owner=null;activeId='';}}
 const observer=new IntersectionObserver(entries=>{if(!modal&&entries.some(x=>!x.isIntersecting))stopHover();},{threshold:.05});
 window.addEventListener('mdc:before-content-change',()=>{clearPreviews();if(dialog.open)dialog.close();stopHover();});
 function getLibrary(){
  if(window.MDCGeometry)return Promise.resolve(window.MDCGeometry);
  if(libraryPromise)return libraryPromise;
  libraryPromise=new Promise((resolve,reject)=>{if(!/^assets\/geometry-viewer-[a-f0-9]{12}\.js$/.test(dialog.dataset.viewerSrc||'')||!/^sha256-[A-Za-z0-9+/]{43}=$/.test(dialog.dataset.viewerIntegrity||'')){reject(Error(tr('Visualizzatore non disponibile.')));return;}const s=document.createElement('script');s.src=resourceBase+(dialog.dataset.viewerSrc||'assets/geometry-viewer.js');if(dialog.dataset.viewerIntegrity){s.integrity=dialog.dataset.viewerIntegrity;s.crossOrigin='anonymous';}s.async=true;s.onload=()=>window.MDCGeometry?resolve(window.MDCGeometry):reject(Error(tr("Visualizzatore non disponibile.")));s.onerror=()=>{libraryPromise=null;s.remove();reject(Error(tr("Caricamento del visualizzatore non riuscito.")));};document.head.append(s);});return libraryPromise;
 }
 async function getScene(id,source,digest,token){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(id)||!([`geometry/scenes/${id}.bin`,`geometry/scenes/${id}-${digest?.slice(0,12)}.bin`].includes(source))||!/^[a-f0-9]{64}$/.test(digest||''))throw Error(tr("Percorso modello non valido."));
  const key=id+':'+digest,limit=300000;
  if(cache.has(key)){const b=cache.get(key);cache.delete(key);cache.set(key,b);return b;}if(pending.has(key))return pending.get(key);
  if(pending.size>=4){if(token===undefined)throw Error(tr("Modello non disponibile."));await Promise.race([...pending.values()].map(p=>p.catch(()=>null)));if(token!==generation)throw Error(tr("Caricamento annullato."));return getScene(id,source,digest,token);}
  const task=(async()=>{let buffer;
   if(window.MDCEmbeddedScenes?.[id]){const encoded=window.MDCEmbeddedScenes[id];if(typeof encoded!=='string'||encoded.length>Math.ceil(limit/3)*4)throw Error(tr("Modello troppo grande."));const raw=atob(encoded);buffer=Uint8Array.from(raw,c=>c.charCodeAt(0)).buffer;}
   else{const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);try{const response=await fetch(resourceBase+source,{credentials:'omit',redirect:'error',signal:controller.signal});if(!response.ok){console.warn('Geometry HTTP',id,response.status);throw Error(tr("Modello non disponibile."));}const length=response.headers.get('content-length');if(length&&(!/^\d+$/.test(length)||Number(length)>limit))throw Error(tr("Modello troppo grande."));if(!response.body?.getReader){console.warn('Geometry stream',id);throw Error(tr("Modello non disponibile."));}const reader=response.body.getReader(),chunks=[];let total=0;
     try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>limit){controller.abort();throw Error(tr("Modello troppo grande."));}chunks.push(value);}}finally{reader.releaseLock();}
     const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}buffer=bytes.buffer;
    }finally{clearTimeout(timeout);}}
   if(buffer.byteLength<24||buffer.byteLength>limit||!globalThis.crypto?.subtle){console.warn('Geometry buffer',id,buffer.byteLength);throw Error(tr("Modello non disponibile."));}const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),b=>b.toString(16).padStart(2,'0')).join('');if(hash!==digest)throw Error(tr("Modello non valido."));cache.set(key,buffer);while(cache.size>5)cache.delete(cache.keys().next().value);return buffer;
  })();pending.set(key,task);try{return await task;}finally{pending.delete(key);}
 }
 function configureMotion(v,a){const id=a.dataset.geometryOpen,planar=['markov-network','program-flow','decision-surface','entropy-trace','quantum-circuit','interference','stochastic-paths','gaussian-density','vibrational-mode'].includes(id);v.dynamicLight=a.hasAttribute('data-geometry-ambient');v.sway=v.dynamicLight&&!['fullerene-cage','schwarzite-neck','bloch-sphere','gyroid','schwarz-p','schwarz-d','sierpinski','menger'].includes(id);v.swayYaw=planar?(['program-flow','quantum-circuit'].includes(id)?.20:.28):.58;v.swayPitch=planar?.045:.09;}
 async function activate(a,host,token){
  const id=a.dataset.geometryOpen;
  const [lib,buffer]=await Promise.all([getLibrary(),getScene(id,a.dataset.scene,a.dataset.sceneSha256,token)]);
  if(token!==generation)return;
  if(!viewer||!viewer.alive){viewer?.dispose();viewer=new lib.Viewer();viewer.onlost=()=>{status.textContent=tr("Il contesto 3D è stato interrotto. Immagine, formula e spiegazione restano disponibili.");setSpin(false);};window.MDCGeometryDebug={get viewer(){return viewer;},get cacheSize(){return cache.size;}};}
  configureMotion(viewer,a);viewer.lightPhase=0;viewer.attach(host);viewer.load(buffer);if(viewer.dynamicLight&&displayMode==='wire'){displayMode='surface';style.value=displayMode;}viewer.setMode(displayMode);activeId=id;owner=a;
  const ambient=previews.get(a)?.view;if(modal&&ambient){viewer.angle=ambient.angle.slice();viewer.target=viewer.angle.slice();viewer.lightPhase=ambient.lightPhase;viewer.motionTime=ambient.motionTime;viewer.render();}
  if(modal&&motionAllowed()&&id!=='julia'){viewer.auto=true;viewer.start();setSpin(true);}
  if(modal){syncFigureKey(id);status.textContent=motionAllowed()?tr("Trascina per esplorare il modello. Usa i controlli per cambiare la visualizzazione."):motionReason();setSpin(viewer.auto);}
 }
 document.addEventListener('pointerover',e=>{
  const a=e.target.closest('[data-geometry-open]');if(!a||a.hasAttribute('data-geometry-ambient')||modal||!fine.matches||!motionAllowed()||a===owner)return;
  clearTimeout(hoverTimer);const token=++generation;
  hoverTimer=setTimeout(()=>{if(!a.matches(':hover')||token!==generation)return;observer.disconnect();observer.observe(a);activate(a,a,token).catch(()=>{/* Static link remains available. */});},300);
 });
 document.addEventListener('pointerout',e=>{const a=e.target.closest('[data-geometry-open]');if(a&&!a.contains(e.relatedTarget)&&!modal)stopHover();});
 document.addEventListener('pointermove',e=>{if(modal||!owner||!viewer?.model||!motionAllowed())return;const r=owner.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;viewer.move(viewer.model.camera[0]+y*.75,viewer.model.camera[1]+x*1.3);});
 function open(a){
  if(typeof dialog.showModal!=='function')return false;
  const id=a.dataset.geometryOpen;if(!/^[a-z]+(?:-[a-z]+)*$/.test(id||''))return false;
  stopHover();modal=true;opener=a;pausePreviews();
  const scope=a.closest('[data-view]')||document;
  const template=scope.querySelector(`template[data-geometry-info="${id}"]`)||document.querySelector(`template[data-geometry-info="${id}"]`);const source=scope.querySelector(`[data-geometry-detail-source="${id}"]`)||document.querySelector(`[data-geometry-detail-source="${id}"]`);if(!template&&!source){modal=false;return false;}
  dialog.querySelectorAll('.geometry-interaction > [data-geo-presets]').forEach(group=>group.remove());detail.replaceChildren(template?template.content.cloneNode(true):source.cloneNode(true));detail.querySelectorAll('[data-geo-presets]').forEach(group=>{group.hidden=false;stage.before(group);});detail.querySelectorAll('h4').forEach(h=>{const replacement=document.createElement('h3');replacement.textContent=h.textContent;h.replaceWith(replacement);});const title=detail.querySelector('[data-geo-info-title]')?.textContent||a.querySelector('img')?.alt||tr("Esplora il modello");dialog.querySelector('#geometry-title').textContent=title;
  if(!template){const summary=source.closest('.atlas-card-copy')?.querySelector(':scope > p');if(summary)detail.querySelector('.geometry-explanation > .label')?.after(summary.cloneNode(true));}
  detail.querySelector('[data-geo-info-title]')?.remove();syncFigureKey(id);
  fallback.src=a.querySelector('img').src;fallback.alt=title;status.textContent=tr("Caricamento del modello…");setSpin(false);
  dialog.showModal();dialog.scrollTop=0;document.body.classList.add('geometry-modal-open');dialog.querySelector('[data-geo-close]').focus();setMotionLabels();
  const token=++generation;activate(a,stage,token).catch(error=>{if(token===generation){status.textContent=tr(error.message)||tr("3D non disponibile. La spiegazione resta consultabile.");viewer?.detach();}});return true;
 }
 document.addEventListener('click',e=>{const a=e.target.closest('[data-geometry-open]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey)return;if(open(a)){e.preventDefault();e.stopImmediatePropagation();}},true);
 dialog.querySelector('[data-geo-close]').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{dialog.classList.remove('is-expanded');expand.setAttribute('aria-pressed','false');expand.textContent=tr('Vista immersiva');generation++;modal=false;viewer?.detach();owner=null;activeId='';document.body.classList.remove('geometry-modal-open');if(!document.activeElement?.closest?.('#main'))opener?.focus({preventScroll:true});opener=null;syncPreviews();});
 const ready=()=>!!(modal&&viewer?.alive&&viewer?.model&&viewer.host===stage);
 dialog.addEventListener('click',async e=>{const button=e.target.closest('[data-geo-preset]');if(!button||!ready())return;const token=++generation,resume=viewer.auto;viewer.stop();setSpin(false);status.textContent=tr("Caricamento del modello…");try{const buffer=await getScene(button.dataset.geoPreset,button.dataset.scene,button.dataset.sceneSha256,token);if(token!==generation||!modal)return;viewer.load(buffer);if(button.dataset.geoPreset==='schwarzite-sections'&&displayMode==='wire'){displayMode='surface';style.value=displayMode;}viewer.setMode(displayMode);if(resume&&motionAllowed()){viewer.auto=true;viewer.start();setSpin(true);}dialog.querySelectorAll('[data-geo-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));syncFigureKey(button.dataset.geoPreset);status.textContent=button.textContent;}catch(error){if(token===generation)status.textContent=tr(error.message);}});
 style.addEventListener('change',()=>{displayMode=style.value;try{localStorage.setItem('mdc-geometry-style',displayMode);}catch{}if(ready())viewer.setMode(displayMode);syncFigureKey();});
 expand.addEventListener('click',()=>{const expanded=dialog.classList.toggle('is-expanded');expand.setAttribute('aria-pressed',String(expanded));expand.textContent=tr(expanded?'Mostra spiegazione':'Vista immersiva');viewer?.render();});
 const spin=dialog.querySelector('[data-geo-spin]');
 function setSpin(on){spin.setAttribute('aria-disabled',String(!motionAllowed()));spin.setAttribute('aria-pressed',String(on));spin.textContent=tr(on?'Ferma rotazione':'Avvia rotazione');}
 spin.addEventListener('click',()=>{if(!ready())return;if(!motionAllowed()){status.textContent=motionReason();return;}viewer.auto=!viewer.auto;setSpin(viewer.auto);if(viewer.auto)viewer.start();else viewer.stop();});
 dialog.querySelector('[data-geo-left]').addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0],viewer.angle[1]-.22,false);}});
 dialog.querySelector('[data-geo-right]').addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0],viewer.angle[1]+.22,false);}});
 for(const [selector,delta] of [['[data-geo-up]',-.22],['[data-geo-down]',.22]])dialog.querySelector(selector).addEventListener('click',()=>{if(ready()){viewer.stop();setSpin(false);viewer.move(viewer.angle[0]+delta,viewer.angle[1],false);}});
 dialog.querySelectorAll('[data-geo-view]').forEach(button=>button.addEventListener('click',()=>{if(!ready())return;const angles={front:[0,0],side:[0,Math.PI/2],top:[Math.PI/2,0]}[button.dataset.geoView];viewer.stop();setSpin(false);if(activeId==='julia'&&button.dataset.geoView==='front'){viewer.angle=viewer.model.camera.slice();viewer.target=viewer.angle.slice();viewer.render();}else viewer.move(...angles,false);}));
 window.MDCEffects?.subscribe(()=>{if(!motionAllowed()){viewer?.stop();if(!modal)stopHover();}setSpin(!!viewer?.auto&&motionAllowed());syncPreviews();});
 dialog.querySelector('[data-geo-in]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom*1.15);});
 dialog.querySelector('[data-geo-out]').addEventListener('click',()=>{if(ready())viewer.setZoom(viewer.zoom/1.15);});
 dialog.querySelector('[data-geo-reset]').addEventListener('click',()=>{if(ready()){viewer.reset();setSpin(false);}});
 document.addEventListener('click',e=>{if(!e.target.closest('[data-geo-motion]'))return;disabled=!disabled;try{localStorage.setItem('mdc-geometry-motion',disabled?'off':'on');}catch{}if(disabled){viewer?.stop();if(!modal)stopHover();}setSpin(!!viewer?.auto&&motionAllowed());setMotionLabels();syncPreviews();});
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
 let resumeSpin=false;
 document.addEventListener('visibilitychange',()=>{if(document.hidden){resumeSpin=!!viewer?.auto;viewer?.stop();setSpin(false);if(!modal)stopHover();}else if(resumeSpin&&ready()&&motionAllowed()){viewer.auto=true;viewer.start();setSpin(true);resumeSpin=false;}syncPreviews();});
 reduced.addEventListener('change',()=>{viewer?.stop();setSpin(false);setMotionLabels();if(!modal)stopHover();syncPreviews();});
 window.addEventListener('hashchange',()=>{if(modal)dialog.close();stopHover();});
 /* At most three visible previews share the renderer implementation and scene cache.
  * One fetch slot remains free for opening a dialog. Detached cards keep only angles. */
 const previews=new Map(),visible=new Map(),idle=[],poses=new WeakMap(),failed=new WeakSet();
 let suspended=false;
 const previewObserver=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&e.intersectionRatio>=.08)visible.set(e.target,e.intersectionRatio);else visible.delete(e.target);}syncPreviews();},{threshold:[0,.08,.35,.7,1]});
 function releasePreview(a,entry){
  if(entry.view){const v=entry.view;poses.set(a,{angle:v.angle.slice(),phase:v.lightPhase,time:v.motionTime});v.onlost=null;v.detach();if(v.alive)idle.push(v);else v.dispose();}
  a.removeAttribute('data-geometry-motion');previews.delete(a);
 }
 function pausePreviews(){for(const [a,e] of previews)if(e.view){e.view.stop();a.dataset.geometryMotion='paused';}}
 function clearPreviews(){previewObserver.disconnect();visible.clear();for(const [a,e] of previews)releasePreview(a,e);}
 function syncPreviews(){
  const wanted=new Set([...visible].filter(([a])=>a.isConnected&&!failed.has(a)).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([a])=>a));
  for(const [a,e] of previews)if(!wanted.has(a))releasePreview(a,e);
  if(suspended||modal||document.hidden||!motionAllowed()){pausePreviews();return;}
  for(const a of wanted){
   const entry=previews.get(a);if(entry){if(entry.view){entry.view.previewCount=wanted.size;entry.view.auto=true;entry.view.start();a.dataset.geometryMotion='running';}continue;}
   if(pending.size>=3)break;
   const next={view:null};previews.set(a,next);
   Promise.all([getLibrary(),getScene(a.dataset.geometryOpen,a.dataset.scene,a.dataset.sceneSha256)]).then(([lib,buffer])=>{
    if(previews.get(a)!==next||!a.isConnected)return;
    const v=next.view=idle.pop()||new lib.Viewer({preview:true});configureMotion(v,a);v.load(buffer);v.setMode('surface');
    const pose=poses.get(a);v.lightPhase=pose?.phase??[...a.dataset.geometryOpen].reduce((n,c)=>n+c.charCodeAt(0),0)*.03;
    if(pose){v.angle=pose.angle.slice();v.target=v.angle.slice();v.motionTime=pose.time;}
    v.onlost=()=>{if(previews.get(a)===next){failed.add(a);releasePreview(a,next);syncPreviews();}};
    v.attach(a);
   }).catch(()=>{if(previews.get(a)===next){failed.add(a);releasePreview(a,next);}}).finally(syncPreviews);
  }
 }
 function scanPreviews(){clearPreviews();document.querySelectorAll('[data-geometry-ambient][data-geometry-open]').forEach(a=>previewObserver.observe(a));}
 window.addEventListener('mdc:content-change',()=>{scanPreviews();setMotionLabels();});
 navigator.connection?.addEventListener?.('change',()=>{if(!motionAllowed()){viewer?.stop();setSpin(false);stopHover();}syncPreviews();});
 window.addEventListener('pagehide',()=>{suspended=true;clearPreviews();for(const v of idle.splice(0))v.dispose();viewer?.dispose();viewer=null;cache.clear();});
 window.addEventListener('pageshow',e=>{if(e.persisted){suspended=false;scanPreviews();}});
 scanPreviews();
})();
