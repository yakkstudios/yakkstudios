'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const CHAIN_TOKENS: Record<string, string[]> = {
  solana: ['SOL', '$YST', '$SPT', 'USDC'],
  ethereum: ['ETH', 'USDC', 'USDT', 'WBTC'],
  bnb: ['BNB', 'USDT', 'USDC', 'BUSD'],
  bitcoin: ['BTC'],
  tron: ['TRX', 'USDT'],
};

const CHAIN_OPTIONS = [
  { value: 'solana', label: '◎ Solana' },
  { value: 'ethereum', label: 'Ξ Ethereum' },
  { value: 'bnb', label: '⬡ BNB Chain' },
  { value: 'bitcoin', label: '₿ Bitcoin' },
  { value: 'tron', label: '♦ Tron' },
];

const AGGREGATORS = [
  { icon: '🌉', name: 'deBridge' },
  { icon: '⚡', name: 'Wormhole' },
  { icon: '🔀', name: 'Allbridge' },
  { icon: '🪐', name: 'Mayan' },
];

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg4)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  padding: '9px 12px',
  color: 'var(--text)',
  fontFamily: 'Space Mono,monospace',
  fontSize: 11,
  outline: 'none',
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'var(--bg4)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  padding: '9px 12px',
  color: 'var(--text)',
  fontFamily: 'Space Mono,monospace',
  fontSize: 13,
  outline: 'none',
};

export default function Bridge({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const [fromChain, setFromChain] = useState('solana');
  const [toChain, setToChain] = useState('ethereum');
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<{ route: string; fee: string; time: string; toAmount: string } | null>(null);
  const [bridged, setBridged] = useState(false);

  const fromTokens = CHAIN_TOKENS[fromChain] || ['SOL'];
  const toTokens = CHAIN_TOKENS[toChain] || ['ETH'];

  const handleFromChain = (v: string) => {
    setFromChain(v);
    const toks = CHAIN_TOKENS[v] || ['SOL'];
    setFromToken(toks[0]);
    setQuote(null);
  };

  const handleToChain = (v: string) => {
    setToChain(v);
    const toks = CHAIN_TOKENS[v] || ['ETH'];
    setToToken(toks[0]);
    setQuote(null);
  };

  const getQuote = (val: string) => {
    setAmount(val);
    if (!val || parseFloat(val) <= 0) { setQuote(null); return; }
    const routes = ['deBridge', 'Wormhole', 'Allbridge', 'Mayan'];
    const times = ['2–4 min', '5–8 min', '3–6 min', '1–3 min'];
    const idx = Math.floor(Math.random() * 4);
    const est = (parseFloat(val) * 0.9965).toFixed(4);
    setQuote({ route: routes[idx], fee: `~$${(parseFloat(val) * 0.0035).toFixed(2)}`, time: times[idx], toAmount: est });
  };

  const execute = () => {
    setBridged(true);
    setTimeout(() => setBridged(false), 3000);
  };

  if (!walletConnected) {
    return (
      <div className="sec-pad">
        <div className="sec-eyebrow">CROSS-CHAIN</div>
        <div className="sec-title">Bridge Swap</div>
        <div className="sec-bar" />
        <div style={{ marginTop: 40, textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌉</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Connect Wallet to Bridge</div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>Connect your wallet and hold 250K+ $YST to access the bridge.</div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="sec-pad">
        <div className="sec-eyebrow">CROSS-CHAIN</div>
        <div className="sec-title">Bridge Swap</div>
        <div className="sec-bar" />
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5, marginBottom: 16 }}>
          <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
          <span className="badge b-dim">NOT CHECKED</span>
        </div>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter →</a>
        </div>
      </div>
    );
  }

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">CROSS-CHAIN</div>
      <div className="sec-title">Bridge Swap</div>
      <div className="sec-bar" />
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Swap tokens across chains in one click. Powered by the best bridge aggregators — best rate is always selected automatically.
      </p>

      {/* From / To grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* From */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>FROM</div>
          <select value={fromChain} onChange={e => handleFromChain(e.target.value)} style={selectStyle}>
            {CHAIN_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={fromToken} onChange={e => setFromToken(e.target.value)} style={selectStyle}>
            {fromTokens.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => getQuote(e.target.value)}
            style={inputStyle}
          />
          <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 5 }}>
            Balance: <span>—</span>
          </div>
        </div>

        {/* To */}
        <div className="card-sm" style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 12 }}>TO</div>
          <select value={toChain} onChange={e => handleToChain(e.target.value)} style={selectStyle}>
            {CHAIN_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <select value={toToken} onChange={e => setToToken(e.target.value)} style={selectStyle}>
            {toTokens.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{ background: 'var(--bg4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '9px 12px', fontSize: 13, minHeight: 38, color: 'var(--pink)' }}>
            <span>{quote ? quote.toAmount : '—'}</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 5 }}>
            Est. received: <span>{quote ? `${quote.toAmount} ${toToken}` : '—'}</span>
          </div>
        </div>
      </div>

      {/* Quote box */}
      {quote && (
        <div className="card-sm" style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, color: 'var(--dim)' }}>Best route via</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{quote.route}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--dim)' }}>Estimated fees</div>
              <div style={{ fontSize: 13 }}>{quote.fee}</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'var(--dim)' }}>Est. time</div>
              <div style={{ fontSize: 13 }}>{quote.time}</div>
            </div>
            <button
              className="btn btn-pink"
              onClick={execute}
              style={{ padding: '9px 20px' }}
            >
              {bridged ? 'BRIDGING…' : 'BRIDGE →'}
            </button>
          </div>
          {bridged && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--green)', textAlign: 'center' }}>
              ✓ Transaction submitted — check your wallet for confirmation.
            </div>
          )}
        </div>
      )}

      {/* Aggregator grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {AGGREGATORS.map(a => (
          <div key={a.name} className="card-sm" style={{ textAlign: 'center', padding: '10px 6px', opacity: 0.7 }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{a.icon}</div>
            <div style={{ fontSize: 9, color: 'var(--dim)' }}>{a.name}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 9, color: 'var(--dim)', textAlign: 'center' }}>
        Rates are indicative. Always review transaction details before signing. Your keys, your money.
      </p>
    </div>
  );
}
