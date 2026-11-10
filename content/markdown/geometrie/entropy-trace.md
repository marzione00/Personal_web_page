# Regolarità di una traccia

## titolo
Regolarità di una traccia

## tema
Cybersecurity e serie temporali

## formula
s(t) = sin(t) + 0.34 sin(3.3t) + 0.07 sin(19t)
v(t) = (s(t), s(t+τ), s(t+2τ)),  τ = 6·7π/179
SampEn(m,r) = −ln[A(m,r) / B(m,r)]

## spiegazione
Una curva continua raccoglie tre valori della medesima serie temporale, separati da un ritardo fisso, attraverso i quali ricorrenze e irregolarità assumono una forma spaziale; il campionamento più fitto e la sezione tubolare permettono di seguire il percorso anche dove la proiezione sovrappone tratti che restano distinti nello spazio.

## limiti
La serie è una somma sintetica di sinusoidi. Il ritardo conserva la distanza di sei campioni della griglia originale, composta da 180 punti fra 0 e 7π, mentre i 601 punti della curva servono a visualizzare con continuità la stessa costruzione; le coordinate sono moltiplicate per 1.22 prima della normalizzazione grafica. Lo spessore del tubo e i colori facilitano la lettura del percorso. SampEn introduce l’entropia campionaria: A e B contano le coppie di sequenze simili di lunghezza m+1 e m, con la stessa convenzione di confronto ed escludendo gli auto-confronti. Qui non viene stimato alcun valore di SampEn.

## fonti
[Richman e Moorman, 2000](https://pubmed.ncbi.nlm.nih.gov/10843903/)

## osservazione
Segui la curva fra i due estremi color ambra, osservando i tratti che tornano vicini e quelli che si allontanano, quindi ruota la figura per distinguere gli incroci della proiezione dalla continuità del percorso nello spazio dei ritardi.

## lettura
La serie s è una somma di tre sinusoidi; il vettore v raccoglie tre valori separati dal ritardo tau, pari a sei intervalli della griglia originale. L’entropia campionaria è l’opposto del logaritmo naturale del rapporto fra A e B, definiti per dimensione m e tolleranza r.

## legenda
mint | curva nello spazio dei ritardi
amber | inizio e fine del tratto rappresentato
pale | campioni di riferimento lungo il percorso
