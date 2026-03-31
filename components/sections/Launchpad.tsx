'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const ACTIVE_LAUNCHES = [
  {
    name: 'YAKK Studios',
    ticker: '$YST — Solana',
    status: 'LIVE',
    statusBg: 'rgba(100,220,100,0.15)',
    statusColor: '#64dc64',
    pct: 73,
    pctColor: 'var(--pink)',
    leftLabel: '73% raised',
    rightLabel: 'Liq locked 365d',
  },
  {
    name: 'YakkBlinders',
    ticker: '$YBLIND — Solana · Test Launch',
    status: 'PENDING',
    statusBg: 'rgba(247,201,72,0.15)',
    statusColor: 'var(--gold)',
    pct: 12,
    pctColor: 'var(--gold)',
    leftLabel: '12% raised — First test token',
    rightLabel: 'Liq lock: 30d',
  },
];

export default function Launchpad({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [twitter, setTwitter] = useState('');
  const [website, setWebsite] = useState('');
  const [lock, setLock] = useState('');
  const [desc, setDesc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg4)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 6,
    padding: '8px 12px',
    color: 'var(--text)',
    fontFamily: "'Space Mono',monospace",
    fontSize: 11,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const handleSubmit = () => {
    if (!name || !ticker) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setName(''); setTicker(''); setTwitter(''); setWebsite(''); setLock(''); setDesc('');
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">YAKK VENTURES</div>
      <div className="sec-title">YAKK Ventures</div>
      <div className="sec-bar"></div>

      {/* Token gate row */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
        <span className={`badge ${walletConnected ? (hasAccess ? 'b-green' : 'b-red') : 'b-dim'}`}>
          {walletConnected ? (hasAccess ? '✓ ACCESS GRANTED' : '✗ NEED MORE YST') : 'NOT CHECKED'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Launch your token with locked liquidity, KYC optional, vesting enforcement. Every project audited by YAKKAI before listing.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Submit project */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>SUBMIT PROJECT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Token ticker (e.g. $YAKK)"
              value={ticker}
              onChange={e => setTicker(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Twitter / X handle"
              value={twitter}
              onChange={e => setTwitter(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Website URL"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              style={inputStyle}
            />
            <select
              value={lock}
              onChange={e => setLock(e.target.value)}
              style={inputStyle}
            >
              <option value="">Liquidity lock duration</option>
              <option value="30">30 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="730">2 years</option>
              <option value="perm">Permanent burn</option>
            </select>
            <textarea
              placeholder="Short description (max 300 chars)"
              maxLength={300}
              rows={3}
              value={desc}
              onChange={e => setDesc(e.target.value)}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>10,000,000 $YST</strong> to unlock this tool.
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      )}

      {hasAccess && (
      {submitted ? (
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--green)', padding: '8px 0' }}>
                ✓ Submitted for review!
              </div>
            ) : (
              <button
                className="btn btn-pink"
                style={{ width: '100%' }}
                onClick={handleSubmit}
                disabled={!walletConnected}
              >
                SUBMIT FOR REVIEW
              </button>
            )}
            <p style={{ fontSize: 9, color: 'var(--dim)', textAlign: 'center', margin: 0 }}>
              Reviewed by YAKKAI within 48h. Requires $500 USDC listing fee + locked liq proof.
            </p>
          </div>
        </div>

        {/* Active launches */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>ACTIVE LAUNCHES</div>
          <div>
            {ACTIVE_LAUNCHES.map((launch) => (
              <div key={launch.name} style={{ padding: 14, background: 'var(--bg4)', borderRadius: 8, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{launch.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>{launch.ticker}</div>
                  </div>
                  <span className="badge" style={{ background: launch.statusBg, color: launch.statusColor }}>{launch.status}</span>
                </div>
                <div style={{ marginTop: 10, height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${launch.pct}%`, background: launch.pctColor, borderRadius: 3 }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: 'var(--dim)' }}>{launch.leftLabel}</span>
                  <span style={{ fontSize: 9, color: 'var(--dim)' }}>{launch.rightLabel}</span>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'var(--dim)', textAlign: 'center', padding: 14 }}>
              More launches coming. Submit yours above.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

