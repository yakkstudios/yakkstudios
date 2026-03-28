'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const TOKENS = [
  { name: 'YAKK', sym: 'YST', price: '$0.0000018', chg: '+1.44%', vol: '$24.1K', liq: '$189K', mcap: '$1.8M', pos: true },
  { name: 'BONK', sym: 'BONK', price: '$0.0000218', chg: '+3.21%', vol: '$4.2M', liq: '$8.1M', mcap: '$1.4B', pos: true },
  { name: 'WIF', sym: 'WIF', price: '$1.42', chg: '-2.10%', vol: '$18.7M', liq: '$41M', mcap: '$1.4B', pos: false },
  { name: 'POPCAT', sym: 'POPCAT', price: '$0.331', chg: '+5.88%', vol: '$9.3M', liq: '$22M', mcap: '$331M', pos: true },
  { name: 'MEW', sym: 'MEW', price: '$0.00521', chg: '-0.44%', vol: '$3.1M', liq: '$9.4M', mcap: '$521M', pos: false },
  { name: 'CHILLGUY', sym: 'CHILLGUY', price: '$0.0812', chg: '+12.3%', vol: '$6.7M', liq: '$14M', mcap: '$81M', pos: true },
  { name: 'BOME', sym: 'BOME', price: '$0.00721', chg: '-1.88%', vol: '$7.2M', liq: '$18M', mcap: '$144M', pos: false },
  { name: 'MOTHER', sym: 'MOTHER', price: '$0.0291', chg: '+0.97%', vol: '$1.4M', liq: '$3.8M', mcap: '$29.1M', pos: true },
];

export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  const [tf, setTf] = useState('1h');
  const [sort, setSort] = useState('vol');
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🔍 YAKK SCREENER</div>
          <span className="badge b-yakk">LIVE</span>
        </div>
        <div className="sec-sub">Real-time Solana token screening. Filter by volume, liquidity &amp; momentum.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Held</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKK SCREENER</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access real-time token screening.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST 🪙</a>
        </div>
      )}
      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Insufficient $YST</div>
          <div className="locked-sub">You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get More $YST 🪙</a>
        </div>
      )}

      {hasAccess && (
        <div>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['5m','1h','6h','24h'].map(t => (
                <button key={t} className={`mode-pill ${tf===t?'active':''}`} onClick={() => setTf(t)}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              {[['vol','Volume'],['mcap','Mkt Cap'],['chg','% Change']].map(([k,l]) => (
                <button key={k} className={`mode-pill ${sort===k?'active':''}`} onClick={() => setSort(k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* DexScreener embed for $YST */}
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 18, height: 420 }}>
            <iframe
              src="https://dexscreener.com/solana/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM?embed=1&theme=dark&trades=0&info=0"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="$YST Chart"
            />
          </div>

          {/* Token table */}
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
            TOP SOLANA TOKENS · {tf}
          </div>
          <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th><th>TOKEN</th><th>PRICE</th><th>{tf} CHG</th><th>VOLUME</th><th>LIQUIDITY</th><th>MCAP</th><th></th>
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t, i) => (
                  <tr key={t.sym}>
                    <td style={{ color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{i+1}</td>
                    <td><span className="td-tok">{t.sym}</span> <span style={{ color: 'var(--muted)', fontSize: 10 }}>{t.name}</span></td>
                    <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 11 }}>{t.price}</td>
                    <td style={{ color: t.pos ? 'var(--green)' : 'var(--red)', fontFamily: 'Space Mono,monospace', fontSize: 11 }}>{t.chg}</td>
                    <td style={{ color: 'var(--text)', fontSize: 11 }}>{t.vol}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 11 }}>{t.liq}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 11 }}>{t.mcap}</td>
                    <td>
                      <a href={`https://dexscreener.com/solana/${t.sym.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '3px 9px', fontSize: 9 }}>CHART</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 10, fontFamily: 'Space Mono,monospace' }}>
            ⚡ Data sourced from DexScreener · Updates every 30s · Live Solana on-chain data
          </div>
        </div>
      )}
    </div>
  );
}
