'use client';
import { useState } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

const YAKK_TRUSTED = [
  {
    name: 'YAKK Studios Token', sym: 'YST',
    price: '$0.0000018', chg: '+1.44%', vol: '$24.1K',
    liq: '$189K', mcap: '$1.8M', pos: true,
    dex: 'https://dexscreener.com/solana/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM',
  },
  {
    name: 'StakePoint Token', sym: 'SPT',
    price: '$0.00000042', chg: '+0.88%', vol: '$3.2K',
    liq: '$41K', mcap: '$420K', pos: true,
    dex: 'https://dexscreener.com/solana/spt',
  },
];

const BLUECHIP = [
  {
    name: 'Solana', sym: 'SOL',
    price: '$142.30', chg: '+2.14%', vol: '$1.8B',
    liq: '$4.2B', mcap: '$68.4B', pos: true,
    dex: 'https://dexscreener.com/solana/so11111111111111111111111111111111111111112',
  },
];

function TokenTable({ tokens, label }: { tokens: typeof YAKK_TRUSTED; label: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 10,
        color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase',
        marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 3, height: 14, background: 'var(--pink)', display: 'inline-block', borderRadius: 2 }} />
        {label}
      </div>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>#</th>
              <th>TOKEN</th>
              <th>PRICE</th>
              <th>24H CHG</th>
              <th>VOLUME</th>
              <th>LIQUIDITY</th>
              <th>MCAP</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, i) => (
              <tr key={t.sym}>
                <td style={{ color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{i + 1}</td>
                <td>
                  <span className="td-tok">{t.sym}</span>{' '}
                  <span style={{ color: 'var(--muted)', fontSize: 10 }}>{t.name}</span>
                </td>
                <td style={{ fontFamily: 'Space Mono,monospace', fontSize: 11 }}>{t.price}</td>
                <td style={{ color: t.pos ? 'var(--green)' : 'var(--red)', fontFamily: 'Space Mono,monospace', fontSize: 11 }}>{t.chg}</td>
                <td style={{ color: 'var(--text)', fontSize: 11 }}>{t.vol}</td>
                <td style={{ color: 'var(--muted)', fontSize: 11 }}>{t.liq}</td>
                <td style={{ color: 'var(--muted)', fontSize: 11 }}>{t.mcap}</td>
                <td>
                  <a
                    href={t.dex}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '3px 9px', fontSize: 9 }}
                  >
                    CHART
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  const [tf, setTf] = useState('24h');
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🔍 YAKK SCREENER</div>
          <span className="badge b-yakk">LIVE</span>
        </div>
        <div className="sec-sub">Real-time Solana token screening. YAKK-curated trusted list &amp; blue-chip assets.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Held</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>
          }
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKK SCREENER</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>250,000+ $YST</strong> to access real-time token screening.
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST 🪙
          </a>
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Insufficient $YST</div>
          <div className="locked-sub">
            You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get More $YST 🪙
          </a>
        </div>
      )}

      {hasAccess && (
        <div>
          {/* Timeframe pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
            {['5m', '1h', '6h', '24h'].map(t => (
              <button key={t} className={`mode-pill ${tf === t ? 'active' : ''}`} onClick={() => setTf(t)}>{t}</button>
            ))}
          </div>

          {/* YST live chart embed */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 10,
              color: 'var(--muted)', letterSpacing: 1.4, textTransform: 'uppercase',
              marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ width: 3, height: 14, background: 'var(--pink)', display: 'inline-block', borderRadius: 2 }} />
              $YST LIVE CHART
            </div>
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', height: 380 }}>
              <iframe
                src="https://dexscreener.com/solana/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM?embed=1&theme=dark&trades=0&info=0"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="$YST Chart"
              />
            </div>
          </div>

          {/* YAKK Trusted List */}
          <TokenTable tokens={YAKK_TRUSTED} label="YAKK Trusted List" />

          {/* Blue Chip */}
          <TokenTable tokens={BLUECHIP} label="Blue Chip" />

          <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 4, fontFamily: 'Space Mono,monospace' }}>
            ⚡ YAKK-curated token list · Prices indicative · {tf} window
          </div>
        </div>
      )}
    </div>
  );
}
