/* Progressive enhancement: photographs remain ordinary links without JavaScript.
 * One accessible viewer for every gallery; never edits the original image.
 */
(() => {
 'use strict';
 const dialog=document.getElementById('travel-lightbox');
 if(!dialog || typeof dialog.showModal!=='function')return;
 const full=dialog.querySelector('[data-travel-large]');
 const caption=dialog.querySelector('[data-travel-caption]');
 const count=dialog.querySelector('[data-travel-count]');
 const close=dialog.querySelector('[data-travel-close]');
 const prev=dialog.querySelector('[data-travel-prev]');
 const next=dialog.querySelector('[data-travel-next]');
 let links=[],active=0,lastFocused=null;
 function display(index){
  if(!links.length)return;
  active=(index+links.length)%links.length;
  const link=links[active],thumb=link.querySelector('img');
  // In the portable preview, images are embedded verbatim as data URLs.
  const url=document.body.dataset.portable==='true' ? (thumb?.src||link.href) : link.href;
  full.src=url;
  const text=thumb?.alt||link.textContent.trim();
  full.alt=text;caption.textContent=text;
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
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
 dialog.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'){event.preventDefault();display(active-1);}
  if(event.key==='ArrowRight'){event.preventDefault();display(active+1);}
 });
 dialog.addEventListener('close',()=>{
  full.removeAttribute('src');links=[];
  lastFocused?.focus();lastFocused=null;
 });
})();
