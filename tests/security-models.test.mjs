import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadContent} from '../src/content.mjs';
import {geometryMarkup} from '../src/geometry.mjs';
const root=new URL('../',import.meta.url).pathname;
const models=JSON.parse(fs.readFileSync(new URL('../source-materials/security-models/models.json',import.meta.url)));

test('probabilistic communities have an explicit connected graph and six genuine bridges',()=>{
 const g=models['markov-network'];assert.equal(g.points.length,126);assert.equal(g.edges.length,366);assert.equal(g.bridges.length,6);
 const ids=new Set(g.edges.map(([a,b])=>[a,b].sort((x,y)=>x-y).join(':')));assert.equal(ids.size,g.edges.length);
 assert.ok(g.points.every(p=>p.length===3&&p.every(Number.isFinite)));
 const reached=new Set([0]);let previous=0;while(previous!==reached.size){previous=reached.size;for(const [a,b] of g.edges){if(reached.has(a))reached.add(b);if(reached.has(b))reached.add(a);}}
 assert.equal(reached.size,g.points.length);
 const bridges=g.edges.filter(([a,b])=>g.communities[a]!==g.communities[b]);assert.deepEqual(bridges,g.bridges);
});
test('the execution model has directed branches and a valid highlighted entry-to-exit path',()=>{
 const g=models['program-flow'];assert.equal(g.points.length,10);assert.equal(g.edges.length,11);assert.equal(g.directed,true);
 assert.ok(g.edges.every(([a,b])=>a<b),'this illustrative model is acyclic');
 for(let i=1;i<g.highlightedPath.length;i++)assert.ok(g.edges.some(([a,b])=>a===g.highlightedPath[i-1]&&b===g.highlightedPath[i]));
 assert.equal(g.highlightedPath[0],0);assert.equal(g.highlightedPath.at(-1),9);
 assert.equal(g.edges.filter(([a])=>a===1).length,3);assert.equal(g.edges.filter(([,b])=>b===8).length,3);
});
test('surface contours exactly follow the analytical probabilities throughout the declared domain',()=>{
 const g=models['decision-surface'];assert.deepEqual([...new Set(g.contours.map(c=>c.level))],[.2,.5,.8]);
 const high=g.contours.find(c=>c.level===.8);assert.equal(high.points.length,61);assert.equal(high.points[0][2],-1.7);assert.equal(high.points.at(-1)[2],1.7);
 for(const c of g.contours)for(const [x,height,y] of c.points){
  const probability=1/(1+Math.exp(-(1.2*x-.5*y+.45*x*y)));
  assert.ok(Math.abs(probability-c.level)<1e-12);assert.ok(Math.abs(height-(2.5*(c.level-.5)+.027))<1e-12);
  assert.ok(x>=g.domain[0][0]&&x<=g.domain[0][1]&&y>=g.domain[1][0]&&y<=g.domain[1][1]);
 }
});
test('the smooth delay trace preserves the original signal and lag instead of inventing an attractor',()=>{
 const g=models['entropy-trace'],signal=t=>Math.sin(t)+.34*Math.sin(3.3*t)+.07*Math.sin(19*t);
 assert.equal(g.referenceSamples,180);assert.equal(g.renderSamples,601);assert.equal(g.entropyEstimated,false);
 assert.ok(Math.abs(g.delay-6*7*Math.PI/179)<1e-12);
 g.points.forEach((p,i)=>p.forEach((value,k)=>assert.ok(Math.abs(value-1.22*signal(i/(g.points.length-1)*(7*Math.PI-2*g.delay)+k*g.delay))<1e-12)));
});
test('volumetric atlas scenes share the same ambient preview contract',()=>{
 const data=loadContent(root),ambient=data.geometry.items.filter(g=>/data-geometry-ambient/.test(geometryMarkup(data,g.id)));
 assert.equal(ambient.length,27);
 assert.ok(!ambient.some(g=>g.id==='julia'));
 for(const id of Object.keys(models)){
  const html=geometryMarkup(data,id);assert.match(html,/data-geometry-ambient/);assert.doesNotMatch(html,/data-carbon-lattice/);
  assert.equal(data.geometry.byId[id].ambientMotion,true);
 }
});
