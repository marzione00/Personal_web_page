import {loadGalaxies} from './galaxies.mjs';
import {loadTeachingApps} from './teaching-apps.mjs';
import {loadPaths} from './paths.mjs';
import {loadStudyPaths} from './experience.mjs';
import {loadIdentityPages} from './identity.mjs';
import {loadTravels, readTravelIndex} from './travel.mjs';
import {localiseData} from './i18n.mjs';
import fs from 'node:fs';
import {loadCyberNetwork} from './cyber-network.mjs';
import {loadGeometry} from './geometry.mjs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {safeId,safeEmail,safeExternal,safeMedia} from './safety.mjs';
function readJson(file){const value=JSON.parse(fs.readFileSync(file,'utf8'));return value;}
function requireText(o,key,max=500){if(typeof o[key]!=='string'||!o[key].trim()||o[key].length>max)throw new Error(`Campo ${key} mancante o non valido`);}
function collection(root,name){const dir=path.join(root,'content',name);return fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().map(f=>{const x=readJson(path.join(dir,f));safeId(x.id);if(f!==x.id+'.json')throw new Error(`Il file ${f} deve corrispondere all’ID ${x.id}`);requireText(x,'title');return x;});}
/** Narrative content is read from Markdown. JSON remains structured metadata only.
 * All Markdown text is rendered escaped by the existing safe renderer. */
