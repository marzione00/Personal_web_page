# Circuit for a Bell state

<!-- Edit the text below each ## heading; retain field names. -->

## titolo
Circuit for a Bell state

## tema
Quantum computing

## formula
|00⟩ → (H ⊗ I)|00⟩ → CNOT(H ⊗ I)|00⟩
|Φ⁺⟩ = (|00⟩ + |11⟩) / √2

## spiegazione
Two lines represent the qubits. A Hadamard transformation on the first, followed by a controlled-X gate, prepares a Bell state from |00⟩. The terminal shapes suggest the circuit’s readout points.

## limiti
This is a schematic representation of the circuit, not a measurement simulator or physical device. Internal labels are omitted to keep the geometry readable; the sequence of operations is specified in the formula.

## fonti
[IBM Quantum — Bits, gates, and circuits](https://quantum.cloud.ibm.com/learning/en/courses/utility-scale-quantum-computing/bits-gates-and-circuits)

## osservazione
Identify the two circuit lines and compare their arrangement with the sequence in the formula, following the Hadamard transformation on the first qubit and the controlled-X connection before reaching the terminal readout shapes.

## lettura
Apply Hadamard to the first qubit and identity to the second in state zero zero, followed by CNOT; the result is the sum of states zero zero and one one, divided by the square root of two.
