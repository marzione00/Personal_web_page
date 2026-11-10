/** Build artifact budgets and component/layer ownership checks. */
import fs from 'node:fs';import path from 'node:path';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url).pathname,dist=path.join(root,'dist'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const assets=fs.readdirSync(path.join(dist,'assets'));
const bundles=assets.filter(f=>/^site-.*\.(js|css)$/.test(f));
const report={version:JSON.parse(fs.readFileSync(path.join(root,'content/site.json'))).version,budgets:[],checks:[]};
for(const file of ['index.html','en/index.html',...bundles.map(f=>'assets/'+f)]){const b=fs.readFileSync(path.join(dist,file)),gzip=gzipSync(b).length,limit=file.endsWith('.html')?12000:file.endsWith('.css')?26000:42000;assert.ok(gzip<=limit,`${file}: ${gzip} > ${limit}`);report.budgets.push({file,bytes:b.length,gzip,limit});}
const build=read('scripts/build.mjs');
for(const name of ['header.css','geometry.css','cyber-network.css','cyber-network.js','paths.css','experiments.css','search.js','reading.js','matrix-rain.js','cinema.js','navigation.js','music.js','sound.js'])assert.equal(build.split("'"+name+"'").length-1,1,'Bundle duplication: '+name);
for(const f of ['site.css','visual.css','ambient.css','identity.css','paths.css'])assert.doesNotMatch(read('src/'+f),/\.(header-inner|header-tools|language-switch|menu-button)\s*\{/,'Header ownership '+f);
const css=fs.readdirSync(path.join(root,'src')).filter(x=>x.endsWith('.css')).map(f=>read('src/'+f)).join('\n');
for(const m of css.matchAll(/z-index\s*:\s*(-?\d+)/g))assert.ok(Number(m[1])<=1,'Unbounded layer: '+m[0]);
assert.doesNotMatch(css,/\.home-context(?:-grid|-row)?\{/);
const home=read('dist/index.html');assert.equal((home.match(/data-app-launch-dialog/g)||[]).length,1);assert.equal((home.match(/id="search-dialog"/g)||[]).length,1);
assert.equal((home.match(/id="cyber-dialog"/g)||[]).length,1);
const htmlPages=fs.readdirSync(dist,{recursive:true}).filter(f=>f.endsWith('.html'));
for(const file of htmlPages){const html=fs.readFileSync(path.join(dist,file),'utf8');for(const id of ['geometry-dialog','cyber-dialog','search-dialog'])assert.equal(html.split('id="'+id+'"').length-1,1,'Dialog ownership: '+file+'/'+id);}
const catalog=JSON.parse(read('public/geometry/manifest.json')),sceneIds=new Set(catalog.flatMap(g=>[g.id,...(g.views||[]).map(v=>v.id)]));
const sceneNames=fs.readdirSync(path.join(dist,'geometry/scenes'));assert.equal(sceneNames.filter(f=>/-[a-f0-9]{12}\.bin$/.test(f)).length,sceneIds.size);assert.equal(catalog.length,28);assert.equal(sceneIds.size,32);
report.checks=['single bundle registration','one header owner','bounded layers with native modal top layer','obsolete home selectors removed',`single geometry, cyber and search dialog in all ${htmlPages.length} pages`,'28 catalog entries and 32 versioned scene URLs'];
console.log(JSON.stringify(report,null,2));
