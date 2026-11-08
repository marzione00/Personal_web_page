(() => {
  'use strict';
  document.body.classList.add('js');
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  // No innerHTML, eval, dynamic imports, remote requests or content-to-code conversion.
  const readPref=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
  const writePref=(key,value)=>{try{localStorage.setItem(key,value);}catch{ /* Optional preference only */ }};
  const reading=$('[data-reading]');
  function setReading(on){document.body.classList.toggle('reading-mode',on);reading?.setAttribute('aria-pressed',String(on));}
  setReading(readPref('mdc-reading')==='on');
  reading?.addEventListener('click',()=>{const on=!document.body.classList.contains('reading-mode');setReading(on);writePref('mdc-reading',on?'on':'off');});
  const toggle=$('[data-menu]'),nav=$('#primary-nav');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav?.classList.toggle('is-open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open')){nav.classList.remove('is-open');toggle?.setAttribute('aria-expanded','false');toggle?.focus();}});
  // Progressive filters: all content is present and readable without JavaScript.
  $$('[data-filter-panel]').forEach(panel=>{
    const list=document.getElementById(panel.dataset.target);
    if(!list)return;
    const inputs=$$('input,select',panel),items=$$('[data-item]',list),count=$('[data-count]',panel),empty=$('[data-empty]',list);
    const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it');
    function update(){let visible=0;
      items.forEach(item=>{
        const show=inputs.every(input=>{if(!input.value)return true;if(input.type==='search')return norm(item.textContent).includes(norm(input.value));return item.dataset[input.name]===input.value;});
        item.hidden=!show;if(show)visible++;
      });
      if(count)count.textContent=`${visible} ${visible===1?'risultato':'risultati'}`;
      if(empty)empty.hidden=visible!==0;
    }
    inputs.forEach(input=>input.addEventListener(input.type==='search'?'input':'change',update));
    $('[data-reset]',panel)?.addEventListener('click',()=>{inputs.forEach(x=>x.value='');update();inputs[0]?.focus();});update();
  });
  const dialog=$('#search-dialog'),searchButton=$('[data-open-search]');
  const openSearch=()=>{if(dialog&&typeof dialog.showModal==='function'){dialog.showModal();$('#dialog-search',dialog)?.focus();}};
  searchButton?.addEventListener('click',e=>{if(dialog&&typeof dialog.showModal==='function'){e.preventDefault();openSearch();}});
  $('[data-close-search]')?.addEventListener('click',()=>dialog?.close());
  dialog?.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();dialog.close();}});
  dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog?.addEventListener('close',()=>searchButton?.focus());
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSearch();}});
  // Compatibility for the original preview's hash routes. Only hard-coded targets.
  const legacy={'#/':'index.html','#/didattica':'didattica.html','#/ricerca':'ricerca.html','#/blog':'blog.html','#/cv':'cv.html','#/contatti':'contatti.html'};
  if(legacy[location.hash]&&location.pathname.endsWith('/index.html'))location.replace(legacy[location.hash]);
})();
