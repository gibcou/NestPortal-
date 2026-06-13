import { useState, useRef } from 'react'

// ─── Users ────────────────────────────────────────────────────────────────────
const USERS = {
  'tenant1@test.com': { role: 'tenant', name: 'Alex Johnson',  unit: '101', building: 'Maple'  },
  'tenant2@test.com': { role: 'tenant', name: 'Maria Garcia',  unit: '202', building: 'Oak'    },
  'tenant3@test.com': { role: 'tenant', name: 'Sam Lee',       unit: '305', building: 'Pine'   },
  'admin1@test.com':  { role: 'admin',  name: 'Jordan Smith'                                    },
  'admin2@test.com':  { role: 'admin',  name: 'Casey Brown'                                     },
  'vendor1@test.com': { role: 'vendor', name: 'Mike Torres',   company: 'Torres HVAC & Plumbing'   },
  'vendor2@test.com': { role: 'vendor', name: 'Lisa Chen',     company: 'Chen Electrical Services' },
}

// ─── Seed data ────────────────────────────────────────────────────────────────
const INIT_WORK_ORDERS = [
  {
    id: 1, title: 'HVAC not cooling properly',
    unit: '101', building: 'Maple', tenantEmail: 'tenant1@test.com',
    description: 'AC runs but will not cool below 78°F even on max setting.',
    priority: 'high', status: 'open', assignedTo: null, notes: [],
    createdAt: 'Jun 10, 2026', updatedAt: 'Jun 10, 2026',
  },
  {
    id: 2, title: 'Leaking kitchen faucet',
    unit: '202', building: 'Oak', tenantEmail: 'tenant2@test.com',
    description: 'Faucet drips constantly even when fully closed.',
    priority: 'medium', status: 'assigned', assignedTo: 'vendor1@test.com',
    notes: ['Initial inspection done. Need replacement cartridge — ordering now.'],
    createdAt: 'Jun 11, 2026', updatedAt: 'Jun 12, 2026',
  },
  {
    id: 3, title: 'Electrical outlet not working',
    unit: '305', building: 'Pine', tenantEmail: 'tenant3@test.com',
    description: 'Living-room outlet stopped working after last storm.',
    priority: 'high', status: 'in_progress', assignedTo: 'vendor2@test.com',
    notes: ['Breaker was tripped; reset but outlet still dead.', 'Parts ordered, arriving Monday.'],
    createdAt: 'Jun 9, 2026', updatedAt: 'Jun 13, 2026',
  },
  {
    id: 4, title: 'Broken bedroom window latch',
    unit: '101', building: 'Maple', tenantEmail: 'tenant1@test.com',
    description: 'Latch is snapped; bedroom window will not lock.',
    priority: 'low', status: 'completed', assignedTo: 'vendor1@test.com',
    notes: ['Replaced latch mechanism. Window locks properly now.'],
    createdAt: 'Jun 5, 2026', updatedAt: 'Jun 7, 2026',
  },
]

const INIT_PAYMENTS = {
  'tenant1@test.com': [
    { id: 1, type: 'Rent',            amount: 1850, due: 'Jul 1, 2026',  paid: null,           status: 'due'     },
    { id: 2, type: 'Rent',            amount: 1850, due: 'Jun 1, 2026',  paid: 'Jun 1, 2026',  status: 'paid'    },
    { id: 3, type: 'Rent',            amount: 1850, due: 'May 1, 2026',  paid: 'May 1, 2026',  status: 'paid'    },
  ],
  'tenant2@test.com': [
    { id: 1, type: 'Rent',            amount: 2100, due: 'Jul 1, 2026',  paid: null,           status: 'due'     },
    { id: 2, type: 'Utility Balance', amount: 150,  due: 'May 15, 2026', paid: null,           status: 'overdue' },
    { id: 3, type: 'Rent',            amount: 2100, due: 'Jun 1, 2026',  paid: 'Jun 3, 2026',  status: 'paid'    },
  ],
  'tenant3@test.com': [
    { id: 1, type: 'Rent',            amount: 1650, due: 'Jul 1, 2026',  paid: null,           status: 'due'     },
    { id: 2, type: 'Rent',            amount: 1650, due: 'Jun 1, 2026',  paid: 'May 30, 2026', status: 'paid'    },
  ],
}

const INIT_DOCUMENTS = {
  'tenant1@test.com': [
    { id: 1, name: 'Lease Agreement 2025–2026.pdf', type: 'Lease',     date: 'Aug 15, 2025', size: '2.3 MB' },
    { id: 2, name: 'Move-In Checklist.pdf',          type: 'Inspection',date: 'Aug 20, 2025', size: '0.8 MB' },
    { id: 3, name: 'Community Rules & Regs.pdf',     type: 'Policy',    date: 'Aug 15, 2025', size: '1.1 MB' },
  ],
  'tenant2@test.com': [
    { id: 1, name: 'Lease Agreement 2025–2026.pdf', type: 'Lease',     date: 'Sep 1, 2025',  size: '2.3 MB' },
    { id: 2, name: 'Pet Policy Addendum.pdf',        type: 'Addendum',  date: 'Sep 1, 2025',  size: '0.4 MB' },
  ],
  'tenant3@test.com': [
    { id: 1, name: 'Lease Agreement 2026.pdf',       type: 'Lease',     date: 'Jan 1, 2026',  size: '2.3 MB' },
    { id: 2, name: 'Parking Permit.pdf',             type: 'Permit',    date: 'Jan 1, 2026',  size: '0.2 MB' },
  ],
}

