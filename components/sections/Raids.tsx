'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const LEADERBOARD = [
  { rank: 1, handle: '@cryptowarlord', xp: 480, raids: 48 },
  { rank: 2, handle: '@yakkholder', xp: 410, raids: 41 },
  { rank: 3, handle: '@solanasensei', xp: 380, raids: 38 },
  { rank: 4, handle: '@degenraider', xp: 290, raids: 29 },
  { rank: 5, handle: '@memecoinking', xp: 220, raids: 22 },
];

export default function Raids({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [raidLink, setRaidLink] = useState('');
  const [myXp, setMyXp] = useState(0);
  const [myRaids, setMyRaids] = useState(0);
  const [logStatus, setLogStatus] = useState('');

  const logRaid = () => {
    if (!raidLink.trim()) return;
    setMyXp(x => x + 10);
    setMyRaids(r => r + 1);
    setRaidLink('');
    setLogStatus('✓ Raid logged! +10 XP');
    setTimeout(() => setLogStatus(''), 3000);
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">07 — RAID HUB</div>
      <div className="sec-title">Raid Hub</div>
      <div className="sec-bar" />

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙Held</span>
        <span className={`badge ${hasAccess ? 'b-green' : 'b-dim'}`}>
          {hasAccess ? 'ACCESS GRANTED' : !walletConnected ? 'NOT CHECKED' : 'INSUFFICIENT'}
        </span>
      </div>

      <div className="grid2" style={{ gap: 28 }}>
        {/* Left: Daily Targets */}
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            DAILY TARGETS <span className="badge b-pink">LIVE</span>
          </div>

          {/* Raid Item 1 */}
          <div className="raid-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>@YAKKStudios — Pinned Tweet</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Like ★ Retweet ↺ Comment "GET YAKKED 😈"</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)' }}>+10 XP</div>
              <a href="https://x.com/YAKKStudios" target="_blank" rel="noopener noreferrer">
                <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 8px', marginTop: 4 }}>RAID →</button>
              </a>
            </div>
          </div>

          {/* Raid Item 2 */}
          <div className="raid-item">
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3 }}>@yakkops2 — Latest Drop</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Engage + tag 2 degens + drop 😈</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)' }}>+10 XP</div>
              <a href="https://x.com/yakkops2" target="_blank" rel="noopener noreferrer">
                <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 8px', marginTop: 4 }}>RAID →</button>
              </a>
            </div>
          </div>

          {/* Bonus Raid Item */}
          <div className="raid-item" style={{ borderColor: 'rgba(247,201,72,0.2)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 3, color: 'var(--gold)' }}>BONUS — RUG EXPOSÉ THREAD</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Share the latest investigation. Protect the herd.</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)' }}>+25 XP</div>
            </div>
          </div>

          {/* Log Raid */}
          <div style={{ marginTop: 14, padding: 12, background: 'var(--bg4)', borderRadius: 7, border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', marginBottom: 7 }}>LOG YOUR RAID</div>
            <div style={{ display: 'flex', gap: 7 }}>
              <input
                className="field-inp"
                type="text"
                placeholder="Paste tweet link after raiding..."
                value={raidLink}
                onChange={e => setRaidLink(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && logRaid()}
                style={{ flex: 1, padding: '7px 10px', fontSize: 11 }}
              />
              <button className="btn btn-pink" style={{ fontSize: 10, padding: '7px 12px' }} onClick={logRaid}>/DONE</button>
            </div>
            {logStatus && <div style={{ fontSize: 11, color: 'var(--green)', marginTop: 6, fontFamily: 'Space Mono,monospace' }}>{logStatus}</div>}
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>LEADERBOARD</div>

          <div id="leaderboard">
            {LEADERBOARD.map(entry => (
              <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: entry.rank === 1 ? 'rgba(247,201,72,0.06)' : 'var(--bg4)', borderRadius: 6, marginBottom: 6, border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: entry.rank <= 3 ? 'var(--gold)' : 'var(--dim)', minWidth: 20, fontWeight: 700 }}>#{entry.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{entry.handle}</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>{entry.raids} raids</div>
                </div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--gold)' }}>{entry.xp} XP</div>
              </div>
            ))}
          </div>

          {/* Your Stats */}
          <div style={{ marginTop: 14, padding: 12, background: 'var(--bg4)', borderRadius: 7, border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', marginBottom: 7 }}>YOUR STATS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>TOTAL XP</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--pink)' }}>{myXp}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>RAIDS</div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: 'var(--gold)' }}>{myRaids}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
