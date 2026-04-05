'use client';
import { useState, useEffect } from 'react';

const PEPS = [
  "The den is open. No paper hands. No excuses.",
  "Anti-greed infrastructure. Your wallet is your account.",
  "The empire is building. The mountain delivers.",
  "No KYC. No email. No extraction. Just on-chain.",
  "Rug detectors don't lie. Neither do we.",
  "Your keys. Your money. Your call.",
  "DeFi shouldn't cost $300 to update a token. We charge $10.",
  "14,000+ wallets profiled. The clowns don't know we're watching.",
];

const FEATURES = [
  { name: 'SWAP', dex: false, bird: false },
  { name: 'Rug Ledger', dex: false, bird: false },
  { name: 'NFT Market (6 chains)', dex: false, bird: false },
  { name: 'AI Coach', dex: false, bird: false },
  { name: 'Privacy Router', dex: false, bird: false },
  { name: 'OTC Desk', dex: false, bird: false },
  { name: 'Anti-rug Launchpad', dex: false, bird: false },
  { name: 'Prediction Markets', dex: false, bird: false },
  { name: 'No KYC / Email', dex: false, bird: false },
  { name: 'Token Creator', dex: false, bird: true },
  { name: 'Bridge', dex: false, bird: true },
];

function fmtPrice(p: string | number): string {
  const n = typeof p === 'string' ? parseFloat(p) : p;
  if (!n) return '$0.00';
  if (n < 0.000001) return '$' + n.toExponential(2);
  if (n < 0.0001) return '$' + n.toFixed(8);
  if (n < 0.01) return '$' + n.toFixed(6);
  if (n < 1) return '$' + n.toFixed(4);
  return '$' + n.toFixed(2);
}

function fmtNum(n: number | string): string {
  const v = typeof n === 'string' ? parseFloat(n) : n;
  if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(2) + 'M';
  if (v >= 1_000) return '$' + (v / 1_000).toFixed(1) + 'K';
  return '$' + v.toFixed(0);
}

