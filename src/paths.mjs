import fs from 'node:fs';
import path from 'node:path';
import {escapeHtml as e,safeMedia,markdown} from './safety.mjs';
import {withArticleDiagrams} from './article-diagrams.mjs';
export function loadPaths(root){
 const read=n=>JSON.parse(fs.readFileSync(path.join(root,'content',n),'utf8'));
 const messages=read('ui.json'),selection=read('editorial-selection.json'),guide=read('study-guide.json');
 for(const [id,pair] of Object.entries(messages))if(!/^[a-z]+(?:\.[a-zA-Z]+)+$/.test(id)||!['it','en'].every(k=>typeof pair[k]==='string'&&pair[k].trim()&&pair[k].length<2000))throw Error('Incomplete UI translation: '+id);
 if(selection.schemaVersion!==1||!Array.isArray(selection.publications)||selection.publications.length>4)throw Error('Invalid editorial selection');
 for(const p of selection.publications)if(!/^pub-\d+$/.test(p.id)||!['it','en'].every(k=>typeof p.reason?.[k]==='string'&&p.reason[k].length<1000))throw Error('Invalid selected publication');
 if(guide.schemaVersion!==1||guide.modules.length!==7)throw Error('Invalid study guide');
 for(const m of guide.modules){if(!safeMedia(m.pdf)||!/^quantum-2026-2027-modulo-0[1-7]$/.test(m.id)||!Number.isInteger(m.pages)||!Array.isArray(m.chapters)||!m.chapters.length)throw Error('Invalid study module');
  for(const language of ['it','en'])if(typeof m.goal?.[language]!=='string'||!m.goal[language].trim()||typeof m.preparation?.[language]!=='string'||!m.preparation[language].trim())throw Error('Incomplete study guide translation');
  for(const c of m.chapters)if(typeof c.title!=='string'||c.title.length>300||!Number.isInteger(c.page)||c.page<1||c.page>m.pages)throw Error('Invalid PDF destination');
 }
 return {messages,editorialSelection:selection,studyGuide:guide};
}
export function t(data,id){const result=data.messages?.[id]?.[data.language||'it'];if(!result)throw Error('Missing UI key: '+id);return result;}
export function articleReading(post,data){
 let index=0;const items=[];
 const body=markdown(post.body).replace(/<h([23])>([\s\S]*?)<\/h\1>/g,(_,level,label)=>{const id='capitolo-'+(++index);if(level==='2')items.push({id,label});return `<h${level} id="${id}" tabindex="-1">${label}</h${level}>`;});
 const toc=items.length?`<nav class="article-toc" data-section-nav aria-label="${e(t(data,'article.index'))}"><span class="label">${e(t(data,'article.index'))}</span>${items.map(x=>`<a href="articolo-${e(post.id)}.html#${x.id}">${x.label}</a>`).join('')}</nav>`:'';
 return {body:withArticleDiagrams(post.id,body,data.language||'it'),toc};
}
export function studyMap(lecture,data){
 const m=data.studyGuide.modules.find(x=>x.id===lecture.id);if(!m)return '';
 const lang=data.language||'it';
 return `<div class="study-objectives"><h4>${lang==='en'?'Reading task':'Traccia di studio'}</h4><p>${e(m.goal[lang])}</p><details><summary>${lang==='en'?'Suggested preparation':'Preparazione suggerita'}</summary><p>${e(m.preparation[lang])}</p></details></div><details class="study-map"><summary>${e(t(data,'study.map'))} · ${m.chapters.length}</summary><p class="small">${e(t(data,'study.language'))}</p><ol>${m.chapters.map(c=>`<li id="argomento-${e(m.id)}-${c.page}"><a data-study-destination data-study-id="${e(m.id)}" data-study-page="${c.page}" data-study-title="${e(c.title)}" href="${e(safeMedia(m.pdf))}#page=${c.page}" target="_blank" rel="noopener noreferrer"><span lang="it">${e(c.title)}</span><span>${e(t(data,'study.page'))} ${c.page} ↗</span></a></li>`).join('')}</ol><p class="small muted">${e(t(data,'study.note'))}</p></details>`;
}
export function resumeStudy(data){return `<div class="study-resume" data-study-resume hidden><a class="text-link" data-study-resume-link href="corso-quantum-post-quantum-computing-2026-2027.html">${e(t(data,'study.resume'))}</a><button type="button" class="reset" data-study-forget>${e(t(data,'study.forget'))}</button><p class="small muted">${e(t(data,'study.saved'))}</p></div>`;}
export function printButton(data){return `<button type="button" class="text-link print-command js-only" data-print>${e(t(data,'print.all'))}</button>`;}
export function readingLinks(data){return `<section class="section home-reading"><div class="shell"><div class="section-head"><h2>${e(t(data,'home.personal'))}</h2></div><p class="reading-introduction">${e(t(data,'home.personalCopy'))}</p><div class="reading-links"><a href="cv.html#interessi-personali">${e(t(data,'nav.profile'))} ↗</a><a href="manifold.html#letture">${e(t(data,'home.name'))} ↗</a><a href="geometrie.html">${e(t(data,'home.atlas'))} ↗</a>${data.travels.length?'<a href="viaggi.html">'+e(t(data,'nav.travels'))+' ↗</a>':''}</div></div></section>`;}
export function citationText(pub){return `${pub.authors}. ${pub.title}. ${pub.where}. ${pub.year}.${pub.href?' '+pub.href:''}`;}
