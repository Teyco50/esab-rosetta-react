import { useState, useEffect, useMemo } from 'react'
import TopNavigation from '../components/TopNavigation'
import KPICard from '../components/KPICard'
import ClaimsByRegionMap from '../components/ClaimsByRegionMap'
import { getDashboardStats, getGlobalStats, getClaimsByUser } from '../data/mockData'
import './DashboardPage.css'

const ROLE_SUBTITLE = {
  'Admin':          'All Claims — Admin View',
  'QA Coordinator': 'Claims Under QA Review — assigned to me',
  'Viewer':         'Claims I Reported',
  'Claims Agent':   'My Claims — assigned to me',
}

const ROLE_COLORS = {
  'Admin':          { bg: '#fee2e2', color: '#b91c1c' },
  'QA Coordinator': { bg: '#dbeafe', color: '#1d4ed8' },
  'Claims Agent':   { bg: '#dcfce7', color: '#15803d' },
  'Viewer':         { bg: '#f3f4f6', color: '#374151' },
}

function DashboardPage({ user, onLogout, onViewClaims, onNavigate, currentPage }) {
  const [stats, setStats]           = useState(null)
  const [globalStats, setGlobalStats] = useState(null)
  const [userClaims, setUserClaims]   = useState([])

  useEffect(() => {
    const uc = getClaimsByUser(user)
    setUserClaims(uc)
    setStats(getDashboardStats(user))
    setGlobalStats(getGlobalStats())
  }, [user])

  const top5Oldest = useMemo(() =>
    [...userClaims]
      .filter(c => c.status !== 'Closed')
      .sort((a, b) => parseInt(b.timeElapsed) - parseInt(a.timeElapsed))
      .slice(0, 5),
    [userClaims]
  )

  if (!stats || !globalStats) return <div>Loading...</div>

  const roleStyle = ROLE_COLORS[user.role] || ROLE_COLORS['Claims Agent']

  return (
    <div className="dashboard">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <div className="dash-name-row">
              <h2>Welcome, {user.name}</h2>
              <span
                className="dash-role-badge"
                style={{ background: roleStyle.bg, color: roleStyle.color }}
              >
                {user.role}
              </span>
            </div>
            <p>{ROLE_SUBTITLE[user.role] || ROLE_SUBTITLE['Claims Agent']}</p>
          </div>
          <button className="view-claims-btn" onClick={onViewClaims}>
            View All Claims →
          </button>
        </div>

        {/* KPI Cards — user's claims */}
        <div className="kpi-grid">
          <KPICard
            title="Open Claims"
            value={stats.openClaims}
            icon="📋"
            gradient={['#6366f1', '#818cf8']}
            trend={{ positive: true, percent: 12 }}
            comparison="vs last period"
            onClick={() => onNavigate('claims', 'Open')}
          />
          <KPICard
            title="Closed Claims"
            value={stats.closedClaims}
            icon="✅"
            gradient={['#10b981', '#34d399']}
            trend={{ positive: true, percent: 50 }}
            comparison="vs last period"
            onClick={() => onNavigate('claims', 'Closed')}
          />
          <KPICard
            title="YTD Claims"
            value={stats.ytdClaims}
            icon="📊"
            gradient={['#f59e0b', '#fbbf24']}
            trend={{ positive: false, percent: 8 }}
            comparison="vs last year"
            onClick={() => onNavigate('claims', 'All')}
          />
          <KPICard
            title="Pending Claims"
            value={stats.pendingClaims}
            icon="⏳"
            gradient={['#f59e0b', '#fb923c']}
            trend={{ positive: false, percent: 0 }}
            comparison="accumulated"
            onClick={() => onNavigate('claims', 'Pending')}
          />
        </div>

        {/* Regional Map + Top 5 Oldest (from user's claims) */}
        <div className="region-with-top10">
          <ClaimsByRegionMap />

          <div className="top10-panel">
            <div className="top10-header">
              <h3>🕐 Top 5 Oldest</h3>
              <span className="top10-sub">Non-closed · my claims</span>
            </div>
            <div className="top10-list">
              {top5Oldest.length === 0 ? (
                <div className="top10-empty">No open claims</div>
              ) : top5Oldest.map((c, idx) => (
                <div key={c.id} className="top10-row">
                  <span className="top10-rank">#{idx + 1}</span>
                  <div className="top10-info">
                    <span className="top10-id">{c.id}</span>
                    <span className="top10-site">{c.site}</span>
                  </div>
                  <div className="top10-right">
                    <span className="top10-days">{c.timeElapsed}</span>
                    <span className={`top10-status top10-${c.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Claims by Status */}
        <div className="status-kpi-card">
          <h3>Global Claims by Status ✦ <span className="status-kpi-total">({globalStats.open + globalStats.closed + globalStats.pending + globalStats.onHold + globalStats.analysis + globalStats.correctiveAction} total)</span></h3>
          <div className="status-kpi-grid">
            <div className="status-kpi-item" style={{ borderColor: '#6366f1' }}>
              <span className="status-kpi-icon">📋</span>
              <span className="status-kpi-value">{globalStats.open}</span>
              <span className="status-kpi-label">Open</span>
            </div>
            <div className="status-kpi-item" style={{ borderColor: '#10b981' }}>
              <span className="status-kpi-icon">✅</span>
              <span className="status-kpi-value">{globalStats.closed}</span>
              <span className="status-kpi-label">Closed</span>
            </div>
            <div className="status-kpi-item" style={{ borderColor: '#f59e0b' }}>
              <span className="status-kpi-icon">⏳</span>
              <span className="status-kpi-value">{globalStats.pending}</span>
              <span className="status-kpi-label">Pending</span>
            </div>
            <div className="status-kpi-item" style={{ borderColor: '#8b5cf6' }}>
              <span className="status-kpi-icon">⏸️</span>
              <span className="status-kpi-value">{globalStats.onHold}</span>
              <span className="status-kpi-label">On Hold</span>
            </div>
            <div className="status-kpi-item" style={{ borderColor: '#0891b2' }}>
              <span className="status-kpi-icon">🔍</span>
              <span className="status-kpi-value">{globalStats.analysis}</span>
              <span className="status-kpi-label">Analysis</span>
            </div>
            <div className="status-kpi-item" style={{ borderColor: '#16a34a' }}>
              <span className="status-kpi-icon">🔧</span>
              <span className="status-kpi-value">{globalStats.correctiveAction}</span>
              <span className="status-kpi-label">Corrective Action</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
