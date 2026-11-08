import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const folder=path.resolve(process.argv[2]||'dist');let links=0,images=0;
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const files=walk(folder).filter(x=>x.endsWith('.html'));
const resolve=(file,ref)=>{const target=path.resolve(path.dirname(file),ref||path.basename(file));if(!target.startsWith(folder+path.sep))throw Error('Percorso fuori dalla build: '+ref);return target;};
for(const file of files){const name=path.relative(folder,file),html=fs.readFileSync(file,'utf8');
 const language=name.startsWith('en'+path.sep)?'en':'it';
 if(!html.includes(`<html lang="${language}">`))throw Error('Lingua HTML errata: '+name);
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw Error('H1 non univoco: '+name);
 if(/\s(?:on[a-z]+|style)\s*=/i.test(html))throw Error('Handler o stile inline non consentito: '+name);
 if(/unsafe-inline|unsafe-eval/.test(html))throw Error('Policy troppo permissiva');
 if(/YOUR_GITHUB_USERNAME|TUOUSERNAME|motivo geometrico|FIG\. 01|VISUALIZZAZIONE ASTRATTA|__MDC_IN_ATTESA_SOURCE__/i.test(html))throw Error('Segnaposto o dicitura obsoleta: '+name);
 for(const tag of ['script','style']){const text=html.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1];if(!text)throw Error('Asset mancante');const hash=createHash('sha256').update(text).digest('base64');if(!html.includes(hash))throw Error('Hash CSP non corrispondente: '+name);}
 for(const m of html.matchAll(/href="([^"]+)"/g)){
  const ref=m[1].replaceAll('&amp;','&');if(ref.startsWith('https:')||ref.startsWith('mailto:'))continue;
  const [targetName,anchor]=ref.split('#'),target=resolve(file,targetName);
  if(!fs.existsSync(target))throw Error(`Link rotto: ${name} -> ${ref}`);
  if(anchor&&!fs.readFileSync(target,'utf8').includes(`id="${anchor}"`))throw Error('Ancora assente: '+name+' -> '+ref);links++;
 }
 for(const m of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)){
  const target=resolve(file,m[1]);if(!fs.existsSync(target))throw Error('Immagine assente: '+name+' -> '+m[1]);
  if(!/\balt="[^"]*"/.test(m[0]))throw Error('Alt mancante: '+name);images++;
 }
 const switcher=html.match(/<nav class="language-switch"[\s\S]*?<\/nav>/)?.[0]||'';
 for(const lang of ['it','en'])if(!switcher.includes(`hreflang="${lang}"`))throw Error('Selettore lingua incompleto: '+name);
}
console.log(`Verificati ${files.length} HTML IT/EN, ${links} collegamenti locali e ${images} riferimenti a immagini, H1, lingue e hash CSP.`);
