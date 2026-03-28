'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const NFTS = [
  { name: 'YAKK Genesis #001', col: 'YAKK Genesis', price: '12 SOL', rarity: 'LEGENDARY', img: '🦅', badge: 'b-gold' },
  { name: 'YAKK Genesis #007', col: 'YAKK Genesis', price: '8.5 SOL', rarity: 'RARE', img: '🦅', badge: 'b-blue' },
  { name: 'Clown Card #042', col: 'Certified Clowns', price: '3.2 SOL', rarity: 'UNCOMMON', img: '🤡', badge: 'b-yakk' },
  { name: 'Whale Badge #001', col: 'Whale Club', price: '45 SOL', rarity: 'LEGENDARY', img: '🐋', badge: 'b-gold' },
  { name: 'YAKK Studios Pass', col: 'Access Passes', price: '2.1 SOL', rarity: 'COMMON', img: '🎫', badge: 'b-dim' },
  { name: 'Raid Trophy #12', col: 'Raid Trophies', price: '1.4 SOL', rarity: 'COMMON', img: '⚔️', badge: 'b-dim' },
];

export default function NftMarket({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,#a855f7,var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🖼️ NFT MARKET</div>
          <span className="badge b-blue">BETA</span>
        </div>
        <div className="sec-sub">Browse &amp; trade YAKK ecosystem NFTs. Floor prices live via Magic Eden &amp; Tensor.</div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['COLLECTIONS', '6', 'var(--blue)'], ['FLOOR', '1.4 SOL', 'var(--green)'], ['VOLUME 24H', '48.2 SOL', 'var(--gold)']].map(([l, v, c]) => (
          <div key={l as string} className="stat-card" style={{ flex: 1 }}>
            <div className="slbl">{l}</div>
            <div className="sval" style={{ color: c as string, fontSize: 16 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['ALL', 'YAKK GENESIS', 'PASSES', 'CLOWN CARDS', 'WHALE CLUB'].map(f => (
          <button key={f} className="mode-pill" style={{ fontSize: 9 }}>{f}</button>
        ))}
      </div>

      <div className="grid3">
        {NFTS.map(n => (
          <div key={n.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s' }}>
            <div style={{ height: 120, background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, borderBottom: '1px solid var(--border)' }}>
              {n.img}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{n.name}</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)', marginBottom: 8 }}>{n.col}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, color: 'var(--green)' }}>{n.price}</span>
                <span className={`badge ${n.badge}`}>{n.rarity}</span>
              </div>
              <button className="btn btn-outline" style={{ width: '100%', marginTop: 8, fontSize: 10, justifyContent: 'center' }}>View NFT</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <a href="https://magiceden.io/marketplace/yakk" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Magic Eden ↗</a>
        <a href="https://tensor.trade" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Tensor ↗</a>
      </div>
    </div>
  );
}
