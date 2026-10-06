# Projekto kontekstas

## Projekto paskirtis ir darbo eiga

Projektas – Vite + React prisijungimo aplikacija. Naudojami JavaScript, JSX ir paprastas CSS. Nauji komponentai laikomi `src/components/` kataloge, jų stiliai – atskiruose CSS failuose. Sąsajos tekstai lietuviški.

Vartotoja pakeitimus paprastai pritaiko rankiniu būdu Cursor redaktoriuje. Dirbti po vieną aiškų žingsnį ir po kiekvieno UI pakeitimo paprašyti patikrinti rezultatą su `npm run dev`. Prieš keičiant failą perskaityti jo esamą turinį ir `README.md`. Nenaudoti Cursor Agent. `main.jsx` keisti tik jei būtina.

## Dabartinė funkcionalumo būsena

### Puslapio karkasas ir navigacija

- Tamsi, responsyvi sąsaja; pagrindiniai breakpoint'ai `1024px` ir `480px`.
- Navigacijos juosta per visą plotį, centre – inline SVG logotipas.
- Kalbos meniu leidžia pasirinkti LT arba EN, bet keičia tik žymą. Puslapio turinys neverčiamas.
- Prisijungus viršuje dešinėje, prieš kalbos meniu, rodomas „Atsijungti“ mygtukas. Jis siaurame ekrane sumažinamas.
- Po „Sveiki atvykę!“ anksčiau buvęs tekstas „Prisijunkite prie savo paskyros“ pašalintas.

### Demonstracinė registracija ir prisijungimas

- `src/components/LoginCard.jsx` turi registracijos ir prisijungimo formas su el. paštu bei slaptažodžiu.
- Pirmą paskyrą galima susikurti vietoje; leidžiama viena paskyra kiekvienai naršyklei.
- Slaptažodis nesaugomas paprastu tekstu: `localStorage` įrašomi PBKDF2-SHA-256 kontrolinė reikšmė ir atsitiktinė druska. Naujas slaptažodis turi būti bent 8 simbolių.
- Prisijungimas ir paskyra veikia tik tame pačiame įrenginyje bei naršyklėje. Aplikacija neturi serverio, API ar tikros sesijų sistemos; perkrovus puslapį reikia prisijungti iš naujo, o išvalius svetainės duomenis paskyra prarandama.
- Tai prototipas, ne tikrų paskyrų autentifikavimas. Kliento pusėje veikiantį patikrinimą galima apeiti; slaptažodžių keitimas šio apribojimo nepanaikina.

### Profilis

- Prisijungus rodoma „Mano profilis“ kortelė su el. paštu.
- „Redaguoti profilį“ leidžia nustatyti vardą. Vardas įrašomas greta paskyros duomenų naršyklės `localStorage`.
- „Keisti slaptažodį“ forma prašo dabartinio slaptažodžio, naujo slaptažodžio ir jo pakartojimo. Tikrinamas dabartinis slaptažodis ir naujų įrašų sutapimas; pranešimas rodomas profilyje.
- Atsijungus profilio kortelė paslepiama. Paskyra ir profilio duomenys lieka `localStorage`.

## Projekto struktūra ir svarbūs failai

```text
src/
  assets/
  components/
    LoginCard.jsx       # registracija, prisijungimas, profilis, slaptažodžio keitimas
    LoginCard.css       # formų ir profilio kortelės stiliai
  App.jsx               # navigacija, kalbos meniu ir prisijungimo būsena
  App.css               # navigacijos, atsijungimo mygtuko ir puslapio stiliai
  index.css             # bendri stiliai ir :root kintamieji
  main.jsx
README.md
projekto_mano_context.md
```

`src/index.css` spalvų kintamieji apima `--bg`, `--text`, `--text-h`, `--accent`, `--accent-bg`, `--accent-border` ir kitus. Išlaikyti tamsią temą, violetinį akcentą, apvalintus kampus ir responsyvumą.

## Patikra ir būsimi darbai

- Vartotoja patvirtino, kad profilio kortelė ir vardo redagavimas veikia.
- Vartotoja patvirtino, kad slaptažodžio keitimas veikia.
- Paskutinių kodo pakeitimų automatizuoti testai nevykdyti. `git diff --check` po kai kurių pakeitimų nerado klaidų.
- Tolimesni pakeitimai tik pagal vartotojos prašymą. Naują funkciją laikyti patikrinta tik vartotojai ją išbandžius.

## Paleidimas

```bash
npm run dev
```
