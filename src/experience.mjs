import {launchAttributes} from './teaching-apps.mjs';
import {plateImage} from './editorial-plates.mjs';
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
 const labLinks=apps.map(app=>`<a href="${e(app.url)}"${launchAttributes(app)}>${e(app.title)} ↗</a>`).join('');
 const lesson=data.lectures.find(lecture=>lecture.id==='quantum-2026-2027-modulo-01');
 const essay=data.posts.find(post=>post.id==='lequilibrio-sul-tappetino');
 const cards=[
  {title:lesson?.title||(en?'Course materials':'Materiali dei corsi'),href:lesson?`corso-${lesson.course}.html#lezione-${lesson.id}`:'didattica.html',
   label:en?'Teaching':'Didattica',copy:en?'The first module of Quantum and Post-Quantum Computing.':'Il primo modulo di Quantum e post-quantum computing.',art:orbitMark('lattice')},
  {title:en?'Inside a schwarzite':'Dentro la schwarzite',href:'geometrie.html#confronto-carbonio',label:en?'Atlas':'Atlante',
   copy:en?'From the plane of graphene to the pores of the P688 lattice.':'Dal piano del grafene ai pori del reticolo P688.',art:plateImage('schwarzite-pori',1080,650,'',true)},
  {title:essay?.title||(en?'Essays':'Saggi'),href:essay?`articolo-${essay.id}.html`:'blog.html',label:'Blog',
   copy:en?'A ball, a pendulum and four asanas to study stability.':'Una pallina, un pendolo e quattro asana per studiare la stabilità.',art:orbitMark('wave')}
 ];
 return `<section class="section portals home-entry" aria-labelledby="home-entry-title"><div class="shell"><div class="section-head"><h2 id="home-entry-title">${en?'Study and explore':'Studia ed esplora'}</h2>${replayEntry(data)}</div><div class="portal-grid">${cards.map(c=>`<a class="portal-card" href="${e(c.href)}"><div class="portal-art" aria-hidden="true">${c.art}</div><div class="portal-copy"><span class="meta">${c.label}</span><h3>${e(c.title)}</h3><p>${c.copy}</p><span class="portal-link">${en?'Open':'Apri'} <span aria-hidden="true">↗</span></span></div></a>`).join('')}</div><div class="lab-shortcuts"><a href="laboratori.html">${en?'Laboratory map':'Mappa dei laboratori'} ↗</a>${labLinks}</div></div></section>`;
}
export function shareMetadata(data,page,canonical){
 if(!canonical)return '';
 const en=data.language==='en',section=page.section||page.file;
 const kind=section==='index.html'?'home':section==='didattica.html'||page.file.startsWith('corso-')?'teaching':section==='ricerca.html'?'research':section==='blog.html'?'writing':section==='viaggi.html'?'travel':'profile';
 const url=new URL(`media/images/share/${kind}-${en?'en':'it'}.png`,canonical.includes('/en/')?new URL('../',canonical):new URL('./',canonical)).href;
 const title=`${page.title} — Topological Manifolds`;
 return `<meta property="og:type" content="${page.file.startsWith('articolo-')?'article':'website'}"><meta property="og:site_name" content="Topological Manifolds"><meta property="og:locale" content="${en?'en_GB':'it_IT'}"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(page.description)}"><meta property="og:url" content="${e(canonical)}"><meta property="og:image" content="${e(url)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${e(title)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(page.description)}"><meta name="twitter:image" content="${e(url)}">`;
}
