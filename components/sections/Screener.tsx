'use client';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🔍 YAKK SCREENER</div>
        </div>
        <div className="sec-sub">Real-time Solana token screening. Filter by volume, liquidity &amp; momentum.</div>
        {/* YST gate badge */}
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> Held</span>
          <span className="badge b-dim">NOT CHECKED</span>
        </div>
      </div>

      {/* Gate check — wallet not connected */}
      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKK SCREENER</div>
          <div className="locked-sub">
            Connect your wallet and hold{' '}
            <strong>250,000+ $YST</strong> to access this tool.
          </div>
          <a
            className="btn btn-gold"
            href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get $YST 🪙
          </a>
        </div>
      )}

      {/* Gate check — insufficient balance */}
      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Insufficient Balance</div>
          <div className="locked-sub">
            You need <strong>250,000+ $YST</strong> held to access YAKK SCREENER.
            Currently holding: {ystBalance.toLocaleString()} $YST.
          </div>
          <a
            className="btn btn-gold"
            href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get More $YST 🪙
          </a>
        </div>
      )}

      {/* Unlocked */}
      {walletConnected && ystBalance >= 250_000 && (
        <div className="section-placeholder">
          <div className="section-wip">
            <div className="section-wip-icon">🔧</div>
            <div className="section-wip-text">
              <strong>YAKK SCREENER</strong> — This section is being migrated to the new React architecture.
              Full functionality is available in the{' '}
              <button
                style={{ color: 'var(--pink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                onClick={() => window.open('https://yakkstudios.com', '_blank')}
              >
                legacy version
              </button>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
