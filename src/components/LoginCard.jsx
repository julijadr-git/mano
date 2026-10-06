import { useEffect, useState } from 'react'
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
  const [displayName, setDisplayName] = useState('')
  const [nameDraft, setNameDraft] = useState('')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  useEffect(() => {
    if (!loggedInEmail) return

    const account = getSavedAccount()
    const savedName = account?.email === loggedInEmail ? account.displayName || '' : ''
    setDisplayName(savedName)
    setNameDraft(savedName)
    setIsEditingProfile(false)
    setIsChangingPassword(false)
    setPasswordMessage('')
  }, [loggedInEmail])

  function saveProfile(event) {
    event.preventDefault()
    const account = getSavedAccount()
    const nextName = nameDraft.trim()

    if (!account || account.email !== loggedInEmail) return

    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify({ ...account, displayName: nextName }),
    )
    setDisplayName(nextName)
    setIsEditingProfile(false)
  }

  async function changePassword(event) {
    event.preventDefault()
    setPasswordMessage('')

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Nauji slaptažodžiai nesutampa.')
      return
    }

    setIsSavingPassword(true)
    try {
      const account = getSavedAccount()
      if (!account || account.email !== loggedInEmail) {
        setPasswordMessage('Nepavyko rasti paskyros duomenų.')
        return
      }

      const currentHash = await hashPassword(currentPassword, fromBase64(account.salt))
      const savedHash = fromBase64(account.passwordHash)
      const currentMatches = currentHash.length === savedHash.length &&
        currentHash.every((byte, index) => byte === savedHash[index])

      if (!currentMatches) {
        setPasswordMessage('Dabartinis slaptažodis neteisingas.')
        return
      }

      const nextSalt = crypto.getRandomValues(new Uint8Array(16))
      const nextHash = await hashPassword(newPassword, nextSalt)
      localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify({
          ...account,
          salt: toBase64(nextSalt),
          passwordHash: toBase64(nextHash),
        }),
      )
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsChangingPassword(false)
      setPasswordMessage('Slaptažodis pakeistas.')
    } catch {
      setPasswordMessage('Nepavyko pakeisti slaptažodžio. Bandykite dar kartą.')
    } finally {
      setIsSavingPassword(false)
    }
  }

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
        <div className="login-card profile-card">
          <h2 className="login-card-title">Mano profilis</h2>
          <div className="profile-details">
            <p><span>El. paštas</span>{loggedInEmail}</p>
            {displayName && <p><span>Vardas</span>{displayName}</p>}
          </div>

          {isEditingProfile ? (
            <form onSubmit={saveProfile}>
              <div className="login-field">
                <label htmlFor="profile-name">Vardas</label>
                <input
                  id="profile-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Įveskite vardą"
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                />
              </div>
              <div className="profile-actions">
                <button type="submit" className="login-button">Išsaugoti</button>
                <button
                  type="button"
                  className="profile-cancel"
                  onClick={() => {
                    setNameDraft(displayName)
                    setIsEditingProfile(false)
                  }}
                >
                  Atšaukti
                </button>
              </div>
            </form>
          ) : isChangingPassword ? (
            <form onSubmit={changePassword}>
              <div className="login-field">
                <label htmlFor="current-password">Dabartinis slaptažodis</label>
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="new-password">Naujas slaptažodis</label>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="confirm-password">Pakartokite naują slaptažodį</label>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {passwordMessage && (
                <p className="profile-password-message" role="status">
                  {passwordMessage}
                </p>
              )}
              <div className="profile-actions">
                <button type="submit" className="login-button" disabled={isSavingPassword}>
                  {isSavingPassword ? 'Palaukite…' : 'Išsaugoti slaptažodį'}
                </button>
                <button
                  type="button"
                  className="profile-cancel"
                  onClick={() => {
                    setIsChangingPassword(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordMessage('')
                  }}
                >
                  Atšaukti
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-actions">
              <button
                type="button"
                className="login-button"
                onClick={() => setIsEditingProfile(true)}
              >
                Redaguoti profilį
              </button>
              <button
                type="button"
                className="profile-secondary-action"
                onClick={() => {
                  setIsChangingPassword(true)
                  setPasswordMessage('')
                }}
              >
                Keisti slaptažodį
              </button>
              {passwordMessage && (
                <p className="profile-password-message" role="status">
                  {passwordMessage}
                </p>
              )}
            </div>
          )}
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
