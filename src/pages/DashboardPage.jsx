import { useState, useEffect } from 'react'
import TopNavigation from '../components/TopNavigation'
import KPICard from '../components/KPICard'
import ClaimsByRegionMap from '../components/ClaimsByRegionMap'
import { getDashboardStats, getChartData, getGlobalStats, mockClaims } from '../data/mockData'

const top10Oldest = [...mockClaims]
  .filter(c => c.status !== 'Closed')
  .sort((a, b) => parseInt(b.timeElapsed) - parseInt(a.timeElapsed))
  .slice(0, 5)
import './DashboardPage.css'

function DashboardPage({ user, onLogout, onViewClaims, onNavigate, currentPage }) {
  const [stats, setStats] = useState(null)
  const [globalStats, setGlobalStats] = useState(null)

  useEffect(() => {
    setStats(getDashboardStats(user))
    setGlobalStats(getGlobalStats())
  }, [user])

  if (!stats || !globalStats) {
    return <div>Loading...</div>
  }

  return (
    <div className="dashboard">
      <TopNavigation user={user} onLogout={onLogout} onNavigate={onNavigate} currentPage={currentPage} />

      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Welcome, {user.split('@')[0]}</h2>
            <p>My Claims — assigned to me</p>
          </div>
          <button className="view-claims-btn" onClick={onViewClaims}>
            View All Claims →
          </button>
        </div>

        {/* KPI Cards */}
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

        {/* Regional Map + Top 10 Oldest */}
        <div className="region-with-top10">
          <ClaimsByRegionMap />

          <div className="top10-panel">
            <div className="top10-header">
              <h3>🕐 Top 5 Oldest</h3>
              <span className="top10-sub">Open claims by age</span>
            </div>
            <div className="top10-list">
              {top10Oldest.map((c, idx) => (
                <div key={c.id} className="top10-row">
                  <span className="top10-rank">#{idx + 1}</span>
                  <div className="top10-info">
                    <span className="top10-id">{c.id}</span>
                    <span className="top10-site">{c.site}</span>
                  </div>
                  <div className="top10-right">
                    <span className="top10-days">{c.timeElapsed}</span>
                    <span className={`top10-status top10-${c.status.toLowerCase().replace(' ', '-')}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Claims by Status — Global */}
        <div className="status-kpi-card">
          <h3>Global Claims by Status ✦</h3>
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
