# Revisione MANIFOLD v3.0

## Perimetro

Base: sorgenti v2.8 consegnati in conversazione. Sono stati aggiunti nome, spiegazione geometrica, licenza dei contenuti e colonna sonora. Le fotografie, i PDF, i diagrammi del saggio e i 24 modelli 3D non sono stati ricodificati. I testi approvati non sono stati riscritti salvo riferimenti al vecchio nome e stringhe di interfaccia.

Il nome compare una sola volta come identità; la homepage contiene un breve richiamo e la pagina `manifold.html` contiene l’approfondimento. La biografia non è stata allungata per ripetere la spiegazione del nome. Le illustrazioni della nuova pagina sono statiche e mostrano carte locali; gli oggetti dell’atlante restano distinti.

## Licenza

CC BY-NC-ND 4.0 è la versione internazionale corrente verificata nelle fonti ufficiali CC l’8 novembre 2026. Non viene presentata come licenza universale di ogni allegato. Codice, citazioni e materiali soggetti a diritti esterni sono esclusi dal nuovo avviso generale. Le condizioni preesistenti dei documenti restano valide. Non si promette revocabilità delle copie già licenziate. Fonti: https://creativecommons.org/licenses/by-nc-nd/4.0/ e https://creativecommons.org/faq/.

## Musica e suoni

`Local Coordinates` dura 270 secondi. Sintesi procedurale deterministica, 74 eventi di partitura, nessun campione esterno. Timbri sintetici di archi/coro, fondamentali lente, risonanze morbide, riverbero stereo. Non è una registrazione orchestrale e non riproduce temi o orchestrazioni di una colonna sonora esistente. Il generatore è `tools/compose-soundtrack.py`; la partitura è nel pacchetto audio e in `source-materials/music/score.json`.

Il sito include solo l’MP3 (circa 5,4 MB), caricato al primo clic sul lettore. Master FLAC e generatore sono conservati separatamente per la ripresa futura. Il player è opt-in, ha volume, pausa, ripristino e loop. Le dissolvenze del brano rendono morbida la ripetizione, senza garantire un loop impercettibile. Nella preview monofile l’audio sopravvive al cambio di vista; fra documenti HTML viene interrotto e si riprende volontariamente dalla posizione salvata. Non è stato trasformato il sito in una SPA.

Gli effetti di interfaccia hanno voci sinusoidali con lieve FM, inviluppi morbidi e poche attivazioni. Cursore: almeno 180 px di tragitto e 520 ms tra eventi; link: almeno 360 ms; navigazione: almeno 650 ms. Le voci contemporanee sono al massimo tre. Con musica in riproduzione il loro livello diminuisce ulteriormente.

## Cascate

Movimento verticale crescente sul canvas; la testa luminosa è nel punto inferiore di ciascuna scia e i caratteri precedenti restano sopra. Nessuna colonna sale. Rimangono densità, margini adattivi, catalogo delle 120 formule, pausa nelle finestre e rispetto del movimento ridotto.

## Compatibilità

Le chiavi localStorage `mdc-*` e gli oggetti JavaScript interni `MDC*` non sono residui editoriali: restano per compatibilità delle preferenze e del visualizzatore. Foto e allegati originali possono contenere intestazioni precedenti; non sono stati alterati per rinominare il sito.
