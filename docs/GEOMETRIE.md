# Geometrie · generazione e manutenzione

Il sito usa sette asset eterogenei, tutti senza scritte sovrapposte. I sei SVG sono vettoriali; il frattale di Julia è un WebP generato numericamente. Non vengono usati WebGL, dipendenze esterne o animazioni continue. Le immagini sono decorative (`aria-hidden`, alt vuoto).

## Modelli

- Giroide: superficie di livello `sin(x) cos(y) + sin(y) cos(z) + sin(z) cos(x) = 0`.
- Schwarz P: superficie di livello `cos(x) + cos(y) + cos(z) = 0`.
- Schwarz D: superficie di livello `cos(x) cos(y) cos(z) - sin(x) sin(y) sin(z) = 0`.
- Elicoide: `x=u cos(v)`, `y=u sin(v)`, `z=0.35v`.
- Sierpiński: tetraedro ricorsivo, quattro copie di scala 1/2 per livello, quattro livelli.
- Julia: iterazione `z ← z² + c`, `c=-0.74543+0.11301i`, colore dal tempo di fuga; 240 iterazioni.
- Toro: parametrizzazione con raggi 1.8 e 0.60.

Le superfici G/P/D sono **approssimazioni nodali decorative** di superfici periodiche, non rappresentazioni esatte di superfici minime e non modelli atomistici di schwarziti ottimizzati energeticamente. Il richiamo alle schwarziti è geometrico. Questa distinzione va conservata in eventuali descrizioni scientifiche future.

Il generatore usa marching cubes per le superfici implicite, proiezione ortografica e ordinamento in profondità delle facce per il rendering SVG. I colori evidenziano la forma e la triangolazione; non codificano dati sperimentali.

## Rigenerazione opzionale

```sh
python -m pip install -r tools/requirements-geometry.txt
python tools/generate-geometry.py
npm run build
npm run preview:build
```

Il normale deploy usa i file già generati. Ogni asset è verificato tramite `public/geometry/manifest.json`. Il generatore non apre, elabora o modifica le fotografie.

Riferimenti per le approssimazioni nodali: https://doi.org/10.1093/jcde/qwac076 ; https://doi.org/10.3390/a14040125 . Formule e modello effettivo di ciascun file sono registrati nel manifest.
