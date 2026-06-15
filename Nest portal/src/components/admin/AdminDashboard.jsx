import { UNITS, USERS } from '../../constants.js'
import Sidebar from '../layout/Sidebar.jsx'
import Header from '../layout/Header.jsx'
import UnitsOverview from './UnitsOverview.jsx'
import WorkOrdersTable from './WorkOrdersTable.jsx'
import InspectionsList from './InspectionsList.jsx'

const NAV_ITEMS = [
  { view: 'dashboard',   label: 'Dashboard',  icon: 'dashboard' },
  { view: 'units',       label: 'Units',       icon: 'units' },
  { view: 'work-orders', label: 'Work Orders', icon: 'maintenance' },
  { view: 'inspections', label: 'Inspections', icon: 'inspections' },
]

const PAGE_TITLES = {
  dashboard:    'Admin Dashboard',
  units:        'Units Overview',
  'work-orders':'Work Orders',
  inspections:  'Inspections',
}

export default function AdminDashboard({
  currentUser, workOrders, inspections, notifications,
  activeView, onNavigate, onLogout,
  onAssignWorkOrder, onUpdateWorkOrderStatus,
  onMarkNotificationRead, onMarkAllNotificationsRead,
}) {
  const openWOs = workOrders.filter(wo => wo.status === 'Open').length
  const inProgressWOs = workOrders.filter(wo => wo.status === 'In Progress').length
  const pendingInspections = inspections.filter(i => i.status === 'Scheduled').length
  const unassignedWOs = workOrders.filter(wo => wo.assignedTo === null && wo.status !== 'Completed').length

  function statusColor(status) {
    if (status === 'Completed') return '#86EFAC'
    if (status === 'In Progress') return '#93C5FD'
    return '#FCD34D'
  }
  function statusBg(status) {
    if (status === 'Completed') return 'rgba(34,197,94,0.12)'
    if (status === 'In Progress') return 'rgba(59,130,246,0.12)'
    return 'rgba(234,179,8,0.12)'
  }
  function statusBorder(status) {
    if (status === 'Completed') return 'rgba(34,197,94,0.25)'
    if (status === 'In Progress') return 'rgba(59,130,246,0.25)'
    return 'rgba(234,179,8,0.25)'
  }

  function renderContent() {
    switch (activeView) {
      case 'units':
        return <UnitsOverview units={UNITS} workOrders={workOrders} inspections={inspections} />
      case 'work-orders':
        return <WorkOrdersTable workOrders={workOrders} onAssign={onAssignWorkOrder} onUpdateStatus={onUpdateWorkOrderStatus} />
      case 'inspections':
        return <InspectionsList inspections={inspections} />
      default:
        return (
          <div className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Units" value={UNITS.length} accent="#7C3AED" />
              <StatCard label="Open Orders" value={openWOs} accent={openWOs > 0 ? '#F97316' : '#22C55E'} />
              <StatCard label="In Progress" value={inProgressWOs} accent="#3B82F6" />
              <StatCard label="Pending Inspections" value={pendingInspections} accent="#A78BFA" />
            </div>

            {/* Alert banner */}
            {unassignedWOs > 0 && (
              <div
                className="rounded-xl px-5 py-4 flex items-center gap-3"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#FDBA74' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: '#FDBA74' }}>
                  {unassignedWOs} work order{unassignedWOs > 1 ? 's' : ''} need{unassignedWOs === 1 ? 's' : ''} vendor assignment.{' '}
                  <button onClick={() => onNavigate('work-orders')} className="underline hover:no-underline">Assign now</button>
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Recent work orders */}
              <div
                className="rounded-2xl p-6"
                style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#EDE9FE' }}>Recent Work Orders</h3>
                  <button
                    onClick={() => onNavigate('work-orders')}
                    className="text-xs font-medium transition-smooth"
                    style={{ color: '#A78BFA' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EDE9FE'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
                  >
                    View all
                  </button>
                </div>
                {workOrders.slice(0, 4).map(wo => (
                  <div
                    key={wo.id}
                    className="flex items-center justify-between py-2.5"
                    style={{ borderBottom: '1px solid rgba(124,58,237,0.08)' }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#C4B5FD' }}>{wo.title}</p>
                      <p className="text-xs" style={{ color: '#6B5E8A' }}>Unit {wo.unit}</p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: statusBg(wo.status), color: statusColor(wo.status), border: `1px solid ${statusBorder(wo.status)}` }}
                    >
                      {wo.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Units summary */}
              <div
                className="rounded-2xl p-6"
                style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#EDE9FE' }}>Units Summary</h3>
                  <button
                    onClick={() => onNavigate('units')}
                    className="text-xs font-medium transition-smooth"
                    style={{ color: '#A78BFA' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EDE9FE'}
                    onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
                  >
                    View all
                  </button>
                </div>
                {UNITS.map(unit => {
                  const tenant = USERS[unit.tenant]
                  const openCount = workOrders.filter(wo => wo.unit === unit.id && wo.status !== 'Completed').length
                  return (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: '1px solid rgba(124,58,237,0.08)' }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#C4B5FD' }}>Unit {unit.id}</p>
                        <p className="text-xs" style={{ color: '#6B5E8A' }}>{tenant?.name}</p>
                      </div>
                      {openCount > 0 ? (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(234,179,8,0.12)', color: '#FCD34D', border: '1px solid rgba(234,179,8,0.25)' }}
                        >
                          {openCount} open
                        </span>
                      ) : (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}
                        >
                          All clear
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen" style={{ background: '#0F0A1E' }}>
      <Sidebar
        navItems={NAV_ITEMS}
        activeView={activeView}
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={PAGE_TITLES[activeView] ?? 'Dashboard'}
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
        />
        <main className="flex-1 overflow-y-auto p-6" style={{ background: '#0F0A1E' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
    >
      <p className="text-3xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="text-sm font-medium mt-1" style={{ color: '#6B5E8A' }}>{label}</p>
    </div>
  )
}
