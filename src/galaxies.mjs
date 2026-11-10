/** Navigation galaxies are procedural illustrations; laboratory URLs belong to the shared registry. */
import fs from 'node:fs';
import path from 'node:path';
import {escapeHtml as e} from './safety.mjs';
import {launchAttributes} from './teaching-apps.mjs';

export function loadGalaxies(root) {
 const file=path.join(root,'content/galaxies.json');
 if(fs.statSync(file).size>24000)throw Error('Galassie: catalogo troppo grande');
 const data=JSON.parse(fs.readFileSync(file,'utf8')),ids=new Set(),themes=new Set();
 const bilingual=v=>v&&['it','en'].every(l=>typeof v[l]==='string'&&v[l].trim()&&v[l].length<600);
 if(data.schemaVersion!==1||!Array.isArray(data.galaxies)||data.galaxies.length>12)throw Error('Galassie: catalogo non valido');
 for(const g of data.galaxies){
  if(!/^[a-z]+(?:-[a-z]+)*$/.test(g.app)||ids.has(g.app)||!['quantum','geostat'].includes(g.theme)||themes.has(g.theme)||!bilingual(g.subtitle)||!bilingual(g.intro)||!Array.isArray(g.routes)||g.routes.length<1||g.routes.length>6)throw Error('Galassie: scheda non valida');
  ids.add(g.app);themes.add(g.theme);const routes=new Set();
  for(const r of g.routes){if(!/^#modulo-(?:[1-7]|M(?:0[1-9]|1[0-6])|T00|P(?:0[1-9]|1[01]))$/.test(r.fragment)||routes.has(r.fragment)||!bilingual(r.title)||!bilingual(r.note))throw Error('Galassie: percorso non valido');routes.add(r.fragment);}
 }
 return data.galaxies;
}

export function galaxiesPage(data) {
 const en=data.language==='en',l=en?'en':'it';
 const entries=(data.galaxies||[]).map(g=>({...g,app:(data.teachingApps||[]).find(a=>a.id===g.app&&a.enabled)})).filter(g=>g.app);
 const image=theme=>`assets/labs/galaxy-${theme}.svg`;
 return `<section class="lab-page shell">
 <div class="lab-heading"><div><a class="lab-back text-link" href="didattica.html">← ${en?'Teaching':'Didattica'}</a><p class="eyebrow">${en?'Laboratories / stellar map':'Laboratori / mappa stellare'}</p><h1>${en?'Galaxies to explore':'Galassie da esplorare'}<span class="dot">.</span></h1></div><p class="lab-lead">${en?'Choose a galaxy, explore its paths and enter the laboratory. Each destination opens an independent environment for study and experimentation.':'Scegli una galassia, esplorane i percorsi ed entra nel laboratorio, dove ogni destinazione apre un ambiente autonomo di studio e sperimentazione.'}</p></div>
 <div class="lab-hub"><div class="lab-console"><span>TOPOLOGICAL MANIFOLDS</span><span>${en?'EXPLORATION MAP':'MAPPA DI ESPLORAZIONE'}</span></div>
 <div class="lab-layout"><fieldset class="lab-chart"><legend class="visually-hidden">${en?'Choose a laboratory galaxy':'Scegli la galassia del laboratorio'}</legend>
 <div class="lab-chart-space"><img class="lab-stars" src="assets/labs/star-field.svg" alt="" width="1000" height="800">
 <svg class="lab-routes-art" viewBox="0 0 700 620" fill="none" aria-hidden="true"><ellipse cx="335" cy="305" rx="286" ry="204" transform="rotate(-26 335 305)"/><ellipse cx="335" cy="305" rx="240" ry="155" transform="rotate(-26 335 305)"/><path d="M201 204C390 172 241 443 493 403"/><path d="M42 305h18m550 0h18M335 48v18m0 478v18"/></svg>
 <p class="lab-map-hint">${en?'Select a galaxy':'Seleziona una galassia'}<span>${en?'Its paths appear in the destination panel.':'I percorsi compaiono nella scheda della destinazione.'}</span></p>
 ${entries.map((g,i)=>`<label class="lab-destination lab-destination-${g.theme}"><input class="lab-choice" type="radio" name="laboratory-galaxy" id="galaxy-${e(g.app.id)}" value="${e(g.app.id)}" data-lab-choice aria-controls="mission-${e(g.app.id)}"${i===0?' checked':''}><span class="lab-disc" aria-hidden="true"><img src="${image(g.theme)}" alt="" width="800" height="800"><span class="lab-reticle"></span></span><span class="lab-destination-label"><span class="lab-coordinate">${en?'GALAXY':'GALASSIA'} / 0${i+1}</span><strong>${e(g.app.title)}</strong><span class="lab-selection">${en?'Selected':'Selezionata'}</span></span></label>`).join('')}
 <p class="lab-chart-footer"><span class="lab-chart-dot" aria-hidden="true"></span>${en?'Choose a destination · explore at your pace':'Scegli una destinazione · esplora con i tuoi tempi'}</p></div></fieldset>
 <div class="lab-missions">${entries.map((g,i)=>`<section class="lab-mission lab-mission-${g.theme}" id="mission-${e(g.app.id)}" aria-labelledby="mission-title-${e(g.app.id)}"><div class="lab-mission-heading"><span class="lab-coordinate">${en?'DESTINATION':'DESTINAZIONE'} / 0${i+1}</span><span class="lab-mission-symbol" aria-hidden="true">✦</span></div><h2 id="mission-title-${e(g.app.id)}">${e(g.app.title)}</h2><p class="lab-subtitle">${e(g.subtitle[l])}</p><p class="lab-intro">${e(g.intro[l])}</p><a class="button primary lab-enter" href="${e(g.app.url)}"${launchAttributes(g.app)}>${en?'Enter the galaxy':'Entra nella galassia'} <span class="lab-arrow" aria-hidden="true"></span></a><p class="lab-language">${en?'Laboratory interface: Italian. Opens in this tab.':'Interfaccia in italiano · apertura nella stessa scheda.'}</p><h3 class="lab-path-heading">${en?'Paths to explore':'Percorsi da esplorare'}</h3><nav class="lab-paths" aria-label="${e(g.app.title)} · ${en?'paths':'percorsi'}">${g.routes.map((r,n)=>`<a href="${e(g.app.url.split('#')[0]+r.fragment)}"${launchAttributes(g.app,g.app.title+' · '+r.title[l])}><span class="lab-path-dot" aria-hidden="true"></span><span><strong>${e(r.title[l])}</strong><small>${e(r.note[l])}</small></span><span class="lab-arrow" aria-hidden="true"></span></a>`).join('')}</nav><a class="lab-source" href="${e(g.app.repository)}" target="_blank" rel="noopener noreferrer">${en?'Source code':'Codice sorgente'} ↗</a></section>`).join('')}</div></div></div>
 <p class="lab-afterword">${en?'Two independent laboratories, connected by the same curiosity. Return to the course materials whenever you want to revisit a definition, a derivation or an assumption.':'Due laboratori autonomi, collegati dalla stessa curiosità, attraverso i quali puoi seguire una domanda e tornare ai materiali del corso quando desideri riprendere una definizione, un passaggio o un’ipotesi.'}</p></section>`;
}
