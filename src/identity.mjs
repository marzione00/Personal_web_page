/** Editorial pages and soundtrack controls. Public copy is read from Markdown. */
import fs from 'node:fs';
import path from 'node:path';
import {sections} from './i18n.mjs';
import {escapeHtml as e, markdown} from './safety.mjs';
export function loadIdentityPages(root,language){
 const base=path.join(root,'content/markdown',language==='en'?'en':'');
 const schema={manifold:['titolo','sottotitolo','richiamo','testo','sfera','toro','mobius','nota','fonti'],licenza:['titolo','sottotitolo','testo','esclusioni','attribuzione','fonti'],musica:['titolo','sottotitolo','testo','ascolto','percorso']};
 return Object.fromEntries(Object.entries(schema).map(([id,keys])=>{
  const file=path.join(base,id+'.md'),value=sections(file);
  if(!value||keys.some(k=>!value[k]||value[k].length>18000)||Object.keys(value).some(k=>!keys.includes(k)))throw Error('Pagina editoriale incompleta: '+file);
  return [id,value];
 }));
}
export function musicControls(data){
 const en=data.language==='en';
 return `<section class="music-panel" aria-labelledby="music-panel-title"><span class="label">${en?'Original soundtrack · 4:30':'Colonna sonora originale · 4:30'}</span><h3 id="music-panel-title">Local Coordinates</h3><div class="music-actions"><button type="button" class="button" data-music-play aria-pressed="false">${en?'Play':'Ascolta'}</button><button type="button" class="button" data-music-reset>${en?'Restart':'Ricomincia'}</button><output data-music-time aria-label="${en?'Playback position':'Posizione di ascolto'}">0:00 / 4:30</output></div><label class="music-volume">${en?'Music volume':'Volume musica'}<input type="range" min="0" max="60" step="1" value="18" data-music-volume aria-label="${en?'Music volume':'Volume musica'}"><output data-music-volume-value>18%</output></label><label class="effects-check"><input type="checkbox" data-music-loop checked>${en?'Repeat the piece':'Ripeti il brano'}</label><p data-music-status role="status" class="small muted">${en?'The audio loads only when you press Play.':'L’audio si carica soltanto premendo Ascolta.'}</p><a class="text-link" href="musica.html">${en?'About the composition':'La composizione'} ↗</a></section>`;
}
export function identityPages(data){
 const en=data.language==='en',d=data.identity;
 const head=s=>`<div class="page-head"><div class="shell"><nav class="breadcrumb" aria-label="${en?'Breadcrumb':'Percorso'}"><a href="index.html">Topological Manifolds</a><span aria-hidden="true">/</span><span>${e(s.titolo)}</span></nav><h1>${e(s.titolo)}<span class="dot">.</span></h1><p class="lead">${e(s.sottotitolo)}</p></div></div>`;
 const figures=[['sfera','sphere',en?'Sphere':'Sfera'],['toro','torus',en?'Torus':'Toro'],['mobius','mobius',en?'Möbius strip':'Nastro di Möbius']];
 const m=d.manifold;
 const manifold=`${head(m)}<div class="shell page-body"><div class="prose identity-prose">${markdown(m.testo)}</div><div class="manifold-examples">${figures.map(([key,id,title])=>`<figure class="manifold-example"><img src="media/images/manifold-${id}.webp" alt="${e(title)} — ${en?'surface with a highlighted local region':'superficie con una regione locale evidenziata'}" width="800" height="640" loading="lazy" decoding="async"><figcaption><h2>${title}</h2><p>${e(m[key])}</p></figcaption></figure>`).join('')}</div><p class="small muted identity-limits">${e(m.nota)}</p><div class="actions"><a class="button" href="geometrie.html">${en?'Explore the interactive atlas':'Esplora l’atlante interattivo'} ↗</a></div><div class="identity-sources prose"><h2>${en?'Further reading':'Per approfondire'}</h2>${markdown(m.fonti)}</div></div>`;
 const l=d.licenza;
 const licence=`${head(l)}<div class="shell page-body"><article class="prose identity-prose"><p class="license-badge"><a rel="license noopener noreferrer" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank">CC BY-NC-ND 4.0</a></p>${markdown(l.testo)}<h2>${en?'Scope and exclusions':'Ambito ed esclusioni'}</h2>${markdown(l.esclusioni)}<h2>${en?'Attribution':'Attribuzione'}</h2>${markdown(l.attribuzione)}<h2>${en?'Official references':'Riferimenti ufficiali'}</h2>${markdown(l.fonti)}</article></div>`;
 const a=d.musica;
 const music=`${head(a)}<div class="shell page-body"><article class="prose identity-prose">${markdown(a.testo)}<div class="actions js-only"><button type="button" class="button primary" data-music-open>${en?'Open the music player':'Apri il lettore musicale'} ↗</button></div><noscript><p><a href="audio/local-coordinates.mp3">${en?'Open the audio file':'Apri il file audio'} — MP3</a></p></noscript><h2>${en?'Listening':'Ascolto'}</h2>${markdown(a.ascolto)}<h2>${en?'The composition':'Il percorso del brano'}</h2>${markdown(a.percorso)}<p><a href="licenza.html">${en?'Licence and production notes':'Licenza e note di produzione'} ↗</a></p></article></div>`;
 return [{file:'manifold.html',title:m.titolo,description:m.sottotitolo,body:manifold},{file:'licenza.html',title:l.titolo,description:l.sottotitolo,body:licence},{file:'musica.html',title:a.titolo,description:a.sottotitolo,body:music}];
}
