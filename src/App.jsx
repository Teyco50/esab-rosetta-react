import { useState } from 'react'
import './App.css'
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
    if (page !== 'details') setSelectedClaimId(null)
  }

  const handleViewClaimDetails = (claimId) => {
    setSelectedClaimId(claimId)
    setCurrentPage('details')
  }

  return (
    <div className="app">
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div className="app-main">
          {currentPage === 'dashboard' && (
            <DashboardPage
              user={user}
              onLogout={handleLogout}
              onViewClaims={() => handleNavigate('claims')}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}

          {currentPage === 'claims' && (
            <ClaimsPage
              user={user}
              onLogout={handleLogout}
              onViewDetails={handleViewClaimDetails}
              onBackToDashboard={() => handleNavigate('dashboard')}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}

          {currentPage === 'details' && (
            <ClaimDetailsPage
              user={user}
              claimId={selectedClaimId}
              onLogout={handleLogout}
              onBackToClaims={() => handleNavigate('claims')}
              onBackToDashboard={() => handleNavigate('dashboard')}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}

          {currentPage === 'new-claim' && (
            <NewClaimPage
              user={user}
              onLogout={handleLogout}
              onBackToDashboard={() => handleNavigate('dashboard')}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
