'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

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

const WHY_CARDS = [
  { icon: 'ðª', color: 'var(--pink)', title: '1 SOL Application Fee', desc: 'Eliminates bots and meme-rugs instantly. Only serious builders apply. Fee goes to YAKK treasury.' },
  { icon: 'ð¤', color: 'var(--gold)', title: 'YAKKAI Due Diligence', desc: 'Every application reviewed by YAKKAI + community. On-chain history checked. Scammer wallets blocked.' },
  { icon: 'ð', color: '#64dc64', title: 'Mandatory Liquidity Lock', desc: 'Minimum 30-day liquidity lock enforced on-chain. Permanent burn option gives extra trust signal.' },
  { icon: 'ð', color: '#7fdbff', title: 'Instant YAKK Listing', desc: 'Approved tokens get listed in our screener, NFT market, and OTC desk automatically. Real distribution from day 1.' },
];

const REQUIREMENTS = [
  { icon: 'â', color: '#64dc64', text: '1 SOL application fee paid on-chain to YAKK treasury' },
  { icon: 'â', color: '#64dc64', text: 'Liquidity locked for minimum 30 days on StakePoint or verified locker' },
  { icon: 'â', color: '#64dc64', text: 'Team wallet â¤ 20% of total supply with mandatory vesting' },
  { icon: 'â', color: '#64dc64', text: 'Working website + active Twitter/X presence' },
  { icon: 'â', color: '#64dc64', text: 'Minimum 100-word project description â no vapourware' },
  { icon: 'â', color: '#64dc64', text: 'Applicant wallet must not be flagged in our Clowns database' },
  { icon: 'â', color: 'var(--gold)', text: 'Optional: KYC (increases trust score, shown on listing)' },
  { icon: 'â', color: 'var(--gold)', text: 'Optional: Smart contract audit (YAKKAI automated + partner firms)' },
];

