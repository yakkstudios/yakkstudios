'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Wallet({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">👤 PROFILE</div>
        </div>
        <div className="sec-sub">Your YAKK Studios profile, holdings, access tier &amp; activity.</div>
      </div>

      {!walletConnected ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Connect Your Wallet</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 20px' }}>Connect your Solana wallet to view your profile, check your $YST balance and access tier.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      ) : (
        <div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,var(--pink),var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👾</div>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>YAKK Member</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>Solana Wallet Connected</div>
              <div style={{ marginTop: 6 }}>
                <span className={`badge ${ystBalance >= 10_000_000 ? 'b-gold' : ystBalance >= 250_000 ? 'b-green' : 'b-dim'}`}>
                  {ystBalance >= 10_000_000 ? '🐋 WHALE' : ystBalance >= 250_000 ? '🪙 HOLDER' : '⚠ BELOW THRESHOLD'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid4" style={{ marginBottom: 24 }}>
            {[
              { l: '$YST BALANCE', v: ystBalance.toLocaleString(), c: 'var(--gold)' },
              { l: 'ACCESS TIER', v: ystBalance >= 250_000 ? 'FULL ACCESS' : 'LIMITED', c: ystBalance >= 250_000 ? 'var(--green)' : 'var(--red)' },
              { l: 'TOOLS UNLOCKED', v: ystBalance >= 250_000 ? '30+' : '4', c: 'var(--text)' },
              { l: 'REV-SHARE', v: ystBalance >= 250_000 ? 'ACTIVE' : 'LOCKED', c: ystBalance >= 250_000 ? 'var(--green)' : 'var(--dim)' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="slbl">{s.l}</div>
                <div className="sval" style={{ color: s.c, fontSize: 14 }}>{s.v}</div>
              </div>
            ))}
          </div>

          {ystBalance < 250_000 && (
            <div style={{ background: 'rgba(247,201,72,0.04)', border: '1px solid rgba(247,201,72,0.15)', borderRadius: 10, padding: '16px 20px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--gold)', marginBottom: 6 }}>Upgrade Your Access</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>You need 250,000 $YST to unlock all YAKK Studios tools &amp; rev-share rewards.</div>
              <div className="prog-bar" style={{ marginBottom: 8 }}>
                <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
              </div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)', marginBottom: 12 }}>{ystBalance.toLocaleString()} / 250,000 $YST</div>
              <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get More $YST on Jupiter →</a>
            </div>
          )}

          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
            QUICK LINKS
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Solscan ↗</a>
            <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Birdeye ↗</a>
            <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer" className="btn btn-gold">StakePoint ↗</a>
          </div>
        </div>
      )}
    </div>
  );
}
