import { useState } from 'react'
import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate } from '../../utils/dateUtils.js'
import { USERS } from '../../constants.js'

const VENDORS = ['vendor1@nest.com', 'vendor2@nest.com']

export default function WorkOrdersTable({ workOrders, onAssign, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [unitFilter, setUnitFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)

  const units = [...new Set(workOrders.map(wo => wo.unit))].sort()

  const filtered = workOrders.filter(wo => {
    if (statusFilter !== 'All' && wo.status !== statusFilter) return false
    if (unitFilter !== 'All' && wo.unit !== unitFilter) return false
    return true
  })

  const inputStyle = {
    background: 'rgba(124,58,237,0.08)',
    border: '1px solid rgba(124,58,237,0.25)',
    color: '#EDE9FE',
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '0.75rem',
    outline: 'none',
    fontFamily: "'Fira Sans', sans-serif",
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-2xl"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <span className="text-sm font-medium" style={{ color: '#6B5E8A' }}>Filter:</span>
        <div className="flex items-center gap-2">
          {['All', 'Open', 'In Progress', 'Completed'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-smooth"
              style={
                statusFilter === s
                  ? { background: '#7C3AED', color: '#EDE9FE', border: '1px solid transparent' }
                  : { background: 'rgba(124,58,237,0.08)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
        <div className="ml-4 flex items-center gap-2">
          <span className="text-xs" style={{ color: '#6B5E8A' }}>Unit:</span>
          <select value={unitFilter} onChange={e => setUnitFilter(e.target.value)} style={inputStyle}>
            <option>All</option>
            {units.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
        <span className="ml-auto text-xs" style={{ color: '#6B5E8A' }}>{filtered.length} order{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm" style={{ color: '#6B5E8A' }}>
            No work orders match your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
              <tr>
                {['Unit / Tenant', 'Issue', 'Priority', 'Status', 'Assigned To', 'Created', ''].map(h => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide"
                    style={{ color: '#6B5E8A', background: 'rgba(124,58,237,0.06)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(wo => {
                const tenant = USERS[wo.tenantEmail]
                const isExp = expanded === wo.id
                return (
                  <>
                    <tr
                      key={wo.id}
                      className="transition-smooth"
                      style={{ borderBottom: '1px solid rgba(124,58,237,0.08)', background: isExp ? 'rgba(124,58,237,0.08)' : 'transparent' }}
                      onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = 'rgba(124,58,237,0.05)' }}
                      onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = 'transparent' }}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium" style={{ color: '#EDE9FE' }}>Unit {wo.unit}</p>
                        <p className="text-xs" style={{ color: '#6B5E8A' }}>{tenant?.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium" style={{ color: '#EDE9FE' }}>{wo.title}</p>
                        <p className="text-xs truncate max-w-xs" style={{ color: '#6B5E8A' }}>{wo.description}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={wo.priority} /></td>
                      <td className="px-5 py-4"><StatusBadge status={wo.status} /></td>
                      <td className="px-5 py-4">
                        <select
                          value={wo.assignedTo ?? ''}
                          onChange={e => onAssign(wo.id, e.target.value)}
                          style={{ ...inputStyle, minWidth: '144px' }}
                        >
                          <option value="">Unassigned</option>
                          {VENDORS.map(v => (
                            <option key={v} value={v}>{USERS[v]?.name ?? v}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: '#6B5E8A' }}>{formatDate(wo.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setExpanded(isExp ? null : wo.id)}
                          className="text-xs font-medium transition-smooth"
                          style={{ color: '#A78BFA' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#EDE9FE'}
                          onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
                        >
                          {isExp ? 'Hide' : 'Notes'}
                          {wo.notes.length > 0 && ` (${wo.notes.length})`}
                        </button>
                      </td>
                    </tr>
                    {isExp && (
                      <tr key={`${wo.id}-notes`} style={{ background: 'rgba(124,58,237,0.06)', borderBottom: '1px solid rgba(124,58,237,0.08)' }}>
                        <td colSpan={7} className="px-5 py-4">
                          <p className="text-xs font-medium mb-2" style={{ color: '#A78BFA' }}>Vendor Notes</p>
                          {wo.notes.length === 0 ? (
                            <p className="text-xs italic" style={{ color: '#6B5E8A' }}>No notes yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {wo.notes.map((note, i) => (
                                <div
                                  key={i}
                                  className="rounded-lg px-3 py-2 text-xs"
                                  style={{ background: 'rgba(15,10,30,0.5)', border: '1px solid rgba(124,58,237,0.1)' }}
                                >
                                  <span className="font-medium" style={{ color: '#C4B5FD' }}>{USERS[note.author]?.name ?? note.author}</span>
                                  <span className="ml-2" style={{ color: '#6B5E8A' }}>{formatDate(note.createdAt)}</span>
                                  <p className="mt-0.5" style={{ color: '#EDE9FE' }}>{note.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
