const DOCUMENTS = [
  { id: 1, name: 'Lease Agreement',       date: 'Jan 1, 2026', size: '1.2 MB', type: 'PDF' },
  { id: 2, name: 'Move-In Checklist',     date: 'Jan 1, 2026', size: '340 KB', type: 'PDF' },
  { id: 3, name: 'Community Rules',       date: 'Jan 1, 2026', size: '520 KB', type: 'PDF' },
  { id: 4, name: 'Parking Agreement',     date: 'Jan 1, 2026', size: '210 KB', type: 'PDF' },
  { id: 5, name: 'Renters Insurance Req', date: 'Jan 1, 2026', size: '180 KB', type: 'PDF' },
]

export default function Documents() {
  return (
    <div className="max-w-2xl">
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        {DOCUMENTS.map((doc, idx) => (
          <div
            key={doc.id}
            className="flex items-center gap-4 px-5 py-4 transition-smooth"
            style={{
              borderBottom: idx < DOCUMENTS.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* PDF icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <span className="text-xs font-bold" style={{ color: '#FCA5A5' }}>{doc.type}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#EDE9FE' }}>{doc.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#6B5E8A' }}>{doc.date} · {doc.size}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Mock: Opening ${doc.name}`)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-smooth"
                style={{ color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)', background: 'rgba(124,58,237,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
              >
                View
              </button>
              <button
                onClick={() => alert(`Mock: Downloading ${doc.name}`)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-smooth"
                style={{ color: '#6B5E8A', border: '1px solid rgba(124,58,237,0.1)', background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
