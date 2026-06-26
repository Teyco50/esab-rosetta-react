const TYPES    = ['Material Defect', 'Product Quality', 'Delivery Issue', 'Technical Support']
const REGIONS  = ['North America', 'Europe', 'Asia', 'South America', 'Other Regions']

const SITES_BY_REGION = {
  'North America':  ['Mexico City', 'Toronto', 'Houston', 'Chicago', 'Los Angeles', 'New York', 'Monterrey'],
  'Europe':         ['Madrid', 'London', 'Paris', 'Amsterdam', 'Milan', 'Frankfurt', 'Warsaw'],
  'Asia':           ['Tokyo', 'Singapore', 'Seoul', 'Mumbai', 'Shanghai', 'Bangkok', 'Kuala Lumpur'],
  'South America':  ['São Paulo', 'Buenos Aires', 'Lima', 'Bogotá', 'Santiago', 'Caracas', 'Medellín'],
  'Other Regions':  ['Dubai', 'Cairo', 'Sydney', 'Johannesburg', 'Lagos', 'Istanbul', 'Nairobi'],
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

// Distribution per cycle of 12: Open×3, Closed×3, Pending×2, On Hold×1, Analysis×2, Corrective Action×1
const STATUS_CYCLE = ['Open', 'Open', 'Open', 'Closed', 'Closed', 'Closed', 'Pending', 'Pending', 'On Hold', 'Analysis', 'Analysis', 'Corrective Action']

const p = (arr, i) => arr[Math.abs(i) % arr.length]
const fullName = (i) => `${p(FIRST_NAMES, i)} ${p(LAST_NAMES, i + 7)}`

export const mockClaims = Array.from({ length: 100 }, (_, i) => {
  const num    = String(i + 1).padStart(3, '0')
  const region = p(REGIONS, i + 2)
  const sites  = SITES_BY_REGION[region]
  return {
    id:            `CLM-${num}`,
    type:          p(TYPES, i),
    status:        STATUS_CYCLE[i % 10],
    site:          p(sites, i),
    product:       p(PRODUCTS, i),
    reportedBy:    fullName(i),
    assignedTo:    fullName(i + 3),
    qaCoordinator: fullName(i + 9),
    timeElapsed:   `${(i % 18) + 1} days`,
    rmaNum:        `RMA-2024-${num}`,
    invoice:       `INV-${num}`,
    shipmentNum:   `SHIP-${num}`,
    creditNote:    `CN-${num}`,
    tasks:         (i % 7) + 1,
    region,
  }
})

// First 10 claims are "assigned to current user"
export const getClaimsByUser = (_username) => mockClaims.slice(0, 10)

export const getClaimById = (id) => mockClaims.find(c => c.id === id)

export const getDashboardStats = (username) => {
  const uc = getClaimsByUser(username)
  return {
    openClaims:    uc.filter(c => c.status === 'Open').length,
    closedClaims:  uc.filter(c => c.status === 'Closed').length,
    pendingClaims: uc.filter(c => c.status === 'Pending').length,
    ytdClaims:     uc.length,
  }
}

export const getGlobalStats = () => ({
  open:              mockClaims.filter(c => c.status === 'Open').length,
  closed:            mockClaims.filter(c => c.status === 'Closed').length,
  pending:           mockClaims.filter(c => c.status === 'Pending').length,
  onHold:            mockClaims.filter(c => c.status === 'On Hold').length,
  analysis:          mockClaims.filter(c => c.status === 'Analysis').length,
  correctiveAction:  mockClaims.filter(c => c.status === 'Corrective Action').length,
})

export const getChartData = (username) => {
  const uc = getClaimsByUser(username)
  return {
    barChart: {
      labels: ['Open', 'Closed', 'Pending', 'On Hold'],
      datasets: [{
        label: 'Claims by Status',
        data: [
          uc.filter(c => c.status === 'Open').length,
          uc.filter(c => c.status === 'Closed').length,
          uc.filter(c => c.status === 'Pending').length,
          uc.filter(c => c.status === 'On Hold').length,
        ],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6'],
      }],
    },
  }
}
