import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const c=loadContent(root),pages=new Map(renderPages(c).map(p=>[p.file,p.body]));
const get=id=>c.publications.find(p=>p.id===id);

test('release version matches package and public content',()=>{
 assert.equal(c.site.version,'1.4');
 assert.equal(JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,'1.4.0');
});
test('revised teaching lineage is grounded in the author updates',()=>{
 const text=c.profile.personalInterests;
 for(const name of ['Giada Merli','Alessandra Martin','Alexandra Santos','Camilla Vigorelli','Luca Pani'])assert.match(text,new RegExp(name));
 assert.match(text,/Teacher Training di 60 ore/);
 assert.match(text,/nel 2026, ha seguito anche un Teacher Training di 60 ore/);
 assert.match(text,/con lei, nel 2026/);
  assert.match(text,/arrampicata indoor/);
 assert.match(text,/Con Alexandra Santos.*?prosegue ancora oggi/s);
});
test('public biography and research stay free of stale meta-narration',()=>{
 const z=[c.profile.biography,c.research.introduction,c.research.connections,...c.research.areas.flatMap(a=>[a.overview,a.approach])].join(' ');
 assert.doesNotMatch(z,/nel curriculum|il curriculum comprende|le sezioni successive|la sezione raccoglie|questa attività viene distinta|per approfondire il programma/i);
 assert.match(c.profile.biography,/insegna Informatica come docente a contratto/);
});
test('2026–2027 ongoing courses are retained and no old pending warning remains',()=>{
 assert.equal(c.courses.filter(x=>x.academicYear==='2026/2027'&&x.verified).length,3);
 const p=fs.readFileSync(path.join(root,'docs/PROVENIENZA.md'),'utf8');
 assert.doesNotMatch(p,/da riconfermare e non entra nella build pubblica/);
 assert.match(p,/conferme dirette dell.autore/);
});
test('official archive bibliographies are differentiated from conference year',()=>{
 assert.equal(get('pub-08').year,'2013');
 assert.match(get('pub-08').where,/9–17/);
 assert.match(get('pub-08').bibliographicNote,/una citazione precedente indica 2012/);
 assert.equal(get('pub-09').year,'2027');
 assert.match(get('pub-09').bibliographicNote,/ANNPR nell.ottobre 2026/);
 assert.match(pages.get('ricerca.html'),/Nota bibliografica: l.archivio BOA/);
});
test('resource page warns the existing CV PDF predates current teaching',()=>{
 assert.match(pages.get('risorse.html'),/versione precedente del curriculum/);
 assert.match(pages.get('cv.html'),/PDF precedente agli aggiornamenti delle docenze/);
});
test('course without attached slides does not advertise a download',()=>{
 assert.match(pages.get('didattica.html'),/SCHEDA SENZA ALLEGATI/);
 assert.match(pages.get('corso-quantum-post-quantum-computing-2026-2027.html'),/7<\/strong><span>moduli/);
});
test('all seven quantum PDF originals match the packaged manifest',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'docs/MATERIALI_MANIFEST.json')));
 for(const item of manifest.files){
  const paths=[];
  for(const sub of ['media/docs/quantum-2026-2027','media/docs','media/quantum','media/teaching']){
   const candidate=path.join(root,'public',sub,item.filename);if(fs.existsSync(candidate))paths.push(candidate);
  }
  assert.ok(paths.length>0,'missing '+item.filename);
  const digest=createHash('sha256').update(fs.readFileSync(paths[0])).digest('hex');
  assert.equal(digest,item.sha256);
 }
});
test('blog demonstration remains unpublished',()=>{
 const x=c.posts.filter(x=>x.demo);
 assert.equal(x.length,0);
 assert.match(pages.get('blog.html'),/Nessun articolo pubblicato/);
});
