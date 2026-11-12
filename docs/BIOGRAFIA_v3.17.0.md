# Biografia in riquadri — versione 3.17.0

## Struttura

Il profilo mantiene l’apertura con la fotografia originale e l’indice di pagina. Seguono sei riquadri scientifici: Fisica, geometria e gusto estetico; Il dottorato: leggere la materia; Statistica e analisi dei dati; I fondamenti dell’intelligenza artificiale; Interpretabilità e pensiero umanistico; Comprendere e proteggere i sistemi. I testi approvati sono suddivisi in paragrafi senza duplicare la narrazione precedente.

L’insegnamento è una sezione autonoma. Geometria e corpo comprende sei riquadri: forme corporee, Vinyasa/Yin, Ashtanga, prāṇāyāma, arrampicata e riflessione sull’esperienza. Giada, Alessandra e Camilla restano nello stesso capitolo; Alexandra ha il riquadro dedicato all’Ashtanga. Il passo greco ha marcatura della lingua e traduzione separata.

I riquadri brevi si affiancano sui desktop ampi; su schermi più stretti ogni riquadro occupa una colonna. Tutti i testi narrativi sono visibili senza espansione; soltanto la cronologia strutturata usa i dettagli espandibili preesistenti. Non sono aggiunti controlli di interazione alle fotografie o ai riquadri narrativi.

## Manutenzione e coerenza

`src/profile.mjs` e `src/profile.css` rimangono gli unici proprietari del componente e dei relativi stili. Ancore esplicite nei titoli Markdown, condivise tra IT/EN, collegano capitoli, fotografie e rimandi senza dipendere dalla loro posizione. Nessuna nuova dipendenza, animazione, traccia audio, geometria o script del browser. Nessuna modifica a fotografie, PDF e scene scientifiche.

## Verifiche

- 321 test Node superati: 318 della suite esistente e 3 sui riquadri, ancore/riordino, traduzioni e gestione sicura delle citazioni.
- Build di 60 pagine IT/EN; 2.730 collegamenti locali e 132 riferimenti a immagini controllati con H1, lingue e hash CSP.
- Integrità delle cinque fotografie originali e sincronizzazione editoriale verificate.
- Audit del rilascio superato: budget risorse, singolarità dei componenti e livelli grafici.
- Browser desktop: riquadri, schwarzite, indice e arrivo al capitolo Statistica.
- Browser con pagine incorporate a 390px IT e 320px EN: 13 riquadri ciascuna, nessun ID duplicato o scorrimento orizzontale, lingua greca presente. È un controllo responsive nel browser, non emulazione di dispositivo fisico.
- La suite Python completa e il workflow remoto non sono stati rieseguiti. Sono conservate le correzioni CI della v3.15.2.

## Consegna

Archivio sorgenti completo da estrarre nella radice della repository. Build, anteprime e fixture temporanee sono escluse. Nessun push o deployment remoto eseguito.
