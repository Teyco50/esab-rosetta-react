import './TopNavigation.css'

function TopNavigation({ user, onLogout, onNavigate, currentPage }) {
  return (
    <nav className="top-navigation">
      {/* Left: Logo and Title */}
      <div className="nav-left">
        <div className="nav-logo">E</div>
        <div className="nav-branding">
          <h1>ESAB ROSETTA</h1>
          <p>Claims Management Platform</p>
        </div>
      </div>

      {/* Center: Menu Items */}
      <div className="nav-menu">
        <button
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Home
        </button>
        <div className="nav-dropdown">
          <button className={`nav-item ${currentPage === 'claims' || currentPage === 'new-claim' || currentPage === 'details' ? 'active' : ''}`}>
            Claim ▼
          </button>
          <div className="dropdown-menu">
            <button onClick={() => onNavigate('claims')}>All Claims</button>
            <button onClick={() => onNavigate('new-claim')}>New Claim</button>
          </div>
        </div>
        <button className="nav-item">Catalogs ▼</button>
        <button className="nav-item">Project Identifier ▼</button>
        <button className="nav-item">Reports ▼</button>
        <button className="nav-item">Support ▼</button>
      </div>

      {/* Right: User Info and Logout */}
      <div className="nav-right">
        <span className="user-info">Welcome, {user}</span>
        <button className="logout-btn" onClick={onLogout}>
          LogOut
        </button>
      </div>
    </nav>
  )
}

export default TopNavigation
