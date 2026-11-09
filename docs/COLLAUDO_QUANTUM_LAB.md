# Collaudo — Topological Manifolds v3.3 + Quantum Lab

Data: 9 novembre 2026. Base: `marzione00/Personal_web_page`, commit `8964fc96b08671089cfb5d3561acb311bb994599`, coincidente con `origin/main` al controllo. Ambiente: Node.js 24.22.1. I comandi della repository richiedono Node.js 22+.

## Modifiche

Applicato l'aggiornamento laboratori 1.0.0: 11 file nuovi e agganci in `src/render.mjs` e `scripts/build.mjs`. La Didattica IT/EN contiene la scheda Quantum Lab; la ricerca punta alla scheda locale; il laboratorio mantiene sito e repository indipendenti.

Durante il controllo nel browser è stato corretto `src/app.js`: selezionare un risultato della ricerca chiude ora la finestra anche quando il collegamento porta a un'ancora della pagina corrente. Sono conservati i clic con tasti modificatori e la navigazione nativa. La correzione è stata ricontrollata nel browser.

README, istruzioni di caricamento e manifest descrivono questa consegna completa. Gli originali sono conservati in `docs/storico/BASE_v3.3_*`.

## Controlli automatici eseguiti

| Controllo | Esito |
| --- | --- |
| Integrità dell'aggiornamento | 30 file verificati con il manifest SHA-256 del pacchetto |
| Test dell'installatore | 14 superati |
| Audit mirato laboratori | Superato |
| Audit dei confini dei sorgenti e file pubblici | Superato |
| Importazione del CV originale | Superata; 670.385 byte identici |
| Suite completa `npm test` dopo la correzione | 215 superati, 0 falliti, 0 saltati |
| Build di rilascio | 42 pagine IT/EN |
| Controllo output | 3.766 collegamenti locali, 124 riferimenti a immagini; H1, lingue e hash CSP validi |
| Verifica fotografie | 5 originali integri, nessuna ricodifica |
| Build delle anteprime | Superata |

CV SHA-256: `24e063b275dc3cbf8a2598c04d22f10d3254723e53652ce56130af7a42726177`. Il file alla radice, la copia pubblica e il CV della repository di base coincidono byte per byte. Tutti i file preesistenti sotto `public/` sono identici alla base.

## Controlli nel browser

Verificati sul sito compilato: pagina Didattica in italiano e inglese, scheda Quantum Lab, annullamento della transizione e ripristino del focus, ricerca del laboratorio e accesso alla sua scheda con chiusura della ricerca. L'impaginazione desktop della scheda è stata ispezionata visivamente.

Dal portale compilato è stata completata la navigazione verso il Quantum Lab pubblico. Il suo collegamento di ritorno ha aperto la Didattica del sito attualmente pubblicato. Questa prova non pubblica la nuova versione del portale.

Non è stata ripetuta una matrice completa di prove su dispositivi mobili o su tutti i browser; i rapporti storici di altre consegne non sono conteggiati come nuovi risultati.

## Consegna

ZIP sorgenti completo, senza cartella contenitrice, con `.github` e CV originale. Esclusi `.git`, build `dist/`, anteprime generate, cache e backup temporanei. Il workflow GitHub Actions resta invariato e genera la build dopo il caricamento. SistemiLab non è stato integrato. Nessun commit, push o deploy remoto è stato eseguito.
