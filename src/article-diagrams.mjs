/** Article-specific figures. Editorial prose remains in Markdown; no external assets. */
import {escapeHtml as e} from './safety.mjs';

export const solarwindsId='solarwinds-e-la-vulnerabilita-degli-stati-digitali';
const copy={
 it:{
  supplyTitle:'Dal fornitore alle istituzioni',
  supplyCaption:'Schema concettuale delle dipendenze tecnologiche. I nodi illustrano ruoli e relazioni; il loro numero e la loro dimensione sono privi di valore quantitativo.',
  supplyLabel:'Mappa delle dipendenze',
  open:'Apri la spiegazione',
  legend:['Distribuzione autorizzata','Punto compromesso'],
  instruction:'Seleziona un nodo oppure apri le spiegazioni qui sotto.',
  nodes:[
   ['supplier','Fornitore',['Software Orion'],'SolarWinds produceva il programma acquistato dai clienti per controllare il funzionamento delle proprie reti.'],
   ['build','Produzione',['Codice alterato'],'Il componente clandestino venne inserito durante la preparazione del software, prima della consegna degli aggiornamenti.'],
   ['update','Aggiornamento',['Canale ufficiale'],'Il prodotto alterato raggiunse i clienti attraverso il consueto canale del produttore, conservando gli elementi con cui ne riconoscevano la provenienza.'],
   ['public','Istituzioni',['Reti pubbliche'],'Fra gli ambienti nei quali l’FBI riscontrò attività successive all’accesso iniziale figuravano nove agenzie federali. L’esposizione potenziale e le intrusioni approfondite descrivono fasi diverse.'],
   ['private','Imprese',['Reti private'],'La distribuzione coinvolgeva anche clienti privati. Gli operatori selezionavano gli ambienti nei quali proseguire la raccolta di informazioni.']
  ],
  timelineTitle:'Dall’intrusione alla risposta politica',
  timelineCaption:'Cronologia sintetica. Le misure americane riguardavano SolarWinds insieme ad altre attività contestate alla Russia.',
  timelineLabel:'Tre passaggi documentati',
  events:[
   ['MAR–GIU 2020','Distribuzione','Gli aggiornamenti Orion compromessi raggiungono i clienti.'],
   ['13 DIC 2020','Scoperta pubblica','FireEye rende nota l’intrusione ricostruita attraverso Orion.'],
   ['15 APR 2021','Risposta politica','Attribuzione pubblica allo SVR, sanzioni americane ed espulsioni diplomatiche.']
  ],
  defenseTitle:'Come si costruisce la capacità di difesa',
  defenseLabel:'Ricerca, formazione e istituzioni',
  defenseCaption:'Le norme definiscono responsabilità e obblighi. Ricerca e formazione forniscono strumenti e competenze con cui attuarli e affrontare vulnerabilità ancora sconosciute.',
  law:'Norme',lawSub:'Responsabilità e obblighi',research:'Ricerca',training:'Formazione',
  tools:['Strumenti','e metodi'],people:['Persone','preparate'],protection:['Protezione delle','istituzioni'],outcome:'Informazioni e servizi'
 },
 en:{
  supplyTitle:'From suppliers to institutions',
  supplyCaption:'Conceptual diagram of technological dependencies. Nodes illustrate roles and relationships; their number and size carry no quantitative meaning.',
  supplyLabel:'Map of dependencies',open:'Open the explanation',
  legend:['Authorised distribution','Compromised stage'],
  instruction:'Select a node or open the explanations below.',
  nodes:[
   ['supplier','Supplier',['Orion software'],'SolarWinds produced the program customers purchased to monitor their networks.'],
   ['build','Production',['Altered code'],'The clandestine component was inserted during software production, before the updates were delivered.'],
   ['update','Update',['Official channel'],'The altered product reached customers through the manufacturer’s usual channel, retaining the features used to recognise its origin.'],
   ['public','Institutions',['Public networks'],'Nine federal agencies were among the environments where the FBI found activity beyond the initial access. Potential exposure and deeper intrusions describe different stages.'],
   ['private','Businesses',['Private networks'],'Distribution also involved private customers. Operators selected the environments in which to pursue intelligence gathering.']
  ],
  timelineTitle:'From intrusion to political response',
  timelineCaption:'A concise chronology. US measures addressed SolarWinds alongside other activities attributed to Russia.',
  timelineLabel:'Three documented stages',
  events:[
   ['MAR–JUN 2020','Distribution','Compromised Orion updates reach customers.'],
   ['13 DEC 2020','Public discovery','FireEye discloses the intrusion traced through Orion.'],
   ['15 APR 2021','Political response','Public attribution to the SVR, US sanctions and diplomatic expulsions.']
  ],
  defenseTitle:'Building defensive capability',defenseLabel:'Research, education and institutions',
  defenseCaption:'Rules define responsibilities and obligations. Research and education provide the tools and expertise to fulfil them and address previously unknown vulnerabilities.',
  law:'Rules',lawSub:'Responsibilities and obligations',research:'Research',training:'Education',
  tools:['Tools','and methods'],people:['Trained','people'],protection:['Protecting','institutions'],outcome:'Information and services'
 }
};

