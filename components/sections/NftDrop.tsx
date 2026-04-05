'use client';
import { useEffect, useState } from 'react';

const DROP_DATE = new Date('2026-04-20T00:00:00Z');

interface Countdown { days: number; hours: number; mins: number; secs: number; }

function getCountdown(): Countdown {
  const diff = DROP_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const secs  = Math.floor(diff / 1000);
  return {
    days:  Math.floor(secs / 86400),
    hours: Math.floor((secs % 86400) / 3600),
    mins:  Math.floor((secs % 3600) / 60),
    secs:  secs % 60,
  };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function NftDrop() {
  const [countdown, setCountdown] = useState<Countdown>(getCountdown());
  const [dropLive,  setDropLive]  = useState(Date.now() >= DROP_DATE.getTime());

  useEffect(() => {
    const id = setInterval(() => {
      const c = getCountdown();
      setCountdown(c);
      setDropLive(c.days === 0 && c.hours === 0 && c.mins === 0 && c.secs === 0);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sec-pad" id="section-nftdrop">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sec-header">
        <div className="sec-title">
          🎴 YAKK GEN I
          {dropLive
            ? <span className="badge b-green" style={{ marginLeft: '0.5rem' }}>LIVE</span>
            : <span className="badge b-dim"   style={{ marginLeft: '0.5rem' }}>COMING APR 20</span>
          }
        </div>
        <div className="sec-bar" />
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: 620, lineHeight: 1.7 }}>
        The first YAKK Studios NFT collection. 3,333 pieces. Anti-greed. On-chain accountability.
        Every holder gets whale-gate access to the full LABS suite — no $YST required.
      </p>

      {/* ── Countdown ──────────────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: `1px solid ${dropLive ? 'rgba(74,222,128,0.3)' : 'rgba(247,201,72,0.25)'}`,
        borderRadius: 10,
        padding: '1.75rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1rem' }}>
          {dropLive ? '🚀 MINT IS LIVE' : 'TIME UNTIL DROP'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          {([['DAYS', countdown.days], ['HRS', countdown.hours], ['MIN', countdown.mins], ['SEC', countdown.secs]] as const).map(([label, val]) => (
            <div key={String(label)} style={{ textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace', color: dropLive ? '#4ade80' : '#f7c948', lineHeight: 1 }}>
                {pad(Number(val))}
              </div>
              <div style={{ fontSize: '0.6rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.35rem' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#555', fontFamily: 'monospace' }}>
          April 20, 2026 · 00:00 UTC · Solana Mainnet
        </div>
      </div>

      {/* ── Key stat cards ─────────────────────────────────────────────── */}
      <div className="grid2" style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'rgba(255,46,154,0.07)',
          border: '1px solid rgba(255,46,154,0.2)',
          borderRadius: 10,
          padding: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#FF2E9A', fontFamily: 'monospace', lineHeight: 1 }}>
            3,333
          </div>
          <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.5rem' }}>
            TOTAL SUPPLY
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.5rem' }}>
            Fixed forever. No re-mints.
          </div>
        </div>

        <div style={{
          background: 'rgba(247,201,72,0.05)',
          border: '1px solid rgba(247,201,72,0.15)',
          borderRadius: 10,
          padding: '1.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f7c948', fontFamily: 'monospace', lineHeight: 1 }}>
            TBA
          </div>
          <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.5rem' }}>
            MINT PRICE
          </div>
          <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.5rem' }}>
            Announced pre-drop via @YakkStudios
          </div>
        </div>
      </div>

      {/* ── NFT utility / gate ─────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(192,38,255,0.06)',
        border: '1px solid rgba(192,38,255,0.2)',
        borderLeft: '4px solid #C026FF',
        borderRadius: 8,
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C026FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>
          🐋 NFT GATE — FULL LABS ACCESS
        </div>
        <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.7 }}>
          Hold a <strong style={{ color: '#f5f5f7' }}>YAKK GEN I NFT</strong> in your connected wallet and it counts as the
          10M $YST whale threshold — unlocking the full LABS suite with no $YST required.
          NFTs are transferable on secondary markets. Gate is checked on-chain at connection time. No staking, no lock-up.
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#666', fontFamily: 'monospace' }}>
          Hold NFT = Whale tier · OR hold 10M $YST · Same access, two paths.
        </div>
      </div>

      {/* ── How to get WL ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          HOW TO GET ON THE WHITELIST
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            {
              icon: '🐋',
              title: 'Hold 10M $YST',
              desc: 'Your wallet holds 10M+ $YST at the WL snapshot date. Whale gate = guaranteed WL. No application needed.',
              status: 'CONFIRMED',
              color: '#f7c948',
            },
            {
              icon: '🛡️',
              title: 'Active YAKK Community Member',
              desc: 'Regulars in the YAKK Telegram and on Twitter CT will be eligible for WL spots. Active = contributing, not lurking. Criteria will be announced by @shyfts_ before snapshot.',
              status: 'TBC',
              color: '#FF2E9A',
            },
            {
              icon: '🎟️',
              title: 'Raffle & Community Events',
              desc: 'WL spots will be raffled via the YAKK Raffle Engine and awarded through community events. Participate in YAKK activities to earn entries.',
              status: 'TBC',
              color: '#C026FF',
            },
          ].map(item => (
            <div key={item.title} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderLeft: `3px solid ${item.color}`,
              borderRadius: 8,
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}>
              <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.title}</span>
                  <span style={{ fontSize: '0.62rem', padding: '1px 6px', borderRadius: 3, background: `${item.color}22`, color: item.color, fontWeight: 700 }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#999', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#555' }}>
          WL snapshot date TBC. Follow{' '}
          <a href="https://x.com/YakkStudios" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)', textDecoration: 'none' }}>@YakkStudios</a>
          {' '}and join the{' '}
          <a href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)', textDecoration: 'none' }}>Telegram</a>
          {' '}for announcements.
        </div>
      </div>

      {/* ── Paperhands bitch tax ────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(74,222,128,0.04)',
        border: '1px solid rgba(74,222,128,0.2)',
        borderRadius: 10,
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '1.2rem' }}>🛡️</span>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              33.3% PAPERHANDS BITCH TAX
            </div>
            <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.05em', marginTop: 2 }}>
              SECONDARY ROYALTIES → SAVE THE WREN INITIATIVE
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#ccc', lineHeight: 1.75, marginBottom: '1rem' }}>
          Every secondary sale of a YAKK GEN I NFT carries a{' '}
          <strong style={{ color: '#4ade80' }}>33.3% royalty</strong> — the <em>paperhands bitch tax</em>.
          Flip your NFT and one third of the sale price routes directly to the{' '}
          <strong style={{ color: '#4ade80' }}>Save The Wren initiative</strong>, funding the fight against grooming
          gangs and sexual exploitation in the UK.
        </div>
        <div style={{ fontSize: '0.77rem', color: '#999', lineHeight: 1.7, marginBottom: '1rem' }}>
          This isn&apos;t a punishment. It&apos;s architecture. Weak hands fund the mission. Every flip is a donation.
          Hold your NFT and you have full LABS access. Sell it and you fund the cause either way.
          The wren is small. The wren is loud. So is this.
        </div>
        <div style={{
          padding: '0.75rem 1rem',
          background: 'rgba(74,222,128,0.05)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#4ade80', fontFamily: 'monospace', flex: 1, minWidth: 200 }}>
            Wren: 7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n
          </span>
          <a
            href="https://solscan.io/account/7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.65rem', borderColor: '#4ade80', color: '#4ade80', flexShrink: 0 }}
          >
            Track On-Chain ↗
          </a>
        </div>
      </div>

      {/* ── CTA buttons ────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          disabled={!dropLive}
          className={dropLive ? 'btn btn-pink' : 'btn btn-outline'}
          style={!dropLive ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
        >
          🎴 MINT YAKK GEN I
        </button>
        <a href="https://x.com/YakkStudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Follow @YakkStudios ↗
        </a>
        <a href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Join Telegram ↗
        </a>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#444' }}>
        Launchpad TBC. Full mint details and exact WL snapshot date announced via @YakkStudios.
        33.3% secondary royalties are hard-coded and routed on-chain to the Wren wallet. Non-negotiable.
      </div>

    </div>
  );
}
