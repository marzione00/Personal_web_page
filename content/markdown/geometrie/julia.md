# Insieme di Julia

## titolo
Insieme di Julia

## tema
Frattali e sistemi dinamici

## formula
zₙ₊₁ = zₙ² + c
c = −0.74543 + 0.11301i

## spiegazione
La stessa regola iterata produce bordi complessi fra punti che fuggono e punti che restano limitati. Il colore dipende dal tempo di fuga e rende visibili dettagli a scale differenti.

## limiti
Il frattale è piano. Il visualizzatore consente di orientarne il piano nello spazio, senza inventare un volume tridimensionale. Il disegno usa 180 iterazioni: è un’approssimazione finita, non una rappresentazione di tutti i dettagli matematici.

## fonti
[SageMath — Mandelbrot and Julia sets](https://doc.sagemath.org/html/en/reference/dynamics/sage/dynamics/complex_dynamics/mandel_julia.html)

## osservazione
La vista iniziale presenta il piano frontalmente, così puoi avvicinare i bordi e confrontare le variazioni del tempo di fuga senza che l’inclinazione nasconda i dettagli; la rappresentazione conserva il limite di 180 iterazioni e la risoluzione disponibile.

## lettura
A ogni iterazione si eleva al quadrato il numero complesso z e si aggiunge c, che vale meno zero virgola sette quattro cinque quattro tre più zero virgola uno uno tre zero uno per l’unità immaginaria.

## legenda
mint | fasce chiare e scure: codifica periodica del tempo di fuga, priva di una scala cromatica monotona
