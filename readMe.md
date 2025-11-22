
# Handlekurva 
**Prosjektoppgaven i IDATT2506 – applikasjonsutvikling for mobile enheter**

En enkel, rask og vedvarende handleliste-app utviklet i faget IDATT2506 utviklet i Ionic med React. Appen kjører som webapp og kan pakkes til Android med Capacitor.

## Oppsett

1. Installer avhengigheter:

```bash
npm install
```

2. Bygg applikasjonen:

```bash
npm run build
```

## Kjøring lokalt (web)

Kjør utviklingsserver:

```bash
npm run dev
```

## Bygg og kjør på Android

1. Synkroniser til Android-prosjekt:

```bash
npx cap sync android
```

2. Åpne Android-prosjektet:

```bash
npx cap open android
```

3. I Android Studio:

- Velg emulator: Medium Phone — Android 16.0 ("Baklava"), API 36, x86_64
- Trykk Run

## Feilsøking
 
### Android Gradle Plugin (AGP) versjonskonflikt
 
Hvis du får en feilmelding om at prosjektet bruker en inkompatibel versjon av Android Gradle Plugin (f.eks. "AGP 8.13.0" når den støttede versjonen er "AGP 8.12.0"):
 
**Løsning:**
 
1. Åpne filen `android/build.gradle`
2. Finn linjen med `classpath 'com.android.tools.build:gradle:8.13.0'` (eller en nyere versjon)
3. Endre versjonsnummeret til den støttede versjonen (f.eks. `8.12.0`)
4. Synkroniser Gradle-filene i Android Studio (File → Sync Project with Gradle Files)
5. Hvis problemet vedvarer, prøv å invalidere caches (File → Invalidate Caches / Restart)
 
**Hvorfor skjer dette?**
Nyere versjoner av Android Gradle Plugin krever nyere versjoner av Android Studio eller Gradle. Hvis din installasjon ikke støtter den nyeste AGP-versjonen, må du nedgradere til en kompatibel versjon.
 

## Funksjonalitet
- Opprett/Slett filer
- Horisontal og vertikal scrolling av hhv. faner og elementer
- Legg til varer raskt med Enter; fokus forblir i input-feltet.
- Kjøpt/Ukjøpt separasjon for elementer i handlelisten skjer ved et enkelt skjermtrykk
- Persistent lagring, en liste per fil, oppdateres fortløppende basert på endringer (sletting av liste, endring av varestatus)
- Når en ny liste opprettes, flyttes fokus automatisk fra listefeltet til varefeltet.
- Tastatur holder seg oppe under innstasting av varer, for å oppnå dette må man trykke på ikonet under:
<img width="617" height="35" alt="vise tastatur" src="https://github.com/user-attachments/assets/34d4b64e-b658-4721-bdbc-5bf59073ab61" />


For at det blir synlig må man trykke alt + k på windows and option + k på mac, for at man skal kunne se testaturen på emulatoren

NB: For å kunne ha keyboard med norsk tastatur på emulatoren, må dette bli lagt til via keyboard settings.

## Android‑emulator brukt
- Medium Phone — Android 16.0 ("Baklava"), API 36, x86_64


## Logging av filoperasjoner 
Nedenfor er det bildeutklipp som viser bruken av en enkel json fil per liste for å sikre persistens og å holde styr på endringene som foregår.

### Opprettelse av liste
<img width="1581" height="63" alt="opprettelse av liste" src="https://github.com/user-attachments/assets/4a1ea6d5-4956-48e3-ab4b-28ccbb61d757" />



### Fortløppende endring av liste (fra ukjøpt til kjøpt og motsatt) 
<img width="1548" height="46" alt="kontinuerlig endring - fra ukjøpt til kjøpt eller tilbake" src="https://github.com/user-attachments/assets/e6fe0136-57ad-40fb-a027-687a7258c762" />


### Sletting av liste

<img width="1290" height="30" alt="sletting av liste" src="https://github.com/user-attachments/assets/deeeddf4-90d9-4f61-8685-71a996a97f52" />


### Item lagt til i liste

<img width="1570" height="71" alt="item lagt til i liste" src="https://github.com/user-attachments/assets/5d4e87a2-1bb5-4148-9d00-b0ad8b39ca9c" />




