# Projekto kontekstas

## Projekto paskirtis ir darbo eiga

Projektas – Vite + React mokomoji vaikų užduočių aplikacija. Naudojami JavaScript, JSX ir paprastas CSS. Užduotys bei vaikai saugomi esamoje Supabase duomenų bazėje. Nenaudojama autentifikacija; duomenų bazei taikomos vartotojos jau nustatytos RLS sąlygos.

Prieš keičiant failą perskaityti jo esamą turinį ir `README.md`; pirmenybę teikti dabartiniam kodui, nes README vis dar aprašo seną prisijungimo puslapį. Nauji UI komponentai laikomi `src/components/`, jų stiliai – atskiruose CSS failuose. Sąsajos tekstai lietuviški. `main.jsx` keisti tik jei būtina. Naują funkciją laikyti įgyvendinta tik ją įrašius į kodą, o patikrinta – tik atlikus atitinkamą patikrą.

## Dabartinė funkcionalumo būsena

### Supabase konfigūracija

- Priklausomybė `@supabase/supabase-js` deklaruota `package.json` ir `package-lock.json`.
- `src/lib/supabase.js` sukuria klientą tik esant `VITE_SUPABASE_URL` ir `VITE_SUPABASE_ANON_KEY` aplinkos kintamiesiems. React kode naudojamas tik viešas anon raktas.
- `.env.example` rodo reikiamus kintamųjų pavadinimus. Tikros reikšmės turi būti vietiniame, į Git neįkeliamame `.env.local`; šiame projekte `.env.local` patikrinimo metu nerastas.
- Trūkstant konfigūracijos, puslapyje rodoma aiški žinutė ir duomenys nekeičiami vietoje.

### Vaikai ir užduotys

- `src/App.jsx` įkelia vaikų sąrašą iš `children`, leidžia pridėti vaiką ir pasirinkti, kurio vaiko užduotis rodyti.
- Pasirinkto vaiko užduotys įkeliamos iš `tasks`. Galima sukurti įrašą su pavadinimu, neprivalomu aprašymu, taškais ir data; pradinė būsena `not_done`.
- Užduotį galima pažymėti atlikta, jei jos data šiandien arba ankstesnė; būsena tampa `pending`, o `completed_at` nustatomas dabartiniu laiku. Ateities užduoties atlikti negalima.
- `pending` užduotį galima patvirtinti (`approved`) arba atmesti (`rejected`); abiem atvejais nustatomas `reviewed_at`. Atmestą užduotį galima pateikti atlikimo patvirtinimui iš naujo. Patvirtintos užduoties taškai neskaičiuojami antrą kartą ir jos būsena sąsajoje nebekeičiama.
- Sėkmingi įrašymai ir atnaujinimai atnaujina React ekraną iš Supabase atsakymo. Užklausų klaidos parodomos lietuviškai; tuščios vaikų ir užduočių būsenos turi paaiškinimus.
- Statistika rodoma pagal pasirinktą vaiką: taškų suma tik iš `approved`, atlikta skaičiuoja `pending` ir `approved`, laukiančių patvirtinimo skaičius skaičiuoja `pending`. Progresas skaičiuojamas iš atliktų (`pending` arba `approved`) užduočių santykio su visomis vaiko užduotimis.
- Duomenų bazės schema nekeičiama: laikoma, kad `children` ir `tasks` lentelės jau yra. Naujų lentelių, autentifikacijos ar backend paslaugų nepridėta.

### Dizainas

- Esama tamsi tema ir suvestinės kortelių stilius išsaugoti. Nauji formų ir veiksmų stiliai aprašyti `src/App.css`; spalvoms naudojami `src/index.css` `:root` kintamieji, kai tai įmanoma.
- Pagrindinio turinio plotis iki 960px; statistika siaurame ekrane išdėstoma viena kolona. Užduočių veiksmai ir formos persitvarko siauriems ekranams.
- `src/components/LoginCard.jsx` ir `LoginCard.css` liko projekte, bet `App.jsx` jų neimportuoja; dabartiniame ekrane autentifikavimo funkcijų nėra.

## Projekto failai

```text
.env.example
src/
  lib/
    supabase.js          # Supabase klientas ir aplinkos konfigūracijos tikrinimas
  components/
    LoginCard.jsx        # senas, dabartiniame puslapyje nenaudojamas komponentas
    LoginCard.css
  App.jsx                # vaikų, užduočių, būsenų ir statistikos UI bei logika
  App.css                # suvestinės ir Supabase UI stiliai
  index.css              # bendri stiliai ir CSS kintamieji
  main.jsx
package.json
package-lock.json
README.md                # pasenęs: aprašo prisijungimo aplikaciją
projekto_mano_context.md
```

## Patikra ir ribojimai

- Po integracijos `npm run build` sėkmingai susikompiliavo. `npx eslint src/App.jsx src/lib/supabase.js` klaidų nerado. Viso projekto `npm run lint` dar praneša apie ankstesnę `src/components/LoginCard.jsx` klaidą; tas komponentas šiame ekrane nenaudojamas.
- Patikrinta tik tada, kai naudotojo `.env.local` turi galiojantį Supabase URL ir anon raktą, o aplikacijoje galima įrašyti duomenis, perkrauti puslapį ir matyti išlikusius įrašus.
- Be `.env.local` galima patikrinti kompiliavimą, bet negalima patikrinti realių Supabase užklausų ar duomenų išlikimo.
- Supabase lentelės `children`, `tasks` ir jų schema turi būti sukurtos iš anksto. RLS nustatymai iš kodo nekeičiami.
- Tolimesni pakeitimai tik pagal vartotojos prašymą.

## Paleidimas

```bash
npm install
npm run dev
```
