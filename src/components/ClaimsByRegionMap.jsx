import { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { mockClaims } from '../data/mockData'
import './ClaimsByRegionMap.css'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

const COUNTRY_TO_REGION = {
  // North America
  '840': 'North America', '124': 'North America', '484': 'North America',
  '188': 'North America', '320': 'North America', '340': 'North America',
  '222': 'North America', '558': 'North America', '591': 'North America',
  '192': 'North America', '214': 'North America', '332': 'North America',
  '388': 'North America', '780': 'North America',
  // South America
  '076': 'South America', '032': 'South America', '152': 'South America',
  '170': 'South America', '218': 'South America', '604': 'South America',
  '862': 'South America', '858': 'South America', '600': 'South America',
  '068': 'South America', '328': 'South America', '740': 'South America',
  '630': 'South America', '659': 'South America',
  // Europe
  '276': 'Europe', '826': 'Europe', '250': 'Europe', '724': 'Europe',
  '380': 'Europe', '528': 'Europe', '056': 'Europe', '040': 'Europe',
  '756': 'Europe', '752': 'Europe', '578': 'Europe', '208': 'Europe',
  '246': 'Europe', '372': 'Europe', '620': 'Europe', '300': 'Europe',
  '616': 'Europe', '203': 'Europe', '703': 'Europe', '348': 'Europe',
  '642': 'Europe', '100': 'Europe', '191': 'Europe', '705': 'Europe',
  '688': 'Europe', '070': 'Europe', '807': 'Europe', '008': 'Europe',
  '498': 'Europe', '804': 'Europe', '112': 'Europe', '233': 'Europe',
  '428': 'Europe', '440': 'Europe', '352': 'Europe', '470': 'Europe',
  '442': 'Europe', '438': 'Europe', '492': 'Europe', '674': 'Europe',
  '336': 'Europe',
  // Asia
  '392': 'Asia', '156': 'Asia', '356': 'Asia', '702': 'Asia',
  '410': 'Asia', '408': 'Asia', '036': 'Asia', '554': 'Asia',
  '360': 'Asia', '458': 'Asia', '764': 'Asia', '704': 'Asia',
  '050': 'Asia', '144': 'Asia', '524': 'Asia', '064': 'Asia',
  '104': 'Asia', '116': 'Asia', '418': 'Asia', '496': 'Asia',
  '398': 'Asia', '860': 'Asia', '762': 'Asia', '795': 'Asia',
  '417': 'Asia', '586': 'Asia', '004': 'Asia', '364': 'Asia',
  '368': 'Asia', '760': 'Asia', '400': 'Asia', '422': 'Asia',
  '275': 'Asia', '376': 'Asia', '887': 'Asia', '682': 'Asia',
  '784': 'Asia', '512': 'Asia', '048': 'Asia', '634': 'Asia',
  '414': 'Asia', '031': 'Asia', '051': 'Asia', '268': 'Asia',
  '792': 'Asia', '196': 'Asia',
}

const REGION_COLORS = {
  'North America': '#0ea5e9',
  'Europe':        '#6366f1',
  'Asia':          '#10b981',
  'South America': '#f59e0b',
  'Other Regions': '#8b5cf6',
}

const REGION_ICONS = {
  'North America': '🌎',
  'Europe':        '🌍',
  'Asia':          '🌏',
  'South America': '🌎',
  'Other Regions': '🌐',
}

// Derived from actual mock data — always in sync with the 100 claims
const REGION_DATA = ['North America', 'Europe', 'Asia', 'South America', 'Other Regions'].map(region => {
  const rc      = mockClaims.filter(c => c.region === region)
  const total   = rc.length
  const open    = rc.filter(c => c.status === 'Open').length
  const closed  = rc.filter(c => c.status === 'Closed').length
  const pending = rc.filter(c => c.status === 'Pending').length
  return {
    region,
    icon:    REGION_ICONS[region],
    color:   REGION_COLORS[region],
    claims:  total,
    open,
    closed,
    pending,
    rate: total > 0 ? `${Math.round((closed / total) * 100)}%` : '0%',
  }
})

const MAX_CLAIMS = Math.max(...REGION_DATA.map(r => r.claims))

export default function ClaimsByRegionMap() {
  const [hoveredRegion, setHoveredRegion] = useState(null)
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null })

  const getCountryRegion = (geo) => {
    const id = String(geo.id).padStart(3, '0')
    return COUNTRY_TO_REGION[id] || 'Other Regions'
  }

  const getCountryColor = (geo) => {
    const region = getCountryRegion(geo)
    if (hoveredRegion && hoveredRegion !== region) return '#e2e8f0'
    if (hoveredRegion === region) return '#ffd700'
    return REGION_COLORS[region] || '#94a3b8'
  }

  const handleMouseEnter = (geo, evt) => {
    const region = getCountryRegion(geo)
    const data = REGION_DATA.find(r => r.region === region)
    setHoveredRegion(region)
    setTooltip({
      visible: true,
      x: evt.clientX,
      y: evt.clientY,
      data: { region, ...data }
    })
  }

  const handleMouseMove = (evt) => {
    if (tooltip.visible) {
      setTooltip(prev => ({ ...prev, x: evt.clientX, y: evt.clientY }))
    }
  }

  const handleMouseLeave = () => {
    setHoveredRegion(null)
    setTooltip({ visible: false, x: 0, y: 0, data: null })
  }

  return (
    <div className="region-map-card">
      <div className="region-map-header">
        <div>
          <h3>Claims by Region</h3>
          <p>Active claims distribution by geographic region</p>
        </div>
        <span className="region-map-badge">Last 30 days</span>
      </div>

      <div className="region-map-body">
        {/* Left: Table */}
        <div className="region-table">
          {REGION_DATA.map((row) => (
            <div
              key={row.region}
              className={`region-row ${hoveredRegion === row.region ? 'highlighted' : ''}`}
              onMouseEnter={() => setHoveredRegion(row.region)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <div className="region-name">
                <span className="region-icon">{row.icon}</span>
                <span>{row.region}</span>
              </div>
              <div className="region-claims">
                <strong>{row.claims}</strong>
                <span className="region-sub">claims</span>
              </div>
              <div className="region-bar-wrap">
                <div
                  className="region-bar"
                  style={{
                    width: `${(row.claims / MAX_CLAIMS) * 100}%`,
                    background: row.color
                  }}
                />
              </div>
              <div className="region-rate">{row.rate}</div>
            </div>
          ))}
        </div>

        {/* Right: Map */}
        <div className="region-map-wrap" onMouseMove={handleMouseMove}>
          <ComposableMap
            projectionConfig={{ scale: 185, center: [10, 0] }}
            style={{ width: '100%', height: '100%' }}
            viewBox="0 30 800 420"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo)}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none', transition: 'fill 0.2s' },
                      hover:   { outline: 'none', fill: '#ffd700', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="map-tooltip"
          style={{ left: tooltip.x + 12, top: tooltip.y - 80, position: 'fixed' }}
        >
          <div className="tooltip-region">{tooltip.data.icon} {tooltip.data.region}</div>
          <div className="tooltip-row"><span>Total Claims</span><strong>{tooltip.data.claims}</strong></div>
          <div className="tooltip-row"><span>Open</span><strong className="open">{tooltip.data.open}</strong></div>
          <div className="tooltip-row"><span>Closed</span><strong className="closed">{tooltip.data.closed}</strong></div>
          <div className="tooltip-row"><span>Pending</span><strong>{tooltip.data.pending}</strong></div>
          <div className="tooltip-row"><span>Resolution</span><strong>{tooltip.data.rate}</strong></div>
        </div>
      )}
    </div>
  )
}
