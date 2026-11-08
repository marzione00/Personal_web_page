# MDC_LAB v2.6 — Collaudo della sezione Viaggi e album

Data: 8 novembre 2026. Base: versione v2.5 con due lingue, 24 modelli e audio opzionale.

## Esiti verificati

- **157 test automatici Node.js** superati, inclusi i controlli su Markdown di viaggio, bozza, date, traduzione, riferimenti fotografici, sicurezza dei percorsi e integrità del sistema precedente.
- **Build di pubblicazione con URL GitHub Pages** completata: 36 pagine HTML (18 per lingua) prima di caricare il primo viaggio.
- **2.998 collegamenti locali e 118 riferimenti a immagini** verificati; controllo CSP, H1 e lingue superato.
- **Cinque fotografie originali** confermate per hash SHA-256, senza ricodifica. Restano invariati i 24 modelli e i PDF didattici.
- **9 verifiche locali nel browser** superate: archivio vuoto IT/EN su desktop e mobile, accesso dalla homepage, un diario temporaneo con due fotografie autentiche copiate senza trasformazione, apertura dell'album e controlli da tastiera IT/EN.
- Una seconda copia temporanea del progetto è stata compilata con il diario di prova; **il diario di prova non si trova nel pacchetto consegnato**.

## Funzioni verificate

- Navigazione e footer IT/EN con Viaggi/Travels; archive `viaggi.html`, lingua inglese sotto `en/viaggi.html`.
- Un file Markdown per viaggio e album; fotografie nella cartella associata allo slug. Ordinamento per data e filtro di ricerca/tipo quando necessario.
- Bozze escluse dal sito pubblico, ma leggibili nei sorgenti di un repository pubblico; file fotografici non presenti non vengono mostrati come link rotti nella bozza editoriale.
- Pubblicazione bloccata in caso di fotografie mancanti, percorsi fuori dalla cartella del diario o riferimenti non sicuri.
- Una traduzione mancante è segnalata, con collegamento alla versione italiana.
- Visualizzatore con foto integra, didascalia, precedente/successiva, Esc, supporto tastiera e normale collegamento senza JS.

## Limiti

Sono controlli locali in Chromium con origin virtuale e risorse provenienti dai file del pacchetto, perché l'ambiente non consente la navigazione HTTP diretta. Non sono state misurate prestazioni di rete o risorse GPU reali, né è stato collaudato il CMS autenticato su GitHub Pages. Non è stato eseguito un penetration test. Le fotografie di viaggio possono contenere EXIF GPS: la verifica dei metadati prima della pubblicazione spetta all'autore; il sito non modifica gli originali.
