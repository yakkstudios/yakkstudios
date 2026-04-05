'use client';

const CHAINS = [
  { id: 'solana',   label: 'Solana',   icon: '◎', color: '#9945FF', live: true  },
  { id: 'ethereum', label: 'Ethereum', icon: 'Ξ', color: '#627EEA', live: false },
  { id: 'polygon',  label: 'Polygon',  icon: '⬡', color: '#8247E5', live: false },
  { id: 'base',     label: 'Base',     icon: '🔵', color: '#0052FF', live: false },
  { id: 'arbitrum', label: 'Arbitrum', icon: '🔷', color: '#12AAFF', live: false },
  { id: 'bnb',      label: 'BNB Chain',icon: '●', color: '#F0B90B', live: false },
];

export default function NftMarket({
  walletConnected = false,
  ystBalance = 0,
  onNavigate,
}: {
  walletConnected?: boolean;
  ystBalance?: number;
  onNavigate?: (s: string) => void;
}) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  // ── Gate ──────────────────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="sec-pad">
        <div className="sec-eyebrow">MULTICHAIN MARKETPLACE</div>
        <div className="sec-title">NFT Market</div>
        <div className="sec-bar" />
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Hold <strong>10,000,000 $YST</strong> to access the cross-chain NFT marketplace.
          </div>
          {walletConnected && (
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 14 }}>
              You hold: {ystBalance.toLocaleString()} $YST
            </div>
          )}
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      </div>
    );
  }

  // ── In-development placeholder ────────────────────────────────────────────
  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">MULTICHAIN MARKETPLACE</div>
      <div className="sec-title">NFT Market</div>
      <div className="sec-bar" />

      {/* Chain preview */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {CHAINS.map(({ id, label, icon, color, live }) => (
          <div
            key={id}
            style={{
              background: live ? color + '18' : 'var(--bg3)',
              border: `1px solid ${live ? color + '55' : 'var(--border)'}`,
              color: live ? color : 'var(--dim)',
              padding: '5px 14px', borderRadius: 20,
              fontSize: 11, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 5,
              opacity: live ? 1 : 0.45,
            }}
          >
            <span>{icon}</span>
            <span>{label}</span>
            {live  && <span style={{ fontSize: 9, color: '#00c896', marginLeft: 2 }}>LIVE</span>}
            {!live && <span style={{ fontSize: 9, color: 'var(--dim)', marginLeft: 2 }}>soon</span>}
          </div>
        ))}
      </div>

      {/* In-dev card */}
      <div style={{
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, rgba(153,69,255,0.07), rgba(224,96,126,0.05))',
        border: '1px solid rgba(153,69,255,0.2)',
        borderRadius: 14,
        textAlign: 'center',
        maxWidth: 600,
        margin: '0 auto',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1.2rem' }}>🖼️</div>
        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Cross-Chain NFT Marketplace
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--dim)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 420, margin: '0 auto 1.5rem' }}>
          Buy, sell and discover NFTs across 6 chains — no KYC, your keys your money.
          Solana is live infrastructure. ETH, Polygon, Base, Arbitrum and BNB are in active build.
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {[
            { label: 'Solana', color: '#9945FF', status: 'Infrastructure live' },
            { label: 'ETH + L2s', color: '#627EEA', status: 'Q3 2026' },
            { label: 'BNB Chain', color: '#F0B90B', status: 'Q3 2026' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 16px',
              minWidth: 130,
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: item.color, marginBottom: 3 }}>{item.label}</div>
              <div style={{ fontSize: 9, color: 'var(--dim)', fontFamily: 'Space Mono,monospace' }}>{item.status}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 10, color: 'var(--dim)', fontFamily: 'Space Mono,monospace', marginTop: '0.5rem' }}>
          🐋 Whale Club exclusive · No fake listings · Real chains only
        </div>
      </div>

      {/* YAKK GEN I promo */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        background: 'rgba(224,96,126,0.05)',
        border: '1px solid rgba(224,96,126,0.15)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: 24 }}>🎟️</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3 }}>YAKK GEN I — Launching April 20, 2026</div>
          <div style={{ fontSize: 11, color: 'var(--dim)' }}>
            3,333 pieces. 33.3% secondary royalty routed to Wren. The first collection listed on the YAKK marketplace at launch.
          </div>
        </div>
        <button className="btn btn-pink" onClick={() => onNavigate?.('nftdrop')} style={{ whiteSpace: 'nowrap', fontSize: 10 }}>
          VIEW DROP →
        </button>
      </div>
    </div>
  );
}
