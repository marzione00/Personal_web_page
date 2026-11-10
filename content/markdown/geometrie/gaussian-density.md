# Densità gaussiana

## titolo
Densità gaussiana

## tema
Metodi quantitativi

## formula
f(x) = exp[−½(x−μ)ᵀΣ⁻¹(x−μ)] / (2π√detΣ)
μ = (0,0),  Σ = [[1,0.55],[0.55,1]]

## spiegazione
La superficie descrive una densità normale bivariata. La correlazione inclina le sezioni della campana: osservare la forma permette di distinguere dispersione e dipendenza fra le due componenti.

## limiti
L’altezza è riscalata come 9f − 0.7 per la visualizzazione. È una distribuzione teorica con parametri dichiarati, non una stima ottenuta da osservazioni.

## fonti
[SciPy — multivariate_normal](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.multivariate_normal.html)

## osservazione
Osserva la campana prima dall’alto e poi lateralmente, così da confrontare l’orientamento delle sue sezioni con la variazione dell’altezza e riconoscere come la forma renda visibili, insieme alla dispersione delle due componenti, la dipendenza descritta dalla correlazione.

## lettura
La densità gaussiana usa nell’esponente meno metà della forma quadratica dello scarto dalla media con l’inversa della covarianza; la normalizzazione è due pi greco per la radice del determinante di sigma.
