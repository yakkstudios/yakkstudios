'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function WhaleClub({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const hasWhaleAccess = walletConnected && ystBalance >= 10_000_000;
  const PERKS = [{ icon: '🔍', label: 'Full Cabal Scanner access' },{ icon: '📄', label: 'AI investigation reports' },{ icon: '💬', label: 'Private Whale Telegram group' },{ icon: '⚡', label: 'Early access to new tools' },{ icon: '💰', label: 'Enhanced $YST RevShare' },{ icon: '🐋', label: 'Whale Club NFT whitelist slot' }];
  return (
    <div style={{ minHeight: 'calc(100vh - 74px)' }}>
      {!hasWhaleAccess && (<div className="locked-overlay" style={{ background: 'rgba(5,5,9,0.95)' }}><div className="locked-icon" style={{ fontSize: 40 }}>🐋</div><div className="locked-title" style={{ color: 'var(--gold)' }}>WHALE CLUB</div><div className="locked-sub">Elite Access Required: Hold <strong style={{ color: 'var(--gold)' }}>10,000,000+ $YST</strong> to enter the deep end.</div><a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Accumulate $YST</a></div>)}
      <div className="sec-pad">
        <div className="sec-header">
          <div className="sec-eyebrow" style={{ color: 'var(--gold)' }}>YAKK — ELITE TIER</div>
          <div className="sec-title">WHALE <span style={{ color: 'var(--gold)' }}>CLUB 🐋</span>{hasWhaleAccess && <span className="badge b-gold" style={{ marginLeft: '0.5rem' }}>ELITE HOLDER</span>}</div>
          <div className="sec-bar" style={{ background: 'var(--gold)', opacity: 0.6 }} />
        </div>
        <p style={{ color: 'var(--muted)', maxWidth: 580, marginBottom: 28, fontSize: 13, lineHeight: 1.8 }}>The top tier of the YAKK cult. Only those holding <strong style={{ color: 'var(--gold)' }}>10M+ $YST</strong> qualify. You're not just a holder — you're the floor.</p>
        {hasWhaleAccess && (<div className="grid3" style={{ marginBottom: 24 }}><div className="stat-card" style={{ borderColor: 'rgba(247,201,72,0.2)' }}><div className="slbl" style={{ color: 'var(--gold)' }}>YOUR $YST</div><div className="sval" style={{ color: 'var(--gold)' }}>{ystBalance.toLocaleString()}</div></div><div className="stat-card" style={{ borderColor: 'rgba(247,201,72,0.2)' }}><div className="slbl" style={{ color: 'var(--gold)' }}>STATUS</div><div className="sval" style={{ color: 'var(--gold)' }}>🐋 WHALE</div></div><div className="stat-card" style={{ borderColor: 'rgba(247,201,72,0.2)' }}><div className="slbl" style={{ color: 'var(--gold)' }}>TIER</div><div className="sval" style={{ color: 'var(--gold)' }}>ELITE</div></div></div>)}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--gold)', letterSpacing: '0.15em', marginBottom: 12 }}>ELITE PERKS</div>
          <div className="grid3">{PERKS.map(({ icon, label }) => (<div key={label} className="card" style={{ borderColor: hasWhaleAccess ? 'rgba(247,201,72,0.2)' : 'var(--border)', opacity: hasWhaleAccess ? 1 : 0.5, display: 'flex', alignItems: 'flex-start', gap: 10 }}><span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span><span style={{ fontSize: 12, lineHeight: 1.4 }}>{label}</span></div>))}</div>
        </div>
        <div className="grid2" style={{ marginBottom: 24 }}>
          <div className="card" style={{ borderColor: 'rgba(247,201,72,0.2)' }}><div className="slbl" style={{ color: 'var(--gold)' }}>SMART MONEY SIGNALS</div><p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>Real-time tracking of top 100 Solana wallets and Cabal movements.</p></div>
          <div className="card" style={{ borderColor: 'rgba(247,201,72,0.2)' }}><div className="slbl" style={{ color: 'var(--gold)' }}>VENTURES PRIORITY</div><p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.6 }}>72-hour early access to all YAKK Ventures allocations.</p></div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Buy $YST on Meteora</a>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}>Buy on Jupiter</a>
        </div>
      </div>
    </div>
  );
}
