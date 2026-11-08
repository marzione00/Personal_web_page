import fs from 'node:fs';
import path from 'node:path';
import {safeExternal} from './safety.mjs';
export const formulaFamilies=Object.freeze({"mechanics": ["Meccanica", "Mechanics"], "electromagnetism": ["Elettromagnetismo", "Electromagnetism"], "quantum": ["Meccanica quantistica", "Quantum mechanics"], "quantum-information": ["Informazione quantistica", "Quantum information"], "statistical": ["Fisica statistica", "Statistical physics"], "solid-state": ["Materia e nanostrutture", "Solids and nanostructures"], "probability": ["Probabilità", "Probability"], "information": ["Teoria dell’informazione", "Information theory"], "learning": ["Apprendimento e XAI", "Learning and XAI"], "algorithms": ["Algoritmi e grafi", "Algorithms and graphs"], "cryptography": ["Crittografia", "Cryptography"], "quantitative": ["Metodi quantitativi e geometria", "Quantitative methods and geometry"]});
export function loadAmbientFormulas(root){
 const text=fs.readFileSync(path.join(root,'content/markdown/formule-ambiente.md'),'utf8').replace(/\r\n/g,'\n');
 const fields={Famiglia:'family',Titolo:'title',Title:'title_en',Formula:'formula',Condizioni:'conditions',Conditions:'conditions_en',Fonte:'source'};
 const entries=[];let entry=null;
 for(const line of text.split('\n')){
  const head=line.match(/^## ([a-z0-9-]+)\s*$/);if(head){entry={id:head[1]};entries.push(entry);continue;}
  if(!entry||!line.trim())continue;
  const m=line.match(/^([A-Za-z]+): (.*)$/);
  if(!m||!fields[m[1]])throw Error('Riga del catalogo formule non valida: '+line);
  const key=fields[m[1]];if(Object.hasOwn(entry,key))throw Error('Campo formula duplicato: '+key);
  entry[key]=m[2].trim();
 }
 if(!entries.length||entries.length>500)throw Error('Dimensione catalogo formule non valida');
 const seen=new Set();
 for(const x of entries){
  if(seen.has(x.id))throw Error('ID formula duplicato');seen.add(x.id);
  for(const key of Object.values(fields))if(!x[key]||x[key].length>1500)throw Error('Campo formula mancante o lungo: '+x.id+'/'+key);
  if(!formulaFamilies[x.family]||!safeExternal(x.source))throw Error('Famiglia o fonte non valida');
  if(x.formula.length>200)throw Error('Formula troppo lunga per il display');
 }
 return {families:formulaFamilies,entries};
}