export default function Home({
  walletConnected,
  ystBalance,
  onNavigate,
}: {
  walletConnected?: boolean;
  ystBalance?: number;
  onNavigate?: (s: string) => void;
}) {
  const [pep, setPep] = useState(PEPS[0]);
  const [nftDays, setNftDays] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [stats, setStats] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('yst-stats') || 'null'); } catch { return null; }
    }
    return null;
  });

  // Fetch live $YST stats from /api/price
  useEffect(() => {
    const load = () => fetch('/api/price')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setStats(d);
          try { localStorage.setItem('yst-stats', JSON.stringify(d)); } catch {}
        }
      })
      .catch(() => {});
    load();
    const iv = setInterval(load, 60_000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const drop = new Date('2026-04-20T00:00:00Z').getTime();
    const tick = () => {
      const diff = drop - Date.now();
      if (diff <= 0) return;
      setNftDays({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const newPep = () => {
    const next = PEPS[Math.floor(Math.random() * PEPS.length)];
    setPep(next);
  };

  // ── Derived banner values ─────────────────────────────────────────────────
  const bannerPrice    = stats?.price      ? fmtPrice(stats.price)       : '—';
  const bannerVol      = stats?.volume24h  ? fmtNum(stats.volume24h)     : '—';
  const bannerMcap     = stats?.marketCap  ? fmtNum(stats.marketCap)     : '—';
  const bannerLiq      = stats?.liquidity  ? fmtNum(stats.liquidity)     : '—';
  const bannerChg      = stats?.change24h  ?? null;
  const chgPositive    = bannerChg !== null && Number(bannerChg) >= 0;
  const chgLabel       = bannerChg !== null
    ? `${chgPositive ? '+' : ''}${Number(bannerChg).toFixed(2)}%`
    : '—';

  return (
    <div className="sec-pad">
      {/* HERO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 26, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div className="sec-eyebrow">01 — THE DEN IS OPEN</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,66px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            <div>PINK</div>
            <div style={{ color: 'var(--pink)' }}>YAKK</div>
            <div style={{ color: 'var(--gold)' }}>SUPREMACY</div>
          </div>
          <div className="sec-bar" />
          <p style={{ color: 'var(--muted)', maxWidth: 440, fontSize: 13, lineHeight: 1.8 }}>
            Anti-greed Solana infrastructure. Real-time screener. Multichain NFT market. Anti-rug launchpad.
            OTC desk. Yield finder. Bridge. Privacy router. Token creator.
            Everything DeFi needs. Nothing CEXs want you to have.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap', marginTop: 16 }}>
            <button className="btn btn-pink" onClick={() => onNavigate?.('screener')}>📊 YAKK SCREENER</button>
            <button className="btn btn-outline" onClick={() => onNavigate?.('terminal')}>🔗 SWAP TERMINAL</button>
          </div>
          <div style={{ marginTop: 10, fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', lineHeight: 1.6 }}>
            🔑 Your keys, your money — you don&apos;t make an account with us. Your wallet <em>is</em> your account.
          </div>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/yakk-logo.jpg"
            alt="YAKK Studios logo"
            style={{ width: 'clamp(140px,16vw,220px)', height: 'auto', borderRadius: 12, filter: 'drop-shadow(0 0 40px rgba(224,96,126,0.4))', animation: 'yakk-float 4s ease-in-out infinite' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      {/* LIVE DEX BANNER — wired to /api/price */}
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 20, borderRight: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 20 }}>🩷</div>
          <div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13 }}>$YST / SOL</div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>Meteora DBC · Solana</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '0 20px', flexWrap: 'nowrap' }}>
          {/* PRICE — with 24h change colour */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', marginBottom: 2 }}>PRICE USD</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>
              {bannerPrice}
              {bannerChg !== null && (
                <span style={{
                  fontSize: 9,
                  marginLeft: 5,
                  color: chgPositive ? 'var(--green)' : 'var(--red)',
                  fontFamily: 'Space Mono,monospace',
                }}>
                  {chgLabel}
                </span>
              )}
            </div>
          </div>
          {/* Remaining banner stats */}
          {([
            ['24H VOLUME', bannerVol],
            ['MARKET CAP', bannerMcap],
            ['LIQUIDITY',  bannerLiq],
            ['BUYS / SELLS', '— / —'],
            ['HOLDERS', '—'],
          ] as [string, string][]).map(([label, val]) => (
            <div key={label} style={{ flexShrink: 0, borderLeft: '1px solid var(--border)', paddingLeft: 20 }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, flexShrink: 0, paddingLeft: 16 }}>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '5px 11px' }} onClick={() => onNavigate?.('terminal')}>📈 TRADE</button>
          <button className="btn btn-outline" style={{ fontSize: 9, padding: '5px 11px' }} onClick={() => onNavigate?.('screener')}>📊 SCREENER</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(148px,1fr))', gap: 12, marginBottom: 22 }}>
        <div className="stat-card"><div className="slbl">$YST PRICE</div><div className="sval" style={{ color: 'var(--pink)', fontSize: 16 }}>{stats?.price ? fmtPrice(stats.price) : '—'}</div><div className="ssub">{stats?.change24h != null ? <span style={{ color: Number(stats.change24h) >= 0 ? 'var(--green)' : 'var(--red)' }}>{Number(stats.change24h) >= 0 ? '+' : ''}{Number(stats.change24h).toFixed(2)}% 24h</span> : 'Fetching...'}</div></div>
        <div className="stat-card"><div className="slbl">24H VOLUME</div><div className="sval" style={{ color: 'var(--gold)' }}>{stats?.volume24h ? fmtNum(stats.volume24h) : '—'}</div><div className="ssub">DexScreener</div></div>
        <div className="stat-card"><div className="slbl">LIQUIDITY</div><div className="sval" style={{ color: 'var(--green)' }}>{stats?.liquidity ? fmtNum(stats.liquidity) : '—'}</div><div className="ssub">{stats?.pairAddress ? 'Meteora' : 'DexScreener'}</div></div>
        <div className="stat-card"><div className="slbl">CLOWNS EXPOSED</div><div className="sval" style={{ color: 'var(--red)' }}>74</div><div className="ssub">&amp; counting 🤡</div></div>
        <div className="stat-card"><div className="slbl">NFT COLLECTION</div><div className="sval">3,333</div><div className="ssub">Drop: Apr 20 2026</div></div>
      </div>

      {/* NFT DROP + PEP */}
      <div className="grid2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>YAKKS NFT DROP</div>
            <span className="badge b-gold">3,333 PIECES</span>
          </div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 12 }}>
            {[['DAYS', nftDays.d], ['HRS', nftDays.h], ['MIN', nftDays.m], ['SEC', nftDays.s]].map(([l, v]) => (
              <div key={l} className="cd-block">
                <div className="cd-num">{v}</div>
                <div className="cd-lbl">{l}</div>
              </div>
            ))}
          </div>
          <div className="prog-bar"><div className="prog-fill" style={{ width: '38%' }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}><span>PROGRESS</span><span>38%</span></div>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 9 }}>Drops 1+2 rebooted + 2,333 additional. 33.3% paperhands tax mechanic incoming.</p>
          <button className="btn btn-outline" style={{ marginTop: 10, fontSize: 10 }} onClick={() => onNavigate?.('nftdrop')}>VIEW NFT DROP →</button>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>DAILY YAKKAI PEP</div>
            <span className="badge b-yakk">AI</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, minHeight: 68, fontStyle: 'italic' }}>&quot;{pep}&quot;</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 7 }}>
            <button className="btn btn-ghost" style={{ fontSize: 10, padding: '5px 11px' }} onClick={newPep}>↻ NEW PEP</button>
            <button className="btn btn-outline" style={{ fontSize: 10, padding: '5px 11px' }} onClick={() => onNavigate?.('coach')}>YAKKAI →</button>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 9, marginBottom: 22 }}>
        {[
          { icon: '📊', title: 'YAKK SCREENER', desc: '$10 SOL to update your token on-chain. Supports Metaplex MPL + Token-2022 (pump.fun). Trusted projects featured.', badge: '$10 vs $300+', badgeClass: 'b-green', section: 'screener' },
          { icon: '📖', title: 'RUG LEDGER', desc: '$3.9B+ documented. 12 investigations. The same 15 wallets every time.', badge: '$3.9B+ TRACKED', badgeClass: 'b-red', section: 'ledger' },
          { icon: '🧠', title: 'YAKKAI COACH', desc: 'Discipline. Raid strategy. Risk management. Your mafia consigliere.', section: 'coach' },
          { icon: '⚔️', title: 'RAID HUB', desc: 'Daily targets. Earn XP. Climb the leaderboard. GET YAKKED.', section: 'raids' },
          { icon: '🛒', title: 'NFT MARKET', desc: 'SOL, ETH, BTC Ordinals, BNB, Tron. 6 chains, 1 interface. Only 1.5% fee.', badge: '6 CHAINS', badgeClass: 'b-gold', section: 'nftmarket' },
          { icon: '🌉', title: 'BRIDGE & SWAP', desc: 'deBridge · Wormhole · Mayan · Allbridge. Cross-chain without leaving YAKK.', badge: '0.1% FEE', badgeClass: 'b-green', section: 'terminal' },
          { icon: '📈', title: 'PORTFOLIO TRACKER', desc: 'Live wallet holdings, SOL balance, token accounts, recent transactions. No spreadsheets.', section: 'portfolio' },
        ].map(card => (
          <div key={card.title} onClick={() => onNavigate?.(card.section)} className="card-sm" style={{ cursor: 'pointer', padding: 16 }}>
            <div style={{ fontSize: 18, marginBottom: 7 }}>{card.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{card.title}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{card.desc}</div>
            {card.badge && <div style={{ marginTop: 8 }}><span className={`badge ${card.badgeClass}`}>{card.badge}</span></div>}
          </div>
        ))}
      </div>

      {/* ROADMAP */}
      <div className="card-sm" style={{ marginBottom: 16, borderLeft: '3px solid var(--gold)' }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: 12 }}>ROADMAP — Q2/Q3 2026</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
          <div style={{ padding: 10, background: 'var(--bg4)', borderRadius: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#64dc64', marginBottom: 3 }}>✅ SHIPPED</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>Screener · Terminal · AI Trader · Predictions · Cabal · NFT Market · Launchpad · OTC · Yield · Bridge · Privacy · Token Creator · Discord Bot · X Automation</div>
          </div>
          <div style={{ padding: 10, background: 'var(--bg4)', borderRadius: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--gold)', marginBottom: 3 }}>🔨 BUILDING</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>Mobile app · Limit orders · Cross-chain portfolio · Tokenised equity IPOs · TG trade bot · MEV shield</div>
          </div>
          <div style={{ padding: 10, background: 'var(--bg4)', borderRadius: 7 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--pink)', marginBottom: 3 }}>🎯 NEXT</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>Revenue share for $YST stakers · Institutional OTC desk · Multi-sig treasury · DAO governance · API access for builders</div>
          </div>
        </div>
      </div>

      {/* REVENUE STREAMS */}
      <div className="card-sm" style={{ marginBottom: 16, background: 'linear-gradient(135deg,rgba(100,220,100,0.06),rgba(5,5,9,0.8))', borderColor: 'rgba(100,220,100,0.2)' }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: '#64dc64', letterSpacing: '0.12em', marginBottom: 10 }}>💰 REVENUE STREAMS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, fontSize: 10 }}>
          <div>🔍 Screener updates: <strong>$10/update</strong></div>
          <div>🚀 Token launches: <strong>1 SOL/app</strong></div>
          <div>🛒 NFT marketplace: <strong>1.5% fee</strong></div>
          <div>🤝 OTC desk: <strong>0.3% fee</strong></div>
          <div>🔍 Investigations: <strong>1 SOL/request</strong></div>
          <div>🌉 Bridge: <strong>0.1% routing fee</strong></div>
        </div>
      </div>

      {/* TOKENOMICS REVSHARE */}
      <div className="card-sm" style={{ marginBottom: 16, background: 'linear-gradient(135deg,rgba(247,201,72,0.06),rgba(5,5,9,0.9))', borderColor: 'rgba(247,201,72,0.2)' }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.12em', marginBottom: 12 }}>⚡ $YST REVSHARE TOKENOMICS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, textAlign: 'center', marginBottom: 10 }}>
          <div style={{ background: 'var(--bg4)', borderRadius: 7, padding: '10px 6px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--pink)' }}>5%</div>
            <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>TX TAX</div>
            <div style={{ fontSize: 8, color: 'var(--dim)', opacity: 0.7 }}>buy &amp; sell</div>
          </div>
          <div style={{ background: 'var(--bg4)', borderRadius: 7, padding: '10px 6px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--green)' }}>30%</div>
            <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>TO STAKERS</div>
            <div style={{ fontSize: 8, color: 'var(--dim)', opacity: 0.7 }}>of platform fees</div>
          </div>
          <div style={{ background: 'var(--bg4)', borderRadius: 7, padding: '10px 6px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>🎁</div>
            <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>CASHBACK</div>
            <div style={{ fontSize: 8, color: 'var(--dim)', opacity: 0.7 }}>use platform → earn $YST</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--dim)', flexWrap: 'wrap', gap: 4 }}>
          <span>2% tax → treasury</span>
          <span>2% tax → $YST stakers</span>
          <span>1% tax → burn 🔥</span>
        </div>
        <div style={{ marginTop: 10 }}>
          <button className="btn btn-outline" style={{ fontSize: 9, padding: '4px 12px' }} onClick={() => onNavigate?.('whitepaper')}>VIEW FULL TOKENOMICS →</button>
        </div>
      </div>

      {/* NEWLY LIVE BANNER */}
      <div style={{ padding: '18px 22px', background: 'rgba(247,201,72,0.03)', border: '1px solid rgba(247,201,72,0.1)', borderRadius: 9 }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.18em', marginBottom: 9 }}>NEWLY LIVE — YAKK DEFI SUITE</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span onClick={() => onNavigate?.('yakktrader')} className="cs-tag" style={{ cursor: 'pointer', borderColor: 'rgba(224,96,126,0.4)', color: 'var(--pink)' }}>🤖 YAKK AI TRADER ✓ LIVE</span>
          <span onClick={() => onNavigate?.('predictions')} className="cs-tag" style={{ cursor: 'pointer', borderColor: 'rgba(247,201,72,0.4)', color: 'var(--gold)' }}>🔮 PREDICTION MARKETS ✓ LIVE</span>
          <span className="cs-tag">📊 DEXSCREENER CHARTS ✓ FIXED</span>
          <span className="cs-tag">🔍 CABAL SCANNER V2</span>
        </div>
        <p style={{ fontSize: 11, color: 'var(--dim)', marginTop: 9 }}>The empire is building. The mountain delivers. GET YAKKED.</p>
      </div>
    </div>
  );
}
