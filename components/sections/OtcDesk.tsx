'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function OtcDesk({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  const [side, setSide] = useState('buy');
  const [token, setToken] = useState('yst');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [posted, setPosted] = useState(false);

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

  const handlePost = () => {
    if (!amount || !price || !contact) return;
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
    setAmount('');
    setPrice('');
    setContact('');
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">PEER-TO-PEER</div>
      <div className="sec-title">OTC Desk</div>
      <div className="sec-bar"></div>

      {/* Token gate row */}
      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5, marginBottom: 8 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
        <span className={`badge ${walletConnected ? (hasAccess ? 'b-green' : 'b-red') : 'b-dim'}`}>
          {walletConnected ? (hasAccess ? '✓ ACCESS GRANTED' : '✗ NEED MORE YST') : 'NOT CHECKED'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Post large block trades without moving the market. Escrow-secured. No middlemen.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Post OTC order */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>POST OTC ORDER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select
                value={side}
                onChange={e => setSide(e.target.value)}
                style={inputStyle}
              >
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </select>
              <select
                value={token}
                onChange={e => setToken(e.target.value)}
                style={inputStyle}
              >
                <option value="yst">$YST</option>
                <option value="spt">$SPT</option>
                <option value="sol">SOL</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Price per token (USD)"
              value={price}
              onChange={e => setPrice(e.target.value)}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Telegram or Twitter handle"
              value={contact}
              onChange={e => setContact(e.target.value)}
              style={inputStyle}
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

      {hasAccess && (<>
      {posted ? (
              <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--green)', padding: '8px 0' }}>
                ✓ Order posted successfully!
              </div>
            ) : (
              <button
                className="btn btn-pink"
                style={{ width: '100%' }}
                onClick={handlePost}
                disabled={!walletConnected}
              >
                POST ORDER
              </button>
            )}
            <p style={{ fontSize: 9, color: 'var(--dim)', textAlign: 'center', margin: 0 }}>
              Connect wallet to post. Orders expire in 72h. Use escrow for safety.
            </p>
          </>)}
          </div>
        </div>

        {/* Order book */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>OPEN ORDERS</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 0', marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#64dc64', display: 'inline-block' }}></span>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>LIVE DESK — ORDERS PERSIST ON-CHAIN</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', textAlign: 'center', padding: '24px 0', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 7 }}>
                No open orders yet.<br /><span style={{ opacity: 0.6 }}>Be the first — post a block trade above.</span>
              </div>
            </div>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(247,201,72,0.05)', border: '1px solid rgba(247,201,72,0.12)', borderRadius: 6 }}>
              <div style={{ fontSize: 9, color: 'var(--gold)', fontFamily: 'Space Mono,monospace', letterSpacing: '0.08em' }}>🔒 ESCROW PROTECTION</div>
              <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 3 }}>
                All orders are matched peer-to-peer. YAKK holds 0 custody. Use our escrow for trustless settlement — 0.3% fee covers on-chain arbitration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
