import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { mockClaims, getClaimsByUser } from '../data/mockData'
import './ClaimsPage.css'

function ClaimsPage({ user, onLogout, onViewDetails, onBackToDashboard }) {
  const [claims, setClaims] = useState([])
  const [filteredClaims, setFilteredClaims] = useState([])
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    const userClaims = getClaimsByUser(user)
    setClaims(userClaims)
    setFilteredClaims(userClaims)
  }, [user])

  useEffect(() => {
    if (statusFilter === 'All') {
      setFilteredClaims(claims)
    } else {
      setFilteredClaims(claims.filter(c => c.status === statusFilter))
    }
  }, [statusFilter, claims])

  return (
    <div className="claims-page">
      <Navigation user={user} onLogout={onLogout} />

      <div className="claims-container">
        <div className="claims-header">
          <div>
            <button className="back-btn" onClick={onBackToDashboard}>← Back to Dashboard</button>
            <h2>All Claims 📋</h2>
          </div>

          <div className="filter-section">
            <button
              className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              All ({claims.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'Open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Open')}
            >
              Open
            </button>
            <button
              className={`filter-btn ${statusFilter === 'Closed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Closed')}
            >
              Closed
            </button>
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
                <th>Product</th>
                <th>Assigned To</th>
                <th>Time Elapsed</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map(claim => (
                <tr key={claim.id} className={`status-${claim.status.toLowerCase()}`}>
                  <td><strong>{claim.id}</strong></td>
                  <td>{claim.type}</td>
                  <td>
                    <span className={`status-badge status-${claim.status.toLowerCase()}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{claim.site}</td>
                  <td>{claim.product}</td>
                  <td>{claim.assignedTo}</td>
                  <td>{claim.timeElapsed}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => onViewDetails(claim.id)}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="claims-footer">
          <p>Total: {filteredClaims.length} claims</p>
        </div>
      </div>
    </div>
  )
}

export default ClaimsPage
