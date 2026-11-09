/** Build artifact budgets and component/layer ownership checks. */
import fs from 'node:fs';import path from 'node:path';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url).pathname,dist=path.join(root,'dist'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const assets=fs.readdirSync(path.join(dist,'assets'));
const bundles=assets.filter(f=>/^site-.*\.(js|css)$/.test(f));
const report={version:'3.8',budgets:[],checks:[]};
for(const file of ['index.html','en/index.html',...bundles.map(f=>'assets/'+f)]){const b=fs.readFileSync(path.join(dist,file)),gzip=gzipSync(b).length,limit=file.endsWith('.html')?12000:file.endsWith('.css')?26000:42000;assert.ok(gzip<=limit,`${file}: ${gzip} > ${limit}`);report.budgets.push({file,bytes:b.length,gzip,limit});}
const build=read('scripts/build.mjs');
for(const name of ['header.css','geometry.css','paths.css','experiments.css','search.js','reading.js','matrix-rain.js'])assert.equal(build.split("'"+name+"'").length-1,1,'Bundle duplication: '+name);
for(const f of ['site.css','visual.css','ambient.css','identity.css','paths.css'])assert.doesNotMatch(read('src/'+f),/\.(header-inner|header-tools|language-switch|menu-button)\s*\{/,'Header ownership '+f);
const css=fs.readdirSync(path.join(root,'src')).filter(x=>x.endsWith('.css')).map(f=>read('src/'+f)).join('\n');
for(const m of css.matchAll(/z-index\s*:\s*(-?\d+)/g))assert.ok(Number(m[1])<=1,'Unbounded layer: '+m[0]);
assert.doesNotMatch(css,/\.home-context(?:-grid|-row)?\{/);
const home=read('dist/index.html');assert.equal((home.match(/data-app-launch-dialog/g)||[]).length,1);assert.equal((home.match(/id="search-dialog"/g)||[]).length,1);
const sceneNames=fs.readdirSync(path.join(dist,'geometry/scenes'));assert.equal(sceneNames.filter(f=>/-[a-f0-9]{12}\.bin$/.test(f)).length,24);
report.checks=['single bundle registration','one header owner','bounded layers with native modal top layer','obsolete home selectors removed','single modal instances','24 versioned model URLs'];
console.log(JSON.stringify(report,null,2));
