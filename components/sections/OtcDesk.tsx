'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const LISTINGS = [
  { id: 1, type: 'SELL', asset: '$YST', amount: '2,000,000', price: '0.000042 SOL', value: '84 SOL', seller: '7P7x...NMMb', badge: 'b-red', badgeText: 'SELL' },
  { id: 2, type: 'BUY', asset: '$YST', amount: '500,000', price: '0.000045 SOL', value: '22.5 SOL', seller: '8Aiy...QLc', badge: 'b-green', badgeText: 'BUY' },
  { id: 3, type: 'SELL', asset: 'YAKK Genesis NFT', amount: '1 NFT', price: '10 SOL', value: '10 SOL', seller: 'Anon...xyz', badge: 'b-red', badgeText: 'SELL' },
  { id: 4, type: 'BUY', asset: '$YST', amount: '1,000,000', price: '0.000040 SOL', value: '40 SOL', seller: 'Fg6P...k8z', badge: 'b-green', badgeText: 'BUY' },
];

export default function OtcDesk({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [offerType, setOfferType] = useState<'buy' | 'sell'>('sell');
  const [asset, setAsset] = useState('$YST');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--green),var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🤝 OTC DESK</div>
          <span className="badge b-blue">P2P</span>
        </div>
        <div className="sec-sub">Peer-to-peer OTC trades for large $YST positions. No slippage. Holder-to-holder.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Required</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>OTC Desk — Holders Only</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Connect your wallet to post and view OTC listings.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter →</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 11, color: 'var(--muted)' }}>
            ⚠️ OTC trades are peer-to-peer and not escrow-protected by default. Always verify counterparty identity. YAKK Studios is not liable for OTC disputes.
          </div>

          <div className="grid4" style={{ marginBottom: 20 }}>
            {[
              { l: 'ACTIVE LISTINGS', v: '4', c: 'var(--blue)' },
              { l: 'TOTAL VOLUME', v: '156.5 SOL', c: 'var(--gold)' },
              { l: 'BUY ORDERS', v: '2', c: 'var(--green)' },
              { l: 'SELL ORDERS', v: '2', c: 'var(--red)' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="slbl">{s.l}</div>
                <div className="sval" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>ACTIVE LISTINGS</div>
          {LISTINGS.map(listing => (
            <div key={listing.id} className="lb-row" style={{ marginBottom: 10, alignItems: 'flex-start', padding: '14px 16px' }}>
              <span className={`badge ${listing.badge}`} style={{ marginRight: 8, minWidth: 40, textAlign: 'center' }}>{listing.badgeText}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{listing.amount} {listing.asset}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>@ {listing.price} each · {listing.seller}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 12 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{listing.value}</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>TOTAL</div>
              </div>
              <button className="btn btn-outline" style={{ fontSize: 10, padding: '4px 12px' }}>Contact</button>
            </div>
          ))}

          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px', marginTop: 20 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 16 }}>+ POST OTC LISTING</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {(['sell', 'buy'] as const).map(t => (
                <button key={t} className={`mode-pill ${offerType === t ? 'active' : ''}`} onClick={() => setOfferType(t)}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>ASSET</div>
                <select className="field-inp" value={asset} onChange={e => setAsset(e.target.value)} style={{ width: '100%' }}>
                  <option>$YST</option>
                  <option>YAKK Genesis NFT</option>
                  <option>SOL</option>
                </select>
              </div>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>AMOUNT</div>
                <input className="field-inp" placeholder="e.g. 500000" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>PRICE (SOL per unit)</div>
                <input className="field-inp" placeholder="e.g. 0.000042" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>TOTAL VALUE</div>
                <div className="field-inp" style={{ color: 'var(--muted)' }}>
                  {amount && price ? (parseFloat(amount.replace(/,/g, '')) * parseFloat(price)).toFixed(4) + ' SOL' : '—'}
                </div>
              </div>
            </div>
            <button className="btn btn-green" style={{ fontSize: 11 }}>Post Listing</button>
          </div>
        </div>
      )}
    </div>
  );
}
