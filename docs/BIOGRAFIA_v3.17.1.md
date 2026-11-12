# Revisione narrativa della biografia — v3.17.1

## Intervento editoriale

Introduzione, sei capitoli scientifici, insegnamento e sei capitoli personali riscritti in IT/EN. Gli articoli servono come base per gli argomenti, senza titoli, descrizioni dei singoli contributi o rimandi bibliografici nel racconto. I contributi personali dei docenti restano distinti: gusto estetico e nanostrutture con Benedek; dottorato e accompagnamento con Ruini e Prezzi; statistica con Salini; fondamenti teorici con Cesa-Bianchi; dimensione umanistica e interpretabilità con Ferrara; sicurezza e architetture con Bruschi.

La parte personale conserva l’ordine e il ruolo delle maestre, con Alessandra centrale nel Vinyasa e nello Yin, Camilla per geometria e simbolismo degli asana, Alexandra per disciplina e analogia con l’apprendimento matematico. Sono conservati il passo greco tramandato da Plutarco, la traduzione e il prāṇāyāma con tutte le maestre. Arrampicata e riflessione sull’esperienza sviluppano argomenti propri, senza ripetere la presentazione iniziale.

Date degli incarichi, titoli di studio e conferenze restano nella cronologia strutturata. Nessuna modifica alla bibliografia della pagina Ricerca, alle risorse didattiche o al PDF originale del CV.

## Rimozione delle sovrapposizioni

Eliminati i link di approfondimento da tutti i riquadri narrativi, i dati usati per generarli e le regole CSS rimaste inutilizzate. Conservati riquadri, ancore stabili, indice, fotografie, modello di schwarzite, citazione e consultazione del CV. I testi sono sincronizzati con il mirror JSON e con docs/BIOGRAFIA.md; la versione inglese segue la medesima revisione. Nessun nuovo script, componente, dipendenza o livello grafico.

## Verifiche

- 321 test Node superati, inclusi lingua, ancore, attribuzioni, cronologia e assenza di rimandi bibliografici dai riquadri.
- Build di 60 pagine IT/EN; 2.712 collegamenti locali e 132 riferimenti a immagini verificati con H1, lingue e hash CSP.
- Fotografie originali integre e controllo di sincronizzazione editoriale superato.
- Audit del rilascio superato, inclusi budget risorse e controllo dei livelli.
- Il layout conserva la struttura responsive verificata nella v3.17.0; in questa revisione editoriale non è stato ripetuto il controllo visivo nel browser.
- Suite Python completa e CI remota non rieseguite; nessuna pubblicazione o push su GitHub.

## Consegna

Archivio completo dei sorgenti da estrarre nella radice della repository. Escluse build, anteprime e fixture temporanee. I rapporti delle versioni precedenti restano documentazione storica e non sono contenuti mostrati nella biografia.
