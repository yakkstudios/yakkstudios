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
  { name: 'SWAP',              dex: false, bird: false },
  { name: 'Rug Ledger',        dex: false, bird: false },
  { name: 'NFT Market (6 chains)', dex: false, bird: false },
  { name: 'AI Coach',          dex: false, bird: false },
  { name: 'Privacy Router',    dex: false, bird: false },
  { name: 'OTC Desk',          dex: false, bird: false },
  { name: 'Anti-rug Launchpad',dex: false, bird: false },
  { name: 'Prediction Markets',dex: false, bird: false },
  { name: 'No KYC / Email',    dex: false, bird: false },
  { name: 'Token Creator',     dex: false, bird: false },
  { name: 'Bridge',            dex: false, bird: false },
];

export default function Home({ onNav }: { onNav?: (s: string) => void }) {
  const [pep, setPep] = useState(PEPS[0]);
  const [nftDays, setNftDays] = useState({ d: '00', h: '00', m: '00', s: '00' });

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

  return (
    <section id="section-home" style={{ padding: '0 0 60px' }}>

      {/* Hero */}
      <div className="home-hero" style={{ padding: '32px 20px 24px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, marginBottom: 8, textTransform: 'uppercase' }}>
          01 — THE DEN IS OPEN
        </div>
        <h1 style={{ fontSize: 'clamp(18px,4vw,28px)', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: '0 0 12px' }}>
          Anti-greed Solana infrastructure.
        </h1>
        <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, maxWidth: 520, margin: '0 0 20px' }}>
          Real-time screener. Multichain NFT market. Anti-rug launchpad. OTC desk.
          Yield finder. Bridge. Privacy router. Token creator.{' '}
          <strong style={{ color: '#fff' }}>Everything DeFi needs. Nothing CEXs want you to have.</strong>
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => onNav?.('screener')}
            style={{ background: '#e8206a', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            🔍 SCREENER
          </button>
          <button onClick={() => onNav?.('terminal')}
            style={{ background: '#111', border: '1px solid #e8206a', color: '#e8206a', padding: '10px 20px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            ⚡ SWAP
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 1, borderBottom: '1px solid #1a1a1a', background: '#111' }}>
        {[
          { v: '$3.9B+', l: 'TRACKED' },
          { v: '12', l: 'CLOWNS EXPOSED 🤡' },
          { v: '30+', l: 'TOOLS' },
          { v: '3,333', l: 'NFT COLLECTION' },
        ].map(({ v, l }) => (
          <div key={l} style={{ background: '#0d0d0d', padding: '18px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#e8206a' }}>{v}</div>
            <div style={{ fontSize: 10, color: '#666', letterSpacing: 1.5, marginTop: 4, textTransform: 'uppercase' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* NFT Countdown */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase' }}>YAKKS NFT DROP · 3,333 PIECES</div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>Drop: Apr 20 2026 · 33.3% paperhands tax mechanic</div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          {[['DAYS', nftDays.d], ['HRS', nftDays.h], ['MIN', nftDays.m], ['SEC', nftDays.s]].map(([l, v]) => (
            <div key={l} style={{ textAlign: 'center', minWidth: 40 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
              <div style={{ fontSize: 9, color: '#555', letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ width: '100%' }}>
          <div style={{ height: 4, background: '#1a1a1a', borderRadius: 2 }}>
            <div style={{ height: 4, width: '38%', background: '#e8206a', borderRadius: 2 }} />
          </div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>38% PROGRESS</div>
        </div>
      </div>

      {/* Live Badges */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: '🤖 YAKK AI TRADER', status: 'LIVE', col: '#00c896' },
          { label: '🎮 PREDICTION MARKETS', status: 'LIVE', col: '#00c896' },
          { label: '📊 DEXSCREENER CHARTS', status: 'FIXED', col: '#e8c440' },
          { label: '🔍 CABAL SCANNER', status: 'V2', col: '#e8206a' },
        ].map(({ label, status, col }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', border: '1px solid #1a1a1a', borderRadius: 20, padding: '5px 12px', fontSize: 11 }}>
            <span style={{ color: '#ccc' }}>{label}</span>
            <span style={{ color: col, fontWeight: 700, fontSize: 10 }}>→ {status}</span>
          </div>
        ))}
      </div>

      {/* YAKKAI PEP */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a', padding: '16px 20px' }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>DAILY YAKKAI PEP</div>
        <p style={{ fontSize: 13, color: '#ccc', fontStyle: 'italic', margin: '0 0 10px', lineHeight: 1.5 }}>"{pep}"</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={newPep}
            style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}>
            ↻ NEW PEP
          </button>
          <button onClick={() => onNav?.('coach')}
            style={{ background: 'none', border: 'none', color: '#e8206a', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
            YAKKAI →
          </button>
        </div>
      </div>

      {/* YAKK vs The Rest */}
      <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>YAKK VS THE REST</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr>
                {['FEATURE', 'DEXSCR', 'BIRDEYE', 'YAKK'].map((h, i) => (
                  <th key={h} style={{
                    padding: '8px 10px', textAlign: i === 0 ? 'left' : 'center',
                    color: i === 3 ? '#e8206a' : '#555', fontWeight: 700,
                    fontSize: 10, letterSpacing: 1, borderBottom: '1px solid #1a1a1a'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(({ name, dex, bird }) => (
                <tr key={name} style={{ borderBottom: '1px solid #0f0f0f' }}>
                  <td style={{ padding: '8px 10px', color: '#ccc', fontSize: 12 }}>{name}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#444' }}>{dex ? '✓' : '✗'}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#444' }}>{bird ? '✓' : '✗'}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', color: '#00c896', fontWeight: 700 }}>✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 11, color: '#555', margin: '12px 0 16px', fontStyle: 'italic' }}>
          your wallet is your account — no email, no KYC, no extraction
        </p>
      </div>

      {/* Tokenomics */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ fontSize: 11, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>$YST TOKENOMICS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8, marginBottom: 14 }}>
          {[
            { pct: '2%', label: 'tax → treasury', icon: '🏛️' },
            { pct: '2%', label: 'tax → $YST stakers', icon: '💰' },
            { pct: '1%', label: 'tax → burn', icon: '🔥' },
            { pct: '20%', label: 'dev fee locked', icon: '🔒' },
          ].map(({ pct, label, icon }) => (
            <div key={label} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 6, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#e8206a', margin: '4px 0 2px' }}>{pct}</div>
              <div style={{ fontSize: 10, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onNav?.('whitepaper')}
          style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
          VIEW FULL TOKENOMICS →
        </button>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#555', marginBottom: 4 }}>The empire is building. The mountain delivers.</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#e8206a', letterSpacing: 3 }}>GET YAKKED.</div>
      </div>

    </section>
  );
}
