'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

// ── Active launches ───────────────────────────────────────────────────────────
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

// ── Requirements ─────────────────────────────────────────────────────────────
const REQUIREMENTS = [
  { icon: '✓', color: '#64dc64', text: '1 SOL application fee paid on-chain to YAKK treasury' },
  { icon: '✓', color: '#64dc64', text: 'Liquidity locked for minimum 30 days on StakePoint or verified locker' },
  { icon: '✓', color: '#64dc64', text: 'Team wallet ≤ 20% of total supply with mandatory vesting' },
  { icon: '✓', color: '#64dc64', text: 'Working website + active Twitter/X presence' },
  { icon: '✓', color: '#64dc64', text: 'Minimum 100-word project description — no vapourware' },
  { icon: '✓', color: '#64dc64', text: 'Applicant wallet must not be flagged in our Clowns database' },
  { icon: '★', color: 'var(--gold)', text: 'Optional: KYC (increases trust score, shown on listing)' },
  { icon: '★', color: 'var(--gold)', text: 'Optional: Smart contract audit (YAKKAI automated + partner firms)' },
];

const fieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--bg4)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  padding: '8px 10px',
  color: 'var(--text)',
  fontFamily: 'Space Mono,monospace',
  fontSize: 11,
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontSize: 9,
  color: 'var(--dim)',
  marginBottom: 4,
};

