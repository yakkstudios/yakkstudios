'use client';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Clowns({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð¤¡ CERTIFIED CLOWNS</div>
        </div>
        <div className="sec-sub">Community list of known bad actors, rug pullers & shill merchants.</div>
      </div>

      <div className="section-placeholder">
        <div className="section-wip">
          <div className="section-wip-icon">ð§</div>
          <div className="section-wip-text">
            <strong>CERTIFIED CLOWNS</strong> â This section is being migrated to the new React architecture.
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
