'use client';
import { useState, useEffect, useRef } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

interface Alert {
  token: string;
  target: string;
  dir: 'above' | 'below';
  active: boolean;
}

interface WhaleEvent {
  id:       string;
  ts:       number;
  wallet:   string;
  amount:   number;
  type:     'buy' | 'sell' | 'transfer';
  tier:     'whale' | 'mega';
  usdValue: number;
  txSig?:   string;
}

function fmtAmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return n.toLocaleString();
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

const DEFAULT_ALERTS: Alert[] = [];

export default function Alerts({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;

  // ── Price alerts ─────────────────────────────────────────────────────────
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

  // ── Whale live feed ───────────────────────────────────────────────────────
  const [whaleFeed, setWhaleFeed] = useState<WhaleEvent[]>([]);
  const lastTsRef = useRef<number>(0);

  useEffect(() => {
    async function fetchWhales() {
      try {
        const url = lastTsRef.current > 0
          ? `/api/whale-feed?limit=20&since=${lastTsRef.current}`
          : '/api/whale-feed?limit=20';
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        const incoming: WhaleEvent[] = data.events ?? [];
        if (!incoming.length) return;
        lastTsRef.current = incoming[0].ts;
        setWhaleFeed(prev => {
          const merged = [...incoming, ...prev];
          const seen = new Set<string>();
          return merged.filter(e => {
            if (seen.has(e.id)) return false;
            seen.add(e.id);
            return true;
          }).slice(0, 50);
        });
      } catch { /* silent — feed is best-effort */ }
    }
    fetchWhales();
    const iv = setInterval(fetchWhales, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">NOTIFICATIONS</div>
      <div className="sec-title">Price Alerts &amp; Whale Feed</div>
      <div className="sec-bar" />

      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Set price targets for any token and monitor live $YST whale transactions on-chain.
      </p>

      {/* ── Locked overlay ─────────────────────────────────────────────────── */}
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

      {/* ── Authorised view ─────────────────────────────────────────────────── */}
      {hasAccess && (<>

        {/* Whale Live Feed */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 10 }}>
            🐋 LIVE WHALE FEED — $YST ON-CHAIN
          </div>
          <div className="card-sm" style={{ padding: 0, overflow: 'hidden' }}>
            {whaleFeed.length === 0 ? (
              <div style={{ padding: 20, fontSize: 11, color: 'var(--dim)', textAlign: 'center', fontFamily: 'Space Mono,monospace' }}>
                No whale activity detected yet — monitoring on-chain every 30s…
              </div>
            ) : (
              <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                {whaleFeed.map((ev, i) => (
                  <div key={ev.id} style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto',
                    gap: '0 12px',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderBottom: i < whaleFeed.length - 1 ? '1px solid var(--border)' : 'none',
                    background: ev.tier === 'mega' ? 'rgba(247,201,72,0.04)' : 'transparent',
                  }}>

                    {/* Tier badge */}
                    <span style={{
                      fontFamily: 'Space Mono,monospace',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: ev.tier === 'mega' ? 'var(--gold)' : 'var(--pink)',
                      background: ev.tier === 'mega' ? 'rgba(247,201,72,0.12)' : 'rgba(224,96,126,0.12)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      border: `1px solid ${ev.tier === 'mega' ? 'rgba(247,201,72,0.3)' : 'rgba(224,96,126,0.3)'}`,
                      whiteSpace: 'nowrap',
                    }}>
                      {ev.tier === 'mega' ? '🔥 MEGA' : '🐋 WHALE'}
                    </span>

                    {/* Wallet + type */}
                    <div>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: 'var(--text)' }}>{ev.wallet}</span>
                      <span style={{
                        marginLeft: 8,
                        fontFamily: 'Space Mono,monospace',
                        fontSize: 9,
                        color: ev.type === 'buy' ? 'var(--green)' : ev.type === 'sell' ? 'var(--red)' : 'var(--dim)',
                      }}>
                        {ev.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Amount */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                        {fmtAmt(ev.amount)} <span style={{ color: 'var(--pink)', fontSize: 10 }}>$YST</span>
                      </div>
                      {ev.usdValue > 0 && (
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>
                          ~${fmtAmt(ev.usdValue)}
                        </div>
                      )}
                    </div>

                    {/* Time + tx link */}
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {timeAgo(ev.ts)}
                      {ev.txSig && (
                        <a
                          href={`https://solscan.io/tx/${ev.txSig}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'block', color: 'var(--pink)', fontSize: 9, marginTop: 2 }}
                        >
                          ↗ solscan
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price alerts 2-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Create Alert */}
          <div className="card-sm">
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>CREATE ALERT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

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
      </>)}
    </div>
  );
}
