import { useState } from 'react'
import './LoginCard.css'

const ACCOUNT_KEY = 'mano-local-account'
const PBKDF2_ITERATIONS = 150000

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function getSavedAccount() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNT_KEY))
  } catch {
    return null
  }
}

function LoginCard({ loggedInEmail, onLogin }) {
  const [mode, setMode] = useState(getSavedAccount() ? 'login' : 'register')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (typeof globalThis.crypto === 'undefined' || !globalThis.crypto.subtle) {
      setMessage('Ši naršyklė nepalaiko saugaus slaptažodžio apdorojimo.')
      return
    }

    setIsSubmitting(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const account = getSavedAccount()

      if (mode === 'register') {
        if (account) {
          setMessage('Šioje naršyklėje paskyra jau sukurta. Prisijunkite.')
          setMode('login')
          return
        }

        const salt = crypto.getRandomValues(new Uint8Array(16))
        const passwordHash = await hashPassword(password, salt)
        localStorage.setItem(
          ACCOUNT_KEY,
          JSON.stringify({
            email: normalizedEmail,
            salt: toBase64(salt),
            passwordHash: toBase64(passwordHash),
          }),
        )
        onLogin(normalizedEmail)
        setMode('login')
        setPassword('')
        return
      }

      if (!account || account.email !== normalizedEmail) {
        setMessage('Neteisingas el. paštas arba slaptažodis.')
        return
      }

      const passwordHash = await hashPassword(password, fromBase64(account.salt))
      const savedHash = fromBase64(account.passwordHash)
      const matches = passwordHash.length === savedHash.length &&
        passwordHash.every((byte, index) => byte === savedHash[index])

      if (!matches) {
        setMessage('Neteisingas el. paštas arba slaptažodis.')
        return
      }

      onLogin(normalizedEmail)
      setPassword('')
    } catch {
      setMessage('Nepavyko atlikti veiksmo. Bandykite dar kartą.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setMessage('')
    setPassword('')
  }

  if (loggedInEmail) {
    return (
      <div className="login-section">
        <div className="login-card" aria-live="polite">
          <h2 className="login-card-title">Prisijungėte</h2>
          <p className="login-card-description">{loggedInEmail}</p>
        </div>
      </div>
    )
  }

  const isRegistering = mode === 'register'

  return (
    <div className="login-section">
      <div className="login-card">
        <h2 className="login-card-title">
          {isRegistering ? 'Paskyros kūrimas' : 'Prisijungimas'}
        </h2>

        <p className="login-card-description">
          {isRegistering
            ? 'Sukurkite paskyrą šiame įrenginyje'
            : 'Prisijunkite prie savo paskyros'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">El. paštas</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Įveskite el. pašto adresą"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Slaptažodis</label>
            <input
              id="login-password"
              type="password"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              placeholder="Įveskite slaptažodį"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          {message && <p className="login-message" role="alert">{message}</p>}

          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting
              ? 'Palaukite…'
              : isRegistering
                ? 'Sukurti paskyrą'
                : 'Prisijungti'}
          </button>
        </form>

        <p className="login-mode-switch">
          {isRegistering ? 'Jau turite paskyrą?' : 'Neturite paskyros?'}{' '}
          <button
            type="button"
            onClick={() => switchMode(isRegistering ? 'login' : 'register')}
          >
            {isRegistering ? 'Prisijunkite' : 'Sukurkite paskyrą'}
          </button>
        </p>
      </div>

      <div className="help-section">
        <p className="help-title">Reikia pagalbos?</p>
        <button type="button" className="help-card">
          Spausk čia
        </button>
      </div>
    </div>
  )
}

export default LoginCard
