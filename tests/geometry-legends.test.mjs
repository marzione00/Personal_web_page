import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {loadContent} from '../src/content.mjs';
import {geometryInfo,geometryLegendGroups} from '../src/geometry.mjs';
const root=new URL('../',import.meta.url).pathname;
const it=loadContent(root),en=loadContent(root,{language:'en'});
const loader=fs.readFileSync(new URL('../src/geometry-loader.js',import.meta.url),'utf8');

test('all 32 scene variants have exactly one key with matching IT/EN meaning and colours',()=>{
 let total=0;
 for(const g of it.geometry.items){
  const a=geometryLegendGroups(g),b=geometryLegendGroups(en.geometry.byId[g.id]);
  const ids=[...new Set([g.id,...(g.views||[]).map(v=>v.id)])];
  assert.deepEqual(a.flatMap(k=>k.ids).sort(),ids.sort());
  assert.deepEqual(a.map(k=>[k.ids,k.entries.map(e=>e.colour)]),b.map(k=>[k.ids,k.entries.map(e=>e.colour)]));
  a.forEach((k,i)=>k.entries.forEach((e,j)=>assert.notEqual(e.text,b[i].entries[j].text,g.id)));
  total+=ids.length;
 }
 assert.equal(total,32);
});
test('unknown colours, nonexistent presets and empty legends fail before publication',()=>{
 const g=it.geometry.byId['schwarzite-neck'];
 for(const legenda of ['', 'red | Not present',g.legenda+'\n### missing\nmint | Unknown view',g.legenda+'\n### schwarzite-sections\nmint | Duplicate'])assert.throws(()=>geometryLegendGroups({...g,legenda}),/Legenda|legenda/);
});
test('keys remain text-readable and escape edited content without embedding labels in the image',()=>{
 const g={...it.geometry.byId.mobius,legenda:'amber | <script>alert(1)</script>'};
 const html=geometryInfo(g);
 assert.match(html,/<b>Ambra<\/b>/);assert.match(html,/aria-hidden="true"/);
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
 assert.match(geometryInfo(en.geometry.byId.mobius,{language:'en'}),/Figure key/);
});
function keyHarness(){
 const groups=geometryLegendGroups(it.geometry.byId['schwarzite-neck']).map(g=>({dataset:{geoLegend:g.ids.join(' ')},hidden:false}));
 const section={hidden:false},help={textContent:''};
 const context={legendScene:'schwarzite-neck',displayMode:'surface',stage:{dataset:{}},tr:s=>s,
  detail:{querySelectorAll:s=>s==='[data-geo-legend]'?groups:[section]},dialog:{querySelector:()=>help}};
 const fn=loader.match(/function syncFigureKey\([^]*?\n }/)[0];
 const sync=vm.runInNewContext('('+fn+')',context);
 return {groups,section,help,context,sync};
}
test('changing curvature and carbon presets replaces the visible key rather than stacking keys',()=>{
 const h=keyHarness();
 for(const id of ['schwarzite-neck','schwarzite-sections','schwarzite-lattice','schwarzite-neck']){
  h.sync(id);const visible=h.groups.filter(g=>!g.hidden);assert.equal(visible.length,1);
  assert.equal(visible[0].dataset.geoLegend,id);assert.equal(h.context.stage.dataset.geometryScene,id);
 }
});
test('triangle display hides the colour key and returning to Surface restores the selected preset key',()=>{
 const h=keyHarness();h.sync('schwarzite-sections');h.context.displayMode='wire';h.sync();
 assert.equal(h.section.hidden,true);assert.match(h.help.textContent,/suddivisione grafica/);
 h.context.displayMode='surface';h.sync();assert.equal(h.section.hidden,false);
 assert.equal(h.groups.filter(g=>!g.hidden)[0].dataset.geoLegend,'schwarzite-sections');
});
test('semantic labels distinguish the covariance reference, displacement signs and finite Julia palette',()=>{
 assert.match(it.geometry.byId.covariance.legenda,/massima dispersione e sezione/);
 assert.match(it.geometry.byId['vibrational-mode'].legenda,/blue \|.*positivo/);
 assert.match(it.geometry.byId['vibrational-mode'].legenda,/amber \|.*nullo o negativo/);
 assert.match(it.geometry.byId.julia.legenda,/priva di una scala cromatica monotona/);
 assert.match(it.geometry.byId['schwarzite-neck'].legenda,/### schwarzite-sections[\s\S]*sezione longitudinale[\s\S]*sezione trasversale/);
});
