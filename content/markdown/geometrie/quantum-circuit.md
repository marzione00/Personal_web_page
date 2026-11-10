# Circuito per uno stato di Bell

## titolo
Circuito per uno stato di Bell

## tema
Quantum computing

## formula
|00⟩ → (H ⊗ I)|00⟩ → CNOT(H ⊗ I)|00⟩
|Φ⁺⟩ = (|00⟩ + |11⟩) / √2

## spiegazione
Due linee rappresentano i qubit. Una trasformazione di Hadamard sul primo, seguita da una porta controllata X, prepara uno stato di Bell a partire da |00⟩. Le forme terminali richiamano i punti di lettura del circuito.

## limiti
È una rappresentazione schematica del circuito, non un simulatore di misure o un dispositivo fisico. Il disegno omette le etichette interne per lasciare leggibile la geometria; la sequenza delle operazioni è specificata nella formula.

## fonti
[IBM Quantum — Bits, gates, and circuits](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits)

## osservazione
Individua le due linee del circuito e confronta la loro disposizione con la sequenza riportata nella formula, seguendo la trasformazione di Hadamard sul primo qubit e il collegamento della porta controllata X prima di arrivare alle forme terminali di lettura.

## lettura
Alla coppia di qubit nello stato zero zero si applicano Hadamard al primo qubit e identità al secondo, poi CNOT; il risultato è la somma degli stati zero zero e uno uno, divisa per radice di due.
