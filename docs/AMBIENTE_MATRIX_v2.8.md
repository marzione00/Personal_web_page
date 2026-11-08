# Ambiente Matrix — v2.8

## Spazio e gerarchia

Un solo canvas 2D visibile, con `aria-hidden`, `pointer-events:none` e due regioni di disegno. La larghezza deriva da `main .shell`: 16 px di rispetto separano il contenuto dai margini. Nessun effetto attraversa l’area centrale. La pioggia resta ai lati anche scorrendo sezioni con fondi opachi, senza modificare il layout o la fotografia.

Le cascate hanno cifre da 6,5–7 CSS px e una trama densa, non file di simboli grandi. Le strisce sono precalcolate su una texture locale e fatte scorrere a velocità differenti. È un modello decorativo, non un flusso di dati reali.

## Formule

Catalogo di 120 relazioni in dodici famiglie: mechanics, electromagnetism, quantum, quantum-information, statistical, solid-state, probability, information, learning, algorithms, cryptography, quantitative. Ogni record contiene titolo e condizioni bilingui e un riferimento di studio. La famiglia quantitative comprende metodi quantitativi e costruzioni geometriche.

La selezione mescola le famiglie, con un mazzo senza ripetizione immediata; sono scelte solo formule che entrano completamente nella colonna. Il primo passaggio può comparire dopo circa 3,2 s, i successivi a intervalli di 10–17 s di animazione attiva; ogni formula svanisce lentamente in circa 9 s. Al massimo una per lato. Le espressioni lunghe restano consultabili nel catalogo, senza abbreviazioni imposte per ragioni di spazio.

Il menu Preferenze apre un catalogo leggibile, filtrabile per famiglia, con formule, condizioni e fonti. I riferimenti sono materiale didattico esterno, non attestazioni di risultati del proprietario del sito. Il modulo non scarica quei riferimenti: si aprono soltanto con un clic esplicito.

Attenzioni mantenute: evoluzione esponenziale per Hamiltoniana indipendente dal tempo; q misurato dal punto di Dirac; matrice dinamica normalizzata alle masse; relazioni di ensemble specificate; definizioni di entropia e base del logaritmo; RSA scolastico distinto da uno schema sicuro; LWE con riferimento FIPS 203; moto browniano geometrico come modello; superfici nodali distinte da superfici minime esatte.

## Fonti e documentazione tecnica

Ogni formula porta la sua fonte nel Markdown. I principali riferimenti di studio sono le lezioni di David Tong (Cambridge), IBM Quantum, Dive into Deep Learning, NIST/SEMATECH, MIT OpenCourseWare, Handbook of Applied Cryptography e la documentazione SHAP. Non sono riprodotti lunghi estratti di quelle opere: sono trascritte relazioni matematiche e condizioni nella notazione scelta per il sito.

Riferimenti tecnici:
- https://developer.chrome.com/docs/web-platform/view-transitions/cross-document
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions

## Budget e sospensione

Massimo 24 aggiornamenti al secondo, DPR massimo 1,5 e area raster limitata a circa 6 milioni di pixel. Il limite al numero di colonne cresce con lo spazio ma resta controllato (circa 180 complessive). Non vengono richiesti file multimediali o librerie di animazione.

Il ciclo RAF è annullato quando la scheda è nascosta, un dialogo è aperto, il visitatore sceglie una resa statica/spenta o è attiva la preferenza di movimento ridotto. Sotto 1000 CSS px e senza margini utilizzabili il canvas non viene disegnato; l’interfaccia e il catalogo restano accessibili. Queste soglie sono scelte progettuali, non certificazioni prestazionali.

## Audio

L’altoparlante continua a essere l’unico opt-in sonoro. La preferenza è salvata quando possibile, ma AudioContext è creato e riattivato solo a seguito di un gesto consentito dal browser. Nessun autoplay forzato.

- Movimento: impulso digitale filtrato, 42 ms, almeno 85 px di movimento cumulativo e 190 ms fra impulsi.
- Link/focus: tono FM di circa 88 ms, pausa minima 230 ms.
- Cambio schermata: sweep FM con breve rumore filtrato, circa 220 ms, limite 450 ms.

Un solo contesto, limite di quattro voci oscillanti, guadagni bassi, compressore e disconnessione a fine inviluppo. Il rumore aggiuntivo è limitato agli eventi di navigazione. Nessun suono di film o file remoto. Non è presente un drone sonoro continuo. Le restrizioni browser possono abbreviare il suono in uscita o richiedere un nuovo gesto dopo un cambio documento: la navigazione non viene ritardata per riprodurlo.

## Navigazione

Il sito resta multipagina statico. Gli eventi di navigazione non vengono annullati e non viene introdotto un timeout prima di cambiare URL. Con View Transitions cross-document disponibile, il contenuto esce a sinistra ed entra da destra; la barra superiore ha un gruppo stabile. Durate: 300/420 ms. Una scansione tenue di 480 ms accompagna l’ingresso. Nessun effetto di lampeggio rapido.

Nei browser senza supporto si usa un ingresso locale leggero di 280 ms dopo una navigazione interna riconosciuta, oppure la normale navigazione quando la preferenza è spenta. Link a PDF, download, siti esterni, ancore e mail non vengono intercettati. L’anteprima monofile usa `document.startViewTransition` sul cambio della sezione visibile.

## Preferenze e accessibilità

Controlli IT/EN, focus e dialoghi nativi, Esc, filtro di famiglia, persistenza opzionale locale. La preferenza di movimento ridotto ha priorità sulle transizioni e sull’avanzamento della pioggia. Lo sfondo non intercetta clic, non altera l’ordine di lettura e non produce annunci continui per i lettori di schermo. Formule e spiegazioni sono disponibili nel catalogo testuale anche se l’animazione è spenta.

## File interessati

`src/ambient-content.mjs`, `src/effects-ui.mjs`, `src/effects.js`, `src/matrix-rain.js`, `src/navigation.js`, `src/ambient.css`, `src/sound.js`; integrazione in `src/render.mjs` e `scripts/build.mjs`. La precedente implementazione Matrix è sostituita, non concatenata. Nessuna variazione alle immagini originali.
