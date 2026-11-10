import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {loadAmbientFormulas,formulaFamilies} from '../src/ambient-content.mjs';
import {loadContent} from '../src/content.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const formulas=loadAmbientFormulas(root);
test('at least 120 complete and unique equations across 12 scientific families',()=>{
 assert.ok(formulas.entries.length>=120);assert.equal(Object.keys(formulaFamilies).length,12);
 assert.equal(new Set(formulas.entries.map(f=>f.id)).size,formulas.entries.length);
 assert.equal(new Set(formulas.entries.map(f=>f.formula)).size,formulas.entries.length);
 for(const fam of Object.keys(formulaFamilies))assert.ok(formulas.entries.filter(f=>f.family===fam).length>=8);
 for(const f of formulas.entries)for(const key of ['title','title_en','conditions','conditions_en','source'])assert.ok(f[key]);
});
test('formula catalogue keeps physically important conditions rather than decorative false equations',()=>{
 const find=id=>formulas.entries.find(f=>f.id===id);
 assert.match(find('quantum-07').conditions,/indipendente dal tempo/);
 assert.match(find('solid-state-04').conditions,/Dirac/);
 assert.match(find('solid-state-05').conditions,/masse/);
 assert.match(find('quantitative-07').conditions,/Approssimazione nodale/);
 assert.match(find('cryptography-04').conditions,/non è uno schema sicuro/);
 assert.match(find('information-04').conditions,/Supporto/);
});
test('background covers the viewport with a bounded raster size and frame-rate limit',()=>{
 const s=read('src/matrix-rain.js');assert.match(s,/W=document.documentElement.clientWidth/);assert.match(s,/6000000/);assert.match(s,/1000\/\(\(mobile\?20:24\)\*adaptive\)/);assert.doesNotMatch(s,/W>=1000|rightStart|protected corridor/);assert.doesNotMatch(s,/\.innerHTML|eval\(|fetch\(/);
 assert.doesNotMatch(read('src/visual.css'),/matrix-side-width|matrix-rain-shell/);
});
test('ambient pausing, visibility and reduced motion actually gate RAF scheduling',()=>{
 const s=read('src/matrix-rain.js');for(const r of [/cancelAnimationFrame/,/document\.hidden/,/config\.reduced/,/occluded\(\)/,/config\.ambient==='on'/])assert.match(s,r);
 const css=read('src/ambient.css');assert.match(css,/pointer-events:none/);assert.match(css,/@media print/);
});
test('preferences and catalogue are present in both languages without changing contact data',()=>{
 for(const language of ['it','en']){
  const d=loadContent(root,{language}),p=renderPages(d)[0],h=shellHtml({data:d,page:p,css:'',js:'',csp:"default-src 'none'"});
  for(const id of ['effects-dialog','formulas-dialog'])assert.match(h,new RegExp('id="'+id+'"'));
  assert.match(h,/data-effects-open/);assert.match(h,/data-effects-transitions/);
  assert.match(h,language==='en'?/Scientific formulas/:/Formule scientifiche/);
  assert.equal(d.profile.email,'marzio.decorato@outlook.it');
 }
});
test('all new browser modules are syntactically valid plain scripts',()=>{
 for(const f of ['effects.js','matrix-rain.js','navigation.js','sound.js'])assert.doesNotThrow(()=>new vm.Script(read('src/'+f)));
});
test('interface audio is opt-in, bounded and silent on pointer movement or scrolling',()=>{
 const s=read('src/sound.js');assert.match(s,/mdc-sound-enabled','off'/);assert.match(s,/voices\.size>=3/);assert.match(s,/silence\(\)/);assert.doesNotMatch(s,/fetch\(|\.mp3|\.wav|addEventListener\('(?:pointermove|pointerover|scroll)'/);
});
test('page navigation is bounded, abortable and falls back to the real URL',()=>{
 const s=read('src/navigation.js');assert.match(s,/credentials:'same-origin',redirect:'error'/);assert.match(s,/url\.origin===base\.origin/);assert.match(s,/ev\.ctrlKey\|\|ev\.metaKey/);assert.match(s,/hasAttribute\('download'\)/);assert.match(s,/location\.assign\(url\.href\)/);assert.match(s,/AbortController/);assert.match(s,/token!==generation/);assert.match(s,/2\*1024\*1024/);assert.match(s,/Different site build/);
 const css=read('src/ambient.css');assert.doesNotMatch(css,/@view-transition|screen-scan/);assert.match(read('src/cinema.css'),/prefers-reduced-motion/);
});
test('no obsolete global positioning rule can disable sticky navigation or dialogs',()=>{
 assert.doesNotMatch(read('src/visual.css'),/\.header,\.header-note,main,\.footer,\.skip,dialog\{position:relative/);
});