const EDITABLE=Object.freeze({
 profile:['intro','biography','personalInterests','headline'],
 research:['title','subtitle','introduction','connectionsTitle','connections'],
 areas:['title','shortTitle','scope','summary','question','overview','approach','methods','activities'],
 courses:['title','summary','description','learningPath'],
 lectures:['title','summary','topics','body'],
 publications:['title','authors','where','plainTitle','plainSummary','explanation','bibliographicNote'],
 posts:['title','subtitle','excerpt','category','geometria']
});
function sectionsFromMarkdown(filename){
 if(!fs.existsSync(filename))return null;
 const source=fs.readFileSync(filename,'utf8').replace(/\r\n/g,'\n');
 const found={};let current=null,buf=[];
 const save=()=>{if(current!==null){if(Object.hasOwn(found,current))throw new Error('Sezione Markdown duplicata: '+current+' in '+filename);found[current]=buf.join('\n').trim();}};
 for(const line of source.split('\n')){
  const match=line.match(/^##\s+([A-Za-z][A-Za-z0-9_-]*)\s*$/);
  if(match){save();current=match[1];buf=[];}
  else if(current!==null)buf.push(line);
 }
 save();return found;
}
function applyMarkdownSections(root,area,id,object,fields){
 const filename=path.join(root,'content/markdown',area,id+'.md');
 const sections=sectionsFromMarkdown(filename);if(!sections)return;
 for(const [key,val] of Object.entries(sections)){
  if(!fields.includes(key))throw new Error('Sezione Markdown inattesa: '+key+' in '+filename);
  if(!val){if(['methods','activities','topics'].includes(key))object[key]=[];continue;}
  if(['methods','activities','topics'].includes(key)){
   object[key]=val.split('\n').filter(x=>x.trim()).map(x=>x.replace(/^[-*]\s+/,'').trim());
  } else object[key]=val;
 }
}
function plainMarkdownFile(root,area,id){
 const filename=path.join(root,'content/markdown',area,id+'.md');
 return fs.existsSync(filename)?fs.readFileSync(filename,'utf8').replace(/\r\n/g,'\n').trim():null;
}
function loadEpigraphs(root){
 const file=path.join(root,'content/markdown/epigrafi.md');
 const blocks=sectionsFromMarkdown(file);
 if(!blocks)throw new Error('Manca content/markdown/epigrafi.md');
 const authors={platone:'Platone',wheeler:'John Archibald Wheeler',engel:'C. E. Engel'};
 return ['platone','wheeler','engel'].map(id=>{
  const block=blocks[id];if(!block)throw new Error('Manca epigrafe '+id);
  const q=block.split('\n').filter(s=>/^>\s?/.test(s)).map(s=>s.replace(/^>\s?/,''));
  const source=block.split('\n').find(s=>/^Fonte:\s*/.test(s));
  if(!q.length||!source)throw new Error('Epigrafe priva di testo o fonte: '+id);
  const note=block.split('\n').find(s=>/^Nota: /.test(s))?.slice(6)||'';
  return{id,author:authors[id],quote:q.join(' ').trim(),source:source.replace(/^Fonte:\s*/, '').trim(),note};
 });
}
function parseArticleFrontmatter(file){
 const full=fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n');
 const match=full.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!match)return null;
 const meta={};
 for(const line of match[1].split('\n')){
  if(!line.trim()||line.trim().startsWith('#'))continue;
  const m=line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);if(!m)throw new Error('Metadato Markdown articolo non valido: '+file);
  if(!['id','title','date','category','tags','excerpt','draft','subtitle','pdf','sourceStatus','geometry'].includes(m[1]))throw new Error('Metadato articolo sconosciuto: '+m[1]);
  const value=m[2].replace(/^(["'])(.*)\1$/,'$2');
  meta[m[1]]=value;
 }
 const id=path.basename(file,'.md');
 if(meta.id&&meta.id!==id)throw new Error('ID articolo diverso dal nome Markdown: '+file);
 safeId(id);
 for(const x of ['title','date','category','excerpt'])if(!meta[x])throw new Error('Metadato mancante '+x+' per '+id);
 if(!['true','false'].includes(meta.draft))throw new Error('Per il nuovo articolo specificare draft: true oppure false');
 return{id,title:meta.title,date:meta.date,category:meta.category,excerpt:meta.excerpt,draft:meta.draft==='true',demo:false,tags:meta.tags?meta.tags.split(',').map(x=>x.trim()).filter(Boolean):[],sourceStatus:meta.sourceStatus||(meta.draft==='false'?'approved':'needs-review'),body:match[2].trim(),geometria:meta.geometry||'',subtitle:meta.subtitle||'',...(meta.pdf?{pdf:meta.pdf}:{})};
}
function additionalMarkdownPosts(root,existing){
 const dir=path.join(root,'content/markdown/posts');if(!fs.existsSync(dir))return[];
 const ids=new Set(existing.map(x=>x.id));
 return fs.readdirSync(dir).filter(f=>f.endsWith('.md')).filter(f=>!ids.has(path.basename(f,'.md'))).sort().map(f=>{
  const item=parseArticleFrontmatter(path.join(dir,f));if(!item)throw new Error('Nuovo articolo senza intestazione ---: '+f);
  return item;
 });
}

export function loadContent(root,{preview=false,language='it'}={}){
 if(!['it','en'].includes(language))throw Error('Unsupported language');
 const profile=readJson(path.join(root,'content/profile.json')),site=readJson(path.join(root,'content/site.json')),research=readJson(path.join(root,'content/research.json'));
 const travels=loadTravels(root,{preview,language});
 const travelIndex=readTravelIndex(root,language);
 applyMarkdownSections(root,'.','profilo',profile,EDITABLE.profile);
 applyMarkdownSections(root,'.','ricerca',research,EDITABLE.research);
 const home=sectionsFromMarkdown(path.join(root,'content/markdown/homepage.md'));
 if(!home||['soprattitolo','settori','ricercaAttuale','formazione','praticaCorporea','titoloPercorso','etichettaEpigrafi','titoloEpigrafi'].some(k=>!home[k]))throw new Error('Homepage Markdown incompleta');
 for(const key of Object.keys(home))if(!['soprattitolo','settori','ricercaAttuale','formazione','praticaCorporea','titoloPercorso','etichettaEpigrafi','titoloEpigrafi'].includes(key))throw new Error('Sezione homepage Markdown non prevista: '+key);
 const epigraphs=loadEpigraphs(root);
 const geometry=loadGeometry(root);
 for(const area of research.areas)applyMarkdownSections(root,'aree-ricerca',area.id,area,EDITABLE.areas);
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
 for(const x of allCourses)applyMarkdownSections(root,'courses',x.id,x,EDITABLE.courses);
 for(const x of allLectures)applyMarkdownSections(root,'lectures',x.id,x,EDITABLE.lectures);
 for(const x of publications)applyMarkdownSections(root,'publications',x.id,x,EDITABLE.publications);
 for(const x of allPosts){
   applyMarkdownSections(root,'post-details',x.id,x,EDITABLE.posts);
   const body=plainMarkdownFile(root,'posts',x.id);if(body!==null)x.body=body;
 }
 allPosts.push(...additionalMarkdownPosts(root,allPosts));
 for(const c of allCourses){requireText(c,'summary',5000);requireText(c,'university');requireText(c,'universityShort');if(!/^20\d{2}\/20\d{2}$/.test(c.academicYear))throw new Error('Anno accademico non valido');if(!safeExternal(c.source))throw new Error('Fonte corso non HTTPS');if(typeof c.verified!=='boolean'||typeof c.draft!=='boolean')throw new Error('Stato corso non valido');}
 for(const p of allPosts){if(typeof p.draft!=='boolean'||typeof p.demo!=='boolean')throw new Error('Stato articolo non valido');if(p.sourceStatus!==undefined && !['awaiting-file','needs-review','approved'].includes(p.sourceStatus))throw new Error('Stato importazione articolo non valido');if(!p.draft && p.sourceStatus && p.sourceStatus!=='approved')throw new Error('Articolo non approvato per la pubblicazione: '+p.id);if(!p.draft && p.body.includes('__MDC_IN_ATTESA_SOURCE__'))throw new Error('Articolo ancora privo del testo integrale: '+p.id);requireText(p,'body',200000);if(!/^\d{4}-\d{2}-\d{2}$/.test(p.date)||(isNaN(Date.parse(p.date))||new Date(p.date).toISOString().slice(0,10)!==p.date))throw new Error('Data articolo non valida');if(p.cover&&(!safeMedia(p.cover)||!/^\/?media\/images\/.*\.(png|jpe?g|webp)$/i.test(p.cover)))throw new Error('Copertina non valida');if(p.cover)requireText(p,'coverAlt',500);if(p.pdf&&(!safeMedia(p.pdf)||!p.pdf.toLowerCase().endsWith('.pdf')))throw new Error('PDF articolo non valido');if(!Array.isArray(p.tags))throw new Error('Tag articolo non validi');requireText(p,'excerpt',5000);requireText(p,'category',300);}
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
 const media=new Set([profile.cvPdf,...lectures.flatMap(x=>x.files),...posts.map(x=>x.cover).filter(Boolean),...posts.map(x=>x.pdf).filter(Boolean)]);
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
 for(const post of posts)if(post.geometria&&!geometry.byId[post.geometria])throw Error('Geometria articolo inesistente: '+post.geometria);
 return localiseData(root,{teachingApps:loadTeachingApps(root,language),galaxies:loadGalaxies(root),...loadPaths(root),studyPaths:loadStudyPaths(root),identity:loadIdentityPages(root,language),cyberNetwork:loadCyberNetwork(root,language),geometry,profile,site,research,home,epigraphs,courses,posts,lectures,publications:publications.sort((a,b)=>b.year.localeCompare(a.year)),travels,travelIndex,preview},language);
}
