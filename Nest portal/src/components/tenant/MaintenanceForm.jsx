import { useState } from 'react'
import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate } from '../../utils/dateUtils.js'

export default function MaintenanceForm({ workOrders, onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, description, priority })
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Form card */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <h3 className="font-semibold mb-5" style={{ color: '#EDE9FE' }}>Submit a New Request</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#C4B5FD' }}>Issue Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="e.g. Leaking faucet, broken AC..."
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#C4B5FD' }}>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="Describe the issue in detail..."
              className="input-field w-full resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#C4B5FD' }}>Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="input-field"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="submit" className="btn-primary px-5 py-2.5 text-sm">
              Submit Request
            </button>
            {submitted && (
              <span className="text-sm font-medium flex items-center gap-1" style={{ color: '#86EFAC' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submitted!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Request history */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#EDE9FE' }}>My Requests</h3>
        {workOrders.length === 0 ? (
          <p className="text-sm" style={{ color: '#6B5E8A' }}>No maintenance requests submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {workOrders.map(wo => (
              <div
                key={wo.id}
                className="rounded-xl p-4"
                style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#EDE9FE' }}>{wo.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B5E8A' }}>{wo.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={wo.priority} />
                    <StatusBadge status={wo.status} />
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#6B5E8A' }}>
                  <span>Submitted {formatDate(wo.createdAt)}</span>
                  {wo.assignedTo && (
                    <span style={{ color: '#A78BFA' }}>Assigned to maintenance team</span>
                  )}
                </div>
                {wo.notes.length > 0 && (
                  <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(124,58,237,0.1)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: '#A78BFA' }}>Latest update:</p>
                    <p className="text-xs italic" style={{ color: '#6B5E8A' }}>"{wo.notes[wo.notes.length - 1].text}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
