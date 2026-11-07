# Sicurezza · MDC_LAB 1.4

Il sito è statico. La revisione è stata verificata localmente; non è stato svolto un penetration test, né configurato l’account dell’autore. Nessuna garanzia di invulnerabilità.

## Controlli presenti

I JSON vengono validati prima del rendering; i testi sono sottoposti a escaping. Il Markdown ammesso è limitato e non esegue HTML o MDX. Sono accettati percorsi locali vincolati e collegamenti HTTPS. La build rifiuta riferimenti a file assenti e stati editoriali incoerenti.

La CSP autorizza script e stili tramite hash SHA-256. Non vengono usati `unsafe-inline`, `unsafe-eval`, tracker, font remoti o librerie CDN. L’applicazione pubblica non ha login, database, modulo di caricamento o backend propri. La parte amministrativa rimane esterna (GitHub/Pages CMS).

La versione multipagina carica le immagini dallo stesso sito; la versione monofile ammette `data:` **solo in `img-src`**, per incorporare immagini originali e grafiche. I PDF portabili sono Blob locali, aperti fuori da iframe. La verifica base64/SHA-256 confronta il contenuto incorporato con gli originali; questa verifica non è una scansione antivirus.

I controlli sulle foto verificano il file originale approvato; quelli sulle geometrie verificano gli hash del manifest e rifiutano testo SVG, script, risorse remote e handler. I file SVG decorativi sono generati dal codice e sono separati dagli allegati caricabili dal CMS; non è stata aperta la possibilità di caricare SVG arbitrari negli articoli.

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
