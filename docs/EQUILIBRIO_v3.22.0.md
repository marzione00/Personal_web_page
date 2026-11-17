# L’equilibrio sul tappetino — testo e diagrammi integrati

La revisione sostituisce le 44 immagini collegate con diagrammi SVG interni
all’HTML. Curve, coordinate e campioni provengono dalle figure dell’autore;
colori, etichette, cornici e comandi seguono il tema degli articoli del sito.

## Diagrammi

- Fondo del pannello, palette scientifica adattata ai temi scuro e chiaro,
  etichette selezionabili nel carattere del sito, didascalie e numerazione.
- Nessuna immagine generata, bitmap, libreria remota o secondo visualizzatore.
- La griglia dei bacini conserva i 4096 campioni; le celle sono raccolte in
  due tracciati composti, senza migliaia di maschere duplicate.
- Il comando Esplora apre lo stesso SVG nel dialogo condiviso, con zoom,
  precedente/successiva, chiusura con Esc e ritorno del focus.
- Gli identificativi e i riferimenti del diagramma ingrandito vengono rinominati:
  nessuna collisione con il diagramma presente nell’articolo.
- Su schermi stretti i grafici densi scorrono nel proprio riquadro. La colonna
  dell’articolo usa una misura minima nulla per evitare di allargare la pagina.
- I diagrammi restano leggibili senza JavaScript; formule e descrizioni sono
  contenuto HTML/MathML nativo. Le preferenze di movimento non nascondono dati.

## Revisione editoriale

Eliminati anticipazioni redazionali, analogie secondarie e ripetizioni dei limiti
del modello. La nozione di stato compare prima del suo primo uso formale;
gli otto approfondimenti matematici hanno titoli specifici. Il richiamo allo
Yogasūtra è presentato come riflessione personale, dopo la conclusione sul
controllo ritardato. Le qualificazioni scientifiche necessarie rimangono accanto
ai modelli cui si riferiscono.

Corrette le due formule del controllo che il convertitore lasciava in TeX
letterale e il disallineamento della figura bastone–matita: 15 centimetri e
circa 0,07 secondi, coerenti con il testo. Aggiornati anche il PDF di 23 pagine,
il testo usato da ricerca e feed e il conteggio del tempo di lettura.

## Sorgenti e manutenzione

`docs/sources/equilibrio/equilibrio-originale.tex` conserva il testo dell’autore
senza modifiche, con SHA-256
`cf1ef184a5a9f6b21e56578dab18cac21482ca69c690d02e473c4708beba2105`.
La revisione corrente è `equilibrio-editoriale.tex`; `equilibrio-stampa.tex`
contiene il medesimo corpo con il preambolo portabile per il PDF.
`equilibrio-figure-web.tex` contiene le figure isolate.

Per aggiornare il testo, modificare il master editoriale, riportare il corpo
nella sorgente di stampa e usare:

```sh
python scripts/import-equilibrium.py
```

Per riesportare diagrammi e PDF, aggiornare le sorgenti tipografiche interessate:

```sh
python scripts/export-equilibrium.py
python scripts/import-equilibrium.py
```

L’esportazione richiede TeX, TikZ/pgfplots, PyMuPDF e Pandoc. Il modulo
`equilibrium-vectors.py` conserva la geometria e produce SVG passivi con testo
Unicode, riferimenti univoci e palette del sito. La build ordinaria usa i file
conservati nella repository e richiede soltanto Node.js.

## Verifiche

331 test Node superati. Controlli aggiunti alle verifiche esistenti: 44 SVG
interni, nessun tag immagine nell’articolo, assenza di formule TeX rimaste
letterali, identificativi univoci, rimandi validi e copie linguistiche coerenti.
Controllati build per GitHub e Aruba, 66 pagine, collegamenti, CSP, budget delle
risorse e integrità degli archivi. Conservati senza modifiche CV, fotografie,
audio, geometrie e allegati precedenti, salvo il PDF aggiornato di questo saggio.

Verifiche browser mirate su desktop e viewport incorporato 390 × 844, temi
scuro e chiaro, visualizzatore SVG, zoom, Esc e focus. La suite Playwright
completa rimane nel workflow GitHub e non è stata eseguita localmente.
Il PDF è stato ricompilato e controllato per testo e riferimenti; l’anteprima
della stampa nativa del browser non è stata ispezionata visivamente.
