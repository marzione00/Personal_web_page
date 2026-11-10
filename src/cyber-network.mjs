import fs from 'node:fs';
import path from 'node:path';
import {sections} from './i18n.mjs';
import {escapeHtml as e,markdown} from './safety.mjs';

// The edges are an illustrative asset network, not observed attack telemetry.
export function attackGraph(nodes){
 const edges=[],seen=new Set(),adj=nodes.map(()=>[]);
 const distance=(a,b)=>Math.hypot((a.lon-b.lon)*Math.cos((a.lat+b.lat)*Math.PI/360),a.lat-b.lat);
 function add(a,b){if(a<0||b<0||a===b)throw Error('Invalid graph node');const key=[Math.min(a,b),Math.max(a,b)].join(':');if(seen.has(key))return;seen.add(key);
  const A=nodes[a],B=nodes[b],dx=B.x-A.x,dy=B.y-A.y,length=Math.hypot(dx,dy),bend=Math.min(38,length*.12)*(a%2?1:-1);
  const edge={a,b,cx:(A.x+B.x)/2-dy/length*bend,cy:(A.y+B.y)/2+dx/length*bend,weight:.75+distance(A,B)*.026};
  edges.push(edge);adj[a].push([b,edges.length-1]);adj[b].push([a,edges.length-1]);
 }
 for(let i=0;i<nodes.length;i++){
  const near=nodes.map((n,j)=>({j,d:i===j?Infinity:distance(nodes[i],n)})).sort((a,b)=>a.d-b.d);
  for(const {j,d} of near.slice(0,3))if(d<37)add(i,j);
 }
 const index=name=>nodes.findIndex(n=>n.name===name);
 for(const[a,b]of [['New York','Londra'],['New York','Lisbona'],['Miami','Bogotá'],['Bogotá','São Paulo'],['São Paulo','Lisbona'],['Recife','Dakar'],['Milano','Dubai'],['Londra','Il Cairo'],['Madrid','Casablanca'],['Il Cairo','Addis Abeba'],['Lagos','Nairobi'],['Nairobi','Johannesburg'],['Johannesburg','Dubai'],['Mosca','Novosibirsk'],['Novosibirsk','Beijing'],['Dubai','Mumbai'],['Dubai','Singapore'],['Mumbai','Singapore'],['Singapore','Tokyo'],['Singapore','Perth'],['Jakarta','Sydney'],['Sydney','Auckland']])add(index(a),index(b));
 const origin=index('Milano'),arrival=nodes.map(()=>Infinity),parent=nodes.map(()=>null),done=new Set();arrival[origin]=0;
 for(let k=0;k<nodes.length;k++){
  let u=-1;for(let i=0;i<nodes.length;i++)if(!done.has(i)&&(u<0||arrival[i]<arrival[u]))u=i;
  if(u<0||!Number.isFinite(arrival[u]))throw Error('Disconnected illustrative graph');done.add(u);
  for(const[v,id]of adj[u]){const t=arrival[u]+edges[id].weight;if(t<arrival[v]){arrival[v]=t;parent[v]={from:u,edge:id};}}
 }
 const scale=19/Math.max(...arrival);return {edges,parent,arrival:arrival.map(t=>t*scale),origin};
}
export function loadCyberNetwork(root,language='it'){
 const raw=JSON.parse(fs.readFileSync(path.join(root,'content/cyber-network.json'),'utf8'));
 if(raw.schemaVersion!==1||!Array.isArray(raw.nodes)||raw.nodes.length!==96||!Array.isArray(raw.land)||raw.land.length>200)throw Error('Invalid network illustration');
 for(const n of raw.nodes)if(typeof n.name!=='string'||![n.lon,n.lat,n.x,n.y].every(Number.isFinite)||Math.abs(n.lon)>180||Math.abs(n.lat)>90||n.x<0||n.x>1440||n.y<0||n.y>600)throw Error('Invalid map point');
 for(const p of raw.land)if(typeof p!=='string'||p.length>60000||!/^[MLZ0-9.,\-]+$/.test(p))throw Error('Invalid coastline');
 const copy=sections(path.join(root,'content/markdown',language==='en'?'en':'','cyber-network.md'));
 for(const k of ['titolo','introduzione','rete','propagazione','difesa','figura','fonti'])if(!copy?.[k]||copy[k].length>6000)throw Error('Missing graph explanation: '+k);
 return {...raw,copy,graph:attackGraph(raw.nodes)};
}
const f=v=>Number(v.toFixed(2));
export function cyberNetworkMarkup(data){
 const {nodes,land,graph}=data.cyberNetwork,en=data.language==='en';
 const route=id=>{const edge=graph.edges[id],A=nodes[edge.a],B=nodes[edge.b];return `M${A.x},${A.y}Q${f(edge.cx)},${f(edge.cy)} ${B.x},${B.y}`;};
 const svg=`<svg class="cyber-map" viewBox="0 0 1440 600" aria-hidden="true" focusable="false"><g class="cyber-land">${land.map(p=>`<path d="${p}"/>`).join('')}</g><g class="cyber-grid">${[-120,-60,0,60,120].map(l=>`<path d="M${(l+180)*4},0V600"/>`).join('')}${[-30,0,30,60].map(l=>`<path d="M0,${f((84-l)*600/144)}H1440"/>`).join('')}</g><g class="cyber-edges">${graph.edges.map((_,i)=>`<path d="${route(i)}"/>`).join('')}</g><g class="cyber-routes">${graph.parent.map((p,i)=>p?`<path d="${route(p.edge)}" data-cyber-route="${f(graph.arrival[i])}" opacity="${graph.arrival[i]<=12?.5:0}"/>`:'').join('')}</g><g class="cyber-nodes">${nodes.map((n,i)=>`<g data-cyber-arrival="${f(graph.arrival[i])}" class="cyber-node${graph.arrival[i]<=12?' is-hit':''}" transform="translate(${n.x} ${n.y})"><circle r="4"/><path class="cyber-hit-mark" d="M-2,-2L2,2M-2,2L2,-2"/></g>`).join('')}</g><g class="cyber-pulses">${graph.parent.map((p,i)=>{if(!p)return '';const edge=graph.edges[p.edge],a=nodes[p.from],b=nodes[i];return `<circle r="3" opacity="0" data-cyber-pulse="${[a.x,a.y,f(edge.cx),f(edge.cy),b.x,b.y,f(graph.arrival[p.from]),f(graph.arrival[i])].join(',')}"/>`;}).join('')}</g></svg>`;
 return `<div class="cyber-figure"><a class="cyber-network" href="geometrie.html#cyber-network" data-cyber-open aria-haspopup="dialog" aria-label="${en?'Graph theory and cyber-attacks. Red crossed nodes are compromised; green nodes are unaffected. Open the explanation.':'Teoria dei grafi e cyber-attacchi. I nodi rossi segnati da una croce sono compromessi; quelli verdi non sono colpiti. Apri la spiegazione.'}">${svg}</a></div>`;
}
export function cyberNetworkExplanation(data){
 const c=data.cyberNetwork.copy,en=data.language==='en';
 return `<div class="cyber-explanation"><div class="cyber-key"><span><i class="cyber-key-safe" aria-hidden="true"></i>${en?'Unaffected node':'Nodo non colpito'}</span><span><i class="cyber-key-hit" aria-hidden="true">×</i>${en?'Compromised node':'Nodo compromesso'}</span></div>${markdown(c.introduzione)}<h3>${en?'From connections to attack paths':'Dalle connessioni ai percorsi d’attacco'}</h3>${markdown(c.rete)}<p class="cyber-formula" role="math" aria-label="${en?'G equals the pair V and E: vertices and edges':'G è la coppia V ed E: vertici e archi'}">G = (V, E)</p>${markdown(c.propagazione)}<h3>${en?'How this supports defence':'Come orientare la difesa'}</h3>${markdown(c.difesa)}<h3>${en?'Reading this figure':'Il significato della figura'}</h3>${markdown(c.figura)}<div class="cyber-sources"><h3>${en?'References':'Riferimenti'}</h3>${markdown(c.fonti)}</div></div>`;
}
export function cyberNetworkDialog(data){const en=data.language==='en';return `<dialog id="cyber-dialog" class="cyber-dialog" aria-labelledby="cyber-title"><header><h2 id="cyber-title">${e(data.cyberNetwork.copy.titolo)}</h2><button type="button" data-cyber-close aria-label="${en?'Close the explanation':'Chiudi la spiegazione'}">×</button></header><div class="cyber-dialog-body">${cyberNetworkExplanation(data)}</div></dialog>`;}
