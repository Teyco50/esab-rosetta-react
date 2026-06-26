import { useState } from 'react'
import './TopNavigation.css'

const CATALOG_ITEMS = [
  { label: 'Customer Contacts',    page: 'cat-contacts' },
  { label: 'MFGS Sites',           page: 'cat-mfgs' },
  { label: 'Distributors',         page: 'cat-distributors' },
  { label: 'Units',                page: 'cat-units' },
  { label: 'Users',                page: 'cat-users' },
  { label: 'Root Causes',          page: 'cat-root-causes' },
  { label: 'Type Of Issues',       page: 'cat-type-issues' },
  { label: 'Products',             page: 'cat-products' },
  { label: 'Regions',              page: 'cat-regions' },
  { label: 'Activate Users',       page: 'cat-activate' },
  { label: 'Issue - Issue Detail', page: 'cat-issue-detail' },
]

const CATALOG_PAGES = CATALOG_ITEMS.map(i => i.page)

function TopNavigation({ user, onLogout, onNavigate, currentPage }) {
  const [drawerOpen, setDrawerOpen]       = useState(false)
  const [expandedSection, setExpanded]    = useState(null)

  const navigate = (page) => {
    onNavigate(page)
    setDrawerOpen(false)
    setExpanded(null)
  }

  const toggleSection = (section) =>
    setExpanded(prev => (prev === section ? null : section))

  return (
    <>
      <nav className="top-navigation">
        {/* Hamburger — mobile only */}
        <button className="hamburger-btn" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>

        {/* Logo */}
        <div className="nav-left">
          <div className="nav-logo">E</div>
          <div className="nav-branding">
            <h1>ESAB ROSETTA</h1>
            <p>Claims Management Platform</p>
          </div>
        </div>

        {/* Desktop menu */}
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
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={currentPage === item.page ? 'active-item' : ''}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="nav-dropdown">
            <button className="nav-item">Project Identifier ▼</button>
            <div className="dropdown-menu">
              <button onClick={() => onNavigate('pi-products')}>Products</button>
              <button onClick={() => onNavigate('pi-customers')}>Customers</button>
            </div>
          </div>

          <div className="nav-dropdown">
            <button className="nav-item">Reports ▼</button>
            <div className="dropdown-menu dropdown-menu-wide">
              <button onClick={() => onNavigate('report-quick-query')}>Quick Query</button>
              <button onClick={() => onNavigate('report-powerbi')}>PowerBi QuickQuery Dashboard</button>
              <button onClick={() => onNavigate('report-cs')}>CS Report</button>
              <button onClick={() => onNavigate('report-catalog-export')}>Catalog Export</button>
            </div>
          </div>

          <button className="nav-item">Support ▼</button>
        </div>

        {/* User + logout */}
        <div className="nav-right">
          <span className="user-info">Welcome, {user.name}</span>
          <button className="logout-btn" onClick={onLogout}>LogOut</button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`drawer-overlay ${drawerOpen ? 'visible' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Mobile drawer */}
      <aside className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="nav-logo drawer-logo">E</div>
            <div>
              <div className="drawer-title">ESAB ROSETTA</div>
              <div className="drawer-sub">Claims Management</div>
            </div>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>

        <div className="drawer-user">
          <span>👤 {user.name}</span>
          <span className={`drawer-role-badge role-${user.role.toLowerCase().replace(/\s+/g, '-')}`}>
            {user.role}
          </span>
        </div>

        <nav className="drawer-nav">
          <button className="drawer-nav-item" onClick={() => navigate('dashboard')}>
            🏠 Home
          </button>

          {[
            {
              key: 'claim', icon: '📋', label: 'Claim',
              items: [
                { label: 'All Claims',                  page: 'claims' },
                { label: 'New Claim',                   page: 'new-claim' },
                { label: 'Interface Module Management', page: 'interface-module' },
                { label: 'Auto Close Ticket',           page: 'auto-close' },
                { label: 'Search - Edit Claim',         page: 'search-edit-claim' },
                { label: 'Delete Claim',                page: 'delete-claim' },
                { label: 'Change Claim Owner',          page: 'change-claim-owner' },
              ],
            },
            {
              key: 'catalogs', icon: '📚', label: 'Catalogs',
              items: CATALOG_ITEMS.map(i => ({ label: i.label, page: i.page })),
            },
            {
              key: 'pi', icon: '🏷️', label: 'Project Identifier',
              items: [
                { label: 'Products',  page: 'pi-products' },
                { label: 'Customers', page: 'pi-customers' },
              ],
            },
            {
              key: 'reports', icon: '📊', label: 'Reports',
              items: [
                { label: 'Quick Query',                 page: 'report-quick-query' },
                { label: 'PowerBi QuickQuery Dashboard',page: 'report-powerbi' },
                { label: 'CS Report',                   page: 'report-cs' },
                { label: 'Catalog Export',              page: 'report-catalog-export' },
              ],
            },
            {
              key: 'support', icon: '🛠️', label: 'Support',
              items: [],
            },
          ].map(section => (
            <div key={section.key} className="drawer-section">
              <button
                className="drawer-section-header"
                onClick={() => toggleSection(section.key)}
              >
                <span>{section.icon} {section.label}</span>
                {section.items.length > 0 && (
                  <span className={`drawer-chevron ${expandedSection === section.key ? 'open' : ''}`}>▼</span>
                )}
              </button>
              {expandedSection === section.key && section.items.length > 0 && (
                <div className="drawer-section-items">
                  {section.items.map(item => (
                    <button key={item.page} onClick={() => navigate(item.page)}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="drawer-footer">
          <button className="drawer-logout" onClick={onLogout}>LogOut</button>
        </div>
      </aside>
    </>
  )
}

export default TopNavigation
