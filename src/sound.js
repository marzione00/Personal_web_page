/* Opt-in soft interface accents. Pointer movement, hover and scrolling are silent. */
(() => {
 'use strict';
 const toggle=document.querySelector('[data-sound-toggle]');if(!toggle)return;
 const en=document.documentElement.lang==='en',AudioClass=window.AudioContext||window.webkitAudioContext;
 const read=(k,f)=>{try{return localStorage.getItem(k)??f;}catch{return f;}};
 const save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 let enabled=Boolean(AudioClass)&&read('mdc-sound-enabled','off')==='on',context=null,master=null,duck=false,lastChirp=-Infinity,lastPage=-Infinity;
 let volume=Number(read('mdc-sound-volume','.25'));volume=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):.25;
 const slider=document.querySelector('[data-sound-volume]'),output=document.querySelector('[data-sound-volume-value]');
 const voices=new Set(),counts={link:0,page:0,enable:0};
 function display(){
  if(context&&master)master.gain.setTargetAtTime(enabled?volume*(duck?.07:.11):0,context.currentTime,.045);
  toggle.setAttribute('aria-pressed',String(enabled));
  const label=!AudioClass?(en?'Audio is not available in this browser':'Audio non disponibile in questo browser'):enabled?(en?'Disable sound effects':'Disattiva gli effetti sonori'):(en?'Enable sound effects':'Attiva gli effetti sonori');
  toggle.setAttribute('aria-label',label);toggle.title=label;
  toggle.querySelector('[data-sound-on]')?.toggleAttribute('hidden',!enabled);toggle.querySelector('[data-sound-off]')?.toggleAttribute('hidden',enabled);
  if(slider){slider.value=String(Math.round(volume*100));output.textContent=slider.value+'%';}
 }
 function init(){if(context)return;context=new AudioClass();master=context.createGain();master.gain.value=0;const compressor=context.createDynamicsCompressor();compressor.threshold.value=-24;compressor.knee.value=20;compressor.ratio.value=3;master.connect(compressor);compressor.connect(context.destination);display();}
 async function unlock(){if(!enabled||!AudioClass)return false;try{init();if(context.state!=='running')await context.resume();return context.state==='running';}catch{return false;}}
 function silence(){if(!context)return;for(const v of [...voices])try{v.gain.gain.cancelScheduledValues(context.currentTime);v.gain.gain.setTargetAtTime(.00001,context.currentTime,.025);v.osc.stop(context.currentTime+.12);}catch{}}
 function tone(kind){
  if(!enabled||document.hidden||!context||context.state!=='running'||voices.size>=3)return;
  const t=context.currentTime,page=kind==='page',length=page?.65:.28,frequency=page?130.81:196;
  const osc=context.createOscillator(),overtone=context.createOscillator(),overtoneGain=context.createGain(),gain=context.createGain(),filter=context.createBiquadFilter();
  osc.type='sine';osc.frequency.setValueAtTime(frequency,t);osc.frequency.exponentialRampToValueAtTime(frequency*.97,t+length);
  overtone.type='sine';overtone.frequency.value=frequency*1.5;overtoneGain.gain.value=.12;overtone.connect(overtoneGain);overtoneGain.connect(filter);
  filter.type='lowpass';filter.frequency.value=900;filter.Q.value=.4;
  gain.gain.setValueAtTime(.00001,t);gain.gain.exponentialRampToValueAtTime(page?.16:.12,t+.055);gain.gain.exponentialRampToValueAtTime(.00001,t+length);
  osc.connect(filter);filter.connect(gain);gain.connect(master);const voice={gain,osc};voices.add(voice);counts[kind]++;
  osc.onended=()=>{voices.delete(voice);for(const n of [osc,overtone,overtoneGain,gain,filter])try{n.disconnect();}catch{}};
  osc.start(t);overtone.start(t);osc.stop(t+length+.03);overtone.stop(t+length+.03);
 }
 function chirp(){const now=performance.now();if(now-lastChirp<360)return;lastChirp=now;tone('link');}
 function pageSound(){const now=performance.now();if(now-lastPage<700)return;lastPage=now;tone('page');}
 async function enable(on){enabled=Boolean(on)&&Boolean(AudioClass);if(!enabled){save('mdc-sound-enabled','off');silence();display();return false;}const ok=await unlock();enabled=enabled&&ok;save('mdc-sound-enabled',enabled?'on':'off');display();if(enabled)tone('enable');return enabled;}
 toggle.addEventListener('click',()=>void enable(!enabled));
 slider?.addEventListener('input',()=>{volume=Number(slider.value)/100;save('mdc-sound-volume',String(volume));display();});
 const gesture=()=>{if(enabled)void unlock();};document.addEventListener('pointerdown',gesture,{passive:true});document.addEventListener('keydown',gesture);
 document.addEventListener('click',ev=>{if(ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;const button=ev.target.closest?.('button');if(button&&!button.matches('[data-sound-toggle],[data-entry-audio],[data-entry-skip]'))chirp();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();});window.addEventListener('pagehide',silence);
 window.MDCSound={enable,get enabled(){return enabled;},get volume(){return volume;},get ready(){return context?.state==='running';},get counts(){return {...counts};},get activeVoices(){return voices.size;},page:pageSound,setMusic(on){duck=Boolean(on);display();}};display();
})();
