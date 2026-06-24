import { useState, useEffect } from 'react'
import TopNavigation from '../components/TopNavigation'
import KPICard from '../components/KPICard'
import { LineChart, BarChart, DoughnutChart } from '../components/ChartComponent'
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
          <h2>Welcome, {user.split('@')[0]}</h2>
          <p>Claims Management Dashboard</p>
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

        {/* Charts Row 1 */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Claims Over Time</h3>
            <LineChart data={chartData.lineChart} />
          </div>
          <div className="chart-card">
            <h3>Claims by Status</h3>
            <BarChart data={chartData.barChart} />
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Distribution by Type</h3>
            <DoughnutChart data={chartData.donutChart} />
          </div>
          <div className="chart-card">
            <h3>Regional Distribution</h3>
            <div className="region-list">
              <div className="region-item">
                <span>North America</span>
                <span className="count">8</span>
              </div>
              <div className="region-item">
                <span>Europe</span>
                <span className="count">6</span>
              </div>
              <div className="region-item">
                <span>Asia</span>
                <span className="count">5</span>
              </div>
              <div className="region-item">
                <span>South America</span>
                <span className="count">4</span>
              </div>
              <div className="region-item">
                <span>Other Regions</span>
                <span className="count">5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="action-section">
          <button className="view-claims-btn" onClick={onViewClaims}>
            View All Claims →
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
