---
title: L’equilibrio sul tappetino
subtitle: Un’introduzione illustrata alla teoria della stabilità di Lyapunov attraverso quattro esempi della pratica.
category: Saggi
excerpt: Che cosa significa restare in equilibrio? Palline, pendoli e quattro esempi della pratica yoga accompagnano un percorso illustrato fra stabilità, energia, retroazione e geometria degli stati.
date: 2026-11-17
tags: Geometria, Yoga, Lyapunov, Stabilità, Sistemi dinamici
draft: false
sourceStatus: approved
pdf: media/docs/equilibrio-sul-tappetino.pdf
---

> *sthira-sukham āsanam*  
> La posizione sia stabile e piacevole.  
> Patañjali, Yogasūtra II.46

## Una caduta, per cominciare

Chi ha imparato Śīrṣāsana ricorda le prime cadute. Per qualche secondo il corpo capovolto sembra reggersi; poi l’inclinazione cresce e le correzioni non bastano più. In Śavāsana si può osservare una risposta diversa: un braccio rilassato, sollevato di poco, tende a ricadere verso il pavimento e a fermarsi (figura [1](articolo-lequilibrio-sul-tappetino.html#figura-01)). Per il braccio consideriamo il solo movimento verticale, fino al contatto con il suolo.

Figura 1. Risposte a una perturbazione. In Śīrṣāsana l’inclinazione tende a crescere se mancano le correzioni; il braccio rilassato in Śavāsana ricade verso il pavimento.

La teoria della stabilità studia come un sistema risponde a piccoli disturbi. Aleksandr Michajlovič Ljapunov, noto nella letteratura internazionale come Lyapunov, ne pose le basi nella tesi *Il problema generale della stabilità del moto*, pubblicata nel 1892. Il suo metodo permette di stabilire se un movimento resterà vicino a un equilibrio senza doverne calcolare l’intero percorso.

Una pallina lasciata sul fondo di una ciotola e una appoggiata sulla cima di un dosso reagiscono diversamente a un piccolo spostamento, perché la forma della superficie determina le forze che agiscono durante il moto. Da questa differenza possiamo ricavare le condizioni che consentono di mantenere un equilibrio e riconoscere quelle che provocano l’allontanamento. Nel passaggio al corpo dovremo considerare anche le correzioni muscolari, dalle quali dipende la possibilità di sostenere un asana quando cambiano gli appoggi, la distribuzione del peso e l’inclinazione.

**Come leggere le figure**

Blu: movimento. Verde: energia. Rosso: equilibri e frontiere. Ocra: perturbazioni e correzioni.


## Tornare

**La pallina.** Una pallina in una ciotola con attrito si ferma, dopo qualche oscillazione, nel punto più basso. Se la si sposta di poco e la si lascia andare, scende, attraversa il fondo e risale dalla parte opposta. A ogni passaggio perde una parte dell’energia di movimento; le oscillazioni si riducono fino alla quiete.

La pallina ferma sul fondo è in *equilibrio*. Una piccola perturbazione la fa oscillare nei dintorni: in questo senso l’equilibrio è *stabile*. L’attrito assicura anche il ritorno al fondo, una proprietà ulteriore chiamata *stabilità asintotica*.

**Il corpo.** Il braccio rilassato in Śavāsana offre un esempio di ritorno alla quiete. Sollevato di poco, ricade e si ferma a contatto con il suolo, eventualmente dopo un piccolo rimbalzo (figura [2](articolo-lequilibrio-sul-tappetino.html#figura-02)).

Figura 2. Pallina e braccio in quattro momenti. La pallina grigia, nel terzo disegno, indica l’altezza iniziale. Il rimbalzo del braccio è schematico.

Lo scostamento dal punto di riposo cambia segno quando la pallina attraversa il fondo: positivo da una parte, negativo dall’altra (figura [3](articolo-lequilibrio-sul-tappetino.html#figura-03)). L’ampiezza decrescente delle oscillazioni misura il progressivo arresto. Nei modelli meccanici senza memoria che useremo, posizione e velocità costituiscono lo *stato*: note queste due quantità e le forze in gioco, possiamo determinare il movimento successivo. Una variazione iniziale della posizione o della velocità è una *perturbazione*, che chiameremo anche spinta.

Figura 3. Scostamento dal punto di riposo in un oscillatore smorzato. Il grafico descrive il ritorno della pallina; il confronto con il braccio riguarda la riduzione del movimento, non il passaggio attraverso il pavimento.

**Equilibrio stabile**

Un equilibrio è uno stato che rimane invariato nel tempo. È stabile se, scegliendo uno stato iniziale abbastanza vicino, il moto resta entro qualunque tolleranza assegnata. Se inoltre converge all’equilibrio, la stabilità è asintotica.


## Il paesaggio

**La pallina.** Per portare la pallina dal fondo al bordo della ciotola bisogna compiere lavoro contro la gravità. Il sistema acquista *energia potenziale gravitazionale*, che può trasformarsi in movimento quando la pallina viene lasciata andare. A parità di massa, una quota maggiore corrisponde a più energia potenziale.

Disegniamo l’energia potenziale come un paesaggio (figura [4](articolo-lequilibrio-sul-tappetino.html#figura-04)). Una pallina lasciata da ferma sul fianco di una valle comincia a scendere verso il fondo; se ha già velocità, può anche risalire. Sul fondo, un piccolo spostamento richiede energia e la forza richiama verso l’equilibrio. Sulla cima di un colle lo spostamento abbassa invece l’energia e la forza allontana dalla cima. Su un tratto piano una pallina posata ferma rimane dove si trova, ma manca una forza di richiamo.

Figura 4. Tre profili dell’energia potenziale. Le frecce sui pendii indicano il verso iniziale del movimento dopo uno spostamento da fermo; sul pianoro non c’è richiamo verso un punto particolare.

**Il corpo.** L’energia potenziale gravitazionale del corpo dipende dall’altezza del suo *centro di massa*. In un campo di gravità uniforme, il peso agisce come se fosse applicato in quel punto. In piedi, il centro di massa si trova approssimativamente nella regione del bacino; la sua posizione cambia quando si muovono gli arti (figura [5](articolo-lequilibrio-sul-tappetino.html#figura-05)).

Figura 5. Centro di massa e base d’appoggio in quattro posizioni. La striscia ocra rappresenta la base nella sezione disegnata. La verticale del centro di massa al suo interno è una condizione di equilibrio statico nel modello con il solo sostegno del suolo; non garantisce il recupero di un corpo già in movimento.

Un pendolo appeso e uno rovesciato rispondono diversamente alla stessa inclinazione. Nel primo il centro di massa si trova sotto il sostegno e sale quando il pendolo si sposta. Nel secondo è sopra l’appoggio e scende quando il pendolo si inclina (figura [6](articolo-lequilibrio-sul-tappetino.html#figura-06)).

Figura 6. Uno spostamento alza il centro di massa di un oggetto appeso e abbassa quello di un oggetto in appoggio su una base stretta. Il cerchietto vuoto indica la posizione di partenza.

Il pendolo appeso ha quindi un minimo dell’energia potenziale nella posizione di riposo; quello inverso ha un massimo. Sollevare il braccio in Śavāsana aumenta la sua energia e il rilascio lo riporta verso il suolo. Il corpo capovolto, approssimato da un pendolo inverso senza correzioni, si allontana invece dalla verticale (figura [7](articolo-lequilibrio-sul-tappetino.html#figura-07)).

Figura 7. Paesaggi schematici dei movimenti considerati: il ritorno del braccio in Śavāsana e l’inclinazione del pendolo inverso associato a Śīrṣāsana senza correzioni.

Un corpo può spostarsi in più direzioni: in avanti e all’indietro, a destra e a sinistra. Il paesaggio diventa allora una superficie, simile al rilievo di una carta geografica. La valle prende la forma di una conca, la cima quella di una cupola (figura [8](articolo-lequilibrio-sul-tappetino.html#figura-08)).

Figura 8. Con due direzioni di spostamento il paesaggio diventa una superficie. In rosso l’equilibrio, in grigio la pallina spostata, in blu il suo percorso.

**Energia potenziale**

L’energia associata alla configurazione di un sistema. Negli esempi gravitazionali dipende dall’altezza: sollevare una massa ne aumenta l’energia potenziale. Un minimo locale del potenziale segnala una posizione di richiamo.


## L’altimetro

**La pallina.** La gravità richiama la pallina verso il fondo, ma da sola non la ferma. Durante la discesa l’energia potenziale si trasforma in movimento.

L’*energia cinetica* dipende dalla massa e dal quadrato della velocità. Sul fondo della ciotola la pallina è veloce; risalendo rallenta e recupera energia potenziale. In assenza di dissipazione, questo scambio continuerebbe e la pallina tornerebbe ogni volta all’altezza di partenza.

L’attrito trasferisce invece una parte dell’energia meccanica all’energia interna della pallina e della ciotola. Nelle condizioni dell’esperimento questa energia si disperde come calore e non alimenta più l’oscillazione. Le altezze raggiunte diminuiscono (figura [9](articolo-lequilibrio-sul-tappetino.html#figura-09)).

Figura 9. Le cinque risalite successive di una pallina in una ciotola con attrito, da una parte e dall’altra. Ogni risalita si ferma più in basso della precedente.

Le barre della figura [10](articolo-lequilibrio-sul-tappetino.html#figura-10) tengono il conto: energia potenziale, energia cinetica ed energia dissipata, indicata come calore. La somma delle prime due diminuisce; la terza registra quanto è stato dissipato dall’inizio.

Figura 10. Il bilancio dell’energia della pallina in quattro momenti. L’energia potenziale è quella di altezza, l’energia cinetica quella di movimento.

La somma dell’energia potenziale e di quella cinetica non aumenta durante il moto libero. Le due forme si scambiano energia, mentre l’attrito ne sottrae al movimento (figura [11](articolo-lequilibrio-sul-tappetino.html#figura-11)). Con attrito viscoso la perdita è maggiore quando la pallina è veloce. Agli istanti di inversione la velocità è nulla e la curva dell’energia ha tangente orizzontale: i «gradini» sono arrotondati, senza tratti piatti di durata finita.

Figura 11. Posizione ed energia totale dell’oscillatore smorzato. L’energia non risale; la pendenza si annulla agli istanti di inversione del moto.

Un escursionista che segue un cammino sempre in discesa non può raggiungere quote superiori a quella iniziale, anche se il sentiero gira attorno alla valle (figura [12](articolo-lequilibrio-sul-tappetino.html#figura-12)). Questa informazione limita la regione raggiungibile. Per concludere che arriverà al fondo bisogna anche escludere che il cammino si arresti, o si avvicini indefinitamente a una quota più alta.

Figura 12. Un cammino in discesa e la sua quota. Le curve verdi uniscono punti alla stessa altezza; il percorso illustrato si avvicina al fondo della valle, posto a 1000 metri.

Il metodo di Lyapunov cerca una grandezza con proprietà simili: vale zero nell’equilibrio, è positiva negli stati vicini diversi da esso e non aumenta lungo il moto. Se è continua, i suoi livelli possono delimitare regioni attorno all’equilibrio da cui il sistema non esce. Non serve conoscere ogni punto della traiettoria. Una diminuzione stretta fuori dall’equilibrio consente, sotto le ipotesi del riquadro, di dimostrare anche il ritorno.

Questa grandezza si chiama *funzione di Lyapunov*; qui la chiameremo anche altimetro. L’energia meccanica ne è un esempio. In un modello di popolazione o in un sistema di controllo si può usare una funzione costruita appositamente, senza interpretarla come energia fisica. Non deve essere una misura esatta della distanza dall’equilibrio.

**Il corpo.** Nel braccio sollevato l’energia fornita dall’esterno diventa movimento durante la caduta e viene poi dissipata nei tessuti e nel contatto con il pavimento (figura [13](articolo-lequilibrio-sul-tappetino.html#figura-13)). Il bilancio spiega il ritorno alla quiete.

Figura 13. Il braccio che ricade in Śavāsana, con il bilancio dell’energia sotto ogni momento. La somma delle prime due colonne è l’altimetro, che può soltanto scendere.

**Condizioni di stabilità**

Per un sistema autonomo $\dot{x} = f(x)$, con $f$ localmente lipschitziana e $f\left( x^{*} \right) = 0$, sia $V$ una funzione continuamente differenziabile in un intorno dell’equilibrio. Se $$V\left( x^{*} \right) = 0,\qquad V(x) > 0\ \text{per}\ x \neq x^{*},\qquad\dot{V}(x) \leq 0,$$ l’equilibrio è stabile. Se $\dot{V} < 0$ in ogni stato dell’intorno diverso da $x^{*}$, è asintoticamente stabile. Quando $\dot{V} \leq 0$, LaSalle permette di concludere la convergenza se, in un insieme compatto positivamente invariante, l’unico moto che resta sempre in $\{\dot{V} = 0\}$ è l’equilibrio. Per l’oscillatore $\ddot{q} + c\dot{q} + kq = 0$, con $c,k > 0$, si ha $V = \left( {\dot{q}}^{2} + kq^{2} \right)/2$ e $\dot{V} = -c{\dot{q}}^{2}$: fuori dall’origine, gli zeri di $\dot{V}$ durano un solo istante. Nel caso meccanico conservativo, il teorema di Lagrange–Dirichlet lega un minimo stretto del potenziale alla stabilità.


**Funzione di Lyapunov**

Una funzione regolare dello stato, nulla nell’equilibrio e positiva nei suoi dintorni, che non aumenta durante il moto. La sua esistenza dimostra la stabilità locale. Per provare il ritorno occorre un’ulteriore condizione di diminuzione o di invarianza.


## Restare vicini

**La pallina.** In una ciotola priva di attrito, la pallina spostata e lasciata andare oscilla senza fermarsi. L’energia resta costante e ne limita il movimento (figura [14](articolo-lequilibrio-sul-tappetino.html#figura-14)). Il fondo rimane un equilibrio stabile, anche se le traiettorie vicine non vi convergono.

Figura 14. Scostamento della pallina dal fondo. Con attrito le oscillazioni si spengono; senza attrito l’ampiezza rimane costante.

La stessa conca può dunque ospitare un movimento che si spegne oppure un’oscillazione persistente, a seconda della dissipazione presente.

Assegnata una tolleranza $\varepsilon$ (epsilon) attorno all’equilibrio, cerchiamo un limite $\delta$ (delta) alla perturbazione iniziale che permetta di rispettarla durante tutto il moto. La stabilità richiede che questo limite esista per ogni tolleranza positiva, anche molto piccola (figura [15](articolo-lequilibrio-sul-tappetino.html#figura-15)). Nel disegno la pallina parte da ferma e basta limitarne lo spostamento; per uno stato iniziale qualsiasi occorre tenere conto anche della velocità.

Figura 15. Tolleranza e spostamento iniziale per una pallina lasciata da ferma. Per ogni tolleranza ε si cerca un limite δ allo spostamento iniziale. Le distanze si misurano dal fondo.

La ciotola della figura [16](articolo-lequilibrio-sul-tappetino.html#figura-16) ha un bordo. Se la pallina parte nella conca con energia totale inferiore a quella del bordo, non può uscirne. Un’energia maggiore può consentirle di superarlo. Con attrito, gli stati iniziali da cui il moto converge al fondo formano il suo *bacino di attrazione*. Senza attrito, la regione delle oscillazioni confinate non è un bacino di attrazione: la pallina resta vicina, ma continua a muoversi. La stabilità è una proprietà locale; alcuni sistemi la possiedono anche per perturbazioni arbitrariamente grandi.

Figura 16. Una conca con il bordo. A sinistra la superficie, con il bordo tratteggiato e il percorso di una pallina che resta dentro; a destra la stessa conca vista in sezione.

**Il corpo.** In Utthita Hasta Pādāṅguṣṭhāsana un piede sostiene il corpo, mentre l’altra gamba si distende in avanti e la mano trattiene l’alluce. Durante il mantenimento dell’asana si osservano piccole oscillazioni. Una pedana stabilometrica può registrare il centro di pressione, cioè il punto di applicazione della risultante delle forze di contatto sul piano d’appoggio. La traccia della figura [17](articolo-lequilibrio-sul-tappetino.html#figura-17) ne dà un’illustrazione schematica.

Figura 17. Utthita Hasta Pādāṅguṣṭhāsana e una traccia sintetica del centro di pressione vista dall’alto. Cerchi e percorso sono illustrativi: una registrazione finita di questa grandezza non dimostra la stabilità dello stato completo.

La traccia rappresenta lo spostamento del punto di applicazione della forza di contatto durante l’intervallo osservato. La possibilità di recuperare l’equilibrio dipende anche dalla velocità del corpo, dai movimenti degli arti e dalle correzioni muscolari disponibili.

Il corpo riceve disturbi continui, fra cui quelli associati al respiro, e li compensa con il controllo posturale.

**Stabilità e regioni invarianti**

Per uno stato $x(t)$ e un equilibrio $x^{*}$, la stabilità si esprime così: $$\begin{matrix}
{\forall\,\varepsilon > 0\ \ \exists\,\delta > 0:\qquad \parallel x(0) - x^{*} \parallel < \delta} \\
\left. \Rightarrow\quad \parallel x(t) - x^{*} \parallel < \varepsilon\quad{\text{per ogni}\mspace{6mu}}t \geq 0. \right.
\end{matrix}$$ Un sottolivello compatto di $V$, contenuto nella regione dove $\dot{V} \leq 0$, è positivamente invariante: il moto che vi parte non ne esce. È una stima interna del bacino di attrazione solo se si dimostra anche la convergenza all’equilibrio, per esempio tramite LaSalle. Il semplice confinamento non basta.


**Bacino di attrazione**

L’insieme degli stati iniziali da cui il moto converge a un dato equilibrio. Posizione e velocità possono entrambe influire sull’appartenenza al bacino.


## La cima

**La pallina.** Una pallina può restare ferma sulla cima di un colle ideale, ma un piccolo spostamento la porta su un pendio che la allontana. Vicino a una cima arrotondata la forza cresce, in prima approssimazione, in proporzione allo scostamento.

Il modello lineare ammette allora un movimento *esponenziale*: la distanza raddoppia a intervalli uguali (figura [18](articolo-lequilibrio-sul-tappetino.html#figura-18)). Questo andamento esatto richiede una particolare velocità iniziale. Se la pallina parte da ferma, la crescita comincia più lentamente e si avvicina in seguito all’andamento esponenziale. L’approssimazione vale nei pressi della cima.

Figura 18. Schema del modo esponenziale crescente vicino alla cima: gli scostamenti raddoppiano a intervalli uguali. Il disegno amplifica il movimento per renderlo visibile.

**Il corpo.** Per studiare l’inclinazione di Śīrṣāsana senza correzioni si può usare un *pendolo inverso*: un’asta ideale senza massa, con una massa concentrata in alto (figura [19](articolo-lequilibrio-sul-tappetino.html#figura-19)). Nella posizione verticale e ferma la gravità non produce rotazione. Una piccola inclinazione genera invece un momento che la fa aumentare.

Figura 19. Śīrṣāsana e il suo modello più semplice, il pendolo inverso: un bastone appoggiato in basso con il peso in alto.

Prendiamo un pendolo semplice inverso lungo 0,8 metri, inizialmente inclinato di un grado e fermo. Il modello lineare prevede circa 1,3 gradi dopo due decimi di secondo e 16,6 gradi dopo un secondo (figure [20](articolo-lequilibrio-sul-tappetino.html#figura-20) e [21](articolo-lequilibrio-sul-tappetino.html#figura-21)). Il modo esponenziale crescente ha un tempo di raddoppio di circa due decimi di secondo, ma questo non significa che ogni moto raddoppi subito con quel ritmo.

Figura 20. Pendolo semplice inverso lungo 0,8 metri, inizialmente fermo a un grado dalla verticale. Le inclinazioni, arrotondate, sono calcolate con il modello lineare a intervalli di 0,2 secondi.

Figura 21. Crescita dell’inclinazione nel modello lineare, partendo da fermo. Il ritmo dei raddoppi si avvicina a quello del modo esponenziale crescente.

Questi numeri illustrano una scala temporale, non prevedono la caduta di una persona. Il corpo ha una massa distribuita e più articolazioni; inoltre, all’aumentare dell’angolo, l’approssimazione lineare perde precisione.

**Equazioni del pendolo inverso**

Per il pendolo semplice inverso, a piccoli angoli $\ddot{\theta} = \left( g/\ell \right)\theta$. Posto $\tau = \sqrt{\ell/g}$, la soluzione è $\theta(t) = \theta_{0}\cosh(t/\tau) + \tau\omega_{0}\sinh(t/\tau)$. Se $\omega_{0} = 0$ si ottiene la crescita delle figure. Il modo puro $\theta_{0}e^{t/\tau}$ richiede invece $\omega_{0} = \theta_{0}/\tau$ e raddoppia ogni $\tau\ln 2$. Con $g = 9,81$ m/s$^{2}$ e $\ell = 0,8$ m, $\tau \approx 0,286$ s. Per un corpo rigido di massa $m$, con centro di massa a distanza $\ell$ dal perno e momento d’inerzia $I$, si usa $\ddot{\theta} = \left( mg\ell/I \right)\theta$.


**Instabile**

Un equilibrio è instabile quando esistono spinte piccole a piacere che conducono lontano. La cima del colle e il pendolo inverso sono equilibri instabili.


## Correggere

**Il bastone.** Un bastone tenuto dritto sul palmo permette di vedere come si corregge un pendolo inverso. Quando pende da una parte, la mano si sposta nella stessa direzione, sotto il centro di massa e, se necessario, oltre. Il bastone rallenta la caduta e può raddrizzarsi; se oscilla dalla parte opposta, la mano corregge di nuovo (figura [22](articolo-lequilibrio-sul-tappetino.html#figura-22)).

Figura 22. Il bastone sul palmo in tre momenti. La linea tratteggiata è la verticale che scende dalla cima; la freccia ocra è lo spostamento della mano.

L’inclinazione osservata guida lo spostamento della mano, che a sua volta modifica l’inclinazione. Questo uso dell’effetto di un’azione per regolare l’azione successiva si chiama *retroazione*.

Per aste della stessa forma, una lunghezza maggiore rallenta la crescita dell’inclinazione e lascia più tempo alla mano per intervenire. Nel modello di asta omogenea il modo crescente raddoppia in circa 0,18 secondi per un metro di lunghezza, contro circa 0,07 secondi per una matita di 15 centimetri (figura [23](articolo-lequilibrio-sul-tappetino.html#figura-23)).

Figura 23. Più l’oggetto è lungo, più lentamente cade, e più tempo resta per correggerlo.

**Il corpo.** In Śīrṣāsana i contatti con il suolo restano pressoché fermi. Il controllo redistribuisce le forze entro la base d’appoggio e modifica la configurazione del corpo attraverso spalle, tronco e arti. Il modello della figura [24](articolo-lequilibrio-sul-tappetino.html#figura-24) riassume queste azioni in un momento correttivo alla base; non ne distingue i contributi anatomici.

Figura 24. Śīrṣāsana con la correzione. Il peso tende ad aumentare l’inclinazione, indicata con la lettera greca θ (theta); la correzione esercitata alla base tende a ridurla.

Nel modello più semplice la correzione cresce in proporzione all’inclinazione e agisce verso la verticale. Può essere rappresentata da una conca che si somma al colle gravitazionale. Se il richiamo supera l’effetto destabilizzante della gravità, la somma ha un minimo (figura [25](articolo-lequilibrio-sul-tappetino.html#figura-25)). Si chiama *potenziale efficace*: descrive il termine di richiamo del sistema controllato, non tutta l’energia consumata dai muscoli (figura [26](articolo-lequilibrio-sul-tappetino.html#figura-26)).

Figura 25. Somma del potenziale gravitazionale e del termine correttivo. Un richiamo sufficiente produce un minimo; un richiamo insufficiente lascia un massimo. Il disegno suppone una correzione senza ritardo.

Figura 26. Potenziale efficace con correzione, in verde, e potenziale instabile di partenza, in grigio. Il percorso blu illustra un rientro smorzato in due coordinate di posizione. La quota è il solo potenziale e può risalire durante le oscillazioni.

Una correzione proporzionale anche alla velocità può smorzare le oscillazioni. Nel modello senza ritardo, la somma dell’energia cinetica e del potenziale efficace diventa un altimetro non crescente. Il solo potenziale può invece aumentare durante una risalita, come accade alla pallina nella ciotola.

La figura [27](articolo-lequilibrio-sul-tappetino.html#figura-27) riassume il circuito del controllo: rilevamento, elaborazione e risposta muscolare.

Figura 27. L’anello di retroazione che sostiene Śīrṣāsana.

Il circuito introduce un ritardo. In uno studio su persone in piedi, Horak e Nashner misurarono risposte muscolari a perturbazioni dell’appoggio con latenze fra 73 e 110 millisecondi.[^1] Nel modo esponenziale del pendolo lungo 0,8 metri, un decimo di secondo basta ad aumentare l’inclinazione di circa il 42%. Quando arriva la risposta, lo stato può quindi essere già cambiato in misura rilevante.

Le simulazioni della figura [28](articolo-lequilibrio-sul-tappetino.html#figura-28) mostrano come il ritardo modifica un controllo proporzionale alla posizione e alla velocità. Con i parametri scelti, un ritardo breve permette il rientro; aumentandolo, le oscillazioni persistono più a lungo o crescono. Anche una correzione troppo intensa, a ritardo fissato, può destabilizzare il sistema: i coefficienti che ne regolano l’intensità sono chiamati guadagni. Si tratta di esempi numerici: i parametri e la soglia rappresentata non sono misure del corpo umano.

Figura 28. Quattro risposte del pendolo inverso con controllo ritardato. La linea rossa è una soglia illustrativa di ampiezza; la croce segna il primo superamento. Equazione, parametri e storia iniziale sono riportati nella nota sui modelli.

Il pendolo inverso è utile anche per descrivere alcune oscillazioni in piedi. Nel corpo intervengono però più strategie articolari. In Utthita Hasta Pādāṅguṣṭhāsana la base ridotta limita alcune correzioni, ma da sola non determina l’estensione del bacino di attrazione.

**Controllo con retroazione**

Nel modello lineare del pendolo semplice, una correzione $u = -k_{p}\theta - k_{d}\dot{\theta}$ dà $$\ddot{\theta} = \left( \frac{g}{\ell} - k_{p} \right)\theta - k_{d}\,\dot{\theta}.$$ Se $k_{p} > g/\ell$ e $k_{d} > 0$, la grandezza $$V = \frac{1}{2}\,{\dot{\theta}}^{2} + \frac{1}{2}\left( k_{p} - \frac{g}{\ell} \right)\theta^{2},\qquad\dot{V} = -k_{d}\,{\dot{\theta}}^{2} \leq 0,$$ è positiva fuori dall’origine e non cresce. LaSalle assicura la convergenza, perché in $\{\dot{\theta} = 0\}$ l’unico moto che può restare è l’equilibrio. La stabilità asintotica vale per questo modello senza ritardo. Per un’asta omogenea lunga $L$, invece, $\tau = \sqrt{2L/(3g)}$. La figura [23](articolo-lequilibrio-sul-tappetino.html#figura-23) confronta i tempi del modo crescente di due aste.


**Retroazione**

Il meccanismo che usa una misura dello stato o dell’effetto prodotto per regolare l’azione. Può stabilizzare un equilibrio, ma il risultato dipende dalla legge di controllo, dai suoi limiti e dal ritardo.


## Due valli

**La pallina.** Due conche separate da un dosso hanno due equilibri stabili. Con attrito, una piccola perturbazione attorno a un fondo si spegne. Una spinta maggiore può portare la pallina oltre il dosso (figura [29](articolo-lequilibrio-sul-tappetino.html#figura-29)); prima di fermarsi può attraversarlo anche più volte. La conca finale dipende sia dalla posizione sia dalla velocità iniziali.

Figura 29. Due conche e un dosso. La freccia ocra è la spinta; la linea tratteggiata è il percorso dopo una spinta debole, la linea continua quello dopo una spinta forte.

**Il corpo.** Nel dropback si passa da Samasthiti a Ūrdhva Dhanurāsana e poi si risale (figura [30](articolo-lequilibrio-sul-tappetino.html#figura-30)). Possiamo rappresentare i due asana mantenuti come due conche di un paesaggio efficace. Il dosso raffigura la regione di passaggio, dove cambiano configurazione e azione muscolare (figura [31](articolo-lequilibrio-sul-tappetino.html#figura-31)). La transizione dipende dalla configurazione del corpo, dalla velocità e dal controllo esercitato durante il movimento.

Figura 30. Quattro momenti del dropback e la loro rappresentazione schematica su un paesaggio a due conche. Il dosso indica il passaggio fra le posture.

Figura 31. Il paesaggio efficace usato per il dropback. Le frecce indicano i due versi possibili del passaggio; l’esito dipende dal movimento e dalle correzioni, oltre che dalla configurazione.

Nel modello dinamico, il confine fra i due bacini si chiama *separatrice* e vive nello spazio degli stati, che comprende anche la velocità. Una traiettoria libera non attraversa questo confine se la dinamica resta fissata. Un’azione esterna o un cambiamento del controllo può invece portare il sistema da un bacino all’altro. Nel dropback il praticante modifica attivamente il movimento durante la transizione.

Il potenziale efficace riassume il richiamo del modello, mentre l’azione muscolare può anche fornire o dissipare energia. Con due coordinate di posizione, il dosso appare come un valico fra due conche (figura [32](articolo-lequilibrio-sul-tappetino.html#figura-32)). La cresta visibile sulla superficie non coincide, in generale, con la separatrice nello spazio degli stati.

Figura 32. Un potenziale a due conche, associate alle due posture. Il cerchietto vuoto indica il valico e la linea tratteggiata la cresta geometrica. La traiettoria blu supera il dosso e si smorza nella conca destra. La quota rappresenta il potenziale, che può risalire mentre l’energia totale diminuisce.

Per la risalita il modello richiede energia sufficiente a superare il dislivello del potenziale, oltre a quella dissipata durante il percorso (figura [33](articolo-lequilibrio-sul-tappetino.html#figura-33)). Superato il dosso, occorre ridurre la velocità in modo da arrivare in Samasthiti e arrestarsi: il controllo deve accompagnare anche questa fase della risalita.

Figura 33. Passaggio dalla conca destra a quella sinistra. Il dislivello verde è la barriera del potenziale; l’energia da fornire deve coprire anche le perdite lungo il percorso.

La doppia conca è un modello di *bistabilità*. Permette di studiare quali perturbazioni cambiano l’esito del movimento e quali azioni fanno passare il sistema da uno stato stabile all’altro.

**Separatrice**

Una frontiera invariante che separa famiglie di traiettorie con comportamenti diversi. Nella doppia conca smorzata divide i bacini dei due equilibri; nella conca conservativa separa le oscillazioni interne dai moti che possono uscire.


## Un passo in più: la mappa degli stati

**Lo stato.** Due pendoli si trovano nel punto più basso. Uno è fermo, l’altro lo attraversa velocemente (figura [34](articolo-lequilibrio-sul-tappetino.html#figura-34)). Per prevederne il seguito bisogna conoscere posizione e velocità. La mappa degli stati permette di rappresentare insieme queste due informazioni.

Figura 34. Due pendoli nella stessa posizione e con futuri diversi.

**La mappa.** Riportiamo la posizione in orizzontale e la velocità in verticale. Ogni punto del foglio rappresenta uno stato (figura [35](articolo-lequilibrio-sul-tappetino.html#figura-35)). A destra stanno le posizioni positive; in alto, i movimenti verso destra. L’origine corrisponde al pendolo fermo nel punto più basso. Questo piano è lo *spazio delle fasi*, che chiameremo anche mappa degli stati.

Figura 35. Come leggere la mappa degli stati. In ogni quadrante una piccola icona mostra la posizione (il punto nero rispetto al trattino rosso dell’equilibrio) e la velocità (la freccia blu).

**La traiettoria.** Mentre il pendolo oscilla, il suo stato cambia e il punto si sposta sulla mappa. La curva che disegna è la *traiettoria*. Conviene costruirla un fotogramma alla volta (figura [36](articolo-lequilibrio-sul-tappetino.html#figura-36)). Nel fotogramma 1 il pendolo è fermo all’estremo destro: posizione massima, velocità nulla, e il punto sulla mappa sta sull’asse orizzontale, a destra. Nel fotogramma 3 il pendolo passa per il centro alla massima velocità verso sinistra, e il punto sta in basso. Nel fotogramma 5 è fermo all’estremo sinistro, nel 7 ripassa per il centro verso destra, e infine torna alla situazione di partenza.

Figura 36. Un pendolo senza attrito, fotogramma per fotogramma, con la velocità in blu (in alto), e gli stessi istanti sulla mappa degli stati (in basso). I punti numerati formano un anello percorso in senso orario.

Senza attrito, una piccola oscillazione si ripete e la traiettoria forma un’*orbita chiusa*. Con uno smorzamento moderato l’ampiezza diminuisce e la curva si avvolge verso l’equilibrio (figura [37](articolo-lequilibrio-sul-tappetino.html#figura-37)). Se lo smorzamento è forte, il rientro può avvenire senza oscillazioni: la spirale è uno dei possibili comportamenti.

Figura 37. Un pendolo con attrito. A sinistra la posizione nel tempo, a destra la mappa degli stati; i numeri indicano gli stessi istanti nei due disegni.

**L’altimetro sulla mappa.** Per l’oscillatore lineare, l’energia totale assegna una quota a ogni coppia di posizione e velocità. I suoi livelli sono ellissi; scegliendo opportunamente le unità degli assi diventano circonferenze, come nella figura [38](articolo-lequilibrio-sul-tappetino.html#figura-38). Senza attrito, la traiettoria segue un livello. Con attrito passa a livelli inferiori, pur potendo essere tangente a un livello negli istanti di inversione.

Figura 38. Livelli dell’energia totale e traiettoria dell’oscillatore smorzato. La quota non aumenta lungo il percorso blu.

Sollevando ogni stato alla quota data dall’energia totale si ottiene la conca della figura [39](articolo-lequilibrio-sul-tappetino.html#figura-39). Qui le due coordinate della base sono posizione e velocità: la superficie è diversa dai paesaggi di solo potenziale dei primi capitoli.

Figura 39. La spirale vista in rilievo. In basso, in azzurro, la traiettoria sulla mappa degli stati; sopra, sollevata per chiarezza, la superficie dell’altimetro, sulla quale la traiettoria scende verso il fondo. I segmenti tratteggiati collegano alcuni punti alla loro ombra sulla mappa.

**Le posizioni sulla mappa.** L’oscillatore smorzato usato per illustrare il ritorno alla quiete in Śavāsana produce le spirali della figura [40](articolo-lequilibrio-sul-tappetino.html#figura-40). Le due viste usano la stessa dinamica.

Figura 40. Oscillatore smorzato associato al ritorno alla quiete. A sinistra una traiettoria sollevata alla quota dell’energia totale; a destra quattro traiettorie nel piano posizione–velocità. La curva di sinistra è il sollevamento di quella che parte da destra con velocità nulla.

Nel modello conservativo della conca con bordo, le piccole oscillazioni formano orbite chiuse attorno al centro (figura [41](articolo-lequilibrio-sul-tappetino.html#figura-41)). Le curve rosse sono separatrici: delimitano la regione delle oscillazioni interne. Sulla frontiera, il moto si avvicina a un equilibrio instabile sul bordo in un tempo infinito; non è un’ultima oscillazione periodica di ampiezza massima.

Figura 41. Conca con bordo nel modello conservativo associato all’equilibrio su una gamba. L’origine è stabile ma non attrattiva. Il richiamo è efficace: l’asana reale richiede controllo muscolare.

Il pendolo inverso senza correzioni ha un equilibrio a sella. Nella figura [42](articolo-lequilibrio-sul-tappetino.html#figura-42) una sola retta, disegnata con due frecce entranti, raccoglie gli stati che convergono alla verticale. La retta trasversale è instabile. Gli altri stati, anche arbitrariamente vicini, si allontanano nel modello lineare. Con un controllo adeguato l’origine diventa asintoticamente stabile; i coefficienti del controllo scelti nel disegno danno un rientro a spirale.

Figura 42. Śīrṣāsana sulla mappa degli stati: a sinistra senza correzioni, a destra con la correzione.

La doppia conca smorzata ha due equilibri attrattivi. Nella figura [43](articolo-lequilibrio-sul-tappetino.html#figura-43) ogni stato iniziale è colorato secondo l’equilibrio raggiunto. La curva rossa è la varietà stabile della sella centrale e separa i due bacini. Le regioni si avvolgono perché un moto con energia sufficiente può attraversare più volte il dosso prima di fermarsi. Vicino alla frontiera, piccoli cambiamenti dello stato iniziale cambiano la destinazione.

Figura 43. Bacini del modello a doppia conca: azzurro per l’equilibrio sinistro, ocra per quello destro. Gli asana sono un’associazione qualitativa. Il cerchietto vuoto indica la sella; sulla frontiera gli stati convergono a essa, non ai due fondi. La colorazione è un’approssimazione su una griglia finita.

Un equilibrio attorno al quale le traiettorie spiraleggiano si chiama *fuoco*; quello circondato da orbite chiuse è un *centro*. Una *sella* ha direzioni attrattive e repulsive.

**Stato, mappa, traiettoria, orbita**

Nel modello meccanico a un grado di libertà, lo stato è la coppia posizione–velocità. La mappa rappresenta questi stati come punti; una traiettoria ne segue l’evoluzione nel tempo. Un’orbita chiusa corrisponde a un moto periodico.


## Riepilogo e limiti

La figura [44](articolo-lequilibrio-sul-tappetino.html#figura-44) raccoglie i modelli discussi. Nella colonna centrale il paesaggio rappresenta il potenziale, eventualmente efficace; la mappa mostra anche la velocità.

Figura 44. Modelli associati agli asana: potenziale, ritratto nel piano degli stati e tipo di equilibrio. La classificazione riguarda il modello specificato, non l’asana in ogni condizione.

Il corpo ha molti gradi di libertà, contatti variabili e un controllo che dipende anche dalla storia recente. Questi aspetti sono stati ridotti a pochi movimenti per rendere leggibili i modelli. Il ritardo, in particolare, richiede uno stato che contenga la storia del sistema.[^2] Una funzione di Lyapunov trovata con le proprietà richieste dimostra la stabilità; il fallimento di una ricerca non dimostra l’instabilità.

Una correzione troppo intensa può alimentare proprio l’oscillazione che dovrebbe arrestare: nel modello del pendolo inverso questo accade, per alcuni valori dei parametri, quando la risposta arriva con ritardo e agisce su un’inclinazione che nel frattempo è cambiata. L’efficacia dell’intervento dipende dunque dalla sua intensità e dal momento in cui viene esercitato, così che uno sforzo maggiore può rendere più difficile il recupero dell’equilibrio.

Ripenso, a questo proposito, al richiamo all’allentamento dello sforzo nello Yogasūtra II.47, *prayatna-śaithilya-ananta-samāpattibhyām*. Mi interessa l’idea che la cura di un asana comprenda anche la capacità di riconoscere quanto sforzo occorra per sostenerlo e quanto, invece, possa essere lasciato andare.

## Piccolo glossario

Altimetro.  
Il nome dato in queste pagine alla funzione di Lyapunov.

Bacino di attrazione.  
L’insieme degli stati iniziali le cui traiettorie convergono a un dato equilibrio.

Base d’appoggio.  
La regione del piano di sostegno racchiusa dai contatti, nel modello statico considerato.

Centro di massa.  
La media delle posizioni delle masse che compongono un corpo, pesate con le rispettive masse. In gravità uniforme vi si può applicare la risultante del peso.

Energia cinetica.  
L’energia associata al movimento; per una massa puntiforme è proporzionale al quadrato della velocità.

Energia potenziale.  
L’energia associata alla configurazione. Negli esempi gravitazionali cresce con l’altezza del centro di massa.

Equilibrio.  
Uno stato che resta invariato. È *stabile* se stati iniziali sufficientemente vicini rimangono vicini; *asintoticamente stabile* se inoltre vi convergono; *instabile* se non soddisfa la condizione di stabilità.

Funzione di Lyapunov.  
Una funzione regolare, nulla nell’equilibrio, positiva nei suoi dintorni e non crescente lungo il moto. Sotto le ipotesi indicate nel testo, ne dimostra la stabilità.

Mappa degli stati.  
Il foglio che ha la posizione in orizzontale e la velocità in verticale; i fisici lo chiamano spazio delle fasi.

Orbita chiusa.  
Una traiettoria che torna su se stessa: il moto si ripete identico.

Pendolo inverso.  
Un pendolo il cui centro di massa è sopra il perno. La verticale superiore è un equilibrio instabile senza correzioni.

Potenziale efficace.  
Nel modello adottato, la somma del potenziale gravitazionale e del termine che rappresenta il richiamo del controllo. Non coincide con il consumo energetico dei muscoli.

Retroazione.  
Il meccanismo per cui l’effetto di un’azione viene misurato e usato per regolare l’azione successiva.

Separatrice.  
Una frontiera invariante fra traiettorie con comportamenti diversi; può dividere due bacini di attrazione o una regione di oscillazioni da una di fuga.

Spinta.  
Termine informale usato per una perturbazione dello stato iniziale. I disturbi persistenti richiedono un’analisi distinta.

Stato.  
Le informazioni necessarie a determinare l’evoluzione una volta assegnata la legge del moto. Nei modelli meccanici senza memoria qui usati comprende posizione e velocità; con ritardo include anche la storia recente.

Traiettoria.  
La curva che lo stato disegna sulla mappa con il passare del tempo.

## Nota sui modelli e sui grafici

Salvo il pendolo delle figure [20](articolo-lequilibrio-sul-tappetino.html#figura-20) e [21](articolo-lequilibrio-sul-tappetino.html#figura-21), le grandezze sono in unità adimensionali. I parametri servono a illustrare comportamenti matematici e non sono stime del corpo umano. Pittogrammi, barre di energia e tracce del centro di pressione illustrano i modelli descritti. Le coordinate numeriche e gli strumenti per esportare le figure sono conservati nel pacchetto sorgente del sito.

**Oscillazioni smorzate**

**Oscillazioni e altimetro.** Per i ritratti di fase si usa $$\dot{q} = v,\qquad\dot{v} = -q - cv,\qquad V = \frac{1}{2}\left( q^{2} + v^{2} \right),\qquad\dot{V} = -cv^{2}.$$ Nella figura [39](articolo-lequilibrio-sul-tappetino.html#figura-39) si pone $c = 0,24$, con stato iniziale $(1,8,0)$ e tempo da 0 a 25; la quota superiore è $1,3 + V$, con un piccolo scarto grafico per rendere visibile la curva. Nella figura [40](articolo-lequilibrio-sul-tappetino.html#figura-40) si pone $c = 0,4$, con stati iniziali $(\pm 1,8,0)$ e $(0,\pm 1,8)$ e tempo da 0 a 24. Le curve in piano e in rilievo provengono dalla stessa soluzione analitica.

La figura [26](articolo-lequilibrio-sul-tappetino.html#figura-26) usa invece due coordinate di posizione indipendenti, ciascuna soggetta a $\ddot{q} + 0,5\dot{q} + 1,2q = 0$. I dati iniziali sono $\left( q_{1},q_{2},{\dot{q}}_{1},{\dot{q}}_{2} \right) = (1,5,0,0,0,7)$. La superficie rappresenta il solo potenziale $0,6\left( q_{1}^{2} + q_{2}^{2} \right)$; il controllo di monotonia riguarda l’energia totale, inclusa quella cinetica.


**Conca con bordo**

**Conca con bordo.** Il ritratto conservativo della figura [41](articolo-lequilibrio-sul-tappetino.html#figura-41) corrisponde a $$\dot{q} = v,\qquad\dot{v} = -q + \frac{1}{2}q^{3},\qquad H = \frac{1}{2}v^{2} + \frac{1}{2}q^{2} - \frac{1}{8}q^{4}.$$ Il centro è in $(0,0)$ e le selle in $\left( \pm\sqrt{2},0 \right)$. Le separatrici appartengono al livello $H = 1/2$ e hanno equazioni $v = \pm\left( 1 - q^{2}/2 \right)$. Le orbite interne sono periodiche; non convergono al centro. Gli altri paesaggi schematici mostrano la forma del potenziale e non vanno letti come superfici di Lyapunov nello spazio degli stati.


**Bacini della doppia conca**

**Doppia conca e bacini.** La carta della figura [43](articolo-lequilibrio-sul-tappetino.html#figura-43) usa $$\dot{q} = v,\qquad\dot{v} = q - q^{3} - 0,3v,\qquad E = \frac{1}{2}v^{2} + \frac{1}{4}\left( q^{2} - 1 \right)^{2}.$$ I 4096 stati iniziali formano una griglia $64 \times 64$ nel quadrato $\lbrack-2,2\rbrack^{2}$. L’integrazione Runge–Kutta del quarto ordine ha passo $0,01$ e termina a $t = 120$; il colore dipende dal pozzo raggiunto. Su questa griglia, lo scarto finale da uno dei due equilibri è inferiore a $10^{-7}$ in entrambe le componenti.

Le curve rosse approssimano la varietà stabile della sella: si parte da $\pm 10^{-5}\left( 1,\lambda_{s} \right)$, con $\lambda_{s} = \left( -0,3 - \sqrt{4,09} \right)/2$, e si integra all’indietro con passo $-0,001$. La griglia colorata ha risoluzione finita e non certifica da sola l’esatta posizione del confine.

Per il rilievo della figura [32](articolo-lequilibrio-sul-tappetino.html#figura-32) si aggiunge una coordinata $r$ con $\ddot{r} + 0,3\dot{r} + r = 0$. La superficie è $U(q,r) = \frac{1}{4}\left( q^{2} - 1 \right)^{2} + \frac{1}{2}r^{2}$. Si parte da $\left( q,r,\dot{q},\dot{r} \right) = (-1,0,2,1,1,0,3)$ e si integra fino a $t = 50$, con passo $0,01$.


**Effetti del ritardo**

**Controllo ritardato.** La figura [28](articolo-lequilibrio-sul-tappetino.html#figura-28) usa il sistema $$\dot{q}(t) = v(t),\qquad\dot{v}(t) = q(t) - k_{p}q(t - d) - k_{d}v(t - d),$$ con storia costante $q(t) = 0,1$, $v(t) = 0$ per $t \leq 0$. I quattro casi, nell’ordine di lettura, sono: $$\begin{array}{lccc}
 & d & k_{p} & k_{d} \\
\text{ritardo breve} & {0,05} & 2 & 1 \\
\text{ritardo medio} & {0,30} & 2 & 1 \\
\text{ritardo lungo} & {0,60} & 2 & 1 \\
\text{correzione forte} & {0,30} & 8 & 2
\end{array}$$ Si integra fino a $t = 16$ con Runge–Kutta del quarto ordine, passo $0,002$ e interpolazione lineare della storia. La soglia illustrativa è $|q| = 0,45$. Dimezzando il passo, lo scarto massimo fra le curve, fino al primo superamento della soglia o alla fine del grafico, resta sotto $10^{-5}$. Una simulazione su un intervallo finito illustra la risposta ma non sostituisce una dimostrazione di stabilità.


Per i risultati generali su Lyapunov, LaSalle e regioni di attrazione si può consultare il capitolo *Lyapunov Analysis* delle dispense di Russ Tedrake, *Underactuated Robotics*, MIT: [capitolo online](https://underactuated.mit.edu/lyapunov.html). Il dato sperimentale sul ritardo citato nel testo proviene da F. B. Horak e L. M. Nashner, *Central programming of postural movements: adaptation to altered support-surface configurations*, Journal of Neurophysiology 55 (1986), 1369–1381, [doi:10.1152/jn.1986.55.6.1369](https://doi.org/10.1152/jn.1986.55.6.1369).

[^1]: F. B. Horak e L. M. Nashner, *Central programming of postural movements: adaptation to altered support-surface configurations*, Journal of Neurophysiology 55(6), 1369–1381, 1986, DOI: [10.1152/jn.1986.55.6.1369](https://doi.org/10.1152/jn.1986.55.6.1369). Le misure riguardano la stazione eretta, non Śīrṣāsana.

[^2]: I funzionali di Lyapunov–Krasovskij estendono l’idea di altimetro a una storia di stati.
