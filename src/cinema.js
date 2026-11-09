/* A finite opening sequence. Never represents loading progress or blocks a resource. */
(() => {
 'use strict';
 const fx=window.MDCEffects,dialog=document.querySelector('[data-entry-dialog]');
 if(!fx||!dialog||typeof dialog.showModal!=='function')return;
 let timer=0,previous=null;
 const enabled=()=>fx.intro&&fx.transitions&&fx.ambient==='on'&&!fx.reduced;
 function close(){clearTimeout(timer);timer=0;if(dialog.open)dialog.close();}
 function show(replay=false){
  if(!enabled()||document.hidden||dialog.open||document.querySelector('dialog[open]'))return false;
  if(!replay){
   if(location.hash)return false;
   try{if(sessionStorage.getItem('mdc-entry-v36')==='seen')return false;sessionStorage.setItem('mdc-entry-v36','seen');}catch{}
  }
  previous=replay?document.activeElement:null;dialog.showModal();
  timer=setTimeout(close,2200);return true;
 }
 dialog.querySelector('[data-entry-skip]').addEventListener('click',close);
 dialog.addEventListener('close',()=>{clearTimeout(timer);timer=0;if(previous?.isConnected)previous.focus({preventScroll:true});previous=null;window.dispatchEvent(new Event('mdc:page-transition'));});
 function sync(){if(!enabled())close();document.querySelectorAll('[data-entry-replay]').forEach(b=>b.disabled=!enabled());}
 document.querySelectorAll('[data-entry-replay]').forEach(b=>b.addEventListener('click',()=>show(true)));
 fx.subscribe(sync);sync();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)close();});
 window.addEventListener('pagehide',close);
 show();
})();
