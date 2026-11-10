import {escapeHtml as e} from './safety.mjs';
import {teachingAppSearchEntries} from './teaching-apps.mjs';
import {textFor} from './i18n.mjs';
export function searchEntries(data){
 const en=data.language==='en';
 const base=[['index.html','Home'],['didattica.html','Didattica'],['ricerca.html','Ricerca'],['blog.html','Blog'],['cv.html','Profilo & CV'],['geometrie.html','Atlante delle forme'],['esperimenti.html',en?'Variations and measurements':'Variazioni e misure'],['viaggi.html','Viaggi'],['contatti.html','Contatti'],['risorse.html','Risorse'],['manifold.html',data.identity.manifold.titolo],['musica.html',data.identity.musica.titolo],['licenza.html',data.identity.licenza.titolo]].map(([url,title])=>({url,title,kind:en?'Section':'Sezione'}));
 const rows=[...base,...teachingAppSearchEntries(data),
 {url:'geometrie.html#cyber-network',title:data.cyberNetwork.copy.titolo,kind:en?'Graph theory':'Teoria dei grafi',context:data.cyberNetwork.copy.introduzione,keywords:'cybersecurity cyber attack graph grafo rete propagazione compromissione'},
 ...[['bloch',en?'Qubit state on the Bloch sphere':'Stato del qubit sulla sfera di Bloch'],['waves',en?'Wave superposition and phase':'Sovrapposizione delle onde e fase'],['decision',en?'Probability and decision threshold':'Probabilità e soglia di decisione']].map(([id,title])=>({url:'esperimenti.html#'+id,title,kind:en?'Interactive experiment':'Esperimento interattivo',context:en?'Change the parameters and compare the mathematical predictions.':'Modifica i parametri e confronta le previsioni matematiche.'})),
 ...data.courses.map(x=>({url:`corso-${x.id}.html`,title:x.title+' · '+x.academicYear,kind:en?'Course':'Corso',context:x.summary})),
 ...data.lectures.map(x=>({url:`corso-${x.course}.html#lezione-${x.id}`,title:x.title,kind:en?'Module':'Modulo',context:x.summary,keywords:x.topics.join(' ')})),
 ...data.studyGuide.modules.flatMap(m=>m.chapters.map(c=>({url:`corso-quantum-post-quantum-computing-2026-2027.html#argomento-${m.id}-${c.page}`,title:c.title,kind:en?'Slide topic · Italian':'Argomento della dispensa',context:`${en?'Module':'Modulo'} ${Number(m.id.slice(-2))} · PDF p. ${c.page}`}))),
 ...data.geometry.items.map(g=>({url:`geometrie.html#${g.id}`,title:g.titolo,kind:en?'Geometry':'Geometria',context:g.spiegazione,keywords:g.id+' '+g.tema+' '+g.osservazione})),
 ...data.posts.map(x=>({url:`articolo-${x.id}.html`,title:x.title,kind:'Blog',context:x.excerpt})),
 ...data.publications.map(x=>({url:`ricerca.html#${x.id}`,title:x.title+(x.plainTitle?' · '+x.plainTitle:''),kind:x.category+' / '+x.year,context:x.plainSummary||x.where})),
 ...data.research.areas.map(x=>({url:`tema-${x.id}.html`,title:x.title,kind:en?'Research topic':'Tema di ricerca',context:x.question,keywords:x.methods.join(' ')})),
 ...data.travels.map(x=>({url:`viaggio-${x.id}.html`,title:x.title+' · '+x.place,kind:en?'Travels':'Viaggi',context:x.excerpt})),
 {url:'cv.html#interessi-personali',title:en?'Yoga, hiking and climbing':'Yoga, escursionismo e arrampicata',kind:en?'Profile':'Profilo'},
 ...data.profile.education.map(x=>({url:'cv.html#formazione',title:x.degree,kind:(en?'Education':'Formazione')+' / '+x.year}))];
 const aliases=[[/xai|spiegabil|explainab/i,'XAI explainable AI IA intelligenza artificiale spiegabile'],[/mobius|möbius/i,'Moebius Möbius Mobius nastro ribbon'],[/quantistic|quantum/i,'quantum quantistico qubit'],[/euclid/i,'Euclide Euclidean Euclid gcd MCD'],[/bloch/i,'Bloch qubit sfera sphere']];
 return rows.map(r=>{const title=textFor(r.title,data),context=r.context||'';return {...r,title,kind:textFor(r.kind,data),context,keywords:[r.keywords||'',...aliases.filter(([re])=>re.test(title+' '+context)).map(([,v])=>v)].join(' ')};});
}
export function searchRows(data){return searchEntries(data).map(x=>`<a class="search-row" data-item data-search-title="${e(x.title)}" data-search-keywords="${e(x.keywords||'')}" href="${e(x.url)}"><div><span class="meta">${e(x.kind)}</span><strong>${e(x.title)}</strong>${x.context?`<p>${e(x.context)}</p>`:''}</div><span aria-hidden="true">↗</span></a>`).join('')+`<div class="empty" data-empty hidden>${data.language==='en'?'No results. Try another term.':'Nessun risultato. Prova un altro termine.'}</div>`;}
