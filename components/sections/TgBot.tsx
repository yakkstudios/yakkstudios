'use client';
import { useState } from 'react';
interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }
const inp: React.CSSProperties = { width:'100%', boxSizing:'border-box' as const, background:'var(--bg4)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, padding:'8px 12px', color:'var(--text)', fontFamily:'Space Mono,monospace', fontSize:11, outline:'none' };
const SAFETY_RAILS = ['Hard cap on max trade size — bot cannot exceed it','Confirm threshold — you approve big moves','Daily loss limit — bot pauses automatically','Emergency /stop command — kills all activity instantly',"Your keys never leave your wallet — bot signs via approval"];
const strategyLabels: Record<string, string> = { dip:'Dip Buyer', trend:'Trend Follower', sniper:'New Token Sniper', arb:'DEX Arbitrage', custom:'Custom (AI-built)' };
export default function TgBot({ walletConnected, ystBalance, onNavigate }: Props) {
  const access = walletConnected && ystBalance >= 10_000_000;
  const [botName,setBotName]=useState(''); const [strategy,setStrategy]=useState('dip'); const [maxTrade,setMaxTrade]=useState(''); const [confirmAbove,setConfirmAbove]=useState(''); const [lossLimit,setLossLimit]=useState(''); const [tokens,setTokens]=useState(''); const [instructions,setInstructions]=useState(''); const [preview,setPreview]=useState('');
  const buildBot = () => { if (!walletConnected) return; const name=botName||'YAKKBot'; const strat=strategyLabels[strategy]||strategy; const text=`🤖 ${name}\nStrategy: ${strat}\nTokens: ${tokens||'$YST, SOL'}\nMax trade: ${maxTrade?`$${maxTrade}`:'not set'}\nConfirm above: ${confirmAbove?`$${confirmAbove}`:'not set'}\nDaily loss limit: ${lossLimit?`$${lossLimit}`:'not set'}${instructions?`\n\nCustom rules:\n${instructions}`:''}`; setPreview(text); };
  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">AI-POWERED</div><div className="sec-title">Telegram Trade Bot</div><div className="sec-bar" />
      <div style={{marginTop:10,display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',background:'var(--bg4)',borderRadius:5}}>
        <span style={{fontSize:12}}>10,000,000+ $YST 🪙 Held</span>
        <span className={`badge ${access?'b-green':'b-dim'}`}>{access?'✓ VERIFIED':'NOT CHECKED'}</span>
      </div>
      <p style={{fontSize:12,color:'var(--dim)',marginBottom:20}}>Build your personal trading bot with YAKK AI as the brain. Set your own rules — the bot executes, you stay in control.</p>
      {!walletConnected && <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8,padding:'12px 16px',marginBottom:16,fontSize:11,color:'#fca5a5'}}>⚠️ Connect wallet to build and deploy your bot.</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div className="card-sm">
          <div style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--dim)',letterSpacing:'0.12em',marginBottom:14}}>BOT CONFIGURATION</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>BOT NAME</div><input type="text" placeholder="e.g. YAKKBot Alpha" value={botName} onChange={e=>setBotName(e.target.value)} style={inp} /></div>
            <div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>TRADING STRATEGY</div><select value={strategy} onChange={e=>setStrategy(e.target.value)} style={{...inp,padding:'9px 12px'}}><option value="dip">Dip Buyer</option><option value="trend">Trend Follower</option><option value="sniper">New Token Sniper</option><option value="arb">DEX Arb</option><option value="custom">Custom (AI builds)</option></select></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}><div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>MAX TRADE ($)</div><input type="number" placeholder="e.g. 500" value={maxTrade} onChange={e=>setMaxTrade(e.target.value)} style={{...inp,fontSize:12}} /></div><div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>CONFIRM ABOVE ($)</div><input type="number" placeholder="e.g. 200" value={confirmAbove} onChange={e=>setConfirmAbove(e.target.value)} style={{...inp,fontSize:12}} /></div></div>
            <div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>DAILY LOSS LIMIT ($)</div><input type="number" placeholder="Bot pauses if this is hit" value={lossLimit} onChange={e=>setLossLimit(e.target.value)} style={{...inp,fontSize:12}} /></div>
            <div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>TOKENS TO TRADE</div><input type="text" placeholder="$YST, $SPT, SOL..." value={tokens} onChange={e=>setTokens(e.target.value)} style={inp} /></div>
            <div><div style={{fontSize:9,color:'var(--dim)',marginBottom:5}}>CUSTOM INSTRUCTIONS</div><textarea placeholder="e.g. Never buy if wallet drops below 2 SOL..." rows={3} value={instructions} onChange={e=>setInstructions(e.target.value)} style={{...inp,resize:'vertical' as const}} /></div>
            <button className="btn btn-pink" onClick={buildBot} style={{width:'100%'}} disabled={!walletConnected}>🤖 BUILD MY BOT WITH YAKKAI</button>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card-sm" style={{borderLeft:'3px solid var(--gold)'}}><div style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--gold)',letterSpacing:'0.12em',marginBottom:12}}>⚡ SAFETY RAILS</div><div style={{display:'flex',flexDirection:'column',gap:8,fontSize:11}}>{SAFETY_RAILS.map((r,i)=>(<div key={i} style={{display:'flex',gap:8,alignItems:'center'}}><span style={{color:'#64dc64',fontSize:14}}>✓</span> {r}</div>))}</div></div>
          {preview && <div className="card-sm"><div style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--dim)',letterSpacing:'0.12em',marginBottom:12}}>BOT PREVIEW</div><div style={{fontSize:11,color:'var(--text)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{preview}</div></div>}
          <div className="card-sm" style={{background:'linear-gradient(135deg,rgba(0,136,204,0.08),rgba(0,136,204,0.02))',border:'1px solid rgba(0,136,204,0.2)'}}><div style={{fontSize:9,color:'#4fc3f7',letterSpacing:'0.1em',marginBottom:10,fontFamily:'Space Mono,monospace'}}>TELEGRAM NOTIFICATION EXAMPLE</div><div style={{background:'var(--bg4)',borderRadius:10,padding:12,fontSize:11,lineHeight:1.7,borderLeft:'3px solid #0088cc'}}><div style={{fontWeight:700,color:'#4fc3f7',marginBottom:4}}>🤖 YAKKBot Alpha</div><div>🎯 Signal detected: <strong>$YST</strong></div><div>📊 Dip: -8.3% in last 15m</div><div>💰 Trade value: <strong>$320</strong> — above confirm threshold</div><div style={{marginTop:8,display:'flex',gap:8}}><span style={{background:'rgba(100,220,100,0.15)',color:'#64dc64',padding:'3px 10px',borderRadius:5}}>✅ BUY</span><span style={{background:'rgba(239,68,68,0.15)',color:'#fca5a5',padding:'3px 10px',borderRadius:5}}>❌ SKIP</span></div></div></div>
          <div style={{padding:10,background:'rgba(255,200,0,0.06)',border:'1px solid rgba(255,200,0,0.15)',borderRadius:7,fontSize:10,color:'var(--gold)'}}>⚠️ Bots are tools. Trading is risky — always set a daily loss limit.</div>
        </div>
      </div>
    </div>
  );
}
