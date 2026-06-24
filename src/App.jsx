import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClaimsPage from './pages/ClaimsPage'
import ClaimDetailsPage from './pages/ClaimDetailsPage'
import NewClaimPage from './pages/NewClaimPage'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login')
  const [selectedClaimId, setSelectedClaimId] = useState(null)

  const handleLogin = (username) => {
    setUser(username)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
    setSelectedClaimId(null)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
    setSelectedClaimId(null)
  }

  const handleViewClaimDetails = (claimId) => {
    setSelectedClaimId(claimId)
    setCurrentPage('details')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
    setSelectedClaimId(null)
  }

  const handleBackToClaims = () => {
    setCurrentPage('claims')
    setSelectedClaimId(null)
  }

  return (
    <div className="app">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="app-with-sidebar">
          <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

          <div className="app-content">
            {currentPage === 'dashboard' && (
              <DashboardPage
                user={user}
                onLogout={handleLogout}
                onViewClaims={() => handleNavigate('claims')}
              />
            )}

            {currentPage === 'claims' && (
              <ClaimsPage
                user={user}
                onLogout={handleLogout}
                onViewDetails={handleViewClaimDetails}
                onBackToDashboard={handleBackToDashboard}
              />
            )}

            {currentPage === 'details' && (
              <ClaimDetailsPage
                user={user}
                claimId={selectedClaimId}
                onLogout={handleLogout}
                onBackToClaims={handleBackToClaims}
                onBackToDashboard={handleBackToDashboard}
              />
            )}

            {currentPage === 'new-claim' && (
              <NewClaimPage
                user={user}
                onLogout={handleLogout}
                onBackToDashboard={handleBackToDashboard}
              />
            )}

            {currentPage === 'reports' && (
              <div className="placeholder-page">
                <h2>Reports</h2>
                <p>Coming soon...</p>
              </div>
            )}

            {currentPage === 'settings' && (
              <div className="placeholder-page">
                <h2>Settings</h2>
                <p>Coming soon...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
