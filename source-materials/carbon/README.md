# Famiglia delle geometrie carboniose

`tools/generate-carbon-family.py` costruisce quattro modelli principali e due viste alternative. Coordinate, anelli e connettività sono conservati in `models.json`; le proiezioni SVG e le miniature WebP provengono dagli stessi grafi dei file MDC3. Il generatore condivide `tools/carbon_mesh.py` con la schwarzite. Le figure sono procedurali e non impiegano immagini generative o fotografie.

| Modello | Atomi C | Legami | Costruzione |
|---|---:|---:|---|
| Fullerene C₆₀ | 60 | 90 | Troncamento di un icosaedro: 12 pentagoni, 20 esagoni; grado 3 in ogni vertice |
| Nanonastro armchair | 80 | 106 | Frammento piano di reticolo esagonale, 27 anelli completi |
| Nanonastro zigzag | 84 | 112 | Frammento piano con altra orientazione del bordo, 29 anelli completi |
| Nanonastro deformato | 80 | 106 | Stesso grafo armchair, trasformazione R(x,y)=(x,y cos(0.16x),y sin(0.16x)) |
| Doppio strato traslato | 80 | 104 | Due frammenti da 40 C, separati di 2.36 unità e traslati di una unità |
| Doppio strato allineato | 80 | 104 | Stessi frammenti e separazione, traslazione orizzontale nulla |

Il nastro piano usa legami unitari. Idrogeni, gruppi funzionali e orbitali sono omessi; il bordo carbonioso ha grado 2 e l’interno grado 3. Il nastro deformato conserva il grafo, mentre alcune lunghezze e gli angoli variano: è un’illustrazione geometrica, senza ottimizzazione energetica. Il doppio strato mantiene due componenti distinte e non introduce legami covalenti fra piani. Il C₆₀ ideale usa legami uniformi; la molecola reale presenta lunghezze diverse. Le facce scure sono ausili di lettura della profondità.

## Fonti e collegamenti

Le fonti sono state consultate tramite schede editoriali o abstract indicizzati il 10 novembre 2026. Le geometrie illustrano i temi, senza ricostruire coordinate specifiche dei sistemi degli articoli.

- Kroto et al., *C₆₀: Buckminsterfullerene*, Nature (1985), https://doi.org/10.1038/318162a0.
- Cavani, De Corato et al., *Vibrational signature of the graphene nanoribbon edge structure from high-resolution electron energy-loss spectroscopy*, Nanoscale (2020), https://doi.org/10.1039/D0NR05763K.
- Verzhbitskiy, De Corato et al., *Raman Fingerprints of Atomically Precise Graphene Nanoribbons*, Nano Letters (2016), https://doi.org/10.1021/acs.nanolett.5b04183.
- Son, Cohen e Louie, *Energy Gaps in Graphene Nanoribbons*, Physical Review Letters (2006), https://doi.org/10.1103/PhysRevLett.97.216803.
- Hu, De Corato et al., *Bandgap Engineering of Graphene Nanoribbons by Control over Structural Distortion*, JACS (2018), https://doi.org/10.1021/jacs.8b02209.
- De Corato et al., *Optical Properties of Bilayer Graphene Nanoflakes*, J. Phys. Chem. C (2014), https://doi.org/10.1021/jp504222m.
- De Corato et al., *Two C₂₈ Clathrates* (2013), https://air.unimi.it/handle/2434/221008. Il C₆₀ introduce le gabbie; non rappresenta i clatrati C₂₈ di questo lavoro.

Rigenerazione: `python3 tools/generate-carbon-family.py`. Dipendenze di sviluppo già elencate in `tools/requirements-geometry.txt`; nessuna dipendenza aggiunta al browser.
