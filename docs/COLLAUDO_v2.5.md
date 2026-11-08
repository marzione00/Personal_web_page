# MDC_LAB 2.5 — Collaudo degli effetti e dei contatti

**Data:** 8 novembre 2026. Verifica locale sul pacchetto, senza modifica del repository GitHub.

## Modifiche
- Email di contatto delle pagine italiane e inglesi: `marzio.decorato@outlook.it`. Il vecchio indirizzo istituzionale non compare come contatto nelle pagine del sito. Il PDF del CV preesistente è rimasto invariato.
- Hover dei link con colore verde luminoso e sottolineatura progressiva di circa 180 ms; nessuno spostamento degli elementi.
- Nuovo pulsante audio accanto al tema e alla lingua, accessibile con etichetta IT/EN e stato `aria-pressed`. Disattivato per impostazione predefinita. L'utente abilita/disabilita manualmente l'effetto.
- Suono Web Audio originale di circa 110 ms, volume ridotto, intervallo minimo di 230 ms fra due emissioni. Nessuna richiesta a terze parti o file audio aggiuntivo. Preferenza locale, dove disponibile; i browser possono richiedere una nuova interazione dopo la navigazione.

## Esiti confermati
- **151 test Node.js superati**, compresi quattro nuovi controlli specifici su email, pulsante e stile.
- **38 controlli browser mirati superati**, con emulazione degli oscillatori, attivazione esplicita, mute immediato, hover luminoso, testi IT/EN, indirizzo Outlook e larghezze 320, 390, 768 e 1440 px.
- **34 pagine HTML IT/EN** generate; controllo di **2.752 collegamenti locali** e **118 riferimenti a immagini** riuscito.
- **5 fotografie originali** verificate per SHA-256. I PDF didattici, il saggio e le geometrie 3D restano invariati.
- Build di rilascio con `SITE_URL=https://marzione00.github.io/Personal_web_page/` riuscita; anteprima offline IT/EN generata.

## Limiti
Le verifiche browser mirate sono state condotte in Chromium locale. Il segnale acustico è stato controllato con l'API AudioContext simulata, che misura la creazione dei toni senza attestare il volume percepito su ogni dispositivo. Il collaudo esteso dell'intero visualizzatore geometrico è stato avviato, ma interrotto per limite di tempo: **non è conteggiato come superato** per questa versione. I test 3D della precedente v2.4 risultavano superati, ma non costituiscono certificazione della nuova release. Autoplay e disponibilità audio dipendono dalle regole del browser.

Il sito online, il CMS autenticato e gli header effettivi di GitHub Pages non sono stati collaudati nella presente sessione. Nessun file del repository remoto è stato modificato.
