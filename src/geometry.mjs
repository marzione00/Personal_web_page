import fs from 'node:fs';
import {cyberNetworkMarkup,cyberNetworkExplanation} from './cyber-network.mjs';
import path from 'node:path';
import {escapeHtml as e,safeExternal} from './safety.mjs';
export function loadGeometry(root){
 const items=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));
 for(const g of items){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(g.id))throw Error('Identificativo geometria non valido');
  const text=fs.readFileSync(path.join(root,'content/markdown/geometrie',g.id+'.md'),'utf8');const parts={};let key=null;
  for(const line of text.replace(/\r\n/g,'\n').split('\n')){const m=line.match(/^## ([a-z]+)\s*$/);if(m){key=m[1];if(Object.hasOwn(parts,key))throw Error('Campo geometria duplicato: '+key);parts[key]=[];}else if(key)parts[key].push(line);}
  for(const k of ['titolo','tema','formula','spiegazione','limiti','fonti','osservazione','lettura','legenda']){g[k]=(parts[k]||[]).join('\n').trim();if(!g[k]||g[k].length>6000)throw Error('Campo geometria mancante o troppo lungo: '+g.id+'/'+k);}
  geometryLegendGroups(g);
 }
 return {items,byId:Object.fromEntries(items.map(g=>[g.id,g]))};
}
const legendColours={mint:['Verde','Green'],blue:['Azzurro','Blue'],amber:['Ambra','Amber'],pale:['Chiaro','Pale'],dark:['Scuro','Dark'],warm:['Tonalità calda','Warm tone']};
export function geometryLegendGroups(g){
 const ids=new Set([g.id,...(g.views||[]).map(v=>v.id)]),groups=new Map([[g.id,[]]]);let current=g.id;
 for(const line of g.legenda.split('\n').map(s=>s.trim()).filter(Boolean)){
  const heading=line.match(/^### ([a-z-]+)$/);
  if(heading){current=heading[1];if(!ids.has(current)||groups.has(current))throw Error('Vista legenda non valida: '+g.id+'/'+current);groups.set(current,[]);continue;}
  const entry=line.match(/^(\w+) \| (.+)$/);
  if(!entry||!Object.hasOwn(legendColours,entry[1]))throw Error('Voce legenda non valida: '+g.id);
  groups.get(current).push({colour:entry[1],text:entry[2]});
 }
 for(const entries of groups.values())if(!entries.length||entries.length>5)throw Error('Legenda vuota o troppo lunga: '+g.id);
 return [...groups].map(([id,entries])=>({ids:id===g.id?[...ids].filter(v=>v===g.id||!groups.has(v)):[id],entries}));
}
function geometryLegend(g,level,language){
 return `<section class="geometry-legend"><h${level}>${language==='en'?'Figure key':'Legenda della figura'}</h${level}>${geometryLegendGroups(g).map((group,i)=>`<ul data-geo-legend="${group.ids.join(' ')}"${i?' hidden':''}>${group.entries.map(({colour,text})=>`<li><i class="geometry-swatch swatch-${colour}" aria-hidden="true"></i><span><b>${legendColours[colour][language==='en'?1:0]}</b> — ${e(text)}</span></li>`).join('')}</ul>`).join('')}</section>`;
}
const expandIcon='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9"/></svg>';
export function geometryMarkup(data,key,extra=''){
 const g=data.geometry.byId[key];if(!g)throw Error('Geometria non configurata: '+key);
 return `<div class="geometry ${e(extra)}" data-geometry="${g.id}"><a class="geometry-open" data-geometry-open="${g.id}"${g.carbonLattice||g.id==='schwarzite-neck'?' data-carbon-lattice':''}${g.carbonLattice||g.id==='schwarzite-neck'||g.ambientMotion?' data-geometry-ambient':''} data-scene="geometry/${e(g.runtimeScene||g.scene)}" data-scene-sha256="${e(g.sceneSha256)}" href="geometrie.html#${g.id}" aria-label="Esplora ${e(g.titolo)}: modello, formula e spiegazione"><img src="geometry/${e(g.file)}" alt="${e(g.titolo)}" width="800" height="640" loading="lazy" decoding="async"><span class="geometry-affordance" aria-hidden="true">${expandIcon}</span></a></div>`;
}
function sourceLinks(source){
 return source.split('\n').map(line=>{const m=line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);if(!m)return`<p>${e(line)}</p>`;
 const url=safeExternal(m[2])||(/^[a-z0-9-]+\.html(?:#[a-z0-9-]+)?$/.test(m[2])?m[2]:null);return url?`<p><a href="${e(url)}"${url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${e(m[1])} ↗</a></p>`:`<p>${e(line)}</p>`;
 }).join('');
}
export function geometryInfo(g,{atlas=false,language='it'}={}){
 const level=atlas?4:3,experiment={'bloch-sphere':'bloch','interference':'waves','decision-surface':'decision'}[g.id];
 return `<div class="geometry-explanation"${atlas?' data-geometry-detail-source="'+e(g.id)+'"':''}><p class="label">${e(g.tema)}</p>${atlas?'':`<h2 data-geo-info-title>${e(g.titolo)}</h2><p>${e(g.spiegazione)}</p>`}${g.views?`<div class="geometry-presets" data-geo-presets hidden role="group" aria-label="${language==='en'?'Geometry views':'Viste della geometria'}">${g.views.map((v,i)=>`<button type="button" data-geo-preset="${e(v.id)}" data-scene="geometry/${e(v.runtimeScene||v.scene)}" data-scene-sha256="${e(v.sceneSha256)}" aria-pressed="${i===0}">${e(v.label[language])}</button>`).join('')}</div>`:''}<h${level}>Osserva la figura</h${level}><p class="geometry-observation">${e(g.osservazione)}</p>${geometryLegend(g,level,language)}<h${level}>Formula o costruzione</h${level}><pre class="geometry-formula" role="math" aria-label="${e(g.lettura||g.formula)}">${e(g.formula)}</pre>${g.lettura?`<details class="geometry-verbal"><summary>Lettura della relazione</summary><p>${e(g.lettura)}</p></details>`:''}<h${level}>Come leggere il modello</h${level}><p>${e(g.limiti)}</p>${experiment?`<a class="text-link" href="esperimenti.html#${experiment}">Apri l’esperimento ↗</a>`:''}<div class="geometry-sources">${sourceLinks(g.fonti)}</div></div>`;
}
export function geometryTemplates(data,body){
 const ids=[...new Set([...body.matchAll(/data-geometry="([a-z-]+)"/g)].map(m=>m[1]))];
 return ids.filter(id=>!body.includes('data-geometry-detail-source="'+id+'"')).map(id=>`<template data-geometry-info="${id}">${geometryInfo(data.geometry.byId[id],{language:data.language})}</template>`).join('');
}
export function geometryDialog(){return `<dialog id="geometry-dialog" class="geometry-dialog" aria-labelledby="geometry-title"><div class="geometry-dialog-top"><h2 id="geometry-title">Esplora il modello</h2><button type="button" data-geo-close aria-label="Chiudi il visualizzatore">×</button></div><div class="geometry-dialog-grid"><div class="geometry-interaction"><div class="geometry-stage" id="geometry-stage" tabindex="0" aria-label="Modello geometrico: trascina per ruotare, usa le frecce o i pulsanti per orientare e ingrandire."><img alt="" width="800" height="640" data-geo-fallback></div><p class="geometry-status" data-geo-status role="status">Il modello si carica all’apertura.</p><div class="geometry-controls" role="group" aria-label="Controlli del modello"><button type="button" data-geo-left aria-label="Ruota a sinistra">←</button><button type="button" data-geo-right aria-label="Ruota a destra">→</button><button type="button" data-geo-up aria-label="Inclina verso l’alto">↑</button><button type="button" data-geo-down aria-label="Inclina verso il basso">↓</button><button type="button" data-geo-in aria-label="Ingrandisci">+</button><button type="button" data-geo-out aria-label="Riduci">−</button><button type="button" data-geo-view="front">Frontale</button><button type="button" data-geo-view="side">Laterale</button><button type="button" data-geo-view="top">Dall’alto</button><button type="button" data-geo-reset>Ripristina</button><button type="button" data-geo-spin aria-pressed="false">Avvia rotazione</button></div><div class="geometry-display"><label>Visualizzazione<select data-geo-style><option value="glow">Luminosa</option><option value="surface">Superficie</option><option value="wire">Maglia triangolare</option></select></label><button type="button" data-geo-expand aria-pressed="false">Vista immersiva</button></div><p class="geometry-style-help" data-geo-style-help></p><p class="geometry-help">Trascina o usa le frecce per orientare; + e − regolano lo zoom. Per lo zoom con la rotella tieni premuto Ctrl o ⌘. Esc chiude la finestra.</p><button type="button" class="geometry-motion" data-geo-motion aria-pressed="false">Disattiva le animazioni automatiche</button></div><div class="geometry-detail" data-geo-detail></div></div></dialog>`;}
export function geometryAtlas(data){
 const groups=[['sicurezza-xai','Sicurezza e interpretabilità'],['quantum','Quantum e post-quantum computing'],['quantitativa','Metodi quantitativi'],['carbonio','Carbonio, superfici e topologia'],['geometria','Geometria e frattali']];
 return `<div class="shell page-body geometry-atlas"><nav class="atlas-index" aria-label="Argomenti dell’atlante">${groups.map(([family,title])=>`<a href="geometrie.html#famiglia-${family}">${title}</a>`).join('')}</nav><p class="atlas-intro">Le figure sono raccolte per argomento affinché, passando da una superficie a un grafo o a una rappresentazione probabilistica, tu possa confrontare il modo in cui la geometria rende leggibili relazioni differenti; aprendo ciascuna scheda trovi una traccia di osservazione, la formula e i limiti entro i quali interpretare il modello.</p><p class="actions"><a class="button" href="esperimenti.html">${data.language==='en'?'Three interactive experiments':'Tre esperimenti interattivi'} ↗</a></p>${groups.map(([family,title])=>`<section class="atlas-family" id="famiglia-${family}"><h2>${title}</h2><div class="atlas-grid">${family==='sicurezza-xai'?`<article class="atlas-card cyber-atlas-card" id="cyber-network">${cyberNetworkMarkup(data)}<div class="atlas-card-copy"><h3>${e(data.cyberNetwork.copy.titolo)}</h3><details><summary>${data.language==='en'?'Graph theory and cyber-attacks':'Teoria dei grafi e cyber-attacchi'}</summary>${cyberNetworkExplanation(data)}</details></div></article>`:''}${data.geometry.items.filter(g=>g.family===family).map(g=>`<article class="atlas-card" id="${g.id}">${geometryMarkup(data,g.id)}<div class="atlas-card-copy"><h3>${e(g.titolo)}</h3><p>${e(g.spiegazione)}</p><details><summary>Formula, descrizione e fonti</summary>${geometryInfo(g,{atlas:true,language:data.language})}</details></div></article>`).join('')}</div></section>`).join('')}</div>`;
}

export function carbonGallery(data,ids,{heading='',intro=''}={}){
 const en=data.language==='en';
 return `<div class="carbon-collection">${heading?`<div class="section-head"><div><span class="label">${en?'Carbon, geometry, research':'Carbonio, geometria, ricerca'}</span><h2>${e(heading)}</h2>${intro?`<p class="muted">${e(intro)}</p>`:''}</div><a class="text-link" href="geometrie.html#famiglia-carbonio">${en?'Explore the atlas':'Esplora l’atlante'} ↗</a></div>`:''}<div class="carbon-grid">${ids.map(id=>{const g=data.geometry.byId[id];return `<article class="carbon-card">${geometryMarkup(data,id)}<div class="carbon-card-copy"><h3>${e(g.titolo)}</h3><p>${e(g.spiegazione)}</p><a class="text-link" href="geometrie.html#${e(id)}">${en?'Formula and scientific context':'Formula e contesto scientifico'} ↗</a></div></article>`;}).join('')}</div></div>`;
}
