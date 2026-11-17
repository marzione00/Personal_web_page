/** Reviewed, precompiled scientific typesetting; no LaTeX runtime or remote code. */
import fs from 'node:fs';
export const equilibriumId='lequilibrio-sul-tappetino';
export function scientificArticle(post,language){
 if(post.id!==equilibriumId)return null;
 const html=fs.readFileSync(new URL('./scientific-articles/'+equilibriumId+'.html',import.meta.url),'utf8');
 if(/<(?:script|iframe|object|embed|style)\b|\s(?:on[a-z]+|style)\s*=/i.test(html))throw Error('Active scientific article markup');
 return html;
}
