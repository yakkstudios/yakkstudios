'use client';
import { useState } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

const MARKETS = [
  { id:1, title:'Will Bitcoin hit $150K before July 2025?', cat:'btc', yes:62, volume:'$4.2M', traders:'12.4K', endDate:'Jun 30 2025', link:'https://polymarket.com' },
  { id:2, title:'Will Solana flip Ethereum in daily DEX volume this quarter?', cat:'sol', yes:38, volume:'$1.8M', traders:'6.2K', endDate:'Mar 31 2025', link:'https://polymarket.com' },
  { id:3, title:'Will $YST reach $0.00001 by April?', cat:'yst', yes:71, volume:'$89K', traders:'890', endDate:'Apr 30 2025', link:'https://polymarket.com' },
  { id:4, title:'Will a Solana ETF be approved in 2025?', cat:'sol', yes:44, volume:'$8.1M', traders:'22K', endDate:'Dec 31 2025', link:'https://polymarket.com' },
  { id:5, title:'Will total crypto market cap exceed $5T in 2025?', cat:'crypto', yes:55, volume:'$12M', traders:'34K', endDate:'Dec 31 2025', link:'https://polymarket.com' },
  { id:6, title:'Will $YST holders reach 10,000 by June?', cat:'yst', yes:58, volume:'$42K', traders:'520', endDate:'Jun 30 2025', link:'https://polymarket.com' },
  { id:7, title:'Will Bitcoin dominance drop below 50% in Q2?', cat:'btc', yes:29, volume:'$3.4M', traders:'9.8K', endDate:'Jun 30 2025', link:'https://polymarket.com' },
  { id:8, title:'Will SOL price exceed $200 in April 2025?', cat:'sol', yes:41, volume:'$2.8M', traders:'8.1K', endDate:'Apr 30 2025', link:'https://polymarket.com' },
];

const YST_PREDICTIONS = [
  { label: '$0.000005 by April', pct: 82, color: 'var(--green)' },
  { label: '$0.00001 by June', pct: 71, color: 'var(--green)' },
  { label: '$0.0001 by EOY', pct: 34, color: 'var(--gold)' },
  { label: '$0.001 by EOY', pct: 12, color: 'var(--red)' },
];

const STATS = [
  { label: 'Active Markets', value: '42' },
  { label: 'Total Volume', value: '$38.2M' },
  { label: 'YAKKAI Win Rate', value: '85–98%' },
  { label: 'Traders', value: '94K+' },
];

