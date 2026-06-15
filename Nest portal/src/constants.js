export const USERS = {
  'tenant1@nest.com': { role: 'tenant', unit: '101', name: 'Alex Rivera' },
  'tenant2@nest.com': { role: 'tenant', unit: '102', name: 'Jordan Lee' },
  'tenant3@nest.com': { role: 'tenant', unit: '103', name: 'Sam Patel' },
  'admin1@nest.com':  { role: 'admin',  name: 'Admin One' },
  'admin2@nest.com':  { role: 'admin',  name: 'Admin Two' },
  'vendor1@nest.com': { role: 'vendor', name: 'Vendor One' },
  'vendor2@nest.com': { role: 'vendor', name: 'Vendor Two' },
}

export const UNITS = [
  { id: '101', address: '101 Nest Ave, Unit 101', tenant: 'tenant1@nest.com' },
  { id: '102', address: '102 Nest Ave, Unit 102', tenant: 'tenant2@nest.com' },
  { id: '103', address: '103 Nest Ave, Unit 103', tenant: 'tenant3@nest.com' },
]

export const INITIAL_WORK_ORDERS = [
  {
    id: 'wo-1',
    tenantEmail: 'tenant1@nest.com',
    unit: '101',
    title: 'Leaking faucet in kitchen',
    description: 'The kitchen faucet drips constantly. Has been going on for a week.',
    priority: 'Medium',
    status: 'In Progress',
    assignedTo: 'vendor1@nest.com',
    notes: [
      { author: 'vendor1@nest.com', text: 'Assessed the issue. Parts ordered, will return Thursday.', createdAt: '2026-06-10T10:00:00Z' },
    ],
    createdAt: '2026-06-08T09:00:00Z',
  },
  {
    id: 'wo-2',
    tenantEmail: 'tenant2@nest.com',
    unit: '102',
    title: 'HVAC not cooling',
    description: 'AC unit stopped working. Temperature in unit is 82°F and rising.',
    priority: 'High',
    status: 'Open',
    assignedTo: null,
    notes: [],
    createdAt: '2026-06-12T14:30:00Z',
  },
  {
    id: 'wo-3',
    tenantEmail: 'tenant3@nest.com',
    unit: '103',
    title: 'Bathroom exhaust fan noise',
    description: 'Loud rattling noise from the exhaust fan. Happens constantly when on.',
    priority: 'Low',
    status: 'Completed',
    assignedTo: 'vendor2@nest.com',
    notes: [
      { author: 'vendor2@nest.com', text: 'Fan replaced with new unit. Confirmed working properly.', createdAt: '2026-06-05T16:00:00Z' },
    ],
    createdAt: '2026-06-01T11:00:00Z',
  },
]

export const INITIAL_INSPECTIONS = [
  {
    id: 'insp-1',
    tenantEmail: 'tenant1@nest.com',
    unit: '101',
    type: 'Regular',
    status: 'Completed',
    scheduledDate: '2026-05-20',
    completedAt: '2026-05-20T14:00:00Z',
    notes: 'No issues found. Unit in good condition.',
    uploadedFiles: [],
  },
  {
    id: 'insp-2',
    tenantEmail: 'tenant1@nest.com',
    unit: '101',
    type: 'Final Walkthrough',
    status: 'Scheduled',
    scheduledDate: '2026-06-30',
    completedAt: null,
    notes: '',
    uploadedFiles: [],
  },
  {
    id: 'insp-3',
    tenantEmail: 'tenant2@nest.com',
    unit: '102',
    type: 'Regular',
    status: 'Scheduled',
    scheduledDate: '2026-06-20',
    completedAt: null,
    notes: '',
    uploadedFiles: [],
  },
  {
    id: 'insp-4',
    tenantEmail: 'tenant3@nest.com',
    unit: '103',
    type: 'Regular',
    status: 'Completed',
    scheduledDate: '2026-06-03',
    completedAt: '2026-06-03T11:00:00Z',
    notes: 'Minor scuff on hallway wall. Tenant aware.',
    uploadedFiles: [],
  },
]

export const INITIAL_NOTIFICATIONS = {
  admin: [],
  vendors: {
    'vendor1@nest.com': [],
    'vendor2@nest.com': [],
  },
}
