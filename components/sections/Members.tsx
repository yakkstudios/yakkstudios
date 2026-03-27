'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const LEADERBOARD = [
  { rank: 1, addr: 'FhVo...HLuM', bal: '747,915,265', tier: 'WHALE KING', badge: 'b-gold' },
  { rank: 2, addr: '6zNu...Ae9q', bal: '150,053,867', tier: 'WHALE', badge: 'b-gold' },
  { rank: 3, addr: '5JLX...DsSX', bal: '24,890,118', tier: 'WHALE', badge: 'b-gold' },
  { rank: 4, addr: '6xsy...cnY', bal: '19,719,408', tier: 'WHALE', badge: 'b-gold' },
  { rank: 5, addr: '8EwC...BU7', bal: '19,600,000', tier: 'WHALE', badge: 'b-gold' },
  { rank: 6, addr: '6VCN...bag', bal: '10,194,224', tier: 'WHALE', badge: 'b-gold' },
  { rank: 7, addr: 'H5br...PqB', bal: '10,000,000', tier: 'WHALE', badge: 'b-gold' },
  { rank: 8, addr: '8Aiy...Lc', bal: '5,031,907', tier: 'HOLDER', badge: 'b-yakk' },
  { rank: 9, addr: '7P7x...MMB', bal: '5,000,000', tier: 'HOLDER', badge: 'b-yakk' },
  { rank: 10, addr: 'BhsY...ijN', bal: '2,113,925', tier: 'HOLDER', badge: 'b-yakk' },
];

export default function Members({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const tier = ystBalance >= 10_000_000 ? 'ð WHALE' : ystBalance >= 1_000_000 ? 'ð DIAMOND' : ystBalance >= 250_000 ? 'ðª HOLDER' : 'â';

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,#a855f7,var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð¾ MEMBERS</div>
          <span className="badge b-yakk">EXCLUSIVE</span>
        </div>
        <div className="sec-sub">YAKK community leaderboard. Top $YST holders, tiers &amp; exclusive member perks.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> ðª Held</span>
          {hasAccess
            ? <span className="badge b-green">â ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? 'ð NEED MORE YST' : 'ð CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">MEM@ERSAREA </div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access the members area.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST ðª</a>
        </div>
      )}
      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">Insufficient $YST</div>
          <div className="locked-sub">You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get More $YST ðª</a>
        </div>
      )}

      {hasAccess && (
        <div>
          {/* Your status */}
          <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 28 }}>ð¾</div>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 3 }}>YOUR MEMBER STATUS</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>TIER: <strong style={{ color: 'var(--gold)' }}>{tier}</strong></span>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)' }}>BALANCE: <strong style={{ color: 'var(--green)' }}>{ystBalance.toLocaleString()} $YST</strong></span>
              </div>
            </div>
          </div>

          {/* Tier perks */}
          <div className="grid3" style={{ marginBottom: 20 }}>
            {[
              { tier: 'ðª HOLDER', req: '250K+ YST', perks: 'All platform tools, AI features, Predictions', active: ystBalance >= 250_000 },
              { tier: 'ð DIAMOND', req: '1M+ YST', perks: '+ Priority signals, Revenue share, OTC priority', active: ystBalance >= 1_000_000 },
              { tier: 'ð WHALE', req: '10M+ YST', perks: '+ Whale Club, Private alpha, Launch allocations', active: ystBalance >= 10_000_000 },
            ].map(t => (
              <div key={t.tier} style={{ background: t.active ? 'rgba(34,197,94,0.06)' : 'var(--bg3)', border: `1px solid ${t.active ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`, borderRadius: 8, padding: '13px 16px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, marginBottom: 4 }}>{t.tier}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', marginBottom: 6 }}>{t.req}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{t.perks}</div>
                {t.active && <div style={{ marginTop: 8 }}><span className="badge b-green">â UNLOCKED</span></div>}
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
            TOP HOLDERS LEADERBOARD
          </div>
          {LEADERBOARD.map(m => (
            <div key={m.rank} className="lb-row" style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 12, color: m.rank <= 3 ? 'var(--gold)' : 'var(--dim)', minWidth: 28 }}>#{m.rank}</span>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: 'var(--muted)', flex: 1 }}>{m.addr}</span>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginRight: 10 }}>{m.bal}</span>
              <span className={`badge ${m.badge}`}>{m.tier}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 10, fontFamily: 'Space Mono,monospace' }}>
            Snapshot updated daily Â· Next update 09:00 UTC
          </div>
        </div>
      )}
    </div>
  );
}
