import { USERS } from '../../constants.js'
import Sidebar from '../layout/Sidebar.jsx'
import Header from '../layout/Header.jsx'
import VendorWorkOrders from './VendorWorkOrders.jsx'

const NAV_ITEMS = [
  { view: 'dashboard',   label: 'Dashboard',  icon: 'dashboard' },
  { view: 'work-orders', label: 'Work Orders', icon: 'maintenance' },
]

const PAGE_TITLES = {
  dashboard:     'Vendor Dashboard',
  'work-orders': 'My Work Orders',
}

export default function VendorDashboard({
  currentUser, workOrders, notifications,
  activeView, onNavigate, onLogout,
  onUpdateWorkOrderStatus, onAddNote,
  onMarkNotificationRead, onMarkAllNotificationsRead,
}) {
  const myWorkOrders = workOrders.filter(wo => wo.assignedTo === currentUser.email)
  const openCount = myWorkOrders.filter(wo => wo.status === 'Open').length
  const inProgressCount = myWorkOrders.filter(wo => wo.status === 'In Progress').length
  const completedCount = myWorkOrders.filter(wo => wo.status === 'Completed').length

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
      case 'work-orders':
        return (
          <VendorWorkOrders
            workOrders={myWorkOrders}
            currentUser={currentUser}
            onUpdateStatus={onUpdateWorkOrderStatus}
            onAddNote={onAddNote}
          />
        )
      default:
        return (
          <div className="space-y-6">
            {/* Welcome */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(15,10,30,1) 70%)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <h2 className="text-xl font-semibold" style={{ color: '#EDE9FE' }}>
                Welcome, {USERS[currentUser.email]?.name ?? currentUser.email}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#A78BFA' }}>Maintenance Vendor Portal</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1A1130', border: `1px solid ${openCount > 0 ? 'rgba(234,179,8,0.3)' : 'rgba(124,58,237,0.15)'}` }}
              >
                <p className="text-3xl font-bold" style={{ color: openCount > 0 ? '#FCD34D' : '#EDE9FE' }}>{openCount}</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#6B5E8A' }}>Open</p>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1A1130', border: `1px solid ${inProgressCount > 0 ? 'rgba(59,130,246,0.3)' : 'rgba(124,58,237,0.15)'}` }}
              >
                <p className="text-3xl font-bold" style={{ color: inProgressCount > 0 ? '#93C5FD' : '#EDE9FE' }}>{inProgressCount}</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#6B5E8A' }}>In Progress</p>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
              >
                <p className="text-3xl font-bold" style={{ color: '#86EFAC' }}>{completedCount}</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#6B5E8A' }}>Completed</p>
              </div>
            </div>

            {/* Work orders list */}
            {myWorkOrders.length === 0 ? (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
              >
                <p className="text-sm" style={{ color: '#6B5E8A' }}>No work orders assigned to you yet.</p>
                <p className="text-xs mt-1" style={{ color: '#3D2E5C' }}>Check back once the admin assigns orders.</p>
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#EDE9FE' }}>Assigned Work Orders</h3>
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
                <div className="space-y-1">
                  {myWorkOrders.slice(0, 5).map(wo => (
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
                        style={{
                          background: statusBg(wo.status),
                          color: statusColor(wo.status),
                          border: `1px solid ${statusBorder(wo.status)}`,
                        }}
                      >
                        {wo.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
