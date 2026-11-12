# La guerra delle false percezioni — v3.18.0

Data della consegna: 12 novembre 2026. Base: pacchetto completo v3.17.2.

## Contenuto

Il blog comprende il nuovo saggio «La guerra delle false percezioni», con il sottotitolo «Gli allarmi nelle scuole europee e la strategia del sovraccarico cognitivo di John Boyd». Il testo italiano fornito dall’autore è conservato integralmente, articolato nei sei capitoli originali e nei riferimenti conclusivi. È inclusa la traduzione inglese completa, intitolata «The War of False Perceptions».

I file editoriali sono `content/markdown/posts/la-guerra-delle-false-percezioni.md` e `content/markdown/en/posts/la-guerra-delle-false-percezioni.md`. Il contenuto usa il supporto già presente per gli articoli Markdown autonomi: non è duplicato in JSON. Le pagine pubbliche generate sono `articolo-la-guerra-delle-false-percezioni.html` e `en/articolo-la-guerra-delle-false-percezioni.html`.

## Integrazione

L’articolo compare nel blog e nel richiamo all’ultimo saggio in homepage, nella ricerca locale, nei feed italiano e inglese e nella sitemap. Riutilizza l’impaginazione di lettura, l’indice dei capitoli, il tempo di lettura e la stampa completa. Il cambio di lingua mantiene il capitolo selezionato. Non è associato un PDF inesistente; l’avviso inglese sui PDF compare soltanto negli articoli che ne possiedono uno.

I test del precedente articolo e della programmazione editoriale individuano il contenuto per identificativo, senza presumere che il blog contenga un solo articolo. Biografia, CV, fotografie, audio e geometrie della v3.17.2 restano invariati.

## Verifiche

- 321 test Node superati.
- Build pubblicabile sia per GitHub Pages sia per `https://www.mdctopologicalmanifolds.it/`.
- 62 pagine HTML IT/EN, 2.788 collegamenti locali e 132 riferimenti a immagini verificati; controlli su lingua, H1, hash CSP, sincronizzazione editoriale e budget superati.
- Nuovo articolo controllato nel browser desktop: accesso dalla homepage, impaginazione italiana, indice con destinazione al quinto capitolo, cambio lingua mantenendo il capitolo e testo inglese senza scorrimento orizzontale.
- Integrità degli archivi ZIP e conservazione dei file pubblici della versione precedente verificate.

La suite Playwright completa e il workflow GitHub remoto non sono stati eseguiti in questa revisione; rimangono configurati nella CI. Non sono stati effettuati push su GitHub o caricamenti sull’account Aruba.

## Provenienza

Cronologia, dati e riferimenti dell’articolo provengono dal testo fornito dall’autore. Questa integrazione non comprende una verifica giornalistica indipendente degli episodi citati. La versione inglese è una traduzione redazionale; il passo di Boyd traduce il brano italiano ricevuto e non viene presentato come trascrizione verificata dell’originale inglese.
