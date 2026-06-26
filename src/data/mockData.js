const TYPES   = ['Material Defect', 'Product Quality', 'Delivery Issue', 'Technical Support']
const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Other Regions']

const SITES_BY_REGION = {
  'North America': ['Mexico City', 'Toronto', 'Houston', 'Chicago', 'Los Angeles', 'New York', 'Monterrey'],
  'Europe':        ['Madrid', 'London', 'Paris', 'Amsterdam', 'Milan', 'Frankfurt', 'Warsaw'],
  'Asia':          ['Tokyo', 'Singapore', 'Seoul', 'Mumbai', 'Shanghai', 'Bangkok', 'Kuala Lumpur'],
  'South America': ['São Paulo', 'Buenos Aires', 'Lima', 'Bogotá', 'Santiago', 'Caracas', 'Medellín'],
  'Other Regions': ['Dubai', 'Cairo', 'Sydney', 'Johannesburg', 'Lagos', 'Istanbul', 'Nairobi'],
}

const PRODUCTS = [
  'Cutting System', 'Electrode Wire', 'Welding System', 'Control Panel', 'Filler Metal',
  'Gas System', 'Consumables', 'Power Supply', 'Spares Kit', 'Equipment',
  'MIG Welder', 'TIG Torch', 'Plasma Cutter', 'Wire Feed', 'Welding Helmet',
]

const FIRST_NAMES = [
  'John', 'Maria', 'Carlos', 'Ana', 'Miguel', 'Sofia', 'Hiroshi', 'Yuki', 'David', 'Jennifer',
  'James', 'Emma', 'Rajesh', 'Priya', 'Diego', 'Isabel', 'Michael', 'Sarah', 'Ahmed', 'Fatima',
  'Pierre', 'Claire', 'Hans', 'Greta', 'Luca', 'Elena', 'Wei', 'Lin', 'Ravi', 'Aisha',
]

const LAST_NAMES = [
  'Smith', 'Garcia', 'Santos', 'Silva', 'Hernandez', 'Moreno', 'Tanaka', 'Yamamoto', 'Johnson', 'Lee',
  'Wilson', 'Thompson', 'Kumar', 'Patel', 'Martinez', 'Rodriguez', 'Brown', 'Miller', 'Al-Mansouri',
  'Al-Mazrouei', 'Dupont', 'Martin', 'Müller', 'Schmidt', 'Rossi', 'Ferrari', 'Nakamura', 'Park', 'Singh', 'Hassan',
]

// Cycle of 12 — proper distribution across all 6 statuses
const STATUS_CYCLE = [
  'Open', 'Open', 'Open',
  'Closed', 'Closed', 'Closed',
  'Pending', 'Pending',
  'On Hold',
  'Analysis', 'Analysis',
  'Corrective Action',
]

const p = (arr, i) => arr[Math.abs(i) % arr.length]
const fullName = (i) => `${p(FIRST_NAMES, i)} ${p(LAST_NAMES, i + 7)}`

// ─── Mock Users ────────────────────────────────────────────────────────────────
// Roles determine data visibility:
//   Admin           → all 100 claims
//   QA Coordinator  → claims where qaCoordinator === name
//   Claims Agent    → claims where assignedTo === name
//   Viewer          → claims where reportedBy === name
// ────────────────────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { email: 'admin@esab.com',            name: 'Carlos Garcia',  role: 'Admin' },
  { email: 'qa@esab.com',               name: 'Maria Santos',   role: 'QA Coordinator' },
  { email: 'agent@esab.com',            name: 'John Smith',     role: 'Claims Agent' },
  { email: 'agent2@esab.com',           name: 'Diego Martinez', role: 'Claims Agent' },
  { email: 'support@esabrosetta.com',   name: 'Ana Silva',      role: 'Claims Agent' },
]

export const getUserByEmail = (email) =>
  MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
  { email, name: email.split('@')[0], role: 'Claims Agent' }

// Names seeded into claims so role-based filtering returns meaningful subsets
const AGENT_NAMES = ['John Smith', 'Diego Martinez', 'Ana Silva']  // ~25 each
const QA_NAME     = 'Maria Santos'                                  // every 3rd claim

export const mockClaims = Array.from({ length: 100 }, (_, i) => {
  const num    = String(i + 1).padStart(3, '0')
  const region = p(REGIONS, i + 2)
  const sites  = SITES_BY_REGION[region]

  // 75 claims go to seeded agents (25 each), 25 to generated names
  const assignedTo    = i % 4 < 3 ? AGENT_NAMES[i % 3] : fullName(i + 3)
  // Every 3rd claim goes to the seeded QA coordinator
  const qaCoordinator = i % 3 === 0 ? QA_NAME : fullName(i + 9)

  return {
    id:            `CLM-${num}`,
    type:          p(TYPES, i),
    status:        STATUS_CYCLE[i % 12],
    site:          p(sites, i),
    product:       p(PRODUCTS, i),
    reportedBy:    fullName(i),
    assignedTo,
    qaCoordinator,
    timeElapsed:   `${(i % 18) + 1} days`,
    rmaNum:        `RMA-2024-${num}`,
    invoice:       `INV-${num}`,
    shipmentNum:   `SHIP-${num}`,
    creditNote:    `CN-${num}`,
    tasks:         (i % 7) + 1,
    region,
  }
})

// ─── Role-based access ────────────────────────────────────────────────────────
export const getClaimsByUser = (userInfo) => {
  if (!userInfo) return []
  const { name, role } = userInfo
  switch (role) {
    case 'Admin':          return mockClaims
    case 'QA Coordinator': return mockClaims.filter(c => c.qaCoordinator === name)
    case 'Viewer':         return mockClaims.filter(c => c.reportedBy === name)
    default:               return mockClaims.filter(c => c.assignedTo === name)
  }
}

export const getClaimById = (id) => mockClaims.find(c => c.id === id)

export const getDashboardStats = (userInfo) => {
  const uc = getClaimsByUser(userInfo)
  return {
    openClaims:    uc.filter(c => c.status === 'Open').length,
    closedClaims:  uc.filter(c => c.status === 'Closed').length,
    pendingClaims: uc.filter(c => c.status === 'Pending').length,
    ytdClaims:     uc.length,
  }
}

export const getGlobalStats = () => ({
  open:             mockClaims.filter(c => c.status === 'Open').length,
  closed:           mockClaims.filter(c => c.status === 'Closed').length,
  pending:          mockClaims.filter(c => c.status === 'Pending').length,
  onHold:           mockClaims.filter(c => c.status === 'On Hold').length,
  analysis:         mockClaims.filter(c => c.status === 'Analysis').length,
  correctiveAction: mockClaims.filter(c => c.status === 'Corrective Action').length,
})

export const getChartData = (userInfo) => {
  const uc = getClaimsByUser(userInfo)
  return {
    barChart: {
      labels: ['Open', 'Closed', 'Pending', 'On Hold', 'Analysis', 'Corrective Action'],
      datasets: [{
        label: 'My Claims by Status',
        data: [
          uc.filter(c => c.status === 'Open').length,
          uc.filter(c => c.status === 'Closed').length,
          uc.filter(c => c.status === 'Pending').length,
          uc.filter(c => c.status === 'On Hold').length,
          uc.filter(c => c.status === 'Analysis').length,
          uc.filter(c => c.status === 'Corrective Action').length,
        ],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#0891b2', '#16a34a'],
      }],
    },
  }
}
