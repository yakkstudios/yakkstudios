'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

interface Alert {
  token: string;
  target: string;
  dir: 'above' | 'below';
  active: boolean;
}

const DEFAULT_ALERTS: Alert[] = [];

export default function Alerts({ walletConnected, ystBalance, onNavigate }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const [alertToken, setAlertToken] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertDir, setAlertDir] = useState<'above' | 'below'>('above');
  const [notifPermission, setNotifPermission] = useState<boolean>(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted'
  );

  const alertRequestPermission = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission().then(perm => {
        setNotifPermission(perm !== 'granted');
      });
    }
  };

  const alertSet = () => {
    if (!alertToken.trim() || !alertPrice.trim()) return;
    const newAlert: Alert = {
      token: alertToken.trim().startsWith('$') ? alertToken.trim() : '$' + alertToken.trim(),
      target: '$' + alertPrice.trim(),
      dir: alertDir,
      active: true,
    };
    setAlerts(a => [...a, newAlert]);
    setAlertToken('');
    setAlertPrice('');
  };

  const removeAlert = (index: number) => {
    setAlerts(a => a.filter((_, i) => i !== index));
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">NOTIFICATIONS</div>
      <div className="sec-title">Price Alerts</div>
      <div className="sec-bar" />

      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Set price targets for any token and get browser notifications when they&apos;re hit.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Create Alert */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>CREATE ALERT</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Notification permission notice */}
            {notifPermission && (
              <div style={{ background: 'rgba(224,96,126,0.1)', border: '1px solid rgba(224,96,126,0.3)', borderRadius: 7, padding: 10, fontSize: 11 }}>
                🔔 Enable browser notifications to receive alerts even when the tab isn&apos;t focused.
                <button
                  onClick={alertRequestPermission}
                  style={{ display: 'block', marginTop: 8, width: '100%', background: 'var(--pink)', border: 'none', borderRadius: 5, color: '#fff', padding: 6, cursor: 'pointer', fontFamily: 'Space Mono,monospace', fontSize: 10 }}
                >
                  ENABLE NOTIFICATIONS
                </button>
              </div>
            )}

            <input
              type="text"
              id="alert-token"
              placeholder="Token address or symbol"
              value={alertToken}
              onChange={e => setAlertToken(e.target.value)}
              style={{ background: 'var(--bg4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 12px', color: 'var(--text)', fontFamily: 'Space Mono,monospace', fontSize: 11, outline: 'none' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <select
                id="alert-dir"
                value={alertDir}
                onChange={e => setAlertDir(e.target.value as 'above' | 'below')}
                style={{ background: 'var(--bg4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontFamily: 'Space Mono,monospace', fontSize: 11, outline: 'none' }}
              >
                <option value="above">Price above</option>
                <option value="below">Price below</option>
              </select>
              <input
                type="number"
                id="alert-price"
                placeholder="Target price $"
                value={alertPrice}
                onChange={e => setAlertPrice(e.target.value)}
                style={{ background: 'var(--bg4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '8px 10px', color: 'var(--text)', fontFamily: 'Space Mono,monospace', fontSize: 11, outline: 'none' }}
              />
            </div>

            <button className="btn btn-pink" onClick={alertSet} style={{ width: '100%' }}>SET ALERT</button>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>ACTIVE ALERTS</div>
          <div id="section-alerts-list">
            {alerts.length === 0 ? (
              <div style={{ fontSize: 11, color: 'var(--dim)', textAlign: 'center', padding: 20 }}>No alerts set yet.</div>
            ) : (
              alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--border)', opacity: a.active ? 1 : 0.5 }}>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, fontWeight: 700, color: 'var(--text)', minWidth: 60 }}>{a.token}</span>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: a.dir === 'above' ? 'var(--green)' : 'var(--red)', marginRight: 4 }}>
                    {a.dir === 'above' ? '↑ above' : '↓ below'}
                  </span>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: 'var(--text)', flex: 1 }}>{a.target}</span>
                  <span className={`badge ${a.active ? 'b-green' : 'b-dim'}`}>{a.active ? 'ACTIVE' : 'OFF'}</span>
                  <button
                    onClick={() => removeAlert(i)}
                    style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: 14, padding: '0 4px', lineHeight: 1 }}
                    title="Delete alert"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
