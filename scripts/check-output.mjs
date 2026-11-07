import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';
const folder=path.resolve(process.argv[2]||'dist');let links=0,images=0;
const files=fs.readdirSync(folder).filter(x=>x.endsWith('.html'));
for(const name of files){const html=fs.readFileSync(path.join(folder,name),'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)throw new Error('H1 non univoco: '+name);
 if(/\s(?:on[a-z]+|style)\s*=/i.test(html))throw new Error('Handler o stile inline non consentito: '+name);
 if(/unsafe-inline|unsafe-eval/.test(html))throw new Error('Policy troppo permissiva');
 if(/YOUR_GITHUB_USERNAME|TUOUSERNAME|motivo geometrico|FIG\. 01|VISUALIZZAZIONE ASTRATTA|__MDC_IN_ATTESA_SOURCE__/i.test(html))throw new Error('Segnaposto o dicitura obsoleta: '+name);
 for(const tag of ['script','style']){const text=html.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1];if(!text)throw new Error('Asset mancante');const hash=createHash('sha256').update(text).digest('base64');if(!html.includes(hash))throw new Error('Hash CSP non corrispondente');}
 for(const m of html.matchAll(/href="([^"]+)"/g)){const ref=m[1].replaceAll('&amp;','&');if(ref.startsWith('https:')||ref.startsWith('mailto:'))continue;const [file,anchor]=ref.split('#');const target=file?path.resolve(folder,file):path.join(folder,name);if(!target.startsWith(folder+path.sep))throw new Error('Percorso fuori dalla build');if(!fs.existsSync(target))throw new Error(`Link rotto: ${name} -> ${ref}`);if(anchor&&!fs.readFileSync(target,'utf8').includes(`id="${anchor}"`))throw new Error('Ancora assente: '+ref);links++;}
 for(const m of html.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)){
  const file=path.resolve(folder,m[1]);if(!file.startsWith(folder+path.sep)||!fs.existsSync(file))throw new Error('Immagine assente: '+name+' -> '+m[1]);
  if(!/\balt="[^"]*"/.test(m[0]))throw new Error('Alt mancante: '+name);
  images++;
 }
}
console.log(`Verificati ${files.length} HTML, ${links} collegamenti locali e ${images} riferimenti a immagini, unicità H1 e corrispondenza hash CSP.`);
