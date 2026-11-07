# Collaudo della consegna 1.4

Sono stati eseguiti **115 test Node** e **373 controlli browser**; nessun controllo fallito e nessun errore JavaScript durante la navigazione ordinaria. I dati completi sono nei rapporti della cartella `reports/`.

La build è composta da 15 pagine. Il controllo statico ha verificato 1.070 collegamenti locali e 27 riferimenti a immagini, unicità dell’H1 e corrispondenza degli hash CSP. Il controllo browser ha usato larghezze 320, 390, 768 e 1440 pixel, verificando caricamento immagini, assenza di overflow orizzontale, navigazione, filtri, ricerca, menu e modalità lettura.

## Fotografia

Il ritratto della homepage è l’originale di 486.021 byte (1274 × 2048 pixel). SHA-256: `c848f8613827ad1a38443e61ccfe4ca9ef78ea9a93111055c239ac389a763e55`. Il file in `public/`, le copie `dist/` e `preview/` e la copia decodificata dall’anteprima monofile corrispondono. Il browser mostra la foto senza filtro e con proporzioni originali. Analoghe verifiche di integrità riguardano le quattro foto della biografia.

## Geometrie

Sette asset distinti; manifest e checksum verificati. I sei SVG non contengono etichette testuali, script, immagini remote o handler. Il settimo asset è il frattale di Julia in WebP. La presenza effettiva di tutte le famiglie geometriche nel sito generato è verificata dai test. Le superfici nodali sono approssimazioni decorative, come documentato in `GEOMETRIE.md`.

## PDF

I sette moduli didattici mantengono i checksum originali. Il contenuto PDF incorporato nell’anteprima è confrontato con i file originali e i collegamenti Blob sono verificati nel browser. Questi controlli non sono una scansione antivirus e non equivalgono a un nuovo audit degli oggetti PDF.

## Ambito del browser e del server

Chromium/Playwright ha aperto l’HTML monofile con `set_content`, perché la navigazione verso URL è bloccata nell’ambiente di consegna. Le foto e le geometrie nelle schermate derivano dai byte effettivi del sito, non da mockup. Il server Node locale è stato testato separatamente tramite HTTP: homepage, SVG, WebP e JPEG restituiscono 200, MIME type corretto e byte identici alla build (4 verifiche).

Il dominio pubblico, GitHub Actions in un account reale, Pages CMS autenticato, altri browser, tecnologie assistive e configurazione dell’hosting non sono stati collaudati. Nessun deploy è stato eseguito.
