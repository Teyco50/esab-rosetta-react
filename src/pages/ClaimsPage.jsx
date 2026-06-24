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
            <button className="back-btn" onClick={onBackToDashboard}>← Volver al Dashboard</button>
            <h2>Todas las Reclamaciones</h2>
          </div>

          <div className="filter-section">
            <button
              className={`filter-btn ${statusFilter === 'All' ? 'active' : ''}`}
              onClick={() => setStatusFilter('All')}
            >
              Todas ({claims.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === 'Open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Open')}
            >
              Abiertas
            </button>
            <button
              className={`filter-btn ${statusFilter === 'Closed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Closed')}
            >
              Cerradas
            </button>
          </div>
        </div>

        <div className="claims-table-wrapper">
          <table className="claims-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Sitio</th>
                <th>Producto</th>
                <th>Asignado a</th>
                <th>Tiempo</th>
                <th>Acción</th>
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
                      Ver →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="claims-footer">
          <p>Total: {filteredClaims.length} reclamaciones</p>
        </div>
      </div>
    </div>
  )
}

export default ClaimsPage
