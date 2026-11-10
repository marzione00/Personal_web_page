import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {renderPages} from '../src/render.mjs';
import {geometryInfo} from '../src/geometry.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const graphs=JSON.parse(fs.readFileSync(new URL('../source-materials/carbon/models.json',import.meta.url)));
const degree=g=>g.points.map((_,i)=>g.edges.filter(e=>e.includes(i)).length);
const length=(g,[a,b])=>Math.hypot(...g.points[a].map((v,k)=>v-g.points[b][k]));
test('C60 is a connected trivalent cage with twelve pentagons and twenty hexagons',()=>{
 const g=graphs['fullerene-cage'];assert.equal(g.points.length,60);assert.equal(g.edges.length,90);
 assert.equal(g.faces.filter(f=>f.length===5).length,12);assert.equal(g.faces.filter(f=>f.length===6).length,20);
 assert.ok(degree(g).every(d=>d===3));assert.equal(g.points.length-g.edges.length+g.faces.length,2);
 const seen=new Set([0]);for(let pass=0;pass<60;pass++)for(const[a,b]of g.edges)if(seen.has(a)||seen.has(b)){seen.add(a);seen.add(b);}assert.equal(seen.size,60);
 for(const f of g.faces)for(let i=0;i<f.length;i++)assert.ok(g.edges.some(e=>e.includes(f[i])&&e.includes(f[(i+1)%f.length])));
});
test('both ribbon edges have complete hexagons, unit nearest-neighbour bonds and correct rim patterns',()=>{
 for(const id of ['carbon-nanoribbon','carbon-zigzag']){const g=graphs[id];assert.ok(g.faces.every(f=>f.length===6));assert.ok(degree(g).every(n=>n===2||n===3));assert.ok(g.edges.every(e=>Math.abs(length(g,e)-1)<1e-6));}
 const pairs=id=>{const g=graphs[id],d=degree(g);return g.edges.filter(([a,b])=>d[a]===2&&d[b]===2&&g.points[a][1]>2&&g.points[b][1]>2).length;};
 assert.ok(pairs('carbon-nanoribbon')>=4);assert.equal(pairs('carbon-zigzag'),0);
});
test('the twisted ribbon preserves its graph while explicitly changing its geometry',()=>{
 const a=graphs['carbon-nanoribbon'],b=graphs['twisted-nanoribbon'];assert.deepEqual(a.edges,b.edges);assert.deepEqual(a.faces,b.faces);
 assert.ok(b.points.some(p=>Math.abs(p[2])>1));assert.ok(b.edges.some(e=>Math.abs(length(b,e)-1)>.01));
});
test('bilayer shifts preserve two disconnected carbon sheets and their internal distances',()=>{
 const a=graphs['bilayer-nanoflake'],b=graphs['bilayer-aligned'];assert.equal(a.points.length,80);assert.deepEqual(a.edges,b.edges);
 for(const e of a.edges){assert.equal(a.layers[e[0]],a.layers[e[1]]);assert.ok(Math.abs(length(a,e)-1)<1e-6);}
 a.points.forEach((p,i)=>{assert.ok(Math.abs(p[0]-b.points[i][0]-a.layers[i])<1e-6);assert.equal(p[2],b.points[i][2]);});
});
test('all carbon views receive the requested language without title-based inference',()=>{
 const data=loadContent(root,{language:'en'});
 for(const [id,label]of [['carbon-nanoribbon','Armchair edge'],['bilayer-nanoflake','Shifted layers'],['schwarzite-neck','Carbon lattice']]){
  const html=geometryInfo(data.geometry.byId[id],{language:'en'});assert.ok(html.includes(label));assert.ok(html.includes('Geometry views'));assert.ok(!html.includes('Viste della geometria'));
 }
});
test('carbon geometry is distributed with explanations, fallback links and relevant publications',()=>{
 for(const language of ['it','en']){
  const data=loadContent(root,{language}),pages=renderPages(data),home=pages.find(p=>p.file==='index.html').body,physics=pages.find(p=>p.file==='tema-fisica-nanostrutture.html').body,research=pages.find(p=>p.file==='ricerca.html').body;
  assert.ok(home.includes('data-geometry="fullerene-cage"'));assert.ok(home.includes('data-geometry="carbon-nanoribbon"'));
  for(const id of ['carbon-nanoribbon','twisted-nanoribbon','bilayer-nanoflake','schwarzite-neck'])assert.ok(physics.includes(`data-geometry="${id}"`));
  assert.ok(research.includes('data-geometry="bilayer-nanoflake"'));assert.ok(research.includes('href="geometrie.html#twisted-nanoribbon"'));
  assert.equal(data.geometry.items.length,28);
 }
});
