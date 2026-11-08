/* Original opt-in electronic UI sound. FM tones, filtered digital pulses and short noise sweeps.
 * No soundtrack, external media, autoplay or unbounded pointer-triggered voices.
 */
(() => {
 'use strict';
 const toggle=document.querySelector('[data-sound-toggle]');if(!toggle)return;
 const en=document.documentElement.lang==='en',AudioClass=window.AudioContext||window.webkitAudioContext;
 const pref='mdc-sound-enabled',read=()=>{try{return localStorage.getItem(pref);}catch{return null;}};
 const save=on=>{try{localStorage.setItem(pref,on?'on':'off');}catch{}};
 let enabled=Boolean(AudioClass)&&read()==='on',context=null,master=null,noise=null,lastChirp=0,lastMove=0,lastPage=0,distance=0,previous=null;
 const voices=new Set(),counts={cursor:0,link:0,page:0,enable:0};
 function display(){
  if(context&&master)try{master.gain.setTargetAtTime(enabled?.11:0,context.currentTime,.008);}catch{}
  toggle.setAttribute('aria-pressed',String(enabled));
  const label=!AudioClass?(en?'Audio is not available in this browser':'Audio non disponibile in questo browser'):enabled?(en?'Disable sound effects':'Disattiva gli effetti sonori'):(en?'Enable sound effects':'Attiva gli effetti sonori');
  toggle.setAttribute('aria-label',label);toggle.title=label;
  toggle.querySelector('[data-sound-on]')?.toggleAttribute('hidden',!enabled);toggle.querySelector('[data-sound-off]')?.toggleAttribute('hidden',enabled);
 }
 function init(){
  if(context)return;
  context=new AudioClass();master=context.createGain();master.gain.value=.11;
  const compressor=context.createDynamicsCompressor();compressor.threshold.value=-20;compressor.knee.value=12;compressor.ratio.value=6;
  master.connect(compressor);compressor.connect(context.destination);
  noise=context.createBuffer(1,Math.ceil(context.sampleRate*.18),context.sampleRate);
  const b=noise.getChannelData(0);let seed=48127;
  for(let i=0;i<b.length;i++){seed=(seed*1664525+1013904223)>>>0;b[i]=((seed/4294967296)*2-1)*.55;}
 }
 async function unlock(){
  if(!enabled||!AudioClass)return false;
  try{init();if(context.state!=='running')await context.resume();return context.state==='running';}catch{return false;}
 }
 function silence(){
  if(!context)return;
  for(const v of [...voices]){try{v.gain.gain.cancelScheduledValues(context.currentTime);v.gain.gain.setTargetAtTime(.00001,context.currentTime,.008);v.osc.stop(context.currentTime+.035);}catch{}}
 }
 function tone(kind){
  if(!enabled||document.hidden||!context||context.state!=='running'||voices.size>=4)return;
  const t=context.currentTime,cursor=kind==='cursor',page=kind==='page',length=cursor?.042:page?.22:.088;
  const frequency=cursor?1380+(counts.cursor%5)*145:page?320:890;
  const osc=context.createOscillator(),mod=context.createOscillator(),modGain=context.createGain(),gain=context.createGain(),filter=context.createBiquadFilter();
  osc.type=cursor?'square':'triangle';osc.frequency.setValueAtTime(frequency,t);
  if(page){osc.frequency.exponentialRampToValueAtTime(1700,t+.09);osc.frequency.setValueAtTime(840,t+.10);osc.frequency.exponentialRampToValueAtTime(430,t+length);}
  else{osc.frequency.setValueAtTime(frequency*1.36,t+length*.26);osc.frequency.exponentialRampToValueAtTime(frequency*.68,t+length);}
  mod.type='sine';mod.frequency.setValueAtTime(frequency*2.03,t);modGain.gain.setValueAtTime(cursor?70:page?330:260,t);modGain.gain.exponentialRampToValueAtTime(8,t+length);
  mod.connect(modGain);modGain.connect(osc.frequency);
  filter.type='bandpass';filter.frequency.setValueAtTime(cursor?2050:page?1600:1900,t);filter.Q.value=.65;
  gain.gain.setValueAtTime(.00001,t);gain.gain.exponentialRampToValueAtTime(cursor?.035:page?.11:.075,t+.006);gain.gain.exponentialRampToValueAtTime(.00001,t+length);
  osc.connect(filter);filter.connect(gain);gain.connect(master);
  const voice={gain,osc};voices.add(voice);counts[kind]=(counts[kind]||0)+1;
  osc.onended=()=>{voices.delete(voice);for(const n of [osc,mod,modGain,gain,filter])try{n.disconnect();}catch{}};
  osc.start(t);mod.start(t);osc.stop(t+length+.015);mod.stop(t+length+.015);
  if(page){const source=context.createBufferSource(),nf=context.createBiquadFilter(),ng=context.createGain();source.buffer=noise;nf.type='highpass';nf.frequency.setValueAtTime(3400,t);nf.frequency.exponentialRampToValueAtTime(800,t+.15);ng.gain.setValueAtTime(.00001,t);ng.gain.exponentialRampToValueAtTime(.055,t+.015);ng.gain.exponentialRampToValueAtTime(.00001,t+.16);source.connect(nf);nf.connect(ng);ng.connect(master);source.start(t);source.onended=()=>[source,nf,ng].forEach(n=>n.disconnect());}
 }
 function chirp(){const now=performance.now();if(now-lastChirp<230)return;lastChirp=now;tone('link');}
 function pageSound(){const now=performance.now();if(now-lastPage<450)return;lastPage=now;tone('page');}
 display();
 toggle.addEventListener('click',async()=>{
  if(!AudioClass)return;
  if(enabled){enabled=false;save(false);silence();display();return;}
  enabled=true;if(!await unlock()){enabled=false;display();return;}save(true);display();tone('enable');
 });
 const gesture=()=>{if(enabled)void unlock();};
 document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);
 document.addEventListener('pointerover',ev=>{if(ev.pointerType!=='mouse')return;const a=ev.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||(ev.relatedTarget&&a.contains(ev.relatedTarget)))return;chirp();},{passive:true});
 document.addEventListener('focusin',ev=>{const a=ev.target.closest?.('a[href]');if(a?.matches(':focus-visible'))chirp();});
 document.addEventListener('pointermove',ev=>{
  if(ev.pointerType!=='mouse'||ev.buttons||!enabled||!context||context.state!=='running')return;
  if(ev.target.closest?.('input,textarea,select,[contenteditable=true]'))return;
  if(previous)distance+=Math.hypot(ev.clientX-previous[0],ev.clientY-previous[1]);previous=[ev.clientX,ev.clientY];
  const now=performance.now();if(distance<85||now-lastMove<190||now-lastChirp<160)return;
  distance=0;lastMove=now;tone('cursor');
 },{passive:true});
 document.addEventListener('click',ev=>{
  if(ev.defaultPrevented||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
  const a=ev.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download')||a.hasAttribute('data-geometry-open')||a.hasAttribute('data-travel-photo'))return;
  try{const u=new URL(a.href,location.href);if(u.origin!==location.origin||!u.pathname.endsWith('.html')||u.pathname===location.pathname&&u.hash)return;pageSound();}catch{}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){silence();previous=null;distance=0;}});
 window.addEventListener('pagehide',silence);
 window.MDCSound={get enabled(){return enabled;},get ready(){return context?.state==='running';},get counts(){return {...counts};},get activeVoices(){return voices.size;},page:pageSound};
})();
