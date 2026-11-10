import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const model=JSON.parse(fs.readFileSync(new URL('../source-materials/schwarzite/p688.json',import.meta.url)));
const manifest=JSON.parse(fs.readFileSync(new URL('../public/geometry/manifest.json',import.meta.url)));
test('P688 reference neck preserves the crystallographic carbon positions and first-neighbour bonds',()=>{
 const raw=model.context.atoms.map(p=>p.map(x=>x*1.5+1.5));
 const selected=raw.filter(p=>Math.abs(p[0]-1.5)<.30&&Math.abs(p[1]-1)<.49&&Math.abs(p[2]-1)<.49);
 assert.equal(selected.length,24);assert.equal(model.bonds.length,28);
 selected.forEach((p,i)=>{const q=[(p[1]-1)*3,(p[2]-1)*3,(p[0]-1.5)*3];q.forEach((x,k)=>assert.ok(Math.abs(x-model.atomPositions[i][k])<1e-6));});
 for(const[a,b]of model.bonds){const length=Math.hypot(...model.atomPositions[a].map((v,i)=>v-model.atomPositions[b][i]))/3*7.828;assert.ok(length>1.451&&length<1.468);}
});
test('the nodal neck has negative Gaussian curvature across its displayed surface',()=>{
 for(const p of model.mesh){const q=[p[2]/3+.5,p[0]/3,p[1]/3],c=q.map(x=>Math.cos(2*Math.PI*x)),g=q.map(x=>-2*Math.PI*Math.sin(2*Math.PI*x)),h=c.map(x=>-4*Math.PI*Math.PI*x);
  assert.ok(Math.abs(c.reduce((a,b)=>a+b,0))<3e-6);
  const K=(g[0]**2*h[1]*h[2]+g[1]**2*h[0]*h[2]+g[2]**2*h[0]*h[1])/(g.reduce((s,x)=>s+x*x,0)**2);assert.ok(K<0);
 }
});
test('all Schwarzite views are bounded, uniquely addressed and hash verified',()=>{
 const entry=manifest.find(g=>g.id==='schwarzite-neck');assert.ok(entry);assert.equal(entry.views.length,3);assert.ok(!manifest.some(g=>g.id==='graphene-ribbon'));
 for(const v of entry.views){const raw=fs.readFileSync(new URL('../public/geometry/'+v.scene,import.meta.url));assert.equal(raw.toString('ascii',0,4),'MDC3');assert.ok(raw.length<(v.id==='schwarzite-lattice'?300000:210000));assert.ok(v.vertices<60000);assert.ok(v.triangles*3<=180000);assert.equal(createHash('sha256').update(raw).digest('hex'),v.sceneSha256);assert.equal(raw.readUInt32LE(4),v.vertices);assert.equal(raw.readUInt32LE(8),v.triangles*3);}
 for(const file of ['../public/geometry/graphene-ribbon.webp','../public/geometry/scenes/graphene-ribbon.bin','../content/markdown/geometrie/graphene-ribbon.md'])assert.ok(!fs.existsSync(new URL(file,import.meta.url)));
});

test('the initial carbon view contains complete hexagons instead of the former octagon-only crop',()=>{
 const raw=model.context.atoms.map(p=>p.map(x=>x*1.5+1.5));
 const keep=new Set(raw.flatMap((p,i)=>p.every(x=>x>.5&&x<2.5)?[i]:[]));
 const rings=model.context.faces.filter(f=>f.every(i=>keep.has(i)));
 const entry=manifest.find(g=>g.id==='schwarzite-neck');
 assert.equal(keep.size,384);assert.equal(rings.filter(f=>f.length===6).length,64);assert.equal(rings.filter(f=>f.length===8).length,48);
 assert.equal(entry.carbonAtoms,keep.size);assert.equal(entry.completeHexagons,64);assert.equal(entry.views[0].label.it,'Reticolo carbonioso');assert.deepEqual(entry.cellRepeats,[2,2,2]);
 const lookup=new Set(raw.map(p=>p.map(v=>v.toFixed(5)).join(',')));
 for(const i of keep)for(let axis=0;axis<3;axis++){const q=raw[i].slice();q[axis]+=q[axis]<1.5?1:-1;assert.ok(lookup.has(q.map(v=>v.toFixed(5)).join(',')));}
 assert.equal(entry.views[2].carbonAtoms,1296);assert.deepEqual(entry.views[2].cellRepeats,[3,3,3]);
});
