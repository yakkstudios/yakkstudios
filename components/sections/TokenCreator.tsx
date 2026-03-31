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
  { icon: '🪙', color: 'var(--pink)', title: '1 SOL Application Fee', desc: 'Eliminates bots and meme-rugs instantly. Only serious builders apply. Fee goes to YAKK treasury.' },
  { icon: '🤖', color: 'var(--gold)', title: 'YAKKAI Due Diligence', desc: 'Every application reviewed by YAKKAI + community. On-chain history checked. Scammer wallets blocked.' },
  { icon: '🐋', color: '#64dc64', title: 'Mandatory Liquidity Lock', desc: 'Minimum 30-day liquidity lock enforced on-chain. Permanent burn option gives extra trust signal.' },
  { icon: '📊', color: '#7fdbff', title: 'Instant YAKK Listing', desc: 'Approved tokens get listed in our screener, NFT market, and OTC desk automatically. Real distribution from day 1.' },
];

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

type Tab = 'apply' | 'liquidity';

export default function TokenCreator({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  const [tab, setTab] = useState<Tab>('apply');

  // — Apply form state —
  const [form, setForm] = useState({
    name: '', ticker: '', type: '', supply: '', initprice: '',
    lock: '', teamwallet: '', vesting: '12m',
    website: '', twitter: '', tg: '',
    desc: '', funds: '', track: '',
  });
  const [descCount, setDescCount] = useState(0);
  const [applyStatus, setApplyStatus] = useState('');

  // — Manage Liquidity state —
  const [liqCA, setLiqCA] = useState('');
  const [liqPoolAddr, setLiqPoolAddr] = useState('');
  const [liqSolAmt, setLiqSolAmt] = useState('');
  const [liqTokenAmt, setLiqTokenAmt] = useState('');
  const [liqDex, setLiqDex] = useState('meteora');
  const [removeAmt, setRemoveAmt] = useState('');
  const [liqStatus, setLiqStatus] = useState('');
  const [liqLookupDone, setLiqLookupDone] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleDesc = (v: string) => {
    update('desc', v);
    setDescCount(v.length);
  };

  const submit = () => {
    if (!walletConnected) { setApplyStatus('Connect wallet first.'); return; }
    if (!hasAccess) { setApplyStatus('Need 10,000,000+ $YST to apply.'); return; }
    setApplyStatus('✓ Application submitted! We will review within 48h.');
  };

  const handleLiqLookup = () => {
    if (!liqCA) { setLiqStatus('Enter your token contract address first.'); return; }
    setLiqLookupDone(true);
    setLiqStatus('');
  };

  const handleAddLiq = () => {
    if (!liqSolAmt || !liqTokenAmt) { setLiqStatus('Enter both SOL and token amounts.'); return; }
    const dexUrl = liqDex === 'meteora'
      ? `https://app.meteora.ag/pools/${liqPoolAddr || liqCA}`
      : `https://raydium.io/liquidity/add/?ammId=${liqPoolAddr || liqCA}`;
    window.open(dexUrl, '_blank', 'noopener,noreferrer');
    setLiqStatus('✓ Opening DEX with your pool pre-selected. Confirm the transaction in your wallet.');
  };

  const handleRemoveLiq = () => {
    const dexUrl = liqDex === 'meteora'
      ? `https://app.meteora.ag/pools/${liqPoolAddr || liqCA}`
      : `https://raydium.io/liquidity/remove/?ammId=${liqPoolAddr || liqCA}`;
    window.open(dexUrl, '_blank', 'noopener,noreferrer');
    setLiqStatus('✓ Opening DEX. Select your LP position and confirm removal.');
  };

  const tabBtn = (id: Tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      style={{
        padding: '8px 18px',
        fontFamily: 'Space Mono,monospace',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        background: tab === id ? 'var(--pink)' : 'var(--bg4)',
        color: tab === id ? '#fff' : 'var(--dim)',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">ANTI-PUMP ANTI-RUG</div>
      <div className="sec-title">Token Creator</div>
      <div className="sec-bar" />

      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold 10,000,000 $YST to unlock this tool.
          </div>
        </div>
      )}

      {hasAccess && (<>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabBtn('apply', '🚀 APPLY TO LAUNCH')}
        {tabBtn('liquidity', '💧 MANAGE LIQUIDITY')}
      </div>

      {/* ── APPLY TAB ── */}
      {tab === 'apply' && (<>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 8 }}>
        Launch a token the right way. Not a casino slot machine — a real project with locked liquidity, verified team, and YAKKAI due diligence. We're building what pump.fun should have been.
      </p>

      {/* Tokenised IPO banner */}
      <div style={{ background: 'linear-gradient(135deg,rgba(224,96,126,0.15),rgba(255,200,0,0.08))', border: '1px solid rgba(224,96,126,0.3)', borderRadius: 12, padding: '16px 20px', marginBottom: 22, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 28 }}>📈</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Tokenised Equity &amp; IPOs — We're Ready Now</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.6 }}>
            Companies are racing to tokenise their equity. Circle, Kraken, eToro — all announcing tokenised IPO plans. YAKK has the infrastructure to list them <em>today</em>. If you're a company exploring tokenised shares,{' '}
            <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>reach out on Telegram</a>.
          </div>
        </div>
        <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" className="btn btn-pink" style={{ textDecoration: 'none', fontSize: 10, padding: '9px 18px', whiteSpace: 'nowrap' }}>INQUIRE →</a>
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
                <option value="365">1 year ⭐ recommended</option>
                <option value="730">2 years</option>
                <option value="perm">Permanent burn 🔥 max trust</option>
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
              <textarea rows={2} placeholder="How will raised funds be used? (dev, marketing, liquidity…)" value={form.funds} onChange={e => update('funds', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            <div>
              <div style={labelStyle}>PREVIOUS PROJECTS / TRACK RECORD</div>
              <textarea rows={2} placeholder="Any previous projects you've shipped? Links, GitHub, contract addresses…" value={form.track} onChange={e => update('track', e.target.value)} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>

            {/* Payment + submit */}
            <div style={{ background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: 8, padding: 12, marginTop: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, marginBottom: 6 }}>APPLICATION FEE: 1 SOL</div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 10 }}>Paid on-chain directly to YAKK treasury. Non-refundable. Prevents bot spam and signals serious intent. Reviewed within 48h.</div>
              <button className="btn btn-pink" onClick={submit} style={{ width: '100%', fontSize: 11 }}>
                🚀 PAY 1 SOL &amp; SUBMIT APPLICATION
              </button>
              {applyStatus && <div style={{ marginTop: 8, fontSize: 10, textAlign: 'center', color: applyStatus.startsWith('✓') ? 'var(--green)' : 'var(--pink)' }}>{applyStatus}</div>}
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
              <div style={{ fontWeight: 700, color: 'var(--gold)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>YAKK 🐾</div>
              <div style={{ fontWeight: 700, color: 'var(--dim)', paddingBottom: 6, borderBottom: '1px solid var(--border)' }}>Pump.fun 🎰</div>
              {([
                ['1 SOL barrier to entry', '~0.02 SOL, anyone'],
                ['YAKKAI review', 'No review'],
                ['Mandatory liq lock', 'No lock required'],
                ['Team vesting enforced', 'No vesting'],
                ['Clown database check', 'Scammers welcome'],
                ['Listed in YAKK ecosystem', 'Bonding curve only'],
                ['Add liquidity anytime', 'Pool only'],
                ['Tokenised equity ready', 'Meme coins only'],
              ] as [string, string][]).flatMap(([y, p], i) => [
                <div key={`y${i}`} style={{ color: 'var(--text)' }}>{y}</div>,
                <div key={`p${i}`} style={{ color: 'var(--dim)' }}>{p}</div>,
              ])}
            </div>
          </div>

          {/* Recently approved */}
          <div className="card-sm">
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>RECENTLY APPROVED</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 9, background: 'var(--bg4)', borderRadius: 7, marginBottom: 7 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>YAKK Studios</div>
                <div style={{ fontSize: 9, color: 'var(--dim)' }}>$YST · Utility · Solana</div>
              </div>
              <span className="badge" style={{ background: 'rgba(100,220,100,0.15)', color: '#64dc64', fontSize: 8 }}>APPROVED</span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--dim)', textAlign: 'center', padding: 10 }}>
              Be one of the first approved projects. Applications open now.
            </div>
          </div>

        </div>
      </div>
      </>)}

      {/* ── MANAGE LIQUIDITY TAB ── */}
      {tab === 'liquidity' && (<>

        {/* Explainer banner */}
        <div style={{ background: 'linear-gradient(135deg,rgba(96,165,250,0.08),rgba(247,201,72,0.04))', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>💧 Add Liquidity — Not Just Buy Into the Pool</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', lineHeight: 1.7 }}>
            There&apos;s a critical difference between <strong style={{ color: 'var(--gold)' }}>adding liquidity</strong> and <strong style={{ color: 'var(--dim)' }}>buying into the pool</strong>.
            Adding to the pool means buying tokens on the bonding curve — you&apos;re a buyer, not a provider.
            Adding <em>liquidity</em> means pairing your tokens with SOL to create a bilateral LP position on a DEX,
            deepening the order book and reducing slippage for all traders.
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 10 }}>
            <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 5, padding: '5px 10px', color: '#93c5fd' }}>
              ✓ You can add LP at any time — no permission needed
            </div>
            <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 5, padding: '5px 10px', color: '#93c5fd' }}>
              ✓ YAKK routes directly to Meteora or Raydium for execution
            </div>
            <div style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: 5, padding: '5px 10px', color: '#93c5fd' }}>
              ✓ Earn LP fees on every trade while your liquidity is deployed
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Left: lookup + add */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Token lookup */}
            <div className="card-sm">
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>YOUR TOKEN</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={labelStyle}>TOKEN CONTRACT ADDRESS *</div>
                  <input
                    type="text"
                    placeholder="Paste your token mint address"
                    value={liqCA}
                    onChange={e => { setLiqCA(e.target.value); setLiqLookupDone(false); }}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>POOL ADDRESS (optional — auto-detected)</div>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-detect from CA"
                    value={liqPoolAddr}
                    onChange={e => setLiqPoolAddr(e.target.value)}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <div style={labelStyle}>DEX</div>
                  <select value={liqDex} onChange={e => setLiqDex(e.target.value)} style={{ ...fieldStyle, padding: '9px 12px' }}>
                    <option value="meteora">Meteora (recommended for YAKK tokens)</option>
                    <option value="raydium">Raydium</option>
                  </select>
                </div>
                <button className="btn btn-outline" style={{ fontSize: 10 }} onClick={handleLiqLookup}>
                  🔍 LOOK UP TOKEN
                </button>
              </div>
            </div>

            {/* Add Liquidity form */}
            <div className="card-sm" style={{ borderColor: liqLookupDone ? 'rgba(96,165,250,0.3)' : undefined }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>
                ADD LIQUIDITY
                {!liqLookupDone && <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.2)' }}>— look up your token first</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: liqLookupDone ? 1 : 0.4, pointerEvents: liqLookupDone ? 'auto' : 'none' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={labelStyle}>SOL AMOUNT</div>
                    <input
                      type="number"
                      placeholder="e.g. 5.0"
                      step="0.1"
                      value={liqSolAmt}
                      onChange={e => setLiqSolAmt(e.target.value)}
                      style={fieldStyle}
                    />
                  </div>
                  <div>
                    <div style={labelStyle}>TOKEN AMOUNT</div>
                    <input
                      type="number"
                      placeholder="e.g. 1000000"
                      value={liqTokenAmt}
                      onChange={e => setLiqTokenAmt(e.target.value)}
                      style={fieldStyle}
                    />
                  </div>
                </div>
                {liqSolAmt && liqTokenAmt && (
                  <div style={{ fontSize: 9, color: 'var(--dim)', background: 'var(--bg4)', borderRadius: 5, padding: '6px 10px' }}>
                    Implied price: {(parseFloat(liqSolAmt) / parseFloat(liqTokenAmt)).toFixed(8)} SOL per token
                  </div>
                )}
                <button className="btn btn-pink" style={{ fontSize: 11 }} onClick={handleAddLiq}>
                  💧 ADD LIQUIDITY →
                </button>
                <div style={{ fontSize: 9, color: 'var(--dim)', lineHeight: 1.6 }}>
                  This opens {liqDex === 'meteora' ? 'Meteora' : 'Raydium'} with your pool pre-selected. You will confirm the transaction in your Phantom wallet. YAKK does not custody funds.
                </div>
              </div>
            </div>

            {/* Remove Liquidity */}
            <div className="card-sm" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#fca5a5', letterSpacing: '0.12em', marginBottom: 12 }}>REMOVE LIQUIDITY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: liqLookupDone ? 1 : 0.4, pointerEvents: liqLookupDone ? 'auto' : 'none' }}>
                <div>
                  <div style={labelStyle}>% OF POSITION TO REMOVE</div>
                  <select value={removeAmt} onChange={e => setRemoveAmt(e.target.value)} style={{ ...fieldStyle, padding: '9px 12px' }}>
                    <option value="">Select amount</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100">100% — full exit</option>
                  </select>
                </div>
                <button
                  className="btn"
                  style={{ fontSize: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
                  onClick={handleRemoveLiq}
                >
                  ↩ REMOVE LIQUIDITY
                </button>
                <div style={{ fontSize: 9, color: 'var(--dim)' }}>
                  Removing liquidity will reclaim your SOL + tokens. Make sure your lock period has expired before attempting — locked LP cannot be withdrawn.
                </div>
              </div>
            </div>

            {liqStatus && (
              <div style={{ fontSize: 10, padding: '10px 14px', borderRadius: 7, background: liqStatus.startsWith('✓') ? 'rgba(100,220,100,0.08)' : 'rgba(224,96,126,0.08)', border: `1px solid ${liqStatus.startsWith('✓') ? 'rgba(100,220,100,0.25)' : 'rgba(224,96,126,0.25)'}`, color: liqStatus.startsWith('✓') ? '#64dc64' : 'var(--pink)' }}>
                {liqStatus}
              </div>
            )}
          </div>

          {/* Right: info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Pool vs Liquidity explainer */}
            <div className="card-sm">
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>POOL vs LIQUIDITY — THE DIFFERENCE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ padding: '10px 12px', background: 'rgba(247,201,72,0.05)', border: '1px solid rgba(247,201,72,0.15)', borderLeft: '3px solid var(--gold)', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Buying into the Pool</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.6 }}>You swap SOL for tokens on the bonding curve. You become a holder. The pool&apos;s token supply decreases. This is what &quot;buying&quot; means.</div>
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)', borderLeft: '3px solid #60a5fa', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#93c5fd', marginBottom: 4 }}>Adding Liquidity (LP)</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.6 }}>You deposit <em>both</em> tokens + SOL at the current ratio. You receive LP tokens representing your share. You earn a cut of every trade fee. The pool gets deeper — less slippage for everyone.</div>
                </div>
                <div style={{ padding: '10px 12px', background: 'rgba(100,220,100,0.05)', border: '1px solid rgba(100,220,100,0.15)', borderLeft: '3px solid #64dc64', borderRadius: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#64dc64', marginBottom: 4 }}>Why it matters for creators</div>
                  <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.6 }}>Adding LP at any time gives your token deeper liquidity — this signals confidence, reduces manipulation, and makes your token more attractive to investors. You can do it whenever you have extra SOL.</div>
                </div>
              </div>
            </div>

            {/* Supported DEXes */}
            <div className="card-sm">
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>SUPPORTED DEXes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { name: 'Meteora', badge: '⭐ Recommended', desc: 'DLMM + DBC pools. YAKK tokens launch here by default. Best for concentrated liquidity.', color: '#a78bfa', url: 'https://app.meteora.ag' },
                  { name: 'Raydium', badge: 'CPMM', desc: 'Classic AMM pools. Wider ecosystem compatibility. Good for established tokens.', color: '#60a5fa', url: 'https://raydium.io' },
                ].map(d => (
                  <div key={d.name} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--bg4)', borderRadius: 7 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: d.color }}>{d.name}</span>
                        <span style={{ fontSize: 8, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 3, color: 'var(--dim)' }}>{d.badge}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--dim)', lineHeight: 1.5 }}>{d.desc}</div>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 8, padding: '4px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>OPEN ↗</a>
                  </div>
                ))}
              </div>
            </div>

            {/* LP tips */}
            <div className="card-sm">
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>LP TIPS FOR CREATORS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, fontSize: 10, color: 'var(--dim)' }}>
                {[
                  '📌 Add LP gradually over time — large single additions can move price',
                  '🔒 Consider locking new LP additions to signal long-term commitment',
                  '💰 LP fees are paid in SOL + your token — claim them anytime from the DEX',
                  '⚠ Impermanent loss occurs if price moves significantly — understand it before adding',
                  '📊 Deeper liquidity = lower slippage = better screener ranking on YAKK',
                ].map((tip, i) => (
                  <div key={i} style={{ padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5, lineHeight: 1.5 }}>{tip}</div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </>)}

      </>)}
    </div>
  );
}
