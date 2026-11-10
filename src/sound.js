/* One opt-in audio engine: soft entry, click and page accents. No movement/scroll sounds. */
(() => {
 'use strict';
 const toggle=document.querySelector('[data-sound-toggle]');if(!toggle)return;
 const en=document.documentElement.lang==='en',AudioClass=window.AudioContext||window.webkitAudioContext;
 const read=(k,f)=>{try{return localStorage.getItem(k)??f;}catch{return f;}};
 const save=(k,v)=>{try{localStorage.setItem(k,v);}catch{}};
 let enabled=Boolean(AudioClass)&&read('mdc-sound-enabled','off')==='on',context=null,master=null,duck=false,lastChirp=-Infinity,lastPage=-Infinity,lastHover=-Infinity,hoverTimer=0,hoverTarget=null,keyboard=false,suppressUntil=0;
 let volume=Number(read('mdc-sound-volume','.25'));volume=Number.isFinite(volume)?Math.max(0,Math.min(1,volume)):.25;
 const slider=document.querySelector('[data-sound-volume]'),output=document.querySelector('[data-sound-volume-value]');
 const voices=new Set(),counts={link:0,page:0,enable:0,hover:0};
 const fine=matchMedia('(hover: hover) and (pointer: fine)');
 const actions='a[href],button,summary',cards='.atlas-card,.carbon-card,.course-card,.research-index-card,.travel-card,.blog-card,.portal,.path-card,.search-row';
 const excluded='[data-sound-toggle],[data-entry-audio],[data-entry-skip],[disabled],[aria-disabled="true"]';
 const action=target=>{const a=target?.closest?.(actions);return a&&!a.matches(excluded)&&!a.closest('[inert]')?a:null;};
 const hoverItem=target=>{if(target?.closest?.(excluded))return null;return target?.closest?.(cards)||action(target);};
 function cancelHover(){clearTimeout(hoverTimer);hoverTimer=0;hoverTarget=null;}
 function display(){
  if(context&&master)master.gain.setTargetAtTime(enabled?volume*(duck?.45:.6):0,context.currentTime,.045);
  toggle.setAttribute('aria-pressed',String(enabled));
  const label=!AudioClass?(en?'Audio is not available in this browser':'Audio non disponibile in questo browser'):enabled?(en?'Disable sound effects':'Disattiva gli effetti sonori'):(en?'Enable sound effects':'Attiva gli effetti sonori');
  toggle.setAttribute('aria-label',label);toggle.title=label;
  toggle.querySelector('[data-sound-on]')?.toggleAttribute('hidden',!enabled);toggle.querySelector('[data-sound-off]')?.toggleAttribute('hidden',enabled);
  if(slider){slider.value=String(Math.round(volume*100));output.textContent=slider.value+'%';}
 }
 function init(){if(context)return;context=new AudioClass();master=context.createGain();master.gain.value=0;const compressor=context.createDynamicsCompressor();compressor.threshold.value=-24;compressor.knee.value=20;compressor.ratio.value=3;master.connect(compressor);compressor.connect(context.destination);display();}
 async function unlock(){if(!enabled||!AudioClass)return false;try{init();if(context.state!=='running')await context.resume();return context.state==='running';}catch{return false;}}
 function silence(){cancelHover();if(!context)return;for(const v of [...voices])try{v.gain.gain.cancelScheduledValues(context.currentTime);v.gain.gain.setTargetAtTime(.00001,context.currentTime,.025);v.osc.stop(context.currentTime+.12);v.overtone.stop(context.currentTime+.12);}catch{}}
 function tone(kind){
  if(!enabled||document.hidden||!context||context.state!=='running'||voices.size>=3)return;
  const t=context.currentTime,page=kind==='page',hover=kind==='hover',length=page?.48:hover?.12:.20,frequency=page?130.81:hover?370:220;
  const osc=context.createOscillator(),overtone=context.createOscillator(),overtoneGain=context.createGain(),gain=context.createGain(),filter=context.createBiquadFilter();
  osc.type='sine';osc.frequency.setValueAtTime(frequency,t);osc.frequency.exponentialRampToValueAtTime(frequency*(page?.90:.94),t+length);
  overtone.type='sine';overtone.frequency.value=frequency*1.5;overtoneGain.gain.value=.11;overtone.connect(overtoneGain);overtoneGain.connect(filter);
  filter.type='lowpass';filter.frequency.value=800;filter.Q.value=.35;
  gain.gain.setValueAtTime(.00001,t);gain.gain.exponentialRampToValueAtTime(hover?.085:page?.12:.13,page?t+.055:t+.018);gain.gain.exponentialRampToValueAtTime(.00001,t+length);
  osc.connect(filter);filter.connect(gain);gain.connect(master);const voice={gain,osc,overtone};voices.add(voice);counts[kind]++;
  osc.onended=()=>{voices.delete(voice);for(const n of [osc,overtone,overtoneGain,gain,filter])try{n.disconnect();}catch{}};
  osc.start(t);overtone.start(t);osc.stop(t+length+.03);overtone.stop(t+length+.03);
 }
 function chirp(){const now=performance.now();if(now-lastChirp<360)return;lastChirp=now;tone('link');}
 function pageSound(){cancelHover();const now=performance.now();if(now-lastPage<700)return;lastPage=now;tone('page');}
 function queueHover(target){
  if(!target||!enabled||!context||context.state!=='running'||document.hidden||performance.now()<suppressUntil)return;
  if(target===hoverTarget)return;cancelHover();hoverTarget=target;
  hoverTimer=setTimeout(()=>{hoverTimer=0;if(hoverTarget!==target||!target.isConnected||target.closest('[inert]')||performance.now()<suppressUntil)return;const now=performance.now();if(now-lastHover<180||now-lastChirp<180)return;lastHover=now;tone('hover');},65);
 }
 async function enable(on){enabled=Boolean(on)&&Boolean(AudioClass);if(!enabled){save('mdc-sound-enabled','off');silence();display();return false;}const ok=await unlock();enabled=enabled&&ok;save('mdc-sound-enabled',enabled?'on':'off');display();if(enabled)tone('enable');return enabled;}
 toggle.addEventListener('click',()=>void enable(!enabled));
 slider?.addEventListener('input',()=>{volume=Number(slider.value)/100;save('mdc-sound-volume',String(volume));display();});
 document.addEventListener('pointerdown',()=>{keyboard=false;cancelHover();if(enabled)void unlock();},{passive:true});
 document.addEventListener('keydown',ev=>{keyboard=['Tab','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(ev.key);if(enabled)void unlock();});
 document.addEventListener('pointerover',ev=>{if(ev.pointerType==='touch'||!fine.matches)return;const target=hoverItem(ev.target);if(target&&target!==hoverItem(ev.relatedTarget))queueHover(target);},{passive:true});
 document.addEventListener('pointerout',ev=>{if(hoverTarget&&!hoverTarget.contains(ev.relatedTarget))cancelHover();},{passive:true});
 document.addEventListener('focusin',ev=>{if(keyboard)queueHover(action(ev.target));});
 document.addEventListener('focusout',cancelHover);
 // Capture precedes the existing geometry/gallery handlers, which stop propagation.
 document.addEventListener('click',ev=>{cancelHover();if(ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey||!action(ev.target)||!enabled)return;if(context?.state==='running')chirp();else void unlock().then(ok=>{if(ok&&enabled)chirp();});},true);
 document.addEventListener('scroll',()=>{cancelHover();suppressUntil=performance.now()+180;},{capture:true,passive:true});
 window.addEventListener('mdc:before-content-change',()=>{cancelHover();keyboard=false;suppressUntil=performance.now()+180;});
 fine.addEventListener('change',cancelHover);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();});window.addEventListener('pagehide',silence);
 window.MDCSound={enable,get enabled(){return enabled;},get volume(){return volume;},get ready(){return context?.state==='running';},get counts(){return {...counts};},get activeVoices(){return voices.size;},page:pageSound,setMusic(on){duck=Boolean(on);display();}};display();
})();