function text(x,y,lines,cls='ad-svg-title'){
 return `<text class="${cls}" x="${x}" y="${y}" text-anchor="middle">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?20:0}">${e(line)}</tspan>`).join('')}</text>`;
}
function arrows(id){return `<defs><marker id="${id}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L7 4L1 7" class="ad-arrow"/></marker></defs>`;}
function edge(d,marker){return `<path class="ad-edge" d="${d}" marker-end="url(#${marker})"/>`;}
function node(item,box,open){
 const [id,label,sub]=item,[x,y,w,h]=box,cx=x+w/2;
 return `<a class="ad-node ad-step${id==='build'?' ad-compromised':''}" href="articolo-${solarwindsId}.html#sw-note-${id}" aria-label="${e(label+' — '+open)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>${text(cx,y+29,[label])}${text(cx,y+51,sub,'ad-svg-sub')}${id==='build'?`<path class="ad-alert" d="M${x+7} ${y+6}h9v9h-9Z"/>`:''}</a>`;
}
function supplySvg(c,mobile){
 const suffix=mobile?'narrow':'wide',marker='sw-supply-arrow-'+suffix;
 const boxes=mobile?[[50,20,220,68],[50,124,220,68],[50,228,220,68],[8,362,144,68],[168,362,144,68]]:[[10,133,130,76],[188,133,148,76],[384,133,132,76],[560,54,130,76],[560,212,130,76]];
 const paths=mobile?['M160 88V120','M160 192V224','M160 296V328H80V358','M160 328H240V358']:['M140 171H183','M336 171H379','M516 171H536V92H555','M536 171V250H555'];
 return `<svg class="ad-supply ad-${suffix}" viewBox="0 0 ${mobile?'320 450':'700 330'}" role="group" aria-label="${e(c.supplyTitle)}">${arrows(marker)}<g class="ad-grid" aria-hidden="true">${mobile?'<path d="M24 0V450M296 0V450M0 108H320M0 212H320M0 332H320"/>':'<circle cx="350" cy="165" r="114"/><circle cx="350" cy="165" r="158"/><path d="M0 171H700M350 0V330"/>'}</g><g aria-hidden="true">${paths.map(d=>edge(d,marker)).join('')}</g>${c.nodes.map((item,i)=>node(item,boxes[i],c.open)).join('')}</svg>`;
}
function heading(id,number,label,title,caption){
 return `<figcaption><span class="ad-kicker">${number} / ${e(label)}</span><h3 id="${id}-title">${e(title)}</h3><p id="${id}-caption">${e(caption)}</p></figcaption>`;
}
function supply(c){
 return `<figure class="article-diagram" data-article-diagram="supply" aria-labelledby="sw-supply-title" aria-describedby="sw-supply-caption">${heading('sw-supply','01',c.supplyLabel,c.supplyTitle,c.supplyCaption)}<div class="ad-board">${supplySvg(c,false)}${supplySvg(c,true)}</div><div class="ad-legend"><span><i class="ad-key-line" aria-hidden="true"></i>${e(c.legend[0])}</span><span><i class="ad-key-alert" aria-hidden="true"></i>${e(c.legend[1])}</span></div><p class="ad-instruction">${e(c.instruction)}</p><div class="ad-explanations">${c.nodes.map(([id,label,,note])=>`<details><summary>${e(label)}</summary><p id="sw-note-${id}" tabindex="-1">${e(note)}</p></details>`).join('')}</div></figure>`;
}
function timeline(c){
 return `<figure class="article-diagram" data-article-diagram="timeline" aria-labelledby="sw-timeline-title" aria-describedby="sw-timeline-caption">${heading('sw-timeline','02',c.timelineLabel,c.timelineTitle,c.timelineCaption)}<ol class="ad-timeline">${c.events.map(([date,title,description])=>`<li class="ad-step"><svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="22" r="15"/><circle class="ad-time-core" cx="22" cy="22" r="5"/></svg><div><span class="ad-date">${e(date)}</span><h4>${e(title)}</h4><p>${e(description)}</p></div></li>`).join('')}</ol></figure>`;
}
function box(x,y,w,h,lines,cls=''){
 return `<g class="ad-step ad-capability ${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10"/>${text(x+w/2,y+h/2-(lines.length-1)*10+5,lines)}</g>`;
}
function defenseSvg(c,mobile){
 const suffix=mobile?'narrow':'wide',marker='sw-defense-arrow-'+suffix;
 let body;
 if(mobile){
  body=`<rect class="ad-law-frame" x="4" y="4" width="312" height="490" rx="18"/>${text(160,37,[c.law])}${text(160,62,[c.lawSub],'ad-svg-sub')}`;
  body+=['M82 162V204','M238 162V204','M82 280V328H160V368','M238 280V328H160'].map(d=>edge(d,marker)).join('');
  body+=box(14,106,136,56,[c.research])+box(170,106,136,56,[c.training],'ad-education');
  body+=box(14,208,136,72,c.tools)+box(170,208,136,72,c.people,'ad-education');
  body+=box(38,374,244,72,c.protection,'ad-protection')+text(160,473,[c.outcome],'ad-svg-sub');
 }else{
  body=`<rect class="ad-law-frame" x="5" y="5" width="690" height="410" rx="18"/>${text(350,40,[c.law])}${text(350,64,[c.lawSub],'ad-svg-sub')}`;
  body+=['M170 158V200','M530 158V200','M170 270V303H350V333','M530 270V303H350'].map(d=>edge(d,marker)).join('');
  body+=box(70,104,200,54,[c.research])+box(430,104,200,54,[c.training],'ad-education');
  body+=box(70,204,200,66,c.tools)+box(430,204,200,66,c.people,'ad-education');
  body+=box(215,338,270,64,c.protection,'ad-protection');
 }
 return `<svg class="ad-defense ad-${suffix}" viewBox="0 0 ${mobile?'320 500':'700 425'}" role="img" aria-label="${e(c.defenseCaption)}">${arrows(marker)}${body}</svg>`;
}
function defense(c){return `<figure class="article-diagram" data-article-diagram="defense" aria-labelledby="sw-defense-title" aria-describedby="sw-defense-caption">${heading('sw-defense','03',c.defenseLabel,c.defenseTitle,c.defenseCaption)}<div class="ad-board">${defenseSvg(c,false)}${defenseSvg(c,true)}</div></figure>`;}

export function withArticleDiagrams(id,body,language='it'){
 if(id!==solarwindsId)return body;
 const c=copy[language];if(!c)throw Error('Unsupported diagram language');
 function afterParagraph(html,chapter,figure){
  const start=html.indexOf(`id="${chapter}"`),end=html.indexOf('</p>',start);
  if(start<0||end<start)throw Error('SolarWinds diagram placement requires '+chapter);
  return html.slice(0,end+4)+figure+html.slice(end+4);
 }
 let result=afterParagraph(body,'capitolo-1',supply(c));
 result=afterParagraph(result,'capitolo-2',timeline(c));
 const reference='<h2 id="capitolo-5"';
 if(!result.includes(reference))throw Error('SolarWinds references chapter is missing');
 return result.replace(reference,defense(c)+reference);
}
