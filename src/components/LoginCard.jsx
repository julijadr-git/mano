import './LoginCard.css'

function LoginCard() {
  return (
    <div className="login-section">
      <div className="login-card">
        <h2 className="login-card-title">Prisijungimas</h2>

        <p className="login-card-description">
          Prisijunkite prie savo paskyros
        </p>

        <form onSubmit={(event) => event.preventDefault()}>
          <div className="login-field">
            <label htmlFor="login-email">El. paštas</label>
            <input
              id="login-email"
              type="email"
              placeholder="Įveskite el. pašto adresą"
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Slaptažodis</label>
            <input
              id="login-password"
              type="password"
              placeholder="Įveskite slaptažodį"
            />
          </div>

          <button type="submit" className="login-button">
            Prisijungti
          </button>
        </form>
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
