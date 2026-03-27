'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const RAFFLES = [
  { id: 1, prize: 'YAKK Genesis NFT #001', ticketPrice: '100K YST', tickets: 42, maxTickets: 100, end: '24h 32m', img: 'ð¦', badge: 'b-gold' },
  { id: 2, prize: '500K $YST Airdrop', ticketPrice: '50K YST', tickets: 78, maxTickets: 200, end: '2d 14h', img: 'ðª', badge: 'b-yakk' },
  { id: 3, prize: 'Whale Club Lifetime Pass', ticketPrice: '250K YST', tickets: 12, maxTickets: 50, end: '5d 6h', img: 'ð', badge: 'b-blue' },
];

export default function Raffle({ walletConnected, ystBalance, onNavigate }: Props) {
  const [entered, setEntered] = useState<number[]>([]);

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--gold),var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ðï¸ NFT RAFFLE</div>
          <span className="badge b-gold">LIVE</span>
        </div>
        <div className="sec-sub">Enter NFT raffles &amp; win exclusive YAKK ecosystem prizes. Powered by $YST tokens.</div>
      </div>

      {RAFFLES.map(r => (
        <div key={r.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 48, background: 'var(--bg4)', borderRadius: 8, width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.img}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15 }}>{r.prize}</div>
                <span className={`badge ${r.badge}`}>PRIZE</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 10, flexWrap: 'wrap' }}>
                {[['TICKET PRICE', r.ticketPrice], ['ENTRIES', `${r.tickets}/${r.maxTickets}`], ['ENDS IN', r.end]].map(([l, v]) => (
                  <div key={l as string}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>{l}</div>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--text)' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="prog-bar" style={{ marginBottom: 10 }}>
                <div className="prog-fill" style={{ width: (r.tickets / r.maxTickets * 100) + '%' }} />
              </div>
              {entered.includes(r.id) ? (
                <span className="badge b-green" style={{ fontSize: 10, padding: '4px 10px' }}>â ENTERED</span>
              ) : (
                <button
                  className="btn btn-gold"
                  style={{ fontSize: 11 }}
                  onClick={() => walletConnected && setEntered(e => [...e, r.id])}
                  disabled={!walletConnected}
                >
                  {walletConnected ? 'ðï¸ Enter Raffle' : 'Connect Wallet to Enter'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {!walletConnected && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--muted)', fontSize: 12 }}>
          Connect your wallet to enter raffles and track your tickets.
        </div>
      )}
    </div>
  );
}
