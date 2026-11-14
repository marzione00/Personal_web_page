import {structuredData,rss} from '../src/seo.mjs';
import {searchEntries} from '../src/search.mjs';
import {ambientContext} from '../src/experience.mjs';
import {validateSourceBoundary,validatePublicBoundary} from '../src/security.mjs';
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
validateSourceBoundary(root);validatePublicBoundary(root);
const datasets=Object.fromEntries(languages.map(language=>[language,loadContent(root,{preview:editorial,language})]));
const media=validateMedia(root),data=datasets.it;
const css=['site.css','visual.css','ambient.css','identity.css','teaching-apps.css','galaxies.css','header.css','experience.css','geometry.css','cyber-network.css','cinema.css','paths.css','article-diagrams.css','experiments.css','profile.css'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const formulaData=loadAmbientFormulas(root);
const formulaScript='window.MDCFormulaCatalog='+JSON.stringify(formulaData).replace(/</g,'\\u003c').replace(/>/g,'\\u003e')+';';
const js=formulaScript+'\n'+['i18n-client.js','app.js','search.js','reading.js','math-models.js','experiments.js','effects.js','sound.js','music.js','travel-gallery.js','geometry-loader.js','cyber-network.js','matrix-rain.js','teaching-app-launch.js','navigation.js','cinema.js'].map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n');
const viewer=fs.readFileSync(path.join(root,'public/assets/geometry-viewer.js'),'utf8');
const hash=x=>createHash('sha256').update(x).digest('base64');
const runtime={src:'assets/geometry-viewer-'+createHash('sha256').update(viewer).digest('hex').slice(0,12)+'.js',integrity:'sha256-'+hash(viewer)};
for(const d of Object.values(datasets)){d.geometryRuntime=runtime;for(const g of d.geometry.items){g.runtimeScene=`scenes/${g.id}-${g.sceneSha256.slice(0,12)}.bin`;for(const v of g.views||[])v.runtimeScene=`scenes/${v.id}-${v.sceneSha256.slice(0,12)}.bin`;}}
const geometryManifest=JSON.parse(fs.readFileSync(path.join(root,'public/geometry/manifest.json'),'utf8'));
const geometryScenes=[...new Map(geometryManifest.flatMap(g=>[...(g.views||[]),g]).map(g=>[g.id,g])).values()];
for(const g of geometryScenes){
 if((g.file&&!/^[a-z-]+\.(svg|webp)$/.test(g.file))||!/^scenes\/[a-z-]+\.bin$/.test(g.scene))throw Error('Percorso geometria non valido');
 const bytes=g.file?fs.readFileSync(path.join(root,'public/geometry',g.file)):null,scene=fs.readFileSync(path.join(root,'public/geometry',g.scene));
 if(bytes&&createHash('sha256').update(bytes).digest('hex')!==g.sha256)throw Error('Geometria diversa dal manifest: '+g.file);
 if(scene.subarray(0,4).toString()!=='MDC3'||scene.length>300000||createHash('sha256').update(scene).digest('hex')!==g.sceneSha256)throw Error('Scena non valida: '+g.id);
 if(g.file?.endsWith('.svg')&&/<(?:script|text|foreignObject|image|use)\b|\son\w+\s*=|(?:href|style)\s*=/i.test(bytes.toString('utf8')))throw Error('SVG non decorativo o non sicuro: '+g.file);
}
export const policy=(script,embedded=false)=>`default-src 'none'; script-src 'sha256-${hash(script)}' 'sha256-${hash(viewer)}'; script-src-attr 'none'; style-src ${embedded?'':"'self' "}'sha256-${hash(css)}'; img-src 'self'${embedded?' data:':''}; style-src-attr 'none'; font-src 'none'; worker-src 'none'; manifest-src 'none'; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; media-src 'self'${embedded?' data: blob:':''}`;
const music=JSON.parse(fs.readFileSync(path.join(root,'content/music-manifest.json'),'utf8'));
if(music.file!=='audio/descending-fields.mp3')throw Error('Percorso musica non autorizzato');
const musicBytes=fs.readFileSync(path.join(root,'public',music.file));
if(musicBytes.length>8*1024*1024||musicBytes.length<100000||musicBytes.subarray(0,3).toString()!=='ID3'||createHash('sha256').update(musicBytes).digest('hex')!==music.sha256||music.durationSeconds<240)throw Error('Colonna sonora non conforme al manifest');
const assets={css:{src:'assets/site-'+createHash('sha256').update(css).digest('hex').slice(0,12)+'.css',integrity:'sha256-'+hash(css)},js:{src:'assets/site-'+createHash('sha256').update(js).digest('hex').slice(0,12)+'.js',integrity:'sha256-'+hash(js)}};
const searchAssets=Object.fromEntries(languages.map(l=>{const text=JSON.stringify(searchEntries(datasets[l]));const src=`assets/search-${l}-${createHash('sha256').update(text).digest('hex').slice(0,12)}.json`;datasets[l].searchIndex=src;return [l,{src,text}];}));
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
for(const g of geometryScenes)fs.copyFileSync(path.join(root,'public/geometry',g.scene),path.join(out,'geometry',`scenes/${g.id}-${g.sceneSha256.slice(0,12)}.bin`));
fs.writeFileSync(path.join(out,runtime.src),viewer);fs.rmSync(path.join(out,'assets/geometry-viewer.js'),{force:true});
for(const asset of Object.values(searchAssets))fs.writeFileSync(path.join(out,asset.src),asset.text);
fs.writeFileSync(path.join(out,assets.css.src),css);fs.writeFileSync(path.join(out,assets.js.src),js);
const structuredHashes=new Set();
for(const language of languages){
 const target=path.join(out,language==='en'?'en':'');fs.mkdirSync(target,{recursive:true});
 for(const page of pageSets[language]){
  const canonical=indexable&&page.file!=='404.html'?new URL(pagePath(language,page.file),siteUrl).href:'';
  const alternates=canonical?languages.map(l=>`<link rel="alternate" hreflang="${l}" href="${escapeHtml(new URL(pagePath(l,page.file),siteUrl).href)}">`).join('')+`<link rel="alternate" hreflang="x-default" href="${escapeHtml(new URL(pagePath('it',page.file),siteUrl).href)}">`:'';
  const structured=structuredData(datasets[language],page,canonical),structuredHash=structured?hash(structured):'';if(structuredHash)structuredHashes.add(structuredHash);
  const pageCsp=structured?csp.replace('script-src ',`script-src 'sha256-${structuredHash}' `):csp;
  fs.writeFileSync(path.join(target,page.file),shellHtml({data:datasets[language],page,css,js,csp:pageCsp,canonical,alternates,assets,structured}));
 }
}
for(const l of languages)fs.writeFileSync(path.join(out,l==='en'?'en/feed.xml':'feed.xml'),rss(datasets[l],siteUrl||'https://marzione00.github.io/Personal_web_page/'));
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.mkdirSync(path.join(out,'.well-known'),{recursive:true});
fs.writeFileSync(path.join(out,'.well-known/security.txt'),'Contact: mailto:marzio.decorato@outlook.it\nExpires: 2027-05-08T00:00:00Z\nPreferred-Languages: it, en\n');
fs.writeFileSync(path.join(out,'_headers'),`# Hosting that supports _headers only. GitHub Pages does NOT read this file.\n/*\n  Content-Security-Policy: ${csp.replace('script-src ', 'script-src '+[...structuredHashes].map(h=>"'sha256-"+h+"'").join(' ')+' ')}; frame-ancestors 'none'\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: no-referrer\n  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), display-capture=()\n`);
fs.writeFileSync(path.join(out,'robots.txt'),indexable?`User-agent: *\nAllow: /\nSitemap: ${siteUrl}sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(indexable){
 const urls=languages.flatMap(l=>pageSets[l].filter(p=>p.file!=='404.html').map(p=>`<url><loc>${escapeHtml(new URL(pagePath(l,p.file),siteUrl).href)}</loc></url>`));
 fs.writeFileSync(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
}
fs.writeFileSync(path.join(out,'build-info.json'),JSON.stringify({version:data.site.version,languages,preview,editorial,indexable,pages:pageSets.it.length+pageSets.en.length,pagesPerLanguage:pageSets.it.length,media,geometry:geometryManifest.map(g=>g.id),generatedAt:new Date().toISOString(),dependencies:0},null,2));
if(preview){
 const pdfPaths=new Set([data.profile.cvPdf,...data.lectures.flatMap(l=>l.files),...data.posts.map(p=>p.pdf).filter(Boolean)].map(s=>s.replace(/^\//,'')));
 const embedded=Object.fromEntries([...pdfPaths].map(ref=>[ref,{name:path.basename(ref),base64:fs.readFileSync(path.join(root,'public',ref)).toString('base64')}]));
 const sceneTable=Object.fromEntries(geometryScenes.map(g=>[g.id,fs.readFileSync(path.join(root,'public/geometry',g.scene)).toString('base64')]));
 const extra=`\n(() => {
 const views=Array.from(document.querySelectorAll('[data-view]'));
 let firstRoute=true;
 function show(file,anchor=''){
  const view=views.find(v=>v.dataset.view===file);if(!view)return false;
  const changed=views.some(v=>!v.hidden&&v!==view);
  const update=()=>{
  views.forEach(v=>v.hidden=v!==view);
  document.querySelectorAll('#primary-nav a').forEach(a=>{if(a.getAttribute('href')===(file.startsWith('tema-')?'ricerca.html':file))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.querySelectorAll('[data-language]').forEach(a=>{a.dataset.page=file;a.href=(a.dataset.language==='en'?'Topological_Manifolds_preview_EN.html':'Topological_Manifolds_anteprima.html')+'#/'+file+(anchor?'#'+anchor:'');});
  document.querySelector('#primary-nav')?.classList.remove('is-open');document.querySelector('[data-menu]')?.setAttribute('aria-expanded','false');
  document.body.dataset.ambientContext=view.dataset.ambientContext;
  window.dispatchEvent(new Event('mdc:content-change'));
  document.title=view.dataset.title+' — Topological Manifolds';window.scrollTo(0,0);
  const destination=anchor?view.querySelector('#'+CSS.escape(anchor)):view.querySelector('h1');if(destination){destination.setAttribute('tabindex','-1');destination.focus({preventScroll:true});if(anchor)destination.scrollIntoView();}

  };
  if(!firstRoute&&changed&&window.MDCPageTransition)window.MDCPageTransition.run(update);else update();
  firstRoute=false;return true;
 }
 function route(){if(!location.hash.startsWith('#/'))return;const [file,anchor]=location.hash.slice(2).split('#');show(file||'index.html',anchor||'');}
 document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a||a.hasAttribute('data-language'))return;const href=a.getAttribute('href')||'';const [file,anchor]=href.split('#');if(!views.some(v=>v.dataset.view===file))return;e.preventDefault();document.querySelector('#search-dialog')?.close();if(location.hash==='#/'+href)show(file,anchor);else location.hash='/'+href;});
 window.addEventListener('hashchange',route);route();firstRoute=false;
})();`;
 const portable=`\n(() => {const files=${JSON.stringify(embedded)},urls=new Map();for(const a of document.querySelectorAll('a[href]')){const [ref,fragment]=a.getAttribute('href').replace(/^\\.\\.\\//,'').split('#'),file=files[ref];if(!file)continue;if(!urls.has(ref)){const raw=atob(file.base64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);urls.set(ref,URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})));}a.href=urls.get(ref)+(fragment?'#'+fragment:'');a.dataset.embeddedPdf=file.name;if(a.hasAttribute('download'))a.download=file.name;}})();`;
 const soundtrack=fs.readFileSync(path.join(root,'public/audio/descending-fields.mp3')).toString('base64');
 const combined='window.MDCSearchIndexes='+JSON.stringify(Object.fromEntries(languages.map(l=>[l,searchEntries(datasets[l])]))).replace(/</g,'\\u003c')+';\nwindow.ManifoldEmbeddedMusic='+JSON.stringify(soundtrack)+';\n'+viewer+'\nwindow.MDCEmbeddedScenes='+JSON.stringify(sceneTable)+';\n'+js+extra+portable;
 for(const language of languages){
  const pages=pageSets[language],d=datasets[language];
  const one={...pages[0],body:pages.map((p,i)=>`<section data-view="${p.file}" data-ambient-context="${ambientContext(p.file)}" data-title="${escapeHtml(p.title)}"${i?' hidden':''}>${p.body}</section>`).join('')};
  let standalone=shellHtml({data:{...d,preview:false},page:one,css,js:combined,csp:policy(combined,true)});
  standalone=standalone.replace(/<body ([^>]*?)data-resource-base="[^"]*">/,'<body $1data-resource-base="" data-portable="true">');
  standalone=standalone.replace(/\s(?:srcset|sizes)="[^"]*"/g,'');
  standalone=standalone.replace(/<img\b([^>]*?)\bsrc="([^"<>]+)"([^>]*?)>/g,(match,before,ref,after)=>{
   ref=ref.replace(/^\.\.\//,'');
   if(!/^(?:media\/images\/[a-z0-9_/-]+\.(?:jpe?g|png|webp)|geometry\/[a-z-]+\.(?:svg|webp))$/i.test(ref))throw Error('Immagine non incorporabile: '+ref);
   const mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'}[path.extname(ref).toLowerCase()];
   return `<img${before}src="data:${mime};base64,${fs.readFileSync(path.join(root,'public',ref)).toString('base64')}" data-original-src="${ref}"${after}>`;
  });
  standalone=standalone.replace(/<noscript>[\s\S]*?<\/noscript>/,`<noscript><p class="noscript">${language==='en'?'This offline preview requires JavaScript to navigate and open embedded PDFs. The multipage site also works without JavaScript.':'Questa anteprima offline richiede JavaScript per navigare e aprire i PDF incorporati. Il sito multipagina funziona anche senza JavaScript.'}</p></noscript>`);
  fs.writeFileSync(path.join(root,language==='en'?'Topological_Manifolds_preview_EN.html':'Topological_Manifolds_anteprima.html'),standalone);
 }
}
console.log(`Build ${data.site.version}: ${pageSets.it.length+pageSets.en.length} pagine IT/EN, ${media.files} media condivisi, ${geometryManifest.length} modelli condivisi. Indicizzazione: ${indexable?'attiva':'disattiva'}.`);
