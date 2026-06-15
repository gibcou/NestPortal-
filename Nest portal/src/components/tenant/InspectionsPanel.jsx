import { useState } from 'react'
import StatusBadge from '../shared/StatusBadge.jsx'
import { formatDate } from '../../utils/dateUtils.js'

export default function InspectionsPanel({ inspections, onCompleteInspection }) {
  const [confirming, setConfirming] = useState(null)

  return (
    <div className="space-y-4 max-w-3xl">
      {inspections.length === 0 && (
        <div
          className="rounded-2xl p-8 text-center text-sm"
          style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)', color: '#6B5E8A' }}
        >
          No inspections scheduled.
        </div>
      )}
      {inspections.map(insp => (
        <div
          key={insp.id}
          className="rounded-2xl p-6"
          style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold" style={{ color: '#EDE9FE' }}>{insp.type}</h3>
                <StatusBadge status={insp.type} />
              </div>
              <p className="text-sm" style={{ color: '#6B5E8A' }}>
                Scheduled: <span className="font-medium" style={{ color: '#C4B5FD' }}>{formatDate(insp.scheduledDate)}</span>
              </p>
              {insp.completedAt && (
                <p className="text-sm mt-0.5" style={{ color: '#6B5E8A' }}>
                  Completed: <span className="font-medium" style={{ color: '#86EFAC' }}>{formatDate(insp.completedAt)}</span>
                </p>
              )}
              {insp.notes && (
                <p className="text-sm mt-1 italic" style={{ color: '#6B5E8A' }}>"{insp.notes}"</p>
              )}
            </div>
            <StatusBadge status={insp.status} />
          </div>

          {/* Final Walkthrough actions */}
          {insp.type === 'Final Walkthrough' && insp.status === 'Scheduled' && (
            <div className="mt-5 pt-5 space-y-4" style={{ borderTop: '1px solid rgba(124,58,237,0.12)' }}>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#C4B5FD' }}>Upload Photos / Videos</p>
                <label
                  className="flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer transition-smooth"
                  style={{
                    border: '2px dashed rgba(124,58,237,0.3)',
                    background: 'rgba(124,58,237,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.6)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'
                    e.currentTarget.style.background = 'rgba(124,58,237,0.04)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#7C3AED' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm" style={{ color: '#A78BFA' }}>Click to upload photos or videos (mock)</span>
                  <input type="file" multiple accept="image/*,video/*" className="hidden" />
                </label>
                <p className="text-xs mt-1" style={{ color: '#6B5E8A' }}>Supported formats: JPG, PNG, MP4, MOV</p>
              </div>

              {confirming === insp.id ? (
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)' }}
                >
                  <p className="text-sm font-medium mb-3" style={{ color: '#FDBA74' }}>
                    Are you sure? This will notify your property manager and assigned maintenance vendors.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onCompleteInspection(insp.id); setConfirming(null) }}
                      className="text-sm font-medium px-4 py-2 rounded-lg transition-smooth"
                      style={{ background: 'rgba(249,115,22,0.2)', color: '#FDBA74', border: '1px solid rgba(249,115,22,0.4)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.3)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(249,115,22,0.2)'}
                    >
                      Yes, submit walkthrough
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="btn-ghost text-sm px-4 py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirming(insp.id)}
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  Mark as Complete & Submit
                </button>
              )}
            </div>
          )}

          {insp.type === 'Final Walkthrough' && insp.status === 'Completed' && (
            <div
              className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#86EFAC' }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Walkthrough submitted. Your property manager and maintenance team have been notified.
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
