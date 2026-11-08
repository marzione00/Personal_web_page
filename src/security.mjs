import fs from 'node:fs';import path from 'node:path';import {safeMedia} from './safety.mjs';
const MiB=1024*1024;
export function inspectTree(folder,{maxFile=25*MiB,maxTotal=768*MiB,maxFiles=12000,accept=()=>true}={}){
 const root=path.resolve(folder);let files=0,bytes=0;
 function walk(dir,depth=0){if(depth>18)throw Error('Albero troppo profondo');if(fs.lstatSync(dir).isSymbolicLink())throw Error('Link simbolico non consentito');
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name),s=fs.lstatSync(p);if(s.isSymbolicLink()||(!s.isFile()&&!s.isDirectory()))throw Error('Risorsa non regolare: '+p);if(s.isDirectory()){walk(p,depth+1);continue;}const rel=path.relative(root,p).split(path.sep).join('/');if(!accept(rel))throw Error('File non ammesso: '+rel);if(++files>maxFiles||(bytes+=s.size)>maxTotal||s.size>maxFile)throw Error('Budget file superato: '+rel);}}
 walk(root);return {files,bytes};
}
export function validateSourceBoundary(root){return inspectTree(path.join(root,'content'),{maxFile:2*MiB,maxTotal:32*MiB,maxFiles:2500,accept:r=>r==='.gitkeep'||/^(?!.*(?:^|\/)\.)[a-zA-Z0-9_/-]+\.(?:json|md)$/.test(r)||/\/\.gitkeep$/.test(r)});}
export function validatePublicBoundary(root){
 const result=inspectTree(path.join(root,'public'),{accept:r=>r.endsWith('/.gitkeep')||safeMedia(r)!==null||/^geometry\/(?:manifest\.json|[a-z-]+\.(?:webp|svg)|scenes\/[a-z-]+\.bin)$/.test(r)||r==='assets/geometry-viewer.js'||r==='audio/local-coordinates.mp3'});
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));if(!Array.isArray(manifest)||manifest.length<1||manifest.length>150)throw Error('Manifest non valido');
 const allowed=new Set(['manifest.json']),ids=new Set();for(const g of manifest){if(!/^[a-z]+(?:-[a-z]+)*$/.test(g.id)||ids.has(g.id)||g.file!==g.id+'.webp'||g.scene!==`scenes/${g.id}.bin`||!['sha256','sceneSha256'].every(k=>/^[a-f0-9]{64}$/.test(g[k])))throw Error('Manifest geometria non valido');ids.add(g.id);allowed.add(g.file);allowed.add(g.scene);}
 inspectTree(path.join(root,'public/geometry'),{maxFile:2*MiB,maxTotal:32*MiB,maxFiles:400,accept:r=>allowed.has(r)});return result;
}
