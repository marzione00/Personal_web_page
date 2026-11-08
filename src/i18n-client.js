/* Small runtime dictionary for asynchronous viewer messages only. Prose is built statically. */
(() => {
 'use strict';
 const messages={"Movimento ridotto: animazioni automatiche disattivate": "Reduced motion: automatic animations are disabled", "Attiva le animazioni al passaggio del puntatore": "Enable animations on hover", "Disattiva le animazioni al passaggio del puntatore": "Disable animations on hover", "Visualizzatore non disponibile.": "Viewer unavailable.", "Caricamento del visualizzatore non riuscito.": "The viewer could not be loaded.", "Percorso modello non valido.": "Invalid model path.", "Modello non disponibile.": "Model unavailable.", "Modello troppo grande.": "Model exceeds the size limit.", "Il contesto 3D è stato interrotto. Immagine, formula e spiegazione restano disponibili.": "The 3D context was interrupted. The image, formula and explanation remain available.", "Trascina per esplorare il modello. Formula e spiegazione sono accanto alla figura.": "Drag to explore the model. Its formula and explanation are next to the figure.", "Esplora il modello": "Explore the model", "Caricamento del modello 3D…": "Loading the 3D model…", "3D non disponibile. La spiegazione resta consultabile.": "3D unavailable. The explanation is still available.", "La preferenza di movimento ridotto è attiva. Puoi orientare il modello con le frecce.": "Reduced motion is enabled. You can orient the model using the arrow keys.", "Modello non valido.": "Invalid model.", "Formato modello non riconosciuto.": "Unrecognised model format.", "Limiti del modello superati.": "Model limits exceeded.", "Modello incompleto.": "Incomplete model.", "Indice non valido.": "Invalid index.", "Il 3D non è disponibile: rimangono visibili immagine, formula e spiegazione.": "3D is unavailable: the image, formula and explanation remain visible.", "Shader non disponibile.": "Shader unavailable.", "Rendering non disponibile.": "Rendering unavailable."};
 window.MDCTranslate=text=>document.documentElement.lang==='en'?(messages[text]||text):text;
 document.addEventListener('click',event=>{
  const a=event.target.closest('[data-language]');if(!a)return;
  try{localStorage.setItem('mdc-language',a.dataset.language);}catch{/* Storage is optional. */}
  if(document.body.dataset.portable==='true'){
   const route=location.hash.startsWith('#/')?location.hash.slice(2):'index.html';
   a.href=(a.dataset.language==='en'?'MANIFOLD_preview_EN.html':'MANIFOLD_anteprima.html')+'#/'+route;
  } else if(location.hash&&!location.hash.startsWith('#/')){
   const url=new URL(a.href,location.href);url.hash=location.hash;a.href=url.href;
  }
 });
})();
