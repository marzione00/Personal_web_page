import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadTravels,readTravelIndex} from '../src/travel.mjs';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=(dir,rel)=>path.join(dir,rel);
const page=(data,name)=>renderPages(data).find(p=>p.file===name)?.body||'';
const photoName='media/images/viaggi/cammino-prova/foto-01.jpg';
const writeTrip=(dir,{draft='false',photo=true,en=true,corrupt=false}={})=>{
 const travelDir=file(dir,'content/markdown/viaggi'),enDir=file(dir,'content/markdown/en/viaggi');
 fs.mkdirSync(travelDir,{recursive:true});fs.mkdirSync(enDir,{recursive:true});
 const album=photo?'\n\n## Album\n\n![Il panorama tra le rocce]('+ (corrupt?'media/images/viaggi/cammino-prova/../una.jpg':photoName)+')\n':'';
 const text=`---\ntitle: Sentiero di prova\ndate: 2026-11-07\nkind: Escursione\nplace: Un paesaggio di montagna\nexcerpt: Un breve diario fittizio usato soltanto nei test.\ndraft: ${draft}\n---\n\nQuesto è un diario fittizio, mai consegnato nel sito.\n${album}`;
 fs.writeFileSync(file(travelDir,'cammino-prova.md'),text);
 if(en)fs.writeFileSync(file(enDir,'cammino-prova.md'),`---\ntitle: Example trail\ndate: 2026-11-07\nkind: Hike\nplace: A mountain landscape\nexcerpt: A synthetic diary used only by automated tests.\ndraft: ${draft}\n---\n\nThis is an English testing diary, not public content.\n${photo?'\n## Album\n\n![Mountain scenery]('+photoName+')\n':''}`);
};
function fixture(fn){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mdc-travels-'));
 try{
  fs.cpSync(file(root,'content'),file(dir,'content'),{recursive:true});
  fs.cpSync(file(root,'public'),file(dir,'public'),{recursive:true});
  return fn(dir);
 } finally {fs.rmSync(dir,{recursive:true,force:true});}
}
test('Travel section has an honest empty state and remains reachable from the profile',()=>{
 assert.equal(loadTravels(root).length,0);
 assert.equal(readTravelIndex(root).titolo,'Viaggi ed escursioni');
 assert.equal(readTravelIndex(root,'en').titolo,'Travels & Hikes');
 const it=loadContent(root),en=loadContent(root,{language:'en'});
 assert.match(page(it,'viaggi.html'),/pubblicazione del primo diario/);
 assert.match(page(en,'viaggi.html'),/publication of its first diary/);
 const profile=page(it,'cv.html');
 assert.match(profile,/href="viaggi\.html"/);
 assert.doesNotMatch(page(it,'index.html'),/href="viaggi\.html"/);
});
test('Draft diary can reference photos not yet uploaded, but cannot leak into public pages',()=>fixture(dir=>{
 writeTrip(dir,{draft:'true'});
 assert.equal(loadTravels(dir).length,0);
 assert.equal(loadTravels(dir,{preview:true}).length,1);
 assert.equal(loadTravels(dir,{preview:true})[0].missingPhotoCount,1);
 assert.ok(!page(loadContent(dir),'viaggi.html').includes('Sentiero di prova'));
 assert.match(page(loadContent(dir,{preview:true}),'viaggio-cammino-prova.html'),/Bozza non pubblicata/);
}));
test('Publishing a missing photo fails safely rather than showing a broken image',()=>fixture(dir=>{
 writeTrip(dir,{draft:'false'});
 assert.throws(()=>loadTravels(dir),/Foto non caricata/);
}));
test('Published diary, its album and both languages render from Markdown only',()=>fixture(dir=>{
 writeTrip(dir);
 const dest=file(dir,'public/'+photoName);fs.mkdirSync(path.dirname(dest),{recursive:true});
 fs.copyFileSync(file(root,'public/media/images/yoga-in-vetta.jpg'),dest);
 const data=loadContent(dir),en=loadContent(dir,{language:'en'});
 const index=page(data,'viaggi.html'),detail=page(data,'viaggio-cammino-prova.html');
 assert.match(index,/Sentiero di prova/);
 assert.match(index,/cammino-prova\.html/);
 assert.match(detail,/Questo è un diario fittizio/);
 assert.match(detail,/data-travel-photo/);
 assert.match(detail,/foto-01\.jpg/);
 assert.match(page(en,'viaggio-cammino-prova.html'),/English testing diary/);
 assert.match(page(en,'viaggio-cammino-prova.html'),/Mountain scenery/);
 assert.ok(renderPages(data).some(p=>p.file==='viaggio-cammino-prova.html'));
 const md=file(dir,'content/markdown/viaggi/cammino-prova.md');
 fs.writeFileSync(md,fs.readFileSync(md,'utf8').replace('Questo è un diario fittizio','Testo modificato direttamente in Markdown'));
 assert.match(page(loadContent(dir),'viaggio-cammino-prova.html'),/Testo modificato direttamente in Markdown/);
}));
test('Missing English translation yields an honest notice and an Italian-language link',()=>fixture(dir=>{
 writeTrip(dir,{photo:false,en:false});
 const en=loadContent(dir,{language:'en'});
 assert.equal(en.travels.length,1);
 assert.match(page(en,'viaggio-cammino-prova.html'),/not yet been translated/);
 assert.match(page(en,'viaggio-cammino-prova.html'),/\.\.\/viaggio-cammino-prova\.html/);
}));
test('Travel albums reject path traversal, duplicate images and untrusted external references',()=>fixture(dir=>{
 writeTrip(dir,{corrupt:true});
 assert.throws(()=>loadTravels(dir),/Nell’album usare solo|Immagine non valida/);
 const md=file(dir,'content/markdown/viaggi/cammino-prova.md');
 fs.writeFileSync(md,fs.readFileSync(md,'utf8').replace('![Il panorama tra le rocce](media/images/viaggi/cammino-prova/../una.jpg)','![Un panorama](https://example.org/tracker.png)'));
 assert.throws(()=>loadTravels(dir),/Nell’album usare solo/);
}));
