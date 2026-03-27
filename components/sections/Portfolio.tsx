'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Portfolio({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar green" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð PORTFOLIO TRACKER</div>
          <span className="badge b-green">LIVE</span>
        </div>
        <div className="sec-sub">Track your Solana portfolio P&amp;L, token holdings &amp; performance in real time.</div>
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
          <div className="locked-title">PORTFOLIO TRACKER</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to track your portfolio.</div>
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
          <div className="grid4" style={{ marginBottom: 20 }}>
            {[
              { l: 'PORTFOLIO VALUE', v: '$8,214', c: 'var(--text)', s: '+$412 today' },
              { l: '$YST HOLDINGS', v: ystBalance.toLocaleString(), c: 'var(--gold)', s: '$YST tokens' },
              { l: 'BEST PERFORMER', v: '+142%', c: 'var(--green)', s: '$CHILLGUY' },
              { l: 'REALIZED P&L', v: '+$2,140', c: 'var(--green)', s: 'All time' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="slbl">{s.l}</div>
                <div className="sval" style={{ color: s.c, fontSize: 16 }}>{s.v}</div>
                <div className="ssub">{s.s}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: 'var(--muted)' }}>
              CONNECTED WALLET HOLDINGS
            </div>
            <table className="tbl">
              <thead>
                <tr><th>TOKEN</th><th>BALANCE</th><th>PRICE</th><th>VALUE</th><th>24H</th></tr>
              </thead>
              <tbody>
                {[
                  ['$SOL', 'Solana', '12.4', '$168.00', '$2,083', '+1.2%', true],
                  ['$YST', 'YAKK Studios', ystBalance.toLocaleString(), '$0.0000018', '$' + (ystBalance * 0.0000018).toFixed(2), '+1.44%', true],
                  ['$BONK', 'BONK', '4.2M', '$0.0000218', '$91.56', '+3.21%', true],
                  ['$WIF', 'dogwifhat', '42', '$1.42', '$59.64', '-2.1%', false],
                ].map(([sym, name, bal, price, val, chg, pos]) => (
                  <tr key={sym as string}>
                    <td><span className="td-tok">{sym}</span> <span style={{ color: 'var(--muted)', fontSize: 10 }}>{name}</span></td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{bal}</td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{price}</td>
                    <td style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>{val}</td>
                    <td style={{ color: pos ? 'var(--green)' : 'var(--red)', fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{chg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Birdeye â</a>
            <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Solscan â</a>
          </div>
        </div>
      )}
    </div>
  );
}
