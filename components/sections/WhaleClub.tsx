'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const ALPHA = [
  { type: 'WALLET WATCH', time: '2h ago', title: 'Tier 1 whale moved 8M $YST to fresh wallet', detail: 'Accumulation pattern. 3 transactions over 6 hours. Consistent buying. Not selling.', badge: 'b-green' },
  { type: 'LAUNCH ALERT', time: '5h ago', title: 'Private launchpad slot opening â details below', detail: 'Whitelist opens for ð members only. Project has $2M backing. NDA lifted Sunday.', badge: 'b-yakk' },
  { type: 'SIGNAL', time: '1d ago', title: '$BONK large OTC block being absorbed quietly', detail: 'Fund wallet accumulating sub-floor. Price suppressed artificially. Spring incoming.', badge: 'b-gold' },
];

export default function WhaleClub({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasWhaleAccess = walletConnected && ystBalance >= 10_000_000;
  const hasHolderAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--gold))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð WHALE CLUB</div>
          <span className="badge b-gold">WHALE ONLY</span>
        </div>
        <div className="sec-sub">Exclusive alpha, private signals &amp; launch allocations for top $YST holders only.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>10,000,000+ $YST</span> ð Required</span>
          {hasWhaleAccess
            ? <span className="badge b-green">â WHALE CONFIRMED</span>
            : <span className="badge b-gold">{walletConnected ? `${ystBalance.toLocaleString()} / 10M` : 'ð CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">WHALE CLUB</div>
          <div className="locked-sub">Connect your wallet and hold <strong>10,000,000+ $YST</strong> to join the Whale Club.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST ðª</a>
        </div>
      )}
      {walletConnected && !hasWhaleAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">Not Enough $YST</div>
          <div className="locked-sub">
            You hold <strong>{ystBalance.toLocaleString()} $YST</strong>.<br />
            You need <strong>10,000,000 $YST</strong> for Whale Club access.<br />
            Gap: <strong>{Math.max(0, 10_000_000 - ystBalance).toLocaleString()} $YST</strong>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="prog-bar" style={{ height: 6, marginBottom: 10 }}>
              <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 10_000_000) * 100) + '%' }} />
            </div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--muted)', marginBottom: 14 }}>
              {((ystBalance / 10_000_000) * 100).toFixed(1)}% to Whale Club
            </div>
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Accumulate More $YST ðª</a>
        </div>
      )}

      {hasWhaleAccess && (
        <div>
          <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 32 }}>ð</div>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--gold)', marginBottom: 3 }}>WHALE CONFIRMED</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>You hold {ystBalance.toLocaleString()} $YST â exclusive access granted.</div>
            </div>
          </div>

          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
            WHALE ALPHA FEED
          </div>
          {ALPHA.map((a, i) => (
            <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className={`badge ${a.badge}`}>{a.type}</span>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginLeft: 'auto' }}>{a.time}</span>
              </div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{a.detail}</div>
            </div>
          ))}

          <div style={{ marginTop: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, marginBottom: 10 }}>ð WHALE PERKS</div>
            {['Private alpha channel access', 'Priority launchpad allocations', 'OTC desk priority matching', 'Monthly whale-only calls', 'Revenue share tier 3 (highest)', 'Governance voting weight 10x'].map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                <span style={{ color: 'var(--green)' }}>â</span>
                <span style={{ color: 'var(--text)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
