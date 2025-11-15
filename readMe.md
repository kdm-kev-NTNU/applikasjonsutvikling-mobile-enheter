
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
- Gradle-relatert feil: Prøv Build → Clean Project, og deretter Rebuild Project. Hvis problemet vedvarer, kan det være nødvendig å slette .gradle-mappen og la Android Studio regenerere filene.
- Endringer i web-ressurser: Kjør npm run build før npx cap sync android. Uten dette risikerer man at endringene ikke dukker opp i den native Android-appen.



### Funksjonalitet
- Opprett/Slett filer
- Horisontal og vertikal scrolling av hhv. faner og elementer
- Legg til varer raskt med Enter; fokus forblir i input-feltet.
- Kjøpt/Ukjøpt separasjon for elementer i handlelisten skjer ved et enkelt skjermtrykk
- Persistent lagring, en liste per fil, oppdateres fortløppende basert på endringer (sletting av liste, endring av vare)
- Når en ny liste opprettes, flyttes fokus automatisk fra listefeltet til varefeltet.
- Tastatur holder seg oppe under innstasting av varer, for å oppnå dette må man trykke på ikonet
<img width="617" height="35" alt="vise tastatur" src="https://github.com/user-attachments/assets/d5d3f6e6-a0b0-4a47-85d3-2e00aa4c10c5" />

For at det blir synlig må man trykke alt + k på windows and option + k på mac, for at man skal kunne se testaturen på emulatoren


### Android‑emulator brukt
- Medium Phone — Android 16.0 ("Baklava"), API 36, x86_64

### Obs seksjon for hvordan man kan bruke norsk tastatur - hvis man vil teste det på norsk

### Filoperasjonslogg
Nedenfor er det bildeutklipp som viser bruken av en enkel json fil per liste for å sikre persistens og å holde styr på endringene som foregår.

### Logging av filoperasjoner 

#### Opprettelse av liste
<img width="1581" height="63" alt="opprettelse av liste" src="https://github.com/user-attachments/assets/4a1ea6d5-4956-48e3-ab4b-28ccbb61d757" />



### Fortløppende endring av liste (fra ukjøpt til kjøpt og motsatt) 
<img width="1548" height="46" alt="kontinuerlig endring - fra ukjøpt til kjøpt eller tilbake" src="https://github.com/user-attachments/assets/e6fe0136-57ad-40fb-a027-687a7258c762" />


#### Sletting av liste

<img width="1290" height="30" alt="sletting av liste" src="https://github.com/user-attachments/assets/deeeddf4-90d9-4f61-8685-71a996a97f52" />


#### Item lagt til i liste

<img width="1570" height="71" alt="item lagt til i liste" src="https://github.com/user-attachments/assets/5d4e87a2-1bb5-4148-9d00-b0ad8b39ca9c" />




