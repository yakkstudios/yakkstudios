'use client';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function ArtLab({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð¨ ART LAB</div>
        </div>
        <div className="sec-sub">AI-powered NFT art generation for the YAKK ecosystem.</div>
        {/* YST gate badge */}
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> Staked on StakePoint</span>
          <span className="badge b-dim">NOT CHECKED</span>
        </div>
      </div>

      {/* Gate check */}
      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">ART LAB</div>
          <div className="locked-sub">
            Connect your wallet and stake{' '}
            <strong>250,000+ $YST</strong> on StakePoint to access this tool.
          </div>
          <a className="btn btn-gold" href="https://stakepoint.app" target="_blank" rel="noopener noreferrer">
            Stake $YST â
          </a>
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">ð</div>
          <div className="locked-title">Insufficient Stake</div>
          <div className="locked-sub">
            You need <strong>250,000+ $YST</strong> staked to access ART LAB.
            Currently staked: {ystBalance.toLocaleString()} $YST.
          </div>
          <a className="btn btn-gold" href="https://stakepoint.app" target="_blank" rel="noopener noreferrer">
            Stake More $YST â
          </a>
        </div>
      )}

      {walletConnected && ystBalance >= 250_000 && (
        <div className="section-placeholder">
          <div className="section-wip">
            <div className="section-wip-icon">ð§</div>
            <div className="section-wip-text">
              <strong>ART LAB</strong> â This section is being migrated to the new React architecture.
              Full functionality is available in the{' '}
              <button
                style={{ color: 'var(--pink)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
                onClick={() => window.open('https://yakkstudios.xyz', '_blank')}
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
