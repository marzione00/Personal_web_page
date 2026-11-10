import {launchAttributes} from './teaching-apps.mjs';
import {orbitMark,replayEntry} from './cinema.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {escapeHtml as e,safeExternal,safeMedia} from './safety.mjs';
export function ambientContext(file=''){
 if(/quantum|modulo/.test(file))return 'quantum';
 if(/geometrie|manifold|esperimenti/.test(file))return 'geometry';
 if(/ricerca|articolo|tema-/.test(file))return 'research';
 if(/calculus/.test(file))return 'probability';
 if(/matematica|didattica/.test(file))return 'teaching';
 return 'general';
}
export function loadStudyPaths(root){
 const data=JSON.parse(fs.readFileSync(path.join(root,'content/study-paths.json'),'utf8'));
 if(data.schemaVersion!==1||data.modules.length!==7)throw Error('Percorsi didattici non validi');
 const ids=new Set();
 for(const m of data.modules){
  if(!Number.isInteger(m.module)||m.module<1||m.module>7||ids.has(m.module)||!Array.isArray(m.activities)||!m.activities.length||m.activities.length>4)throw Error('Modulo del percorso non valido');ids.add(m.module);
  for(const a of m.activities){if(!/^[a-z0-9-]+$/.test(a.slug)||!['it','en'].every(l=>typeof a.title[l]==='string'&&a.title[l].length>0&&a.title[l].length<180))throw Error('Attività non valida');}
 }
 return data;
}
export function studyLinks(lecture,data){
 const record=data.studyPaths?.modules.find(m=>lecture.id===`quantum-2026-2027-modulo-${String(m.module).padStart(2,'0')}`);
 const app=data.teachingApps?.find(a=>a.id==='quantum-lab'&&a.enabled);if(!record||!app||!safeExternal(app.url))return '';
 const en=data.language==='en',lang=en?'en':'it',guide=data.studyGuide.modules.find(m=>m.id===lecture.id);
 return `<section class="study-bridge" aria-label="${en?'From slides to experiment':'Dalle slide all’esperimento'}"><span class="label">${en?'Study → experiment':'Studia → sperimenta'}</span><p>${en?'After reading the slides, you can open these activities to compare the module’s topics with the laboratory’s representations.':'Dopo aver consultato le slide, puoi aprire le attività collegate per confrontare gli argomenti del modulo con le rappresentazioni del laboratorio.'}</p><ul>${record.activities.map(a=>`<li><a class="text-link" href="${e(app.url.split('#')[0]+'#modulo-'+record.module+'/'+a.slug)}" target="_blank" rel="noopener noreferrer">${e(a.title[lang])} <span aria-hidden="true">↗</span></a>${guide&&a.page?` <a class="study-source" href="${e(safeMedia(guide.pdf))}#page=${a.page}" target="_blank" rel="noopener noreferrer">${en?'PDF p.':'PDF pag.'} ${a.page}</a>`:''}</li>`).join('')}</ul><p class="small muted">${en?'Opens in a new tab. Laboratory interface: Italian.':'Si apre in una nuova scheda, mantenendo disponibili i materiali.'}</p></section>`;
}
export function homePortals(data){
 const en=data.language==='en',apps=(data.teachingApps||[]).filter(a=>a.enabled);
 const cards=[
  {title:en?'Teaching':'Didattica',href:'didattica.html',label:en?'Study':'Studia',copy:en?'Choose a course and academic year to reach its entry and the available materials.':'Scegli il corso e l’anno accademico per raggiungere le schede e i materiali disponibili.'},
  {title:en?'Research':'Ricerca',href:'ricerca.html',label:en?'Explore':'Approfondisci',copy:en?'Follow the questions running through the studies, comparing methods, findings and references.':'Segui le domande che attraversano gli studi, confrontandone metodi, risultati e riferimenti.'},
  {title:en?'Laboratories':'Laboratori',href:'laboratori.html',label:en?'Navigate':'Esplora',copy:en?'Two galaxies to explore: Quantum Lab and GeoStat Lab, from quantum computing to statistics for Earth sciences.':'Due galassie da esplorare: Quantum Lab e GeoStat Lab, dal calcolo quantistico alla statistica per le scienze della Terra.'}
 ];
 return `<section class="section portals home-entry" aria-labelledby="home-entry-title"><div class="shell"><div class="section-head"><div><span class="label">${en?'Choose your path':'Scegli il tuo percorso'}</span><h2 id="home-entry-title">${en?'From study to exploration':'Dallo studio all’esplorazione'}</h2></div>${replayEntry(data)}</div><div class="portal-grid">${cards.map((c,i)=>`<a class="portal-card" href="${e(c.href)}"><div class="portal-art${i===2?' lab-portal-art':''}" aria-hidden="true"><span class="portal-number">0${i+1}</span>${i===2?'<img src="assets/labs/galaxy-quantum.svg" alt="" width="800" height="800" loading="lazy">':orbitMark(['lattice','wave'][i])}</div><div class="portal-copy"><span class="meta">${c.label}</span><h3>${c.title}</h3><p>${c.copy}</p><span class="portal-link">${i===2?(en?'Explore the map':'Esplora la mappa'):(en?'Open':'Apri')} <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div><div class="lab-shortcuts"><span>${en?'Direct access':'Accesso diretto'}</span>${apps.map(app=>`<a href="${e(app.url)}"${launchAttributes(app)}>${e(app.title)} ↗</a>`).join('')}</div></div></section>`;
}
export function shareMetadata(data,page,canonical){
 if(!canonical)return '';
 const en=data.language==='en',section=page.section||page.file;
 const kind=section==='index.html'?'home':section==='didattica.html'||page.file.startsWith('corso-')?'teaching':section==='ricerca.html'?'research':section==='blog.html'?'writing':section==='viaggi.html'?'travel':'profile';
 const url=new URL(`media/images/share/${kind}-${en?'en':'it'}.png`,canonical.includes('/en/')?new URL('../',canonical):new URL('./',canonical)).href;
 const title=`${page.title} — Topological Manifolds`;
 return `<meta property="og:type" content="${page.file.startsWith('articolo-')?'article':'website'}"><meta property="og:site_name" content="Topological Manifolds"><meta property="og:locale" content="${en?'en_GB':'it_IT'}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(url)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(page.description)}"><meta name="twitter:image" content="${e(url)}">`;
}
