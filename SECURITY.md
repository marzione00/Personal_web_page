# Sicurezza · MANIFOLD 3.0

Il sito è statico. La revisione è stata verificata localmente; non è stato svolto un penetration test, né configurato l’account dell’autore. Nessuna garanzia di invulnerabilità.

## Controlli presenti

I JSON vengono validati prima del rendering; i testi sono sottoposti a escaping. Il Markdown ammesso è limitato e non esegue HTML o MDX. Sono accettati percorsi locali vincolati e collegamenti HTTPS. La build rifiuta riferimenti a file assenti e stati editoriali incoerenti.

La CSP autorizza script inline e stili tramite hash SHA-256; il solo renderer differito è un file sullo stesso sito, con nome content-hashed e SRI. `script-src` e `connect-src` consentono il medesimo origin per caricare renderer e mesh locali. Non vengono usati `unsafe-inline`, `unsafe-eval`, tracker, font remoti o librerie CDN. L’applicazione pubblica non ha login, database, modulo di caricamento o backend propri. La parte amministrativa rimane esterna (GitHub/Pages CMS).

La versione multipagina carica immagini e MP3 dallo stesso sito. La versione monofile ammette immagini `data:` e audio incorporato `data:`/`blob:` nei rispettivi ambiti della CSP. Il file musicale viene decodificato e avviato soltanto dopo il comando esplicito del lettore. I PDF portabili sono Blob locali, aperti fuori da iframe. La verifica base64/SHA-256 confronta il contenuto incorporato con gli originali; questa verifica non è una scansione antivirus.

I controlli sulle foto verificano il file originale approvato; quelli sulle geometrie verificano gli hash del manifest e rifiutano testo SVG, script, risorse remote e handler. Le geometrie correnti usano anteprime WebP e mesh binarie MDC3 con firma, dimensione e SHA-256 controllati. Il caricatore rifiuta percorsi esterni; il decoder verifica conteggi, dimensioni e indici. Le formule sono testo escappato e non codice eseguibile. Non è aperta la possibilità di caricare SVG arbitrari negli articoli.

## Allegati

Sono mantenuti i controlli di formato, firma, dimensione, percorsi, symlink e indicatori di contenuti attivi ereditati dal progetto. Il limite per singolo file è 25 MiB. Non sono controlli antivirus completi: oggetti PDF compressi o offuscati possono sfuggire alla ricerca di token.

Il Modulo 01 conserva l’eccezione SHA-256 già presente per un falso positivo dentro un flusso compresso. L’eccezione dipende dai byte esatti e non autorizza altri documenti. In questa revisione grafica non è stata ripetuta una revisione specialistica degli oggetti PDF: sono stati verificati i checksum dei sette file e delle copie incorporate.

Se il repository è pubblico, un file respinto dalla build potrebbe comunque essere visibile nella cronologia Git. Non usare il repository come quarantena e non caricare documenti riservati o non autorizzati.

## Workflow e hosting

Il workflow conserva i riferimenti alle azioni tramite commit completi, evita di persistere le credenziali del checkout e separa il job di build dal job con permessi Pages/OIDC. Richiede `ENABLE_DEPLOY=true` per distribuire e un `SITE_URL` reale per la build di rilascio. Questo interruttore previene errori ordinari; non protegge dall’accesso ostile al repository.

`_headers` è valido solo su hosting che lo supportano; **GitHub Pages non lo applica**. La presenza del file non implica che gli header HTTP siano attivi. Verificare HTTPS, framing, header, dominio e cache sul sito effettivo. Il server locale in `scripts/serve.mjs` è esclusivamente per lo sviluppo e ascolta su 127.0.0.1.

## Verifiche ancora esterne al collaudo locale

Autenticazione e permessi Pages CMS, protezione della branch, configurazione GitHub e dominio, deployment, comportamento su browser diversi da Chromium, tecnologie assistive, backup/ripristino, disponibilità e protezioni del provider. Non sono stati configurati WAF, DDoS protection o rate limiting.

Le fonti tecniche e i riferimenti operativi delle precedenti versioni sono conservati nella documentazione storica ove presenti. La guida corrente per pubblicare è `docs/PUBBLICAZIONE.md`.

## Interazione 3D

WebGL è facoltativo e non richiede CDN, WebSocket o invii a server esterni. Un unico canvas, una cache di cinque modelli, limiti di dimensione e arresto delle animazioni riducono il consumo. Queste precauzioni non equivalgono a una certificazione del driver grafico o a un penetration test. La CSP della copia offline include le risorse incorporate autorizzate dai rispettivi hash, le immagini data URI e l’audio locale data/blob. Nessuna origine audio esterna è autorizzata.


## Ambiente, audio e transizioni

Cascate, formule e suoni sono generati in locale. La build valida le fonti del catalogo come URL HTTPS e tratta i testi come contenuto, mai come codice. Il catalogo inline è serializzato proteggendo i delimitatori HTML e rientra nell’hash CSP. La canvas non intercetta input. Le preferenze sono locali e opzionali; nessun tracking aggiuntivo.

Le nuove transizioni non cambiano destinazioni, autorizzazioni o policy di accesso. L’eventuale indisponibilità dell’API lascia funzionante la normale navigazione. Il collaudo resta locale e non sostituisce un audit dell’hosting.


La musica usa un MP3 locale con dimensione e checksum verificati in build. Il player non introduce autoplay e conserva posizione e preferenze soltanto nel browser; gli errori di storage non interrompono la pagina. Non viene eseguito codice proveniente dai metadati audio. I controlli di integrità non sono una valutazione legale dei diritti sui materiali: l’ambito della licenza è dichiarato separatamente in `LICENSE.md`.
