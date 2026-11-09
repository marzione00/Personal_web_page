import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const folder=path.resolve(process.argv[2]||'dist');let links=0,images=0;
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(folder).filter(x=>x.endsWith('.html'));
const resolve=(file,ref)=>{const target=path.resolve(path.dirname(file),ref||path.basename(file));if(!target.startsWith(folder+path.sep))throw Error('Percorso fuori dalla build: '+ref);return target;};
for(const file of files){const name=path.relative(folder,file),html=fs.readFileSync(file,'utf8');
 const language=name.startsWith('en'+path.sep)?'en':'it';
 if(!html.includes(`<html lang="${language}">`))throw Error('Lingua HTML errata: '+name);
 const ids=[...html.matchAll(/(?<![\w-])id="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)throw Error('ID duplicati: '+name);
 for(const match of html.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(',')){const [ref,width]=candidate.trim().split(/\s+/);if(!/^\d+w$/.test(width)||!fs.existsSync(resolve(file,ref)))throw Error('Immagine responsive assente: '+name+' -> '+ref);}
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('H1 non univoco: '+name);
 if(/\s(?:on[a-z]+|style)\s*=/i.test(html))throw Error('Handler o stile inline non consentito: '+name);
 if(/unsafe-inline|unsafe-eval/.test(html))throw Error('Policy troppo permissiva');
 if(/YOUR_GITHUB_USERNAME|TUOUSERNAME|motivo geometrico|FIG\. 01|VISUALIZZAZIONE ASTRATTA|__MDC_IN_ATTESA_SOURCE__/i.test(html))throw Error('Segnaposto o dicitura obsoleta: '+name);
 const policy=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]?.replaceAll('&#39;',"'").replaceAll('&apos;',"'")||'';
 for(const kind of ['script','style']){
  const tag=kind==='script'?html.match(/<script\b[^>]*src="[^"]+"[^>]*>/)?.[0]:html.match(/<link\b[^>]*rel="stylesheet"[^>]*>/)?.[0];
  if(tag){
   const ref=tag.match(kind==='script'?/src="([^"]+)"/:/href="([^"]+)"/)[1],target=resolve(file,ref);
   if(!fs.existsSync(target))throw Error('Asset condiviso assente: '+name+' -> '+ref);
   const hash='sha256-'+createHash('sha256').update(fs.readFileSync(target)).digest('base64');
   if(!tag.includes(`integrity="${hash}"`))throw Error('Integrità asset non corrispondente: '+name);
   if(kind==='script'&&!policy.includes(hash))throw Error('Script assente dalla CSP: '+name);
   if(kind==='style'&&!policy.includes("style-src 'self'"))throw Error('CSS locale non autorizzato: '+name);
  }else{
   const text=html.match(new RegExp(`<${kind}>([\\s\\S]*?)<\\/${kind}>`))?.[1];
   if(!text||!policy.includes(createHash('sha256').update(text).digest('base64')))throw Error('Asset inline o CSP non validi: '+name);
  }
 }
 for(const block of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){const record=JSON.parse(block[1]);if(!record['@type']||!policy.includes(createHash('sha256').update(block[1]).digest('base64')))throw Error('Dati strutturati o CSP incoerenti: '+name);}
 const share=html.match(/property="og:image" content="([^"]+)"/)?.[1];
 if(share){const match=new URL(share).pathname.match(/media\/images\/share\/[a-z-]+\.png$/);if(!match||!fs.existsSync(path.join(folder,match[0])))throw Error('Anteprima social mancante: '+name);} 
 for(const m of html.matchAll(/href="([^"]+)"/g)){
  const ref=m[1].replaceAll('&amp;','&');if(ref.startsWith('https:')||ref.startsWith('mailto:'))continue;
  const [targetName,anchor]=ref.split('#'),target=resolve(file,targetName);
  if(!fs.existsSync(target))throw Error(`Link rotto: ${name} -> ${ref}`);
  if(anchor&&!(target.endsWith('.pdf')&&/^page=[1-9]\d{0,3}$/.test(anchor))&&!fs.readFileSync(target,'utf8').includes(`id="${anchor}"`))throw Error('Ancora assente: '+name+' -> '+ref);links++;
 }
 for(const m of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)){
  const target=resolve(file,m[1]);if(!fs.existsSync(target))throw Error('Immagine assente: '+name+' -> '+m[1]);
  if(!/\balt="[^"]*"/.test(m[0]))throw Error('Alt mancante: '+name);images++;
 }
 const switcher=html.match(/<nav class="language-switch"[\s\S]*?<\/nav>/)?.[0]||'';
 for(const lang of ['it','en'])if(!switcher.includes(`hreflang="${lang}"`))throw Error('Selettore lingua incompleto: '+name);
}
console.log(`Verificati ${files.length} HTML IT/EN, ${links} collegamenti locali e ${images} riferimenti a immagini, H1, lingue e hash CSP.`);
