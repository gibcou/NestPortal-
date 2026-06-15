export default function PublicLayout({ children, publicView, onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0F0A1E' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }} />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #F97316 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, #7C3AED, transparent)' }} />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(15,10,30,0.8)', backdropFilter: 'blur(20px)' }}>
        <button onClick={() => onNavigate('login')} className="flex items-center gap-3 cursor-pointer group" aria-label="NestPortal home">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-smooth group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)' }}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight leading-none">NestPortal</span>
            <div className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'rgba(167,139,250,0.6)' }}>Property OS</div>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onNavigate('pricing')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-smooth cursor-pointer"
            style={{
              color: publicView === 'pricing' ? '#A78BFA' : 'rgba(167,139,250,0.6)',
              background: publicView === 'pricing' ? 'rgba(124,58,237,0.12)' : 'transparent',
            }}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="ml-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-smooth cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #7C3AED)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}
          >
            Sign in
          </button>
        </div>
      </nav>

      <main className="flex-1 relative z-10">{children}</main>

      <footer className="relative z-10 py-5 text-center text-xs"
        style={{ color: 'rgba(167,139,250,0.3)', borderTop: '1px solid rgba(124,58,237,0.08)' }}>
        © 2026 NestPortal · Property Management Platform
      </footer>
    </div>
  )
}
