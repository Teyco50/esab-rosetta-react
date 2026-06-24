import './TopNavigation.css'

const CATALOG_ITEMS = [
  { label: 'Customer Contacts',  page: 'cat-contacts' },
  { label: 'MFGS Sites',         page: 'cat-mfgs' },
  { label: 'Distributors',       page: 'cat-distributors' },
  { label: 'Units',              page: 'cat-units' },
  { label: 'Users',              page: 'cat-users' },
  { label: 'Root Causes',        page: 'cat-root-causes' },
  { label: 'Type Of Issues',     page: 'cat-type-issues' },
  { label: 'Products',           page: 'cat-products' },
  { label: 'Regions',            page: 'cat-regions' },
  { label: 'Activate Users',     page: 'cat-activate' },
  { label: 'Issue - Issue Detail', page: 'cat-issue-detail' },
]

const CATALOG_PAGES = CATALOG_ITEMS.map(i => i.page)

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
          <button className={`nav-item ${['claims','new-claim','details'].includes(currentPage) ? 'active' : ''}`}>
            Claim ▼
          </button>
          <div className="dropdown-menu">
            <button onClick={() => onNavigate('claims')}>All Claims</button>
            <button onClick={() => onNavigate('new-claim')}>New Claim</button>
            <button onClick={() => onNavigate('interface-module')}>Interface Module Management</button>
            <button onClick={() => onNavigate('auto-close')}>Auto Close Ticket</button>
            <button onClick={() => onNavigate('search-edit-claim')}>Search - Edit Claim</button>
            <button onClick={() => onNavigate('delete-claim')}>Delete Claim</button>
            <button onClick={() => onNavigate('change-claim-owner')}>Change Claim Owner</button>
          </div>
        </div>

        <div className="nav-dropdown">
          <button className={`nav-item ${CATALOG_PAGES.includes(currentPage) ? 'active' : ''}`}>
            Catalogs ▼
          </button>
          <div className="dropdown-menu dropdown-menu-wide">
            {CATALOG_ITEMS.map(item => (
              <button key={item.page} onClick={() => onNavigate(item.page)}
                className={currentPage === item.page ? 'active-item' : ''}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button className="nav-item">Project Identifier ▼</button>
        <button className="nav-item">Reports ▼</button>
        <button className="nav-item">Support ▼</button>
      </div>

      {/* Right: User Info and Logout */}
      <div className="nav-right">
        <span className="user-info">Welcome, {user}</span>
        <button className="logout-btn" onClick={onLogout}>LogOut</button>
      </div>
    </nav>
  )
}

export default TopNavigation