export default function TokenCreator({ walletConnected, ystBalance, onNavigate }: Props) {
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

  const handleDesc = (v: string) => {
    update('desc', v);
    setDescCount(v.length);
  };

  const submit = () => {
    if (!walletConnected) { setStatus('Connect wallet first.'); return; }
    if (!hasAccess) { setStatus('Need 10,000,000+ $YST to apply.'); return; }
    setStatus('â Application submitted! We will review within 48h.');
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">ANTI-PUMP ANTI-RUG</div>
      <div className="sec-title">Token Creator</div>
      <div className="sec-bar" />

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
        <span style={{ fontSize: 12 }}>10,000,000+ $YST ðª Held</span>
        <span className={`badge ${hasAccess ? 'b-green' : 'b-dim'}`}>
          {hasAccess ? 'â VERIFIED' : walletConnected ? 'NOT CHECKED' : 'NOT CHECKED'}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 8 }}>
        Launch a token the right way. Not a casino slot machine â a real project with locked liquidity, verified team, and YAKKAI due diligence. We're building what pump.fun should have been.
      </p>

      {/* Tokenised IPO banner */}
      <div style={{ background: 'linear-gradient(135deg,rgba(224,96,126,0.15),rgba(255,200,0,0.08))', border: '1px solid rgba(224,96,126,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 22, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28 }}>ð</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Tokenised Equity &amp; IPOs â We're Ready Now</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.6 }}>
            Companies are racing to tokenise their equity. Circle, Kraken, eToro â all announcing tokenised IPO plans. YAKK has the infrastructure to list them <em>today</em>. If you're a company exploring tokenised shares,{' '}
            <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>reach out on Telegram</a>.
          </div>
        </div>
        <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" className="btn btn-pink" style={{ textDecoration: 'none', fontSize: 10, padding: '9px 18px', whiteSpace: 'nowrap' }}>INQUIRE â</a>
      </div>

      {/* Why cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        {WHY_CARDS.map(c => (
          <div key={c.title} className="card-sm" style={{ borderLeft: `3px solid ${c.color}`, padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 7 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 5 }}>{c.title}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Application form + right column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Left: form */}
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
                <option value="365">1 year â­ recommended</option>
                <option value="730">2 years</option>
                <option value="perm">Permanent burn ð¥ max trust</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>TEAM WALLET % (kept by team)</div>
              <input type="number" placeholder="e.g. 10 (max 20%)" min={0} max={20} value={form.teamwallet} onChange={e => update('teamwallet', e.target.value)} style={{ ...fieldStyle, padding: '8px 12px' }} />
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
              <input type="text" placeholder="https://yourproject.xyz" value={form.website} onChange={e => update('website', e.target.value)} style={{ ...fieldStyle, padding: '8px 12px' }} />
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
              <textarea
                rows={4}
                placeholder="What is your project? What problem does it solve? What makes it different? Who is the team?"
                value={form.desc}
                onChange={e => handleDesc(e.target.value)}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
              <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 3 }}>{descCount} / 100 chars minimum</div>
            </div>

            <div>
              <div style={labelStyle}>USE OF FUNDS</div>
              <textarea rows={2} placeholder="How will raised funds be used? (dev, marketing, liquidityâ¦)" value={form.funds} onChange={e => update('funds', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            <div>
              <div style={labelStyle}>PREVIOUS PROJECTS / TRACK RECORD</div>
              <textarea rows={2} placeholder="Any previous projects you've shipped? Links, GitHub, contract addressesâ¦" value={form.track} onChange={e => update('track', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            {/* Payment + submit */}
            <div style={{ background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: 8, padding: 12, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>APPLICATION FEE: 1 SOL</div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 10 }}>Paid on-chain directly to YAKK treasury. Non-refundable. Prevents bot spam and signals serious intent. Reviewed within 48h.</div>
              <button className="btn btn-pink" onClick={submit} style={{ width: '100%', fontSize: 11 }}>
                ð PAY 1 SOL &amp; SUBMIT APPLICATION
              </button>
              {status && <div style={{ marginTop: 8, fontSize: 10, textAlign: 'center', color: status.startsWith('â') ? 'var(--green)' : 'var(--pink)' }}>{status}</div>}
            </div>

          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Requirements checklist */}
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

          {/* Pump.fun comparison */}
          <div className="card-sm" style={{ background: 'linear-gradient(135deg,rgba(239,68,68,0.06),rgba(224,96,126,0.04))', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#fca5a5', letterSpacing: '0.12em', marginBottom: 12 }}>YAKK TOKEN CREATOR vs PUMP.FUN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 10 }}>
              <div style={{ fontWeight: 700, color: 'var(--gold)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>YAKK ð¾</div>
              <div style={{ fontWeight: 700, color: 'var(--dim)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>Pump.fun ð°</div>
              {[
                ['1 SOL barrier to entry', '~0.02 SOL, anyone'],
                ['YAKKAI review', 'No review'],
                ['Mandatory liq lock', 'No lock required'],
                ['Team vesting enforced', 'No vesting'],
                ['Clown database check', 'Scammers welcome'],
                ['Listed in YAKK ecosystem', 'Bonding curve only'],
                ['Tokenised equity ready', 'Meme coins only'],
              ].map(([y, p], i) => (
                <>
                  <div key={`y${i}`} style={{ color: 'var(--text)' }}>{y}</div>
                  <div key={`p${i}`} style={{ color: 'var(--dim)' }}>{p}</div>
                </>
              ))}
            </div>
          </div>

          {/* Recently approved */}
          <div className="card-sm">
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>RECENTLY APPROVED</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 9, background: 'var(--bg4)', borderRadius: 7, marginBottom: 7 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>YAKK Studios</div>
                <div style={{ fontSize: 9, color: 'var(--dim)' }}>$YST Â· Utility Á· Solana</div>
              </div>
              <span className="badge" style={{ background: 'rgba(100,220,100,0.15)', color: '#64dc64', fontSize: 8 }}>APPROVED</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--dim)', textAlign: 'center', padding: 10 }}>
              Be one of the first approved projects. Applications open now.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
