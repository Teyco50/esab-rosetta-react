import { useState } from 'react'
import './LoginPage.css'

const DEMO_USERS = [
  { email: 'admin@esab.com',          role: 'Admin',          hint: 'All 100 claims' },
  { email: 'qa@esab.com',             role: 'QA Coordinator', hint: '~33 claims as QA' },
  { email: 'agent@esab.com',          role: 'Claims Agent',   hint: '~25 assigned claims' },
  { email: 'support@esabrosetta.com', role: 'Claims Agent',   hint: '~25 assigned claims' },
]

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('support@esabrosetta.com')
  const [password, setPassword] = useState('demo')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username && password) onLogin(username)
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
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">📧 Email</label>
              <input
                type="email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="email@esab.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">🔐 Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>

          <div className="demo-info">
            <p className="demo-title">📌 Demo accounts (any password):</p>
            <div className="demo-users">
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  className="demo-user-chip"
                  type="button"
                  onClick={() => setUsername(u.email)}
                >
                  <span className={`demo-role-badge role-${u.role.toLowerCase().replace(' ', '-')}`}>
                    {u.role}
                  </span>
                  <span className="demo-email">{u.email}</span>
                  <span className="demo-hint">{u.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
