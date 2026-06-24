import { useState, useMemo } from 'react'
import TopNavigation from '../components/TopNavigation'
import './InterfaceModulePage.css'

const SOURCE_COLOR = {
  'SAP NA': { bg: '#dbeafe', text: '#1d4ed8', border: '#2563eb' },
  'LATAM':  { bg: '#fce7f3', text: '#be185d', border: '#ec4899' },
  'INSOFT': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
  'CRM':    { bg: '#ede9fe', text: '#5b21b6', border: '#7c3aed' },
}

const STATUS_META = {
  Healthy: { color: '#16a34a', bg: '#dcfce7', icon: '✅' },
  Warning: { color: '#d97706', bg: '#fef3c7', icon: '⚠️' },
  Failed:  { color: '#dc2626', bg: '#fee2e2', icon: '❌' },
  Idle:    { color: '#6b7280', bg: '#f3f4f6', icon: '⏸' },
}

const ERROR_REASONS = [
  'Part Number does not exist in catalog',
  'Distributor not found in system',
  'Error code not recognized',
  'Format error / missing required field',
  'Missing data — claim incomplete',
]

const INITIAL_INTERFACES = [
  { id: 1, name: 'Import Claims Interface', source: 'SAP NA', status: 'Healthy', lastRun: '2026-06-24 09:42', imported: 1240, errored: 0,  nextRun: '2026-06-24 10:42', schedule: 'Every 1 hr'  },
  { id: 2, name: 'Import Claims Interface', source: 'LATAM',  status: 'Failed',  lastRun: '2026-06-24 06:30', imported: 0,    errored: 89, nextRun: 'Manual only',      schedule: 'Every 2 hrs' },
  { id: 3, name: 'Import Claims Interface', source: 'INSOFT', status: 'Healthy', lastRun: '2026-06-24 09:05', imported: 678,  errored: 0,  nextRun: '2026-06-24 11:05', schedule: 'Every 2 hrs' },
  { id: 4, name: 'Import Claims Interface', source: 'CRM',    status: 'Warning', lastRun: '2026-06-24 08:33', imported: 540,  errored: 14, nextRun: '2026-06-24 09:33', schedule: 'Every 1 hr'  },
]

