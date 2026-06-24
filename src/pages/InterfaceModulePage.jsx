import { useState, useMemo } from 'react'
import TopNavigation from '../components/TopNavigation'
import './InterfaceModulePage.css'

const SOURCES = ['All', 'SAP NA', 'LATAM', 'INSOFT', 'CRM']

const INITIAL_INTERFACES = [
  { id: 1,  name: 'Customer Master Sync',      source: 'SAP NA',  status: 'Healthy',  lastRun: '2026-06-24 08:42', records: 1240, errors: 0,  latency: 1.2 },
  { id: 2,  name: 'Sales Order Import',         source: 'SAP NA',  status: 'Warning',  lastRun: '2026-06-24 07:15', records: 856,  errors: 14, latency: 4.8 },
  { id: 3,  name: 'Inventory Levels Feed',      source: 'SAP NA',  status: 'Healthy',  lastRun: '2026-06-24 09:01', records: 3102, errors: 0,  latency: 0.9 },
  { id: 4,  name: 'Claims Data Export',         source: 'LATAM',   status: 'Failed',   lastRun: '2026-06-24 06:30', records: 0,    errors: 89, latency: 0   },
  { id: 5,  name: 'Product Catalog Sync',       source: 'LATAM',   status: 'Healthy',  lastRun: '2026-06-24 08:55', records: 440,  errors: 0,  latency: 2.1 },
  { id: 6,  name: 'Distributor Network Feed',   source: 'LATAM',   status: 'Healthy',  lastRun: '2026-06-24 08:10', records: 210,  errors: 0,  latency: 1.7 },
  { id: 7,  name: 'Work Order Integration',     source: 'INSOFT',  status: 'Healthy',  lastRun: '2026-06-24 09:05', records: 678,  errors: 0,  latency: 1.4 },
  { id: 8,  name: 'Service Ticket Sync',        source: 'INSOFT',  status: 'Healthy',  lastRun: '2026-06-24 08:48', records: 312,  errors: 0,  latency: 1.1 },
  { id: 9,  name: 'Parts Availability Feed',    source: 'INSOFT',  status: 'Healthy',  lastRun: '2026-06-24 07:59', records: 1890, errors: 0,  latency: 0.8 },
  { id: 10, name: 'Lead & Opportunity Import',  source: 'CRM',     status: 'Failed',   lastRun: '2026-06-24 05:45', records: 0,    errors: 56, latency: 0   },
  { id: 11, name: 'Customer Contact Sync',      source: 'CRM',     status: 'Healthy',  lastRun: '2026-06-24 08:33', records: 980,  errors: 0,  latency: 2.3 },
  { id: 12, name: 'Account Master Update',      source: 'CRM',     status: 'Healthy',  lastRun: '2026-06-24 09:10', records: 542,  errors: 0,  latency: 1.6 },
]

const INITIAL_LOGS = [
  { time: '09:10', source: 'CRM',    name: 'Account Master Update',    event: 'Sync completed',           type: 'success' },
  { time: '09:05', source: 'INSOFT', name: 'Work Order Integration',   event: 'Sync completed',           type: 'success' },
  { time: '09:01', source: 'SAP NA', name: 'Inventory Levels Feed',    event: 'Sync completed',           type: 'success' },
  { time: '08:55', source: 'LATAM',  name: 'Product Catalog Sync',     event: 'Sync completed',           type: 'success' },
  { time: '08:48', source: 'INSOFT', name: 'Service Ticket Sync',      event: 'Sync completed',           type: 'success' },
  { time: '08:42', source: 'SAP NA', name: 'Customer Master Sync',     event: 'Sync completed',           type: 'success' },
  { time: '08:33', source: 'CRM',    name: 'Customer Contact Sync',    event: 'Sync completed',           type: 'success' },
  { time: '08:10', source: 'LATAM',  name: 'Distributor Network Feed', event: 'Sync completed',           type: 'success' },
  { time: '07:59', source: 'INSOFT', name: 'Parts Availability Feed',  event: 'Sync completed',           type: 'success' },
  { time: '07:15', source: 'SAP NA', name: 'Sales Order Import',       event: '14 records failed validation', type: 'warning' },
  { time: '06:30', source: 'LATAM',  name: 'Claims Data Export',       event: 'Connection timeout — retry needed', type: 'error' },
  { time: '05:45', source: 'CRM',    name: 'Lead & Opportunity Import','event': 'Auth token expired',     type: 'error' },
]

