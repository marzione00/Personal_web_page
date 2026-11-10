import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash,webcrypto} from 'node:crypto';
const source=fs.readFileSync(new URL('../src/geometry-loader.js',import.meta.url),'utf8');
const fn=source.slice(source.indexOf('async function getScene('),source.indexOf(' function configureMotion('));
function harness(){
 const pending=new Map(),cache=new Map(),releases=[];
 for(let i=0;i<4;i++){const key='old-'+i;pending.set(key,new Promise(resolve=>releases.push(()=>{pending.delete(key);resolve(new ArrayBuffer(24));})));}
 const bytes=Buffer.alloc(24),digest=createHash('sha256').update(bytes).digest('hex');
 const context={pending,cache,generation:7,tr:x=>x,window:{MDCEmbeddedScenes:{epsilon:bytes.toString('base64')}},atob:s=>Buffer.from(s,'base64').toString('binary'),crypto:webcrypto};
 const run=vm.runInNewContext('('+fn+')',context);
 return {context,pending,cache,releases,request:token=>run('epsilon','geometry/scenes/epsilon.bin',digest,token)};
}
test('opening a model waits for a bounded fetch slot instead of showing an unavailable error',async()=>{
 const h=harness();let completed=false;const job=h.request(7).then(b=>{completed=true;return b;});
 await Promise.resolve();assert.equal(completed,false);assert.equal(h.pending.size,4);
 h.releases[0]();const b=await job;assert.equal(b.byteLength,24);assert.equal(h.cache.size,1);assert.ok(h.pending.size<=4);
});
test('a dialog closed while waiting cannot start a stale model request',async()=>{
 const h=harness();const job=h.request(7);h.context.generation=8;h.releases[0]();
 await assert.rejects(job,/Caricamento annullato/);assert.equal(h.cache.size,0);assert.equal(h.pending.size,3);
});
test('background previews retain the four-request concurrency boundary',async()=>{
 const h=harness();await assert.rejects(h.request(),/Modello non disponibile/);assert.equal(h.pending.size,4);
});
