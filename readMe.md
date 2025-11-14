
## Handlekurva – prosjektoppgaven i IDATT2506 – applikasjonsutvikling for mobile enheter

En enkel, rask og vedvarende handleliste-app utviklet i faget IDATT2506. Appen kjører som webapp og kan pakkes til Android med Capacitor.

### Kjøring lokalt (web)

1) Installer avhengigheter:

```bash
npm install
```

2) Kjør utviklingsserver:

```bash
npm run dev
```

### Bygg og kjør på Android

1) Bygg web-ressurser:

```bash
npm run build
```

2) Synkroniser til Android-prosjekt:

```bash
npx cap sync android
```

3) Åpne Android-prosjektet:

```bash
npx cap open android
```

4) I Android Studio:
- Velg emulator: Medium Phone — Android 16.0 ("Baklava"), API 36, x86_64
- Trykk Run 

#### Vanlige Android-byggeproblemer
- Hvis Gradle-cacher skaper trøbbel: Build → Clean Project, deretter Rebuild Project.
- Etter endringer i web-ressurser: kjør alltid `npm run build` etterfulgt av `npx cap sync android`.



### Funksjonalitet
- Opprett/Slett filer
- Horisontal og vertikal scrolling av hhv. faner og elementer
- Legg til varer raskt med Enter; fokus forblir i input-feltet.
- Kjøpt/Ukjøpt separasjon for elementer i handlelisten skjer ved et enkelt skjermtrykk
- Permanent lagring, en liste per fil, oppdateres fortløppende basert på endringer (sletting av liste, endring av vare)


### Android‑emulator brukt
- Medium Phone — Android 16.0 ("Baklava"), API 36, x86_64

### Filoperasjonslogg (plassholdere)

Fyll inn skjermklipp og korte beskrivelser fra videoen senere. Bruk gjerne formatet under for hver operasjon:

### Logging av filoperasjoner 

#### Lagring av liste


#### Sletting av liste


#### Oppdatering av liste


