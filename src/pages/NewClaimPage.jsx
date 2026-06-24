import { useState } from 'react'
import Navigation from '../components/Navigation'
import './NewClaimPage.css'

function NewClaimPage({ user, onLogout, onBackToDashboard }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    claimType: '',
    product: '',
    site: '',
    reportedBy: '',
    description: '',
    invoice: '',
    shipmentNum: '',
    priority: 'Medium',
    attachments: []
  })

  const claimTypes = [
    'Material Defect',
    'Product Quality',
    'Delivery Issue',
    'Technical Support',
    'Other'
  ]

  const products = [
    'Cutting System',
    'Electrode Wire',
    'Welding System',
    'Control Panel',
    'Filler Metal',
    'Gas System',
    'Consumables',
    'Power Supply'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log('New Claim Submitted:', formData)
    alert('Claim created successfully!')
    onBackToDashboard()
  }

  return (
    <div className="new-claim-page">
      <Navigation user={user} onLogout={onLogout} />

      <div className="new-claim-container">
        <div className="new-claim-header">
          <button className="back-btn" onClick={onBackToDashboard}>← Back to Dashboard</button>
          <h2>Create New Claim</h2>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
              onClick={() => s <= step && setStep(s)}
            >
              <div className="step-number">{s}</div>
              <div className="step-label">
                {s === 1 && 'Basic Info'}
                {s === 2 && 'Details'}
                {s === 3 && 'Review'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="form-step">
            <h3>Basic Information</h3>

            <div className="form-group">
              <label>Claim Type *</label>
              <select
                name="claimType"
                value={formData.claimType}
                onChange={handleChange}
                required
              >
                <option value="">Select claim type...</option>
                {claimTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Product *</label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
              >
                <option value="">Select product...</option>
                {products.map(prod => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Site/Location *</label>
              <input
                type="text"
                name="site"
                value={formData.site}
                onChange={handleChange}
                placeholder="Enter site location"
                required
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="form-step">
            <h3>Claim Details</h3>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                rows="6"
                required
              />
            </div>

            <div className="form-group">
              <label>Reported By *</label>
              <input
                type="text"
                name="reportedBy"
                value={formData.reportedBy}
                onChange={handleChange}
                placeholder="Enter name or contact"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number</label>
                <input
                  type="text"
                  name="invoice"
                  value={formData.invoice}
                  onChange={handleChange}
                  placeholder="INV-XXXX"
                />
              </div>

              <div className="form-group">
                <label>Shipment Number</label>
                <input
                  type="text"
                  name="shipmentNum"
                  value={formData.shipmentNum}
                  onChange={handleChange}
                  placeholder="SHIP-XXXX"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="form-step">
            <h3>Review Your Claim</h3>

            <div className="review-section">
              <div className="review-row">
                <span className="review-label">Claim Type:</span>
                <span className="review-value">{formData.claimType || 'Not specified'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Product:</span>
                <span className="review-value">{formData.product || 'Not specified'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Site:</span>
                <span className="review-value">{formData.site || 'Not specified'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Priority:</span>
                <span className={`review-value priority-${formData.priority.toLowerCase()}`}>
                  {formData.priority}
                </span>
              </div>
              <div className="review-row full">
                <span className="review-label">Description:</span>
                <span className="review-value">{formData.description || 'Not specified'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Reported By:</span>
                <span className="review-value">{formData.reportedBy || 'Not specified'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Invoice:</span>
                <span className="review-value">{formData.invoice || 'N/A'}</span>
              </div>
              <div className="review-row">
                <span className="review-label">Shipment:</span>
                <span className="review-value">{formData.shipmentNum || 'N/A'}</span>
              </div>
            </div>

            <div className="review-note">
              <p>⚠️ Please review all information before submitting. You can edit it after creation.</p>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            className="btn-secondary"
            onClick={step > 1 ? handleBack : onBackToDashboard}
          >
            {step > 1 ? '← Back' : 'Cancel'}
          </button>

          {step < 3 && (
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.claimType || !formData.product || !formData.site)) ||
                (step === 2 && (!formData.description || !formData.reportedBy))
              }
            >
              Next →
            </button>
          )}

          {step === 3 && (
            <button className="btn-primary btn-submit" onClick={handleSubmit}>
              ✓ Create Claim
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewClaimPage
