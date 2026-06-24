import './Navigation.css'

function Navigation({ user, onLogout }) {
  return (
    <nav className="navigation">
      <div className="nav-left">
        <div className="nav-logo">E</div>
        <h1>ESAB ROSETTA</h1>
      </div>

      <div className="nav-right">
        <span className="user-info">👤 {user}</span>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}

export default Navigation
