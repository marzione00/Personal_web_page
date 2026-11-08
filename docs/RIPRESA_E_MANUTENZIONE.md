# Ripresa e manutenzione — versione 2.3

Usare questa cartella come unica base. Non sovrapporre sorgenti di release precedenti. Conservare ZIP completo, manifest e fotografie approvate.

La prosa è in `content/markdown/`; la struttura è in `src/`, i metadati in `content/*.json` e raccolte JSON; `public/media/` contiene i documenti e le fotografie originali. `public/geometry/` contiene le anteprime e le mesh. Il generatore opzionale è in `tools/`, le spiegazioni in `content/markdown/geometrie/`.

Una modifica di testo richiede soltanto il file Markdown e il commit; una modifica a camera, mesh o associazioni grafiche richiede una revisione tecnica e i test. Non sostituire mai fotografie con immagini generate. Gli hash delle cinque fotografie sono verificati in fase di compilazione e nei test.

Eseguire `npm test`, `npm run build`, `npm run check`, `npm run verify:photos` prima della consegna. Le prove browser e i limiti sono in `docs/COLLAUDO_v2.3.md`. Per rigenerare l’anteprima offline usare `npm run preview:build`.

Questioni esterne a questa release: il CV PDF rimane precedente agli aggiornamenti delle docenze; una pubblicazione resta senza abstract consultabile; accesso CMS, account, hosting, sicurezza operativa e performance reali non sono certificati dal collaudo locale.

Contenuti da preservare: il saggio «Colpire i nervi del sistema» con le sue sette figure e il PDF; il Teacher Training di 60 ore del 2026 con Alessandra Martin; la fotografia della homepage e le quattro foto personali originali. Per l’editing tramite Pages CMS utilizzare il collegamento al repository GitHub e collaudarne separatamente autorizzazioni e salvataggi.
