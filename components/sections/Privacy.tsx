'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const hasAccess = (walletConnected: boolean, ystBalance: number) => walletConnected && ystBalance >= 250_000;

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--bg4)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  padding: '8px 12px',
  color: 'var(--text)',
  fontFamily: 'Space Mono,monospace',
  fontSize: 10,
  outline: 'none',
};

const FEATURE_CARDS = [
  {
    icon: '🕵️',
    title: 'Anti Copy-Trade',
    desc: 'Route through intermediate wallets so MEV bots and copy-traders can\'t front-run your moves',
  },
  {
    icon: '🔗',
    title: 'Wallet Unlinking',
    desc: 'Send funds between your own wallets without creating an obvious on-chain link',
  },
  {
    icon: '🛡️',
    title: 'MEV Protection',
    desc: 'Randomise timing and split orders to defeat sandwich attacks and MEV extraction',
  },
];

const HOW_IT_WORKS = [
  { num: '1', color: 'var(--pink)', text: 'You sign a single transaction — YAKK handles the rest on-chain, splitting across hop wallets' },
  { num: '2', color: 'var(--pink)', text: 'Funds flow through 2–5 intermediate wallets with randomised amounts and timing' },
  { num: '3', color: 'var(--pink)', text: 'Destination receives the full amount — no CEX, no KYC, no trace back to source wallet' },
  { num: '✓', color: 'var(--gold)', text: 'Works across Solana wallets today. Cross-chain routing coming with bridge integration.' },
];

export default function Privacy({ walletConnected, ystBalance, onNavigate }: Props) {
  const access = hasAccess(walletConnected, ystBalance);

  const [fromWallet, setFromWallet] = useState('');
  const [toWallet, setToWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [hops, setHops] = useState('3');
  const [timing, setTiming] = useState('instant');
  const [routed, setRouted] = useState(false);

  const route = () => {
    if (!walletConnected) return;
    setRouted(true);
    setTimeout(() => setRouted(false), 3000);
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">STEALTH MODE</div>
      <div className="sec-title">Privacy Router</div>
      <div className="sec-bar" />

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
        <span className={`badge ${access ? 'b-green' : 'b-dim'}`}>
          {access ? '✓ VERIFIED' : 'NOT CHECKED'}
        </span>
      </div>

      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Break the on-chain link between your wallets. Stop copy-traders, front-runners and blockchain stalkers cold.
      </p>

      {/* Feature overview cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
        {FEATURE_CARDS.map(c => (
          <div key={c.title} className="card-sm" style={{ textAlign: 'center', padding: '16px 10px' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{c.title}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Route builder + How it works */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Route builder */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>PRIVATE TRANSFER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            <div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>FROM WALLET</div>
              <input type="text" placeholder="Source wallet address" value={fromWallet} onChange={e => setFromWallet(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>TO WALLET</div>
              <input type="text" placeholder="Destination wallet address" value={toWallet} onChange={e => setToWallet(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>AMOUNT (SOL)</div>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ ...inputStyle, fontSize: 13 }}
              />
            </div>

            <select value={hops} onChange={e => setHops(e.target.value)} style={{ ...inputStyle, padding: '8px 12px', fontSize: 11 }}>
              <option value="2">2 hops (fast)</option>
              <option value="3">3 hops (balanced)</option>
              <option value="5">5 hops (stealth)</option>
            </select>

            <select value={timing} onChange={e => setTiming(e.target.value)} style={{ ...inputStyle, padding: '8px 12px', fontSize: 11 }}>
              <option value="instant">Instant</option>
              <option value="random">Random delay (1–12h)</option>
              <option value="scheduled">Scheduled time</option>
            </select>

            <button
              className="btn btn-pink"
              onClick={route}
              style={{ width: '100%' }}
              disabled={!walletConnected || !access}
            >
              {routed ? '✓ ROUTING…' : 'ROUTE TRANSFER'}
            </button>

            {routed && (
              <div style={{ fontSize: 10, color: 'var(--green)', textAlign: 'center' }}>
                ✓ Route initiated. Funds will arrive at destination via {hops} hops.
              </div>
            )}

            <p style={{ fontSize: 9, color: 'var(--dim)', textAlign: 'center', margin: 0 }}>
              Connect wallet to use. Small routing fee applies.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>HOW IT WORKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: step.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 11 }}>{step.text}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 10, background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 7, fontSize: 10, color: 'var(--gold)' }}>
            ⚠️ Privacy Router is a legitimate financial privacy tool. Use responsibly and in accordance with local laws.
          </div>
        </div>

      </div>
    </div>
  );
}
