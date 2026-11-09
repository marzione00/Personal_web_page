import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {loadTeachingApps, validateTeachingRegistry, renderTeachingApps, renderAppLaunchDialog, teachingAppSearchEntries} from '../src/teaching-apps.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = () => JSON.parse(fs.readFileSync(path.join(root,'content/teaching-apps.json'),'utf8'));
const data = language => ({language,teachingApps:loadTeachingApps(root,language)});
function fixture(run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(),'tm-labs-'));
  fs.cpSync(path.join(root,'content'),path.join(dir,'content'),{recursive:true});
  try { run(dir); } finally { fs.rmSync(dir,{recursive:true,force:true}); }
}
function changed(change) { const r=registry(); change(r); return r; }

test('registry has one live lab and a disabled template',()=>{
 const r=validateTeachingRegistry(registry());
 assert.equal(r.filter(x=>x.enabled).length,1);
 assert.equal(r.find(x=>x.id==='nuovo-laboratorio').enabled,false);
});
test('IT and EN load one live app, with distinct editorial text',()=>{
 const it=data('it'),en=data('en');
 assert.equal(it.teachingApps.length,1); assert.equal(en.teachingApps.length,1);
 assert.notEqual(it.teachingApps[0].paragraphs[0],en.teachingApps[0].paragraphs[0]);
});
test('disabled template never leaks into public markup or search',()=>{
 const d={language:'it',teachingApps:loadTeachingApps(root,'it',{includeDisabled:true})};
 assert.doesNotMatch(renderTeachingApps(d),/nuovo-laboratorio|Nuovo laboratorio/);
 assert.equal(teachingAppSearchEntries(d).length,1);
 assert.match(renderTeachingApps(d,{previewDisabled:true}),/Modello non pubblicato/);
});
test('a second enabled application needs only registry and text changes',()=>fixture(dir=>{
 const r=registry();r.apps[1].enabled=true;r.apps[1].url='https://lab.example.it/';
 fs.writeFileSync(path.join(dir,'content/teaching-apps.json'),JSON.stringify(r));
 assert.equal(loadTeachingApps(dir).length,2);
}));
test('single title, section and semantic h2/h3 hierarchy',()=>{
 const html=renderTeachingApps(data('it'));
 assert.equal((html.match(/<section /g)||[]).length,1);
 assert.equal((html.match(/<h2 /g)||[]).length,1);
 assert.equal((html.match(/<h3>/g)||[]).length,1);
 assert.equal((html.match(/id="laboratorio-quantum-lab"/g)||[]).length,1);
});
test('main CTA is a real same-tab link and source link is separate',()=>{
 const html=renderTeachingApps(data('it'));
 const tag=html.match(/<a[^>]*data-app-launch[^>]*>/)[0];
 assert.match(tag,/href="https:\/\/marzione00.github.io\/QuantumLab_Public\//);
 assert.doesNotMatch(tag,/target=|onclick=|javascript:/);
 assert.match(html,/rel="noopener noreferrer"/);
});
test('search routes to the local card rather than bypassing it',()=>{
 assert.deepEqual(teachingAppSearchEntries(data('it'))[0],{url:'didattica.html#laboratorio-quantum-lab',title:'Quantum Lab',kind:'Didattica / laboratorio'});
});
test('English page explicitly identifies the Italian lab interface',()=>{
 const html=renderTeachingApps(data('en'));
 assert.match(html,/Laboratory interface: Italian/);
 assert.doesNotMatch(html,/Entra nel laboratorio|Si apre in questa/);
});
test('no brittle activity counts or unperformed security claims',()=>{
 const html=renderTeachingApps(data('it'));
 assert.doesNotMatch(html,/87|5\.1|ponte sicuro|verify runtime|build condivise|iframe/);
});
test('launch=none produces a real link without animation binding',()=>{
 const d=data('it');d.teachingApps[0].launch='none';
 assert.doesNotMatch(renderTeachingApps(d),/data-app-launch/);
});
test('dialog only appears on launch-enabled pages',()=>{
 assert.equal(renderAppLaunchDialog(data('it'),'<p>Home</p>'),'');
 const html=renderAppLaunchDialog(data('it'),renderTeachingApps(data('it')));
 assert.match(html,/^<dialog/);assert.match(html,/role="status"/);assert.match(html,/data-launch-direct/);assert.match(html,/data-launch-cancel/);
 assert.doesNotMatch(html,/style=|onclick=/);
});
test('URLs for a future custom domain require no renderer change',()=>{
 const r=changed(x=>x.apps[0].url='https://lab.topologicalmanifolds.it/');
 assert.equal(validateTeachingRegistry(r)[0].url,'https://lab.topologicalmanifolds.it/');
});
test('unsafe and non-HTTPS destinations are rejected',()=>{
 for(const value of ['javascript:alert(1)','http://example.it/','//example.it/','https://user:pass@example.it/','https://example.it:444/','https://exam ple.it/','https://example.it/\\x'])
  assert.throws(()=>validateTeachingRegistry(changed(x=>x.apps[0].url=value)),/Laboratori:/);
});
test('published destinations cannot be the GitHub repository or an example domain',()=>{
 for(const value of ['https://github.com/marzione00/QuantumLab_Public/','https://example.com/','https://fake.invalid/'])
  assert.throws(()=>validateTeachingRegistry(changed(x=>x.apps[0].url=value)),/Laboratori:/);
});
test('draft may have empty URLs; active application cannot',()=>{
 assert.doesNotThrow(()=>validateTeachingRegistry(registry()));
 assert.throws(()=>validateTeachingRegistry(changed(x=>x.apps[1].enabled=true)),/Laboratori:/);
});
test('ids cannot contain paths and must be unique',()=>{
 for(const value of ['../file','a/b','lab_1','Lab','a'.repeat(61)])
  assert.throws(()=>validateTeachingRegistry(changed(x=>x.apps[0].id=value)),/Laboratori:/);
 assert.throws(()=>validateTeachingRegistry(changed(x=>x.apps[1].id=x.apps[0].id)),/duplicato/);
});
test('schema, flags, unknown keys and types fail closed',()=>{
 for(const mutate of [x=>x.schemaVersion=2,x=>x.apps[0].enabled='true',x=>x.apps[0].launch='script',x=>x.apps[0].unknown=true,x=>delete x.apps[0].title,x=>x.apps[0].interfaceLanguage='fr',x=>x.apps[0].title='line\nbreak'])
  assert.throws(()=>validateTeachingRegistry(changed(mutate)),/Laboratori:/);
});
test('empty registry renders nothing',()=>{
 assert.equal(renderTeachingApps({teachingApps:[]}), '');
 assert.deepEqual(validateTeachingRegistry({schemaVersion:1,apps:[]}),[]);
});
test('missing English text is a build error, not silent Italian fallback',()=>fixture(dir=>{
 fs.unlinkSync(path.join(dir,'content/markdown/en/laboratori/quantum-lab.md'));
 assert.throws(()=>loadTeachingApps(dir,'en'),/testo mancante/);
}));
test('editorial HTML and attribute payloads are escaped',()=>fixture(dir=>{
 fs.writeFileSync(path.join(dir,'content/markdown/laboratori/quantum-lab.md'),'<img src=x onerror=alert(1)>');
 const d={language:'it',teachingApps:loadTeachingApps(dir)};
 d.teachingApps[0].title='" onclick="bad';
 const html=renderTeachingApps(d);
 assert.doesNotMatch(html,/<img|<script|data-launch-name="" onclick=/);
 assert.match(html,/&lt;img/);assert.match(html,/&quot;/);
}));
test('oversize and empty editorial files are rejected',()=>fixture(dir=>{
 const file=path.join(dir,'content/markdown/laboratori/quantum-lab.md');
 fs.writeFileSync(file,'');assert.throws(()=>loadTeachingApps(dir),/testo vuoto/);
 fs.writeFileSync(file,'x'.repeat(13000));assert.throws(()=>loadTeachingApps(dir),/troppo grande/);
}));
test('plain browser runtime parses and contains no inline-style or HTML mutation',()=>{
 const js=fs.readFileSync(path.join(root,'src/teaching-app-launch.js'),'utf8');
 assert.doesNotThrow(()=>new vm.Script(js));
 assert.doesNotMatch(js,/innerHTML|outerHTML|insertAdjacentHTML|\.style\.|eval\(/);
 assert.match(js,/prefers-reduced-motion/);assert.match(js,/MDCEffects\?\.transitions/);
});
test('CSS is namespaced and has a real reduced-motion alternative',()=>{
 const css=fs.readFileSync(path.join(root,'src/teaching-apps.css'),'utf8');
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/\.course-card\s*\{|\.hero-portrait|@import|url\(/);
});