const INIT_INSPECTIONS = [
  {
    id: 1, unit: '101', building: 'Maple', tenantEmail: 'tenant1@test.com',
    type: 'move_in', status: 'completed', completedAt: 'Aug 20, 2025',
    photos: ['entry_hall.jpg', 'living_room.jpg', 'kitchen.jpg'], videos: [],
    notes: 'Minor scuff on bedroom wall. Noted on checklist.',
  },
  {
    id: 2, unit: '202', building: 'Oak', tenantEmail: 'tenant2@test.com',
    type: 'routine', status: 'completed', completedAt: 'Mar 15, 2026',
    photos: ['bathroom.jpg'], videos: ['walkthrough.mp4'],
    notes: 'All in good condition. Faucet drip noted.',
  },
]

const UNITS_LIST = [
  { unit: '101', building: 'Maple', tenantEmail: 'tenant1@test.com', rent: 1850 },
  { unit: '202', building: 'Oak',   tenantEmail: 'tenant2@test.com', rent: 2100 },
  { unit: '305', building: 'Pine',  tenantEmail: 'tenant3@test.com', rent: 1650 },
  { unit: '104', building: 'Maple', tenantEmail: null,               rent: 1900 },
  { unit: '208', building: 'Oak',   tenantEmail: null,               rent: 2200 },
]

// ─── Shared palette ───────────────────────────────────────────────────────────
const C = {
  primary:  '#6366f1',
  sidebar:  '#0f172a',
  sideText: '#94a3b8',
  bg:       '#f8fafc',
  card:     '#ffffff',
  border:   '#e2e8f0',
  muted:    '#64748b',
  text:     '#1e293b',
}

const STATUS_STYLE = {
  open:        { bg: '#fef3c7', fg: '#92400e', label: 'Open'        },
  assigned:    { bg: '#dbeafe', fg: '#1e40af', label: 'Assigned'    },
  in_progress: { bg: '#e0e7ff', fg: '#3730a3', label: 'In Progress' },
  completed:   { bg: '#d1fae5', fg: '#065f46', label: 'Completed'   },
  paid:        { bg: '#d1fae5', fg: '#065f46', label: 'Paid'        },
  due:         { bg: '#fef3c7', fg: '#92400e', label: 'Due'         },
  overdue:     { bg: '#fee2e2', fg: '#991b1b', label: 'Overdue'     },
}

const PRIORITY_STYLE = {
  low:    { bg: '#f0fdf4', fg: '#166534', dot: '#22c55e', label: 'Low'    },
  medium: { bg: '#fefce8', fg: '#713f12', dot: '#eab308', label: 'Medium' },
  high:   { bg: '#fef2f2', fg: '#7f1d1d', dot: '#ef4444', label: 'High'   },
}

const INSPECTION_LABEL = {
  move_in:          'Move-In',
  move_out:         'Move-Out',
  routine:          'Routine',
  final_walkthrough:'Final Walkthrough',
}

// ─── ID counter ───────────────────────────────────────────────────────────────
let _seq = 200
const nextId = () => ++_seq

const nowDate = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const nowTime = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

// ─── Primitive components ─────────────────────────────────────────────────────

function Badge({ status, kind = 'status' }) {
  const s = kind === 'priority' ? PRIORITY_STYLE[status] : STATUS_STYLE[status]
  if (!s) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, color: s.fg,
      padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    }}>
      {kind === 'priority' && (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      )}
      {s.label}
    </span>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card, borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,.07)', padding: 20, ...style,
    }}>
      {children}
    </div>
  )
}

function Stat({ label, value, color = C.text }) {
  return (
    <Card>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: C.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
    </Card>
  )
}

function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, style = {} }) {
  const pad = size === 'sm' ? '5px 13px' : '9px 18px'
  const fs  = size === 'sm' ? 13 : 14
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    border: 'none', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600, fontFamily: 'inherit', fontSize: fs, padding: pad,
    opacity: disabled ? .55 : 1, transition: 'opacity .1s', whiteSpace: 'nowrap',
  }
  const vars = {
    primary:   { background: C.primary,   color: '#fff'    },
    secondary: { background: '#f1f5f9',   color: '#475569' },
    danger:    { background: '#ef4444',   color: '#fff'    },
    ghost:     { background: 'transparent', color: C.primary, textDecoration: 'underline' },
  }
  return <button style={{ ...base, ...vars[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      {label && <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</span>}
      {children}
    </label>
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${C.border}`, fontSize: 14, background: '#fff',
  boxSizing: 'border-box',
}

function TextInput({ label, ...props }) {
  return <Field label={label}><input style={inputStyle} {...props} /></Field>
}

function Textarea({ label, ...props }) {
  return (
    <Field label={label}>
      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} {...props} />
    </Field>
  )
}

function Select({ label, children, ...props }) {
  return (
    <Field label={label}>
      <select style={{ ...inputStyle, background: '#fff' }} {...props}>{children}</select>
    </Field>
  )
}

function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: '#fff', borderRadius: 16, width, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', padding: 28, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: C.muted, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Empty({ icon, title, desc }) {
  return (
    <div style={{ textAlign: 'center', padding: '52px 24px', color: '#94a3b8' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14 }}>{desc}</div>
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: C.text }}>{children}</h3>
}

// ─── Notification bell ────────────────────────────────────────────────────────

function NotifBell({ notifs, onRead }) {
  const [open, setOpen] = useState(false)
  const unread = notifs.filter(n => !n.read).length

  const iconFor = type => ({ inspection: '🏠', assignment: '📋', update: '🔧' }[type] ?? '🔔')

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#f1f5f9', border: 'none', borderRadius: 10,
          width: 42, height: 42, cursor: 'pointer', fontSize: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}
      >
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 5, right: 5,
            background: '#ef4444', color: '#fff',
            borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', right: 0, top: 50, width: 360,
            background: '#fff', borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,.14)', zIndex: 100, overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                Notifications{unread > 0 && (
                  <span style={{ background: '#ef4444', color: '#fff', borderRadius: 12, padding: '1px 7px', fontSize: 11, marginLeft: 6 }}>{unread} new</span>
                )}
              </span>
              {unread > 0 && (
                <button onClick={() => onRead(null)} style={{ background: 'none', border: 'none', color: C.primary, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 340, overflowY: 'auto' }}>
              {notifs.length === 0
                ? <div style={{ padding: '28px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No notifications yet</div>
                : notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => { onRead(n.id); }}
                    style={{
                      padding: '12px 16px', borderBottom: `1px solid #f8fafc`,
                      background: n.read ? '#fff' : '#f0f4ff',
                      cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{iconFor(n.type)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.45 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{n.createdAt}</div>
                    </div>
                    {!n.read && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.primary, flexShrink: 0, marginTop: 5 }} />
                    )}
                  </div>
                ))
              }
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── App shell (sidebar + top bar) ───────────────────────────────────────────