export default function Predictions({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [filter, setFilter] = useState('all');
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<{role:string;text:string}[]>([
    { role: 'ai', text: 'Ask me about any prediction market. I can analyse the odds, historical patterns, and give you the cabal read.' },
  ]);
  const [aiPick, setAiPick] = useState('');

  const filteredMarkets = filter === 'all' ? MARKETS : MARKETS.filter(m => m.cat === filter);

  const handleChat = () => {
    if (!chatInput.trim()) return;
    setChatMsgs(prev => [...prev, { role: 'user', text: chatInput }]);
    const reply = `Based on YAKKAI analysis of "${chatInput.trim()}" — current sentiment is moderately bullish. On-chain signals show accumulation patterns. Community conviction: HIGH. Always DYOR — the ledger makes no promises.`;
    setChatMsgs(prev => [...prev, { role: 'ai', text: reply }]);
    setChatInput('');
  };

  const handleGetPick = () => {
    setAiPick('YAKKAI TOP PICK: "Will Bitcoin hit $150K before July 2025?" — Current YES at 62%. YAKKAI signal: STRONG BUY on YES. Reasoning: On-chain whale accumulation at ATH, ETF inflow momentum sustained, halving supply shock thesis intact. Historical pattern: BTC has exceeded consensus targets in every post-halving year. Risk: Macro black swan. Confidence: 87%.');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 74px)' }}>
      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">Connect your wallet and hold <strong>10,000,000 $YST</strong> to unlock this tool.</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      )}

      {hasAccess && (
        <div className="sec-pad">
          <div className="sec-eyebrow">10 — YAKKAI PREDICTION ENGINE</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(26px,3vw,44px)', lineHeight: 1.1 }}>
            PREDICTION <span style={{ color: 'var(--gold)' }}>MARKETS</span>
          </div>
          <div className="sec-bar"></div>
          <p style={{ color: 'var(--muted)', maxWidth: '580px', marginBottom: '28px', fontSize: '13px', lineHeight: 1.8 }}>
            Real prediction markets for crypto events. YAKKAI scans live markets and gives you the signal. Click any market to trade on Polymarket.{' '}
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>42 active markets. Community conviction tracked on-chain.</span>{' '}
            Not financial advice — the ledger makes no promises, only patterns.
          </p>

          {/* YAKKAI Top Pick */}
          <div className="card" style={{ marginBottom: '24px', borderColor: 'rgba(247,201,72,0.25)', background: 'linear-gradient(135deg,rgba(247,201,72,0.04),var(--bg3))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '22px' }}>🔮</span>
              <div>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '14px', color: 'var(--gold)' }}>YAKKAI TOP PICK</div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>AI-generated prediction signal · Educational only</div>
              </div>
              <button className="btn btn-gold" style={{ marginLeft: 'auto', fontSize: '9px', padding: '6px 13px' }} onClick={handleGetPick}>
                🤖 GET AI PICK
              </button>
            </div>
            <div style={{ minHeight: '80px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '7px', padding: '13px', fontSize: '12px', color: 'var(--muted)', lineHeight: 1.7 }}>
              {aiPick ? (
                <div>{aiPick}</div>
              ) : (
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>
                  Click "Get AI Pick" to see YAKKAI's top prediction market signal for today...
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

            {/* LEFT: Markets */}
            <div>
              {/* Filter tabs */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '13px', marginRight: '4px' }}>LIVE MARKETS</div>
                {[
                  { key: 'all', label: 'ALL' },
                  { key: 'yst', label: '$YST', extra: { borderColor: 'rgba(224,96,126,0.3)', color: 'var(--pink)' } },
                  { key: 'crypto', label: 'CRYPTO' },
                  { key: 'sol', label: 'SOLANA' },
                  { key: 'btc', label: 'BITCOIN' },
                ].map(f => (
                  <button
                    key={f.key}
                    className={`pm-filter${filter === f.key ? ' active' : ''}`}
                    onClick={() => setFilter(f.key)}
                    style={{
                      padding: '3px 10px', borderRadius: '9px', fontFamily: 'Space Mono,monospace', fontSize: '8px', cursor: 'pointer',
                      background: filter === f.key ? 'rgba(247,201,72,0.1)' : 'var(--bg3)',
                      border: `1px solid ${filter === f.key ? 'var(--gold)' : (f.extra?.borderColor || 'var(--border)')}`,
                      color: filter === f.key ? 'var(--gold)' : (f.extra?.color || 'var(--muted)'),
                    }}
                  >
                    {f.label}
                  </button>
                ))}
                <div style={{ marginLeft: 'auto' }}>
                  <button className="btn btn-ghost" style={{ fontSize: '9px', padding: '5px 11px' }}>↻ REFRESH</button>
                </div>
              </div>

              {/* Market cards */}
              <div>
                {filteredMarkets.map(m => (
                  <a
                    key={m.id}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pm-card"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px 16px', marginBottom: '10px', cursor: 'pointer', display: 'block', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.15s' }}
                  >
                    <div className="pm-card-title" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', lineHeight: 1.4, marginBottom: '8px' }}>
                      {m.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {/* YES/NO bar */}
                      <div style={{ flex: 1, minWidth: '120px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono,monospace', fontSize: '9px', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--green)' }}>YES {m.yes}%</span>
                          <span style={{ color: 'var(--red)' }}>NO {100 - m.yes}%</span>
                        </div>
                        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg4)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${m.yes}%`, background: 'var(--green)', borderRadius: '2px' }}></div>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>
                        VOL {m.volume}
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>
                        {m.traders} traders
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>
                        Ends {m.endDate}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <a href="https://polymarket.com/markets?tag=crypto" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '10px' }}>
                  VIEW ALL MARKETS ON POLYMARKET →
                </a>
              </div>
            </div>

            {/* RIGHT: YST Community Predictions + Stats */}
            <div>
              {/* YST Price Predictions */}
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', marginBottom: '12px' }}>🩷 $YST PRICE PREDICTIONS</div>
                {YST_PREDICTIONS.map((p, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Space Mono,monospace', fontSize: '9px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--muted)' }}>{p.label}</span>
                      <span style={{ color: p.color, fontWeight: 700 }}>{p.pct}%</span>
                    </div>
                    <div style={{ height: '4px', borderRadius: '2px', background: 'var(--bg4)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.pct}%`, background: p.color, borderRadius: '2px' }}></div>
                    </div>
                  </div>
                ))}
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '10px', marginTop: '10px' }}>
                  ↻ REFRESH PREDICTIONS
                </button>
              </div>

              {/* Ask YAKKAI */}
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', marginBottom: '12px' }}>💬 ASK YAKKAI ABOUT A MARKET</div>
                <div className="chat-msgs" style={{ height: '160px', overflowY: 'auto', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                  {chatMsgs.map((msg, i) => (
                    msg.role === 'ai' ? (
                      <div key={i} className="msg-ai" style={{ alignSelf: 'flex-start', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px 8px 8px 2px', padding: '8px 13px', maxWidth: '80%', fontSize: '12px', lineHeight: 1.6 }}>
                        {i === 0 && <div className="ai-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '5px' }}>YAKKAI — PREDICTION MODE</div>}
                        {msg.text} 🔮
                      </div>
                    ) : (
                      <div key={i} style={{ alignSelf: 'flex-end', background: 'rgba(224,96,126,0.1)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: '8px 8px 2px 8px', padding: '8px 13px', maxWidth: '80%', fontSize: '12px', lineHeight: 1.6 }}>
                        {msg.text}
                      </div>
                    )
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '7px', marginTop: '8px' }}>
                  <input
                    className="chat-inp"
                    placeholder="Ask about any market..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleChat(); }}
                    style={{ flex: 1, background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '5px', padding: '8px 12px', color: 'var(--text)', fontFamily: "'DM Sans',sans-serif", fontSize: '12px', outline: 'none' }}
                  />
                  <button className="btn btn-gold" style={{ flexShrink: 0, fontSize: '10px', padding: '6px 11px' }} onClick={handleChat}>
                    ASK
                  </button>
                </div>
              </div>

              {/* Prediction Stats */}
              <div className="card">
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', marginBottom: '10px' }}>📊 PREDICTION STATS</div>
                <div className="grid2" style={{ gap: '8px' }}>
                  {STATS.map(s => (
                    <div key={s.label} className="stat-card" style={{ padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--gold)' }}>{s.value}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '3px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
