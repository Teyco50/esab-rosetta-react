import { useState } from 'react'
import TopNavigation from '../components/TopNavigation'
import './NewClaimPage.css'

function NewClaimPage({ user, onLogout, onBackToDashboard, onNavigate }) {
  const [activeTab, setActiveTab] = useState('ticket-details')
  const [formData, setFormData] = useState({
    complaintNumber: 'Auto-generated',
    urgencyLevel: 'Select a Level',
    status: 'Draft',
    created: new Date().toLocaleString(),
    ginPartNumber: '',
    description: '',
    complaintOwner: 'Administrator',
    assignedTo: '',
    qaCoordinator: '',
    typeOfIssue: 'ESAB Product Quality Issue',
    requestRMA: 'No',
    customerRequiresCabBd: 'No',
    dateOfSale: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const tabs = [
    { id: 'ticket-details', label: 'TICKET DETAILS' },
    { id: 'analysis', label: 'ANALYSIS' },
    { id: 'corrective-action', label: 'CORRECTIVE ACTION' },
    { id: 'customer-notification', label: 'CUSTOMER NOTIFICATION' },
    { id: 'assigned-tasks', label: 'ASSIGNED TASKS' },
    { id: 'dates-history', label: 'DATES & HISTORY' },
    { id: 'general-comments', label: 'GENERAL COMMENTS' }
  ]

  return (
    <div className="new-claim-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage="new-claim" />

      <div className="new-claim-content">
        {/* Header */}
        <div className="claim-header">
          <button className="back-btn" onClick={onBackToDashboard}>← Back to Dashboard</button>
          <div className="header-title-section">
            <h1>New Claim - Product Quality Issue</h1>
            <button className="download-pdf-btn">Download PDF</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-section">
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
            {activeTab === 'ticket-details' && (
              <div className="ticket-details-content">
                {/* Left Column */}
                <div className="form-column-left">
                  {/* Required Information Section */}
                  <div className="form-section">
                    <div className="section-header red-header">⚠ REQUIRED INFORMATION</div>

                    <div className="form-group">
                      <label>COMPLAINT NUMBER:</label>
                      <div className="read-only-field">Auto-generated</div>
                    </div>

                    <div className="form-group">
                      <label>URGENCY LEVEL:</label>
                      <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleInputChange} className="form-select">
                        <option>Select a Level</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>STATUS:</label>
                      <select name="status" value={formData.status} onChange={handleInputChange} className="form-select">
                        <option>Draft</option>
                        <option>Submitted</option>
                        <option>In Review</option>
                        <option>Closed</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>CREATED:</label>
                      <div className="read-only-field">{formData.created}</div>
                    </div>
                  </div>

                  {/* GIN / Part Number Section */}
                  <div className="form-section">
                    <div className="section-header red-header">⚠ GIN / PART NUMBER</div>

                    <div className="form-group">
                      <label>GIN / PART NUMBER:</label>
                      <input
                        type="text"
                        name="ginPartNumber"
                        value={formData.ginPartNumber}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter GIN or Part Number"
                      />
                    </div>

                    <div className="form-group">
                      <label>DESCRIPTION:</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-textarea"
                        placeholder="Enter description"
                        rows="4"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="form-column-right">
                  <div className="form-section">
                    <div className="section-header gray-header">📋 REQUESTED INFORMATION</div>

                    <div className="form-group">
                      <label>Complaint Owner:</label>
                      <div className="read-only-field">{formData.complaintOwner}</div>
                    </div>

                    <div className="form-group">
                      <label>Assigned To:</label>
                      <input
                        type="text"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Select assignee"
                      />
                    </div>

                    <div className="form-group">
                      <label>QA Coordinator:</label>
                      <input
                        type="text"
                        name="qaCoordinator"
                        value={formData.qaCoordinator}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Select QA Coordinator"
                      />
                    </div>

                    <div className="form-group">
                      <label>Type of Issue:</label>
                      <select name="typeOfIssue" value={formData.typeOfIssue} onChange={handleInputChange} className="form-select">
                        <option>ESAB Product Quality Issue</option>
                        <option>Non-Product Quality Issue</option>
                        <option>Customer Suggestion</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Request RMA:</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="requestRMA"
                            value="Yes"
                            checked={formData.requestRMA === 'Yes'}
                            onChange={handleInputChange}
                          />
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="requestRMA"
                            value="No"
                            checked={formData.requestRMA === 'No'}
                            onChange={handleInputChange}
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Customer Requires CAB/BD:</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="customerRequiresCabBd"
                            value="Yes"
                            checked={formData.customerRequiresCabBd === 'Yes'}
                            onChange={handleInputChange}
                          />
                          Yes
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="customerRequiresCabBd"
                            value="No"
                            checked={formData.customerRequiresCabBd === 'No'}
                            onChange={handleInputChange}
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Date of Sale:</label>
                      <input
                        type="date"
                        name="dateOfSale"
                        value={formData.dateOfSale}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs content */}
            {activeTab !== 'ticket-details' && (
              <div className="tab-placeholder">
                <p>{tabs.find(t => t.id === activeTab)?.label} - Content coming soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-save">Save</button>
          <button className="btn-cancel" onClick={onBackToDashboard}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default NewClaimPage