const STATUS_COLOR = { Healthy: '#16a34a', Warning: '#d97706', Failed: '#dc2626', Idle: '#6b7280' }
const STATUS_BG    = { Healthy: '#dcfce7', Warning: '#fef3c7', Failed: '#fee2e2', Idle: '#f3f4f6' }

export default function InterfaceModulePage({ user, onLogout, onNavigate, currentPage }) {
  const today = new Date().toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' })
  const [date, setDate]         = useState(today)
  const [source, setSource]     = useState('All')
  const [applied, setApplied]   = useState({ date: today, source: 'All' })
  const [interfaces, setInterfaces] = useState(INITIAL_INTERFACES)
  const [logs, setLogs]         = useState(INITIAL_LOGS)
  const [retrying, setRetrying] = useState(null)

  const filtered = useMemo(() => interfaces.filter(i =>
    applied.source === 'All' || i.source === applied.source
  ), [interfaces, applied])

  const kpi = useMemo(() => {
    const total   = filtered.length
    const healthy = filtered.filter(i => i.status === 'Healthy').length
    const failed  = filtered.filter(i => i.status === 'Failed').length
    const warning = filtered.filter(i => i.status === 'Warning').length
    const totalRec = filtered.reduce((s, i) => s + i.records, 0)
    const totalErr = filtered.reduce((s, i) => s + i.errors, 0)
    const successRate = totalRec + totalErr > 0
      ? ((totalRec / (totalRec + totalErr)) * 100).toFixed(1)
      : '100.0'
    const latencies = filtered.filter(i => i.latency > 0).map(i => i.latency)
    const avgLatency = latencies.length
      ? (latencies.reduce((s, v) => s + v, 0) / latencies.length).toFixed(1)
      : '—'
    return { total, healthy, failed, warning, successRate, avgLatency }
  }, [filtered])

  const issues = filtered.filter(i => i.status === 'Failed' || i.status === 'Warning')

  const handleSearch = () => setApplied({ date, source })

  const handleRetry = (iface) => {
    setRetrying(iface.id)
    const ts = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    setTimeout(() => {
      setInterfaces(prev => prev.map(i =>
        i.id === iface.id
          ? { ...i, status: 'Healthy', errors: 0, records: Math.floor(Math.random() * 500) + 100, latency: +(Math.random() * 2 + 0.8).toFixed(1), lastRun: `2026-06-24 ${ts}` }
          : i
      ))
      setLogs(prev => [
        { time: ts, source: iface.source, name: iface.name, event: 'Manual retry — sync completed', type: 'success' },
        ...prev,
      ])
      setRetrying(null)
    }, 2000)
  }

  const handleSkip = (iface) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    setInterfaces(prev => prev.map(i =>
      i.id === iface.id ? { ...i, status: 'Idle' } : i
    ))
    setLogs(prev => [
      { time: ts, source: iface.source, name: iface.name, event: 'Skipped by operator', type: 'warning' },
      ...prev,
    ])
  }

  return (
    <div className="im-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="im-container">
        {/* Header */}
        <div className="im-header">
          <div>
            <h1>Interface Module Management</h1>
            <p>Real-time operational health and remediation for data load interfaces</p>
          </div>
          <div className="im-last-updated">Last updated: 2026-06-24 09:10</div>
        </div>

        {/* KPI Cards */}
        <div className="im-kpi-grid">
          <div className="im-kpi-card">
            <div className="im-kpi-icon">🔌</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Total Interfaces</div>
              <div className="im-kpi-value">{kpi.total}</div>
            </div>
          </div>
          <div className="im-kpi-card healthy">
            <div className="im-kpi-icon">✅</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Healthy</div>
              <div className="im-kpi-value">{kpi.healthy}</div>
            </div>
          </div>
          <div className="im-kpi-card failed">
            <div className="im-kpi-icon">❌</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Failed</div>
              <div className="im-kpi-value">{kpi.failed}</div>
            </div>
          </div>
          <div className="im-kpi-card warning">
            <div className="im-kpi-icon">⚠️</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Warning</div>
              <div className="im-kpi-value">{kpi.warning}</div>
            </div>
          </div>
          <div className="im-kpi-card rate">
            <div className="im-kpi-icon">📊</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Success Rate</div>
              <div className="im-kpi-value">{kpi.successRate}%</div>
            </div>
          </div>
          <div className="im-kpi-card latency">
            <div className="im-kpi-icon">⏱️</div>
            <div className="im-kpi-body">
              <div className="im-kpi-label">Avg Latency</div>
              <div className="im-kpi-value">{kpi.avgLatency}s</div>
            </div>
          </div>
        </div>

        {/* Main content: table + remediation */}
        <div className="im-main-grid">

          {/* Left: Interface Status Table */}
          <div className="im-card im-table-card">
            {/* Filter bar */}
            <div className="im-filter-bar">
              <div className="im-filter-group">
                <label>Date:</label>
                <input type="text" value={date} onChange={e => setDate(e.target.value)} className="im-input" />
              </div>
              <div className="im-filter-group">
                <label>Source:</label>
                <select value={source} onChange={e => setSource(e.target.value)} className="im-input">
                  {SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="im-search-btn" onClick={handleSearch}>Search</button>
            </div>

            <div className="im-table-wrap">
              <table className="im-table">
                <thead>
                  <tr>
                    <th>Interface</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Last Run</th>
                    <th>Records</th>
                    <th>Errors</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr key={i.id}>
                      <td className="im-iface-name">{i.name}</td>
                      <td><span className="im-source-badge">{i.source}</span></td>
                      <td>
                        <span className="im-status-badge"
                          style={{ color: STATUS_COLOR[i.status], background: STATUS_BG[i.status] }}>
                          {i.status}
                        </span>
                      </td>
                      <td className="im-mono">{i.lastRun.split(' ')[1]}</td>
                      <td className="im-num">{i.records.toLocaleString()}</td>
                      <td className="im-num" style={{ color: i.errors > 0 ? '#dc2626' : '#6b7280' }}>
                        {i.errors > 0 ? i.errors : '—'}
                      </td>
                      <td className="im-num" style={{ color: i.latency > 3 ? '#d97706' : '#374151' }}>
                        {i.latency > 0 ? `${i.latency}s` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="im-table-footer">{filtered.length} interfaces · {filtered.reduce((s,i)=>s+i.records,0).toLocaleString()} records processed today</div>
          </div>

          {/* Right column: Remediation + Activity Log */}
          <div className="im-right-col">

            {/* Remediation Panel */}
            <div className="im-card im-remediation-card">
              <div className="im-card-header">
                <h3>🛠 Remediation</h3>
                <span className="im-issues-badge">{issues.length} issue{issues.length !== 1 ? 's' : ''}</span>
              </div>
              {issues.length === 0 ? (
                <div className="im-all-clear">✅ All interfaces are healthy</div>
              ) : (
                <div className="im-issues-list">
                  {issues.map(i => (
                    <div key={i.id} className={`im-issue-row ${i.status.toLowerCase()}`}>
                      <div className="im-issue-info">
                        <span className="im-issue-name">{i.name}</span>
                        <span className="im-issue-meta">{i.source} · {i.errors} errors · last run {i.lastRun.split(' ')[1]}</span>
                      </div>
                      <div className="im-issue-actions">
                        <button
                          className="im-btn-retry"
                          onClick={() => handleRetry(i)}
                          disabled={retrying === i.id}
                        >
                          {retrying === i.id ? '↻ …' : '↻ Retry'}
                        </button>
                        <button className="im-btn-skip" onClick={() => handleSkip(i)}>Skip</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Log */}
            <div className="im-card im-log-card">
              <div className="im-card-header">
                <h3>📋 Activity Log</h3>
                <span className="im-log-date">Today</span>
              </div>
              <div className="im-log-list">
                {logs.slice(0, 12).map((l, idx) => (
                  <div key={idx} className={`im-log-row im-log-${l.type}`}>
                    <span className="im-log-time">{l.time}</span>
                    <span className="im-log-dot" />
                    <div className="im-log-text">
                      <span className="im-log-name">{l.name}</span>
                      <span className="im-log-event">{l.event}</span>
                    </div>
                    <span className="im-log-source">{l.source}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
