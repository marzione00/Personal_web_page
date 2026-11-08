import fs from 'node:fs';
import path from 'node:path';
import {escapeHtml as e,safeExternal,inlineMarkdown} from './safety.mjs';
export function loadGeometry(root){
 const items=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));
 for(const g of items){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(g.id))throw Error('Identificativo geometria non valido');
  const text=fs.readFileSync(path.join(root,'content/markdown/geometrie',g.id+'.md'),'utf8');const parts={};let key=null;
  for(const line of text.replace(/\r\n/g,'\n').split('\n')){const m=line.match(/^## ([a-z]+)\s*$/);if(m){key=m[1];if(Object.hasOwn(parts,key))throw Error('Campo geometria duplicato: '+key);parts[key]=[];}else if(key)parts[key].push(line);}
  for(const k of ['titolo','tema','formula','spiegazione','limiti','fonti']){g[k]=(parts[k]||[]).join('\n').trim();if(!g[k]||g[k].length>6000)throw Error('Campo geometria mancante o troppo lungo: '+g.id+'/'+k);}
 }
 return {items,byId:Object.fromEntries(items.map(g=>[g.id,g]))};
}
const expandIcon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/></svg>';
export function geometryMarkup(data,key,extra=''){
 const g=data.geometry.byId[key];if(!g)throw Error('Geometria non configurata: '+key);
 return `<div class="geometry ${e(extra)}" data-geometry="${g.id}"><a class="geometry-open" data-geometry-open="${g.id}" data-scene="geometry/${e(g.scene)}" href="geometrie.html#${g.id}" aria-label="Esplora ${e(g.titolo)}: modello, formula e spiegazione"><img src="geometry/${e(g.file)}" alt="${e(g.titolo)}" width="800" height="640" loading="lazy" decoding="async"><span class="geometry-affordance" aria-hidden="true">${expandIcon}</span></a></div>`;
}
function sourceLinks(source){
 return source.split('\n').map(line=>{const m=line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(!m)return`<p>${e(line)}</p>`;
 const url=safeExternal(m[2])||(/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(m[2])?m[2]:null);return url?`<p><a href="${e(url)}"${url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${e(m[1])} ↗</a></p>`:`<p>${e(line)}</p>`;
 }).join('');
}
export function geometryInfo(g){
 return `<div class="geometry-explanation"><p class="label">${e(g.tema)}</p><h2 data-geo-info-title>${e(g.titolo)}</h2><p>${e(g.spiegazione)}</p><h3>Formula o costruzione</h3><pre class="geometry-formula" role="math" aria-label="${e(g.formula)}">${e(g.formula)}</pre><h3>Come leggere il modello</h3><p>${e(g.limiti)}</p><div class="geometry-sources">${sourceLinks(g.fonti)}</div></div>`;
}
export function geometryTemplates(data,body){
 const ids=[...new Set([...body.matchAll(/data-geometry="([a-z-]+)"/g)].map(m=>m[1]))];
 return ids.map(id=>`<template data-geometry-info="${id}">${geometryInfo(data.geometry.byId[id])}</template>`).join('');
}
export function geometryDialog(){return `<dialog id="geometry-dialog" class="geometry-dialog" aria-labelledby="geometry-title"><div class="geometry-dialog-top"><h2 id="geometry-title">Esplora il modello</h2><button type="button" data-geo-close aria-label="Chiudi il visualizzatore">×</button></div><div class="geometry-dialog-grid"><div class="geometry-interaction"><div class="geometry-stage" id="geometry-stage" tabindex="0" aria-label="Modello tridimensionale: trascina per ruotare, usa le frecce o i pulsanti per orientare e ingrandire."><img alt="" width="800" height="640" data-geo-fallback></div><p class="geometry-status" data-geo-status role="status">Il modello si carica all’apertura.</p><div class="geometry-controls" aria-label="Controlli del modello"><button type="button" data-geo-left aria-label="Ruota a sinistra">←</button><button type="button" data-geo-right aria-label="Ruota a destra">→</button><button type="button" data-geo-in aria-label="Ingrandisci">+</button><button type="button" data-geo-out aria-label="Riduci">−</button><button type="button" data-geo-reset>Ripristina</button><button type="button" data-geo-spin aria-pressed="false">Ruota</button></div><p class="geometry-help">Trascina per orientare. Usa + e − per lo zoom; Esc chiude la finestra. La rotazione riguarda il punto di vista.</p><button type="button" class="geometry-motion" data-geo-motion aria-pressed="false">Disattiva le animazioni al passaggio del puntatore</button></div><div class="geometry-detail" data-geo-detail></div></div></dialog>`;}
export function geometryAtlas(data){
 const groups=[['sicurezza-xai','Sicurezza e interpretabilità'],['quantum','Quantum e post-quantum computing'],['quantitativa','Metodi quantitativi'],['carbonio','Carbonio, superfici e topologia'],['geometria','Geometria e frattali']];
 return `<div class="shell page-body geometry-atlas"><p class="atlas-intro">Le figure del sito raccolte per argomento. Passa il puntatore per orientarle, oppure apri una scheda per esplorare il modello e leggerne formula, significato e limiti. I testi restano disponibili anche senza 3D.</p>${groups.map(([family,title])=>`<section class="atlas-family"><h2>${title}</h2><div class="atlas-grid">${data.geometry.items.filter(g=>g.family===family).map(g=>`<article class="atlas-card" id="${g.id}">${geometryMarkup(data,g.id)}<div class="atlas-card-copy"><h3>${e(g.titolo)}</h3><p>${e(g.spiegazione)}</p><details><summary>Formula, descrizione e fonti</summary>${geometryInfo(g)}</details></div></article>`).join('')}</div></section>`).join('')}</div>`;
}
