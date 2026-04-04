'use client';

const MESSAGES = [
  '$YST — The Anti-Corruption Rail for Solana',
  '10,000,000+ $YST = Whale Club Access',
  'Zero VC. Zero Presale. 100% Community.',
  'On-Chain Forensics. Real-Time Signals. No BS.',
  'Hold 250K+ $YST → Unlock All Tools',
  'NFT Drop — 3,333 Pieces · April 20, 2026',
  'Retail First. Always.',
  '$YST Staking Live on StakePoint',
  'CABAL INVESTIGATOR — Follow the Whales',
  'YAKK Screener — Real-Time Solana Intelligence',
  'No Rugs. No Cabals. Just On-Chain Truth.',
  'Whale Club: Elite Access for 10M+ Holders',
  'AI-Powered DeFi Tools for the Sovereign Trader',
  'Scotland Built. Globally Deployed. Solana Native.',
  'DYOR — But We Do It Too, On-Chain.',
  'Anti-Extraction. Anti-Cabal. Pro-Retail.',
  'StakePoint Integration — Earn While You Hold',
  '$YST: Utility First, Community Always',
];

export default function MarqueeBanner() {
  // Duplicate for seamless infinite scroll
  const items = [...MESSAGES, ...MESSAGES];

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        height: 30,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 0,
          animation: 'marquee-scroll 60s linear infinite',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {items.map((msg, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.1em',
              color: i % 3 === 0 ? 'var(--pink)' : i % 3 === 1 ? 'var(--gold)' : 'var(--muted)',
              paddingRight: 48,
              textTransform: 'uppercase',
            }}
          >
            ◆ {msg}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
