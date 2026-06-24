import TopNavigation from '../components/TopNavigation'
import './PlaceholderPage.css'

export default function PlaceholderPage({ user, onLogout, onNavigate, currentPage, title, section }) {
  return (
    <div className="placeholder-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />
      <div className="placeholder-container">
        <div className="placeholder-card">
          <div className="placeholder-icon">🔧</div>
          <p className="placeholder-section">{section}</p>
          <h1 className="placeholder-title">{title}</h1>
          <p className="placeholder-msg">This section is under construction and will be available soon.</p>
          <button className="placeholder-back-btn" onClick={() => onNavigate('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
