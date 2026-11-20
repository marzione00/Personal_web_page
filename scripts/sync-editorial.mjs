import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {loadContent}=await import('../src/content.mjs');
const {profile,research}=loadContent(root);
const bio=['# Marzio De Corato — Biografia accademica',profile.biography,'## Interessi personali',profile.personalInterests,'## Presentazione del profilo',profile.intro].join('\n\n')+'\n';
const areas=research.areas.map(a=>['## '+a.title,a.scope,'**Questione:** '+a.question,a.overview,a.approach,...(a.activities.length?['**Attività collegate**',...a.activities.map(x=>'- '+x)]:[])].join('\n\n'));
const res=['# Ricerca — temi, metodi e riferimenti',research.introduction,...areas,'## '+research.connectionsTitle,research.connections].join('\n\n')+'\n';
const docs=[['docs/BIOGRAFIA.md',bio],['docs/RICERCA.md',res]];
let differs=false;
for(const [filename,body] of docs){const target=path.join(root,filename);if(process.argv.includes('--check')){if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==body){console.error('Documento non sincronizzato:',filename);differs=true;}}else{fs.writeFileSync(target,body,'utf8');console.log('Allineato:',filename);}}
for(const language of ['it','en']){
 const directory=path.join(root,'src','scientific-articles');
 const suffix=language==='en'?'.en':'';
 const fingerprint=JSON.parse(fs.readFileSync(path.join(directory,'lequilibrio-sul-tappetino'+suffix+'.build.json'),'utf8'));
 const stale=Object.entries(fingerprint).filter(([file,hash])=>{
  const source=path.join(root,file);
  return !fs.existsSync(source)||createHash('sha256').update(fs.readFileSync(source)).digest('hex')!==hash;
 });
 if(stale.length){
  console.error(`Saggio da rigenerare: python3 scripts/import-equilibrium.py --language ${language}`);
  for(const [file] of stale)console.error('  '+file);
  differs=true;
 }
}
if(differs)process.exitCode=1;
