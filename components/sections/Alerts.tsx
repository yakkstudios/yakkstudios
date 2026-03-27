'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Alerts({ walletConnected, ystBalance, onNavigate }: Props) {
  const [alerts, setAlerts] = useState([
    { token: '$YST', target: '$0.0000025', dir: 'above', active: true },
    { token: '$SOL', target: '$200', dir: 'above', active: true },
    { token: '$BONK', target: '$0.0000180', dir: 'below', active: false },
  ]);
  const [tok, setTok] = useState('');
  const [price, setPrice] = useState('');
  const [dir, setDir] = useState('above');

  const add = () => {
    if (!tok || !price) return;
    setAlerts(a => [...a, { token: tok.startsWith('$') ? tok : '$' + tok, target: '$' + price, dir, active: true }]);
    setTok(''); setPrice('');
  };

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--gold),var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ð PRICE ALERTS</div>
          <span className="badge b-green">FREE</span>
        </div>
        <div className="sec-sub">Set price alerts for any Solana token. Get notified when targets are hit.</div>
      </div>

      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px', marginBottom: 20 }}>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 12 }}>+ CREATE ALERT</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label className="field-lbl" style={{ marginTop: 0 }}>TOKEN</label>
            <input className="field-inp" placeholder="$YST" value={tok} onChange={e => setTok(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: 100 }}>
            <label className="field-lbl" style={{ marginTop: 0 }}>TARGET PRICE</label>
            <input className="field-inp" placeholder="0.0000025" value={price} onChange={e => setPrice(e.target.value)} />
          </div>
          <div>
            <label className="field-lbl" style={{ marginTop: 0 }}>DIRECTION</label>
            <select className="field-sel" value={dir} onChange={e => setDir(e.target.value)} style={{ width: 'auto' }}>
              <option value="above">Above â</option>
              <option value="below">Below â</option>
            </select>
          </div>
          <button className="btn btn-gold" onClick={add}>Set Alert</button>
        </div>
      </div>

      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>
        ACTIVE ALERTS ({alerts.filter(a => a.active).length})
      </div>

      {alerts.map((a, i) => (
        <div key={i} className="lb-row" style={{ marginBottom: 6, opacity: a.active ? 1 : 0.5 }}>
          <span className="td-tok" style={{ minWidth: 60 }}>{a.token}</span>
          <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: a.dir === 'above' ? 'var(--green)' : 'var(--red)', marginRight: 8 }}>
            {a.dir === 'above' ? 'â ABOVE' : 'â BELOW'}
          </span>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, flex: 1 }}>{a.target}</span>
          <span className={`badge ${a.active ? 'b-green' : 'b-dim'}`}>{a.active ? 'ACTIVE' : 'PAUSED'}</span>
          <button style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', marginLeft: 10, fontSize: 14 }} onClick={() => setAlerts(al => al.filter((_, j) => j !== i))}>â</button>
        </div>
      ))}

      {!walletConnected && (
        <div style={{ marginTop: 20, background: 'rgba(247,201,72,0.04)', border: '1px solid rgba(247,201,72,0.15)', borderRadius: 8, padding: '12px 16px', fontSize: 12, color: 'var(--muted)' }}>
          ð¡ Connect your wallet to sync alerts across devices and receive Telegram notifications.
        </div>
      )}

      <div style={{ marginTop: 16, fontSize: 10, color: 'var(--dim)', fontFamily: 'Space Mono,monospace' }}>
        â¡ Push notifications via Telegram bot coming soon â link your TG in Settings.
      </div>
    </div>
  );
}
