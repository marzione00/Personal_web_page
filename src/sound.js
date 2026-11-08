/* Topological Manifolds — opt-in, low-level electronic accents. Smooth sinusoidal FM, no arcade steps.
 * A single context for UI events; lower event density, at most three brief voices.
 */
(() => {
 'use strict';
 const toggle=document.querySelector('[data-sound-toggle]');if(!toggle)return;
 const en=document.documentElement.lang==='en',AudioClass=window.AudioContext||window.webkitAudioContext;
 const pref='mdc-sound-enabled',read=()=>{try{return localStorage.getItem(pref);}catch{return null;}};
 const save=on=>{try{localStorage.setItem(pref,on?'on':'off');}catch{}};
 let enabled=Boolean(AudioClass)&&read()==='on',context=null,master=null,lastChirp=0,lastMove=0,lastPage=0,distance=0,previous=null,duck=false;
 const voices=new Set(),counts={cursor:0,link:0,page:0,enable:0};
 function display(){
  if(context&&master)try{master.gain.setTargetAtTime(enabled?(duck?.036:.065):0,context.currentTime,.03);}catch{}
  toggle.setAttribute('aria-pressed',String(enabled));
  const label=!AudioClass?(en?'Audio is not available in this browser':'Audio non disponibile in questo browser'):enabled?(en?'Disable sound effects':'Disattiva gli effetti sonori'):(en?'Enable sound effects':'Attiva gli effetti sonori');
  toggle.setAttribute('aria-label',label);toggle.title=label;
  toggle.querySelector('[data-sound-on]')?.toggleAttribute('hidden',!enabled);toggle.querySelector('[data-sound-off]')?.toggleAttribute('hidden',enabled);
 }
 function init(){
  if(context)return;
  context=new AudioClass();master=context.createGain();master.gain.value=.065;
  const compressor=context.createDynamicsCompressor();compressor.threshold.value=-23;compressor.knee.value=18;compressor.ratio.value=3;
  master.connect(compressor);compressor.connect(context.destination);
 }
 async function unlock(){if(!enabled||!AudioClass)return false;try{init();if(context.state!=='running')await context.resume();return context.state==='running';}catch{return false;}}
 function silence(){
  if(!context)return;
  for(const v of [...voices])try{v.gain.gain.cancelScheduledValues(context.currentTime);v.gain.gain.setTargetAtTime(.00001,context.currentTime,.015);v.osc.stop(context.currentTime+.07);}catch{}
 }
 function tone(kind){
  if(!enabled||document.hidden||!context||context.state!=='running'||voices.size>=3)return;
  const t=context.currentTime,cursor=kind==='cursor',page=kind==='page',length=cursor?.085:page?.29:.16;
  const frequency=cursor?520:page?246.94:659.25;
  const osc=context.createOscillator(),mod=context.createOscillator(),modGain=context.createGain(),gain=context.createGain(),filter=context.createBiquadFilter();
  osc.type='sine';osc.frequency.setValueAtTime(frequency,t);osc.frequency.exponentialRampToValueAtTime(frequency*(page?.94:cursor?.99:.98),t+length);
  mod.type='sine';mod.frequency.setValueAtTime(frequency*(page?1.5:2.005),t);modGain.gain.setValueAtTime(cursor?5:page?14:11,t);modGain.gain.exponentialRampToValueAtTime(.3,t+length);
  mod.connect(modGain);modGain.connect(osc.frequency);
  filter.type='lowpass';filter.frequency.setValueAtTime(page?1500:1900,t);filter.Q.value=.4;
  gain.gain.setValueAtTime(.00001,t);gain.gain.exponentialRampToValueAtTime(cursor?.025:page?.09:.065,t+.025);gain.gain.exponentialRampToValueAtTime(.00001,t+length);
  osc.connect(filter);filter.connect(gain);gain.connect(master);
  const voice={gain,osc};voices.add(voice);counts[kind]=(counts[kind]||0)+1;
  osc.onended=()=>{voices.delete(voice);for(const n of [osc,mod,modGain,gain,filter])try{n.disconnect();}catch{}};
  osc.start(t);mod.start(t);osc.stop(t+length+.02);mod.stop(t+length+.02);
 }
 function chirp(){const now=performance.now();if(now-lastChirp<360)return;lastChirp=now;tone('link');}
 function pageSound(){const now=performance.now();if(now-lastPage<650)return;lastPage=now;tone('page');}
 display();
 toggle.addEventListener('click',async()=>{if(!AudioClass)return;if(enabled){enabled=false;save(false);silence();display();return;}enabled=true;if(!await unlock()){enabled=false;display();return;}save(true);display();tone('enable');});
 const gesture=()=>{if(enabled)void unlock();};
 document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);
 document.addEventListener('pointerover',ev=>{if(ev.pointerType!=='mouse')return;const a=ev.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||(ev.relatedTarget&&a.contains(ev.relatedTarget)))return;chirp();},{passive:true});
 document.addEventListener('focusin',ev=>{const a=ev.target.closest?.('a[href]');if(a?.matches(':focus-visible'))chirp();});
 document.addEventListener('pointermove',ev=>{
  if(ev.pointerType!=='mouse'||ev.buttons||!enabled||!context||context.state!=='running')return;
  if(ev.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
  if(previous)distance+=Math.hypot(ev.clientX-previous[0],ev.clientY-previous[1]);previous=[ev.clientX,ev.clientY];
  const now=performance.now();if(distance<180||now-lastMove<520||now-lastChirp<300)return;
  distance=0;lastMove=now;tone('cursor');
 },{passive:true});
 document.addEventListener('click',ev=>{
  if(ev.defaultPrevented||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
  const a=ev.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||a.hasAttribute('data-geometry-open')||a.hasAttribute('data-travel-photo'))return;
  try{const u=new URL(a.href,location.href);if(u.origin!==location.origin||!u.pathname.endsWith('.html')||u.pathname===location.pathname&&u.hash)return;pageSound();}catch{}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){silence();previous=null;distance=0;}});
 window.addEventListener('pagehide',silence);
 window.MDCSound={get enabled(){return enabled;},get ready(){return context?.state==='running';},get counts(){return {...counts};},get activeVoices(){return voices.size;},page:pageSound,setMusic(on){duck=Boolean(on);display();}};
})();
