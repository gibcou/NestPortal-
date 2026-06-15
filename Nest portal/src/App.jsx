import { useState } from 'react'
import { USERS, INITIAL_WORK_ORDERS, INITIAL_INSPECTIONS, INITIAL_NOTIFICATIONS } from './constants.js'
import { genId } from './utils/idgen.js'

import PublicLayout from './components/layout/PublicLayout.jsx'
import LoginPage from './components/auth/LoginPage.jsx'
import PricingPage from './components/public/PricingPage.jsx'
import TenantPortal from './components/tenant/TenantPortal.jsx'
import AdminDashboard from './components/admin/AdminDashboard.jsx'
import VendorDashboard from './components/vendor/VendorDashboard.jsx'
import Toast from './components/shared/Toast.jsx'

export default function App() {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null)
  const [loginError, setLoginError] = useState(null)
  const [publicView, setPublicView] = useState('login') // 'login' | 'pricing'

  // ── Navigation ────────────────────────────────────────────────────────────
  const [tenantView, setTenantView] = useState('dashboard')
  const [adminView, setAdminView]   = useState('dashboard')
  const [vendorView, setVendorView] = useState('dashboard')

  // ── Data ──────────────────────────────────────────────────────────────────
  const [workOrders, setWorkOrders]     = useState(INITIAL_WORK_ORDERS)
  const [inspections, setInspections]   = useState(INITIAL_INSPECTIONS)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  // ── UI ────────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null)

  // ── Helpers ───────────────────────────────────────────────────────────────
  function showToast(message, type = 'success') {
    setToast({ message, type })
  }

  function currentUserNotifications() {
    if (!currentUser) return []
    if (currentUser.role === 'admin') return notifications.admin
    if (currentUser.role === 'vendor') return notifications.vendors[currentUser.email] ?? []
    return []
  }

  // ── Auth Handlers ─────────────────────────────────────────────────────────
  function handleLogin(email) {
    const trimmed = email.trim().toLowerCase()
    const user = USERS[trimmed]
    if (!user) {
      setLoginError('No account found for that email. Try tenant1–3, admin1–2, or vendor1–2 @nest.com')
      return
    }
    setCurrentUser({ email: trimmed, role: user.role })
    setLoginError(null)
  }

  function handleLogout() {
    setCurrentUser(null)
    setLoginError(null)
    setPublicView('login')
    setTenantView('dashboard')
    setAdminView('dashboard')
    setVendorView('dashboard')
    setToast(null)
  }

  // ── Maintenance Handlers ──────────────────────────────────────────────────
  function handleSubmitMaintenance({ title, description, priority }) {
    const user = USERS[currentUser.email]
    const wo = {
      id: genId('wo'),
      tenantEmail: currentUser.email,
      unit: user.unit,
      title,
      description,
      priority,
      status: 'Open',
      assignedTo: null,
      notes: [],
      createdAt: new Date().toISOString(),
    }
    setWorkOrders(prev => [wo, ...prev])
    showToast('Maintenance request submitted successfully.')
  }

  // ── Inspection Handlers ───────────────────────────────────────────────────
  function handleCompleteFinalWalkthrough(inspectionId) {
    const now = new Date().toISOString()
    let inspectionUnit = null
    let tenantName = null

    const updatedInspections = inspections.map(insp => {
      if (insp.id !== inspectionId) return insp
      inspectionUnit = insp.unit
      tenantName = USERS[insp.tenantEmail]?.name ?? insp.tenantEmail
      return { ...insp, status: 'Completed', completedAt: now }
    })

    if (!inspectionUnit) return

    const msg = `Tenant ${tenantName} completed Final Walkthrough for Unit ${inspectionUnit}`

    // Collect vendors assigned to any work order in this unit
    const assignedVendors = [
      ...new Set(
        workOrders
          .filter(wo => wo.unit === inspectionUnit && wo.assignedTo)
          .map(wo => wo.assignedTo)
      ),
    ]

    const adminNotif = { id: genId('notif'), message: msg, read: false, createdAt: now }

    const updatedVendors = { ...notifications.vendors }
    for (const vendorEmail of assignedVendors) {
      const vendorNotif = { id: genId('notif'), message: msg, read: false, createdAt: now }
      updatedVendors[vendorEmail] = [vendorNotif, ...(updatedVendors[vendorEmail] ?? [])]
    }

    setInspections(updatedInspections)
    setNotifications({
      admin: [adminNotif, ...notifications.admin],
      vendors: updatedVendors,
    })
    showToast('Final walkthrough submitted. Admin and assigned vendors have been notified.')
  }

  // ── Work Order Handlers ───────────────────────────────────────────────────
  function handleAssignWorkOrder(workOrderId, vendorEmail) {
    setWorkOrders(prev =>
      prev.map(wo =>
        wo.id === workOrderId
          ? { ...wo, assignedTo: vendorEmail || null }
          : wo
      )
    )
  }

  function handleUpdateWorkOrderStatus(workOrderId, status) {
    setWorkOrders(prev =>
      prev.map(wo =>
        wo.id === workOrderId ? { ...wo, status } : wo
      )
    )
  }

  function handleAddNote(workOrderId, text) {
    if (!text.trim()) return
    const note = {
      author: currentUser.email,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    setWorkOrders(prev =>
      prev.map(wo =>
        wo.id === workOrderId
          ? { ...wo, notes: [...wo.notes, note] }
          : wo
      )
    )
  }

  // ── Notification Handlers ─────────────────────────────────────────────────
  function handleMarkNotificationRead(notifId) {
    if (!currentUser) return
    if (currentUser.role === 'admin') {
      setNotifications(prev => ({
        ...prev,
        admin: prev.admin.map(n => n.id === notifId ? { ...n, read: true } : n),
      }))
    } else if (currentUser.role === 'vendor') {
      setNotifications(prev => ({
        ...prev,
        vendors: {
          ...prev.vendors,
          [currentUser.email]: (prev.vendors[currentUser.email] ?? []).map(n =>
            n.id === notifId ? { ...n, read: true } : n
          ),
        },
      }))
    }
  }

  function handleMarkAllNotificationsRead() {
    if (!currentUser) return
    if (currentUser.role === 'admin') {
      setNotifications(prev => ({
        ...prev,
        admin: prev.admin.map(n => ({ ...n, read: true })),
      }))
    } else if (currentUser.role === 'vendor') {
      setNotifications(prev => ({
        ...prev,
        vendors: {
          ...prev.vendors,
          [currentUser.email]: (prev.vendors[currentUser.email] ?? []).map(n => ({ ...n, read: true })),
        },
      }))
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const userNotifications = currentUserNotifications()

  if (!currentUser) {
    return (
      <PublicLayout
        publicView={publicView}
        onNavigate={setPublicView}
      >
        {publicView === 'pricing' ? (
          <PricingPage onNavigateToLogin={() => setPublicView('login')} />
        ) : (
          <LoginPage
            onLogin={handleLogin}
            loginError={loginError}
            onNavigateToPricing={() => setPublicView('pricing')}
          />
        )}
      </PublicLayout>
    )
  }

  const sharedProps = {
    currentUser,
    workOrders,
    inspections,
    notifications: userNotifications,
    onLogout: handleLogout,
    onMarkNotificationRead: handleMarkNotificationRead,
    onMarkAllNotificationsRead: handleMarkAllNotificationsRead,
  }

  return (
    <>
      {currentUser.role === 'tenant' && (
        <TenantPortal
          {...sharedProps}
          activeView={tenantView}
          onNavigate={setTenantView}
          onSubmitMaintenance={handleSubmitMaintenance}
          onCompleteFinalWalkthrough={handleCompleteFinalWalkthrough}
        />
      )}
      {currentUser.role === 'admin' && (
        <AdminDashboard
          {...sharedProps}
          activeView={adminView}
          onNavigate={setAdminView}
          onAssignWorkOrder={handleAssignWorkOrder}
          onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
        />
      )}
      {currentUser.role === 'vendor' && (
        <VendorDashboard
          {...sharedProps}
          activeView={vendorView}
          onNavigate={setVendorView}
          onUpdateWorkOrderStatus={handleUpdateWorkOrderStatus}
          onAddNote={handleAddNote}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
