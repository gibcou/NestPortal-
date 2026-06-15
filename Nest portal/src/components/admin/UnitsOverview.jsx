import { useState } from 'react'
import { USERS } from '../../constants.js'
import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate } from '../../utils/dateUtils.js'

export default function UnitsOverview({ units, workOrders, inspections }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="space-y-4">
      {units.map(unit => {
        const tenant = USERS[unit.tenant]
        const unitWOs = workOrders.filter(wo => wo.unit === unit.id)
        const openWOs = unitWOs.filter(wo => wo.status !== 'Completed')
        const lastInsp = inspections
          .filter(i => i.unit === unit.id && i.status === 'Completed')
          .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))[0]
        const isOpen = expanded === unit.id

        return (
          <div
            key={unit.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-left transition-smooth"
              onClick={() => setExpanded(isOpen ? null : unit.id)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
                >
                  <span className="font-bold text-sm" style={{ color: '#A78BFA' }}>{unit.id}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#EDE9FE' }}>{unit.address}</p>
                  <p className="text-sm" style={{ color: '#6B5E8A' }}>
                    {tenant?.name} · <span style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.7rem' }}>{unit.tenant}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {openWOs.length > 0 ? (
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: 'rgba(234,179,8,0.12)', color: '#FCD34D', border: '1px solid rgba(234,179,8,0.25)' }}
                  >
                    {openWOs.length} open issue{openWOs.length > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    All clear
                  </span>
                )}
                <svg
                  className="w-5 h-5 transition-transform"
                  style={{ color: '#6B5E8A', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="px-6 py-5 space-y-5" style={{ borderTop: '1px solid rgba(124,58,237,0.12)' }}>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {[
                    { label: 'Tenant', value: tenant?.name },
                    { label: 'Last Inspection', value: lastInsp ? formatDate(lastInsp.completedAt) : 'None' },
                    { label: 'Total Work Orders', value: unitWOs.length },
                  ].map(d => (
                    <div
                      key={d.label}
                      className="rounded-xl p-3"
                      style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}
                    >
                      <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6B5E8A' }}>{d.label}</p>
                      <p className="font-medium" style={{ color: '#EDE9FE' }}>{d.value}</p>
                    </div>
                  ))}
                </div>

                {unitWOs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2" style={{ color: '#A78BFA' }}>Work Orders</p>
                    <div className="space-y-2">
                      {unitWOs.map(wo => (
                        <div
                          key={wo.id}
                          className="flex items-center justify-between py-2 px-3 rounded-xl"
                          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}
                        >
                          <div>
                            <p className="text-sm" style={{ color: '#EDE9FE' }}>{wo.title}</p>
                            <p className="text-xs" style={{ color: '#6B5E8A' }}>
                              {wo.assignedTo ? `Assigned to ${wo.assignedTo}` : 'Unassigned'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={wo.priority} />
                            <StatusBadge status={wo.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
