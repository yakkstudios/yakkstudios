'use client';
import { useState, useEffect } from 'react';

const DROP_DATE = new Date('2026-04-20T00:00:00Z').getTime();

const TRAIT_CATEGORIES = [
  { icon: '🃏', name: 'WILDCARDS',   count: '141', note: 'Unique 1-of-1 pieces' },
  { icon: '🌌', name: 'BACKGROUNDS', count: 'TBD', note: 'Base layer variants' },
  { icon: '⚡', name: 'ACCESSORIES', count: 'TBD', note: 'Wearables & items' },
  { icon: '👑', name: 'SPECIALS',    count: 'TBD', note: 'Ultra-rare traits' },
];

const MINT_STATS = [
  { label: 'TOTAL SUPPLY', value: '3,333',   accent: 'var(--pink)' },
  { label: 'MINT PRICE',   value: 'TBD',      accent: 'var(--gold)' },
  { label: 'WHALE GATE',   value: '10M $YST', accent: 'var(--gold)' },
  { label: 'CHAIN',        value: 'Solana',   accent: '#9945ff' },
];

export default function NftDrop() {
  const [countdown, setCountdown] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [dropLive, setDropLive] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = DROP_DATE - Date.now();
      if (diff <= 0) {
        setDropLive(true);
        setCountdown({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }
      setCountdown({
        d: String(Math.floor(diff / 86_400_000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86_400_000) / 3_600_000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="sec-pad" id="section-nftdrop">

      {/* Header */}
      <div className="sec-header">
        <div className="sec-title">
          🎴 YAKK GEN I — NFT DROP
          {dropLive ? (
            <span className="badge b-green" style={{ marginLeft: '0.5rem' }}>LIVE</span>
          ) : (
            <span className="badge b-gold" style={{ marginLeft: '0.5rem' }}>COMING APRIL 20</span>
          )}
        </div>
        <div className="sec-bar" style={{ background: 'var(--gold)' }} />
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.5rem', maxWidth: 600, lineHeight: 1.7 }}>
        3,333 unique NFTs on Solana. NFT holders unlock the whale tier — 10M $YST access
        to the full YAKK LABS suite. First-come, first-served. No whitelist games. Just hold and access.
      </p>

      {/* Countdown */}
      <div style={{
        background: 'rgba(247,201,72,0.04)',
        border: '1px solid rgba(247,201,72,0.2)',
        borderRadius: 10,
        padding: '1.5rem',
        marginBottom: '1.75rem',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '0.65rem', color: 'var(--gold)', letterSpacing: '0.14em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          {dropLive ? 'DROP IS LIVE — MINT NOW' : 'Time Until Drop'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {[['DAYS', countdown.d], ['HRS', countdown.h], ['MIN', countdown.m], ['SEC', countdown.s]].map(([l, v]) => (
            <div key={l} className="cd-block" style={{ minWidth: 64 }}>
              <div className="cd-num" style={{ color: dropLive ? 'var(--green)' : 'var(--gold)', fontSize: '2rem' }}>{v}</div>
              <div className="cd-lbl">{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', fontFamily: 'Space Mono,monospace', fontSize: '0.65rem', color: 'var(--dim)' }}>
          April 20, 2026 · 00:00 UTC · Solana Mainnet
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid4" style={{ marginBottom: '2rem' }}>
        {MINT_STATS.map(s => (
          <div key={s.label} className="stat-card" style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.accent, fontFamily: 'Syne,sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Trait categories */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '0.65rem', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          TRAIT CATEGORIES
        </div>
        <div className="grid4">
          {TRAIT_CATEGORIES.map(t => (
            <div key={t.name} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(247,201,72,0.12)',
              borderRadius: 8,
              padding: '1rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{t.icon}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '0.75rem', color: '#fff', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t.name}</div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '1rem', color: 'var(--gold)', fontWeight: 700 }}>{t.count}</div>
              <div style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.2rem' }}>{t.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        background: 'rgba(255,46,154,0.04)',
        border: '1px solid rgba(255,46,154,0.15)',
        borderRadius: 8,
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
      }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '0.65rem', color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          HOW THE NFT GATE WORKS
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.7 }}>
          Hold a YAKK GEN I NFT in your connected wallet and it counts as equivalent to the 10M $YST whale threshold —
          unlocking the full LABS suite without needing to hold 10M tokens. NFTs are transferable on secondary markets.
          The gate is checked on-chain at connection time. No staking, no lock-up.
        </div>
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          className="btn btn-pink"
          disabled={!dropLive}
          style={
            dropLive
              ? { fontSize: '0.9rem', padding: '0.6rem 1.5rem' }
              : { fontSize: '0.9rem', padding: '0.6rem 1.5rem', opacity: 0.4, cursor: 'not-allowed', background: '#444', borderColor: '#444' }
          }
        >
          {dropLive ? '🎴 MINT NOW' : '🔒 MINT OPENS APRIL 20'}
        </button>
        <a
          href="https://x.com/YakkStudios"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ fontSize: '0.82rem' }}
        >
          Follow for Updates →
        </a>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#444' }}>
        Launchpad TBC — Magic Eden / Tensor / self-deployed Candy Machine v3. Announcement before April 15.
      </div>
    </div>
  );
}
