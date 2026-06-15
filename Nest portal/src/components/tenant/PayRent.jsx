import { useState } from 'react'

const PAYMENT_HISTORY = [
  { id: 1, date: 'Jun 1, 2026', amount: '$1,250.00', method: 'Visa ••4242', status: 'Paid' },
  { id: 2, date: 'May 1, 2026', amount: '$1,250.00', method: 'Visa ••4242', status: 'Paid' },
  { id: 3, date: 'Apr 1, 2026', amount: '$1,250.00', method: 'Visa ••4242', status: 'Paid' },
]

export default function PayRent() {
  const [paid, setPaid] = useState(false)

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Balance card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(15,10,30,1) 70%)',
          border: '1px solid rgba(124,58,237,0.25)',
        }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#6B5E8A' }}>Amount Due</p>
        <p className="text-5xl font-bold mb-1" style={{ color: '#EDE9FE' }}>$1,250.00</p>
        <p className="text-sm" style={{ color: '#A78BFA' }}>Due July 1, 2026</p>

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(124,58,237,0.15)' }}>
          <p className="text-sm font-medium mb-3" style={{ color: '#C4B5FD' }}>Payment Method</p>
          <div
            className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <div
              className="w-11 h-7 rounded-md text-white text-xs font-bold flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1D4ED8, #3B82F6)' }}
            >
              VISA
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: '#EDE9FE' }}>Visa ending in 4242</p>
              <p className="text-xs" style={{ color: '#6B5E8A' }}>Expires 08/28</p>
            </div>
          </div>
        </div>

        {paid ? (
          <div
            className="mt-5 flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86EFAC' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Payment of $1,250.00 submitted successfully!</span>
          </div>
        ) : (
          <button
            onClick={() => setPaid(true)}
            className="btn-primary mt-5 w-full py-3 text-sm font-semibold"
          >
            Pay $1,250.00 Now
          </button>
        )}
      </div>

      {/* Payment history */}
      <div
        className="rounded-2xl p-6"
        style={{ background: '#1A1130', border: '1px solid rgba(124,58,237,0.15)' }}
      >
        <h3 className="font-semibold mb-5" style={{ color: '#EDE9FE' }}>Payment History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              {['Date', 'Amount', 'Method', 'Status'].map(h => (
                <th key={h} className="pb-3 text-left text-xs font-medium uppercase tracking-wide" style={{ color: '#6B5E8A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PAYMENT_HISTORY.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid rgba(124,58,237,0.06)' }}>
                <td className="py-3" style={{ color: '#A78BFA' }}>{row.date}</td>
                <td className="py-3 font-semibold" style={{ color: '#EDE9FE' }}>{row.amount}</td>
                <td className="py-3" style={{ color: '#6B5E8A', fontFamily: "'Fira Code', monospace", fontSize: '0.75rem' }}>{row.method}</td>
                <td className="py-3">
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#86EFAC', border: '1px solid rgba(34,197,94,0.25)' }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
