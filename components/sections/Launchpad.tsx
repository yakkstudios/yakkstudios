'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const LAUNCHES = [
  {
    name: 'YAKK Meme Index',
    ticker: '$YMEME',
    desc: 'A curated index of top Solana meme coins weighted by YAKK community sentiment and on-chain activity.',
    raise: '150,000 USDC',
    raised: 87_500,
    goal: 150_000,
    tier: 'WHITELIST',
    badge: 'b-gold',
    status: 'LIVE',
    end: '3d 12h',
    img: '🎰',
  },
  {
    name: 'YAKK NFT Aggregator',
    ticker: '$YAGG',
    desc: 'Aggregated NFT marketplace with AI-powered floor price analytics and cross-marketplace routing.',
    raise: '80,000 USDC',
    raised: 80_000,
    goal: 80_000,
    tier: 'SOLD OUT',
    badge: 'b-dim',
    status: 'CLOSED',
    end: 'Ended',
    img: '🖼️',
  },
  {
    name: 'StakePoint Governance',
    ticker: '$SPG',
    desc: 'Governance token for StakePoint protocol. YST holders get guaranteed whitelist allocation.',
    raise: '200,000 USDC',
    raised: 12_000,
    goal: 200_000,
    tier: 'UPCOMING',
    badge: 'b-blue',
    status: 'SOON',
    end: 'In 7d',
    img: '🏆',
  },
];

export default function Launchpad({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--pink),var(--gold))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🚀 LAUNCHPAD</div>
          <span className="badge b-pink">EXCLUSIVE</span>
        </div>
        <div className="sec-sub">Early-access token launches &amp; IDOs. $YST holders get whitelist priority.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Required</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Launchpad — Holders Only</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Connect wallet &amp; hold 250K+ $YST for guaranteed whitelist access to all launches.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more to access launchpad.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter →</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div className="grid4" style={{ marginBottom: 20 }}>
            {[
              { l: 'TOTAL RAISED', v: '$317K', c: 'var(--gold)' },
              { l: 'LAUNCHES', v: '3', c: 'var(--blue)' },
              { l: 'YOUR TIER', v: ystBalance >= 10_000_000 ? 'WHALE' : 'HOLDER', c: ystBalance >= 10_000_000 ? 'var(--gold)' : 'var(--green)' },
              { l: 'ALLOCATION BOOST', v: ystBalance >= 10_000_000 ? '5×' : '2×', c: 'var(--pink)' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="slbl">{s.l}</div>
                <div className="sval" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          {LAUNCHES.map(launch => (
            <div key={launch.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ fontSize: 40, width: 60, height: 60, background: 'var(--bg4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{launch.img}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16 }}>{launch.name}</div>
                    <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>{launch.ticker}</span>
                    <span className={`badge ${launch.badge}`}>{launch.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 10, maxWidth: 500 }}>{launch.desc}</div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    {[['TARGET RAISE', launch.raise], ['ENDS', launch.end], ['ACCESS', launch.tier]].map(([l, v]) => (
                      <div key={l as string}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>{l}</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="prog-bar" style={{ marginBottom: 8 }}>
                <div className="prog-fill" style={{ width: Math.min(100, (launch.raised / launch.goal) * 100) + '%', background: launch.status === 'CLOSED' ? 'var(--dim)' : undefined }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>${launch.raised.toLocaleString()} raised</span>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{Math.round(launch.raised / launch.goal * 100)}%</span>
              </div>
              <button
                className={`btn ${launch.status === 'LIVE' ? 'btn-pink' : launch.status === 'SOON' ? 'btn-outline' : 'btn-outline'}`}
                style={{ fontSize: 11 }}
                disabled={launch.status !== 'LIVE'}
              >
                {launch.status === 'LIVE' ? '🚀 Participate Now' : launch.status === 'SOON' ? '🔔 Notify Me' : '✓ Closed'}
              </button>
            </div>
          ))}

          <div style={{ background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 10, padding: '16px 20px', marginTop: 8 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--pink)', marginBottom: 6 }}>Apply for Launchpad</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>Building a Solana project? Apply to launch with YAKK Studios and tap into our holder community.</div>
            <a href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer" className="btn btn-pink" style={{ fontSize: 11 }}>Apply via Telegram →</a>
          </div>
        </div>
      )}
    </div>
  );
}
