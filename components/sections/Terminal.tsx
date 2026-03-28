'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Terminal({ walletConnected, ystBalance, onNavigate }: Props) {
  const [tab, setTab] = useState<'chart'|'swap'>('chart');
  const hasAccess = walletConnected && ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--pink),var(--blue))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">⚡ YAKK TERMINAL</div>
          <span className="badge b-blue">BETA</span>
        </div>
        <div className="sec-sub">Advanced on-chain trading terminal. Charts, swaps &amp; analytics — all in one place.</div>
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
          <div className="locked-title">YAKK TERMINAL</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access the trading terminal.</div>
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
          <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
            <button className={`mode-pill ${tab==='chart'?'active':''}`} onClick={() => setTab('chart')}>📊 Chart</button>
            <button className={`mode-pill ${tab==='swap'?'active':''}`} onClick={() => setTab('swap')}>🔄 Swap</button>
          </div>

          {tab === 'chart' && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', height: 520 }}>
              <iframe
                src="https://dexscreener.com/solana/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM?embed=1&theme=dark&trades=1&info=1"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="YAKK Terminal Chart"
              />
            </div>
          )}

          {tab === 'swap' && (
            <div style={{ maxWidth: 480 }}>
              <div className="warn-bar">⚡ Powered by Jupiter Aggregator — best prices across all Solana DEXs</div>
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', height: 500 }}>
                <iframe
                  src="https://jup.ag/swap/SOL-YST?inAmount=1&referralAccount=7P7xYDAyeV13vumm8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB&referralName=YakkStudios"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Jupiter Swap"
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <a href="https://dexscreener.com/solana/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer" className="btn btn-outline">DexScreener ↗</a>
            <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Jupiter ↗</a>
            <a href="https://birdeye.so/token/jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Birdeye ↗</a>
          </div>
        </div>
      )}
    </div>
  );
}
