export const mockClaims = [
  {
    id: 'CLM-001',
    type: 'Material Defect',
    status: 'Open',
    site: 'Mexico City',
    product: 'Cutting System',
    reportedBy: 'John Smith',
    assignedTo: 'Maria Garcia',
    qaCoordinator: 'Luis Rodriguez',
    timeElapsed: '5 days',
    rmaNum: 'RMA-2024-001',
    invoice: 'INV-001',
    shipmentNum: 'SHIP-001',
    creditNote: 'CN-001',
    tasks: 3,
    region: 'North America'
  },
  {
    id: 'CLM-002',
    type: 'Product Quality',
    status: 'Closed',
    site: 'São Paulo',
    product: 'Electrode Wire',
    reportedBy: 'Ana Silva',
    assignedTo: 'Carlos Santos',
    qaCoordinator: 'Fernando Costa',
    timeElapsed: '12 days',
    rmaNum: 'RMA-2024-002',
    invoice: 'INV-002',
    shipmentNum: 'SHIP-002',
    creditNote: 'CN-002',
    tasks: 5,
    region: 'South America'
  },
  {
    id: 'CLM-003',
    type: 'Delivery Issue',
    status: 'Open',
    site: 'Madrid',
    product: 'Welding System',
    reportedBy: 'Miguel Hernandez',
    assignedTo: 'Sofia Moreno',
    qaCoordinator: 'Pedro Lopez',
    timeElapsed: '3 days',
    rmaNum: 'RMA-2024-003',
    invoice: 'INV-003',
    shipmentNum: 'SHIP-003',
    creditNote: 'CN-003',
    tasks: 2,
    region: 'Europe'
  },
  {
    id: 'CLM-004',
    type: 'Technical Support',
    status: 'Pending',
    site: 'Tokyo',
    product: 'Control Panel',
    reportedBy: 'Hiroshi Tanaka',
    assignedTo: 'Yuki Yamamoto',
    qaCoordinator: 'Kenji Nakamura',
    timeElapsed: '8 days',
    rmaNum: 'RMA-2024-004',
    invoice: 'INV-004',
    shipmentNum: 'SHIP-004',
    creditNote: 'CN-004',
    tasks: 4,
    region: 'Asia'
  },
  {
    id: 'CLM-005',
    type: 'Material Defect',
    status: 'Closed',
    site: 'Toronto',
    product: 'Filler Metal',
    reportedBy: 'David Johnson',
    assignedTo: 'Jennifer Lee',
    qaCoordinator: 'Robert Brown',
    timeElapsed: '15 days',
    rmaNum: 'RMA-2024-005',
    invoice: 'INV-005',
    shipmentNum: 'SHIP-005',
    creditNote: 'CN-005',
    tasks: 6,
    region: 'North America'
  },
  {
    id: 'CLM-006',
    type: 'Product Quality',
    status: 'Open',
    site: 'London',
    product: 'Gas System',
    reportedBy: 'James Wilson',
    assignedTo: 'Emma Thompson',
    qaCoordinator: 'Oliver Davies',
    timeElapsed: '7 days',
    rmaNum: 'RMA-2024-006',
    invoice: 'INV-006',
    shipmentNum: 'SHIP-006',
    creditNote: 'CN-006',
    tasks: 3,
    region: 'Europe'
  },
  {
    id: 'CLM-007',
    type: 'Delivery Issue',
    status: 'Closed',
    site: 'Singapore',
    product: 'Consumables',
    reportedBy: 'Rajesh Kumar',
    assignedTo: 'Priya Patel',
    qaCoordinator: 'Vikram Singh',
    timeElapsed: '10 days',
    rmaNum: 'RMA-2024-007',
    invoice: 'INV-007',
    shipmentNum: 'SHIP-007',
    creditNote: 'CN-007',
    tasks: 2,
    region: 'Asia'
  },
  {
    id: 'CLM-008',
    type: 'Technical Support',
    status: 'Pending',
    site: 'Buenos Aires',
    product: 'Power Supply',
    reportedBy: 'Diego Martinez',
    assignedTo: 'Isabel Rodriguez',
    qaCoordinator: 'Antonio Garcia',
    timeElapsed: '4 days',
    rmaNum: 'RMA-2024-008',
    invoice: 'INV-008',
    shipmentNum: 'SHIP-008',
    creditNote: 'CN-008',
    tasks: 5,
    region: 'South America'
  },
  {
    id: 'CLM-009',
    type: 'Material Defect',
    status: 'On Hold',
    site: 'Sydney',
    product: 'Spares Kit',
    reportedBy: 'Michael Brown',
    assignedTo: 'Sarah Johnson',
    qaCoordinator: 'David Miller',
    timeElapsed: '6 days',
    rmaNum: 'RMA-2024-009',
    invoice: 'INV-009',
    shipmentNum: 'SHIP-009',
    creditNote: 'CN-009',
    tasks: 3,
    region: 'Asia'
  },
  {
    id: 'CLM-010',
    type: 'Product Quality',
    status: 'Closed',
    site: 'Dubai',
    product: 'Equipment',
    reportedBy: 'Ahmed Al-Mansouri',
    assignedTo: 'Fatima Al-Mazrouei',
    qaCoordinator: 'Hassan Al-Maktoum',
    timeElapsed: '11 days',
    rmaNum: 'RMA-2024-010',
    invoice: 'INV-010',
    shipmentNum: 'SHIP-010',
    creditNote: 'CN-010',
    tasks: 4,
    region: 'Other Regions'
  }
]

export const getClaimsByUser = (username) => {
  return mockClaims.slice(0, 5)
}

export const getClaimById = (id) => {
  return mockClaims.find(claim => claim.id === id)
}

export const getDashboardStats = (username) => {
  const userClaims = getClaimsByUser(username)
  return {
    openClaims:    userClaims.filter(c => c.status === 'Open').length,
    closedClaims:  userClaims.filter(c => c.status === 'Closed').length,
    pendingClaims: userClaims.filter(c => c.status === 'Pending').length,
    ytdClaims:     userClaims.length,
  }
}

export const getGlobalStats = () => {
  return {
    open:    mockClaims.filter(c => c.status === 'Open').length,
    closed:  mockClaims.filter(c => c.status === 'Closed').length,
    pending: mockClaims.filter(c => c.status === 'Pending').length,
    onHold:  mockClaims.filter(c => c.status === 'On Hold').length,
  }
}

export const getChartData = (username) => {
  const userClaims = getClaimsByUser(username)

  return {
    lineChart: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [{
        label: 'Claims Over Time',
        data: [2, 4, 3, 5, 4],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      }]
    },
    barChart: {
      labels: ['Open', 'Closed', 'Pending', 'On Hold'],
      datasets: [{
        label: 'Claims by Status',
        data: [userClaims.filter(c => c.status === 'Open').length, userClaims.filter(c => c.status === 'Closed').length, 2, 1],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    },
    donutChart: {
      labels: ['Material Defect', 'Product Quality', 'Delivery Issue', 'Technical Support'],
      datasets: [{
        data: [3, 2, 2, 2],
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
      }]
    }
  }
}
