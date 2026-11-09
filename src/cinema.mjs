/* Decorative mathematics drawn as vectors; no additional image downloads. */
export function orbitMark(kind='sphere'){
 const rings=Array.from({length:13},(_,i)=>{
  const w=10+i*6.7;
  return kind==='wave'?`<path d="M 15 ${42+i*7} Q 70 ${-24+i*9} 125 ${65+i*6} T 235 ${42+i*7}"/>`:kind==='lattice'?`<path d="M ${35+i*10} 35 L ${15+i*16} 185 M 35 ${35+i*11.5} L 215 ${15+i*13.1}"/>`:`<ellipse cx="125" cy="110" rx="${w.toFixed(1)}" ry="90"/>`;
 }).join('');
 return `<svg class="orbit-mark" viewBox="0 0 250 220" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width=".7">${rings}${kind==='sphere'?'<ellipse cx="125" cy="110" rx="90" ry="30"/><ellipse cx="125" cy="110" rx="90" ry="60"/>':''}</svg>`;
}
export function entryDialog(data,page){
 if(page.file!=='index.html')return '';
 const en=data.language==='en';
 return `<dialog class="entry-sequence" data-entry-dialog aria-labelledby="entry-title"><div class="entry-orbit">${orbitMark()}</div><div class="entry-copy"><p class="label">${en?'Research · Teaching · Exploration':'Ricerca · Didattica · Esplorazione'}</p><h2 id="entry-title">Topological<br><em>Manifolds</em></h2><p class="entry-author">Marzio De Corato</p></div><button class="entry-skip" type="button" data-entry-skip>${en?'Enter the site':'Entra nel sito'} <span aria-hidden="true">↗</span></button></dialog>`;
}
export function replayEntry(data){return `<button class="entry-replay js-only" type="button" data-entry-replay>${data.language==='en'?'Replay the opening':'Rivedi l’ingresso'} <span aria-hidden="true">↻</span></button>`;}
