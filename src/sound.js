/* MDC_LAB — opt-in UI sound. No audio files, tracking or autoplay.
 * One Web Audio context, created/resumed exclusively after an explicit gesture.
 * Mouse link entry / keyboard focus triggers a short low-volume original chirp.
 */
(() => {
 'use strict';
 const toggle=document.querySelector('[data-sound-toggle]');
 if(!toggle)return;
 const italian=document.documentElement.lang!=='en';
 const message=(on)=>italian?(on?'Disattiva gli effetti sonori':'Attiva gli effetti sonori'):(on?'Disable sound effects':'Enable sound effects');
 const unavailable=italian?'Audio non disponibile in questo browser':'Audio is not available in this browser';
 const AudioClass=window.AudioContext||window.webkitAudioContext;
 const pref='mdc-sound-enabled';
 const read=()=>{try{return localStorage.getItem(pref);}catch{return null;}};
 const save=on=>{try{localStorage.setItem(pref,on?'on':'off');}catch{/* Optional persistence only. */}};
 let enabled=Boolean(AudioClass)&&read()==='on';
 let context=null,lastChirp=0;
 function display(){
  toggle.setAttribute('aria-pressed',String(enabled));
  const label=AudioClass?message(enabled):unavailable;
  toggle.setAttribute('aria-label',label);toggle.title=label;
  toggle.querySelector('[data-sound-on]')?.toggleAttribute('hidden',!enabled);
  toggle.querySelector('[data-sound-off]')?.toggleAttribute('hidden',enabled);
 }
 function unlock(){
  if(!enabled||!AudioClass)return Promise.resolve(false);
  try{if(!context)context=new AudioClass();
   if(context.state==='running')return Promise.resolve(true);
   return Promise.resolve(context.resume()).then(()=>context?.state==='running').catch(()=>false);
  }catch{return Promise.resolve(false);}
 }
 function chirp(){
  if(!enabled||document.hidden||!context||context.state!=='running')return;
  const now=performance.now();if(now-lastChirp<230)return;lastChirp=now;
  try{
   const t=context.currentTime;
   for(const [start,end,level,type] of [[770,540,.012,'triangle'],[1120,860,.004,'sine']]){
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=type;oscillator.frequency.setValueAtTime(start,t);
    oscillator.frequency.exponentialRampToValueAtTime(end,t+.095);
    gain.gain.setValueAtTime(.00001,t);
    gain.gain.exponentialRampToValueAtTime(level,t+.012);
    gain.gain.exponentialRampToValueAtTime(.00001,t+.103);
    oscillator.connect(gain);gain.connect(context.destination);
    oscillator.start(t);oscillator.stop(t+.11);
    oscillator.onended=()=>{try{oscillator.disconnect();gain.disconnect();}catch{}};
   }
  }catch{/* Audio is optional and must never affect navigation. */}
 }
 display();
 toggle.addEventListener('click',async()=>{
  if(!AudioClass){display();return;}
  if(enabled){enabled=false;save(false);display();return;}
  enabled=true;
  const ready=await unlock();
  if(!ready){enabled=false;display();return;}
  save(true);display();chirp();
 });
 // Browsers may suspend AudioContext after navigation even when the preference persists.
 // Resume on the next real user interaction, never on page load or passive hover.
 const gesture=()=>{if(enabled)void unlock();};
 document.addEventListener('pointerdown',gesture,{passive:true});
 document.addEventListener('keydown',gesture);
 const eligible=el=>el?.closest?.('a[href]:not([aria-current="true"])');
 document.addEventListener('pointerover',ev=>{
  if(ev.pointerType!=='mouse')return;
  const link=eligible(ev.target);if(!link||link.hasAttribute('download'))return;
  if(ev.relatedTarget&&link.contains(ev.relatedTarget))return;
  chirp();
 },{passive:true});
 document.addEventListener('focusin',ev=>{
  const link=eligible(ev.target);
  if(link&&link.matches(':focus-visible'))chirp();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)lastChirp=performance.now();});
})();
