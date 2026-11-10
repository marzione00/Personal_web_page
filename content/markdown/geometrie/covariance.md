# Ellissoide di covarianza

## titolo
Ellissoide di covarianza

## tema
Finanza quantitativa

## formula
(x−μ)ᵀΣ⁻¹(x−μ) = 1
Σ = TTᵀ,  T = [[1.6,0.5,0.1],[0,0.85,0.24],[0,0,0.65]]

## spiegazione
L’ellissoide traduce una matrice di covarianza in direzioni e ampiezze spaziali. Le sezioni evidenziate aiutano a leggere l’anisotropia: la dispersione non è la stessa in tutte le direzioni.

## limiti
Il livello rappresentato è una distanza di Mahalanobis pari a uno. Non indica automaticamente una regione di confidenza del 95%, né una frontiera efficiente di portafogli. La matrice è sintetica e definita positiva.

## fonti
[SciPy — covarianza e densità multivariata](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Confronta le direzioni nelle quali l’ellissoide appare più esteso con quelle in cui si restringe, ruotandolo per riconoscere come una stessa forma presenti ampiezze differenti e come le sezioni evidenziate aiutino a leggere questa variazione della dispersione.

## lettura
La superficie raccoglie i punti per i quali la forma quadratica dello scarto dalla media, calcolata con l’inversa della covarianza, vale uno; la covarianza è il prodotto della matrice T per la sua trasposta.
