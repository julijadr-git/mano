
import { useState } from 'react'
import './App.css'
import LoginCard from './components/LoginCard'

function App() {
  const [language, setLanguage] = useState('LT')
  const [languageOpen, setLanguageOpen] = useState(false)

  return (
    <>
      {/* Navigacijos juosta */}
      <nav className="navbar">
        {/* Centrinis logotipas */}
        <div className="navbar-logo" aria-label="Pagrindinis logotipas">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3"
              y="3"
              width="20"
              height="20"
              rx="6"
              transform="rotate(-15 3 3)"
              fill="#4388FF"
            />
            <rect
              x="13"
              y="13"
              width="20"
              height="20"
              rx="6"
              transform="rotate(-15 13 13)"
              fill="#9365FF"
              fillOpacity="0.95"
            />
          </svg>
        </div>

        {/* Kalbos pasirinkimas */}
        <div className="language-container">
          <button
            className="language-button"
            onClick={() => setLanguageOpen(!languageOpen)}
            aria-expanded={languageOpen}
            aria-label="Pasirinkti kalbą"
          >
            {language}
            <span className={`language-arrow ${languageOpen ? 'open' : ''}`}>
              ▼
            </span>
          </button>

          {languageOpen && (
            <div className="language-menu">
              <button
                className={`language-option ${language === 'LT' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('LT')
                  setLanguageOpen(false)
                }}
              >
                LT
                {language === 'LT' && <span>✓</span>}
              </button>

              <button
                className={`language-option ${language === 'EN' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('EN')
                  setLanguageOpen(false)
                }}
              >
                EN
                {language === 'EN' && <span>✓</span>}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Pagrindinė puslapio dalis */}
      <section id="center">
        <div>
          <h1>Sveiki atvykę!</h1>
          <p>Prisijunkite prie savo paskyros</p>
        </div>

        <LoginCard />
      </section>
    </>
  )
}

export default App