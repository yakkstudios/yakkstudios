'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const UPDATES = [
  {
    version: 'v2.4.0',
    date: 'March 2025',
    type: 'MAJOR',
    badge: 'b-pink',
    title: 'Full Platform Rebuild — Next.js Migration',
    changes: [
      'Migrated entire platform to Next.js 14 App Router for performance and scalability',
      'Snapshot-based $YST balance verification system deployed',
      'All 27 sections rebuilt with live content and gated access system',
      'Wallet adapter updated — Phantom, Backpack, Solflare fully supported',
      'Mobile responsive design overhaul — iPad and mobile optimized',
    ],
  },
  {
    version: 'v2.3.1',
    date: 'February 2025',
    type: 'FIX',
    badge: 'b-gold',
    title: 'Balance Gate & Access Control Fixes',
    changes: [
      'Fixed YST balance showing 0 on iPad due to RPC race condition',
      'Gate badges now dynamically reflect real-time access tier',
      'Snapshot priority logic: known holders bypass RPC entirely for instant access',
      'Improved holder tier display (Holder / Diamond / Whale)',
    ],
  },
  {
    version: 'v2.3.0',
    date: 'January 2025',
    type: 'FEATURE',
    badge: 'b-green',
    title: 'New Tools: Token Creator, OTC Desk, Raids',
    changes: [
      'Token Creator: launch SPL tokens with metadata, socials and authority revoke — no code needed',
      'OTC Desk: peer-to-peer large block trades between YAKK holders',
      'Raids: coordinated Twitter/X raids with $YST rewards for participants',
      'Launchpad: early-access IDO allocations for $YST holders',
      'Art Lab: YAKK-branded PFP, banner and meme generator tools',
    ],
  },
  {
    version: 'v2.2.0',
    date: 'December 2024',
    type: 'FEATURE',
    badge: 'b-green',
    title: 'AI Suite: YAKK Trader, Coach & Rug Checker',
    changes: [
      'YAKK Trader: live AI buy/sell/hold signals with on-chain data integration',
      'Coach: AI trading coach with personalized DeFi strategy guidance',
      'Ledger: expanded rug pull database with 500+ flagged tokens',
      'Cabal Investigator: cluster analysis for wallet coordination detection',
    ],
  },
  {
    version: 'v2.1.0',
    date: 'November 2024',
    type: 'FEATURE',
    badge: 'b-blue',
    title: 'StakePoint Integration & Revenue Share Launch',
    changes: [
      'StakePoint official partnership — $YST staking with 18.4% APY',
      'Revenue share dashboard: track your share of platform fees',
      'Whale Club: 10M+ $YST exclusive section with alpha and private signals',
      'NFT Raffle system: win YAKK Genesis NFTs with $YST tickets',
    ],
  },
];

export default function Update({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--green),var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">📋 UPDATES</div>
          <span className="badge b-green">CHANGELOG</span>
        </div>
        <div className="sec-sub">Platform changelog, new features and fixes. Stay up to date with everything YAKK Studios.</div>
      </div>

      <div className="grid4" style={{ marginBottom: 24 }}>
        {[
          { l: 'CURRENT VERSION', v: 'v2.4.0', c: 'var(--pink)' },
          { l: 'TOTAL UPDATES', v: '5', c: 'var(--gold)' },
          { l: 'SECTIONS LIVE', v: '27', c: 'var(--green)' },
          { l: 'LAST UPDATED', v: 'Mar 2025', c: 'var(--text)' },
        ].map(s => (
          <div key={s.l} className="stat-card">
            <div className="slbl">{s.l}</div>
            <div className="sval" style={{ color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {UPDATES.map(update => (
        <div key={update.version} style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: 'var(--pink)', fontWeight: 700 }}>{update.version}</div>
            <span className={`badge ${update.badge}`}>{update.type}</span>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{update.date}</div>
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>{update.title}</div>
            {update.changes.map((change, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                <span style={{ color: 'var(--green)', flexShrink: 0, marginTop: 1 }}>→</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{change}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'rgba(236,72,153,0.04)', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 10, padding: '16px 20px' }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--pink)', marginBottom: 6 }}>What's Coming Next</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
          Mobile app (iOS + Android), AI-powered rug pull detector, Telegram notification integration, cross-chain support for ETH and Base, and on-chain copy trading — all driven by community votes on the Feature Requests board.
        </div>
        <button className="btn btn-pink" style={{ fontSize: 11, marginTop: 12 }} onClick={() => onNavigate('features')}>Vote on Features →</button>
      </div>
    </div>
  );
}
