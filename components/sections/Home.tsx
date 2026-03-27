'use client';
import { HOME_CARDS } from '@/lib/constants';
import { useState, useEffect } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function Home({ walletConnected, ystBalance, onNavigate }: Props) {
  const [ystPrice, setYstPrice] = useState<string | null>(null);
  const [ystMcap, setYstMcap] = useState<number | null>(null);
  const [ystVol, setYstVol] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/price')
      .then(r => r.json())
      .then(d => {
        setYstPrice(d.price ?? null);
        setYstMcap(d.marketCap ?? null);
        setYstVol(d.volume24h ?? null);
      })
      .catch(() => {});
  }, []);

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
        <p style={{ color: 'var(--muted)', fontSize: 13, maxWidth: 540, lineHeight: 1.7 }}>
          Crypto was built for DEXs â not banks with ticker symbols. YAKK Studios is
          the professional on-chain trading platform built by the community, for the community.
          Screen tokens, investigate wallets, trade with AI, and earn yield â no KYC,
          no custody, no middlemen. Just tools for traders who know better, powered by{' '}
          <strong style={{ color: 'var(--gold)' }}>$YST</strong>.
        </p>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-label">$YST Price</div>
          <div className="stat-val" id="home-price">{ystPrice ? '$' + parseFloat(ystPrice).toPrecision(4) : 'Loading…'}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Market Cap</div>
          <div className="stat-val" id="home-mcap">{ystMcap != null ? '$' + ystMcap.toLocaleString(undefined, {maximumFractionDigits:0}) : 'Loading…'}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">24h Volume</div>
          <div className="stat-val green" id="home-vol">{ystVol != null ? '$' + ystVol.toLocaleString(undefined, {maximumFractionDigits:0}) : 'Loading…'}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Your $YST</div>
          <div className={`stat-val ${ystBalance >= 250_000 ? 'green' : ystBalance > 0 ? 'gold' : ''}`}>
            {walletConnected ? ystBalance.toLocaleString() : 'â'}
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
            <div className="home-card-icon">ðºï¸</div>
            <div className="home-card-title">ROADMAP</div>
            <div className="home-card-desc">More tools shipping. Governance, cross-chain analytics & advanced AI ahead.</div>
          </div>
        </div>
      </div>

      {/* CTA banner â shown when wallet not connected */}
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
              ð Unlock the full YAKK arsenal
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
              Hold{' '}
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>250K+ $YST</span>{' '}
              to access every tool and qualify for rev-share rewards.
              Staking via{' '}
              <span style={{ color: 'var(--text)', fontWeight: 600 }}>StakePoint</span>{' '}
              coming soon for additional earnings.
            </div>
          </div>
          <a
            className="btn btn-gold"
            href="https://stakepoint.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            StakePoint â
          </a>
        </div>
      )}

      {/* Partial access â connected but below threshold */}
      {walletConnected && ystBalance > 0 && ystBalance < 250_000 && (
        <div style={{
          background: 'rgba(247,201,72,0.04)',
          border: '1px solid rgba(247,201,72,0.15)',
          borderRadius: 12,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 8,
        }}>
          <span style={{ fontSize: 16 }}>â¡</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>
              Almost there
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              You hold {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more to unlock all tools and rev-share.
            </div>
          </div>
        </div>
      )}

      {/* Full access â holding 250K+ */}
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
          <span style={{ fontSize: 16 }}>â</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'var(--green)' }}>
              Full access unlocked
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              You hold {ystBalance.toLocaleString()} $YST â all tools active, rev-share rewards unlocked.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
