Prisijungimo aplikacija (Vite + React)

Internetinė aplikacija, kuriama su Vite + React. Šiuo metu įgyvendintas pagrindinis puslapio karkasas: navigacijos juosta, kalbos pasirinkimo meniu ir prisijungimo kortelė. Tamsus vizualinis stilius.

Paleidimas

npm install
npm run dev

Technologijos

- React (hooks, funkciniai komponentai)
- Vite
- Paprastas CSS (be CSS bibliotekų)

Projekto struktūra

src/
  assets/
    hero.png
    react.svg
    vite.svg
  components/
    LoginCard.jsx
    LoginCard.css
  App.jsx
  App.css
  index.css
  main.jsx

Dabartinė būsena

Įgyvendinta

- Pašalintas pradinis Vite demonstracinis turinys ir viršutinis logotipų blokas.
- Viso ekrano pločio navigacijos juosta (.navbar, 3 stulpelių grid: 1fr auto 1fr).
- Navigacijos juostos centre – mini logotipas (inline SVG).
- Dešinėje – kalbos pasirinkimo meniu (LT / EN) su atidarymo/uždarymo būsena ir varnele prie aktyvios kalbos.
- Pagrindinėje dalyje (#center) – pasveikinimo tekstas ir prisijungimo kortelė LoginCard.
- #root išplėstas iki viso ekrano pločio.
- Tamsi spalvų schema per CSS kintamuosius (src/index.css, :root).
- Responsyvūs stiliai (breakpoint'ai: 1024px ir 480px).

Svarbios pastabos / apribojimai

- Kalbos pasirinkimas šiuo metu keičia tik būsenos žymą (language: 'LT' | 'EN'). Puslapio turinys dar nėra verčiamas.
- Prisijungimas (LoginCard) kol kas yra tik UI. Autentifikavimo logika neįgyvendinta.
- LoginCard yra atskiras komponentas: src/components/LoginCard.jsx (+ LoginCard.css).
- main.jsx nekeistas.

Pagrindiniai failai
Failas	Paskirtis
src/App.jsx	Navigacijos juosta, kalbos meniu (useState: language, languageOpen), pasveikinimo sekcija, LoginCard
src/App.css	.navbar, .navbar-logo, .language-*, #center ir responsyvūs stiliai
src/index.css	Globalūs stiliai, CSS kintamieji (--bg, --text, --text-h, --accent, ...), #root
src/components/LoginCard.jsx	Prisijungimo kortelės UI

Stiliaus gairės

- Tamsi tema: fonas --bg: #0d101e, tekstas --text: #a5a9c5, antraštės --text-h: #f3f4ff, akcentas --accent: #9365ff.
- Naudoti esamus CSS kintamuosius iš :root, o ne kietai surašytas spalvas, kai tai įmanoma.
- Išlaikyti esamą vizualinį stilių (permatomi fonai, švelnūs violetiniai kraštiniai, apvalinti kampai).