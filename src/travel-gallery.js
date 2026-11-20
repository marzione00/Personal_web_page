/* Progressive enhancement: images remain ordinary links without JavaScript.
 * One accessible viewer for every gallery; never edits the original image.
 */
(() => {
 'use strict';
 const dialog=document.getElementById('travel-lightbox');
 if(!dialog || typeof dialog.showModal!=='function')return;
 const full=dialog.querySelector('[data-travel-large]');
 const diagrams=document.createElement('div');diagrams.dataset.travelDiagram='';full.after(diagrams);
 const caption=dialog.querySelector('[data-travel-caption]');
 const count=dialog.querySelector('[data-travel-count]');
 const close=dialog.querySelector('[data-travel-close]');
 const prev=dialog.querySelector('[data-travel-prev]');
 const next=dialog.querySelector('[data-travel-next]');
 const zoom=dialog.querySelector('[data-travel-zoom]');
 const board=diagrams.parentElement;
 function setZoom(on){
  dialog.toggleAttribute('data-zoom',on);
  zoom?.setAttribute('aria-pressed',String(on));
  if(on){
   board.tabIndex=0;
   board.focus();
  }else{
   board.removeAttribute('tabindex');
   board.scrollTo(0,0);
  }
 }
 let links=[],active=0,lastFocused=null;
 function display(index){
  if(!links.length)return;
  active=(index+links.length)%links.length;
  const link=links[active],thumb=link.querySelector('img'),science=link.hasAttribute('data-science-figure');
  dialog.toggleAttribute('data-science',science);
  setZoom(false);
  diagrams.replaceChildren();full.removeAttribute('src');
  if(science){
   const figure=link.closest('figure'),svg=figure.querySelector('svg').cloneNode(true);
   // Scope cloned references so the page and its modal never share IDs.
   for(const node of [svg,...svg.querySelectorAll('*')])for(const attr of Array.from(node.attributes)){
    if(attr.name==='id'||attr.name==='aria-labelledby')node.setAttribute(attr.name,attr.value+'-viewer');
    else if(attr.value.includes('url(#'))node.setAttribute(attr.name,attr.value.replace(/url\(#([^)]*)\)/g,'url(#$1-viewer)'));
   }
   diagrams.append(svg);caption.textContent=figure.querySelector('figcaption').textContent;
  }else{
   full.src=document.body.dataset.portable==='true'?(thumb?.src||link.href):link.href;
   full.alt=thumb?.alt||link.textContent.trim();caption.textContent=link.closest('figure')?.querySelector('.photo-caption,figcaption:not(:has(.photo-caption))')?.textContent||full.alt;
  }
  count.textContent=`${active+1} / ${links.length}`;
  prev.disabled=next.disabled=links.length<=1;
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('[data-travel-photo]');
  if(!link||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
  const gallery=link.closest('[data-travel-gallery]');if(!gallery)return;
  event.preventDefault();
  links=Array.from(gallery.querySelectorAll('[data-travel-photo]'));
  lastFocused=link;
  display(links.indexOf(link));
  dialog.showModal();close.focus();
 });
 close?.addEventListener('click',()=>dialog.close());
 prev?.addEventListener('click',()=>display(active-1));
 next?.addEventListener('click',()=>display(active+1));
 zoom?.addEventListener('click',()=>setZoom(!dialog.hasAttribute('data-zoom')));
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('keydown',event=>{
  if(dialog.hasAttribute('data-zoom'))return;
  if(event.key==='ArrowLeft'){event.preventDefault();display(active-1);}
  if(event.key==='ArrowRight'){event.preventDefault();display(active+1);}
 });
 dialog.addEventListener('close',()=>{
  setZoom(false);full.removeAttribute('src');diagrams.replaceChildren();links=[];
  if(!document.activeElement?.closest?.('#main'))lastFocused?.focus();lastFocused=null;
 });
})();
