import {escapeHtml as e,safeMedia} from './safety.mjs';
import {geometryMarkup} from './geometry.mjs';
import {printButton} from './paths.mjs';

// Narrative lives in the two Markdown fields. Explicit chapter anchors are
// shared by translations, so editing or reordering a title keeps links intact.
export function profileChapters(text,prefix='capitolo'){
 const chapters=[];let current={title:'',paragraphs:[]};
 for(const block of String(text).split(/\n\s*\n/).filter(Boolean)){
  const heading=block.match(/^### (.+?)(?: \{#([a-z0-9]+(?:-[a-z0-9]+)*)\})?$/);
  if(heading){if(current.title||current.paragraphs.length)chapters.push(current);current={title:heading[1],id:heading[2],paragraphs:[]};}
  else current.paragraphs.push(block.trim());
 }
 if(current.title||current.paragraphs.length)chapters.push(current);
 const used=new Set();
 return chapters.map((c,i)=>{
  const base=c.id||`${prefix}-${i+1}`;let id=base,n=1;
  while(used.has(id))id=base+'-'+(++n);
  used.add(id);return {...c,id};
 });
}
const prose=paragraphs=>`<div class="bio-prose">${paragraphs.map(p=>{
 if(p.startsWith('> '))return `<blockquote class="profile-quote">${p.split('\n').map(line=>line.replace(/^> ?/,'')).map(line=>`<p${/[\u0370-\u03ff\u1f00-\u1fff]/u.test(line)?' lang="grc"':''}>${e(line)}</p>`).join('')}</blockquote>`;
 return `<p>${e(p)}</p>`;
}).join('')}</div>`;
const tags=items=>`<div class="skills">${items.map(x=>`<span class="tag">${e(x)}</span>`).join('')}</div>`;
const timeline=entries=>entries.map(x=>`<div class="timeline-row"><div class="date">${e(x.date||x.year)}</div><div><h3>${e(x.degree||x.title)}</h3><div class="institution">${e(x.institution||'')}</div>${x.detail?`<p>${e(x.detail)}</p>`:''}</div></div>`).join('');
const photoFigure=photo=>`<figure class="personal-gallery-item"><img src="${e(safeMedia(photo.file))}" alt="${e(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async"><figcaption>${e(photo.caption)}</figcaption></figure>`;

export function profilePage(data){
 const p=data.profile,en=data.language==='en',tr=(it,eng)=>en?eng:it;
 const nav=[['biografia',tr('Presentazione','Introduction')],['percorso-scientifico',tr('Formazione e ricerca','Education and research')],['didattica',tr('Insegnamento','Teaching')],['interessi-personali',tr('Geometria e corpo','Geometry and the body')],['percorso-accademico',tr('Percorso accademico','Academic record')]];
 const chapters=profileChapters(p.biography,'scienza');
 const personal=profileChapters(p.personalInterests,'personale');
 const available=p.availablePersonalPhotos||[];
 const presentation={
  'fisica-geometria':{label:tr('Laurea triennale e magistrale','Bachelor’s and master’s degrees'),short:tr('Fisica','Physics'),model:'schwarzite-neck'},
  'dottorato':{label:tr('Dottorato · Modena','PhD · Modena'),short:tr('Dottorato','Doctorate')},
  'statistica':{label:tr('Seconda laurea magistrale','Second master’s degree'),short:tr('Statistica','Statistics'),compact:true},
  'fondamenti-ia':{label:tr('Informatica teorica','Theoretical computer science'),short:tr('Fondamenti IA','AI foundations'),compact:true},
  'interpretabilita':{label:tr('Conoscenza e responsabilità','Knowledge and responsibility'),short:tr('Interpretabilità','Interpretability')},
  'sicurezza-sistemi':{label:tr('Ricerca post-dottorale','Postdoctoral research'),short:tr('Sicurezza','Security')},
  'didattica':{label:tr('Docenze e collaborazioni','Teaching and collaborations')},
  'geometria-vissuta':{label:tr('Geometria e corpo','Geometry and the body'),photo:'yoga-montagna-lago'},
  'percorso-vinyasa':{label:'Vinyasa / Yin Yoga',photo:'yoga-pratica-studio'},
  'disciplina-ashtanga':{label:'Ashtanga Vinyasa'},
  'pranayama':{label:'Prāṇāyāma'},
  'appigli-equilibri':{label:tr('Arrampicata e montagna','Climbing and mountains'),photo:'arrampicata-parete'},
  'attenzione-interpretazione':{label:tr('Esperienza e conoscenza','Experience and knowledge'),photo:'yoga-in-vetta'}
 };
 const records=(id,label,body,open=false)=>`<details class="profile-records"${open?' open':''}><summary>${e(label)}</summary><div class="profile-records-body" id="${id}">${body}</div></details>`;
 const card=(c,i,kind)=>{
  const config=presentation[c.id]||{};
  const photo=available.find(x=>x.id===config.photo);
  const art=config.model?geometryMarkup(data,config.model,'profile-model'):'';
  const visual=photo?photoFigure(photo):art?`<aside class="profile-model-aside">${art}<p>${tr('Schwarzite · legami e curvatura nelle strutture di carbonio.','Schwarzite · bonds and curvature in carbon structures.')}</p></aside>`:'';
  return `<section class="profile-card ${kind==='personal'?'profile-personal-row':'profile-chapter'}${config.compact?' profile-card-compact':''}${visual?' profile-card-visual':''}" id="${e(c.id)}"${c.title?` aria-labelledby="titolo-${e(c.id)}"`:''}><div class="profile-card-copy"><p class="profile-card-label"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span>${e(config.label||tr('Percorso','Journey'))}</p>${c.title?`<h3 id="titolo-${e(c.id)}">${e(c.title)}</h3>`:''}${prose(c.paragraphs)}</div>${visual}</section>`;
 };
 const scienceChapters=chapters.filter(c=>c.id!=='didattica');
 const teachingChapters=chapters.filter(c=>c.id==='didattica');
 const science=scienceChapters.map((c,i)=>card(c,i,'science')).join('');
 const teaching=teachingChapters.map((c,i)=>card(c,i,'science')).join('');
 const scienceIndex=`<nav class="profile-card-index" aria-label="${tr('Capitoli della formazione e ricerca','Education and research chapters')}">${scienceChapters.map((c,i)=>`<a href="cv.html#${e(c.id)}"><span aria-hidden="true">${String(i+1).padStart(2,'0')}</span> ${e(presentation[c.id]?.short||c.title||tr('Capitolo','Chapter'))}</a>`).join('')}</nav>`;
 const personalRows=personal.map((c,i)=>card(c,i,'personal')).join('');
 const usedPhotos=new Set(personal.map(c=>presentation[c.id]?.photo));
 const sparePhotos=available.filter(photo=>!usedPhotos.has(photo.id));
 const hero=p.homepagePhoto;
 return `<section class="page-head profile-hero" id="biografia"><div class="shell"><div class="breadcrumb"><a href="index.html">Topological Manifolds</a><span aria-hidden="true">/</span><span>${tr('Profilo & CV','Profile & CV')}</span></div><div class="profile-hero-grid"><div><span class="eyebrow">04 / ${tr('Biografia','Biography')}</span><h1>Marzio<br> De Corato<span class="dot">.</span></h1><p class="profile-headline">${e(p.headline)}</p>${prose([p.intro])}<p class="profile-roles">${tr('Docenze a contratto','Adjunct teaching')}<br>Università degli Studi di Milano<br>Università Cattolica del Sacro Cuore</p><div class="actions"><a class="button primary" href="cv.html#interessi-personali">${tr('Geometria e corpo','Geometry and the body')} <span aria-hidden="true">↓</span></a><a class="text-link" href="${e(safeMedia(p.cvPdf))}">${tr('Apri CV in PDF','Open PDF CV')} ↗</a></div></div><figure class="profile-portrait"><img src="${e(safeMedia(hero.file))}" alt="${e(hero.alt)}" width="${hero.width}" height="${hero.height}" srcset="media/images/derived/homepage-480.webp 480w, media/images/derived/homepage-768.webp 768w, media/images/derived/homepage-1274.webp 1274w" sizes="(max-width: 700px) 80vw, 360px" fetchpriority="high" decoding="async"><figcaption>${tr('Geometria, equilibrio, esperienza.','Geometry, balance, experience.')}</figcaption></figure></div></div></section>
 <div class="shell page-body profile-body"><div class="cv-layout"><nav class="cv-toc" aria-label="${tr('Indice del profilo','Profile contents')}"><span class="label">${tr('In questa pagina','On this page')}</span>${nav.map(([id,label],i)=>`<a href="cv.html#${id}"><span aria-hidden="true">0${i+1}</span> ${e(label)}</a>`).join('')}</nav><div class="profile-content">
 <section class="cv-section" id="percorso-scientifico"><header class="profile-section-head"><span class="label">01 / ${tr('Ricerca','Research')}</span><h2>${tr('Dalle strutture ai modelli','From structures to models')}</h2><p>${tr('Gli studi e gli incontri che hanno orientato le mie domande scientifiche.','The studies and encounters that have shaped my scientific questions.')}</p></header>${scienceIndex}<div class="profile-card-grid">${science}</div></section>
 ${teaching?`<section class="cv-section" aria-labelledby="titolo-insegnamento"><header class="profile-section-head"><span class="label">02 / ${tr('Insegnamento','Teaching')}</span><h2 id="titolo-insegnamento">${tr('Domande da condividere','Questions to share')}</h2></header><div class="profile-card-grid">${teaching}</div></section>`:''}
 <section class="cv-section personal-section" id="interessi-personali"><header class="profile-section-head" id="percorso-personale"><span class="label">03 / ${tr('Geometria e corpo','Geometry and the body')}</span><h2>${tr('La forma nell’esperienza','Form in experience')}</h2><p>${tr('Yoga, arrampicata e montagna: configurazioni da abitare, equilibri da cercare, traiettorie da percorrere.','Yoga, climbing and mountains: configurations to inhabit, balances to find, paths to follow.')}</p></header><div class="profile-card-grid">${personalRows}</div>${sparePhotos.length?`<div class="personal-gallery">${sparePhotos.map(photoFigure).join('')}</div>`:''}<a class="text-link" href="viaggi.html">${tr('Viaggi ed escursioni','Journeys and hikes')} ↗</a></section>
 <section class="cv-section" id="percorso-accademico"><header class="profile-section-head"><span class="label">04 / ${tr('Percorso accademico','Academic record')}</span><h2>${tr('Formazione e attività','Education and activities')}</h2></header>
 ${records('formazione',tr('Formazione · studi e titoli','Education · degrees'),timeline(p.education),true)}
 ${records('esperienza',tr('Esperienza · ricerca e professione','Experience · research and professional work'),timeline(p.experience))}
 ${records('insegnamenti',tr('Insegnamenti e collaborazioni didattiche','Teaching appointments and contributions'),timeline(p.teaching))}
 ${records('interessi-scientifici',tr('Interessi scientifici','Research interests'),tags(p.interests))}
 ${records('tesi',tr('Progetti e tesi','Projects and theses'),`<p class="muted">${e(p.project)}</p><ul class="list-simple">${p.theses.map(x=>`<li><span class="meta">${e(x.year)} / ${tr('Correlazione','Co-supervision')}</span>${e(x.title)}</li>`).join('')}</ul>`)}
 ${records('interventi',tr('Conferenze · interventi selezionati','Conferences · selected talks'),p.talks.map(x=>`<div class="talk-row"><span class="talk-date">${e(x.year)}</span><div><h3>${e(x.title)}</h3><p>${e(x.event)}</p></div></div>`).join(''))}
 ${records('competenze',tr('Metodi e competenze','Methods and skills'),`${tags(p.skills)}<h3>${tr('Linguaggi di programmazione','Programming languages')}</h3>${tags(p.programming)}<p class="small muted">${tr('Lingue','Languages')}: ${e(p.languages.join(' · '))}.</p>`)}
 <div class="cv-download"><a class="button" href="${e(safeMedia(p.cvPdf))}" download="Marzio_De_Corato_CV.pdf">${tr('Scarica CV','Download CV')} ↓</a>${printButton(data)}</div></section>
 </div></div></div>`;
}
