# Revisione della biografia — versione 3.16.0

## Testo e attribuzioni

La presentazione e il percorso personale pongono al centro il rapporto fra geometria e corpo: configurazioni, appoggi, distribuzione del peso, respiro, equilibrio e continuità fra le posture. La prosa conserva la prima persona e periodi articolati, senza attribuire valore di dimostrazione scientifica alle esperienze personali.

Giada Merli, Alessandra Martin e Camilla Vigorelli sono riunite nel percorso Vinyasa. Ad Alessandra è attribuito un ruolo centrale nel Vinyasa e nello Yin Yoga; resta il Teacher Training di 60 ore seguito nel 2026. Alexandra Santos è associata all’Ashtanga Vinyasa. Luca Pani rimane il riferimento per l’apprendimento dell’arrampicata indoor. Le stesse attribuzioni sono presenti in inglese.

La biografia scientifica è organizzata in tre capitoli leggibili: strutture di carbonio; dati, comportamento e spiegazione; ricerca e insegnamento. I titoli, gli incarichi e le relative date sono conservati nei dati accademici. La formazione, le collaborazioni didattiche e la partecipazione al corso Quantum e post-quantum computing rimangono distinte dalle titolarità dei corsi.

## Impaginazione e coerenza

L’apertura affianca il nome e la presentazione alla fotografia originale, con accesso diretto al percorso Geometria e corpo e al PDF. Le quattro fotografie personali accompagnano i capitoli; la fotografia dell’arrampicata è abbinata ad appigli ed equilibri. Proporzioni, colori e byte originali restano invariati.

L’indice contiene cinque destinazioni; la cronologia accademica è raccolta in sezioni espandibili. I collegamenti preesistenti restano raggiungibili, compresi quelli a progetti e tesi, e aprono l’approfondimento necessario. Il meccanismo condiviso di stampa continua ad aprire i dettagli prima della stampa.

Il componente `src/profile.mjs` e `src/profile.css` sostituiscono il vecchio template e le regole dedicate sparse in `site.css` e `visual.css`. Non sono introdotti un altro motore di animazione, un nuovo livello modale o un secondo motore audio. La schwarzite riutilizza il visualizzatore condiviso. Il testo è disponibile senza attendere animazioni ed è leggibile anche senza JavaScript.

## Verifiche

- 318 test Node superati, senza test saltati; aggiornati i controlli interessati dalla nuova struttura e dalle attribuzioni delle insegnanti.
- Build di 60 pagine IT/EN; 2.708 collegamenti locali e 132 riferimenti a immagini verificati, con controllo di H1, lingue e hash CSP.
- Integrità SHA-256 delle cinque fotografie originali verificata; controllo editoriale e audit del rilascio superati.
- Browser desktop: apertura, navigazione interna, biografia in italiano e inglese, fotografie, collegamento diretto a `en/cv.html#tesi` con apertura automatica dei dettagli, visualizzatore della schwarzite con un canvas e stato pronto.
- Layout incorporati da 390 e 320 pixel: nessuno scorrimento orizzontale né ID duplicati; fotografie a colonna singola con proporzioni originali. Questi controlli sono stati effettuati nel browser desktop, senza emulare un dispositivo fisico.
- Budget rispettati: JavaScript principale 41.514 byte gzip; CSS 22.723 byte gzip. Nessun JavaScript del browser aggiunto.

La suite Python completa non è stata rieseguita in questa revisione. Il workflow remoto resta da verificare sul nuovo commit; i controlli mirati nel browser non equivalgono a un’esecuzione completa di Playwright in GitHub Actions. Sono conservate le correzioni della CI della versione 3.15.2.

## Consegna

Archivio sorgenti completo da estrarre nella radice della repository, con gli stessi materiali originali, laboratori e configurazione di pubblicazione. Build e fixture temporanee di revisione sono escluse dal pacchetto. Nessun push o deployment remoto è stato effettuato.
