import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClaimsPage from './pages/ClaimsPage'
import ClaimDetailsPage from './pages/ClaimDetailsPage'

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

  const handleViewClaims = () => {
    setCurrentPage('claims')
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
      ) : currentPage === 'dashboard' ? (
        <DashboardPage
          user={user}
          onLogout={handleLogout}
          onViewClaims={handleViewClaims}
        />
      ) : currentPage === 'claims' ? (
        <ClaimsPage
          user={user}
          onLogout={handleLogout}
          onViewDetails={handleViewClaimDetails}
          onBackToDashboard={handleBackToDashboard}
        />
      ) : (
        <ClaimDetailsPage
          user={user}
          claimId={selectedClaimId}
          onLogout={handleLogout}
          onBackToClaims={handleBackToClaims}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
    </div>
  )
}

export default App
