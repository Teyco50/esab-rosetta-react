import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ currentPage, onNavigate }) {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'claims', label: '📋 All Claims', icon: '📋' },
    { id: 'new-claim', label: '➕ New Claim', icon: '➕' },
    { id: 'reports', label: '📈 Reports', icon: '📈' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ]

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">E</div>
          {isOpen && <h3>ESAB</h3>}
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => {
                onNavigate(item.id)
              }}
              title={item.label}
            >
              <span className="menu-icon">{item.icon}</span>
              {isOpen && <span className="menu-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {isOpen && (
          <div className="sidebar-footer">
            <p className="version">v1.0.0</p>
            <p className="copyright">© 2024 ESAB</p>
          </div>
        )}
      </aside>
    </>
  )
}

export default Sidebar
