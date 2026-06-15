import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate } from '../../utils/dateUtils.js'
import { USERS } from '../../constants.js'

export default function InspectionsList({ inspections }) {
  const sorted = [...inspections].sort((a, b) => b.scheduledDate.localeCompare(a.scheduledDate))

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
    >
      {sorted.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm" style={{ color: '#6B5E8A' }}>
          No inspections recorded.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
            <tr>
              {['Unit', 'Tenant', 'Type', 'Scheduled', 'Status', 'Completed', 'Notes'].map(h => (
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
            {sorted.map(insp => {
              const tenant = USERS[insp.tenantEmail]
              const isFinalDone = insp.type === 'Final Walkthrough' && insp.status === 'Completed'
              return (
                <tr
                  key={insp.id}
                  className="transition-smooth"
                  style={{
                    borderBottom: '1px solid rgba(124,58,237,0.08)',
                    background: isFinalDone ? 'rgba(34,197,94,0.06)' : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isFinalDone) e.currentTarget.style.background = 'rgba(124,58,237,0.05)' }}
                  onMouseLeave={e => e.currentTarget.style.background = isFinalDone ? 'rgba(34,197,94,0.06)' : 'transparent'}
                >
                  <td className="px-5 py-4 font-medium" style={{ color: '#EDE9FE' }}>Unit {insp.unit}</td>
                  <td className="px-5 py-4" style={{ color: '#A78BFA' }}>{tenant?.name}</td>
                  <td className="px-5 py-4"><StatusBadge status={insp.type} /></td>
                  <td className="px-5 py-4" style={{ color: '#C4B5FD' }}>{formatDate(insp.scheduledDate)}</td>
                  <td className="px-5 py-4"><StatusBadge status={insp.status} /></td>
                  <td className="px-5 py-4 text-xs" style={{ color: '#6B5E8A' }}>
                    {insp.completedAt ? formatDate(insp.completedAt) : '—'}
                  </td>
                  <td className="px-5 py-4 text-xs max-w-xs truncate" style={{ color: '#6B5E8A' }}>
                    {insp.notes || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
