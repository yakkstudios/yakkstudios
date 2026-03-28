'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const ITEMS = [
  { title: 'Mobile app (iOS + Android)', votes: 284, status: 'IN PROGRESS', badge: 'b-blue' },
  { title: 'Telegram notification integration', votes: 197, status: 'PLANNED', badge: 'b-gold' },
  { title: 'Multi-wallet portfolio tracking', votes: 156, status: 'PLANNED', badge: 'b-gold' },
  { title: 'AI-powered rug pull detector', votes: 142, status: 'REVIEWING', badge: 'b-yakk' },
  { title: 'Cross-chain support (ETH, Base)', votes: 138, status: 'RESEARCHING', badge: 'b-dim' },
  { title: 'Revenue share dashboard', votes: 124, status: 'IN PROGRESS', badge: 'b-blue' },
  { title: 'Dark/Light mode toggle', votes: 89, status: 'PLANNED', badge: 'b-gold' },
  { title: 'On-chain copy trading', votes: 76, status: 'REVIEWING', badge: 'b-yakk' },
];

export default function Features({ walletConnected, ystBalance, onNavigate }: Props) {
  const [voted, setVoted] = useState<number[]>([]);
  const [items, setItems] = useState(ITEMS);
  const [title, setTitle] = useState('');

  const vote = (i: number) => {
    if (voted.includes(i) || !walletConnected) return;
    setVoted(v => [...v, i]);
    setItems(it => it.map((x, j) => j === i ? { ...x, votes: x.votes + 1 } : x));
  };

  const submit = () => {
    if (!title.trim() || !walletConnected) return;
    setItems(it => [...it, { title, votes: 1, status: 'NEW', badge: 'b-green' }]);
    setTitle('');
  };

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">💡 FEATURE REQUESTS</div>
          <span className="badge b-green">PUBLIC</span>
        </div>
        <div className="sec-sub">Vote on features you want. Top-voted features get prioritized by the dev team.</div>
      </div>

      {walletConnected && (
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 10 }}>+ SUGGEST A FEATURE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="field-inp" placeholder="Describe the feature you want..." value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} style={{ flex: 1 }} />
            <button className="btn btn-pink" onClick={submit}>Submit</button>
          </div>
        </div>
      )}

      {items.sort((a, b) => b.votes - a.votes).map((item, i) => (
        <div key={i} className="lb-row" style={{ marginBottom: 8, alignItems: 'flex-start' }}>
          <div style={{ background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', textAlign: 'center', minWidth: 48, marginRight: 4 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: 'var(--pink)' }}>{item.votes}</div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 7, color: 'var(--dim)' }}>VOTES</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{item.title}</div>
            <span className={`badge ${item.badge}`}>{item.status}</span>
          </div>
          <button
            className={`btn ${voted.includes(i) ? 'btn-green' : 'btn-outline'}`}
            style={{ fontSize: 10, padding: '4px 12px' }}
            onClick={() => vote(i)}
            disabled={!walletConnected || voted.includes(i)}
          >
            {voted.includes(i) ? '✓ Voted' : '▲ Vote'}
          </button>
        </div>
      ))}

      {!walletConnected && (
        <div style={{ textAlign: 'center', marginTop: 16, color: 'var(--muted)', fontSize: 12, fontFamily: 'Space Mono,monospace' }}>
          Connect wallet to vote &amp; submit features
        </div>
      )}
    </div>
  );
}
