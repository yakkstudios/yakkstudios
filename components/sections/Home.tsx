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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
            $YAKK <span style={{ color: 'var(--pink)' }}>STUDIOS</span>
          </div>
          <span className="badge b-pink">BETA</span>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 520, lineHeight: 1.7 }}>
          Professional-grade DeFi tools for serious Solana traders. Screen tokens, analyze
          on-chain wallets, trade with AI, and discover yield — all built for the{' '}
          <strong style={{ color: 'var(--gold)' }}>$YST</strong> community.
        </p>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">$YST Price</div>
          <div className="stat-val" id="home-price">Loading…</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Market Cap</div>
          <div className="stat-val" id="home-mcap">Loading…</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">24h Volume</div>
          <div className="stat-val green" id="home-vol">Loading…</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Your Stake</div>
          <div className={`stat-val ${ystBalance >= 250_000 ? 'green' : ystBalance > 0 ? 'gold' : ''}`}>
            {walletConnected ? ystBalance.toLocaleString() + ' YST' : '—'}
          </div>
        </div>
      </div>

      {/* Tool cards */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          FEATURED TOOLS
        </div>
        <div className="home-cards">
          {HOME_CARDS.map((card) => (
            <div
              key={card.id}
              className="home-card"
              onClick={() => onNavigate(card.id)}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = card.accent; }}
              onMouseOut={(e)  => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
            >
              <div className="home-card-icon">{card.emoji}</div>
              <div className="home-card-title">{card.title}</div>
              <div className="home-card-desc">{card.desc}</div>
            </div>
          ))}

          {/* Roadmap card */}
          <div className="home-card" style={{ borderStyle: 'dashed', opacity: 0.55 }}>
            <div className="home-card-icon">🗺️</div>
            <div className="home-card-title">ROADMAP</div>
            <div className="home-card-desc">More tools shipping soon. Governance, cross-chain analytics & advanced AI ahead.</div>
          </div>
        </div>
      </div>

      {/* Staking CTA — shown when wallet not connected */}
      {!walletConnected && (
        <div style={{
          background: 'linear-gradient(135deg, var(--bg3) 0%, rgba(247,201,72,0.04) 100%)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginTop: 8,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, marginBottom: 5 }}>
              🔓 Unlock the full YAKK arsenal
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Connect your wallet and stake{' '}
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>250K+ $YST</span>{' '}
              on StakePoint to access every tool in the platform.
            </div>
          </div>
          <a
            className="btn btn-gold"
            href="https://stakepoint.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stake $YST →
          </a>
        </div>
      )}

      {/* Access confirmed — shown when staked */}
      {walletConnected && ystBalance >= 250_000 && (
        <div style={{
          background: 'rgba(34,197,94,0.05)',
          border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 12,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 8,
        }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--green)' }}>
              Full access unlocked
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              You have {ystBalance.toLocaleString()} $YST staked. All tools are available to you.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
