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

const INITIAL_INTERFACES = [
  { id: 1, name: 'Import Claims Interface', source: 'SAP NA', status: 'Healthy', lastRun: '2026-06-24 09:42', imported: 1240, errored: 0,  nextRun: '2026-06-24 10:42', schedule: 'Every 1 hr'  },
  { id: 2, name: 'Import Claims Interface', source: 'LATAM',  status: 'Failed',  lastRun: '2026-06-24 06:30', imported: 0,    errored: 89, nextRun: 'Manual only',      schedule: 'Every 2 hrs' },
  { id: 3, name: 'Import Claims Interface', source: 'INSOFT', status: 'Healthy', lastRun: '2026-06-24 09:05', imported: 678,  errored: 0,  nextRun: '2026-06-24 11:05', schedule: 'Every 2 hrs' },
  { id: 4, name: 'Import Claims Interface', source: 'CRM',    status: 'Warning', lastRun: '2026-06-24 08:33', imported: 540,  errored: 14, nextRun: '2026-06-24 09:33', schedule: 'Every 1 hr'  },
]

const INITIAL_LOGS = [
  { time: '09:42', source: 'SAP NA', event: 'Sync completed — 1,240 records imported',        type: 'success' },
  { time: '09:05', source: 'INSOFT', event: 'Sync completed — 678 records imported',           type: 'success' },
  { time: '08:33', source: 'CRM',    event: '14 records failed field validation (UPC format)', type: 'warning' },
  { time: '08:10', source: 'SAP NA', event: 'Sync completed — 1,198 records imported',        type: 'success' },
  { time: '07:44', source: 'INSOFT', event: 'Sync completed — 701 records imported',           type: 'success' },
  { time: '07:20', source: 'CRM',    event: 'Sync completed — 512 records imported',           type: 'success' },
  { time: '06:30', source: 'LATAM',  event: 'Connection timeout — host unreachable',           type: 'error'   },
  { time: '05:58', source: 'SAP NA', event: 'Sync completed — 1,054 records imported',        type: 'success' },
  { time: '05:30', source: 'LATAM',  event: 'Retry failed — authentication error (token expired)', type: 'error' },
  { time: '04:52', source: 'INSOFT', event: 'Sync completed — 689 records imported',           type: 'success' },
  { time: '04:15', source: 'LATAM',  event: 'Sync completed — 423 records imported',           type: 'success' },
  { time: '03:40', source: 'CRM',    event: 'Sync completed — 498 records imported',           type: 'success' },
]

export default function InterfaceModulePage({ user, onLogout, onNavigate, currentPage }) {
  const today = new Date().toLocaleDateString('en-US', { month:'2-digit', day:'2-digit', year:'numeric' })
  const [date, setDate]             = useState(today)
  const [sourceFilter, setSourceFilter] = useState('All')
  const [applied, setApplied]       = useState('All')
  const [interfaces, setInterfaces] = useState(INITIAL_INTERFACES)
  const [logs, setLogs]             = useState(INITIAL_LOGS)
  const [retrying, setRetrying]     = useState(null)

  const displayed = useMemo(() =>
    applied === 'All' ? interfaces : interfaces.filter(i => i.source === applied)
  , [interfaces, applied])

  const kpi = useMemo(() => {
    const all      = interfaces
    const healthy  = all.filter(i => i.status === 'Healthy').length
    const failed   = all.filter(i => i.status === 'Failed').length
    const warning  = all.filter(i => i.status === 'Warning').length
    const totalRec = all.reduce((s, i) => s + i.imported, 0)
    const totalErr = all.reduce((s, i) => s + i.errored, 0)
    const rate     = totalRec + totalErr > 0
      ? ((totalRec / (totalRec + totalErr)) * 100).toFixed(1)
      : '100.0'
    return { healthy, failed, warning, totalRec, totalErr, rate }
  }, [interfaces])

  const handleSearch = () => setApplied(sourceFilter)

  const handleRetry = (iface) => {
    setRetrying(iface.id)
    const now = new Date()
    const ts  = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
    const nextTs  = `2026-06-24 ${nextHour.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: false })}`
    setTimeout(() => {
      const newImported = Math.floor(Math.random() * 600) + 200
      setInterfaces(prev => prev.map(i =>
        i.id === iface.id
          ? { ...i, status: 'Healthy', errored: 0, imported: newImported,
              lastRun: `2026-06-24 ${ts}`, nextRun: nextTs }
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

        {/* Summary KPIs */}
        <div className="im-summary-bar">
          <div className="im-summary-item">
            <span className="im-summary-icon">🔌</span>
            <div>
              <div className="im-summary-val">4</div>
              <div className="im-summary-lbl">Total Interfaces</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon healthy-icon">✅</span>
            <div>
              <div className="im-summary-val healthy-val">{kpi.healthy}</div>
              <div className="im-summary-lbl">Healthy</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon failed-icon">❌</span>
            <div>
              <div className="im-summary-val failed-val">{kpi.failed}</div>
              <div className="im-summary-lbl">Failed</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon warning-icon">⚠️</span>
            <div>
              <div className="im-summary-val warning-val">{kpi.warning}</div>
              <div className="im-summary-lbl">Warning</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon">📦</span>
            <div>
              <div className="im-summary-val">{kpi.totalRec.toLocaleString()}</div>
              <div className="im-summary-lbl">Records Today</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon">📊</span>
            <div>
              <div className="im-summary-val rate-val">{kpi.rate}%</div>
              <div className="im-summary-lbl">Success Rate</div>
            </div>
          </div>
          <div className="im-summary-sep" />
          <div className="im-summary-item">
            <span className="im-summary-icon">🚨</span>
            <div>
              <div className="im-summary-val err-val">{kpi.totalErr}</div>
              <div className="im-summary-lbl">Total Errors</div>
            </div>
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
            <button className="im-clear-btn" onClick={() => { setSourceFilter('All'); setApplied('All') }}>
              ✕ Clear filter
            </button>
          )}
        </div>

        {/* Interface Cards Grid */}
        <div className="im-cards-grid">
          {displayed.map(iface => {
            const sc = SOURCE_COLOR[iface.source]
            const sm = STATUS_META[iface.status]
            const successPct = iface.records + iface.errors > 0
              ? Math.round((iface.records / (iface.records + iface.errors)) * 100)
              : 100
            const isIssue = iface.status === 'Failed' || iface.status === 'Warning'

            const effectColor = successPct < 90 ? '#dc2626' : successPct < 98 ? '#d97706' : '#16a34a'

            return (
              <div key={iface.id} className={`im-iface-card ${iface.status.toLowerCase()}`}>

                {/* Card header */}
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

                {/* Interface name */}
                <div className="im-iface-name">{iface.name}</div>

                {/* 5 key metrics */}
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
                      <div className="im-metric-val" style={{ color: iface.errored > 0 ? '#dc2626' : '#16a34a' }}>
                        {iface.errored > 0 ? iface.errored.toLocaleString() : '0 — No errors'}
                      </div>
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

                {/* Remediation / status footer */}
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
                {iface.status === 'Healthy' && (
                  <div className="im-healthy-msg">✅ Running normally — no action required</div>
                )}
                {iface.status === 'Idle' && (
                  <div className="im-idle-msg">⏸ Skipped by operator</div>
                )}

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
                <span className="im-log-source" style={{
                  background: SOURCE_COLOR[l.source]?.bg,
                  color: SOURCE_COLOR[l.source]?.text
                }}>{l.source}</span>
                <span className="im-log-event">{l.event}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
