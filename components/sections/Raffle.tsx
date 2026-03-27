'use client';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Raffle({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar gold" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ðï¸ NFT RAFFLE</div>
        </div>
        <div className="sec-sub">Enter NFT raffles. Win exclusive YAKK ecosystem NFTs.</div>
      </div>

      <div className="section-placeholder">
        <div className="section-wip">
          <div className="section-wip-icon">ð§</div>
          <div className="section-wip-text">
            <strong>NFT RAFFLE</strong> â This section is being migrated to the new React architecture.
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
    </div>
  );
}
