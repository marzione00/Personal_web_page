/* Shared local index, loaded only on request. The complete search page works without this enhancement. */
(() => {
 'use strict';
 const dialog=document.getElementById('search-dialog'),input=document.getElementById('dialog-search'),list=document.getElementById('dialog-results'),count=dialog?.querySelector('[data-search-count]');
 if(!dialog||!input||!list)return;
 const en=document.documentElement.lang==='en',norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase(en?'en':'it');
 let rows=null,pending=null;
 function render(){if(!rows)return;const q=norm(input.value).trim(),tokens=q.split(/\s+/).filter(Boolean);
  const matches=rows.map((r,i)=>{const title=norm(r.title),full=norm(r.title+' '+r.context+' '+r.keywords);return {r,i,score:tokens.every(w=>full.includes(w))?(title===q?100:title.startsWith(q)&&q?70:tokens.every(w=>title.includes(w))?50:10):0};}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.i-b.i);
  list.replaceChildren();const shown=matches.slice(0,q?80:12);
  for(const {r} of shown){const a=document.createElement('a'),wrap=document.createElement('div'),kind=document.createElement('span'),title=document.createElement('strong'),p=document.createElement('p');a.className='search-row';a.href=r.url;kind.className='meta';kind.textContent=r.kind;title.textContent=r.title;p.textContent=r.context;wrap.append(kind,title);if(r.context)wrap.append(p);a.append(wrap);list.append(a);}
  count.textContent=q?`${matches.length} ${en?(matches.length===1?'result':'results'):(matches.length===1?'risultato':'risultati')}${matches.length>80?(en?' · first 80 shown':' · primi 80 mostrati'):''}`:(en?'Explore or type a term':'Esplora oppure scrivi un termine');
  if(!matches.length){const p=document.createElement('p');p.className='empty';p.textContent=en?'No results. Try another term.':'Nessun risultato. Prova un altro termine.';list.append(p);}
 }
 async function load(){if(rows){render();return;}if(pending)return pending;count.textContent=en?'Loading search…':'Caricamento della ricerca…';
  pending=(async()=>{try{let result=window.MDCSearchIndexes?.[en?'en':'it'];if(!result){const src=dialog.dataset.searchIndex;if(!/^assets\/search-(?:it|en)-[a-f0-9]{12}\.json$/.test(src||''))throw Error('Index path');const response=await fetch((document.body.dataset.resourceBase||'')+src,{credentials:'omit',redirect:'error',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Index response');const text=await response.text();if(text.length>600000)throw Error('Index size');result=JSON.parse(text);}
   if(!Array.isArray(result)||result.length>1500)throw Error('Index entries');rows=result.filter(r=>/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(r.url)&&['title','kind'].every(k=>typeof r[k]==='string')&&String(r.context||'').length<6000).map(r=>({...r,context:r.context||'',keywords:r.keywords||''}));render();
  }catch{count.textContent=en?'Search could not load. Open the complete search page.':'Caricamento non riuscito. Apri la pagina di ricerca completa.';}finally{pending=null;}})();return pending;
 }
 input.addEventListener('input',()=>rows?render():load());
 new MutationObserver(()=>{if(dialog.open)load();}).observe(dialog,{attributes:true,attributeFilter:['open']});
})();
