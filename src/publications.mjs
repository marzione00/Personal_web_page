import {escapeHtml as e} from './safety.mjs';

export function scholarLink(data){
 const url=new URL(data.profile.scholar);
 url.searchParams.set('hl',data.language);
 return `<a class="text-link" href="${e(url.href)}" target="_blank" rel="noopener noreferrer">Google Scholar <span aria-hidden="true">↗</span></a>`;
}

export function publicationHighlights(data,compact=false){
 const cards=Object.entries(data.research.publicationHighlights).map(([areaId,ids])=>{
  const area=data.research.areas.find(item=>item.id===areaId);
  const records=(compact?ids.slice(0,1):ids).map(id=>{
   const work=data.publications.find(item=>item.id===id);
   return `<li><span class="meta">${e(work.year)} · ${e(work.category)}</span><a href="ricerca.html#${e(work.id)}" data-publication-jump="${e(work.id)}">${e(work.plainTitle||work.title)} <span aria-hidden="true">↗</span></a></li>`;
  });
  return `<li class="publication-highlight"><h3>${e(area.shortTitle)}</h3><ul>${records.join('')}</ul></li>`;
 });
 return `<ul class="publication-highlights">${cards.join('')}</ul>`;
}
