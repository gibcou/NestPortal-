import { useState } from 'react'
import NotificationPanel from '../shared/NotificationPanel.jsx'

export default function Header({ title, notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header
      className="h-16 flex items-center justify-between px-6 shrink-0 relative"
      style={{
        background: 'rgba(15,10,30,0.8)',
        borderBottom: '1px solid rgba(124,58,237,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <h1
        className="text-base font-semibold tracking-tight"
        style={{ color: '#EDE9FE', fontFamily: "'Fira Sans', sans-serif" }}
      >
        {title}
      </h1>

      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="relative p-2 rounded-lg transition-smooth"
          style={{ color: '#A78BFA' }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(124,58,237,0.12)'
            e.currentTarget.style.color = '#EDE9FE'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#A78BFA'
          }}
          aria-label="Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none"
              style={{ background: '#F97316', fontSize: '10px' }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <NotificationPanel
            notifications={notifications}
            onDismiss={id => { onMarkRead(id) }}
            onDismissAll={() => { onMarkAllRead() }}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    </header>
  )
}
