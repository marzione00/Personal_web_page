import {loadAmbientFormulas} from '../src/ambient-content.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {loadContent} from '../src/content.mjs';
import {validateMedia} from '../src/media.mjs';
import {renderPages,shellHtml} from '../src/render.mjs';
import {safeExternal,escapeHtml} from '../src/safety.mjs';
import {languages} from '../src/i18n.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const preview=process.argv.includes('--preview'),release=process.argv.includes('--release'),editorial=process.argv.includes('--drafts');
if(editorial&&!preview)throw Error('Le bozze possono essere generate solo con --preview.');
const out=path.join(root,preview?'preview':'dist');
const datasets=Object.fromEntries(languages.map(language=>[language,loadContent(root,{preview:editorial,language})]));
const media=validateMedia(root),data=datasets.it;
const css=['site.css','visual.css','ambient.css'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const formulaData=loadAmbientFormulas(root);
const formulaScript='window.MDCFormulaCatalog='+JSON.stringify(formulaData).replace(/</g,'\\u003c').replace(/>/g,'\\u003e')+';';
const js=formulaScript+'\n'+['i18n-client.js','app.js','effects.js','sound.js','travel-gallery.js','geometry-loader.js','matrix-rain.js','navigation.js'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const viewer=fs.readFileSync(path.join(root,'public/assets/geometry-viewer.js'),'utf8');
const hash=x=>createHash('sha256').update(x).digest('base64');
const runtime={src:'assets/geometry-viewer-'+createHash('sha256').update(viewer).digest('hex').slice(0,12)+'.js',integrity:'sha256-'+hash(viewer)};
for(const d of Object.values(datasets))d.geometryRuntime=runtime;
const geometryManifest=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));
for(const g of geometryManifest){
 if(!/^[a-z-]+\.(svg|webp)$/.test(g.file)||!/^scenes\/[a-z-]+\.bin$/.test(g.scene))throw Error('Percorso geometria non valido');
 const bytes=fs.readFileSync(path.join(root,'public/geometry',g.file)),scene=fs.readFileSync(path.join(root,'public/geometry',g.scene));
 if(createHash('sha256').update(bytes).digest('hex')!==g.sha256)throw Error('Geometria diversa dal manifest: '+g.file);
 if(scene.subarray(0,4).toString()!=='MDC3'||scene.length>300000||createHash('sha256').update(scene).digest('hex')!==g.sceneSha256)throw Error('Scena non valida: '+g.id);
 if(g.file.endsWith('.svg')&&/<(?:script|text|foreignObject|image|use)\b|\son\w+\s*=|(?:href|style)\s*=/i.test(bytes.toString('utf8')))throw Error('SVG non decorativo o non sicuro: '+g.file);
}
export const policy=(script,embedded=false)=>`default-src 'none'; script-src 'self' 'sha256-${hash(script)}'; style-src 'sha256-${hash(css)}'; img-src 'self'${embedded?' data:':''}; font-src 'none'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; media-src 'none'`;
const csp=policy(js),pageSets=Object.fromEntries(languages.map(l=>[l,renderPages(datasets[l])]));
if(pageSets.it.map(p=>p.file).join('|')!==pageSets.en.map(p=>p.file).join('|'))throw Error('Le lingue devono avere percorsi equivalenti.');
let siteUrl=(process.env.SITE_URL||data.site.siteUrl||'').trim();
if(siteUrl&&(!safeExternal(siteUrl)||/YOUR_|TUOUSERNAME|example\.(com|org)|\.test(?:\/|$)/i.test(siteUrl)))throw Error('SITE_URL deve essere un vero URL HTTPS.');
if(release&&!siteUrl)throw Error('Per il rilascio impostare SITE_URL.');
if(siteUrl&&!siteUrl.endsWith('/'))siteUrl+='/';
const indexable=!!siteUrl&&!preview&&data.site.published;
const pagePath=(language,file)=>(language==='en'?'en/':'')+(file==='index.html'?'':file);
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(root,'public'),out,{recursive:true,filter:f=>!f.endsWith('.gitkeep')});
fs.writeFileSync(path.join(out,runtime.src),viewer);fs.rmSync(path.join(out,'assets/geometry-viewer.js'),{force:true});
for(const language of languages){
 const target=path.join(out,language==='en'?'en':'');fs.mkdirSync(target,{recursive:true});
 for(const page of pageSets[language]){
  const canonical=indexable&&page.file!=='404.html'?new URL(pagePath(language,page.file),siteUrl).href:'';
  const alternates=canonical?languages.map(l=>`<link rel="alternate" hreflang="${l}" href="${escapeHtml(new URL(pagePath(l,page.file),siteUrl).href)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${escapeHtml(new URL(pagePath('it',page.file),siteUrl).href)}">`:'';
  fs.writeFileSync(path.join(target,page.file),shellHtml({data:datasets[language],page,css,js,csp,canonical,alternates}));
 }
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'_headers'),`# Hosting that supports _headers only. GitHub Pages does NOT read this file.\n/*\n  Content-Security-Policy: ${csp}; frame-ancestors 'none'\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()\n`);
fs.writeFileSync(path.join(out,'robots.txt'),indexable?`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(indexable){
 const urls=languages.flatMap(l=>pageSets[l].filter(p=>p.file!=='404.html').map(p=>`<url><loc>${escapeHtml(new URL(pagePath(l,p.file),siteUrl).href)}</loc></url>`));
 fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
}
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({version:data.site.version,languages,preview,editorial,indexable,pages:pageSets.it.length+pageSets.en.length,pagesPerLanguage:pageSets.it.length,media,geometry:geometryManifest.map(g=>g.id),generatedAt:new Date().toISOString(),dependencies:0},null,2));
if(preview){
 const pdfPaths=new Set([data.profile.cvPdf,...data.lectures.flatMap(l=>l.files),...data.posts.map(p=>p.pdf).filter(Boolean)].map(s=>s.replace(/^\//,'')));
 const embedded=Object.fromEntries([...pdfPaths].map(ref=>[ref,{name:path.basename(ref),base64:fs.readFileSync(path.join(root,'public',ref)).toString('base64')}]));
 const sceneTable=Object.fromEntries(geometryManifest.map(g=>[g.id,fs.readFileSync(path.join(root,'public/geometry',g.scene)).toString('base64')]));
 const extra=`\n(() => {
 const views=Array.from(document.querySelectorAll('[data-view]'));
 let firstRoute=true;
 function show(file,anchor=''){
  const view=views.find(v=>v.dataset.view===file);if(!view)return false;
  const changed=views.some(v=>!v.hidden&&v!==view);
  const update=()=>{
  views.forEach(v=>v.hidden=v!==view);
  document.querySelectorAll('#primary-nav a').forEach(a=>{if(a.getAttribute('href')===file)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('[data-language]').forEach(a=>{a.dataset.page=file;a.href=(a.dataset.language==='en'?'MDC_LAB_preview_EN.html':'MDC_LAB_anteprima.html')+'#/'+file+(anchor?'#'+anchor:'');});
  document.querySelector('#primary-nav')?.classList.remove('is-open');document.querySelector('[data-menu]')?.setAttribute('aria-expanded','false');
  document.title=view.dataset.title+' — MDC_LAB';window.scrollTo(0,0);
  if(anchor)view.querySelector('#'+CSS.escape(anchor))?.scrollIntoView();

  };
  if(!firstRoute&&changed&&window.MDCPageTransition)window.MDCPageTransition.run(update);else update();
  firstRoute=false;return true;
 }
 function route(){if(!location.hash.startsWith('#/'))return;const [file,anchor]=location.hash.slice(2).split('#');show(file||'index.html',anchor||'');}
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.hasAttribute('data-language'))return;const href=a.getAttribute('href')||'';const [file,anchor]=href.split('#');if(!views.some(v=>v.dataset.view===file))return;e.preventDefault();document.querySelector('#search-dialog')?.close();if(location.hash==='#/'+href)show(file,anchor);else location.hash='/'+href;});
 window.addEventListener('hashchange',route);route();firstRoute=false;
})();`;
 const portable=`\n(() => {const files=${JSON.stringify(embedded)},urls=new Map();for(const a of document.querySelectorAll('a[href]')){const ref=a.getAttribute('href').replace(/^\\.\\.\\//,''),file=files[ref];if(!file)continue;if(!urls.has(ref)){const raw=atob(file.base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);urls.set(ref,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})));}a.href=urls.get(ref);a.dataset.embeddedPdf=file.name;if(a.hasAttribute('download'))a.download=file.name;}})();`;
 const combined=viewer+'\nwindow.MDCEmbeddedScenes='+JSON.stringify(sceneTable)+';\n'+js+extra+portable;
 for(const language of languages){
  const pages=pageSets[language],d=datasets[language];
  const one={...pages[0],body:pages.map((p,i)=>`<section data-view="${p.file}" data-title="${escapeHtml(p.title)}"${i?' hidden':''}>${p.body}</section>`).join('')};
  let standalone=shellHtml({data:{...d,preview:false},page:one,css,js:combined,csp:policy(combined,true)});
  standalone=standalone.replace(/<body data-resource-base="[^"]*">/,'<body data-resource-base="" data-portable="true">');
  standalone=standalone.replace(/<img\b([^>]*?)\bsrc="([^"<>]+)"([^>]*?)>/g,(match,before,ref,after)=>{
   ref=ref.replace(/^\.\.\//,'');
   if(!/^(?:media\/images\/[a-z0-9_/-]+\.(?:jpe?g|png|webp)|geometry\/[a-z-]+\.(?:svg|webp))$/i.test(ref))throw Error('Immagine non incorporabile: '+ref);
   const mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[path.extname(ref).toLowerCase()];
   return `<img${before}src="data:${mime};base64,${fs.readFileSync(path.join(root,'public',ref)).toString('base64')}" data-original-src="${ref}"${after}>`;
  });
  standalone=standalone.replace(/<noscript>[\s\S]*?<\/noscript>/,`<noscript><p class="noscript">${language==='en'?'This offline preview requires JavaScript to navigate and open embedded PDFs. The multipage site also works without JavaScript.':'Questa anteprima offline richiede JavaScript per navigare e aprire i PDF incorporati. Il sito multipagina funziona anche senza JavaScript.'}</p></noscript>`);
  fs.writeFileSync(path.join(root,language==='en'?'MDC_LAB_preview_EN.html':'MDC_LAB_anteprima.html'),standalone);
 }
}
console.log(`Build ${data.site.version}: ${pageSets.it.length+pageSets.en.length} pagine IT/EN, ${media.files} media condivisi, ${geometryManifest.length} modelli condivisi. Indicizzazione: ${indexable?'attiva':'disattiva'}.`);
