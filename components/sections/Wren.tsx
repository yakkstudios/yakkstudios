'use client';

const WREN_STATS = [
  { stat: '5%', label: 'Of every mint tax' },
  { stat: '100%', label: 'On-chain transparent' },
  { stat: '£0', label: 'Admin overhead' },
  { stat: '∞', label: 'Impact per holder' },
];

const WREN_PILLARS = [
  {
    icon: '🌱',
    title: 'Automated Giving',
    desc: 'Every time a $YST mint tax is collected, 5% is automatically routed to the Wren wallet. No manual transfers, no friction.',
  },
  {
    icon: '🔍',
    title: 'Full Transparency',
    desc: 'The Wren wallet address is public and trackable on-chain. Every contribution is verifiable — no black box.',
  },
  {
    icon: '🌍',
    title: 'Reforestation Focus',
    desc: 'Funds are directed to verified reforestation and carbon capture projects via Wren.co — real trees, real impact.',
  },
  {
    icon: '🤝',
    title: 'Community-Led',
    desc: '$YST holders vote on allocation direction. The community decides where the environmental budget goes.',
  },
];

const WREN_WALLET = '7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n';
const WREN_URL = 'https://www.wren.co';

export default function Wren() {
  return (
    <div className="sec-pad" id="section-wren">
      <div className="sec-header">
        <div className="sec-title">
          🌱 SAVING THE WREN
          <span className="badge b-green" style={{ marginLeft: '0.5rem' }}>LIVE</span>
        </div>
        <div className="sec-bar green" />
      </div>
      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: 580, lineHeight: 1.7 }}>
        5% of every $YST mint tax goes directly to verified reforestation. Automated. Transparent. Permanent.
      </p>

      <div className="grid4" style={{ margin: '1.5rem 0' }}>
        {WREN_STATS.map(p => (
          <div key={p.stat} className="stat-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>{p.stat}</div>
            <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{p.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(74,222,128,0.05)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.7 }}>
          <strong style={{ color: '#4ade80' }}>Crypto can be a force for good.</strong> YAKK Studios hard-coded environmental
          giving into the $YST tokenomics from day one. The Wren initiative is not a promise or a pledge —
          it is a smart contract rule. Every mint, every trade, every tax event automatically seeds the
          planet. We named it after the Wren: small, resilient, and punching far above its weight.
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          HOW IT WORKS
        </div>
        <div className="grid2">
          {WREN_PILLARS.map(p => (
            <div key={p.title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(74,222,128,0.12)',
              borderLeft: '3px solid rgba(74,222,128,0.5)',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: '0.75rem',
            }}>
              <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#999', lineHeight: 1.5 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(74,222,128,0.15)',
        borderRadius: '8px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          WREN WALLET — ON-CHAIN TRACKER
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            color: '#4ade80',
            background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '4px',
            padding: '0.4rem 0.75rem',
          }}>
            {WREN_WALLET}
          </div>
          <a
            href={`https://solscan.io/account/${WREN_WALLET}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ borderColor: '#4ade80', color: '#4ade80' }}
          >
            View on Solscan →
          </a>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#555' }}>
          All contributions are verifiable on Solana mainnet. Balance updates in real-time.
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          INITIATIVE MILESTONES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Wren wallet deployed on-chain', status: 'done', detail: 'Q1 2025 — wallet live on Solana mainnet' },
            { label: '5% mint tax routing hard-coded', status: 'done', detail: 'Embedded in $YST tokenomics at launch' },
            { label: 'First reforestation contribution', status: 'done', detail: 'Initial allocation via Wren.co verified' },
            { label: 'Community allocation voting', status: 'pending', detail: 'On-chain governance for fund direction — coming Q2 2025' },
            { label: 'Impact dashboard live in portal', status: 'pending', detail: 'Real-time SOL balance + trees planted counter' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: m.status === 'done' ? '#4ade80' : 'rgba(74,222,128,0.15)',
                border: `2px solid ${m.status === 'done' ? '#4ade80' : 'rgba(74,222,128,0.3)'}`,
                flexShrink: 0,
                marginTop: '2px',
              }} />
              <div>
                <div style={{ fontSize: '0.78rem', color: m.status === 'done' ? '#fff' : '#666', fontWeight: 600 }}>{m.label}</div>
                <div style={{ fontSize: '0.7rem', color: '#555', marginTop: '0.15rem' }}>{m.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={WREN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-gold"
          style={{ background: '#4ade80', borderColor: '#4ade80', color: '#000' }}
        >
          🌍 Visit Wren.co
        </a>
        <a
          href={`https://solscan.io/account/${WREN_WALLET}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ borderColor: '#4ade80', color: '#4ade80' }}
        >
          🔍 Track On-Chain
        </a>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.72rem', color: '#555' }}>
        The Wren initiative is permanent and non-removable from $YST tokenomics. It cannot be voted away.
      </div>
    </div>
  );
}
