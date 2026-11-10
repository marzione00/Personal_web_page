/* One bounded animation per visible map. The illustration stays meaningful without JS. */
(()=>{'use strict';
 const dialog=document.getElementById('cyber-dialog');if(!dialog)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let records=[],raf=0,last=0,opener=null,observer=null;
 const allowed=()=>!reduced.matches&&!window.MDCEffects?.paused&&!navigator.connection?.saveData&&!document.hidden&&!dialog.open;
 function paint(record,time){
  for(const n of record.nodes)n.el.classList.toggle('is-hit',time>=n.at);
  for(const p of record.routes)p.el.setAttribute('opacity',time>=p.at?.5:0);
  for(const p of record.pulses){const [ax,ay,cx,cy,bx,by,start,end]=p.values,u=(time-start)/(end-start),active=u>=0&&u<1;p.el.setAttribute('opacity',active?1:0);if(active){p.el.setAttribute('cx',(1-u)*(1-u)*ax+2*(1-u)*u*cx+u*u*bx);p.el.setAttribute('cy',(1-u)*(1-u)*ay+2*(1-u)*u*cy+u*u*by);}}
 }
 function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
 function tick(now){raf=0;if(!allowed()){last=0;return;}if(!last)last=now;if(now-last<50){raf=requestAnimationFrame(tick);return;}const dt=Math.min(.15,(now-last)/1000);last=now;let more=false;
  for(const r of records){if(!r.visible||r.time>=14.4)continue;r.time=Math.min(14.4,r.time+dt);paint(r,r.time);if(r.time<14.4)more=true;}
  if(more)raf=requestAnimationFrame(tick);else last=0;
 }
 function sync(){if(!allowed()){stop();return;}if(!raf&&records.some(r=>r.visible&&r.time<14.4)){last=0;raf=requestAnimationFrame(tick);}}
 function bind(){stop();observer?.disconnect();const scope=document.querySelector('[data-view]:not([hidden])')||document.getElementById('main');
  records=[...(scope?.querySelectorAll('[data-cyber-open]')||[])].map(el=>({el,visible:false,time:reduced.matches?12:4,nodes:[...el.querySelectorAll('[data-cyber-arrival]')].map(n=>({el:n,at:Number(n.dataset.cyberArrival)})),routes:[...el.querySelectorAll('[data-cyber-route]')].map(n=>({el:n,at:Number(n.dataset.cyberRoute)})),pulses:[...el.querySelectorAll('[data-cyber-pulse]')].map(n=>({el:n,values:n.dataset.cyberPulse.split(',').map(Number)}))}));
  observer=new IntersectionObserver(entries=>{for(const entry of entries){const r=records.find(x=>x.el===entry.target);if(r){r.visible=entry.isIntersecting;if(r.visible&&allowed())paint(r,r.time);}}sync();},{threshold:.08});for(const r of records)observer.observe(r.el);
 }
 document.addEventListener('click',ev=>{const a=ev.target.closest?.('[data-cyber-open]');if(!a||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey||typeof dialog.showModal!=='function')return;ev.preventDefault();ev.stopImmediatePropagation();opener=a;stop();dialog.showModal();dialog.scrollTop=0;dialog.querySelector('[data-cyber-close]').focus();},true);
 dialog.querySelector('[data-cyber-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',ev=>{if(ev.target!==dialog)return;const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});opener=null;sync();});
 window.addEventListener('mdc:before-content-change',()=>{stop();observer?.disconnect();records=[];opener=null;if(dialog.open)dialog.close();});window.addEventListener('mdc:content-change',bind);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.MDCEffects?.subscribe(sync);window.addEventListener('pagehide',()=>{stop();observer?.disconnect();});bind();
})();
