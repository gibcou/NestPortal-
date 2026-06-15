const PLANS = [
  {
    name: 'Basic',
    price: '$49',
    period: '/mo',
    description: 'For independent landlords',
    highlight: false,
    features: [
      'Up to 10 units',
      'Tenant portal',
      'Maintenance requests',
      'Document storage',
      'Email support',
    ],
  },
  {
    name: 'Pro',
    price: '$149',
    period: '/mo',
    description: 'For growing property managers',
    highlight: true,
    features: [
      'Up to 50 units',
      'Everything in Basic',
      'Vendor management',
      'Inspection workflows',
      'In-app notifications',
      'Work order tracking',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: '$399',
    period: '/mo',
    description: 'For large management firms',
    highlight: false,
    features: [
      'Unlimited units',
      'Everything in Pro',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'API access',
      'White-label option',
    ],
  },
]

function CheckIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function PricingPage({ onNavigateToLogin }) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#A78BFA' }}>
            Transparent Pricing
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
            Plans for every<br />
            <span className="text-gradient">portfolio size</span>
          </h1>
          <p className="mt-4 text-lg" style={{ color: 'rgba(167,139,250,0.6)' }}>
            No hidden fees. No long-term contracts. Cancel any time.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className="relative rounded-2xl p-8 flex flex-col transition-smooth"
              style={plan.highlight ? {
                background: 'linear-gradient(145deg, #1E1040 0%, #2D1A5E 100%)',
                border: '1px solid rgba(124,58,237,0.5)',
                boxShadow: '0 0 48px rgba(124,58,237,0.22)',
                transform: 'scale(1.02)',
              } : {
                background: 'rgba(26,17,48,0.6)',
                border: '1px solid rgba(124,58,237,0.15)',
              }}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wide"
                    style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', color: 'white', boxShadow: '0 0 16px rgba(249,115,22,0.45)' }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-lg font-bold text-white">{plan.name}</h2>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(167,139,250,0.55)' }}>{plan.description}</p>
                <div className="flex items-end gap-1 mt-5">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm mb-2" style={{ color: 'rgba(167,139,250,0.5)' }}>{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm"
                    style={{ color: plan.highlight ? 'rgba(196,181,253,0.85)' : 'rgba(167,139,250,0.65)' }}>
                    <span style={{ color: plan.highlight ? '#A78BFA' : 'rgba(124,58,237,0.7)' }}>
                      <CheckIcon />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={onNavigateToLogin}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-smooth cursor-pointer"
                style={plan.highlight ? {
                  background: 'linear-gradient(135deg, #6D28D9, #7C3AED)',
                  color: 'white',
                  boxShadow: '0 0 24px rgba(124,58,237,0.45)',
                } : {
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#A78BFA',
                }}
              >
                Get started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-12" style={{ color: 'rgba(167,139,250,0.4)' }}>
          Already have an account?{' '}
          <button onClick={onNavigateToLogin}
            className="font-medium cursor-pointer transition-smooth"
            style={{ color: '#A78BFA' }}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
