import {escapeHtml as e} from './safety.mjs';

export function plateImage(file, width, height, alt, responsive=false){
 const root='media/images/rendered/';
 return `<img src="${root}${file}.webp"${responsive?` srcset="${root}${file}-480.webp 480w, ${root}${file}.webp 1080w" sizes="(max-width:590px) calc(100vw - 36px), 400px"`:''} width="${width}" height="${height}" alt="${e(alt)}" loading="lazy" decoding="async">`;
}

export function carbonComparison(data){
 const en=data.language==='en',tr=(it,eng)=>en?eng:it;
 const structures=[
  ['grafene',tr('Grafene','Graphene'),tr('Gli esagoni giacciono sullo stesso piano.','The hexagons lie in a plane.')],
  ['nanotubo',tr('Nanotubo','Nanotube'),tr('Il reticolo si chiude attorno all’asse del tubo.','The lattice closes around the tube axis.')],
  ['schwarzite-reticolo','Schwarzite P688',tr('Esagoni e ottagoni si ripetono intorno ai colli della struttura.','Hexagons and octagons repeat around the necks of the structure.')]
 ];
 return `<section class="carbon-comparison" id="confronto-carbonio" aria-labelledby="titolo-confronto">
 <h2 id="titolo-confronto">${tr('Tre geometrie del carbonio','Three geometries of carbon')}</h2>
 <div class="plate-grid">${structures.map(([file,title,caption])=>`<figure class="editorial-plate">${plateImage(file,720,560,'')}<figcaption><strong>${title}</strong><p>${caption}</p></figcaption></figure>`).join('')}</div>
 <fieldset class="lattice-repeat"><legend>${tr('Periodicità della schwarzite','Schwarzite periodicity')}</legend>
 <input type="radio" name="carbon-repeat" id="carbon-once" checked><label for="carbon-once">${tr('Una cella','One cell')}</label>
 <input type="radio" name="carbon-repeat" id="carbon-many"><label for="carbon-many">${tr('27 celle','27 cells')}</label>
 <figure class="editorial-plate repeat-one">${plateImage('schwarzite-cella',720,560,tr('Una cella del reticolo P688','One cell of the P688 lattice'))}<figcaption>${tr('Una cella della P688','One P688 unit cell')}</figcaption></figure>
 <figure class="editorial-plate repeat-many">${plateImage('schwarzite-reticolo',720,560,tr('Il reticolo P688 ripetuto tre volte in ogni direzione','The P688 lattice repeated three times in each direction'))}<figcaption>${tr('3 × 3 × 3 celle della P688','3 × 3 × 3 P688 unit cells')}</figcaption></figure>
 </fieldset>
 <p class="small muted">${tr('Le strutture sono ingrandite per mostrare i legami. Ogni tavola ha una propria scala.','The structures are enlarged to reveal their bonds. Each plate has its own scale.')}</p>
 <a class="text-link" href="geometrie.html#schwarzite-neck">${tr('La schwarzite nel visualizzatore','Schwarzite in the viewer')} ↗</a>
 </section>`;
}

export function bilayerPlate(data,model){
 const en=data.language==='en';
 return `<figure class="editorial-plate research-plate">${model}
 <figcaption><a class="text-link" href="tema-fisica-nanostrutture.html#doppio-strato">${en?'How the layers align':'Come si sovrappongono gli strati'} ↗</a></figcaption></figure>`;
}

export function bilayerComparison(data){
 const en=data.language==='en';
 return `<section id="doppio-strato" class="bilayer-comparison" aria-labelledby="titolo-doppio-strato">
 <h3 id="titolo-doppio-strato">${en?'From aligned to shifted graphene':'Dall’allineamento alla traslazione del doppio strato'}</h3>
 <div class="plate-grid">${['allineati','traslati'].map((file,i)=>{const caption=en?(i?'After a lateral shift':'Aligned lattices'):(i?'Dopo la traslazione laterale':'Reticoli allineati');return `<figure class="editorial-plate">${plateImage(file,720,520,caption)}<figcaption>${caption}</figcaption></figure>`;}).join('')}</div>
 <p>${en?'The viewing angle reveals the two lattices and how the position of one changes relative to the other.':'Dalla stessa inquadratura si vede come varia la sovrapposizione dei reticoli quando uno strato trasla.'}</p>
 </section>`;
}
