'use client';
import { useState } from 'react';
interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }
const MARKETS = [
  { id:1, title:'Will Bitcoin hit $150K before July 2025?', cat:'btc', yes:62, volume:'$4.2M', traders:'12.4K', endDate:'Jun 30 2025', link:'https://polymarket.com' },
  { id:2, title:'Will Solana flip Ethereum in daily DEX volume this quarter?', cat:'sol', yes:38, volume:'$1.8M', traders:'6.2K', endDate:'Mar 31 2025', link:'https://polymarket.com' },
  { id:3, title:'Will $YST reach $0.00001 by April?', cat:'yst', yes:71, volume:'$89K', traders:'890', endDate:'Apr 30 2025', link:'https://polymarket.com' },
  { id:4, title:'Will a Solana ETF be approved in 2025?', cat:'sol', yes:44, volume:'$8.1M', traders:'22K', endDate:'Dec 31 2025', link:'https://polymarket.com' },
  { id:5, title:'Will total crypto market cap exceed $5T in 2025?', cat:'crypto', yes:55, volume:'$12M', traders:'34K', endDate:'Dec 31 2025', link:'https://polymarket.com' },
];
const YST_PREDS = [{ label:'$0.000005 by April', pct:82, color:'var(--green)' },{ label:'$0.00001 by June', pct:71, color:'var(--green)' },{ label:'$0.0001 by EOY', pct:34, color:'var(--gold)' },{ label:'$0.001 by EOY', pct:12, color:'var(--red)' }];
export default function Predictions({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [filter,setFilter]=useState('all'); const [chatInput,setChatInput]=useState(''); const [aiPick,setAiPick]=useState('');
  const [chatMsgs,setChatMsgs]=useState([{ role:'ai', text:'Ask me about any prediction market. I can analyse the odds, historical patterns, and give you the cabal read.' }]);
  const filtered = filter==='all' ? MARKETS : MARKETS.filter(m=>m.cat===filter);
  const handleChat = () => { if (!chatInput.trim()) return; setChatMsgs(p=>[...p,{role:'user',text:chatInput}]); const reply=`YAKK AI analysis: current sentiment is moderately bullish. On-chain signals show accumulation. Community conviction: HIGH. Always DYOR.`; setChatMsgs(p=>[...p,{role:'ai',text:reply}]); setChatInput(''); };
  const handleGetPick = () => setAiPick('YAKK AI TOP PICK: "Will Bitcoin hit $150K before July 2025?" — YES at 62%. YAKK AI signal: STRONG BUY on YES. Whale accumulation, ETF inflow momentum sustained. Confidence: 87%.');
  if (!hasAccess) return (<div style={{minHeight:'calc(100vh - 74px)'}}><div className="locked-overlay"><div className="locked-icon">🐋</div><div className="locked-title">WHALE CLUB EXCLUSIVE</div><div className="locked-sub">Connect your wallet and hold <strong>10,000,000 $YST</strong> to unlock this tool.</div><a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST</a></div></div>);
  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">10 — YAKK AI PREDICTION ENGINE</div><div className="sec-title">PREDICTION <span style={{color:'var(--gold)'}}>MARKETS</span></div><div className="sec-bar" />
      <div className="card" style={{marginBottom:24,borderColor:'rgba(247,201,72,0.25)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}><span style={{fontSize:22}}>🔮</span><div><div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:14,color:'var(--gold)'}}>YAKK AI TOP PICK</div></div><button className="btn btn-gold" style={{marginLeft:'auto',fontSize:9,padding:'6px 13px'}} onClick={handleGetPick}>🤖 GET AI PICK</button></div>
        <div style={{minHeight:80,background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:7,padding:13,fontSize:12,color:'var(--muted)',lineHeight:1.7}}>{aiPick||<span style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--dim)'}}>Click "Get AI Pick" to see YAKK AI's top signal...</span>}</div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:20,alignItems:'start'}}>
        <div>
          <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
            {[{key:'all',label:'ALL'},{key:'yst',label:'$YST'},{key:'crypto',label:'CRYPTO'},{key:'sol',label:'SOLANA'},{key:'btc',label:'BITCOIN'}].map(f=>(<button key={f.key} onClick={()=>setFilter(f.key)} style={{padding:'3px 10px',borderRadius:9,fontFamily:'Space Mono,monospace',fontSize:8,cursor:'pointer',background:filter===f.key?'rgba(247,201,72,0.1)':'var(--bg3)',border:`1px solid ${filter===f.key?'var(--gold)':'var(--border)'}`,color:filter===f.key?'var(--gold)':'var(--muted)'}}>{f.label}</button>))}
          </div>
          {filtered.map(m=>(<a key={m.id} href={m.link} target="_blank" rel="noopener noreferrer" style={{display:'block',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:8,padding:'14px 16px',marginBottom:10,textDecoration:'none',color:'inherit'}}><div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,lineHeight:1.4,marginBottom:8}}>{m.title}</div><div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}><div style={{flex:1,minWidth:120}}><div style={{display:'flex',justifyContent:'space-between',fontFamily:'Space Mono,monospace',fontSize:9,marginBottom:4}}><span style={{color:'var(--green)'}}>YES {m.yes}%</span><span style={{color:'var(--red)'}}>NO {100-m.yes}%</span></div><div style={{height:4,borderRadius:2,background:'var(--bg4)',overflow:'hidden'}}><div style={{height:'100%',width:`${m.yes}%`,background:'var(--green)',borderRadius:2}} /></div></div><span style={{fontFamily:'Space Mono,monospace',fontSize:8,color:'var(--dim)'}}>VOL {m.volume}</span><span style={{fontFamily:'Space Mono,monospace',fontSize:8,color:'var(--dim)'}}>{m.traders} traders</span></div></a>))}
          <a href="https://polymarket.com/markets?tag=crypto" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{fontSize:10,display:'block',textAlign:'center',marginTop:12}}>VIEW ALL MARKETS ON POLYMARKET →</a>
        </div>
        <div>
          <div className="card" style={{marginBottom:16}}><div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,marginBottom:12}}>🩷 $YST PRICE PREDICTIONS</div>{YST_PREDS.map((p,i)=>(<div key={i} style={{marginBottom:10}}><div style={{display:'flex',justifyContent:'space-between',fontFamily:'Space Mono,monospace',fontSize:9,marginBottom:4}}><span style={{color:'var(--muted)'}}>{p.label}</span><span style={{color:p.color,fontWeight:700}}>{p.pct}%</span></div><div style={{height:4,borderRadius:2,background:'var(--bg4)',overflow:'hidden'}}><div style={{height:'100%',width:`${p.pct}%`,background:p.color,borderRadius:2}} /></div></div>))}</div>
          <div className="card"><div style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:12,marginBottom:12}}>💬 ASK YAKK AI</div><div style={{height:160,overflowY:'auto',background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:8,padding:14,display:'flex',flexDirection:'column',gap:10,marginBottom:10}}>{chatMsgs.map((msg,i)=>(msg.role==='ai'?<div key={i} style={{alignSelf:'flex-start',background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:'8px 8px 8px 2px',padding:'8px 13px',maxWidth:'80%',fontSize:12,lineHeight:1.6}}>{msg.text} 🔮</div>:<div key={i} style={{alignSelf:'flex-end',background:'rgba(224,96,126,0.1)',border:'1px solid rgba(224,96,126,0.2)',borderRadius:'8px 8px 2px 8px',padding:'8px 13px',maxWidth:'80%',fontSize:12}}>{msg.text}</div>))}</div><div style={{display:'flex',gap:7}}><input placeholder="Ask about any market..." value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')handleChat();}} style={{flex:1,background:'var(--bg4)',border:'1px solid var(--border)',borderRadius:5,padding:'8px 12px',color:'var(--text)',fontSize:12,outline:'none'}} /><button className="btn btn-gold" style={{fontSize:10,padding:'6px 11px'}} onClick={handleChat}>ASK</button></div></div>
        </div>
      </div>
    </div>
  );
}
