'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Stakepoint({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--gold),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🏆 STAKEPOINT</div>
          <span className="badge b-gold">PARTNER</span>
        </div>
        <div className="sec-sub">Stake your $YST tokens on StakePoint to earn rewards, unlock tools &amp; access rev-share.</div>
      </div>

      <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>🏆 Stake $YST. Earn Rewards.</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
            StakePoint is YAKK Studios' official staking partner. Stake your $YST to:<br />
            • Earn platform revenue share in SOL<br />
            • Unlock all YAKK Studios tools<br />
            • Access exclusive holder-only features<br />
            • Participate in governance votes
          </div>
          <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Launch StakePoint App →</a>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--gold)' }}>18.4%</div>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)' }}>EST. APY</div>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: 24 }}>
        {[
          { emoji: '🔐', title: 'MINIMUM HOLD', desc: 'No minimum — any amount of $YST unlocks basic features. 250K+ for full access.' },
          { emoji: '💸', title: 'REV-SHARE', desc: 'Platform fees distributed to stakers weekly in SOL. Higher hold = bigger share.' },
          { emoji: '🗳️', title: 'GOVERNANCE', desc: 'Vote on platform direction, new features & fee structures. Your YST = your vote.' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {walletConnected && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 10 }}>YOUR STATUS</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>$YST BALANCE</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>{ystBalance.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>ACCESS TIER</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: ystBalance >= 250_000 ? 'var(--green)' : 'var(--muted)' }}>
                {ystBalance >= 10_000_000 ? '🐋 WHALE' : ystBalance >= 250_000 ? '🪙 HOLDER' : '⚠ BELOW THRESHOLD'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Open StakePoint →</a>
        <a href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Buy $YST on Meteora</a>
        <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Buy on Jupiter</a>
      </div>
    </div>
  );
}
