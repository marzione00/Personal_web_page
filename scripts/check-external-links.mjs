/** Optional network audit. Unreachable/blocked is distinct from an HTTP broken-link response. */
import fs from 'node:fs';import path from 'node:path';
const root=new URL('../',import.meta.url).pathname;
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const urls=[...new Set(walk(path.join(root,'dist')).filter(f=>f.endsWith('.html')).flatMap(f=>[...fs.readFileSync(f,'utf8').matchAll(/href="(https:[^"]+)"/g)].map(m=>m[1].replaceAll('&amp;','&').split('#')[0])))];
const results=[];let next=0;
await Promise.all(Array.from({length:5},async()=>{while(next<urls.length){const url=urls[next++];try{let r=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(8000)});if(r.status===405){r=await fetch(url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(8000)});await r.body?.cancel();}results.push({url,status:r.status,result:r.ok?'reachable':[401,403,429].includes(r.status)?'access-limited':[404,410].includes(r.status)?'broken':'review'});}catch(error){results.push({url,result:'unverified',reason:error.name==='TimeoutError'?'timeout':'network-unavailable'});}}}));
results.sort((a,b)=>a.url.localeCompare(b.url));
console.log(JSON.stringify({checkedAt:new Date().toISOString(),counts:results.reduce((a,r)=>(a[r.result]=(a[r.result]||0)+1,a),{}),links:results},null,2));
