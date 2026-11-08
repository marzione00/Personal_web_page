/** Travel diaries & albums: one Markdown file per trip, no JavaScript editing required.
 * The Markdown source is data, never executable HTML. No generated photographs.
 */
import fs from 'node:fs';
import path from 'node:path';
import {safeId, safeMedia} from './safety.mjs';

const DATE=/^20\d\d-\d\d-\d\d$/;
const IMAGE_LINE=/^!\[([^\]\n]{4,300})\]\((media\/images\/viaggi\/[a-z0-9-]+\/[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp))\)$/;
const META=['title','date','kind','place','excerpt','draft','cover','id'];
const FRONT=/^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const ALBUM=/^##\s+(?:Album|Album fotografico|Photo album)\s*$/mi;
const MD_DIR='content/markdown';

export function travelDirectory(root,language='it'){
 return path.join(root,MD_DIR,language==='en'?'en/viaggi':'viaggi');
}
function safeTravelPhoto(id,name){
 const media=safeMedia(name);
 if(!media||!new RegExp(`^media/images/viaggi/${id}/[a-zA-Z0-9_-]+\\.(?:jpg|jpeg|png|webp)$`,'i').test(media))
  throw new Error(`Immagine non valida per il diario ${id}: ${name}`);
 return media;
}
function metaFromHeader(header,file){
 const meta=Object.create(null);
 for(const line of header.split('\n')){
  if(!line.trim()||line.trim().startsWith('#'))continue;
  const m=line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
  if(!m||!META.includes(m[1])||Object.hasOwn(meta,m[1]))throw new Error('Intestazione diario non valida: '+file);
  meta[m[1]]=m[2].replace(/^(?:"(.*)"|'(.*)')$/,'$1$2').trim();
 }
 return meta;
}
function parseTravel(root,language,id){
 const filename=path.join(travelDirectory(root,language),id+'.md');
 if(!fs.existsSync(filename))return null;
 const source=fs.readFileSync(filename,'utf8').replace(/\r\n/g,'\n');
 if(source.length>160000)throw new Error('Diario troppo lungo: '+filename);
 const match=source.match(FRONT);if(!match)throw new Error('Diario senza intestazione ---: '+filename);
 const meta=metaFromHeader(match[1],filename);
 if(meta.id&&meta.id!==id)throw new Error('ID del diario differente dal file: '+filename);
 for(const field of ['title','date','kind','place','excerpt','draft']){
  if(!meta[field])throw new Error(`Campo ${field} mancante: ${filename}`);
 }
 if(['true','false'].includes(meta.draft)===false)throw new Error('draft deve essere true o false: '+filename);
 if(!DATE.test(meta.date)||new Date(meta.date).toISOString().slice(0,10)!==meta.date)
  throw new Error('Data non valida per '+id);
 for(const field of ['title','kind','place','excerpt'])if(meta[field].length>{title:160,kind:80,place:160,excerpt:650}[field])throw new Error('Campo troppo lungo: '+field);
 const marker=ALBUM.exec(match[2]);
 const diary=(marker?match[2].slice(0,marker.index):match[2]).trim();
 if(!diary)throw new Error('Il diario non può essere vuoto: '+filename);
 const gallery=(marker?match[2].slice(marker.index+marker[0].length):'').trim();
 const photos=[];
 for(const line of gallery.split('\n').filter(s=>s.trim())){
  const m=line.trim().match(IMAGE_LINE);if(!m)throw new Error('Nell’album usare solo ![didascalia](percorso): '+filename);
  const file=safeTravelPhoto(id,m[2]);
  if(photos.some(p=>p.file===file))throw new Error('Fotografia duplicata: '+file);
  photos.push({file,alt:m[1]});
 }
 if(photos.length>60)throw new Error('Album oltre 60 fotografie: '+id);
 const cover=meta.cover?safeTravelPhoto(id,meta.cover):photos[0]?.file||null;
 return {id,...meta,date:meta.date,draft:meta.draft==='true',cover,diary,photos,translationMissing:false};
}

export function loadTravels(root,{preview=false,language='it'}={}){
 const dir=travelDirectory(root,'it');
 const ids=fs.readdirSync(dir).filter(f=>f.endsWith('.md')).map(f=>f.slice(0,-3)).sort();
 const seen=new Set();const all=[];
 for(const id of ids){
  safeId(id);if(seen.has(id))throw new Error('Diario duplicato: '+id);seen.add(id);
  const original=parseTravel(root,'it',id);
  const translated=language==='en'?parseTravel(root,'en',id):null;
  if(translated){
   if(translated.date!==original.date||translated.draft!==original.draft)throw new Error('Data/stato divergenti fra le lingue: '+id);
   if(translated.photos.length!==original.photos.length||translated.photos.some((p,i)=>p.file!==original.photos[i].file))throw new Error('Le foto devono avere gli stessi percorsi in entrambe le lingue: '+id);
   if(translated.cover!==original.cover)throw new Error('Copertina diversa tra IT e EN: '+id);
  }
  const trip=language==='en'?(translated||{...original,translationMissing:true,title:original.title,excerpt:'An English translation is not yet available for this diary.',diary:'This travel diary is currently available in Italian.',kind:original.kind==='Escursione'?'Hike':'Journey',place:original.place}):original;
  if(!trip.draft && trip.date>new Date().toISOString().slice(0,10))continue;
  if(!preview&&trip.draft)continue;
  // Referenced files are checked only when a trip is published: drafts may be prepared before photo upload.
  const missingFiles=new Set();
  const exists=file=>fs.existsSync(path.join(root,'public',file));
  const photos=[];
  for(const photo of trip.photos){if(!exists(photo.file)){missingFiles.add(photo.file);if(!trip.draft)throw new Error('Foto non caricata: '+photo.file);}else photos.push(photo);}
  if(trip.cover&&!exists(trip.cover)){missingFiles.add(trip.cover);if(!trip.draft)throw new Error('Copertina assente: '+trip.cover);}
  all.push({...trip,photos,missingPhotoCount:missingFiles.size,cover:trip.cover&&exists(trip.cover)?trip.cover:null});
 }
 return all.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}

export function readTravelIndex(root,language='it'){
 const file=path.join(root,MD_DIR,language==='en'?'en/viaggi.md':'viaggi.md');
 if(!fs.existsSync(file))throw new Error('Manca '+file);
 const text=fs.readFileSync(file,'utf8');const result=Object.create(null);let key=null,lines=[];
 const save=()=>{if(key){if(Object.hasOwn(result,key))throw new Error('Sezione ripetuta: '+key);result[key]=lines.join('\n').trim();}};
 for(const line of text.replace(/\r\n/g,'\n').split('\n')){
  const match=line.match(/^##\s+([A-Za-z][A-Za-z0-9_-]*)\s*$/);
  if(match){save();key=match[1];lines=[];}else if(key)lines.push(line);
 }
 save();
 for(const key of ['titolo','introduzione','nessunViaggio','nota'])if(!result[key]||result[key].length>2000)throw new Error('Indice viaggi incompleto: '+file+' / '+key);
 return result;
}
