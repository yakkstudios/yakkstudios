'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const TOPICS = ['Risk Management', 'Reading Charts', 'Entry Strategies', 'Exit Strategies', 'DeFi Basics', 'Wallet Security', 'Tax Tips'];

export default function Coach({ walletConnected, ystBalance, onNavigate }: Props) {
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: 'YAKKAI Coach here. I\'m your personal crypto trading coach powered by on-chain data and market psychology. Whether you\'re a beginner or experienced trader, I\'ll help you sharpen your edge. What do you want to work on?' }
  ]);
  const [input, setInput] = useState('');
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const send = (text?: string) => {
    const q = text || input;
    if (!q.trim()) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'ai', text: `Great question on "${q}". The key principle here is position sizing. Never risk more than 1-2% of your portfolio on a single trade. Most traders blow up not because they pick bad entries, but because they size too large and get emotional. On Solana memes specifically, I recommend: enter in thirds, take 50% off at 2x, let runners ride with a trailing stop. Want me to walk through a specific setup?` }]);
    }, 900);
  };

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🧠 YAKKAI COACH</div>
          <span className="badge b-blue">AI POWERED</span>
        </div>
        <div className="sec-sub">Your personal AI trading coach. Learn, improve &amp; sharpen your on-chain trading edge.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Held</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKKAI COACH</div>
          <div className="locked-sub">Connect your wallet and hold <strong>250,000+ $YST</strong> to access your personal AI trading coach.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST 🪙</a>
        </div>
      )}
      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">Insufficient $YST</div>
          <div className="locked-sub">You need <strong>250,000+ $YST</strong>. You hold: {ystBalance.toLocaleString()} $YST.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get More $YST 🪙</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, letterSpacing: '0.15em', color: 'var(--muted)', marginBottom: 8 }}>QUICK TOPICS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TOPICS.map(t => (
                <button key={t} className="mode-pill" onClick={() => send(t)} style={{ fontSize: 10 }}>{t}</button>
              ))}
            </div>
          </div>

          <div className="chat-msgs" style={{ height: 360 }}>
            {msgs.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'msg-user' : 'msg-ai'}>
                {m.role === 'ai' && <div className="ai-lbl">YAKKAI COACH</div>}
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input className="chat-inp" placeholder="Ask your coach anything..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="btn btn-blue" onClick={() => send()}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
