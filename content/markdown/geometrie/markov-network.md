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
