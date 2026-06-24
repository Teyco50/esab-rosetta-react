import { useState, useEffect } from 'react'
import TopNavigation from '../components/TopNavigation'
import { getClaimById } from '../data/mockData'
import './ClaimDetailsPage.css'

function ClaimDetailsPage({ user, claimId, onLogout, onBackToClaims, onBackToDashboard, onNavigate, currentPage }) {
  const [claim, setClaim] = useState(null)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    setClaim(getClaimById(claimId))
  }, [claimId])

  if (!claim) {
    return <div>Loading...</div>
  }

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'corrective', label: 'Corrective Action' },
    { id: 'notification', label: 'Notification' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'dates', label: 'Dates & History' },
    { id: 'comments', label: 'Comments' }
  ]

  return (
    <div className="claim-details-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="details-container">
        <div className="details-header">
          <div>
            <button className="back-btn" onClick={onBackToClaims}>← Back to Claims</button>
            <h2>Claim Details {claim.id}</h2>
          </div>
          <span className={`status-badge status-${claim.status.toLowerCase()}`}>
            {claim.status}
          </span>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'details' && (
              <div className="details-grid">
                <DetailRow label="ID" value={claim.id} />
                <DetailRow label="Type" value={claim.type} />
                <DetailRow label="Status" value={claim.status} />
                <DetailRow label="Site" value={claim.site} />
                <DetailRow label="Product" value={claim.product} />
                <DetailRow label="Reported By" value={claim.reportedBy} />
                <DetailRow label="Assigned To" value={claim.assignedTo} />
                <DetailRow label="QA Coordinator" value={claim.qaCoordinator} />
                <DetailRow label="Time Elapsed" value={claim.timeElapsed} />
                <DetailRow label="RMA Number" value={claim.rmaNum} />
                <DetailRow label="Invoice" value={claim.invoice} />
                <DetailRow label="Shipment Number" value={claim.shipmentNum} />
                <DetailRow label="Credit Note" value={claim.creditNote} />
                <DetailRow label="Region" value={claim.region} />
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="tab-panel">
                <h3>Claim Analysis</h3>
                <p>Detailed analysis information...</p>
                <div className="form-group">
                  <label>Root Causes</label>
                  <textarea placeholder="Describe the root causes..." />
                </div>
                <div className="form-group">
                  <label>Impact</label>
                  <textarea placeholder="Describe the impact..." />
                </div>
              </div>
            )}

            {activeTab === 'corrective' && (
              <div className="tab-panel">
                <h3>Corrective Action</h3>
                <div className="form-group">
                  <label>Corrective Measures</label>
                  <textarea placeholder="Describe the corrective measures..." />
                </div>
                <div className="form-group">
                  <label>Responsible Party</label>
                  <input type="text" placeholder="Enter responsible person" />
                </div>
                <div className="form-group">
                  <label>Implementation Date</label>
                  <input type="date" />
                </div>
              </div>
            )}

            {activeTab === 'notification' && (
              <div className="tab-panel">
                <h3>Customer Notification</h3>
                <div className="form-group">
                  <label>Message</label>
                  <textarea placeholder="Write the notification message..." rows="6" />
                </div>
                <div className="form-group">
                  <label>Send Date</label>
                  <input type="date" />
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tab-panel">
                <h3>Assigned Tasks ({claim.tasks})</h3>
                <div className="tasks-list">
                  {Array.from({ length: claim.tasks }, (_, i) => (
                    <div key={i} className="task-item">
                      <input type="checkbox" />
                      <span>Task #{i + 1} - Pending description</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="tab-panel">
                <h3>Dates & History</h3>
                <div className="dates-list">
                  <DateItem label="Report Date" value="2024-06-15" />
                  <DateItem label="Assignment Date" value="2024-06-16" />
                  <DateItem label="QA Review Date" value="2024-06-18" />
                  <DateItem label="Expected Close Date" value="2024-06-25" />
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="tab-panel">
                <h3>General Comments</h3>
                <div className="comments-section">
                  <div className="comment">
                    <strong>Luis Rodriguez</strong>
                    <p>Status updated to QA review</p>
                    <span className="comment-date">2024-06-18</span>
                  </div>
                  <div className="comment">
                    <strong>Maria Garcia</strong>
                    <p>Initial investigation completed</p>
                    <span className="comment-date">2024-06-17</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="details-actions">
          <button className="btn-primary">✓ Save Changes</button>
          <button className="btn-secondary" onClick={onBackToDashboard}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  )
}

function DateItem({ label, value }) {
  return (
    <div className="date-item">
      <span className="date-label">{label}</span>
      <span className="date-value">{value}</span>
    </div>
  )
}

export default ClaimDetailsPage
