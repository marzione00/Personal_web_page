# Collaudo MANIFOLD v3.0

Data: 8 novembre 2026. Base: pacchetto sorgenti MDC_LAB v2.8. Nessuna modifica al repository remoto.

## Esiti verificati

- **176 test Node.js superati**, 0 falliti.
- **1283 verifiche nel browser superate**, 0 fallite: 1.224 verifiche ambientali e di layout, 53 verifiche mirate MANIFOLD/musica/nuove pagine, 6 prove WebGL.
- **42 pagine IT/EN**, **3.720 collegamenti locali**, **124 riferimenti a immagini** verificati, inclusi H1, lingua, CSP e risorse.
- **5 fotografie** corrispondenti agli SHA-256 originali. **75 file preesistenti di media e geometrie** identici alla base; i diagrammi, i PDF e le 24 scene non sono stati alterati.
- Musica: MP3 originale di 270 secondi di contenuto, stereo 44.100 Hz, 5.401.276 byte, scaricato solo dopo avvio volontario.

## Scenari esercitati

Tutte le pagine IT/EN a 320, 390, 1024 e 1440 px; margini su schermi ampi; modalità chiara/scura; menu, ricerca e preferenze; formule; pausa degli effetti; movimento ridotto; foto complete; zero download anticipato di audio e 3D.

Il player è stato esercitato con vera decodifica MP3 e Web Audio: avvio, volume, pausa, ripristino, indipendenza dal mute degli effetti, focus, percorsi della versione inglese e brano incorporato nell’anteprima offline. La riproduzione continua durante la navigazione interna della preview. Non è stato simulato un successo audio senza riprodurre il file.

Le scie hanno velocità positive nel sistema del canvas (dall’alto verso il basso), con teste luminose in basso e caratteri in dissolvenza sopra. Il test controlla il codice della texture e il cambiamento delle coordinate delle colonne, tenendo conto del riavvolgimento.

Un modello reale è stato caricato e ruotato in WebGL, con pausa delle cascate a dialogo aperto e ripresa alla chiusura. I 24 modelli non sono cambiati: gli hash sono tutti verificati, ma non si dichiara una nuova prova GPU completa di ciascun modello su ogni dispositivo.

## Revisione editoriale

MANIFOLD è il solo nome del marchio nelle pagine pubbliche. La homepage ha un richiamo breve; la spiegazione completa è separata dalla biografia, con tre esempi e distinzione fra varietà, superfici con bordo e altri oggetti dell’atlante. Le epigrafi restano complete. I contenuti IT/EN mantengono percorsi equivalenti.

Gli avvisi della licenza dichiarano il loro ambito, senza estenderlo automaticamente ai materiali altrui o al software. Il testo della musica specifica sintesi assistita da IA, assenza di campioni esterni, caricamento volontario e interruzione del playback fra documenti distinti. È stata eliminata l’affermazione precedente di assenza di colonna sonora.

Le chiavi e API interne `mdc-*`/`MDC*` rimangono per compatibilità, non come marchio visibile. I documenti delle release precedenti sono conservati in `docs/storico/` e non presentati come istruzioni correnti.

## Limiti del collaudo

Chromium locale con origin virtuale e risorse intercettate dal pacchetto; le sole fixture adattano origin/base della CSP. Hash e restrizioni dei file consegnati sono verificati separatamente. WebGL provato con Xvfb e SwiftShader software. Non è stato fatto un deploy GitHub, un penetration test o un collaudo di CMS, tecnologie assistive e tutti i dispositivi/browser reali.

La transizione fra documenti pubblicati e la conservazione del punto musicale dopo una vera navigazione HTTP non sono state esercitate sul sito remoto. Il codice conserva la posizione nella sessione e richiede Riprendi; errori di storage lasciano il lettore utilizzabile. La continuità è provata solo nell’anteprima a documento unico.

Il primo tentativo WebGL senza display virtuale non ha completato il caricamento; la prova ripetuta in processo separato con Xvfb ha superato 6/6 verifiche. Non viene conteggiato il tentativo incompleto fra le prove riuscite.

Misure audio: circa −21,3 LUFS integrati, −8,6 dBFS true peak. Non sono una valutazione soggettiva della qualità orchestrale, né una garanzia del volume percepito. La composizione è sintetica, non una registrazione di un’orchestra.

## Evidenze

`reports/unit-tests.txt`, `browser-ambient.json`, `browser-manifold.json`, `browser-ambient-webgl.json`, `link-checks.txt`, `photographs.txt`, `editorial-audit.json`, `audio-probe.json`, `audio-loudness.txt`, schermate in `anteprime/`. Il pacchetto integrale conserva queste evidenze. Le schermate sono rendering del sito, non mockup generati.
