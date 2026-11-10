import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {loadContent} from '../src/content.mjs';
import {cyberNetworkMarkup,cyberNetworkDialog} from '../src/cyber-network.mjs';
import {searchEntries} from '../src/search.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=loadContent(root),g=data.cyberNetwork.graph;
test('propagation follows a connected graph with increasing arrival times',()=>{
 assert.equal(g.arrival.length,96);assert.equal(g.arrival[g.origin],0);assert.ok(g.arrival.every(Number.isFinite));
 const seen=new Set();for(const e of g.edges){const k=[Math.min(e.a,e.b),Math.max(e.a,e.b)].join(':');assert.ok(!seen.has(k));seen.add(k);assert.ok(e.a!==e.b);assert.ok(e.weight>0);}
 for(let i=0;i<g.parent.length;i++){const p=g.parent[i];if(i===g.origin){assert.equal(p,null);continue;}assert.ok(p);assert.ok(g.arrival[p.from]<g.arrival[i]);const edge=g.edges[p.edge];assert.ok([edge.a,edge.b].includes(p.from)&&[edge.a,edge.b].includes(i));}
 assert.ok(g.arrival.some(t=>t>14.4));assert.ok(g.arrival.filter(t=>t<=14.4).length>10);
});
test('the illustration contains no captions or preview controls and keeps a non-JS explanation link',()=>{
 const h=cyberNetworkMarkup(data);assert.match(h,/href="geometrie.html#cyber-network"/);assert.match(h,/aria-haspopup="dialog"/);assert.match(h,/cyber-hit-mark/);assert.match(h,/class="cyber-node is-hit"/);
 assert.doesNotMatch(h,/<(?:text|foreignObject|image|script|button|select|input)\b|\b(?:preview|studio 02|avanzamento|ogni connessione)\b/i);
 assert.equal((h.match(/data-cyber-arrival=/g)||[]).length,96);
});
test('IT and EN explanations distinguish asset topology, attack paths and illustrative timing',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language}),h=cyberNetworkDialog(d);assert.match(h,/G = \(V, E\)/);assert.match(h,/NIST IR 7788/);assert.match(h,/cyber-key-hit/);assert.match(h,/data-cyber-close/);assert.doesNotMatch(h,/preview|anteprima|v3\.10/i);}
 assert.match(data.cyberNetwork.copy.rete,/grafo d’attacco/);assert.match(data.cyberNetwork.copy.figura,/non mostra attacchi osservati/);
});
test('cybersecurity uses one graph and all 24 mathematical models remain in the atlas',()=>{
 const pages=renderPages(data),page=pages.find(p=>p.file==='tema-cybersecurity.html'),atlas=pages.find(p=>p.file==='geometrie.html');
 assert.equal((page.body.match(/data-cyber-open/g)||[]).length,1);assert.doesNotMatch(page.body,/data-geometry="entropy-trace"/);
 assert.match(atlas.body,/id="cyber-network"/);assert.equal(searchEntries(data).filter(x=>x.url==='geometrie.html#cyber-network').length,1);assert.match(atlas.body,/data-geometry="entropy-trace"/);
 assert.equal((shellHtml({data,page,css:'',js:'',csp:"default-src 'none'"}).match(/id="cyber-dialog"/g)||[]).length,1);
});
test('production pages do not expose revision labels or the discarded graph-preview interface',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language});for(const p of renderPages(d)){const h=shellHtml({data:d,page:p,css:'',js:'',csp:"default-src 'none'"});assert.doesNotMatch(h,/ANTEPRIMA DI PROGETTO|STUDIO 02|Ogni connessione apre|TEMPO DELLA SCENA|NODI RAGGIUNTI|La precedente composizione|The earlier composition|con questa revisione|This release introduces|(?:inclus[oa] nel progetto|included in the project)/i,language+'/'+p.file);}}
 const build=fs.readFileSync(root+'scripts/build.mjs','utf8');for(const f of ['cyber-network.css','cyber-network.js'])assert.equal(build.split("'"+f+"'").length-1,1);
});
