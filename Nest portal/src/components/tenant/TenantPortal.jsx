import { USERS } from '../../constants.js'
import Sidebar from '../layout/Sidebar.jsx'
import Header from '../layout/Header.jsx'
import PayRent from './PayRent.jsx'
import MaintenanceForm from './MaintenanceForm.jsx'
import InspectionsPanel from './InspectionsPanel.jsx'
import UnitTour from './UnitTour.jsx'
import Documents from './Documents.jsx'

const NAV_ITEMS = [
  { view: 'dashboard',   label: 'Dashboard',   icon: 'dashboard' },
  { view: 'pay-rent',    label: 'Pay Rent',     icon: 'pay-rent' },
  { view: 'maintenance', label: 'Maintenance',  icon: 'maintenance' },
  { view: 'inspections', label: 'Inspections',  icon: 'inspections' },
  { view: 'tour',        label: 'Unit Tour',    icon: 'tour' },
  { view: 'documents',   label: 'Documents',    icon: 'documents' },
]

const PAGE_TITLES = {
  dashboard:   'Dashboard',
  'pay-rent':  'Pay Rent',
  maintenance: 'Maintenance Requests',
  inspections: 'Inspections',
  tour:        'Unit Tour',
  documents:   'Documents',
}

export default function TenantPortal({
  currentUser, workOrders, inspections, notifications,
  activeView, onNavigate, onLogout,
  onSubmitMaintenance, onCompleteFinalWalkthrough,
  onMarkNotificationRead, onMarkAllNotificationsRead,
}) {
  const user = USERS[currentUser.email]
  const myWorkOrders = workOrders.filter(wo => wo.tenantEmail === currentUser.email)
  const myInspections = inspections.filter(i => i.tenantEmail === currentUser.email)

  const openWOs = myWorkOrders.filter(wo => wo.status !== 'Completed').length
  const nextInsp = myInspections
    .filter(i => i.status === 'Scheduled')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))[0]

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
      case 'pay-rent':    return <PayRent />
      case 'maintenance': return <MaintenanceForm workOrders={myWorkOrders} onSubmit={onSubmitMaintenance} />
      case 'inspections': return <InspectionsPanel inspections={myInspections} currentUser={currentUser} onCompleteInspection={onCompleteFinalWalkthrough} />
      case 'tour':        return <UnitTour currentUser={currentUser} />
      case 'documents':   return <Documents />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome card */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(167,139,250,0.08) 100%)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}
            >
              <h2 className="text-xl font-semibold" style={{ color: '#EDE9FE' }}>
                Welcome back, {user?.name ?? currentUser.email}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#A78BFA' }}>
                Unit {user?.unit} · {user?.unit === '101' ? '101 Nest Ave' : user?.unit === '102' ? '102 Nest Ave' : '103 Nest Ave'}
              </p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Rent Due" value="$1,250" sub="Due Jul 1, 2026" accent="#7C3AED" onClick={() => onNavigate('pay-rent')} />
              <StatCard label="Open Requests" value={openWOs} sub="maintenance issues" accent={openWOs > 0 ? '#F97316' : '#22C55E'} onClick={() => onNavigate('maintenance')} />
              <StatCard label="Next Inspection" value={nextInsp ? nextInsp.scheduledDate : 'None'} sub={nextInsp ? nextInsp.type : 'all clear'} accent="#A78BFA" onClick={() => onNavigate('inspections')} />
            </div>

            {/* Recent work orders */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
            >
              <h3 className="font-semibold mb-4" style={{ color: '#EDE9FE' }}>Recent Maintenance Requests</h3>
              {myWorkOrders.length === 0 ? (
                <p className="text-sm" style={{ color: '#6B5E8A' }}>No requests yet.</p>
              ) : (
                <div className="space-y-2">
                  {myWorkOrders.slice(0, 3).map(wo => (
                    <div
                      key={wo.id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                      style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}
                    >
                      <span className="text-sm" style={{ color: '#C4B5FD' }}>{wo.title}</span>
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
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
              )}
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
          title={PAGE_TITLES[activeView] ?? 'Portal'}
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
        />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: '#0F0A1E' }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl p-5 text-left w-full transition-smooth"
      style={{
        background: '#1A1130',
        border: '1px solid rgba(124,58,237,0.15)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(124,58,237,0.1)'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#1A1130'
        e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'
      }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#6B5E8A' }}>{label}</p>
      <p className="text-2xl font-bold" style={{ color: accent }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: '#6B5E8A' }}>{sub}</p>
    </button>
  )
}
