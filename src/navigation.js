/* Same-language progressive navigation. The document owns audio and dialogs; only
 * page content and its inert geometry templates change. Real links remain the fallback. */
(() => {
 'use strict';
 const main=document.getElementById('main');if(!main)return;
 window.MDCPageTransition={run(update){window.dispatchEvent(new Event('mdc:before-content-change'));update();window.MDCCinema?.arrive();window.MDCSound?.page();return true;}};
 if(document.body.dataset.portable==='true'||!window.fetch||!window.DOMParser||!history.pushState)return;
 const base=new URL('./',location.href),lang=document.documentElement.lang;
 const bundle=document.querySelector('script[src][integrity]')?.getAttribute('integrity'),styleBundle=document.querySelector('link[rel="stylesheet"][integrity]')?.getAttribute('integrity');
 let controller=null,generation=0,displayed=location.href,scrollTimer=0;
 const stats={visits:0,aborted:0,fallbacks:0};
 const status=document.createElement('p');status.className='visually-hidden';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.append(status);
 const pageKey=url=>url.pathname.replace(/\/$/,'/index.html');
 function eligible(url){return url.origin===base.origin&&!url.username&&!url.password&&!url.search&&new URL('./',url).pathname===base.pathname&&/^(?:[a-z0-9-]+\.html)?$/.test(url.pathname.slice(base.pathname.length));}
 function remember(){if(location.href!==displayed)return;history.replaceState({...history.state,mdc:{url:displayed,x:scrollX,y:scrollY}},'',location.href);}
 if('scrollRestoration' in history)history.scrollRestoration='manual';remember();
 addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(remember,120);},{passive:true});
 function cancel(){generation++;controller?.abort();controller=null;main.removeAttribute('aria-busy');status.textContent='';}
 async function retrieve(url,signal){
  const response=await fetch(url.href,{signal,credentials:'same-origin',redirect:'error',headers:{Accept:'text/html'}});
  if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Page response');
  const reader=response.body?.getReader();if(!reader)throw Error('Page stream');
  const chunks=[];let total=0;try{while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>2*1024*1024){await reader.cancel();throw Error('Page too large');}chunks.push(value);}}finally{reader.releaseLock();}
  const bytes=new Uint8Array(total);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  const doc=new DOMParser().parseFromString(new TextDecoder().decode(bytes),'text/html');
  if(doc.documentElement.lang!==lang||!doc.getElementById('main')||!doc.querySelector('[data-geometry-bank]')||!bundle||doc.querySelector('script[src][integrity]')?.getAttribute('integrity')!==bundle||doc.querySelector('link[rel="stylesheet"][integrity]')?.getAttribute('integrity')!==styleBundle)throw Error('Different site build');
  // Never execute fetched scripts or copy policy/base elements into the live document.
  doc.querySelectorAll('script,base').forEach(n=>n.remove());return doc;
 }
 function position(url,saved){
  let target=null;if(url.hash)try{target=document.getElementById(decodeURIComponent(url.hash.slice(1)));}catch{}
  if(target){for(let p=target.parentElement;p&&p!==main;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}
  const focus=target||main.querySelector('h1')||main;focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});
  if(saved)window.scrollTo({left:saved.x||0,top:saved.y||0,behavior:'instant'});else if(target)target.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,left:0,behavior:'instant'});
 }
 function commit(doc,url,pop,saved){
  window.dispatchEvent(new Event('mdc:before-content-change'));
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  if(!pop){remember();history.pushState({mdc:{url:url.href,x:0,y:0}},'',url.href);}displayed=url.href;
  main.replaceChildren(...Array.from(doc.getElementById('main').childNodes).map(n=>document.importNode(n,true)));
  document.querySelector('[data-geometry-bank]').replaceChildren(...Array.from(doc.querySelector('[data-geometry-bank]').childNodes).map(n=>document.importNode(n,true)));
  for(const key of ['page','ambientContext'])document.body.dataset[key]=doc.body.dataset[key]||'';
  document.querySelectorAll('#primary-nav a').forEach((a,i)=>{const next=doc.querySelectorAll('#primary-nav a')[i];if(next?.hasAttribute('aria-current'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('[data-language]').forEach(a=>{const next=doc.querySelector('[data-language="'+a.dataset.language+'"]');if(next){for(const attr of ['href','data-page'])if(next.hasAttribute(attr))a.setAttribute(attr,next.getAttribute(attr));}});
  document.querySelector('#primary-nav')?.classList.remove('is-open');document.querySelector('[data-menu]')?.setAttribute('aria-expanded','false');
  document.title=doc.title;
  const head='meta[name="description"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],link[rel="alternate"]';
  document.head.querySelectorAll(head+',script[type="application/ld+json"]').forEach(n=>n.remove());
  doc.head.querySelectorAll(head).forEach(n=>document.head.append(document.importNode(n,true)));
  main.removeAttribute('aria-busy');window.dispatchEvent(new CustomEvent('mdc:content-change',{detail:{positionManaged:true}}));position(url,saved);
  if(!pop&&!url.hash)window.MDCCinema?.arrive();window.MDCSound?.page();
  status.textContent=doc.title.split(' — ')[0];stats.visits++;
 }
 async function navigate(url,{pop=false,saved=null}={}){
  cancel();const token=generation;controller=new AbortController();const request=controller;main.setAttribute('aria-busy','true');
  status.textContent=lang==='en'?'Opening page…':'Apertura della pagina…';const timeout=setTimeout(()=>request.abort(),10000);
  try{const doc=await retrieve(url,request.signal);if(token!==generation)return;commit(doc,url,pop,saved);}
  catch{if(token!==generation){stats.aborted++;return;}stats.fallbacks++;if(pop)location.reload();else location.assign(url.href);}
  finally{clearTimeout(timeout);if(token===generation){controller=null;main.removeAttribute('aria-busy');}}
 }
 document.addEventListener('click',ev=>{
  if(ev.defaultPrevented||ev.button!==0||ev.ctrlKey||ev.metaKey||ev.shiftKey||ev.altKey)return;
  const a=ev.target.closest?.('a[href]');if(!a||(a.target&&a.target!=='_self')||a.hasAttribute('download')||a.matches('[data-language],[data-geometry-open],[data-travel-photo],[data-app-launch]'))return;
  let url;try{url=new URL(a.href,location.href);}catch{return;}if(!eligible(url))return;
  if(pageKey(url)===pageKey(new URL(displayed))){cancel();return;}
  ev.preventDefault();void navigate(url);
 });
 addEventListener('popstate',ev=>{const url=new URL(location.href);if(!eligible(url)){location.reload();return;}if(pageKey(url)===pageKey(new URL(displayed))){cancel();displayed=url.href;position(url,ev.state?.mdc);return;}void navigate(url,{pop:true,saved:ev.state?.mdc});});
 addEventListener('hashchange',()=>{if(pageKey(new URL(location.href))===pageKey(new URL(displayed))){cancel();displayed=location.href;}});
 addEventListener('pagehide',cancel);
 window.MDCNavigation={get stats(){return {...stats};},get pending(){return Boolean(controller);}};
})();
