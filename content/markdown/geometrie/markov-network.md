# Grafo probabilistico

## titolo
Grafo probabilistico

## tema
Sicurezza e XAI

## formula
P(s) = Z⁻¹ exp( ∑ᵢ hᵢsᵢ + ∑₍ᵢ,ⱼ₎∈E Jᵢⱼsᵢsⱼ )
sᵢ ∈ {−1, +1}

## spiegazione
I nodi rappresentano variabili e gli archi le interazioni ammesse dal modello. La disposizione in gruppi rende visibili connessioni interne e collegamenti fra gruppi: una lettura geometrica delle dipendenze, pertinente allo studio dei modelli probabilistici interpretabili.

## limiti
La formula è quella di un modello di Ising su un grafo. Z normalizza le probabilità; hᵢ e Jᵢⱼ regolano i termini locali e le interazioni. Le posizioni dei nodi sono sintetiche: distanze e colori non rappresentano misure né risultati di un classificatore.

## fonti
[Lavori di Marzio De Corato su modelli grafici](ricerca.html#tema-ia-spiegabile)

## osservazione
Individua i gruppi di nodi e segui gli archi che li collegano, ruotando il grafo affinché le connessioni sovrapposte nella proiezione diventino distinguibili e tu possa confrontare i legami interni a un gruppo con quelli che raggiungono gruppi differenti.

## lettura
La probabilità della configurazione s è l’esponenziale della somma dei termini locali h per s e delle interazioni J per le coppie di stati, diviso per la costante di normalizzazione Z; ciascuno stato vale meno uno o più uno.
