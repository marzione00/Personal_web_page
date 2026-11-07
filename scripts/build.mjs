import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';
import {validateMedia} from '../src/media.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
import {safeExternal,escapeHtml} from '../src/safety.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const preview=process.argv.includes('--preview'), release=process.argv.includes('--release');
const editorial=process.argv.includes('--drafts');
if(editorial&&!preview)throw new Error('Le bozze possono essere generate solo con --preview.');
const out=path.join(root,preview?'preview':'dist');
const data=loadContent(root,{preview:editorial}),media=validateMedia(root);
const css=['site.css','visual.css'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const js=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
const hash=x=>createHash('sha256').update(x).digest('base64');
const geometryManifest=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));
for(const g of geometryManifest){
 if(!/^[a-z-]+\.(svg|webp)$/.test(g.file))throw new Error('Nome geometria non valido');
 const bytes=fs.readFileSync(path.join(root,'public/geometry',g.file));
 if(createHash('sha256').update(bytes).digest('hex')!==g.sha256)throw new Error('Geometria diversa dal manifest: '+g.file);
 if(g.file.endsWith('.svg')){
  const text=bytes.toString('utf8');
  if(/<(?:script|text|foreignObject|image|use)\b|\son\w+\s*=|(?:href|style)\s*=/i.test(text))throw new Error('SVG non decorativo o non sicuro: '+g.file);
 }
}
export const policy=(script,embedded=false)=>`default-src 'none'; script-src 'sha256-${hash(script)}'; style-src 'sha256-${hash(css)}'; img-src 'self'${embedded?' data:':''}; font-src 'none'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; media-src 'none'`;
const csp=policy(js),pages=renderPages(data);
let siteUrl=(process.env.SITE_URL||data.site.siteUrl||'').trim();
if(siteUrl&&(!safeExternal(siteUrl)||/YOUR_|TUOUSERNAME|example\.(com|org)|\.test(?:\/|$)/i.test(siteUrl)))throw new Error('SITE_URL deve essere il vero URL HTTPS, non un segnaposto.');
if(release&&!siteUrl)throw new Error('Per il rilascio impostare SITE_URL (URL reale di GitHub Pages o del dominio).');
if(siteUrl&&!siteUrl.endsWith('/'))siteUrl+='/';
const indexable=!!siteUrl&&!preview&&data.site.published;
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,'public'),out,{recursive:true,filter:file=>!file.endsWith('.gitkeep')});
for(const page of pages){
 const canonical=indexable&&page.file!=='404.html'?new URL(page.file==='index.html'?'':page.file,siteUrl).href:'';
 fs.writeFileSync(path.join(out,page.file),shellHtml({data,page,css,js,csp,canonical}));
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
const headers=`# Applied only by hosting that supports _headers, NOT by GitHub Pages.\n/*\n  Content-Security-Policy: ${csp}; frame-ancestors 'none'\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n`;
fs.writeFileSync(path.join(out,'_headers'),headers);
fs.writeFileSync(path.join(out,'robots.txt'),indexable?`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(indexable)fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.filter(p=>p.file!=='404.html').map(p=>`<url><loc>${escapeHtml(new URL(p.file==='index.html'?'':p.file,siteUrl).href)}</loc></url>`).join('')}</urlset>`);
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({version:data.site.version,preview,editorial,indexable,pages:pages.length,media,geometry:geometryManifest.map(g=>g.id),generatedAt:new Date().toISOString(),dependencies:0},null,2));
if(preview){
 const extra=`\n(() => {
 const views=Array.from(document.querySelectorAll('[data-view]'));
 function show(file,anchor=''){
  const view=views.find(v=>v.dataset.view===file);if(!view)return false;
  views.forEach(v=>v.hidden=v!==view);
  document.querySelectorAll('#primary-nav a').forEach(a=>{if(a.getAttribute('href')===file)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelector('#primary-nav')?.classList.remove('is-open');document.querySelector('[data-menu]')?.setAttribute('aria-expanded','false');
  document.title=view.dataset.title+' — MDC_LAB';window.scrollTo(0,0);
  if(anchor)view.querySelector('#'+CSS.escape(anchor))?.scrollIntoView();return true;
 }
 function route(){if(!location.hash.startsWith('#/'))return;const [file,anchor]=location.hash.slice(2).split('#');show(file||'index.html',anchor||'');}
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';const [file,anchor]=href.split('#');if(!views.some(v=>v.dataset.view===file))return;e.preventDefault();document.querySelector('#search-dialog')?.close();if(location.hash==='#/'+href)show(file,anchor);else location.hash='/'+href;});
 window.addEventListener('hashchange',route);route();
})();`;
 const pdfPaths=new Set([data.profile.cvPdf,...data.lectures.flatMap(l=>l.files),...data.posts.map(p=>p.pdf).filter(Boolean)].map(s=>s.replace(/^\//,'')));
 const embedded=Object.fromEntries([...pdfPaths].map(ref=>[ref,{name:path.basename(ref),base64:fs.readFileSync(path.join(root,'public',ref)).toString('base64')}]));
 const portable=`\n(() => {const files=${JSON.stringify(embedded)},urls=new Map();for(const a of document.querySelectorAll('a[href]')){const ref=a.getAttribute('href'),file=files[ref];if(!file)continue;if(!urls.has(ref)){const raw=atob(file.base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);urls.set(ref,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})));}a.href=urls.get(ref);a.dataset.embeddedPdf=file.name;if(a.hasAttribute('download'))a.download=file.name;}})();`;
 const combined=js+extra+portable;
 const one={...pages[0],body:pages.map((p,i)=>`<section data-view="${p.file}" data-title="${escapeHtml(p.title)}"${i?' hidden':''}>${p.body}</section>`).join('')};
 let standalone=shellHtml({data:{...data,preview:false},page:one,css,js:combined,csp:policy(combined,true)});
 // Embed the EXACT bytes of each local image. No re-encoding, recompression or cropping.
 standalone=standalone.replace(/<img\b([^>]*?)\bsrc="([^"]+)"([^>]*?)>/g,(match,before,ref,after)=>{
  if(!/^(?:media\/images\/[a-z0-9_-]+\.(?:jpe?g|png|webp)|geometry\/[a-z-]+\.(?:svg|webp))$/i.test(ref))throw new Error('Immagine non incorporabile: '+ref);
  const mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[path.extname(ref).toLowerCase()];
  const encoded=fs.readFileSync(path.join(root,'public',ref)).toString('base64');
  return `<img${before}src="data:${mime};base64,${encoded}" data-original-src="${ref}"${after}>`;
 });
 standalone=standalone.replace('Le pagine, i contenuti e i collegamenti funzionano senza JavaScript. Per filtri, ricerca interattiva e modalità lettura è necessario abilitarlo.','Questa anteprima monofile richiede JavaScript per navigare e aprire i PDF incorporati. La versione multipagina funziona anche senza JavaScript.');
 fs.writeFileSync(path.join(root,'MDC_LAB_anteprima.html'),standalone);
}
console.log(`Build ${preview?'anteprima':'multipagina'} ${data.site.version}: ${pages.length} pagine, ${media.files} file media; ${geometryManifest.length} geometrie. Indicizzazione: ${indexable?'attiva':'disattiva (nessun URL definitivo)'}.`);
