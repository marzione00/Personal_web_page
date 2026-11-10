import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createHash} from 'node:crypto';import vm from 'node:vm';
import {loadContent} from '../src/content.mjs';import {renderPages,shellHtml} from '../src/render.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('Topological Manifolds is the public brand in both languages',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language});assert.equal(d.site.name,'Topological Manifolds');for(const p of renderPages(d)){const h=shellHtml({data:d,page:p,css:'',js:'',csp:"default-src 'none'"});assert.match(h,/<span class="brand-word">Topological Manifolds<\/span>/);assert.doesNotMatch(h,/MDC_LAB|MDC LAB|MDC<span>_<\/span>LAB/);}}
});
test('name, license and music have corresponding editable Markdown in IT/EN',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language}),pages=renderPages(d);for(const id of ['manifold','licenza','musica']){assert.ok(fs.existsSync(path.join(root,'content/markdown',language==='en'?'en':'',id+'.md')));assert.ok(pages.some(p=>p.file===id+'.html'));}}
});
test('mathematical examples distinguish dimension, boundary and non-manifolds',()=>{
 const it=loadContent(root),en=loadContent(root,{language:'en'});assert.match(it.identity.manifold.testo,/bidimensionali/);assert.match(it.identity.manifold.mobius,/con bordo/);assert.match(it.identity.manifold.nota,/non sono tutti varietà/);assert.match(en.identity.manifold.mobius,/half-plane/);
});
test('the licence preserves third-party documents, quotes and software scope',()=>{
 for(const language of ['it','en']){const d=loadContent(root,{language}),h=renderPages(d).find(p=>p.file==='licenza.html').body;assert.match(h,/CC BY-NC-ND 4\.0/);assert.match(h,/creativecommons\.org\/licenses\/by-nc-nd\/4\.0/);assert.match(h,/PDF/);assert.match(h,/software/);assert.match(h,/Local Coordinates/);}
});
test('rain texture has bright leading heads with trailing characters above, positive downward translation',()=>{
 const s=read('src/matrix-rain.js');assert.match(s,/y=textureHeight-\(row\+1\)\*gap/);assert.match(s,/s\.t=\(s\.t\+s\.speed\*dt\*acceleration\*intensity\(\)\.speed\)/);assert.match(s,/speed:rand\(speed\*\.65,speed\*1\.3\)/);assert.match(s,/get direction\(\)\{return 'down';\}/);
});
test('UI sound uses rounded sine accents with soft attacks and bounded card-entry accents',()=>{
 const s=read('src/sound.js');assert.match(s,/osc\.type='sine'/);assert.match(s,/voices\.size>=3/);assert.match(s,/now-lastChirp<360/);assert.match(s,/now-lastPage<700/);assert.doesNotMatch(s,/type='square'|type='triangle'|createBufferSource\(/);assert.match(s,/t\+\.055/);
});
test('music is separate, opt-in, session-persistent and syntactically safe',()=>{
 const s=read('src/music.js');assert.doesNotThrow(()=>new vm.Script(s));assert.match(s,/audio\.preload='none'/);assert.match(s,/play\.addEventListener\('click'/);assert.match(s,/sessionStorage/);assert.match(s,/pagehide/);assert.match(s,/loadedmetadata/);assert.doesNotMatch(s,/\.autoplay\s*=/);
});
test('the original soundtrack has a verified >4 minute stereo snapshot within budget',()=>{
 const m=JSON.parse(read('content/music-manifest.json')),b=fs.readFileSync(path.join(root,'public',m.file));assert.ok(m.durationSeconds>=240);assert.equal(m.durationSeconds,270);assert.equal(m.channels,2);assert.equal(m.sampleRate,44100);assert.ok(b.length<8*1024*1024);assert.equal(createHash('sha256').update(b).digest('hex'),m.sha256);assert.equal(b.subarray(0,3).toString(),'ID3');
});
test('music controls have accessible independent states and no initial audio element',()=>{
 for(const language of ['it','en']){const data=loadContent(root,{language}),page=renderPages(data)[0];const h=shellHtml({data,page,css:'',js:'',csp:''});assert.match(h,/data-music-play aria-pressed="false"/);assert.match(h,/data-music-volume/);assert.match(h,/data-music-loop/);assert.doesNotMatch(h,/<audio/);}
});
test('new examples are three distinct local images with dimensions, no photo mutations',()=>{
 const data=loadContent(root),h=renderPages(data).find(p=>p.file==='manifold.html').body;assert.equal((h.match(/class="manifold-example"/g)||[]).length,3);for(const id of ['sphere','torus','mobius']){assert.match(h,new RegExp('manifold-'+id+'\\.webp'));assert.ok(fs.statSync(path.join(root,'public/media/images/manifold-'+id+'.webp')).size<160000);}
});
