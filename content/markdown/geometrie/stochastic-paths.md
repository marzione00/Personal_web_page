# Traiettorie stocastiche

## titolo
Traiettorie stocastiche

## tema
Finanza quantitativa

## formula
dSₜ = μSₜ dt + σSₜ dWₜ
Sₜ = S₀ exp[(μ − σ²/2)t + σWₜ]

## spiegazione
Le curve rappresentano dodici realizzazioni sintetiche di un moto browniano geometrico. Ogni traiettoria deriva da incrementi casuali; una componente comune introduce dipendenza fra le realizzazioni.

## limiti
S₀ = 1, μ = 0.07 e σ = 0.32, con seme casuale fissato. Il coefficiente della componente comune degli incrementi è 0.55, quindi la correlazione teorica fra incrementi di traiettorie diverse è 0.55². La separazione laterale distingue le curve: non è una variabile economica. Non sono dati di mercato né previsioni.

## fonti
[Wolfram — GeometricBrownianMotionProcess](https://reference.wolfram.com/language/ref/GeometricBrownianMotionProcess.html)

## osservazione
Segui la traiettoria color ambra e confrontala con le altre undici, osservando le variazioni dei campioni senza attribuire alla separazione laterale un significato economico; il tratto angoloso conserva gli incrementi della costruzione sintetica.

## lettura
La variazione di S contiene un termine di deriva mu S per dt e un termine casuale sigma S per dW; la soluzione moltiplica il valore iniziale per l’esponenziale di mu meno metà sigma al quadrato, per t, più sigma W.

## legenda
blue | insieme delle traiettorie, con toni dal blu al verde
amber | una realizzazione scelta come riferimento
pale | estremi finali delle altre traiettorie
