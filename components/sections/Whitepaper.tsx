'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const TOC = [
  { n: '01', title: 'Executive Summary' },
  { n: '02', title: 'The Problem' },
  { n: '03', title: 'The Solution — YAKK Studios' },
  { n: '04', title: '$YST Tokenomics' },
  { n: '05', title: 'Access Tier System' },
  { n: '06', title: 'Revenue Share Model' },
  { n: '07', title: 'Platform Roadmap' },
  { n: '08', title: 'Team &amp; Community' },
];

export default function Whitepaper({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--gold),var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">📄 WHITEPAPER</div>
          <span className="badge b-gold">v2.0</span>
        </div>
        <div className="sec-sub">The YAKK Studios vision, tokenomics, platform mechanics and long-term roadmap.</div>
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: '0 0 220px' }}>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px', position: 'sticky', top: 20 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>CONTENTS</div>
            {TOC.map(item => (
              <div key={item.n} style={{ display: 'flex', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--pink)' }}>{item.n}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }} dangerouslySetInnerHTML={{ __html: item.title }} />
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <a href="#" className="btn btn-gold" style={{ fontSize: 10, width: '100%', justifyContent: 'center' }}>Download PDF</a>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {[
            {
              n: '01', title: 'Executive Summary',
              body: 'YAKK Studios is a Solana-native analytics and community platform built for serious degens. We provide institutional-grade tools — wallet intelligence, DeFi yield optimization, AI trading signals, NFT analytics and on-chain data — gated to $YST token holders. Revenue generated from the platform is shared directly with stakers via the StakePoint protocol.',
            },
            {
              n: '02', title: 'The Problem',
              body: 'The Solana ecosystem lacks cohesive tooling for retail participants. Data is fragmented across dozens of platforms. Alpha leaks through Telegram groups with no verification. Rug pulls go undetected until wallets are drained. There is no sustainable model that rewards community members for growing the ecosystem.',
            },
            {
              n: '03', title: 'The Solution — YAKK Studios',
              body: 'YAKK Studios aggregates the most powerful on-chain tools into a single, gated platform. Holders of $YST unlock 30+ tools spanning analytics, AI signals, DeFi yield finding, portfolio tracking, NFT trading and community coordination. The more $YST you hold, the deeper your access and the larger your share of platform revenue.',
            },
            {
              n: '04', title: '$YST Tokenomics',
              body: 'Total Supply: 1,000,000,000 $YST. Distribution: 40% community (raiding, raffles, rewards), 30% liquidity (Meteora, Jupiter), 20% team (12-month vesting, 3-month cliff), 10% ecosystem/partnerships. Mint authority revoked. Freeze authority revoked. Fully on-chain and immutable. Contract: jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
            },
            {
              n: '05', title: 'Access Tier System',
              body: 'YAKK Studios uses a three-tier access model based on $YST holdings. Any amount: basic public access (news, whitepaper, community links). 250,000+ $YST: full platform access — all 30+ tools, revenue share dashboard, OTC desk, launchpad, raids. 10,000,000+ $YST: Whale Club — private alpha feeds, whale-only signals, governance priority, dedicated support.',
            },
            {
              n: '06', title: 'Revenue Share Model',
              body: 'Platform revenue (tool usage fees, launchpad fees, OTC desk fees, partner referrals) is pooled and distributed weekly to $YST stakers on StakePoint. Distribution is proportional to staked balance. Estimated APY: 18.4% at current revenue levels. As platform usage grows, APY scales accordingly. This creates direct alignment between platform growth and holder rewards.',
            },
            {
              n: '07', title: 'Platform Roadmap',
              body: 'Q1 2025: Full platform launch (Next.js rebuild), snapshot gate system, all 27 tools live. Q2 2025: Mobile app (iOS + Android), Telegram bot v2, AI rug pull detector. Q3 2025: Cross-chain support (ETH, Base), on-chain copy trading, governance voting. Q4 2025: YAKK Studios SDK for third-party integrations, launchpad v2, DAO transition.',
            },
            {
              n: '08', title: 'Team & Community',
              body: 'YAKK Studios is built by a pseudonymous team of Solana-native developers, traders and community builders. The team holds $YST with the same vesting schedule as disclosed in tokenomics — no preferential treatment. The project is community-driven: top-voted features ship first, governance decisions are put to the holder community, and platform revenue flows back to stakers.',
            },
          ].map(section => (
            <div key={section.n} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--pink)', fontWeight: 700 }}>{section.n}</span>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15 }}>{section.title}</div>
              </div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px' }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, margin: 0 }}>{section.body}</p>
              </div>
            </div>
          ))}

          <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '20px 24px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Ready to Join?</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Get $YST on Jupiter or Meteora and unlock the full YAKK Studios platform.</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Buy $YST on Jupiter →</a>
              <a href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Buy on Meteora →</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