// Failed claims pending reload
const INITIAL_FAILED = [
  { id: 'CLM-4401', source: 'LATAM', date: '2026-06-24', reason: 'Part Number does not exist in catalog',    description: 'Welding Wire ER70S-6 2mm',    status: 'Pending' },
  { id: 'CLM-4402', source: 'LATAM', date: '2026-06-24', reason: 'Distributor not found in system',          description: 'Plasma Cutter PC-40',         status: 'Pending' },
  { id: 'CLM-4403', source: 'LATAM', date: '2026-06-24', reason: 'Error code not recognized',                description: 'Shield Gas Regulator R-200',  status: 'Pending' },
  { id: 'CLM-4404', source: 'LATAM', date: '2026-06-24', reason: 'Format error / missing required field',    description: 'MIG Wire 0.9mm 15kg spool',   status: 'Pending' },
  { id: 'CLM-4405', source: 'LATAM', date: '2026-06-24', reason: 'Missing data — claim incomplete',          description: 'TIG Torch WP-17',             status: 'Pending' },
  { id: 'CLM-4406', source: 'LATAM', date: '2026-06-24', reason: 'Part Number does not exist in catalog',    description: 'Flux Core Wire E71T-GS',      status: 'Pending' },
  { id: 'CLM-4407', source: 'LATAM', date: '2026-06-24', reason: 'Distributor not found in system',          description: 'Welding Helmet ADF-500S',     status: 'Pending' },
  { id: 'CLM-4408', source: 'LATAM', date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Ground Clamp 300A',           status: 'Pending' },
  { id: 'CLM-4409', source: 'LATAM', date: '2026-06-24', reason: 'Error code not recognized',                description: 'Stick Electrode E6013 3.2mm', status: 'Pending' },
  { id: 'CLM-4410', source: 'LATAM', date: '2026-06-24', reason: 'Missing data — claim incomplete',          description: 'Cutting Tip CT-1',            status: 'Pending' },
  { id: 'CLM-4411', source: 'LATAM', date: '2026-06-24', reason: 'Part Number does not exist in catalog',    description: 'Wire Feed Assembly WF-200',   status: 'Pending' },
  { id: 'CLM-4412', source: 'LATAM', date: '2026-06-24', reason: 'Distributor not found in system',          description: 'Nozzle Dip ND-250',           status: 'Pending' },
  { id: 'CLM-4413', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Contact Tip CT-035',          status: 'Pending' },
  { id: 'CLM-4414', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Drive Roll 0.9/1.2mm',        status: 'Pending' },
  { id: 'CLM-4415', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Liner 0.9mm 3m Blue',         status: 'Pending' },
  { id: 'CLM-4416', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Gun Handle Assembly GH-15',   status: 'Pending' },
  { id: 'CLM-4417', source: 'CRM',   date: '2026-06-24', reason: 'Error code not recognized',                description: 'MIG Welder Rebel EMP215ic',   status: 'Pending' },
  { id: 'CLM-4418', source: 'CRM',   date: '2026-06-24', reason: 'Missing data — claim incomplete',          description: 'Torch Body T-150',            status: 'Pending' },
  { id: 'CLM-4419', source: 'CRM',   date: '2026-06-24', reason: 'Error code not recognized',                description: 'Welding Wire ER4043 1.2mm',   status: 'Pending' },
  { id: 'CLM-4420', source: 'CRM',   date: '2026-06-24', reason: 'Part Number does not exist in catalog',    description: 'Spool Hub Adapter SHA-4',     status: 'Pending' },
  { id: 'CLM-4421', source: 'CRM',   date: '2026-06-24', reason: 'Distributor not found in system',          description: 'Consumable Kit CK-200',       status: 'Pending' },
  { id: 'CLM-4422', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Anti-Spatter Spray 400ml',    status: 'Pending' },
  { id: 'CLM-4423', source: 'CRM',   date: '2026-06-24', reason: 'Missing data — claim incomplete',          description: 'Wire Straightener WS-4',      status: 'Pending' },
  { id: 'CLM-4424', source: 'CRM',   date: '2026-06-24', reason: 'Format error / missing required field',    description: 'Back Cap Long BC-L',          status: 'Pending' },
  { id: 'CLM-4425', source: 'LATAM', date: '2026-06-24', reason: 'Error code not recognized',                description: 'Argon Regulator AR-30',       status: 'Pending' },
  { id: 'CLM-4426', source: 'LATAM', date: '2026-06-24', reason: 'Part Number does not exist in catalog',    description: 'Plasma Electrode E-45',       status: 'Pending' },
]

const INITIAL_LOGS = [
  { time: '09:42', source: 'SAP NA', event: 'Sync completed — 1,240 records imported',             type: 'success' },
  { time: '09:05', source: 'INSOFT', event: 'Sync completed — 678 records imported',               type: 'success' },
  { time: '08:33', source: 'CRM',    event: '14 records failed field validation (UPC format)',      type: 'warning' },
  { time: '08:10', source: 'SAP NA', event: 'Sync completed — 1,198 records imported',             type: 'success' },
  { time: '07:44', source: 'INSOFT', event: 'Sync completed — 701 records imported',               type: 'success' },
  { time: '07:20', source: 'CRM',    event: 'Sync completed — 512 records imported',               type: 'success' },
  { time: '06:30', source: 'LATAM',  event: 'Connection timeout — host unreachable',               type: 'error'   },
  { time: '05:58', source: 'SAP NA', event: 'Sync completed — 1,054 records imported',             type: 'success' },
  { time: '05:30', source: 'LATAM',  event: 'Retry failed — authentication error (token expired)', type: 'error'   },
  { time: '04:52', source: 'INSOFT', event: 'Sync completed — 689 records imported',               type: 'success' },
  { time: '04:15', source: 'LATAM',  event: 'Sync completed — 423 records imported',               type: 'success' },
  { time: '03:40', source: 'CRM',    event: 'Sync completed — 498 records imported',               type: 'success' },
]

const REASON_COLOR = {
  'Part Number does not exist in catalog':    { bg: '#fee2e2', text: '#991b1b' },
  'Distributor not found in system':          { bg: '#fef3c7', text: '#92400e' },
  'Error code not recognized':                { bg: '#ede9fe', text: '#5b21b6' },
  'Format error / missing required field':    { bg: '#dbeafe', text: '#1e40af' },
  'Missing data — claim incomplete':          { bg: '#f3f4f6', text: '#374151' },
}

export default function InterfaceModulePage({ user, onLogout, onNavigate, currentPage }) {
  const today = new Date().toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' })

  // Tabs
  const [tab, setTab]               = useState('status')           // 'status' | 'reload'

  // Interface Status state
  const [date, setDate]             = useState(today)
  const [sourceFilter, setSourceFilter] = useState('All')
  const [applied, setApplied]       = useState('All')
  const [interfaces, setInterfaces] = useState(INITIAL_INTERFACES)
  const [logs, setLogs]             = useState(INITIAL_LOGS)
  const [retrying, setRetrying]     = useState(null)

  // Reload Claims state
  const [failedClaims, setFailedClaims]     = useState(INITIAL_FAILED)
  const [reloadSource, setReloadSource]     = useState('All')
  const [reloading, setReloading]           = useState(null)

  // Navigate to Reload tab with source pre-filtered
  const goToReload = (source) => {
    setReloadSource(source)
    setTab('reload')
  }

  // Interface Status computed
  const displayed = useMemo(() =>
    applied === 'All' ? interfaces : interfaces.filter(i => i.source === applied)
  , [interfaces, applied])

  const kpi = useMemo(() => {
    const healthy  = interfaces.filter(i => i.status === 'Healthy').length
    const failed   = interfaces.filter(i => i.status === 'Failed').length
    const warning  = interfaces.filter(i => i.status === 'Warning').length
    const totalRec = interfaces.reduce((s, i) => s + i.imported, 0)
    const totalErr = interfaces.reduce((s, i) => s + i.errored, 0)
    const rate     = totalRec + totalErr > 0
      ? ((totalRec / (totalRec + totalErr)) * 100).toFixed(1)
      : '100.0'
    return { healthy, failed, warning, totalRec, totalErr, rate }
  }, [interfaces])

  const handleSearch = () => setApplied(sourceFilter)

  const handleRetry = (iface) => {
    setRetrying(iface.id)
    const now     = new Date()
    const ts      = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    const nextTs  = `2026-06-24 ${new Date(now.getTime() + 3600000).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })}`
    setTimeout(() => {
      const newImported = Math.floor(Math.random() * 600) + 200
      setInterfaces(prev => prev.map(i =>
        i.id === iface.id
          ? { ...i, status: 'Healthy', errored: 0, imported: newImported, lastRun: `2026-06-24 ${ts}`, nextRun: nextTs }
          : i
      ))
      setLogs(prev => [
        { time: ts, source: iface.source, event: `Manual retry — ${newImported.toLocaleString()} lines imported successfully`, type: 'success' },
        ...prev,
      ])
      setRetrying(null)
    }, 2000)
  }

  const handleSkip = (iface) => {
    const ts = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    setInterfaces(prev => prev.map(i =>
      i.id === iface.id ? { ...i, status: 'Idle', nextRun: 'Manual only' } : i
    ))
    setLogs(prev => [
      { time: ts, source: iface.source, event: 'Interface skipped by operator', type: 'warning' },
      ...prev,
    ])
  }

  // Reload Claims computed
  const pendingClaims = useMemo(() =>
    failedClaims.filter(c => c.status === 'Pending' && (reloadSource === 'All' || c.source === reloadSource))
  , [failedClaims, reloadSource])

  const reloadedClaims = useMemo(() =>
    failedClaims.filter(c => c.status === 'Reloaded' && (reloadSource === 'All' || c.source === reloadSource))
  , [failedClaims, reloadSource])

  const handleReload = (claim) => {
    setReloading(claim.id)
    const ts = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    setTimeout(() => {
      setFailedClaims(prev => prev.map(c =>
        c.id === claim.id ? { ...c, status: 'Reloaded', reloadedAt: ts } : c
      ))
      // Update interface errored count
      setInterfaces(prev => prev.map(i => {
        if (i.source !== claim.source) return i
        const newErrored = Math.max(0, i.errored - 1)
        return {
          ...i,
          errored: newErrored,
          imported: i.imported + 1,
          status: newErrored === 0 ? 'Healthy' : i.status,
        }
      }))
      setLogs(prev => [
        { time: ts, source: claim.source, event: `${claim.id} reloaded successfully — ${claim.description}`, type: 'success' },
        ...prev,
      ])
      setReloading(null)
    }, 1200)
  }

  const reasonCounts = useMemo(() => {
    const counts = {}
    ERROR_REASONS.forEach(r => { counts[r] = 0 })
    pendingClaims.forEach(c => { counts[c.reason] = (counts[c.reason] || 0) + 1 })
    return counts
  }, [pendingClaims])

  return (
    <div className="im-page">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="im-container">

        {/* Header */}
        <div className="im-header">
          <div>
            <h1>Interface Module Management</h1>
            <p>Operational health and remediation for claims data load interfaces</p>
          </div>
          <div className="im-last-updated">Last updated: 2026-06-24 09:42</div>
        </div>

        {/* Tabs */}
        <div className="im-tabs">
          <button className={`im-tab ${tab === 'status' ? 'active' : ''}`} onClick={() => setTab('status')}>
            Interface Status
          </button>
          <button className={`im-tab ${tab === 'reload' ? 'active' : ''}`} onClick={() => setTab('reload')}>
            Reload Claims
            {failedClaims.filter(c => c.status === 'Pending').length > 0 && (
              <span className="im-tab-badge">{failedClaims.filter(c => c.status === 'Pending').length}</span>
            )}
          </button>
        </div>

        {/* ── TAB: Interface Status ── */}
        {tab === 'status' && (
          <>
            {/* Summary KPIs */}
            <div className="im-summary-bar">
              <div className="im-summary-item">
                <span className="im-summary-icon">🔌</span>
                <div><div className="im-summary-val">4</div><div className="im-summary-lbl">Total Interfaces</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">✅</span>
                <div><div className="im-summary-val healthy-val">{kpi.healthy}</div><div className="im-summary-lbl">Healthy</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">❌</span>
                <div><div className="im-summary-val failed-val">{kpi.failed}</div><div className="im-summary-lbl">Failed</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">⚠️</span>
                <div><div className="im-summary-val warning-val">{kpi.warning}</div><div className="im-summary-lbl">Warning</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">📦</span>
                <div><div className="im-summary-val">{kpi.totalRec.toLocaleString()}</div><div className="im-summary-lbl">Records Today</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">📊</span>
                <div><div className="im-summary-val rate-val">{kpi.rate}%</div><div className="im-summary-lbl">Success Rate</div></div>
              </div>
              <div className="im-summary-sep" />
              <div className="im-summary-item">
                <span className="im-summary-icon">🚨</span>
                <div><div className="im-summary-val err-val">{kpi.totalErr}</div><div className="im-summary-lbl">Total Errors</div></div>
              </div>
            </div>

            {/* Filter bar */}
            <div className="im-filter-bar">
              <div className="im-filter-group">
                <label>Date:</label>
                <input type="text" value={date} onChange={e => setDate(e.target.value)} className="im-input" />
              </div>
              <div className="im-filter-group">
                <label>Source:</label>
                <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="im-input">
                  {['All', 'SAP NA', 'LATAM', 'INSOFT', 'CRM'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="im-search-btn" onClick={handleSearch}>Search</button>
              {applied !== 'All' && (
                <button className="im-clear-btn" onClick={() => { setSourceFilter('All'); setApplied('All') }}>✕ Clear</button>
              )}
            </div>

            {/* Interface Cards */}
            <div className="im-cards-grid">
              {displayed.map(iface => {
                const sc = SOURCE_COLOR[iface.source]
                const sm = STATUS_META[iface.status]
                const successPct = iface.imported + iface.errored > 0
                  ? Math.round((iface.imported / (iface.imported + iface.errored)) * 100)
                  : 100
                const isIssue    = iface.status === 'Failed' || iface.status === 'Warning'
                const effectColor = successPct < 90 ? '#dc2626' : successPct < 98 ? '#d97706' : '#16a34a'

                return (
                  <div key={iface.id} className={`im-iface-card ${iface.status.toLowerCase()}`}>
                    <div className="im-iface-header">
                      <div className="im-iface-source-wrap">
                        <span className="im-iface-source" style={{ background: sc.bg, color: sc.text, borderColor: sc.border }}>
                          {iface.source}
                        </span>
                        <span className="im-iface-status" style={{ background: sm.bg, color: sm.color }}>
                          {sm.icon} {iface.status}
                        </span>
                      </div>
                      <span className="im-iface-schedule">🕐 {iface.schedule}</span>
                    </div>

                    <div className="im-iface-name">{iface.name}</div>

                    <div className="im-iface-metrics">
                      <div className="im-metric-row">
                        <span className="im-metric-icon">🕐</span>
                        <div className="im-metric-content">
                          <div className="im-metric-lbl">Last Run</div>
                          <div className="im-metric-val">{iface.lastRun}</div>
                        </div>
                      </div>
                      <div className="im-metric-row">
                        <span className="im-metric-icon">✅</span>
                        <div className="im-metric-content">
                          <div className="im-metric-lbl">Lines Imported Successfully</div>
                          <div className="im-metric-val" style={{ color: '#16a34a' }}>
                            {iface.imported.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="im-metric-row">
                        <span className="im-metric-icon">❌</span>
                        <div className="im-metric-content">
                          <div className="im-metric-lbl">Lines with Error (need reload)</div>
                          {iface.errored > 0 ? (
                            <button className="im-errored-link" onClick={() => goToReload(iface.source)}>
                              {iface.errored.toLocaleString()}
                            </button>
                          ) : (
                            <div className="im-metric-val" style={{ color: '#16a34a' }}>0 — No errors</div>
                          )}
                        </div>
                      </div>
                      <div className="im-metric-row">
                        <span className="im-metric-icon">⏭</span>
                        <div className="im-metric-content">
                          <div className="im-metric-lbl">Next Scheduled Run</div>
                          <div className="im-metric-val" style={{ color: iface.nextRun === 'Manual only' ? '#d97706' : '#1a1a2e' }}>
                            {iface.nextRun}
                          </div>
                        </div>
                      </div>
                      <div className="im-metric-row">
                        <span className="im-metric-icon">📊</span>
                        <div className="im-metric-content">
                          <div className="im-metric-lbl">Effectiveness</div>
                          <div className="im-metric-val" style={{ color: effectColor }}>{successPct}%</div>
                        </div>
                        <div className="im-inline-bar-wrap">
                          <div className="im-inline-bar-track">
                            <div className="im-inline-bar-fill" style={{ width: `${successPct}%`, background: effectColor }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {isIssue && (
                      <div className="im-iface-actions">
                        {iface.status === 'Failed' && (
                          <div className="im-error-msg">
                            ⚡ {iface.source === 'LATAM' ? 'Connection timeout — host unreachable' : 'Validation errors detected'}
                          </div>
                        )}
                        {iface.status === 'Warning' && (
                          <div className="im-warn-msg">
                            ⚠️ {iface.errored} lines failed field validation and need to be reloaded
                          </div>
                        )}
                        <div className="im-action-btns">
                          <button className="im-btn-retry" onClick={() => handleRetry(iface)} disabled={retrying === iface.id}>
                            {retrying === iface.id ? '↻ Retrying…' : '↻ Retry Now'}
                          </button>
                          <button className="im-btn-skip" onClick={() => handleSkip(iface)}>⏸ Skip</button>
                        </div>
                      </div>
                    )}
                    {iface.status === 'Healthy' && <div className="im-healthy-msg">✅ Running normally — no action required</div>}
                    {iface.status === 'Idle'    && <div className="im-idle-msg">⏸ Skipped by operator</div>}
                  </div>
                )
              })}
            </div>

            {/* Activity Log */}
            <div className="im-log-card">
              <div className="im-log-header">
                <h3>📋 Activity Log</h3>
                <span className="im-log-date">Today — {logs.length} events</span>
              </div>
              <div className="im-log-list">
                {logs.map((l, idx) => (
                  <div key={idx} className={`im-log-row im-log-${l.type}`}>
                    <span className="im-log-time">{l.time}</span>
                    <span className="im-log-dot" />
                    <span className="im-log-source" style={{ background: SOURCE_COLOR[l.source]?.bg, color: SOURCE_COLOR[l.source]?.text }}>
                      {l.source}
                    </span>
                    <span className="im-log-event">{l.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── TAB: Reload Claims ── */}
        {tab === 'reload' && (
          <>
            {/* Source filter */}
            <div className="im-filter-bar">
              <div className="im-filter-group">
                <label>Source:</label>
                <select value={reloadSource} onChange={e => setReloadSource(e.target.value)} className="im-input">
                  {['All', 'SAP NA', 'LATAM', 'INSOFT', 'CRM'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {reloadSource !== 'All' && (
                <button className="im-clear-btn" onClick={() => setReloadSource('All')}>✕ Clear filter</button>
              )}
              <div className="im-reload-summary">
                <span className="im-rs-pending">{pendingClaims.length} pending</span>
                <span className="im-rs-done">{reloadedClaims.length} reloaded</span>
              </div>
            </div>

            {/* Error reason legend */}
            <div className="im-reason-legend">
              {ERROR_REASONS.map(r => (
                <div key={r} className="im-reason-chip" style={{ background: REASON_COLOR[r].bg, color: REASON_COLOR[r].text }}>
                  {r} <strong>({reasonCounts[r] || 0})</strong>
                </div>
              ))}
            </div>

            {/* Pending table */}
            <div className="im-reload-card">
              <div className="im-reload-card-header">
                <h3>⏳ Pending Reload</h3>
                <span className="im-pending-badge">{pendingClaims.length}</span>
              </div>
              {pendingClaims.length === 0 ? (
                <div className="im-no-pending">✅ No pending claims — all errors have been resolved.</div>
              ) : (
                <div className="im-reload-table-wrap">
                  <table className="im-reload-table">
                    <thead>
                      <tr>
                        <th>Claim #</th>
                        <th>Source</th>
                        <th>Description</th>
                        <th>Error Reason</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingClaims.map(c => {
                        const rc = REASON_COLOR[c.reason]
                        const sc = SOURCE_COLOR[c.source]
                        return (
                          <tr key={c.id}>
                            <td className="im-claim-id">{c.id}</td>
                            <td>
                              <span className="im-source-chip" style={{ background: sc.bg, color: sc.text }}>
                                {c.source}
                              </span>
                            </td>
                            <td className="im-claim-desc">{c.description}</td>
                            <td>
                              <span className="im-reason-chip-sm" style={{ background: rc.bg, color: rc.text }}>
                                {c.reason}
                              </span>
                            </td>
                            <td className="im-claim-date">{c.date}</td>
                            <td>
                              <button
                                className="im-btn-reload"
                                onClick={() => handleReload(c)}
                                disabled={reloading === c.id}
                              >
                                {reloading === c.id ? '↻ …' : '↻ Reload'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Successfully reloaded table */}
            {reloadedClaims.length > 0 && (
              <div className="im-reload-card im-reloaded-section">
                <div className="im-reload-card-header">
                  <h3>✅ Successfully Reloaded</h3>
                  <span className="im-reloaded-badge">{reloadedClaims.length}</span>
                </div>
                <div className="im-reload-table-wrap">
                  <table className="im-reload-table">
                    <thead>
                      <tr>
                        <th>Claim #</th>
                        <th>Source</th>
                        <th>Description</th>
                        <th>Original Error</th>
                        <th>Reloaded At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reloadedClaims.map(c => {
                        const sc = SOURCE_COLOR[c.source]
                        return (
                          <tr key={c.id} className="im-reloaded-row">
                            <td className="im-claim-id">{c.id}</td>
                            <td>
                              <span className="im-source-chip" style={{ background: sc.bg, color: sc.text }}>
                                {c.source}
                              </span>
                            </td>
                            <td className="im-claim-desc">{c.description}</td>
                            <td className="im-claim-old-reason">{c.reason}</td>
                            <td className="im-claim-date">{c.reloadedAt}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
