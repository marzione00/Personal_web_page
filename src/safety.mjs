/** Content is data, never executable HTML. No third-party runtime dependencies. */
export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function safeExternal(value) {
  if (typeof value !== 'string' || /[\u0000-\u0020\u007f\\]/u.test(value)) return null;
  try {
    const u = new URL(value);
    if(u.protocol !== 'https:' || u.username || u.password || !u.hostname.includes('.')) return null;
    return u.href;
  } catch { return null; }
}
export function safeMedia(value) {
  if (typeof value !== 'string' || !/^\/?media\/(docs|images)\/[a-zA-Z0-9_/-]+\.(pdf|pptx|docx|png|jpe?g|webp)$/i.test(value)) return null;
  if(value.includes('..') || value.includes('//')) return null;
  return value.replace(/^\//, '');
}
export function safeId(value) {
  if(typeof value !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length>120) throw new Error('ID non valido: '+value);
  return value;
}
export function safeEmail(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) throw new Error('Email non valida');
  return value;
}
/** Deliberately restricted Markdown subset; HTML, MDX, embeds and arbitrary protocols are not supported. */
export function inlineMarkdown(value) {
  const source=String(value||'');
  const re=/(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|!?\[[^\]\n]*\]\([^\s)]+\))/g;
  let out='',last=0;
  for(const m of source.matchAll(re)) {
    out+=escapeHtml(source.slice(last,m.index));const token=m[0];
    if(token.startsWith('`'))out+='<code>'+escapeHtml(token.slice(1,-1))+'</code>';
    else if(token.startsWith('**'))out+='<strong>'+escapeHtml(token.slice(2,-2))+'</strong>';
    else if(token.startsWith('*'))out+='<em>'+escapeHtml(token.slice(1,-1))+'</em>';
    else {
      const link=token.match(/^(!?)\[([^\]]*)\]\(([^)]+)\)$/);
      const [_,image,label,raw]=link;
      const url=image?safeMedia(raw):(safeExternal(raw)||safeMedia(raw));
      if(image && url && /\.(png|jpe?g|webp)$/i.test(url))out+=`<img src="${escapeHtml(url)}" alt="${escapeHtml(label)}" loading="lazy" decoding="async">`;
      else if(!image&&url)out+=`<a href="${escapeHtml(url)}"${url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${escapeHtml(label)}</a>`;
      else out+=escapeHtml(token);
    }
    last=m.index+token.length;
  }
  return out+escapeHtml(source.slice(last));
}
export function markdown(value='') {
  let out='',list=false,code=false,buffer=[],paragraph=[];
  const flush=()=>{if(paragraph.length){out+='<p>'+inlineMarkdown(paragraph.join(' '))+'</p>';paragraph=[];}};
  const endList=()=>{if(list){out+='</ul>';list=false;}};
  for(const line of String(value).replace(/\r\n/g,'\n').split('\n')) {
    if(line.startsWith('```')) {flush();endList();if(code){out+='<pre><code>'+escapeHtml(buffer.join('\n'))+'</code></pre>';buffer=[];}code=!code;continue;}
    if(code){buffer.push(line);continue;}
    if(!line.trim()){flush();endList();continue;}
    const heading=line.match(/^(#{1,3})\s+(.+)$/), bullet=line.match(/^[-*]\s+(.+)$/),quote=line.match(/^>\s?(.*)$/);
    if(heading){flush();endList();const level=Math.max(2,heading[1].length);out+=`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;}
    else if(bullet){flush();if(!list){out+='<ul>';list=true;}out+='<li>'+inlineMarkdown(bullet[1])+'</li>';}
    else if(quote){flush();endList();out+='<blockquote><p>'+inlineMarkdown(quote[1])+'</p></blockquote>';}
    else {endList();paragraph.push(line);}
  }
  flush();endList();if(buffer.length)out+='<pre><code>'+escapeHtml(buffer.join('\n'))+'</code></pre>';return out;
}
