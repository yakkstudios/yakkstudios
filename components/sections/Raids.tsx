'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const ACTIVE_RAIDS = [
  { id: 1, target: '@SolanaProject_X', type: 'LIKE + RT', reward: '5,000 YST', participants: 142, goal: 200, timeLeft: '2h 14m', difficulty: 'EASY', badge: 'b-green' },
  { id: 2, target: '$YST on #Solana', type: 'QUOTE RT', reward: '12,000 YST', participants: 67, goal: 150, timeLeft: '5h 40m', difficulty: 'MEDIUM', badge: 'b-gold' },
  { id: 3, target: 'YAKK Genesis Mint', type: 'FULL RAID', reward: '25,000 YST', participants: 34, goal: 100, timeLeft: '1d 2h', difficulty: 'HARD', badge: 'b-pink' },
];

const LEADERBOARD = [
  { rank: 1, handle: '@cryptowarlord', raids: 48, earned: '240,000', badge: 'b-gold' },
  { rank: 2, handle: '@yakkholder', raids: 41, earned: '185,000', badge: 'b-gold' },
  { rank: 3, handle: '@solanasensei', raids: 38, earned: '162,000', badge: 'b-blue' },
  { rank: 4, handle: '@degenraider', raids: 29, earned: '118,000', badge: 'b-blue' },
  { rank: 5, handle: '@memecoinking', raids: 22, earned: '89,000', badge: 'b-dim' },
];

export default function Raids({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [joined, setJoined] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'leaderboard'>('active');

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--red),var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">âï¸ RAIDS</div>
          <span className="badge b-pink">LIVE</span>
        </div>
        <div className="sec-sub">Coordinate Twitter/X raids with the YAKK community. Earn $YST for participation.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> ðª Required</span>
          {hasAccess
            ? <span className="badge b-green">â ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? 'ð NEED MORE YST' : 'ð CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>âï¸</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Join the Raid Squad</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Connect wallet &amp; hold 250K+ $YST to earn $YST by raiding with the community.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>ð</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more to unlock raids.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter â</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div className="grid4" style={{ marginBottom: 20 }}>
            {[
              { l: 'ACTIVE RAIDS', v: '3', c: 'var(--pink)' },
              { l: 'TOTAL RAIDERS', v: '243', c: 'var(--gold)' },
              { l: 'YST DISTRIBUTED', v: '1.2M', c: 'var(--green)' },
              { l: 'YOUR EARNINGS', v: '0 YST', c: 'var(--text)' },
            ].map(s => (
              <div key={s.l} className="stat-card">
                <div className="slbl">{s.l}</div>
                <div className="sval" style={{ color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['active', 'leaderboard'] as const).map(t => (
              <button key={t} className={`mode-pill ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'active' ? 'âï¸ Active Raids' : 'ð Leaderboard'}
              </button>
            ))}
          </div>

          {activeTab === 'active' && (
            <div>
              {ACTIVE_RAIDS.map(raid => (
                <div key={raid.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15 }}>{raid.target}</div>
                        <span className={`badge ${raid.badge}`}>{raid.difficulty}</span>
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.1em' }}>{raid.type}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, color: 'var(--gold)' }}>{raid.reward}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>REWARD POOL</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[['PARTICIPANTS', `${raid.participants}/${raid.goal}`], ['TIME LEFT', raid.timeLeft]].map(([l, v]) => (
                      <div key={l as string}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.1em' }}>{l}</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="prog-bar" style={{ marginBottom: 12 }}>
                    <div className="prog-fill" style={{ width: (raid.participants / raid.goal * 100) + '%' }} />
                  </div>
                  {joined.includes(raid.id) ? (
                    <span className="badge b-green" style={{ fontSize: 10, padding: '5px 12px' }}>â JOINED RAID</span>
                  ) : (
                    <button className="btn btn-pink" style={{ fontSize: 11 }} onClick={() => setJoined(j => [...j, raid.id])}>
                      âï¸ Join Raid
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>TOP RAIDERS THIS MONTH</div>
              {LEADERBOARD.map(entry => (
                <div key={entry.rank} className="lb-row" style={{ marginBottom: 8 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: entry.rank <= 2 ? 'var(--gold)' : 'var(--muted)', minWidth: 28 }}>#{entry.rank}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{entry.handle}</div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{entry.raids} raids completed</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--gold)' }}>{entry.earned} YST</div>
                    <span className={`badge ${entry.badge}`} style={{ fontSize: 8 }}>EARNED</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
