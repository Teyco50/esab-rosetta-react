import { useState, useEffect } from 'react'
import TopNavigation from '../components/TopNavigation'
import KPICard from '../components/KPICard'
import { BarChart } from '../components/ChartComponent'
import ClaimsByRegionMap from '../components/ClaimsByRegionMap'
import { getDashboardStats, getChartData } from '../data/mockData'
import './DashboardPage.css'

function DashboardPage({ user, onLogout, onViewClaims, onNavigate, currentPage }) {
  const [stats, setStats] = useState(null)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    setStats(getDashboardStats(user))
    setChartData(getChartData(user))
  }, [user])

  if (!stats || !chartData) {
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
            <p>Claims Management Dashboard</p>
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
          />
          <KPICard
            title="Closed Claims"
            value={stats.closedClaims}
            icon="✅"
            gradient={['#10b981', '#34d399']}
            trend={{ positive: true, percent: 50 }}
            comparison="vs last period"
          />
          <KPICard
            title="YTD Claims"
            value={stats.ytdClaims}
            icon="📊"
            gradient={['#f59e0b', '#fbbf24']}
            trend={{ positive: false, percent: 8 }}
            comparison="vs last year"
          />
          <KPICard
            title="Active Regions"
            value={stats.regionCount}
            icon="🌍"
            gradient={['#8b5cf6', '#a78bfa']}
            trend={{ positive: true, percent: 25 }}
            comparison="worldwide"
          />
        </div>

        {/* Regional Map */}
        <ClaimsByRegionMap />

        {/* Claims by Status chart */}
        <div className="chart-card" style={{ marginTop: '20px' }}>
          <h3>Claims by Status</h3>
          <div style={{ height: '160px', position: 'relative' }}>
            <BarChart data={chartData.barChart} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
