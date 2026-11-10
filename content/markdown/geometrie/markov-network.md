# Grafo probabilistico

## titolo
Grafo probabilistico

## tema
Sicurezza e XAI

## formula
P(s) = Z⁻¹ exp( ∑ᵢ hᵢsᵢ + ∑₍ᵢ,ⱼ₎∈E Jᵢⱼsᵢsⱼ )
sᵢ ∈ {−1, +1}

## spiegazione
Le variabili sono disposte in tre comunità reticolari, fra le quali alcuni archi color ambra rendono riconoscibili i collegamenti, affinché la rotazione permetta di seguire le dipendenze interne a ciascun gruppo e quelle che mettono in relazione gruppi differenti.

## limiti
La formula descrive un modello di Ising su un grafo, nel quale Z normalizza le probabilità e i coefficienti hᵢ e Jᵢⱼ regolano i termini locali e le interazioni. Le tre comunità, ciascuna composta da 42 nodi, e i sei collegamenti fra comunità sono una costruzione illustrativa; la disposizione poliedrica, le distanze e i colori servono alla lettura della connettività, senza attribuire valori ai parametri del modello.

## fonti
[Lavori di Marzio De Corato su modelli grafici](ricerca.html#tema-ia-spiegabile)

## osservazione
Segui gli archi color ambra fra le tre comunità, poi osserva come le connessioni interne diventino distinguibili cambiando punto di vista; i piccoli nodi identificano le variabili, mentre la trama sottostante aiuta a percepire la profondità della disposizione.

## lettura
La probabilità della configurazione s è l’esponenziale della somma dei termini locali h per s e delle interazioni J per le coppie di stati, diviso per la costante di normalizzazione Z; ciascuno stato vale meno uno o più uno.

## legenda
mint | connessioni interne alle comunità
amber | collegamenti fra comunità e loro estremi
pale | nodi che rappresentano le variabili
