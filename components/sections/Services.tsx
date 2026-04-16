'use client';

const TIERS = [
  {
    name: 'STARTER',
    price: '\u00a31,500',
    period: '/month',
    tag: 'FOUNDATION',
    color: '#888',
    features: [
      'Community AI Bot (Telegram/Discord)',
      'Daily market intelligence briefings',
      'Basic trading signal feed',
      'On-chain alert automation',
      'Weekly performance report',
    ],
    cta: 'Get Started',
  },
  {
    name: 'GROWTH',
    price: '\u00a32,500',
    period: '/month',
    tag: 'MOST POPULAR',
    color: '#e8c84a',
    features: [
      'Everything in Starter',
      'Custom AI trading signal pipeline',
      'Cabal investigation on request',
      'Content automation (Twitter/X + TG)',
      'Polymarket signal intelligence',
      'Bi-weekly strategy session',
    ],
    cta: 'Book a Call',
  },
  {
    name: 'SCALE',
    price: '\u00a34,000',
    period: '/month',
    tag: 'FULL STACK',
    color: '#ff4d7d',
    features: [
      'Everything in Growth',
      'Full n8n automation backbone',
      'Custom on-chain investigation pipeline',
      'FinBERT sentiment feed (live)',
      'Dedicated AI agent stack',
      'Priority builds + weekly sync',
    ],
    cta: 'Get Scale',
  },
];

const SERVICES = [
  { icon: '\ud83e\udd16', title: 'Community AI Bots', desc: 'Automated Telegram and Discord bots for market updates, holder queries, and community engagement.' },
  { icon: '\ud83d\udce1', title: 'Trading Signal Pipelines', desc: 'Real-time AI-generated signals via FinBERT sentiment + on-chain whale tracking.' },
  { icon: '\ud83d\udd75\ufe0f', title: 'Cabal Investigations', desc: 'Deep on-chain forensic analysis. We have tracked $3.9B+ in extraction patterns.' },
  { icon: '\ud83d\udcf0', title: 'Content Automation', desc: 'Daily AI-written briefings, Twitter/X posts, and market commentary \u2014 automated.' },
  { icon: '\ud83c\udfaf', title: 'Polymarket Intelligence', desc: 'Latency arbitrage signals and news-driven probability analysis for prediction markets.' },
  { icon: '\u2699\ufe0f', title: 'n8n Automation Stack', desc: 'Full workflow automation connecting AI agents, APIs, and your community channels.' },
];

const PROOF = [
  { stat: '$3.9B+', label: 'On-chain tracked' },
  { stat: '12+', label: 'Investigations published' },
  { stat: '30+', label: 'Live platform tools' },
  { stat: '85\u201398%', label: 'Polymarket win rate' },
];

export default function Services() {
  return (
    <div className="sec-pad" id="section-services">
      {/* Header - standard pattern: eyebrow > title > bar > description */}
      <div className="sec-eyebrow">AI INFRASTRUCTURE</div>
      <div className="sec-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        \ud83e\udd16 YAKK AI SERVICES
        <span className="badge b-yakk">LIVE</span>
      </div>
      <div className="sec-bar"></div>
      <p style={{ fontSize: '0.75rem', color: 'var(--dim)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        We build the AI stack that powers this platform &mdash; and we build it for your project too.
        Retainers from &pound;1,500/month. No lock-in.
      </p>

      {/* Proof stats */}
      <div className="grid4" style={{ margin: '0 0 1.5rem' }}>
        {PROOF.map(p => (
          <div key={p.stat} className="stat-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)', fontFamily: 'monospace' }}>{p.stat}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* Proof of concept callout */}
      <div style={{
        background: 'rgba(232,200,74,0.05)',
        border: '1px solid rgba(232,200,74,0.2)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--gold)' }}>YAKK Studios is the proof of concept.</strong>{' '}
          Everything we sell, we use. The platform you are looking at runs on the same AI stack we offer
          to clients &mdash; FinBERT sentiment feeds, Polymarket signal intelligence, automated investigation
          pipelines, community bots, and n8n automation backbones. We have tracked{' '}
          <strong style={{ color: '#fff' }}>$3.9B+ in on-chain extraction patterns</strong> across{' '}
          <strong style={{ color: '#fff' }}>11 forensic investigations</strong>.
        </div>
      </div>

      {/* What we build */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'monospace' }}>
          WHAT WE BUILD
        </div>
        <div className="grid3">
          {SERVICES.map(s => (
            <div key={s.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '1rem',
            }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Retainer tiers */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', fontFamily: 'monospace' }}>
          RETAINER TIERS
        </div>
        <div className="grid3">
          {TIERS.map(t => (
            <div key={t.name} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${t.color}40`,
              borderTop: `3px solid ${t.color}`,
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: t.color, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>{t.tag}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>{t.name}</div>
                <div style={{ marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: t.color, fontFamily: 'monospace' }}>{t.price}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--dim)' }}>{t.period}</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {t.features.map(f => (
                  <li key={f} style={{ fontSize: '0.73rem', color: '#bbb', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: t.color, flexShrink: 0 }}>{'\u2713'}</span>{f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:studiosyakksol@gmail.com?subject=YAKK AI Services Enquiry"
                className="btn btn-outline btn-sm"
                style={{ textAlign: 'center', borderColor: t.color, color: t.color, marginTop: 'auto' }}
              >
                {t.cta} {'\u2192'}
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', fontFamily: 'monospace' }}>ADD-ONS (ALL TIERS)</div>
        <div className="grid3" style={{ gap: '0.5rem' }}>
          {[
            ['\ud83d\udd0d', 'Deep Cabal Investigation', '1 SOL per report'],
            ['\ud83d\udcca', 'Power BI / Data Dashboard', '\u00a3400 one-off'],
            ['\ud83d\udea8', 'Emergency Response', '\u00a3200/incident'],
          ].map(([icon, name, price]) => (
            <div key={name} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#ccc' }}>{name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gold)' }}>{price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href="mailto:studiosyakksol@gmail.com?subject=YAKK AI Services Enquiry"
          className="btn btn-gold"
        >
          {'\ud83d\udce9'} Book a Discovery Call
        </a>
        <a
          href="https://x.com/YakkStudios"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          {'\ud835\udd4f'} DM on Twitter
        </a>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--dim)' }}>
        No lock-in contracts. Month-to-month. First call is free. $YST holders get 10% off all tiers.
      </div>
    </div>
  );
}
