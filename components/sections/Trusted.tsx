'use client';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Trusted({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar green" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð¡ï¸ TRUSTED LIST</div>
        </div>
        <div className="sec-sub">Community-vetted trusted wallets and projects on Solana.</div>
      </div>

      <div className="section-placeholder">
        <div className="section-wip">
          <div className="section-wip-icon">ð§</div>
          <div className="section-wip-text">
            <strong>TRUSTED LIST</strong> â This section is being migrated to the new React architecture.
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
    </div>
  );
}
