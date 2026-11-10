/* One opt-in player survives internal page changes. No media request before a
 * deliberate start. The audio graph smooths volume changes and reading focus. */
(() => {
 'use strict';
 const play=document.querySelector('[data-music-play]');if(!play)return;
 const en=document.documentElement.lang==='en',reset=document.querySelector('[data-music-reset]'),slider=document.querySelector('[data-music-volume]'),volumeOutput=document.querySelector('[data-music-volume-value]'),clock=document.querySelector('[data-music-time]'),loop=document.querySelector('[data-music-loop]'),status=document.querySelector('[data-music-status]');
 const key='manifold-music-position-v2';
 let audio=null,ctx=null,gain=null,filter=null,loading=false,wantsPlay=false,saved=0,lastSave=0,pauseTimer=0,volume=.18,generation=0;
 try{saved=Number(sessionStorage.getItem(key))||0;volume=Number(localStorage.getItem('manifold-music-volume')??.18);loop.checked=localStorage.getItem('manifold-music-loop')!=='off';}catch{}
 if(!Number.isFinite(saved)||saved<0||saved>=269.5)saved=0;
 volume=Number.isFinite(volume)?Math.max(0,Math.min(.6,volume)):.18;slider.value=String(Math.round(volume*100));volumeOutput.textContent=slider.value+'%';
 const time=v=>`${Math.floor(v/60)}:${String(Math.floor(v%60)).padStart(2,'0')}`;
 const position=()=>audio&&Number.isFinite(audio.currentTime)?audio.currentTime:saved;
 function save(){try{sessionStorage.setItem(key,String(position()));}catch{}}
 function label(){const running=Boolean(audio&&!audio.paused);play.setAttribute('aria-pressed',String(running));play.textContent=running?(en?'Pause':'Pausa'):(position()>1?(en?'Resume':'Riprendi'):(en?'Play':'Ascolta'));clock.textContent=time(position())+' / 4:30';}
 const reading=()=>document.body.dataset.readingFocus==='true'||document.body.classList.contains('reading-mode');
 function ramp(target,duration=.5){if(ctx&&gain){const t=ctx.currentTime;gain.gain.cancelScheduledValues(t);gain.gain.setTargetAtTime(target,t,duration/3);}else if(audio)audio.volume=target;}
 function atmosphere(){if(filter)filter.frequency.setTargetAtTime(reading()?750:2200,ctx.currentTime,.8);if(audio&&!audio.paused&&!pauseTimer)ramp(volume*(reading()?.72:1),1.2);}
 function prepare(){
  if(audio)return;
  audio=new Audio();audio.preload='none';audio.loop=loop.checked;audio.volume=volume;
  if(window.ManifoldEmbeddedMusic){const raw=atob(window.ManifoldEmbeddedMusic),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);audio.src=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));}
  else audio.src=(document.body.dataset.resourceBase||'')+'audio/descending-fields.mp3';
  const AudioClass=window.AudioContext||window.webkitAudioContext;
  if(AudioClass)try{ctx=new AudioClass();const src=ctx.createMediaElementSource(audio);gain=ctx.createGain();filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=reading()?750:2200;filter.Q.value=.5;gain.gain.value=0;src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);audio.volume=1;}catch{ctx=null;gain=null;filter=null;audio.volume=volume;}
  audio.addEventListener('loadedmetadata',()=>{if(saved>0&&saved<audio.duration-1)audio.currentTime=saved;});
  audio.addEventListener('timeupdate',()=>{label();if(performance.now()-lastSave>2000){save();lastSave=performance.now();}});
  audio.addEventListener('play',()=>{label();window.MDCSound?.setMusic(true);});
  audio.addEventListener('pause',()=>{save();label();window.MDCSound?.setMusic(false);});
  audio.addEventListener('ended',()=>{saved=0;save();label();window.MDCSound?.setMusic(false);});
  audio.addEventListener('error',()=>{loading=false;status.textContent=en?'Audio unavailable. Try again later.':'Audio non disponibile. Riprova più tardi.';label();});
 }
 function pause(immediate=false){wantsPlay=false;generation++;loading=false;clearTimeout(pauseTimer);pauseTimer=0;if(!audio)return;const finish=()=>{audio.pause();pauseTimer=0;status.textContent=en?'Paused. Your listening position is saved.':'In pausa. Il punto di ascolto è salvato.';};if(immediate)finish();else{ramp(0,.35);pauseTimer=setTimeout(finish,420);}}
 async function start(){
  wantsPlay=true;clearTimeout(pauseTimer);pauseTimer=0;if(loading)return false;if(audio&&!audio.paused){atmosphere();return true;}
  loading=true;const token=++generation;status.textContent=en?'Loading the soundtrack…':'Caricamento della colonna sonora…';
  try{prepare();const resume=ctx&&ctx.state!=='running'?ctx.resume():Promise.resolve();const playing=audio.play();await Promise.all([resume,playing]);if(token!==generation){if(!wantsPlay)audio.pause();return false;}atmosphere();status.textContent=en?'Playing · Descending Fields. Softer during reading; continuous within this language.':'In riproduzione · Descending Fields. Si attenua durante la lettura e prosegue fra le pagine della stessa lingua.';return true;}
  catch{status.textContent=en?'Press Play to retry playback.':'Premi Ascolta per riprovare la riproduzione.';return false;}
  finally{if(token===generation)loading=false;label();}
 }
 play.addEventListener('click',()=>{if(loading||audio&&!audio.paused)pause();else void start();});
 slider.addEventListener('input',()=>{volume=Number(slider.value)/100;volumeOutput.textContent=slider.value+'%';try{localStorage.setItem('manifold-music-volume',String(volume));}catch{}atmosphere();});
 loop.addEventListener('change',()=>{if(audio)audio.loop=loop.checked;try{localStorage.setItem('manifold-music-loop',loop.checked?'on':'off');}catch{}});
 reset.addEventListener('click',()=>{saved=0;if(audio&&audio.readyState>0)audio.currentTime=0;save();label();});
 new MutationObserver(atmosphere).observe(document.body,{attributes:true,attributeFilter:['data-reading-focus','class']});
 window.addEventListener('pagehide',()=>{save();pause(true);});document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 label();if(saved>1)status.textContent=en?'Press Resume to continue from your previous position.':'Premi Riprendi per continuare dal punto di ascolto precedente.';
 window.ManifoldMusic={start,pause,get loaded(){return Boolean(audio);},get playing(){return Boolean(audio&&!audio.paused);},get position(){return position();},get volume(){return volume;},get reading(){return reading();},get duration(){return audio?.duration||270;}};
})();
