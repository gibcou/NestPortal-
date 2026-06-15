import { relativeTime } from '../../utils/dateUtils.js'

export default function NotificationPanel({ notifications, onDismiss, onDismissAll, onClose }) {
  const unread = notifications.filter(n => !n.read)

  return (
    <div
      className="absolute right-0 top-full mt-2 w-96 rounded-xl z-50 overflow-hidden"
      style={{
        background: 'rgba(26,17,48,0.97)',
        border: '1px solid rgba(124,58,237,0.25)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm" style={{ color: '#EDE9FE', fontFamily: "'Fira Sans', sans-serif" }}>
            Notifications
          </h3>
          {unread.length > 0 && (
            <span
              className="text-white text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: '#7C3AED', fontSize: '10px' }}
            >
              {unread.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unread.length > 0 && (
            <button
              onClick={onDismissAll}
              className="text-xs font-medium transition-smooth"
              style={{ color: '#A78BFA' }}
              onMouseEnter={e => e.currentTarget.style.color = '#EDE9FE'}
              onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="transition-smooth"
            style={{ color: '#6B5E8A' }}
            onMouseEnter={e => e.currentTarget.style.color = '#A78BFA'}
            onMouseLeave={e => e.currentTarget.style.color = '#6B5E8A'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#3D2E5C' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-sm" style={{ color: '#6B5E8A' }}>No notifications</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-3 px-4 py-3 transition-smooth"
              style={{
                borderBottom: '1px solid rgba(124,58,237,0.08)',
                background: !notif.read ? 'rgba(124,58,237,0.08)' : 'transparent',
              }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: !notif.read ? '#7C3AED' : '#3D2E5C' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: '#EDE9FE' }}>{notif.message}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B5E8A' }}>{relativeTime(notif.createdAt)}</p>
              </div>
              {!notif.read && (
                <button
                  onClick={() => onDismiss(notif.id)}
                  className="transition-smooth shrink-0"
                  style={{ color: '#3D2E5C' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#A78BFA'}
                  onMouseLeave={e => e.currentTarget.style.color = '#3D2E5C'}
                  title="Mark as read"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
