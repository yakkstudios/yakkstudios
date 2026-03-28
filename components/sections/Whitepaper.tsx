'use client';

const REVENUE_SOURCES = [
  { source: 'Screener update', reward: '+500 $YST' },
  { source: 'Investigation request', reward: '+2,500 $YST' },
  { source: 'NFT marketplace sale', reward: '0.5% back' },
  { source: 'Token launch submission', reward: '+5,000 $YST' },
  { source: 'OTC desk fee', reward: '0.1% to treasury' },
  { source: 'Bridge fee', reward: '0.05% to treasury' },
];

const DISTRIBUTION = [
  { cat: '$YST Stakers (monthly)', pct: '30%', color: '#e8206a' },
  { cat: 'Treasury / Ops', pct: '40%', color: '#888' },
  { cat: 'Investigation Fund', pct: '20%', color: '#e8c440' },
  { cat: 'Marketing / Raids', pct: '10%', color: '#00c896' },
];

const TOKEN_INFO = [
  { k: 'Network', v: 'Solana' },
  { k: 'Token', v: '$YST' },
  { k: 'Supply', v: '1,000,000,000' },
  { k: 'Launch', v: 'Fair — revshare' },
  { k: 'Dev Fee', v: '20% locked' },
  { k: 'Tax', v: '5% (2% treasury · 2% stakers · 1% burn)' },
];

export default function Whitepaper({ onNav }: { onNav?: (s: string) => void }) {
  return (
    <section id="section-whitepaper" style={{ padding: '20px' }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>
        📄 WHITEPAPER
      </h2>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 24 }}>
        No gatekeeping. The model is transparent.
      </p>

      {/* Mission */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '16px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>MISSION</div>
        <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, margin: 0 }}>
          YAKK Studios builds anti-greed infrastructure for Solana. Every tool — screener, swap,
          launchpad, OTC desk, investigations — is designed to give retail the same edge that
          insiders have always had. No email. No KYC. Your wallet is your account.
        </p>
      </div>

      {/* Revenue Model */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          REVENUE MODEL
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {[
            { icon: '🏛️', label: 'Platform Treasury' },
            { icon: '💰', label: '$YST Stakers (RevShare)' },
            { icon: '🔥', label: 'Auto-Burn' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '10px 16px', fontSize: 12, color: '#ccc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </div>
          ))}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {['SOURCE', 'REWARD'].map(h => (
                  <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#555', fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {REVENUE_SOURCES.map(({ source, reward }) => (
                <tr key={source} style={{ borderBottom: '1px solid #0f0f0f' }}>
                  <td style={{ padding: '10px', color: '#ccc' }}>{source}</td>
                  <td style={{ padding: '10px', color: '#e8206a', fontWeight: 700 }}>{reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribution */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          REVENUE DISTRIBUTION
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8 }}>
          {DISTRIBUTION.map(({ cat, pct, color }) => (
            <div key={cat} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color }}>{pct}</div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4, lineHeight: 1.4 }}>{cat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Token Info */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          TOKEN INFO
        </div>
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, overflow: 'hidden' }}>
          {TOKEN_INFO.map(({ k, v }, i) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px', borderBottom: i < TOKEN_INFO.length - 1 ? '1px solid #111' : 'none'
            }}>
              <span style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>{k}</span>
              <span style={{ fontSize: 12, color: '#ccc', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tokenomics breakdown */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
          TOKENOMICS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8 }}>
          {[
            { pct: '2%', label: 'treasury', icon: '🏛️' },
            { pct: '2%', label: '$YST stakers', icon: '💰' },
            { pct: '1%', label: 'auto-burn', icon: '🔥' },
            { pct: '20%', label: 'dev locked', icon: '🔒' },
          ].map(({ pct, label, icon }) => (
            <div key={label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 18 }}>{icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e8206a', margin: '4px 0 2px' }}>{pct}</div>
              <div style={{ fontSize: 10, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onNav?.('terminal')}
        style={{ background: '#e8206a', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13, letterSpacing: 1 }}>
        SWAP HERE →
      </button>
    </section>
  );
}
