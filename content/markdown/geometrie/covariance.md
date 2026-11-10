# Ellissoide di covarianza

## titolo
Ellissoide di covarianza

## tema
Finanza quantitativa

## formula
(x−μ)ᵀΣ⁻¹(x−μ) = 1
Σ = TTᵀ,  T = [[1.6,0.5,0.1],[0,0.85,0.24],[0,0,0.65]]

## spiegazione
L’ellissoide traduce una matrice di covarianza in direzioni e ampiezze spaziali. La sezione evidenziata e gli assi principali aiutano a leggere l’anisotropia, rendendo visibile come la dispersione vari con la direzione.

## limiti
Il livello rappresentato è una distanza di Mahalanobis pari a uno. Non indica automaticamente una regione di confidenza del 95%, né una frontiera efficiente di portafogli. La matrice è sintetica e definita positiva.

## fonti
[SciPy — covarianza e densità multivariata](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Confronta la maglia dell’ellissoide con le tre direzioni principali, determinate dalla matrice di covarianza, e segui la sezione color ambra mentre ruoti la figura, così da distinguere l’estensione dei semiassi dalla loro proiezione sullo schermo.

## lettura
La superficie raccoglie i punti per i quali la forma quadratica dello scarto dalla media, calcolata con l’inversa della covarianza, vale uno; la covarianza è il prodotto della matrice T per la sua trasposta.

## legenda
mint | maglia dell’ellissoide
pale | due direzioni principali
amber | direzione di massima dispersione e sezione di riferimento