function Shell({ user, nav, activeTab, setTab, notifs, onRead, onLogout, children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 256, flexShrink: 0, background: C.sidebar,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Brand */}
        <div style={{ padding: '24px 20px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -.5 }}>🏢 NestPortal</div>
          <div style={{ fontSize: 12, color: C.sideText, marginTop: 2, opacity: .7 }}>Property Management</div>
        </div>

        {/* User card */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 10, padding: '10px 13px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: C.sideText, opacity: .75, marginTop: 2, textTransform: 'capitalize' }}>
              {user.role === 'vendor' ? user.company : user.role === 'admin' ? 'Administrator' : `Tenant · Unit ${user.unit}`}
            </div>
            {user.building && user.role === 'tenant' && (
              <div style={{ fontSize: 11, color: C.sideText, opacity: .6, marginTop: 1 }}>{user.building} Building</div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 10px' }}>
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: 'none', cursor: 'pointer', marginBottom: 1,
                background: activeTab === item.id ? 'rgba(99,102,241,.28)' : 'transparent',
                color: activeTab === item.id ? '#a5b4fc' : C.sideText,
                fontWeight: activeTab === item.id ? 700 : 400,
                fontSize: 14, fontFamily: 'inherit', textAlign: 'left',
                transition: 'background .12s',
              }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%', padding: 9, borderRadius: 8,
              border: '1px solid rgba(255,255,255,.13)',
              background: 'transparent', color: C.sideText,
              cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: C.bg }}>
        {/* Top bar */}
        <header style={{
          background: '#fff', borderBottom: `1px solid ${C.border}`,
          padding: '0 28px', height: 62,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>
            {nav.find(i => i.id === activeTab)?.label ?? ''}
          </h2>
          <NotifBell notifs={notifs} onRead={onRead} />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {children}
        </main>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT — Payments
// ════════════════════════════════════════════════════════════════════════════

function PaymentsTab({ payments }) {
  const [payModal, setPayModal] = useState(null)
  const outstanding = payments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)
  const overdue     = payments.filter(p => p.status === 'overdue').reduce((s, p) => s + p.amount, 0)
  const lastPaid    = payments.find(p => p.status === 'paid')

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <Stat label="Balance Due"    value={`$${outstanding.toLocaleString()}`} color={outstanding > 0 ? '#ef4444' : '#10b981'} />
        <Stat label="Overdue"        value={`$${overdue.toLocaleString()}`}    color={overdue > 0 ? '#ef4444' : '#10b981'} />
        <Stat label="Last Payment"   value={lastPaid?.paid ?? '—'} />
      </div>

      <Card>
        <SectionTitle>Payment History</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Type','Amount','Due Date','Paid Date','Status',''].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: C.muted, borderBottom: `2px solid ${C.bg}`, textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid #f8fafc` }}>
                <td style={{ padding: '12px 10px', fontSize: 14, fontWeight: 500 }}>{p.type}</td>
                <td style={{ padding: '12px 10px', fontSize: 14, fontWeight: 700 }}>${p.amount.toLocaleString()}</td>
                <td style={{ padding: '12px 10px', fontSize: 14, color: C.muted }}>{p.due}</td>
                <td style={{ padding: '12px 10px', fontSize: 14, color: C.muted }}>{p.paid ?? '—'}</td>
                <td style={{ padding: '12px 10px' }}><Badge status={p.status} /></td>
                <td style={{ padding: '12px 10px' }}>
                  {p.status !== 'paid' && <Btn size="sm" onClick={() => setPayModal(p)}>Pay Now</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {payModal && (
        <Modal title="Make a Payment" onClose={() => setPayModal(null)}>
          <div style={{ background: C.bg, borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: C.muted }}>{payModal.type}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>${payModal.amount.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: '#ef4444', marginTop: 2 }}>Due: {payModal.due}</div>
          </div>
          <TextInput label="Card Number" placeholder="•••• •••• •••• ••••" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <TextInput label="Expiry" placeholder="MM / YY" />
            <TextInput label="CVV" placeholder="•••" />
          </div>
          <TextInput label="Name on Card" placeholder="Full name" />
          <Btn style={{ width: '100%', padding: 12, marginTop: 4 }} onClick={() => setPayModal(null)}>
            Pay ${payModal.amount.toLocaleString()}
          </Btn>
        </Modal>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT — Maintenance requests
// ════════════════════════════════════════════════════════════════════════════

function TenantMaintenanceTab({ workOrders, userEmail, onSubmit }) {
  const mine = workOrders.filter(w => w.tenantEmail === userEmail)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' })

  const submit = () => {
    if (!form.title.trim()) return
    onSubmit(form)
    setForm({ title: '', description: '', priority: 'medium' })
    setOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Btn onClick={() => setOpen(true)}>+ New Request</Btn>
      </div>

      {mine.length === 0
        ? <Empty icon="🔧" title="No maintenance requests" desc="Submit a request if something needs fixing in your unit." />
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mine.map(w => (
              <Card key={w.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{w.title}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{w.description}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <Badge status={w.priority} kind="priority" />
                    <Badge status={w.status} />
                  </div>
                </div>
                {w.notes.length > 0 && (
                  <div style={{ marginTop: 14, borderTop: `1px solid ${C.bg}`, paddingTop: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 6 }}>Vendor Notes</div>
                    {w.notes.map((n, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#475569', background: C.bg, borderRadius: 6, padding: '6px 10px', marginBottom: 4 }}>
                        💬 {n}
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>Submitted {w.createdAt}</div>
              </Card>
            ))}
          </div>
      }

      {open && (
        <Modal title="New Maintenance Request" onClose={() => setOpen(false)}>
          <TextInput label="Issue Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Brief description of the problem" />
          <Textarea label="Details" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the issue in more detail…" />
          <Select label="Priority" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn onClick={submit} disabled={!form.title.trim()}>Submit Request</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT — Inspections
// ════════════════════════════════════════════════════════════════════════════

function TenantInspectionsTab({ inspections, userEmail, onSubmit }) {
  const mine = inspections.filter(i => i.tenantEmail === userEmail)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ type: 'routine', notes: '' })
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const photoRef = useRef()
  const videoRef = useRef()

  const handleSubmit = () => {
    onSubmit({ type: form.type, notes: form.notes, photos, videos })
    setForm({ type: 'routine', notes: '' })
    setPhotos([])
    setVideos([])
    setOpen(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Btn onClick={() => setOpen(true)}>+ New Inspection</Btn>
      </div>

      {mine.length === 0
        ? <Empty icon="🏠" title="No inspections on file" desc="Submit a new inspection report for your unit." />
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mine.map(ins => (
              <Card key={ins.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>
                      {INSPECTION_LABEL[ins.type]} Inspection
                    </div>
                    <div style={{ fontSize: 13, color: C.muted }}>Completed {ins.completedAt}</div>
                    {ins.notes && <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>{ins.notes}</div>}
                  </div>
                  <Badge status={ins.status} />
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 14 }}>
                  {ins.photos.length > 0 && <span style={{ fontSize: 13, color: C.primary }}>📷 {ins.photos.length} photo{ins.photos.length !== 1 ? 's' : ''}</span>}
                  {ins.videos.length > 0 && <span style={{ fontSize: 13, color: C.primary }}>🎥 {ins.videos.length} video{ins.videos.length !== 1 ? 's' : ''}</span>}
                </div>
              </Card>
            ))}
          </div>
      }

      {open && (
        <Modal title="Submit Inspection Report" onClose={() => setOpen(false)}>
          <Select label="Inspection Type" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="routine">Routine Inspection</option>
            <option value="move_out">Move-Out</option>
            <option value="final_walkthrough">Final Walkthrough</option>
          </Select>

          {form.type === 'final_walkthrough' && (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#92400e' }}>
              ⚠️ Submitting a final walkthrough will <strong>notify your property manager and any assigned maintenance vendors</strong> for your unit.
            </div>
          )}

          <Textarea label="Notes / Observations" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Describe the condition of the unit…" />

          {/* Photo upload */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Photos</div>
            <input ref={photoRef} type="file" accept="image/*" multiple onChange={e => setPhotos(p => [...p, ...Array.from(e.target.files).map(f => f.name)])} style={{ display: 'none' }} />
            <Btn variant="secondary" size="sm" onClick={() => photoRef.current?.click()}>📷 Add Photos</Btn>
            {photos.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {photos.map((p, i) => <span key={i} style={{ background: '#ede9fe', color: '#4c1d95', borderRadius: 6, padding: '3px 9px', fontSize: 12 }}>{p}</span>)}
              </div>
            )}
          </div>

          {/* Video upload */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>Videos</div>
            <input ref={videoRef} type="file" accept="video/*" multiple onChange={e => setVideos(v => [...v, ...Array.from(e.target.files).map(f => f.name)])} style={{ display: 'none' }} />
            <Btn variant="secondary" size="sm" onClick={() => videoRef.current?.click()}>🎥 Add Videos</Btn>
            {videos.length > 0 && (
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {videos.map((v, i) => <span key={i} style={{ background: '#d1fae5', color: '#065f46', borderRadius: 6, padding: '3px 9px', fontSize: 12 }}>{v}</span>)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn onClick={handleSubmit}>Submit Inspection</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT — Unit Tour
// ════════════════════════════════════════════════════════════════════════════

function TourTab({ user }) {
  const amenities = [
    { icon: '🏊', title: 'Resort Pool',       desc: 'Heated outdoor pool & hot tub, open year-round' },
    { icon: '🏋️', title: 'Fitness Center',    desc: '24/7 access with state-of-the-art equipment' },
    { icon: '🐾', title: 'Pet-Friendly',       desc: 'Dog park and pet washing station on-site' },
    { icon: '🚗', title: 'Covered Parking',    desc: 'Assigned covered spot included with lease' },
    { icon: '📦', title: 'Package Lockers',    desc: '24/7 secure package pickup lockers' },
    { icon: '🌿', title: 'Rooftop Terrace',    desc: 'Outdoor lounge with city views & BBQ grills' },
    { icon: '🎮', title: 'Resident Lounge',    desc: 'Community game room and co-working space' },
    { icon: '🚴', title: 'Bike Storage',       desc: 'Secure indoor bike storage room' },
    { icon: '🌊', title: 'Concierge Service',  desc: 'On-site concierge available Mon–Sat' },
  ]
  return (
    <div>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', borderRadius: 10, padding: 32, color: '#fff', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>The Nestwood Residences</div>
          <div style={{ opacity: .85, fontSize: 14 }}>Unit {user.unit} · {user.building} Building</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 20 }}>
            {[['120', 'Units'], ['4.8★', 'Rating'], ['2019', 'Built'], ['A+', 'Walk Score']].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{val}</div>
                <div style={{ fontSize: 12, opacity: .75 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {amenities.map(a => (
          <Card key={a.title}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{a.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT — Documents
// ════════════════════════════════════════════════════════════════════════════

function DocumentsTab({ documents }) {
  const typeColor = { Lease: '#dbeafe', Inspection: '#d1fae5', Policy: '#fef3c7', Addendum: '#ede9fe', Permit: '#fce7f3' }
  return (
    <Card>
      <SectionTitle>My Documents</SectionTitle>
      {documents.length === 0
        ? <Empty icon="📄" title="No documents" desc="Uploaded documents will appear here." />
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {documents.map(doc => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div style={{ width: 42, height: 42, borderRadius: 8, background: typeColor[doc.type] ?? '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  📄
                </div>
                <div style={{ flex: 1, marginLeft: 14 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{doc.type} · {doc.date} · {doc.size}</div>
                </div>
                <Btn variant="secondary" size="sm">⬇ Download</Btn>
              </div>
            ))}
          </div>
      }
    </Card>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TENANT PORTAL
// ════════════════════════════════════════════════════════════════════════════

function TenantPortal({ user, workOrders, inspections, payments, documents, notifs, onRead, onLogout, onSubmitMaintenance, onSubmitInspection }) {
  const [tab, setTab] = useState('payments')
  const nav = [
    { id: 'payments',    icon: '💳', label: 'Payments'    },
    { id: 'maintenance', icon: '🔧', label: 'Maintenance'  },
    { id: 'inspections', icon: '🏠', label: 'Inspections'  },
    { id: 'tour',        icon: '🌟', label: 'Unit Tour'    },
    { id: 'documents',   icon: '📄', label: 'Documents'    },
  ]
  const myNotifs = notifs.filter(n => n.forEmail === user.email)
  return (
    <Shell user={user} nav={nav} activeTab={tab} setTab={setTab} notifs={myNotifs} onRead={onRead} onLogout={onLogout}>
      {tab === 'payments'    && <PaymentsTab payments={payments} />}
      {tab === 'maintenance' && <TenantMaintenanceTab workOrders={workOrders} userEmail={user.email} onSubmit={onSubmitMaintenance} />}
      {tab === 'inspections' && <TenantInspectionsTab inspections={inspections} userEmail={user.email} onSubmit={onSubmitInspection} />}
      {tab === 'tour'        && <TourTab user={user} />}
      {tab === 'documents'   && <DocumentsTab documents={documents} />}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Units overview
// ════════════════════════════════════════════════════════════════════════════

function AdminUnitsTab({ workOrders }) {
  const occupied = UNITS_LIST.filter(u => u.tenantEmail)
  const vacant   = UNITS_LIST.filter(u => !u.tenantEmail)
  const openWO   = email => workOrders.filter(w => w.tenantEmail === email && w.status !== 'completed').length

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <Stat label="Total Units"  value={UNITS_LIST.length} />
        <Stat label="Occupied"     value={occupied.length}   color="#10b981" />
        <Stat label="Vacant"       value={vacant.length}     color="#f59e0b" />
      </div>
      <Card>
        <SectionTitle>All Units</SectionTitle>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Unit','Building','Tenant','Rent / mo','Open Work Orders','Status'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: C.muted, borderBottom: `2px solid ${C.bg}`, textTransform: 'uppercase', letterSpacing: .4 }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {UNITS_LIST.map(u => (
              <tr key={u.unit} style={{ borderBottom: `1px solid #f8fafc` }}>
                <td style={{ padding: '12px 10px', fontWeight: 700 }}>{u.unit}</td>
                <td style={{ padding: '12px 10px', color: C.muted }}>{u.building}</td>
                <td style={{ padding: '12px 10px', color: C.muted }}>{u.tenantEmail ? USERS[u.tenantEmail]?.name : '—'}</td>
                <td style={{ padding: '12px 10px', fontWeight: 600 }}>${u.rent.toLocaleString()}</td>
                <td style={{ padding: '12px 10px' }}>
                  {u.tenantEmail
                    ? <span style={{ fontWeight: 700, color: openWO(u.tenantEmail) > 0 ? '#ef4444' : '#10b981' }}>{openWO(u.tenantEmail)}</span>
                    : '—'}
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{ background: u.tenantEmail ? '#d1fae5' : '#fef3c7', color: u.tenantEmail ? '#065f46' : '#92400e', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {u.tenantEmail ? 'Occupied' : 'Vacant'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Work orders
// ════════════════════════════════════════════════════════════════════════════

function AdminWorkOrdersTab({ workOrders, onAssign }) {
  const [filter, setFilter]       = useState('all')
  const [assignModal, setAssign]  = useState(null)
  const [vendorEmail, setVendor]  = useState('')

  const vendors = Object.entries(USERS).filter(([, v]) => v.role === 'vendor')

  const shown = filter === 'all' ? workOrders : workOrders.filter(w => w.status === filter)

  const counts = ['all','open','assigned','in_progress','completed'].reduce((acc, k) => {
    acc[k] = k === 'all' ? workOrders.length : workOrders.filter(w => w.status === k).length
    return acc
  }, {})

  const doAssign = () => {
    if (!vendorEmail) return
    onAssign(assignModal.id, vendorEmail)
    setAssign(null)
    setVendor('')
  }

  const filterBtns = [
    { k: 'all',         label: 'All',         color: C.muted    },
    { k: 'open',        label: 'Open',        color: '#92400e'  },
    { k: 'assigned',    label: 'Assigned',    color: '#1e40af'  },
    { k: 'in_progress', label: 'In Progress', color: '#3730a3'  },
    { k: 'completed',   label: 'Completed',   color: '#065f46'  },
  ]

  return (
    <div>
      {/* Filter pills / counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 24 }}>
        {filterBtns.map(({ k, label, color }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            style={{
              background: filter === k ? '#fff' : '#f8fafc',
              border: filter === k ? `2px solid ${C.primary}` : '2px solid transparent',
              borderRadius: 10, padding: '12px 8px', cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: filter === k ? '0 2px 8px rgba(99,102,241,.15)' : 'none',
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{counts[k]}</div>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, marginTop: 2 }}>{label}</div>
          </button>
        ))}
      </div>

      <Card>
        {shown.length === 0
          ? <Empty icon="✅" title="No work orders" desc="Nothing matches this filter." />
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {shown.map(w => (
                <div key={w.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{w.title}</div>
                      <div style={{ fontSize: 13, color: C.muted }}>Unit {w.unit} · {w.building} · {w.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <Badge status={w.priority} kind="priority" />
                      <Badge status={w.status} />
                    </div>
                  </div>

                  {w.notes.length > 0 && (
                    <div style={{ marginTop: 10, borderTop: `1px solid ${C.bg}`, paddingTop: 10 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 5 }}>Vendor Notes</div>
                      {w.notes.map((n, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#475569', background: C.bg, borderRadius: 6, padding: '5px 10px', marginBottom: 3 }}>💬 {n}</div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>
                      Created {w.createdAt}
                      {w.assignedTo && ` · Assigned to ${USERS[w.assignedTo]?.name}`}
                    </div>
                    {w.status !== 'completed' && (
                      <Btn size="sm" variant="secondary" onClick={() => { setAssign(w); setVendor(w.assignedTo ?? '') }}>
                        {w.assignedTo ? '↺ Reassign' : '+ Assign Vendor'}
                      </Btn>
                    )}
                  </div>
                </div>
              ))}
            </div>
        }
      </Card>

      {assignModal && (
        <Modal title="Assign Work Order" onClose={() => setAssign(null)}>
          <div style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <div style={{ fontWeight: 600 }}>{assignModal.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Unit {assignModal.unit} · {assignModal.building}</div>
          </div>
          <Select label="Select Vendor" value={vendorEmail} onChange={e => setVendor(e.target.value)}>
            <option value="">— Choose a vendor —</option>
            {vendors.map(([email, v]) => (
              <option key={email} value={email}>{v.name} · {v.company}</option>
            ))}
          </Select>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setAssign(null)}>Cancel</Btn>
            <Btn onClick={doAssign} disabled={!vendorEmail}>Assign</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN — Inspections
// ════════════════════════════════════════════════════════════════════════════

function AdminInspectionsTab({ inspections }) {
  return (
    <Card>
      <SectionTitle>All Inspections</SectionTitle>
      {inspections.length === 0
        ? <Empty icon="🏠" title="No inspections on record" desc="Completed tenant inspections will appear here." />
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inspections.map(ins => (
              <div key={ins.id} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>
                    {INSPECTION_LABEL[ins.type]} — Unit {ins.unit} ({ins.building})
                  </div>
                  <div style={{ fontSize: 13, color: C.muted }}>
                    {USERS[ins.tenantEmail]?.name} · {ins.completedAt}
                  </div>
                  {ins.notes && <div style={{ fontSize: 13, color: '#475569', marginTop: 6 }}>{ins.notes}</div>}
                  <div style={{ marginTop: 8, display: 'flex', gap: 14 }}>
                    {ins.photos.length > 0 && <span style={{ fontSize: 12, color: C.primary }}>📷 {ins.photos.length} photo{ins.photos.length !== 1 ? 's' : ''}</span>}
                    {ins.videos.length > 0 && <span style={{ fontSize: 12, color: C.primary }}>🎥 {ins.videos.length} video{ins.videos.length !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
                <Badge status={ins.status} />
              </div>
            ))}
          </div>
      }
    </Card>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD
// ════════════════════════════════════════════════════════════════════════════

function AdminDashboard({ user, workOrders, inspections, notifs, onRead, onLogout, onAssign }) {
  const [tab, setTab] = useState('units')
  const nav = [
    { id: 'units',       icon: '🏢', label: 'Units'       },
    { id: 'workorders',  icon: '🔧', label: 'Work Orders'  },
    { id: 'inspections', icon: '🏠', label: 'Inspections'  },
  ]
  const myNotifs = notifs.filter(n => n.forRole === 'admin')
  return (
    <Shell user={user} nav={nav} activeTab={tab} setTab={setTab} notifs={myNotifs} onRead={onRead} onLogout={onLogout}>
      {tab === 'units'       && <AdminUnitsTab workOrders={workOrders} />}
      {tab === 'workorders'  && <AdminWorkOrdersTab workOrders={workOrders} onAssign={onAssign} />}
      {tab === 'inspections' && <AdminInspectionsTab inspections={inspections} />}
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VENDOR — Work orders
// ════════════════════════════════════════════════════════════════════════════

function VendorWorkOrdersTab({ workOrders, vendorEmail, onUpdateStatus, onAddNote }) {
  const mine = workOrders.filter(w => w.assignedTo === vendorEmail)
  const [noteModal,   setNoteModal]   = useState(null)
  const [statusModal, setStatusModal] = useState(null)
  const [noteText,    setNoteText]    = useState('')
  const [nextStatus,  setNextStatus]  = useState('')

  const doNote = () => {
    if (!noteText.trim()) return
    onAddNote(noteModal.id, noteText.trim())
    setNoteText('')
    setNoteModal(null)
  }

  const doStatus = () => {
    onUpdateStatus(statusModal.id, nextStatus)
    setStatusModal(null)
  }

  const statusChoices = s => {
    if (s === 'assigned')    return [{ value: 'in_progress', label: 'Mark In Progress' }]
    if (s === 'in_progress') return [{ value: 'completed',   label: 'Mark Completed'   }]
    return []
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        <Stat label="Total Assigned" value={mine.length} />
        <Stat label="Active"         value={mine.filter(w => w.status !== 'completed').length} color={C.primary} />
        <Stat label="Completed"      value={mine.filter(w => w.status === 'completed').length}  color="#10b981" />
      </div>

      {mine.length === 0
        ? <Empty icon="📋" title="No work orders assigned yet" desc="The property manager will assign work orders to you here." />
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mine.map(w => (
              <Card key={w.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{w.title}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>Unit {w.unit} · {w.building} Building</div>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{w.description}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end', flexShrink: 0 }}>
                    <Badge status={w.priority} kind="priority" />
                    <Badge status={w.status} />
                  </div>
                </div>

                {w.notes.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: `1px solid ${C.bg}`, paddingTop: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: .4, marginBottom: 5 }}>My Notes</div>
                    {w.notes.map((n, i) => (
                      <div key={i} style={{ fontSize: 13, color: '#475569', background: C.bg, borderRadius: 6, padding: '6px 10px', marginBottom: 4 }}>
                        💬 {n}
                      </div>
                    ))}
                  </div>
                )}

                {w.status !== 'completed' && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.bg}`, display: 'flex', gap: 8 }}>
                    <Btn size="sm" variant="secondary" onClick={() => { setNoteModal(w); setNoteText('') }}>+ Add Note</Btn>
                    {statusChoices(w.status).map(s => (
                      <Btn key={s.value} size="sm" onClick={() => { setStatusModal(w); setNextStatus(s.value) }}>{s.label}</Btn>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>Assigned {w.createdAt} · Updated {w.updatedAt}</div>
              </Card>
            ))}
          </div>
      }

      {noteModal && (
        <Modal title="Add a Note" onClose={() => setNoteModal(null)}>
          <div style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <div style={{ fontWeight: 600 }}>{noteModal.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>Unit {noteModal.unit} · {noteModal.building}</div>
          </div>
          <Textarea label="Note" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Describe what you found, did, or need next…" />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setNoteModal(null)}>Cancel</Btn>
            <Btn onClick={doNote} disabled={!noteText.trim()}>Save Note</Btn>
          </div>
        </Modal>
      )}

      {statusModal && (
        <Modal title="Update Status" onClose={() => setStatusModal(null)}>
          <div style={{ background: C.bg, borderRadius: 10, padding: 14, marginBottom: 18 }}>
            <div style={{ fontWeight: 600 }}>{statusModal.title}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              Current status: <Badge status={statusModal.status} />
            </div>
          </div>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 20 }}>
            Mark this work order as <strong>{nextStatus.replace('_', ' ')}</strong>?
            {nextStatus === 'completed' && ' Your property manager will be notified.'}
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn variant="secondary" onClick={() => setStatusModal(null)}>Cancel</Btn>
            <Btn onClick={doStatus}>Confirm</Btn>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VENDOR DASHBOARD
// ════════════════════════════════════════════════════════════════════════════

function VendorDashboard({ user, workOrders, notifs, onRead, onLogout, onUpdateStatus, onAddNote }) {
  const [tab, setTab] = useState('workorders')
  const nav = [
    { id: 'workorders', icon: '📋', label: 'My Work Orders' },
  ]
  const myNotifs = notifs.filter(n => n.forRole === 'vendor' && (n.forEmail === user.email || n.forEmail === null))
  return (
    <Shell user={user} nav={nav} activeTab={tab} setTab={setTab} notifs={myNotifs} onRead={onRead} onLogout={onLogout}>
      <VendorWorkOrdersTab workOrders={workOrders} vendorEmail={user.email} onUpdateStatus={onUpdateStatus} onAddNote={onAddNote} />
    </Shell>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const tryLogin = () => {
    setError('')
    const e = email.trim().toLowerCase()
    if (!e)           { setError('Please enter your email.');         return }
    if (!password)    { setError('Please enter your password.');      return }
    if (!USERS[e])    { setError('No account found for that email.'); return }
    if (password !== 'password') { setError('Incorrect password. Hint: "password"'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onLogin(e) }, 700)
  }

  const demos = [
    { role: 'Tenant', color: '#6366f1', emails: ['tenant1@test.com', 'tenant2@test.com', 'tenant3@test.com'] },
    { role: 'Admin',  color: '#0ea5e9', emails: ['admin1@test.com',  'admin2@test.com'] },
    { role: 'Vendor', color: '#10b981', emails: ['vendor1@test.com', 'vendor2@test.com'] },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 460, maxWidth: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: -.5 }}>NestPortal</div>
          <div style={{ color: '#94a3b8', marginTop: 4, fontSize: 15 }}>Property Management Platform</div>
        </div>

        <div style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>
          <h2 style={{ margin: '0 0 22px', fontSize: 20, fontWeight: 700, color: C.text }}>Sign In</h2>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#b91c1c', fontSize: 14, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <TextInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" onKeyDown={e => e.key === 'Enter' && tryLogin()} />
          <TextInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && tryLogin()} />

          <button
            onClick={tryLogin}
            disabled={loading}
            style={{ width: '100%', padding: 13, borderRadius: 10, border: 'none', background: C.primary, color: '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: loading ? .7 : 1, marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 12 }}>Demo accounts (password: "password")</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {demos.map(d => (
                <div key={d.role}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.color, marginBottom: 5 }}>{d.role}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {d.emails.map(e => (
                      <button
                        key={e}
                        onClick={() => { setEmail(e); setPassword('password') }}
                        style={{ background: '#f8fafc', border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 10px', fontSize: 12, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT — state management & event wiring
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [workOrders,  setWorkOrders]  = useState(INIT_WORK_ORDERS)
  const [inspections, setInspections] = useState(INIT_INSPECTIONS)
  const [notifs,      setNotifs]      = useState([])
  const [payments]  = useState(INIT_PAYMENTS)
  const [documents] = useState(INIT_DOCUMENTS)

  const pushNotif = notif => setNotifs(ns => [{ ...notif, id: nextId(), read: false, createdAt: nowTime() }, ...ns])

  // Auth
  const login  = email => setCurrentUser({ email, ...USERS[email] })
  const logout = ()    => setCurrentUser(null)

  const readNotif = id =>
    setNotifs(ns => id === null ? ns.map(n => ({ ...n, read: true })) : ns.map(n => n.id === id ? { ...n, read: true } : n))

  // Tenant: new maintenance request
  const submitMaintenance = ({ title, description, priority }) => {
    const u = currentUser
    setWorkOrders(ws => [{
      id: nextId(), title, description, priority,
      unit: u.unit, building: u.building, tenantEmail: u.email,
      status: 'open', assignedTo: null, notes: [],
      createdAt: nowDate(), updatedAt: nowDate(),
    }, ...ws])
  }

  // Tenant: submit inspection — final walkthrough triggers push notifications
  const submitInspection = ({ type, notes, photos, videos }) => {
    const u = currentUser
    const ins = {
      id: nextId(), unit: u.unit, building: u.building, tenantEmail: u.email,
      type, status: 'completed', notes, photos, videos, completedAt: nowDate(),
    }
    setInspections(is => [ins, ...is])

    if (type === 'final_walkthrough') {
      // Notify all admins
      pushNotif({
        type: 'inspection',
        message: `${u.name} (Unit ${u.unit}, ${u.building}) completed their final walkthrough inspection.`,
        forRole: 'admin', forEmail: null,
      })
      // Notify every vendor with an active work order in this unit
      const affectedVendors = new Set(
        workOrders
          .filter(w => w.unit === u.unit && w.assignedTo && w.status !== 'completed')
          .map(w => w.assignedTo)
      )
      affectedVendors.forEach(vendorEmail => {
        pushNotif({
          type: 'inspection',
          message: `Final walkthrough completed for Unit ${u.unit} (${u.building}) by ${u.name}. Review your assigned work orders.`,
          forRole: 'vendor', forEmail: vendorEmail,
        })
      })
    }
  }

  // Admin: assign work order to vendor
  const assignWorkOrder = (orderId, vendorEmail) => {
    const order = workOrders.find(w => w.id === orderId)
    setWorkOrders(ws => ws.map(w =>
      w.id === orderId
        ? { ...w, assignedTo: vendorEmail, status: 'assigned', updatedAt: nowDate() }
        : w
    ))
    pushNotif({
      type: 'assignment',
      message: `New work order assigned: "${order.title}" — Unit ${order.unit}, ${order.building}.`,
      forRole: 'vendor', forEmail: vendorEmail,
    })
  }

  // Vendor: update work order status
  const updateStatus = (orderId, newStatus) => {
    const order = workOrders.find(w => w.id === orderId)
    setWorkOrders(ws => ws.map(w =>
      w.id === orderId ? { ...w, status: newStatus, updatedAt: nowDate() } : w
    ))
    pushNotif({
      type: 'update',
      message: `Work order "${order.title}" (Unit ${order.unit}) updated to "${newStatus.replace('_', ' ')}" by ${currentUser.name}.`,
      forRole: 'admin', forEmail: null,
    })
  }

  // Vendor: add note to work order
  const addNote = (orderId, note) => {
    setWorkOrders(ws => ws.map(w =>
      w.id === orderId ? { ...w, notes: [...w.notes, note], updatedAt: nowDate() } : w
    ))
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  if (!currentUser) return <LoginScreen onLogin={login} />

  const { role } = currentUser

  if (role === 'tenant') return (
    <TenantPortal
      user={currentUser}
      workOrders={workOrders}
      inspections={inspections}
      payments={payments[currentUser.email] ?? []}
      documents={documents[currentUser.email] ?? []}
      notifs={notifs}
      onRead={readNotif}
      onLogout={logout}
      onSubmitMaintenance={submitMaintenance}
      onSubmitInspection={submitInspection}
    />
  )

  if (role === 'admin') return (
    <AdminDashboard
      user={currentUser}
      workOrders={workOrders}
      inspections={inspections}
      notifs={notifs}
      onRead={readNotif}
      onLogout={logout}
      onAssign={assignWorkOrder}
    />
  )

  if (role === 'vendor') return (
    <VendorDashboard
      user={currentUser}
      workOrders={workOrders}
      notifs={notifs}
      onRead={readNotif}
      onLogout={logout}
      onUpdateStatus={updateStatus}
      onAddNote={addNote}
    />
  )

  return null
}
