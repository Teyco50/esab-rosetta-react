import './KPICard.css'

function KPICard({ title, value, icon, gradient, trend, comparison }) {
  return (
    <div className="kpi-card" style={{ background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)` }}>
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
      </div>

      <div className="kpi-body">
        <div className="kpi-label">{title}</div>
        <div className="kpi-value">{value}</div>
      </div>

      {trend && (
        <div className="kpi-footer">
          <span className="kpi-trend" style={{ color: trend.positive ? '#a7f3d0' : '#fca5a5' }}>
            {trend.positive ? '↑' : '↓'} {trend.percent}%
          </span>
          <span className="kpi-comparison">{comparison}</span>
        </div>
      )}
    </div>
  )
}

export default KPICard
