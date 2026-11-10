/* Decorative mathematics drawn as vectors; no additional image downloads. */
export function orbitMark(kind='sphere'){
 const rings=Array.from({length:13},(_,i)=>{
  const w=10+i*6.7;
  return kind==='wave'?`<path d="M 15 ${42+i*7} Q 70 ${-24+i*9} 125 ${65+i*6} T 235 ${42+i*7}"/>`:kind==='lattice'?`<path d="M ${35+i*10} 35 L ${15+i*16} 185 M 35 ${35+i*11.5} L 215 ${15+i*13.1}"/>`:`<ellipse cx="125" cy="110" rx="${w.toFixed(1)}" ry="90"/>`;
 }).join('');
 return `<svg class="orbit-mark" viewBox="0 0 250 220" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width=".7">${rings}${kind==='sphere'?'<ellipse cx="125" cy="110" rx="90" ry="30"/><ellipse cx="125" cy="110" rx="90" ry="60"/>':''}</svg>`;
}
export function entryDialog(data,page){
 const en=data.language==='en';
 const rain=Array.from({length:28},(_,i)=>`<i>${Array.from({length:22},(_,j)=>'01ψλ∇Σ∂'[(i*3+j*5)%7]).join(' ')}</i>`).join('');
 return `<dialog class="entry-sequence" data-entry-dialog aria-labelledby="entry-title" aria-describedby="entry-description"><div class="entry-rain" aria-hidden="true">${rain}</div><div class="entry-orbit">${orbitMark()}</div><div class="entry-copy"><p class="label">${en?'Research · Teaching · Exploration':'Ricerca · Didattica · Esplorazione'}</p><p class="entry-code" data-entry-code aria-hidden="true">TOPOLOGICAL MANIFOLDS</p><h2 id="entry-title">Topological<br><em>Manifolds</em></h2><p class="entry-author">Marzio De Corato</p><p class="entry-description" id="entry-description">${en?'Follow the code, explore the forms. Choose how to enter.':'Segui il codice, esplora le forme. Scegli come entrare.'}</p><div class="entry-actions"><button type="button" class="button primary" data-entry-audio="on">${en?'Enter with audio':'Entra con audio'} <span aria-hidden="true">↗</span></button><button type="button" class="button" data-entry-audio="off" autofocus>${en?'Enter in silence':'Entra in silenzio'}</button></div><p class="small muted">${en?'Music and effects have separate volume controls.':'Musica ed effetti hanno volumi indipendenti.'}</p></div><button class="entry-skip" type="button" data-entry-skip>${en?'Skip opening':'Salta l’ingresso'} <span aria-hidden="true">↗</span></button></dialog>`;
}
export function replayEntry(data){return `<button class="entry-replay js-only" type="button" data-entry-replay>${data.language==='en'?'Replay the opening':'Rivedi l’ingresso'} <span aria-hidden="true">↻</span></button>`;}
