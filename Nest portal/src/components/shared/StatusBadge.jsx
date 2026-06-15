const BADGE_STYLES = {
  Open:                { bg: 'rgba(234,179,8,0.15)',  color: '#FCD34D', border: 'rgba(234,179,8,0.3)' },
  'In Progress':       { bg: 'rgba(59,130,246,0.15)', color: '#93C5FD', border: 'rgba(59,130,246,0.3)' },
  Completed:           { bg: 'rgba(34,197,94,0.15)',  color: '#86EFAC', border: 'rgba(34,197,94,0.3)' },
  Scheduled:           { bg: 'rgba(124,58,237,0.15)', color: '#A78BFA', border: 'rgba(124,58,237,0.3)' },
  High:                { bg: 'rgba(239,68,68,0.15)',  color: '#FCA5A5', border: 'rgba(239,68,68,0.3)' },
  Medium:              { bg: 'rgba(249,115,22,0.15)', color: '#FDBA74', border: 'rgba(249,115,22,0.3)' },
  Low:                 { bg: 'rgba(100,116,139,0.15)',color: '#94A3B8', border: 'rgba(100,116,139,0.3)' },
  'Final Walkthrough': { bg: 'rgba(124,58,237,0.2)',  color: '#C4B5FD', border: 'rgba(124,58,237,0.4)' },
  Regular:             { bg: 'rgba(71,85,105,0.2)',   color: '#94A3B8', border: 'rgba(71,85,105,0.4)' },
}

export default function StatusBadge({ status }) {
  const s = BADGE_STYLES[status] ?? { bg: 'rgba(71,85,105,0.15)', color: '#94A3B8', border: 'rgba(71,85,105,0.3)' }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: "'Fira Sans', sans-serif",
      }}
    >
      {status}
    </span>
  )
}
