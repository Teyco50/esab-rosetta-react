import { useState, useEffect } from 'react'
import TopNavigation from '../components/TopNavigation'
import { getClaimsByUser } from '../data/mockData'
import './ClaimsPage.css'

const STATUS_OPTIONS = ['All', 'Open', 'Closed', 'Pending', 'On Hold', 'Analysis', 'Corrective Action']

function ClaimsPage({ user, onLogout, onViewDetails, onBackToDashboard, onNavigate, currentPage, initialFilter = 'All' }) {
  const [allClaims, setAllClaims]         = useState([])
  const [filteredClaims, setFilteredClaims] = useState([])
  const [statusFilter, setStatusFilter]   = useState(initialFilter)

  useEffect(() => {
    const uc = getClaimsByUser(user)
    setAllClaims(uc)
    setFilteredClaims(uc)
  }, [user])

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredClaims(allClaims)
    } else {
      setFilteredClaims(allClaims.filter(c => c.status === statusFilter))
    }
  }, [statusFilter, allClaims])

  // Update filter if initialFilter changes (cross-page navigation)
  useEffect(() => {
    setStatusFilter(initialFilter)
  }, [initialFilter])

  return (
    <div className="claims-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="claims-container">
        <div className="claims-header">
          <div>
            <button className="back-btn" onClick={onBackToDashboard}>← Back to Dashboard</button>
            <div className="claims-title-row">
              <h2>Claims 📋</h2>
              <span className="claims-count-badge">{allClaims.length} total</span>
            </div>
          </div>

          <div className="filter-section">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
                {s !== 'All' && (
                  <span className="filter-count">
                    {allClaims.filter(c => c.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="claims-table-wrapper">
          <table className="claims-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Site</th>
                <th>Region</th>
                <th>Product</th>
                <th>Assigned To</th>
                <th>QA Coordinator</th>
                <th>Time Elapsed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan="10" className="no-claims">No claims found for this filter.</td>
                </tr>
              ) : filteredClaims.map(claim => (
                <tr key={claim.id}>
                  <td><strong>{claim.id}</strong></td>
                  <td>{claim.type}</td>
                  <td>
                    <span className={`status-badge status-${claim.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{claim.site}</td>
                  <td>{claim.region}</td>
                  <td>{claim.product}</td>
                  <td>{claim.assignedTo}</td>
                  <td>{claim.qaCoordinator}</td>
                  <td className="time-elapsed">{claim.timeElapsed}</td>
                  <td>
                    <button className="view-btn" onClick={() => onViewDetails(claim.id)}>
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="claims-footer">
          <p>Showing {filteredClaims.length} of {allClaims.length} claims</p>
        </div>
      </div>
    </div>
  )
}

export default ClaimsPage
