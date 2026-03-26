'use client';

import { HOME_CARDS } from '@/lib/constants';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Home({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
            $YAKK <span style={{ color: 'var(--pink)' }}>STUDIOS</span>
          </div>
          <span className="badge b-pink">BETA</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 480, lineHeight: 1.6 }}>
          The premier DeFi toolkit for <strong style={{ color: 'var(--gold)' }}>$YST</strong> holders on Solana.
          Stake 250K+ $YST on StakePoint to unlock all tools.
        </p>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">$YST Price</div>
          <div className="stat-val" id="home-price">Loadingâ¦</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Market Cap</div>
          <div className="stat-val" id="home-mcap">Loadingâ¦</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">24h Volume</div>
          <div className="stat-val green" id="home-vol">Loadingâ¦</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Your Stake</div>
          <div className={`stat-val ${ystBalance >= 250_000 ? 'green' : ystBalance > 0 ? 'gold' : ''}`}>
            {walletConnected
              ? ystBalance.toLocaleString() + ' YST'
              : 'â'}
          </div>
        </div>
      </div>

      {/* Tool cards */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
          TOOLS
        </div>
        <div className="home-cards">
          {HOME_CARDS.map((card) => (
            <div
              key={card.id}
              className="home-card"
              onClick={() => onNavigate(card.id)}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = card.accent; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <div className="home-card-icon">{card.emoji}</div>
              <div className="home-card-title">{card.title}</div>
              <div className="home-card-desc">{card.desc}</div>
            </div>
          ))}

          {/* Roadmap card */}
          <div className="home-card" style={{ borderStyle: 'dashed', opacity: 0.6 }}>
            <div className="home-card-icon">ðºï¸</div>
            <div className="home-card-title">ROADMAP</div>
            <div className="home-card-desc">More tools coming. Governance, analytics & cross-chain tools ahead.</div>
          </div>
        </div>
      </div>

      {/* Staking CTA */}
      {!walletConnected && (
        <div style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 8,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
              ð Connect wallet to unlock all tools
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Stake 250,000+ $YST on StakePoint to access all YAKK Studios features.
            </div>
          </div>
          <a
            className="btn btn-gold"
            href="https://stakepoint.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stake $YST â
          </a>
        </div>
      )}
    </div>
  );
}
