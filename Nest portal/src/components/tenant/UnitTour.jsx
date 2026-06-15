import { USERS, UNITS } from '../../constants.js'

export default function UnitTour({ currentUser }) {
  const user = USERS[currentUser.email]
  const unit = UNITS.find(u => u.id === user?.unit)

  const details = [
    { label: 'Unit Number', value: unit?.id },
    { label: 'Address', value: unit?.address },
    { label: 'Bedrooms', value: '2 BR' },
    { label: 'Bathrooms', value: '1 BA' },
    { label: 'Square Footage', value: '875 sq ft' },
    { label: 'Floor', value: '1st Floor' },
  ]

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Video player card */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <h3 className="font-semibold mb-1" style={{ color: '#EDE9FE' }}>Virtual Unit Tour</h3>
        <p className="text-sm mb-5" style={{ color: '#6B5E8A' }}>{unit?.address}</p>

        <div
          className="aspect-video rounded-xl flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0D0820 0%, #1A1130 100%)',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
          >
            <svg className="w-8 h-8 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#A78BFA' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#A78BFA' }}>Unit Tour Video</p>
          <p className="text-xs mt-1" style={{ color: '#6B5E8A' }}>Video content coming soon</p>
        </div>
      </div>

      {/* Unit details */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <h3 className="font-semibold mb-5" style={{ color: '#EDE9FE' }}>Unit Details</h3>
        <div className="grid grid-cols-2 gap-4">
          {details.map(d => (
            <div
              key={d.label}
              className="rounded-xl p-4"
              style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.1)' }}
            >
              <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#6B5E8A' }}>{d.label}</p>
              <p className="text-sm font-semibold" style={{ color: '#EDE9FE' }}>{d.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
