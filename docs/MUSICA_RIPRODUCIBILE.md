# Local Coordinates — sorgenti e ripresa del lavoro

Brano originale sintetico per Topological Manifolds, durata 270 secondi. Nessun campione o strumento audio esterno; il codice e la partitura documentano 74 eventi musicali. Il titolo e le condizioni sono descritti nelle pagine Musica e Licenza.

## File

- `public/audio/local-coordinates.mp3`: copia distribuita dal sito (stereo, 44.100 Hz, 160 kbit/s).
- `tools/compose-soundtrack.py`: generatore deterministico di note, sintesi, inviluppi, riverbero stereo e dissolvenze.
- `tools/requirements-audio.txt`: dipendenze Python, richieste soltanto per rigenerare l’audio.
- `source-materials/music/score.json`: partitura strutturata e seed.
- `content/music-manifest.json`: durata, checksum e provenienza del file pubblicato.
- Il master FLAC è incluso nel pacchetto audio e nella copia integrale del progetto, non nei sorgenti da pubblicare su GitHub.

## Rigenerazione

La normale build Node usa l’MP3 già incluso. Per generare una nuova interpretazione dallo stesso codice:

```sh
python -m pip install -r tools/requirements-audio.txt
python tools/compose-soundtrack.py --output audio-master
ffmpeg -i audio-master/local-coordinates-premaster.wav -af "volume=-5.2dB" -c:a flac audio-master/local-coordinates-master.flac
ffmpeg -i audio-master/local-coordinates-master.flac -c:a libmp3lame -b:a 160k -ar 44100 -metadata title="Local Coordinates" -metadata album="Topological Manifolds" public/audio/local-coordinates.mp3
```

Il comando di volume è un punto di partenza per mantenere margine dinamico; confrontare la nuova esportazione all’ascolto e mediante misure. Le versioni delle librerie e dell’encoder possono cambiare i byte: dopo un’esportazione verificata, aggiornare il manifest con il nuovo checksum, dimensione e durata. Non sostituire il manifest senza controllare l’effettiva provenienza del file.

## Valori del file consegnato

Durata PCM 270,00 s; stereo 44.100 Hz. Misura FFmpeg EBU R128 sull’MP3: loudness integrata circa −21,3 LUFS, true peak circa −8,6 dBFS. Sono misure tecniche, non una garanzia di qualità musicale soggettiva o del livello percepito su ogni dispositivo.

Il progetto è pubblicato come sito multipagina: il lettore non promette continuità fra nuovi documenti. Memorizza il punto di ascolto e propone Riprendi/Resume dopo l’apertura della nuova pagina. Nell’anteprima monofile il brano continua durante le transizioni interne. La ripetizione ha le dissolvenze registrate, non un raccordo perfettamente invisibile.

## Aggiornamento dei metadati v3.3

Il campo ID3 dell’album è stato aggiornato a **Topological Manifolds**. Il contenuto audio MP3 codificato è rimasto identico (impronta SHA-256 del flusso prima e dopo corrispondente); il checksum del file completo e la dimensione nel manifest sono stati aggiornati di conseguenza. Non sono stati rifatti sintesi, composizione, timbri o dissolvenze.
