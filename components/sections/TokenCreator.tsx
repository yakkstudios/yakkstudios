'use client';

// Token Creator has been merged into YAKK Ventures.
// This stub redirects users seamlessly.
interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function TokenCreator({ onNavigate }: Props) {
  return (
    <div className="sec-pad" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🦅</div>
      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
        Token Creator has moved
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--dim)', marginBottom: '1.5rem' }}>
        Token creation is now part of <strong style={{ color: 'var(--gold)' }}>YAKK Ventures — Token IPO</strong>.
        Same form, same requirements, plus the full IPO model and active launches.
      </div>
      <button className="btn btn-pink" onClick={() => onNavigate('launchpad')}>
        GO TO YAKK VENTURES →
      </button>
    </div>
  );
}
