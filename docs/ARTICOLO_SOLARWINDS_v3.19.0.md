# SolarWinds e la vulnerabilità degli Stati digitali — v3.19.0

Consegna: 14 novembre 2026. Base: pacchetto completo v3.18.0.

## Revisione editoriale

Il corpo italiano passa da 2.010 a 1.298 parole: riduzione del 35,42%, contando i termini separati da spazi ed escludendo titolo, sottotitolo, intestazioni e bibliografia. L'apertura conserva il danno istituzionale dello spionaggio; la conclusione sviluppa il rapporto fra norme, ricerca tecnologica e formazione. Sono accorpate le ripetizioni sulle dipendenze dai fornitori, sull'autonomia delle amministrazioni e sul recupero dopo un'intrusione.

Il saggio comprende 17 paragrafi, quattro capitoli e una bibliografia di 18 documenti pertinenti, ripresi dal materiale fornito. L'inglese comprende gli stessi paragrafi, capitoli e riferimenti. Le attribuzioni restano associate alle autorità o alle imprese che le hanno formulate; il confronto fra campagne riguarda i meccanismi di accesso. L'attribuzione degli incidenti alla refrigerazione resta aperta.

I fatti e i riferimenti sono quelli del testo fornito e rivisto con l'autore. Questo aggiornamento editoriale non comprende una nuova verifica giornalistica indipendente degli episodi.

## Integrazione e assenza di duplicazioni

Le uniche fonti editoriali del nuovo articolo sono:

- `content/markdown/posts/solarwinds-e-la-vulnerabilita-degli-stati-digitali.md`
- `content/markdown/en/posts/solarwinds-e-la-vulnerabilita-degli-stati-digitali.md`

Le pagine vengono generate attraverso l'impaginazione degli articoli già presente, con indice, tempo di lettura, stampa e cambio lingua. Il contenuto è incluso in homepage, blog, ricerca locale, feed e sitemap. Non è stato duplicato in JSON, JavaScript, pagine manuali o un secondo renderer. Tutti i file `src/`, gli altri articoli, la biografia, il CV, le fotografie, le geometrie e gli audio conservano i byte del pacchetto precedente.

## Verifiche

- 321 test Node superati, nessun fallimento.
- Build per GitHub Pages e per `https://www.mdctopologicalmanifolds.it/`.
- Per entrambe: 64 pagine HTML IT/EN, 2.860 collegamenti locali, 132 riferimenti a immagini, H1, lingue e hash CSP verificati.
- 62 URL canonici e 62 URL nella sitemap, coerenti con il dominio di destinazione; tre articoli pubblicati in ciascun feed.
- Tutti i paragrafi del nuovo articolo ritrovati integralmente nell'HTML di entrambe le lingue; nessun paragrafo o ID duplicato.
- Verifica dei confini di build, delle fotografie, della sincronizzazione editoriale e dei budget delle risorse superata; un solo proprietario per ciascun componente e finestra di dialogo.
- Browser: apertura dalla homepage, impaginazione desktop, navigazione al quarto capitolo e cambio lingua conservando l'ancora.
- Browser mobile: entrambe le lingue in viewport da 390 px, senza overflow orizzontale, con indice funzionante e destinazione del capitolo visibile sotto l'intestazione.
- Integrità degli ZIP e corrispondenza dei byte dei file inclusi verificate in fase di confezionamento.

La suite Playwright completa resta configurata nel workflow GitHub e non è stata rieseguita in questo ambiente; sono stati eseguiti i controlli browser mirati sopra descritti. Nessun push su GitHub o caricamento sull'account Aruba è stato effettuato.
