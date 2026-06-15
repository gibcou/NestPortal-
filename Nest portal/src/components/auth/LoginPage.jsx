import { useState } from 'react'

const DEMO_ACCOUNTS = [
  { role: 'Tenant', emails: ['tenant1@nest.com', 'tenant2@nest.com', 'tenant3@nest.com'] },
  { role: 'Admin',  emails: ['admin1@nest.com', 'admin2@nest.com'] },
  { role: 'Vendor', emails: ['vendor1@nest.com', 'vendor2@nest.com'] },
]

export default function LoginPage({ onLogin, loginError, onNavigateToPricing }) {
  const [email, setEmail] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onLogin(email)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(167,139,250,0.65)' }}>
            Sign in to your NestPortal account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'rgba(26,17,48,0.8)', border: '1px solid rgba(124,58,237,0.2)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#C4B5FD' }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@nest.com"
                required
                className="input-field"
              />
            </div>

            {loginError && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#FCA5A5' }}>
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-smooth cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}
            >
              Continue →
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7 pt-6" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
            <p className="text-xs font-semibold tracking-widest uppercase text-center mb-4"
              style={{ color: 'rgba(167,139,250,0.45)' }}>
              Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map(group => (
                <div key={group.role}
                  className="rounded-xl p-3 text-xs space-y-1.5"
                  style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.12)' }}>
                  <p className="font-semibold text-violet-300 mb-2">{group.role}</p>
                  {group.emails.map(e => (
                    <button
                      key={e}
                      onClick={() => setEmail(e)}
                      className="block w-full text-left transition-smooth cursor-pointer truncate"
                      style={{ color: 'rgba(196,181,253,0.6)', fontFamily: "'Fira Code', monospace", fontSize: '10px' }}
                      onMouseEnter={ev => ev.currentTarget.style.color = '#C4B5FD'}
                      onMouseLeave={ev => ev.currentTarget.style.color = 'rgba(196,181,253,0.6)'}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(167,139,250,0.45)' }}>
          Curious about plans?{' '}
          <button onClick={onNavigateToPricing}
            className="font-medium cursor-pointer transition-smooth"
            style={{ color: '#A78BFA' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C4B5FD'}
            onMouseLeave={e => e.currentTarget.style.color = '#A78BFA'}>
            View pricing
          </button>
        </p>
      </div>
    </div>
  )
}
