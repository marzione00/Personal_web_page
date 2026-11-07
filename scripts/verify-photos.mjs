import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'content/photo-manifest.json'),'utf8'));
for(const entry of manifest){
 if(!/^media\/images\/[a-z0-9-]+\.jpg$/.test(entry.path))throw new Error('Percorso foto non valido');
 for(const dir of ['public','dist','preview']){
  const file=path.join(root,dir,entry.path);if(dir!=='public'&&!fs.existsSync(path.join(root,dir)))continue;
  const buf=fs.readFileSync(file),sha=createHash('sha256').update(buf).digest('hex');
  if(sha!==entry.sha256||buf.length!==entry.bytes)throw new Error('Foto modificata: '+file);
 }
}
console.log(`${manifest.length} fotografie: file originali integri (SHA-256), nessuna ricodifica.`);
