import { useState } from 'react'
import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate, relativeTime } from '../../utils/dateUtils.js'
import { USERS } from '../../constants.js'

const STATUS_FLOW = {
  Open: ['Open', 'In Progress'],
  'In Progress': ['In Progress', 'Completed'],
  Completed: ['Completed'],
}

export default function VendorWorkOrders({ workOrders, currentUser, onUpdateStatus, onAddNote }) {
  const [expanded, setExpanded] = useState(null)
  const [noteText, setNoteText] = useState({})

  if (workOrders.length === 0) {
    return (
      <div
        className="rounded-2xl p-12 text-center"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3D2E5C' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm" style={{ color: '#6B5E8A' }}>No work orders assigned to you yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {workOrders.map(wo => {
        const isExp = expanded === wo.id
        const availableStatuses = STATUS_FLOW[wo.status] ?? [wo.status]
        const myNote = noteText[wo.id] ?? ''

        return (
          <div
            key={wo.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
          >
            {/* Card header */}
            <div className="px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold" style={{ color: '#EDE9FE' }}>{wo.title}</h3>
                    <StatusBadge status={wo.priority} />
                  </div>
                  <p className="text-sm" style={{ color: '#6B5E8A' }}>{wo.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#6B5E8A' }}>
                    <span>Unit {wo.unit}</span>
                    <span>·</span>
                    <span>Submitted {formatDate(wo.createdAt)}</span>
                    {wo.notes.length > 0 && (
                      <>
                        <span>·</span>
                        <span style={{ color: '#A78BFA' }}>{wo.notes.length} note{wo.notes.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    value={wo.status}
                    onChange={e => onUpdateStatus(wo.id, e.target.value)}
                    disabled={wo.status === 'Completed'}
                    style={{
                      background: 'rgba(124,58,237,0.08)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      color: '#EDE9FE',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontFamily: "'Fira Sans', sans-serif",
                      outline: 'none',
                      opacity: wo.status === 'Completed' ? 0.4 : 1,
                      cursor: wo.status === 'Completed' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {availableStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <StatusBadge status={wo.status} />
                </div>
              </div>

              {/* Toggle notes */}
              <button
                onClick={() => setExpanded(isExp ? null : wo.id)}
                className="mt-4 text-xs font-medium flex items-center gap-1 transition-smooth"
                style={{ color: '#A78BFA' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EDE9FE'}
                onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform"
                  style={{ transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {isExp ? 'Hide notes' : `${wo.status === 'Completed' ? 'View' : 'Add'} notes${wo.notes.length > 0 ? ` (${wo.notes.length})` : ''}`}
              </button>
            </div>

            {/* Notes panel */}
            {isExp && (
              <div
                className="px-6 py-5 space-y-4"
                style={{ borderTop: '1px solid rgba(124,58,237,0.12)', background: 'rgba(124,58,237,0.04)' }}
              >
                {wo.notes.length === 0 ? (
                  <p className="text-xs italic" style={{ color: '#6B5E8A' }}>No notes yet. Add the first update below.</p>
                ) : (
                  <div className="space-y-3">
                    {wo.notes.map((note, i) => (
                      <div
                        key={i}
                        className="rounded-xl px-4 py-3"
                        style={{ background: 'rgba(15,10,30,0.5)', border: '1px solid rgba(124,58,237,0.12)' }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium" style={{ color: '#C4B5FD' }}>{USERS[note.author]?.name ?? note.author}</span>
                          <span className="text-xs" style={{ color: '#6B5E8A' }}>{relativeTime(note.createdAt)}</span>
                        </div>
                        <p className="text-sm" style={{ color: '#EDE9FE' }}>{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {wo.status !== 'Completed' && (
                  <div className="flex gap-2">
                    <input
                      value={myNote}
                      onChange={e => setNoteText(prev => ({ ...prev, [wo.id]: e.target.value }))}
                      placeholder="Add an update or note..."
                      className="flex-1 input-field"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && myNote.trim()) {
                          onAddNote(wo.id, myNote)
                          setNoteText(prev => ({ ...prev, [wo.id]: '' }))
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (myNote.trim()) {
                          onAddNote(wo.id, myNote)
                          setNoteText(prev => ({ ...prev, [wo.id]: '' }))
                        }
                      }}
                      disabled={!myNote.trim()}
                      className="btn-primary px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add Note
                    </button>
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