export default function Launchpad({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  const [form, setForm] = useState({
    name: '', ticker: '', type: '', supply: '', initprice: '',
    lock: '', teamwallet: '', vesting: '12m',
    website: '', twitter: '', tg: '',
    desc: '', funds: '', track: '',
  });
  const [descCount, setDescCount] = useState(0);
  const [status, setStatus] = useState('');

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const handleDesc = (v: string) => { update('desc', v); setDescCount(v.length); };

  const submit = () => {
    if (!walletConnected) { setStatus('Connect wallet first.'); return; }
    if (!hasAccess) { setStatus('Need 10,000,000+ $YST to apply.'); return; }
    setStatus('✓ Application submitted! We will review within 48h.');
  };

  // ── Gate ──────────────────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="sec-pad">
        <div className="sec-eyebrow">ANTI-PUMP ANTI-RUG</div>
        <div className="sec-title">YAKK Ventures — Token IPO</div>
        <div className="sec-bar" />
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Hold <strong>10,000,000 $YST</strong> to access YAKK Ventures and submit a token application.
          </div>
          {walletConnected && (
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 14 }}>
              You hold: {ystBalance.toLocaleString()} $YST
            </div>
          )}
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">ANTI-PUMP ANTI-RUG</div>
      <div className="sec-title">YAKK Ventures — Token IPO</div>
      <div className="sec-bar" />

      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 8 }}>
        Launch a token the right way. Real projects. Locked liquidity. Verified teams. YAKKAI due diligence. We're building what pump.fun should have been.
      </p>

      {/* Tokenised IPO banner */}
      <div style={{ background: 'linear-gradient(135deg,rgba(224,96,126,0.15),rgba(255,200,0,0.08))', border: '1px solid rgba(224,96,126,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 22, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28 }}>📈</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Tokenised Equity &amp; IPOs — We&apos;re Ready Now</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.6 }}>
            Circle, Kraken, eToro — all announcing tokenised IPO plans. YAKK has the infrastructure to list them <em>today</em>.
            If you&apos;re a company exploring tokenised shares,{' '}
            <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>reach out on Telegram</a>.
          </div>
        </div>
        <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" className="btn btn-pink" style={{ textDecoration: 'none', fontSize: 10, padding: '9px 18px', whiteSpace: 'nowrap' }}>INQUIRE →</a>
      </div>

      {/* ── THE IPO MODEL ─────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,rgba(247,201,72,0.08),rgba(224,96,126,0.04))', border: '1px solid rgba(247,201,72,0.25)', borderRadius: 12, padding: '18px 20px', marginBottom: 22 }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: 12 }}>THE YAKK TOKEN IPO MODEL</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
          {[
            {
              icon: '🔒',
              color: 'var(--pink)',
              pct: '80%',
              label: 'YAKK Vesting Escrow',
              desc: 'Held by YAKK on-chain. Released on milestone schedule only — no rug possible. Dev cannot dump.',
            },
            {
              icon: '💧',
              color: '#7fdbff',
              pct: '20%',
              label: 'Liquidity Pool',
              desc: 'Goes directly to the LP. Dev funds it themselves — this is what buyers trade against. Locked minimum 30 days.',
            },
            {
              icon: '📋',
              color: 'var(--gold)',
              pct: 'ON-REQUEST',
              label: 'Dev Token Release',
              desc: 'Dev receives tokens only via formal request with documented usage submitted on-chain. Full transparency.',
            },
            {
              icon: '🤖',
              color: '#64dc64',
              pct: 'YAKKAI',
              label: 'Automated Due Diligence',
              desc: 'Every application reviewed by YAKKAI. On-chain history checked. Clown-database wallets blocked automatically.',
            },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 14px', borderLeft: `3px solid ${item.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontFamily: 'Space Mono,monospace', fontWeight: 700, fontSize: 13, color: item.color }}>{item.pct}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid: form + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Left: application form */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>TOKEN APPLICATION FORM</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={labelStyle}>PROJECT NAME *</div>
                <input type="text" placeholder="e.g. MyProject" value={form.name} onChange={e => update('name', e.target.value)} style={fieldStyle} />
              </div>
              <div>
                <div style={labelStyle}>TICKER *</div>
                <input type="text" placeholder="e.g. $MPROJ" value={form.ticker} onChange={e => update('ticker', e.target.value)} style={fieldStyle} />
              </div>
            </div>

            <div>
              <div style={labelStyle}>TOKEN TYPE *</div>
              <select value={form.type} onChange={e => update('type', e.target.value)} style={{ ...fieldStyle, padding: '9px 12px' }}>
                <option value="">Select type</option>
                <option value="utility">Utility Token</option>
                <option value="governance">Governance Token</option>
                <option value="equity">Tokenised Equity / IPO</option>
                <option value="revenue">Revenue Share Token</option>
                <option value="gaming">Gaming / NFT Ecosystem</option>
                <option value="defi">DeFi Protocol Token</option>
                <option value="rwa">Real World Asset (RWA)</option>
                <option value="meme">Meme (with utility roadmap)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={labelStyle}>TOTAL SUPPLY *</div>
                <input type="number" placeholder="e.g. 1000000000" value={form.supply} onChange={e => update('supply', e.target.value)} style={fieldStyle} />
              </div>
              <div>
                <div style={labelStyle}>INITIAL PRICE (USD)</div>
                <input type="number" placeholder="e.g. 0.001" step="0.000001" value={form.initprice} onChange={e => update('initprice', e.target.value)} style={fieldStyle} />
              </div>
            </div>

            <div>
              <div style={labelStyle}>LIQUIDITY LOCK *</div>
              <select value={form.lock} onChange={e => update('lock', e.target.value)} style={{ ...fieldStyle, padding: '9px 12px' }}>
                <option value="">Select lock duration</option>
                <option value="30">30 days (minimum)</option>
                <option value="90">90 days</option>
                <option value="180">6 months</option>
                <option value="365">1 year ⭐ recommended</option>
                <option value="730">2 years</option>
                <option value="perm">Permanent burn 🔥 max trust</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>TEAM WALLET % (kept by team — max 20%)</div>
              <input type="number" placeholder="e.g. 10" min={0} max={20} value={form.teamwallet} onChange={e => update('teamwallet', e.target.value)} style={fieldStyle} />
            </div>

            <div>
              <div style={labelStyle}>VESTING SCHEDULE (team tokens)</div>
              <select value={form.vesting} onChange={e => update('vesting', e.target.value)} style={{ ...fieldStyle, padding: '9px 12px' }}>
                <option value="none">No vesting (not recommended)</option>
                <option value="6m">6-month cliff, then monthly</option>
                <option value="12m">12-month cliff, then monthly</option>
                <option value="24m">24-month linear vesting</option>
                <option value="locked">Permanently locked</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>WEBSITE *</div>
              <input type="text" placeholder="https://yourproject.xyz" value={form.website} onChange={e => update('website', e.target.value)} style={fieldStyle} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={labelStyle}>TWITTER / X *</div>
                <input type="text" placeholder="@handle" value={form.twitter} onChange={e => update('twitter', e.target.value)} style={fieldStyle} />
              </div>
              <div>
                <div style={labelStyle}>TELEGRAM</div>
                <input type="text" placeholder="t.me/yourgroup" value={form.tg} onChange={e => update('tg', e.target.value)} style={fieldStyle} />
              </div>
            </div>

            <div>
              <div style={labelStyle}>PROJECT DESCRIPTION * (min 100 chars)</div>
              <textarea rows={4} placeholder="What is your project? What problem does it solve? What makes it different? Who is the team?" value={form.desc} onChange={e => handleDesc(e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
              <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 3 }}>{descCount} / 100 chars minimum</div>
            </div>

            <div>
              <div style={labelStyle}>USE OF FUNDS</div>
              <textarea rows={2} placeholder="How will raised funds be used? (dev, marketing, liquidity…)" value={form.funds} onChange={e => update('funds', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            <div>
              <div style={labelStyle}>PREVIOUS PROJECTS / TRACK RECORD</div>
              <textarea rows={2} placeholder="Any previous projects you've shipped? Links, GitHub, contract addresses…" value={form.track} onChange={e => update('track', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            <div style={{ background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: 8, padding: 12, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>APPLICATION FEE: 1 SOL</div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 10 }}>
                Paid on-chain to YAKK treasury. Non-refundable. Reviewed within 48h. 80% of your supply enters YAKK vesting escrow on approval.
              </div>
              <button className="btn btn-pink" onClick={submit} style={{ width: '100%', fontSize: 11 }}>
                🚀 PAY 1 SOL &amp; SUBMIT APPLICATION
              </button>
              {status && (
                <div style={{ marginTop: 8, fontSize: 10, textAlign: 'center', color: status.startsWith('✓') ? 'var(--green)' : 'var(--pink)' }}>
                  {status}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Active launches */}
          <div className="card-sm">
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>ACTIVE LAUNCHES</div>
            {ACTIVE_LAUNCHES.map(launch => (
              <div key={launch.name} style={{ padding: 14, background: 'var(--bg4)', borderRadius: 8, marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{launch.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>{launch.ticker}</div>
                  </div>
                  <span className="badge" style={{ background: launch.statusBg, color: launch.statusColor }}>{launch.status}</span>
                </div>
                <div style={{ marginTop: 10, height: 6, background: 'var(--bg2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${launch.pct}%`, background: launch.pctColor, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: 'var(--dim)' }}>{launch.leftLabel}</span>
                  <span style={{ fontSize: 9, color: 'var(--dim)' }}>{launch.rightLabel}</span>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'var(--dim)', textAlign: 'center', padding: 10 }}>
              More launches coming. Submit yours ←
            </div>
          </div>

          {/* Requirements */}
          <div className="card-sm">
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>REQUIREMENTS TO GET LISTED</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
              {REQUIREMENTS.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <span style={{ color: r.color, fontSize: 14, flexShrink: 0 }}>{r.icon}</span>
                  <div>{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* vs pump.fun */}
          <div className="card-sm" style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(224,96,126,0.04))', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#fca5a5', letterSpacing: '0.12em', marginBottom: 12 }}>YAKK VENTURES vs PUMP.FUN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 10 }}>
              <div style={{ fontWeight: 700, color: 'var(--gold)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>YAKK 🐾</div>
              <div style={{ fontWeight: 700, color: 'var(--dim)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>Pump.fun 🎰</div>
              {([
                ['1 SOL barrier to entry',    '~0.02 SOL, anyone'],
                ['YAKKAI review',              'No review'],
                ['80% supply in escrow',       'Dev dumps freely'],
                ['Mandatory liq lock',         'No lock required'],
                ['Team vesting enforced',      'No vesting'],
                ['Clown database check',       'Scammers welcome'],
                ['Listed in YAKK ecosystem',   'Bonding curve only'],
                ['Tokenised equity ready',     'Meme coins only'],
              ] as [string, string][]).map(([y, p], i) => (
                <>
                  <div key={`y${i}`} style={{ color: 'var(--text)' }}>{y}</div>
                  <div key={`p${i}`} style={{ color: 'var(--dim)' }}>{p}</div>
                </>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
