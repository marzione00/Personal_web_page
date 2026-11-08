/* MANIFOLD — optional soundtrack, requested only by an explicit Play action.
 * Original file shared by IT/EN. No autoplay; session position survives document navigation.
 */
(() => {
 'use strict';
 const play=document.querySelector('[data-music-play]');if(!play)return;
 const en=document.documentElement.lang==='en',reset=document.querySelector('[data-music-reset]'),slider=document.querySelector('[data-music-volume]'),volumeOutput=document.querySelector('[data-music-volume-value]'),clock=document.querySelector('[data-music-time]'),loop=document.querySelector('[data-music-loop]'),status=document.querySelector('[data-music-status]');
 const key='manifold-music-position-v1';
 let audio=null,ctx=null,gain=null,objectURL=null,loading=false,saved=0,lastSave=0,pauseTimer=0,volume=.18,generation=0;
 try{saved=Number(sessionStorage.getItem(key))||0;volume=Number(localStorage.getItem('manifold-music-volume')??.18);loop.checked=localStorage.getItem('manifold-music-loop')!=='off';}catch{}
 if(!Number.isFinite(saved)||saved<0||saved>=269.5)saved=0;
 volume=Number.isFinite(volume)?Math.max(0,Math.min(.6,volume)):.18;slider.value=String(Math.round(volume*100));volumeOutput.textContent=slider.value+'%';
 const time=v=>`${Math.floor(v/60)}:${String(Math.floor(v%60)).padStart(2,'0')}`;
 const position=()=>audio&&Number.isFinite(audio.currentTime)?audio.currentTime:saved;
 function save(){try{sessionStorage.setItem(key,String(position()));}catch{}}
 function label(){const running=Boolean(audio&&!audio.paused);play.setAttribute('aria-pressed',String(running));play.textContent=running?(en?'Pause':'Pausa'):(position()>1?(en?'Resume':'Riprendi'):(en?'Play':'Ascolta'));clock.textContent=time(position())+' / 4:30';}
 function ramp(target,duration=.4){
  if(ctx&&gain){const t=ctx.currentTime;gain.gain.cancelScheduledValues(t);gain.gain.setValueAtTime(gain.gain.value,t);gain.gain.linearRampToValueAtTime(target,t+duration);}
  else if(audio)audio.volume=target;
 }
 function prepare(){
  if(audio)return;
  audio=new Audio();audio.preload='none';audio.loop=loop.checked;audio.volume=volume;
  if(window.ManifoldEmbeddedMusic){
   const raw=atob(window.ManifoldEmbeddedMusic),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
   objectURL=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));audio.src=objectURL;
  }else audio.src=(document.body.dataset.resourceBase||'')+'audio/local-coordinates.mp3';
  const AudioClass=window.AudioContext||window.webkitAudioContext;
  if(AudioClass)try{ctx=new AudioClass();const src=ctx.createMediaElementSource(audio);gain=ctx.createGain();gain.gain.value=0;src.connect(gain);gain.connect(ctx.destination);audio.volume=1;}catch{ctx=null;gain=null;audio.volume=volume;}
  audio.addEventListener('loadedmetadata',()=>{if(saved>0&&saved<audio.duration-1)audio.currentTime=saved;});
  audio.addEventListener('timeupdate',()=>{label();if(performance.now()-lastSave>2000){save();lastSave=performance.now();}});
  audio.addEventListener('play',()=>{label();window.MDCSound?.setMusic(true);});
  audio.addEventListener('pause',()=>{save();label();window.MDCSound?.setMusic(false);});
  audio.addEventListener('ended',()=>{saved=0;save();label();window.MDCSound?.setMusic(false);});
  audio.addEventListener('error',()=>{loading=false;status.textContent=en?'Audio unavailable. The site remains usable; try again later.':'Audio non disponibile. Il sito resta utilizzabile; riprova più tardi.';label();});
 }
 play.addEventListener('click',async()=>{
  clearTimeout(pauseTimer);generation++;
  if(loading)return;
  if(audio&&!audio.paused){ramp(0,.3);pauseTimer=setTimeout(()=>{audio.pause();status.textContent=en?'Paused. The listening position is saved for this session.':'In pausa. Il punto di ascolto è salvato per questa sessione.';},320);return;}
  loading=true;const token=generation;status.textContent=en?'Loading the soundtrack…':'Caricamento della colonna sonora…';
  try{prepare();if(ctx&&ctx.state!=='running')await ctx.resume();await audio.play();if(token!==generation){audio.pause();return;}ramp(volume,.65);status.textContent=en?'Playing · synthetic ambient score. Music is independent of interface sounds.':'In riproduzione · composizione ambient sintetica. Musica e suoni dell’interfaccia sono indipendenti.';}
  catch{status.textContent=en?'Playback was not allowed. Press Play to retry.':'Riproduzione non consentita. Premi Ascolta per riprovare.';}
  finally{loading=false;label();}
 });
 slider.addEventListener('input',()=>{volume=Number(slider.value)/100;volumeOutput.textContent=slider.value+'%';try{localStorage.setItem('manifold-music-volume',String(volume));}catch{}if(audio&&!audio.paused)ramp(volume,.12);});
 loop.addEventListener('change',()=>{if(audio)audio.loop=loop.checked;try{localStorage.setItem('manifold-music-loop',loop.checked?'on':'off');}catch{}});
 reset.addEventListener('click',()=>{saved=0;if(audio&&audio.readyState>0)audio.currentTime=0;save();label();});
 window.addEventListener('pagehide',()=>{generation++;save();if(audio)audio.pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 label();if(saved>1)status.textContent=en?'The previous listening position is available. Press Resume to continue.':'È disponibile il punto di ascolto precedente. Premi Riprendi per continuare.';
 window.ManifoldMusic={get loaded(){return Boolean(audio);},get playing(){return Boolean(audio&&!audio.paused);},get position(){return position();},get volume(){return volume;},get duration(){return audio?.duration||270;}};
})();
