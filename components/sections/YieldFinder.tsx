'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

interface YieldCard {
  name: string;
  subtitle: string;
  chain: string;
  type: string;
  apy: string;
  apyColor: string;
  borderColor: string;
  tvl: string;
  risk: string;
  url: string;
}

const YIELDS: YieldCard[] = [
  {
    name: 'Raydium',
    subtitle: 'YST/SOL LP',
    chain: 'solana',
    type: 'lp',
    apy: '847%',
    apyColor: 'var(--pink)',
    borderColor: 'var(--pink)',
    tvl: '$124K',
    risk: 'Medium',
    url: 'https://raydium.io',
  },
  {
    name: 'Marinade',
    subtitle: 'mSOL Staking',
    chain: 'solana',
    type: 'staking',
    apy: '7.2%',
    apyColor: 'var(--gold)',
    borderColor: 'var(--gold)',
    tvl: '$1.8B',
    risk: 'Low',
    url: 'https://marinade.finance',
  },
  {
    name: 'Kamino',
    subtitle: 'USDC Lending',
    chain: 'solana',
    type: 'lending',
    apy: '12.4%',
    apyColor: '#7fdbff',
    borderColor: '#7fdbff',
    tvl: '$340M',
    risk: 'Low',
    url: 'https://kamino.finance',
  },
  {
    name: 'Orca',
    subtitle: 'SOL/USDC LP',
    chain: 'solana',
    type: 'lp',
    apy: '34%',
    apyColor: 'var(--pink)',
    borderColor: 'var(--pink)',
    tvl: '$89M',
    risk: 'Medium',
    url: 'https://orca.so',
  },
  {
    name: 'PancakeSwap',
    subtitle: 'BNB/USDT LP',
    chain: 'bnb',
    type: 'lp',
    apy: '28%',
    apyColor: 'var(--gold)',
    borderColor: 'var(--gold)',
    tvl: '$210M',
    risk: 'Medium',
    url: 'https://pancakeswap.finance',
  },
  {
    name: 'Uniswap',
    subtitle: 'ETH/USDC LP',
    chain: 'ethereum',
    type: 'lp',
    apy: '18%',
    apyColor: '#7fdbff',
    borderColor: '#7fdbff',
    tvl: '$4.1B',
    risk: 'Low',
    url: 'https://app.uniswap.org',
  },
];

const selectStyle: React.CSSProperties = {
  background: 'var(--bg2)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 7,
  padding: '8px 14px',
  color: 'var(--text)',
  fontFamily: "'Space Mono',monospace",
  fontSize: 11,
  outline: 'none',
  cursor: 'pointer',
};

export default function YieldFinder({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [chain, setChain] = useState('all');
  const [type, setType] = useState('all');

  const filtered = YIELDS.filter(y => {
    const chainMatch = chain === 'all' || y.chain === chain;
    const typeMatch = type === 'all' || y.type === type;
    return chainMatch && typeMatch;
  });

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">MULTICHAIN</div>
      <div className="sec-title">Yield Finder</div>
      <div className="sec-bar"></div>

      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold 10,000,000 $YST to unlock this tool.
          </div>
        </div>
      )}

      {hasAccess && (
      <>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Best yields across DeFi protocols. Live APY data. No KYC, no custody.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={chain} onChange={e => setChain(e.target.value)} style={selectStyle}>
          <option value="all">All chains</option>
          <option value="solana">Solana</option>
          <option value="ethereum">Ethereum</option>
          <option value="bnb">BNB Chain</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={selectStyle}>
          <option value="all">All types</option>
          <option value="lp">LP / AMM</option>
          <option value="lending">Lending</option>
          <option value="staking">Staking</option>
        </select>
        <button
          className="btn btn-pink"
          style={{ padding: '8px 16px', fontSize: 10 }}
          onClick={() => { setChain('all'); setType('all'); }}
        >
          ↻ REFRESH
        </button>
      </div>

      {/* Yield cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
        {filtered.map(y => (
          <div key={y.name} className="card-sm" style={{ borderLeft: `3px solid ${y.borderColor}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{y.name}</div>
                <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>
                  {y.subtitle} • {y.chain === 'solana' ? 'Solana' : y.chain === 'ethereum' ? 'Ethereum' : 'BNB Chain'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: y.apyColor }}>{y.apy}</div>
                <div style={{ fontSize: 8, color: 'var(--dim)' }}>APY</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 10, color: 'var(--dim)' }}>
              <span>TVL: {y.tvl}</span>
              <span>Risk: {y.risk}</span>
            </div>
            <a
              href={y.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pink"
              style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: 10, textDecoration: 'none', fontSize: 10, padding: 7, boxSizing: 'border-box' }}
            >
              DEPOSIT →
            </a>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 32, color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: 11 }}>
            No yields match the selected filters.
          </div>
        )}
      </div>

      <p style={{ fontSize: 9, color: 'var(--dim)', marginTop: 16, textAlign: 'center' }}>
        APYs are indicative only. Always DYOR. Not financial advice.
      </p>
      </>
      )}
    </div>
  );
}
