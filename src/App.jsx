import { useState } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ClaimsPage from './pages/ClaimsPage'
import ClaimDetailsPage from './pages/ClaimDetailsPage'
import NewClaimPage from './pages/NewClaimPage'
import CatalogsProductsPage from './pages/CatalogsProductsPage'
import PlaceholderPage from './pages/PlaceholderPage'
import InterfaceModulePage from './pages/InterfaceModulePage'
import { getUserByEmail } from './data/mockData'

const PLACEHOLDER_PAGES = {
  'interface-module':    null,
  'auto-close':          { title: 'Auto Close Ticket',           section: 'Claims' },
  'search-edit-claim':   { title: 'Search - Edit Claim',         section: 'Claims' },
  'delete-claim':        { title: 'Delete Claim',                section: 'Claims' },
  'change-claim-owner':  { title: 'Change Claim Owner',          section: 'Claims' },
  'cat-contacts':        { title: 'Customer Contacts',           section: 'Catalogs' },
  'cat-mfgs':            { title: 'MFGS Sites',                  section: 'Catalogs' },
  'cat-distributors':    { title: 'Distributors',                section: 'Catalogs' },
  'cat-units':           { title: 'Units',                       section: 'Catalogs' },
  'cat-users':           { title: 'Users',                       section: 'Catalogs' },
  'cat-root-causes':     { title: 'Root Causes',                 section: 'Catalogs' },
  'cat-type-issues':     { title: 'Type Of Issues',              section: 'Catalogs' },
  'cat-regions':         { title: 'Regions',                     section: 'Catalogs' },
  'cat-activate':        { title: 'Activate Users',              section: 'Catalogs' },
  'cat-issue-detail':    { title: 'Issue - Issue Detail',        section: 'Catalogs' },
  'pi-products':         { title: 'Products',                    section: 'Project Identifier' },
  'pi-customers':        { title: 'Customers',                   section: 'Project Identifier' },
  'report-quick-query':     { title: 'Quick Query',                  section: 'Reports' },
  'report-powerbi':         { title: 'PowerBi QuickQuery Dashboard', section: 'Reports' },
  'report-cs':              { title: 'CS Report',                    section: 'Reports' },
  'report-catalog-export':  { title: 'Catalog Export',               section: 'Reports' },
}

function App() {
  // user is now { email, name, role } — resolved from MOCK_USERS on login
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('login')
  const [selectedClaimId, setSelectedClaimId] = useState(null)
  const [claimsFilter, setClaimsFilter] = useState('All')

  const handleLogin = (email) => {
    setUser(getUserByEmail(email))
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('login')
    setSelectedClaimId(null)
    setClaimsFilter('All')
  }

  const handleNavigate = (page, filter = 'All') => {
    setCurrentPage(page)
    if (page !== 'details') setSelectedClaimId(null)
    if (page === 'claims') setClaimsFilter(filter)
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
              initialFilter={claimsFilter}
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

          {currentPage === 'cat-products' && (
            <CatalogsProductsPage
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}

          {currentPage === 'interface-module' && (
            <InterfaceModulePage
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              currentPage={currentPage}
            />
          )}

          {PLACEHOLDER_PAGES[currentPage] != null && (
            <PlaceholderPage
              user={user}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              currentPage={currentPage}
              title={PLACEHOLDER_PAGES[currentPage].title}
              section={PLACEHOLDER_PAGES[currentPage].section}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default App
