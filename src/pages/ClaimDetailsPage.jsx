import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { getClaimById } from '../data/mockData'
import './ClaimDetailsPage.css'

function ClaimDetailsPage({ user, claimId, onLogout, onBackToClaims, onBackToDashboard }) {
  const [claim, setClaim] = useState(null)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    setClaim(getClaimById(claimId))
  }, [claimId])

  if (!claim) {
    return <div>Cargando...</div>
  }

  const tabs = [
    { id: 'details', label: 'Detalles' },
    { id: 'analysis', label: 'Análisis' },
    { id: 'corrective', label: 'Acción Correctiva' },
    { id: 'notification', label: 'Notificación' },
    { id: 'tasks', label: 'Tareas' },
    { id: 'dates', label: 'Fechas' },
    { id: 'comments', label: 'Comentarios' }
  ]

  return (
    <div className="claim-details-page">
      <Navigation user={user} onLogout={onLogout} />

      <div className="details-container">
        <div className="details-header">
          <div>
            <button className="back-btn" onClick={onBackToClaims}>← Volver a Reclamaciones</button>
            <h2>Detalles de Reclamación {claim.id}</h2>
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
                <DetailRow label="Tipo" value={claim.type} />
                <DetailRow label="Estado" value={claim.status} />
                <DetailRow label="Sitio" value={claim.site} />
                <DetailRow label="Producto" value={claim.product} />
                <DetailRow label="Reportado por" value={claim.reportedBy} />
                <DetailRow label="Asignado a" value={claim.assignedTo} />
                <DetailRow label="Coordinador QA" value={claim.qaCoordinator} />
                <DetailRow label="Tiempo Transcurrido" value={claim.timeElapsed} />
                <DetailRow label="RMA Número" value={claim.rmaNum} />
                <DetailRow label="Factura" value={claim.invoice} />
                <DetailRow label="Número de Envío" value={claim.shipmentNum} />
                <DetailRow label="Nota de Crédito" value={claim.creditNote} />
                <DetailRow label="Región" value={claim.region} />
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="tab-panel">
                <h3>Análisis de Reclamación</h3>
                <p>Información de análisis detallado...</p>
                <div className="form-group">
                  <label>Causas Potenciales</label>
                  <textarea placeholder="Describe las causas potenciales..." />
                </div>
                <div className="form-group">
                  <label>Impacto</label>
                  <textarea placeholder="Describe el impacto..." />
                </div>
              </div>
            )}

            {activeTab === 'corrective' && (
              <div className="tab-panel">
                <h3>Acción Correctiva</h3>
                <div className="form-group">
                  <label>Medidas Correctivas</label>
                  <textarea placeholder="Describe las medidas correctivas..." />
                </div>
                <div className="form-group">
                  <label>Responsable</label>
                  <input type="text" placeholder="Nombre del responsable" />
                </div>
                <div className="form-group">
                  <label>Fecha de Implementación</label>
                  <input type="date" />
                </div>
              </div>
            )}

            {activeTab === 'notification' && (
              <div className="tab-panel">
                <h3>Notificación al Cliente</h3>
                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea placeholder="Escribe el mensaje de notificación..." rows="6" />
                </div>
                <div className="form-group">
                  <label>Fecha de Envío</label>
                  <input type="date" />
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="tab-panel">
                <h3>Tareas Asignadas ({claim.tasks})</h3>
                <div className="tasks-list">
                  {Array.from({ length: claim.tasks }, (_, i) => (
                    <div key={i} className="task-item">
                      <input type="checkbox" />
                      <span>Tarea #{i + 1} - Descripción pendiente</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dates' && (
              <div className="tab-panel">
                <h3>Historial de Fechas</h3>
                <div className="dates-list">
                  <DateItem label="Fecha de Reporte" value="2024-06-15" />
                  <DateItem label="Fecha de Asignación" value="2024-06-16" />
                  <DateItem label="Fecha de Revisión QA" value="2024-06-18" />
                  <DateItem label="Fecha Esperada de Cierre" value="2024-06-25" />
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="tab-panel">
                <h3>Comentarios Generales</h3>
                <div className="comments-section">
                  <div className="comment">
                    <strong>Luis Rodriguez</strong>
                    <p>Estado actualizado a revisión QA</p>
                    <span className="comment-date">2024-06-18</span>
                  </div>
                  <div className="comment">
                    <strong>Maria Garcia</strong>
                    <p>Se ha completado la investigación inicial</p>
                    <span className="comment-date">2024-06-17</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="details-actions">
          <button className="btn-primary">Guardar Cambios</button>
          <button className="btn-secondary" onClick={onBackToDashboard}>Volver al Dashboard</button>
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
