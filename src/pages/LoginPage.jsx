import { useState } from 'react'
import './LoginPage.css'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('support@esabrosetta.com')
  const [password, setPassword] = useState('demo')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) {
      onLogin(username)
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">E</div>
        <h1>ESAB ROSETTA</h1>
        <p className="subtitle">Claims Management System</p>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">📧 Email</label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="support@esabrosetta.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">🔐 Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="login-btn">
              Ingresar
            </button>
          </form>

          <p className="demo-info">
            📌 Demo: support@esabrosetta.com / demo
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
