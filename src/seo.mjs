import {escapeHtml as e} from './safety.mjs';
export function structuredData(data,page,url){
 if(!url||page.file==='404.html')return '';
 const person={'@type':'Person',name:'Marzio De Corato',url:new URL('cv.html',url).href,sameAs:[data.profile.orcid,data.profile.air,data.profile.github].filter(Boolean)};
 const common={'@context':'https://schema.org',name:page.title,url,inLanguage:data.language,description:page.description};
 let record={...common,'@type':'WebPage',about:person};
 if(page.file==='cv.html')record={...common,'@type':'ProfilePage',mainEntity:person};
 if(page.file.startsWith('articolo-')){const post=data.posts.find(p=>'articolo-'+p.id+'.html'===page.file);record={...common,'@type':'Article',headline:post.title,author:person,datePublished:post.date,mainEntityOfPage:url};}
 if(page.file.startsWith('corso-')){const course=data.courses.find(c=>'corso-'+c.id+'.html'===page.file);record={...common,'@type':'Course',name:course.title,provider:{'@type':'Organization',name:course.university},url};}
 return JSON.stringify(record).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');
}
export function rss(data,base){
 const url=new URL(data.language==='en'?'en/':'',base).href;
 return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Topological Manifolds — ${data.language==='en'?'Writing':'Scrittura'}</title><link>${e(url+'blog.html')}</link><description>${data.language==='en'?'Essays by Marzio De Corato':'Saggi di Marzio De Corato'}</description><language>${data.language}</language>${data.posts.filter(p=>!p.translationMissing).map(p=>`<item><title>${e(p.title)}</title><link>${e(url+'articolo-'+p.id+'.html')}</link><guid isPermaLink="true">${e(url+'articolo-'+p.id+'.html')}</guid><description>${e(p.excerpt)}</description><pubDate>${new Date(p.date+'T12:00:00Z').toUTCString()}</pubDate></item>`).join('')}</channel></rss>`;
}
