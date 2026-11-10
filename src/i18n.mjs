/** Build-time localisation. No remote translation, runtime text replacement or duplicated templates.
 * English prose lives in Markdown; stable IDs, dates, model bytes and URLs are shared.
 */
import fs from 'node:fs';
import path from 'node:path';
import {escapeHtml as e} from './safety.mjs';
export const languages=['it','en'];
export function sections(file){
 if(!fs.existsSync(file))return null;
 const output={};let key=null,lines=[];
 const save=()=>{if(key!==null){if(Object.hasOwn(output,key))throw Error('Duplicate translation field: '+key+' in '+file);output[key]=lines.join('\n').trim();}};
 for(const line of fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n').split('\n')){const match=line.match(/^## ([A-Za-z][A-Za-z0-9_-]*)\s*$/);if(match){save();key=match[1];lines=[];}else if(key!==null)lines.push(line);}
 save();return output;
}
function apply(file,object,fields,listFields=[]){
 const values=sections(file);if(values===null)throw Error('Missing English translation: '+file);
 const source=sections(file.replace(path.sep+'en'+path.sep,path.sep));
 if(source)for(const key of Object.keys(source).filter(k=>fields.includes(k)))if(!Object.hasOwn(values,key)||(!values[key].trim()&&source[key].trim()))throw Error('Missing English field: '+key+' in '+file);
 for(const [key,value] of Object.entries(values)){
  if(!fields.includes(key))throw Error('Unexpected translation field: '+key+' in '+file);
  if(value.length>200000)throw Error('Translation too long: '+file);
  object[key]=listFields.includes(key)?value.split('\n').filter(s=>s.trim()).map(s=>s.replace(/^[-*]\s+/,'').trim()):value;
 }
 return object;
}
function uiCatalog(file){
 const values=sections(file);if(!values)throw Error('Missing interface translation catalog');
 const map=Object.create(null);
 for(const block of Object.values(values)){
  const m=block.match(/^Italiano: (.+)\nEnglish: ([\s\S]+)$/);if(!m)throw Error('Malformed interface translation block');
  if(Object.hasOwn(map,m[1]))throw Error('Duplicate interface translation: '+m[1]);map[m[1]]=m[2].trim();
 }
 return map;
}
export function localiseData(root,data,language='it'){
 if(!languages.includes(language))throw Error('Unsupported language: '+language);
 data.language=language;data.site={...data.site,language};
 if(language==='it')return data;
 const base=path.join(root,'content/markdown/en');
 data.ui=uiCatalog(path.join(base,'interfaccia.md'));
 apply(path.join(base,'homepage.md'),data.home,Object.keys(data.home));
 apply(path.join(base,'profilo.md'),data.profile,['intro','biography','personalInterests','headline']);
 apply(path.join(base,'ricerca.md'),data.research,['title','subtitle','introduction','connectionsTitle','connections']);
 for(const area of data.research.areas)apply(path.join(base,'aree-ricerca',area.id+'.md'),area,['title','shortTitle','scope','summary','question','overview','approach','methods','activities'],['methods','activities']);
 for(const g of data.geometry.items)apply(path.join(base,'geometrie',g.id+'.md'),g,['titolo','tema','formula','spiegazione','limiti','fonti','osservazione','lettura']);
 for(const c of data.courses)apply(path.join(base,'courses',c.id+'.md'),c,['title','summary','university','department','description','credits','hours','materialsLabel','learningPath']);
 for(const l of data.lectures)apply(path.join(base,'lectures',l.id+'.md'),l,['title','summary','topics','body'],['topics']);
 const category={Libri:'Books',Articoli:'Articles',Conferenze:'Conference contributions',Capitoli:'Book chapters'};
 const basis={"Sinossi dell’editore":"Publisher’s synopsis","Abstract nell’archivio istituzionale UniMI":"Abstract in the UniMI institutional repository","Abstract nell’archivio istituzionale FAU":"Abstract in the FAU institutional repository","Abstract nell’archivio istituzionale UniMORE":"Abstract in the UniMORE institutional repository","Abstract BOA, consultato nel testo indicizzato":"BOA abstract, consulted in indexed text","Abstract dell’editore Springer":"Springer publisher’s abstract","Abstract AIR, consultato nel testo indicizzato":"AIR abstract, consulted in indexed text","Abstract nell’archivio istituzionale AIR":"Abstract in the AIR institutional repository","Abstract non reperito":"Abstract not located"};
 for(const pub of data.publications){
  apply(path.join(base,'publications',pub.id+'.md'),pub,['title','authors','where','plainTitle','plainSummary','explanation','bibliographicNote']);
  pub.category=category[pub.category]||pub.category;pub.readingBasis=basis[pub.readingBasis]||pub.readingBasis;
 }
 for(const post of data.posts){
  const f=path.join(base,'posts',post.id+'.md'),details=path.join(base,'post-details',post.id+'.md');
  if(!fs.existsSync(f)){post.translationMissing=true;post.body='An English translation has not yet been provided for this article.';post.excerpt=post.body;post.category='Article';post.subtitle='';continue;}
  let body=fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n');
  const front=body.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if(front){
   for(const line of front[1].split('\n')){if(!line.trim()||line.trim().startsWith('#'))continue;const m=line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);if(!m)throw Error('Invalid English post header');if(['title','subtitle','excerpt','category'].includes(m[1]))post[m[1]]=m[2].replace(/^(?:"(.*)"|'(.*)')$/,'$1$2');}
   body=front[2];
  }
  if(fs.existsSync(details))apply(details,post,['title','subtitle','excerpt','category','geometria']);
  post.body=body.trim();if(!post.body||post.body.length>200000)throw Error('Invalid English article body');
 }
 // Structured profile text remains editable without touching identity and resource fields.
 const records=sections(path.join(base,'profilo-dati.md'));if(!records)throw Error('Missing English CV records');
 for(const [key,text] of Object.entries(records)){
  if(['interests','skills','languages'].includes(key)){data.profile[key]=text.split('\n').filter(x=>x.trim()).map(x=>x.replace(/^[-*]\s+/,''));continue;}
  if(key==='project'){data.profile.project=text;continue;}
  let m=key.match(/^homepagePhoto_(alt|caption)$/);if(m){data.profile.homepagePhoto[m[1]]=text;continue;}
  m=key.match(/^(education|experience|teaching|theses|talks|personalPhotos)_(\d+)_(date|degree|title|institution|detail|event|category|caption|alt)$/);
  if(!m||!data.profile[m[1]][+m[2]])throw Error('Invalid English CV record: '+key);
  data.profile[m[1]][+m[2]][m[3]]=text;
 }
 const approved=new Set(data.profile.availablePersonalPhotos.map(p=>p.id));
 data.profile.availablePersonalPhotos=data.profile.personalPhotos.filter(p=>approved.has(p.id));
 const epigraphs=sections(path.join(base,'epigrafi.md'));if(!epigraphs)throw Error('Missing English epigraphs');
 for(const q of data.epigraphs){const lines=epigraphs[q.id]?.split('\n');if(!lines)throw Error('Missing English epigraph');q.quote=lines.filter(x=>/^>\s?/.test(x)).map(x=>x.replace(/^>\s?/, '')).join(' ').trim();q.source=lines.find(x=>/^Fonte: /.test(x))?.slice(7)||'';q.note=lines.find(x=>/^Nota: /.test(x))?.slice(6)||'';if(q.id==='platone')q.author='Plato';}
 return data;
}
// A closed catalogue translates interface text nodes, never arbitrary substrings in prose.
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
export function textFor(text,data){
 if(data.language!=='en')return text;
 const raw=decode(text),trimmed=raw.trim();
 const exact=data.ui?.[trimmed];if(exact!==undefined)return raw.replace(trimmed,exact);
 const marked=trimmed.match(/^([←↗]?\s*)(.*?)(\s*[↗↓]?)$/);if(marked&&data.ui?.[marked[2]])return marked[1]+data.ui[marked[2]]+marked[3];
 let m;
 if(m=trimmed.match(/^(\d+) (INSEGNAMENTI|PUBBLICAZIONI|MODULI|LEZIONI)$/))return `${m[1]} ${{INSEGNAMENTI:'COURSES',PUBBLICAZIONI:'PUBLICATIONS',MODULI:'MODULES',LEZIONI:'LESSONS'}[m[2]]}`;
 if(m=trimmed.match(/^(\d+) min di lettura$/))return `${m[1]} min read`;
 if(m=trimmed.match(/^A\.A\. (.+)$/))return `Academic year ${m[1]}`;
 if(m=trimmed.match(/^(Modulo|Lezione) (\d+)$/))return `${m[1]==='Modulo'?'Module':'Lesson'} ${m[2]}`;
 if(trimmed.startsWith('© '))return raw.replace('Sito personale, non istituzionale','Personal website, not an institutional site');
 if(trimmed.startsWith('ANTEPRIMA DI PROGETTO · '))return raw.replace('ANTEPRIMA DI PROGETTO','PROJECT PREVIEW');
 if(trimmed.startsWith('Bibliografia / '))return raw.replace('Bibliografia / ','Bibliography / ').replace(' riferimenti',' references');
 if(trimmed.startsWith('Lingue: '))return raw.replace('Lingue: ','Languages: ');
 if(trimmed.startsWith('Licenza indicata nel documento: '))return raw.replace('Licenza indicata nel documento: ','Licence stated in the document: ');
 if(trimmed.startsWith('Esplora ')&&trimmed.endsWith(': modello, formula e spiegazione'))return raw.replace(/^Esplora /,'Explore ').replace(': modello, formula e spiegazione',': model, formula and explanation');
 for(const [a,b] of [['Apri PDF: ','Open PDF: '],['Scarica PDF: ','Download PDF: '],['Apri ','Open ']])if(trimmed.startsWith(a))return raw.replace(a,b);
 if(/\d+ pagine PDF/.test(trimmed))return raw.replace(/(\d+) pagine PDF/,'$1 PDF pages');
 if(raw.includes(' · Anno accademico '))return raw.replace(' · Anno accademico ',' · Academic year ');
 // Only interface label composites have a slash delimiter in generated templates.
 if(trimmed.includes(' / '))return raw.split(' / ').map(part=>data.ui?.[part]??part).join(' / ');
 const arrow=trimmed.match(/^([←↗]?\s*)(.*?)(\s*[↗↓]?)$/);
 if(arrow&&data.ui?.[arrow[2]])return arrow[1]+data.ui[arrow[2]]+arrow[3];
 return raw;
}
export function localiseHtml(html,data){
 if(data.language!=='en')return html;
 let skip=0;
 return html.replace(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g,token=>{
  if(token.startsWith('<!--'))return token;
  if(token.startsWith('<')){
   if(/^<(script|style|pre|code)\b/i.test(token))skip++;
   if(/^<\/(script|style|pre|code)\s*>/i.test(token))skip=Math.max(0,skip-1);
   return token.replace(/\b(aria-label|title|placeholder|alt|content)="([^"]*)"/g,(m,k,v)=>`${k}="${e(textFor(v,data))}"`);
  }
  return skip?token:e(textFor(token,data));
 });
}
export function prefixResources(html,language){
 if(language!=='en')return html;
 return html.replace(/srcset="([^"]+)"/g,(_,value)=>'srcset="'+value.split(',').map(part=>part.trim().replace(/^media\//,'../media/')).join(', ')+'"').replace(/(?<![\w-])(href|src)="((?:media|geometry|assets|audio)\/[^"<>]+)"/g,(_,key,ref)=>`${key}="../${ref}"`);
}
export function languageSwitch(data,page){
 const lang=data.language||'it',file=page.file;
 return `<nav class="language-switch" aria-label="${lang==='en'?'Choose language':'Scegli la lingua'}">${languages.map(l=>`<a href="${lang===l?'':lang==='it'?'en/':'../'}${e(file)}" data-language="${l}" data-page="${e(file)}" lang="${l}" hreflang="${l}" aria-label="${l==='it'?'Italiano':'English'}"${lang===l?' aria-current="true"':''}>${l.toUpperCase()}</a>`).join('')}</nav>`;
}
