/** Reviewed, precompiled scientific typesetting; no LaTeX runtime or remote code. */
import fs from 'node:fs';
export const equilibriumId='lequilibrio-sul-tappetino';
export const thinkingEssayId='il-pessimo-rapporto-fra-l-ia-e-il-pensiero-umano';
export function scientificArticle(post,language){
 if(![equilibriumId,thinkingEssayId].includes(post.id))return null;
 const suffix=language==='en'?'.en':'';
 const html=fs.readFileSync(new URL('./scientific-articles/'+post.id+suffix+'.html',import.meta.url),'utf8');
 if(/<(?:script|iframe|object|embed|style)\b|\s(?:on[a-z]+|style)\s*=/i.test(html))throw Error('Active scientific article markup');
 return html;
}
