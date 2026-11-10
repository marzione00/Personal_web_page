import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {loadContent} from '../src/content.mjs';
import {loadGalaxies,galaxiesPage} from '../src/galaxies.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
import {searchEntries} from '../src/search.mjs';
import {validatePublicBoundary} from '../src/security.mjs';

const root=new URL('../',import.meta.url).pathname;
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('each galaxy resolves to one active laboratory and four real module routes',()=>{
 const data=loadContent(root);
 assert.deepEqual(data.galaxies.map(g=>g.app),['quantum-lab','geostat-lab']);
 for(const g of data.galaxies){
  const app=data.teachingApps.find(a=>a.id===g.app);assert.ok(app.enabled);
  assert.equal(g.routes.length,4);
  for(const r of g.routes)assert.equal(new URL(app.url+r.fragment).origin,new URL(app.url).origin);
 }
 assert.equal(data.teachingApps.find(a=>a.id==='geostat-lab').url,'https://marzione00.github.io/Lab_Geo/');
});

test('native galaxy choices expose one initial selection and labelled destination panels',()=>{
 for(const language of ['it','en']){
  const html=galaxiesPage(loadContent(root,{language}));
  assert.equal((html.match(/type="radio"/g)||[]).length,2);
  assert.equal((html.match(/ checked/g)||[]).length,1);
  assert.equal((html.match(/<fieldset/g)||[]).length,1);
  assert.match(html,/<legend class="visually-hidden">/);
  for(const id of ['quantum-lab','geostat-lab']){
   assert.ok(html.includes(`aria-controls="mission-${id}"`));
   assert.ok(html.includes(`id="mission-${id}"`));
   assert.ok(html.includes(`aria-labelledby="mission-title-${id}"`));
  }
  assert.doesNotMatch(html,/<canvas|<script|<iframe|style=|onclick=/);
 }
});

test('galaxy entry and route links share the five-second terminal contract',()=>{
 const html=galaxiesPage(loadContent(root));
 const links=[...html.matchAll(/<a[^>]+data-app-launch[^>]+>/g)].map(m=>m[0]);
 assert.equal(links.length,10);
 for(const link of links){assert.match(link,/href="https:\/\//);assert.match(link,/data-launch-id="(?:quantum|geostat)-lab"/);assert.doesNotMatch(link,/target=/);}
 assert.ok(links.some(a=>a.includes('Lab_Geo/#modulo-M11')));
 assert.ok(links.some(a=>a.includes('QuantumLab_Public/#modulo-5')));
});

test('galaxy page and home are bilingual and share existing single-instance dialogs',()=>{
 for(const language of ['it','en']){
  const data=loadContent(root,{language}),pages=renderPages(data),page=pages.find(p=>p.file==='laboratori.html');
  assert.ok(page);assert.equal(page.section,'didattica.html');
  const html=shellHtml({data,page,css:'',js:'',csp:''});
  assert.equal((html.match(/data-app-launch-dialog/g)||[]).length,1);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
  assert.ok(html.includes(language==='en'?'Galaxies to explore':'Galassie da esplorare'));
  assert.ok(html.includes(`src="${language==='en'?'../':''}assets/labs/galaxy-geostat.svg"`));
  if(language==='en')assert.doesNotMatch(page.body,/Seleziona una galassia|Entra nella galassia|Percorsi da esplorare/);
  const home=pages.find(p=>p.file==='index.html').body;
  assert.match(home,/href="laboratori.html"/);assert.match(home,/data-launch-id="geostat-lab"/);
 }
});

test('search includes both laboratories, their descriptions and geology aliases',()=>{
 const rows=searchEntries(loadContent(root));
 const geo=rows.find(r=>r.title==='GeoStat Lab');assert.ok(geo);
 assert.match(geo.context,/statistici|statistica/);assert.match(geo.keywords,/geologia/);
 assert.equal(rows.filter(r=>r.url==='laboratori.html').length,1);
 assert.equal(rows.filter(r=>r.url==='didattica.html#laboratorio-geostat-lab').length,1);
});

test('galaxy catalogue rejects duplicate themes, unsafe fragments and missing translations',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'galaxy-'));
 fs.mkdirSync(path.join(tmp,'content'));
 try{
  for(const change of [d=>d.galaxies[1].theme='quantum',d=>d.galaxies[0].routes[0].fragment='https://example.com',d=>delete d.galaxies[0].routes[0].title.en,d=>d.galaxies[1].app='quantum-lab']){
   const data=JSON.parse(read('content/galaxies.json'));change(data);
   fs.writeFileSync(path.join(tmp,'content/galaxies.json'),JSON.stringify(data));
   assert.throws(()=>loadGalaxies(tmp),/Galassie:/);
  }
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

test('procedural navigation artwork stays self-contained and animation respects motion settings',()=>{
 assert.doesNotThrow(()=>validatePublicBoundary(root));
 for(const file of ['galaxy-quantum','galaxy-geostat','star-field']){
  const svg=read(`public/assets/labs/${file}.svg`);
  assert.doesNotMatch(svg,/<(?:script|image|foreignObject|text|animate)\b|\son\w+=|href=/i);
  assert.match(svg,/<circle/);assert.match(svg,/viewBox=/);
 }
 const css=read('src/galaxies.css');
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/html\[data-fx-motion=off\]/);
 assert.match(css,/:has\(input:focus-visible\)/);
 assert.match(css,/\.lab-hub:has\(\.lab-destination-geostat input:checked\) \.lab-mission-geostat/);
});
