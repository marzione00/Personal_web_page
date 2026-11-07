import fs from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {safeId,safeEmail,safeExternal,safeMedia} from './safety.mjs';
function readJson(file){const value=JSON.parse(fs.readFileSync(file,'utf8'));return value;}
function requireText(o,key,max=500){if(typeof o[key]!=='string'||!o[key].trim()||o[key].length>max)throw new Error(`Campo ${key} mancante o non valido`);}
function collection(root,name){const dir=path.join(root,'content',name);return fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().map(f=>{const x=readJson(path.join(dir,f));safeId(x.id);if(f!==x.id+'.json')throw new Error(`Il file ${f} deve corrispondere all’ID ${x.id}`);requireText(x,'title');return x;});}
export function loadContent(root,{preview=false}={}){
 const profile=readJson(path.join(root,'content/profile.json')),site=readJson(path.join(root,'content/site.json')),research=readJson(path.join(root,'content/research.json'));
 if(typeof site.published!=='boolean')throw new Error('Stato pubblicazione non valido');
 for(const key of ['education','experience','teaching','theses','talks','interests','skills','programming','languages'])if(!Array.isArray(profile[key]))throw new Error('Elenco profilo non valido: '+key);
 requireText(profile,'name');requireText(profile,'intro',5000);requireText(profile,'biography',12000);requireText(profile,'personalInterests',6000);safeEmail(profile.email);
 if(!safeMedia(profile.cvPdf))throw new Error('Percorso CV non valido');
 if(profile.personalPhotos!==undefined){
  if(!Array.isArray(profile.personalPhotos)||profile.personalPhotos.length>8)throw new Error('Galleria personale non valida');
  for(const photo of profile.personalPhotos){
    for(const key of ['id','file','alt','caption','category','sourceName'])requireText(photo,key,600);
    safeId(photo.id);
    if(!/^\/?media\/images\/[a-z0-9_-]+\.jpg$/i.test(photo.file)||!safeMedia(photo.file))throw new Error('Percorso foto non valido: '+photo.file);
    if(!/^IMG_\d{4}\.jpeg$/i.test(photo.sourceName))throw new Error('Nome origine foto non valido');
  }
 }

 for(const key of ['github','linkedin','orcid','unimi','cattolica','air'])if(!safeExternal(profile[key]))throw new Error('Link profilo non valido: '+key);
 const allCourses=collection(root,'courses'),allPosts=collection(root,'posts'),allLectures=collection(root,'lectures'),publications=collection(root,'publications');
 for(const c of allCourses){requireText(c,'summary',5000);requireText(c,'university');requireText(c,'universityShort');if(!/^20\d{2}\/20\d{2}$/.test(c.academicYear))throw new Error('Anno accademico non valido');if(!safeExternal(c.source))throw new Error('Fonte corso non HTTPS');if(typeof c.verified!=='boolean'||typeof c.draft!=='boolean')throw new Error('Stato corso non valido');}
 for(const p of allPosts){if(typeof p.draft!=='boolean'||typeof p.demo!=='boolean')throw new Error('Stato articolo non valido');if(p.sourceStatus!==undefined && !['awaiting-file','needs-review','approved'].includes(p.sourceStatus))throw new Error('Stato importazione articolo non valido');if(!p.draft && p.sourceStatus && p.sourceStatus!=='approved')throw new Error('Articolo non approvato per la pubblicazione: '+p.id);if(!p.draft && p.body.includes('__MDC_IN_ATTESA_SOURCE__'))throw new Error('Articolo ancora privo del testo integrale: '+p.id);requireText(p,'body',200000);if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||(isNaN(Date.parse(p.date))||new Date(p.date).toISOString().slice(0,10)!==p.date))throw new Error('Data articolo non valida');if(p.cover&&(!safeMedia(p.cover)||!/^\/?media\/images\/.*\.(png|jpe?g|webp)$/i.test(p.cover)))throw new Error('Copertina non valida');if(p.cover)requireText(p,'coverAlt',500);if(!Array.isArray(p.tags))throw new Error('Tag articolo non validi');requireText(p,'excerpt',5000);requireText(p,'category',300);}
 for(const l of allLectures){if(typeof l.draft!=='boolean')throw new Error('Stato lezione non valido');if(!allCourses.some(c=>c.id===l.course))throw new Error('Corso inesistente: '+l.course);if(!Number.isInteger(l.order)||l.order<1)throw new Error('Ordine lezione non valido');if(!Array.isArray(l.files)||l.files.length>12||!l.files.every(f=>safeMedia(f)&&/^\/?media\/docs\//.test(f)))throw new Error('Allegati non validi');
  if(l.topics!==undefined&&(!Array.isArray(l.topics)||l.topics.length>12||l.topics.some(t=>typeof t!=='string'||t.length>500)))throw new Error('Argomenti modulo non validi');
  for(const k of ['pages','sizeBytes'])if(l[k]!==undefined&&(!Number.isSafeInteger(l[k])||l[k]<1))throw new Error('Metadati PDF non validi');
  for(const k of ['authors','license'])if(l[k]!==undefined&&(typeof l[k]!=='string'||l[k].length>1000))throw new Error('Attribuzione PDF non valida');
 }
 for(const p of publications){for(const key of ['category','authors','where','year'])requireText(p,key,2000);if(!/^\d{4}$/.test(p.year))throw new Error('Anno pubblicazione non valido');if(p.href&&!safeExternal(p.href))throw new Error('Link bibliografia non valido');
  if(!['reviewed','pending'].includes(p.readingStatus))throw new Error('Stato lettura pubblicazione non valido');
  requireText(p,'readingBasis',500);if(!safeExternal(p.readingUrl))throw new Error('Fonte spiegazione non HTTPS');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.readDate)||isNaN(Date.parse(p.readDate)))throw new Error('Data lettura non valida');
  if(p.readingStatus==='reviewed'){requireText(p,'plainTitle',400);requireText(p,'plainSummary',1500);requireText(p,'explanation',5000);}
  if(p.bibliographicNote!==undefined)requireText(p,'bibliographicNote',1500);
 }
 for(const key of ['title','subtitle','introduction','connectionsTitle','connections'])requireText(research,key,12000);
 if(!Array.isArray(research.areas)||research.areas.length<1||research.areas.length>12)throw new Error('Temi di ricerca non validi');
 const areaIds=new Set(),pubIds=new Set(publications.map(p=>p.id));
 const textList=(value,label,max=20)=>{if(!Array.isArray(value)||value.length>max||!value.every(x=>typeof x==='string'&&x.trim()&&x.length<=2000))throw new Error('Elenco ricerca non valido: '+label);};
 const pubRefs=refs=>{textList(refs,'pubblicazioni',30);if(new Set(refs).size!==refs.length||refs.some(id=>!pubIds.has(id)))throw new Error('Riferimento bibliografico ricerca non valido');};
 for(const area of research.areas){if(!['ricerca','trasversale','approfondimenti'].includes(area.group))throw new Error('Categoria editoriale del tema non valida');safeId(area.id);if(areaIds.has(area.id))throw new Error('Identificativo tema duplicato');areaIds.add(area.id);for(const key of ['title','shortTitle','scope','summary','question','overview','approach'])requireText(area,key,6000);textList(area.methods,'metodi');textList(area.activities,'attività');pubRefs(area.publications);if(area.courseLink&&!allCourses.some(c=>c.id===area.courseLink))throw new Error('Collegamento corso ricerca non valido');}

 const courses=allCourses.filter(x=>preview||(!x.draft&&x.verified)).sort((a,b)=>b.academicYear.localeCompare(a.academicYear)||a.title.localeCompare(b.title));
 const posts=allPosts.filter(x=>preview||(!x.draft&&!x.demo&&x.date<=new Date().toISOString().slice(0,10))).sort((a,b)=>b.date.localeCompare(a.date));
 const lectures=allLectures.filter(x=>(preview||!x.draft)&&courses.some(c=>c.id===x.course)).sort((a,b)=>a.order-b.order);
 const media=new Set([profile.cvPdf,...lectures.flatMap(x=>x.files),...posts.map(x=>x.cover).filter(Boolean)]);
 for(const ref of media)if(!fs.existsSync(path.join(root,'public',safeMedia(ref))))throw new Error('Allegato assente: '+ref);
 // Include photographs only when their actual source files have been imported.
 // Missing uploaded image bytes are never replaced by synthetic images or external placeholders.
 profile.availablePersonalPhotos=(profile.personalPhotos||[]).filter(photo=>fs.existsSync(path.join(root,'public',safeMedia(photo.file))));
 profile.homepagePhotoAvailable=!!(profile.homepagePhoto&&safeMedia(profile.homepagePhoto.file)&&fs.existsSync(path.join(root,'public',safeMedia(profile.homepagePhoto.file))));
 if(!profile.homepagePhotoAvailable)throw new Error('Manca la foto originale della homepage.');
 requireText(profile.homepagePhoto,'alt',600);
 if(!Number.isInteger(profile.homepagePhoto.width)||!Number.isInteger(profile.homepagePhoto.height)||profile.homepagePhoto.width<1||profile.homepagePhoto.height<1)throw new Error('Dimensioni foto non valide');
 if(!/^[a-f0-9]{64}$/.test(profile.homepagePhoto.sha256||''))throw new Error('Impronta foto originale assente');
 const photoBytes=fs.readFileSync(path.join(root,'public',safeMedia(profile.homepagePhoto.file)));
 if(createHash('sha256').update(photoBytes).digest('hex')!==profile.homepagePhoto.sha256)throw new Error('La fotografia non corrisponde al file originale approvato.');
 return{profile,site,research,courses,posts,lectures,publications:publications.sort((a,b)=>b.year.localeCompare(a.year)),preview};
}
