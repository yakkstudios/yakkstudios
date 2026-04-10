'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Cabal({ walletConnected, ystBalance, onNavigate }: Props) {
  const [addr, setAddr] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<null | { found: boolean }>(null);
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const handleSearch = () => {
    if (!addr.trim()) return;
    setSearching(true); setResult(null);
    setTimeout(() => { setSearching(false); setResult({ found: true }); }, 1200);
  };

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--pink),#a855f7)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🕵️ CABAL INVESTIGATOR</div>
          <span className="badge b-yakk">BETA</span>
        </div>
        <div className="sec-sub">On-chain wallet intelligence. Track influencer wallets, whale movements &amp; insider activity.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Held</span>
          {hasAccess ? <span className="badge b-green">✓ ACCESS GRANTED</span> : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>
      {!walletConnected && (<div className="locked-overlay"><div className="locked-icon">🔒</div><div className="locked-title">CABAL INVESTIGATOR</div><div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access on-chain intelligence.</div><a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST 🪙</a></div>)}
      {walletConnected && ystBalance < 250_000 && (<div className="locked-overlay"><div className="locked-icon">🔒</div><div className="locked-title">Insufficient $YST</div><div className="locked-sub">You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.</div><a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get More $YST 🪙</a></div>)}
      {hasAccess && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <input className="field-inp" placeholder="Enter wallet address or @twitter handle..." value={addr} onChange={e => setAddr(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} style={{ flex: 1 }} />
            <button className="btn btn-pink" onClick={handleSearch} disabled={searching}>{searching ? '🔍 Scanning...' : '🔍 Investigate'}</button>
          </div>
          {result?.found && addr && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 20 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 14, color: 'var(--pink)' }}>📊 WALLET PROFILE</div>
              <div className="grid2" style={{ marginBottom: 16 }}>
                {[{ l: 'SOL BALANCE', v: '12.4 SOL', c: 'var(--green)' },{ l: 'TOKEN COUNT', v: '34 tokens', c: 'var(--text)' },{ l: 'TOTAL VALUE', v: '$2,847', c: 'var(--gold)' },{ l: 'RISK SCORE', v: '3/10 LOW', c: 'var(--green)' }].map(s => (<div key={s.l} className="stat-card"><div className="slbl">{s.l}</div><div className="sval" style={{ color: s.c, fontSize: 16 }}>{s.v}</div></div>))}
              </div>
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.1em' }}>TOP HOLDINGS</div>
              {[['$SOL','Solana','12.4','$2,108'],['$YST','YAKK Studios','2.1M','$378'],['$BONK','Bonk','420K','$9']].map(([sym,name,amt,val]) => (<div key={sym} className="lb-row" style={{ marginBottom: 6 }}><span className="td-tok" style={{ minWidth: 60 }}>{sym}</span><span style={{ flex: 1, color: 'var(--muted)', fontSize: 11 }}>{name}</span><span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10 }}>{amt}</span><span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--green)', minWidth: 60, textAlign: 'right' }}>{val}</span></div>))}
              <div style={{ marginTop: 14 }}><a href={`https://solscan.io/account/${addr}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline">View on Solscan ↗</a></div>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>KNOWN CABAL WALLETS</div>
            {[{ label: 'Ansem (Alpha Leaks)', addr: '7oKJ...MMSk', risk: 'MEDIUM', badge: 'b-gold' },{ label: 'ZachXBT (Fraud Hunter)', addr: 'FhVo...HLuM', risk: 'TRUSTED', badge: 'b-green' },{ label: 'Tier 1 KOL [CABAL]', addr: '6zNu...Ae9q', risk: 'HIGH RISK', badge: 'b-red' }].map(w => (<div key={w.addr} className="lb-row" style={{ marginBottom: 6, cursor: 'pointer' }} onClick={() => setAddr(w.addr)}><span style={{ flex: 1, fontSize: 12 }}>{w.label}</span><span style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--dim)', marginRight: 10 }}>{w.addr}</span><span className={`badge ${w.badge}`}>{w.risk}</span></div>))}
          </div>
        </div>
      )}
    </div>
  );
}
