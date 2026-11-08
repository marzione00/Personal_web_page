# Sicurezza — Topological Manifolds 3.3

## Perimetro e limiti

Questa revisione rafforza il generatore statico, il JavaScript del browser, il caricamento delle risorse e il workflow fornito. Non è una certificazione di invulnerabilità, un penetration test del sito online o una verifica di tutti gli attacchi conosciuti. Nessuna modifica è stata eseguita su account GitHub, DNS, hosting o CMS autenticato.

Il sito non ha backend applicativo, login pubblico, database o modulo di upload per i visitatori. SQL injection, esecuzione di comandi su un server applicativo e CSRF su account del sito non corrispondono a funzioni presenti in questo frontend; questo non esclude vulnerabilità del provider, del browser o degli strumenti amministrativi.

## Protezioni applicate

- Markdown limitato ed escaping dei contenuti: niente HTML/MDX eseguibile, embed arbitrari o protocolli attivi nei link. Conservati i controlli esistenti.
- CSP: gli script sono autorizzati con hash SHA-256 espliciti. Rimossa l'autorizzazione generica `script-src 'self'`; il renderer differito richiede anche SRI. Vietati handler inline, eval, plugin, worker, form e frame nel sito.
- Scene 3D: percorsi vincolati, hash SHA-256 verificato nel browser prima della decodifica, massimo 300.000 byte letto in streaming, quattro richieste pendenti e cinque modelli in cache. Rifiutati redirect e camera non finita/flag sconosciuti. Il decoder conserva limiti su vertici, triangoli e indici. Senza WebCrypto su un contesto sicuro il 3D resta in fallback statico.
- Build: allowlist dei file pubblicabili, rifiuto di symlink e file non regolari, limiti di dimensione/profondità/numero. Nessun HTML o JavaScript arbitrario può essere aggiunto alla cartella degli allegati e copiato automaticamente nella distribuzione.
- PDF: controllo base di firma/dimensione e indicatori attivi, inclusi nomi PDF con escape esadecimali. Sono euristiche, NON una scansione antivirus completa. Rimane l'eccezione SHA-256 già documentata per un falso positivo nel Modulo 01; non autorizza altri file.
- Office: controlli sulla struttura ZIP, nomi duplicati, dimensioni espanse e XML; rifiuto di macro, DTD, entità e relazioni esterne. Alcuni documenti legittimi con relazioni esterne richiedono revisione invece di essere pubblicati automaticamente.
- Workflow: azioni già fissate a SHA completi, credenziali checkout non persistite, token di lettura per build e privilegi Pages/OIDC solo nel job deploy. Upload e deploy sono ora limitati a `main` e mai a pull request. CODEOWNERS richiede configurazione di regole per diventare vincolante.
- Server di prova: solo loopback, controllo realpath contro symlink, limiti delle richieste e MIME corretti. Non è un server di produzione.

Un soggetto capace di modificare contemporaneamente codice e manifest nel repository può cambiare anche questi controlli. L'integrità non sostituisce la protezione dell'account e la revisione dei commit. Le dipendenze transitive delle GitHub Actions non sono state bloccate con un lockfile in questa revisione.

## Cosa resta da configurare o verificare fuori dal pacchetto

Passkey/2FA e recupero dell'account, autorizzazioni dei collaboratori e del CMS, protezioni della branch, revisioni dei cambi critici, gestione del dominio, HTTPS, backup e ripristino. Aggiornare Node, browser e azioni quando disponibili correzioni pertinenti.

Il file `_headers` è preparato per hosting che lo interpretano: GitHub Pages non applica quel file. La CSP nel markup è attiva, ma `frame-ancestors` richiede un header HTTP e non funziona in un meta tag. La protezione anti-framing, HSTS, Permissions-Policy e gli altri header effettivi devono essere verificati sulla risposta dell'hosting, non dedotti dai sorgenti. Non sono stati configurati WAF, rate limiting o mitigazioni DDoS del provider.

I controlli degli allegati non escludono vulnerabilità dei lettori PDF, dei decoder di immagini o dei driver GPU. Prima di caricare nuovi documenti usare strumenti aggiornati e una scansione antivirus appropriata. Su un repository pubblico anche file respinti dalla build e bozze possono restare nella cronologia Git.

Il nuovo CV non è stato sottoposto a verifica binaria: i suoi byte non erano disponibili nel container. L'importatore eseguirà controlli di base e copia byte-identica quando il proprietario aggiungerà `CV.pdf`; non equivale a una certificazione di sicurezza del documento.

## Riferimenti primari

- OWASP Content Security Policy Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- OWASP File Upload Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- GitHub Actions, secure use: https://docs.github.com/en/actions/reference/security/secure-use
- MDN, frame-ancestors: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors

Consultati l'8 novembre 2026. Risultati e limiti dei test della consegna: `docs/COLLAUDO_v3.3.md`.
