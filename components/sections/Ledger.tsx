'use client';
import { useState } from 'react';
const ENTRIES = [
  { num:'01', token:'$BER', extraction:'~$128K', pattern:'Coordinated dump post-listing', status:'EXPOSED', detail:'Linked wallets executed coordinated sell pressure within 48h of listing. Classic exit liquidity play targeting retail.' },
  { num:'02', token:'$PUNCH', extraction:'~$3.5–5M+', pattern:'Serial extraction — dev wallet drains, LP pulls', status:'EXPOSED', detail:'Same dev infrastructure across multiple rugged tokens. Wallets share common funding source and timing signatures.' },
  { num:'03', token:'$JELLYBEAN', extraction:'~$600K–1M+', pattern:'Cabal wallet relay patterns, structured exits', status:'EXPOSED', detail:'Wallet cluster analysis revealed structured exit strategy. Multiple wallets funded from same source executed staggered sells.' },
  { num:'04', token:'$URANUS', extraction:'~$3.5–5M+', pattern:'Coordinated insider dump, known relay wallets', status:'EXPOSED', detail:'Known relay wallets from previous investigations. Coordinated insider dump confirmed through on-chain timing analysis.' },
  { num:'05', token:'$PIGEON', extraction:'~$500K–1M+', pattern:'LP pulls, ghost wallet exits', status:'EXPOSED', detail:'Liquidity pulled through ghost wallets. Pattern matches known extraction playbook from previous cases.' },
  { num:'06', token:'$HOOD', extraction:'~$12–20M+', pattern:'Large-scale dev extraction, insider coordination', status:'EXPOSED', detail:'Large-scale developer extraction with insider coordination. One of the largest documented cases in the YAKK series.' },
  { num:'07', token:'$M3M3', extraction:'~$15–25M+', pattern:'Repeat cabal operators, multi-token ring', status:'EXPOSED', detail:'Repeat cabal operators running a multi-token extraction ring. Same 15 wallets identified across multiple tokens.' },
  { num:'08', token:'$TRUMP', extraction:'~$1B–3.9B+', pattern:'Largest documented — political memecoin exploitation', status:'EXPOSED', detail:'The largest documented memecoin extraction in history. Political memecoin exploitation at unprecedented scale.' },
  { num:'09', token:'$WATDOG', extraction:'~$300K–500K+', pattern:'Wallet convergence, relay exits', status:'EXPOSED', detail:'Wallet convergence analysis confirmed relay exit patterns. Community-reported and verified through on-chain forensics.' },
  { num:'10', token:'$WAR', extraction:'~$8–15M+', pattern:'DSKtmLoz $7.98M silent hold, 44-day live infrastructure', status:'EXPOSED', detail:'DSKtmLoz wallet held $7.98M silently for 44 days before executing through live infrastructure.' },
  { num:'11', token:'$BUTTCOIN', extraction:'~$5–8M+ net', pattern:'57-day investigation · $186M tracked · Highest ghost ratio', status:'EXPOSED', detail:'57-day investigation. FFcYgSSg hub $3.01M net. 7abmyox relay $1.53M. 9GVJockJ convergence $2.38M+. 6 ghost exits in top 13. $186,427,275 tracked. Highest ghost ratio documented.' },
  { num:'12', token:'$PUMP', extraction:'~$4.02B distributed · $5.81B+ net/overhang', pattern:'1.23M txs · 1,252 CSVs · 2 hubs · 928 pre-seeded wallets · 75-sec "buyback" relay · Gini 0.9571', status:'EXPOSED', detail:'Investigation #12 — 9-month deep dive. CA: pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn. Dataset: 1,252 Solscan CSV exports, 1,230,222 transfers >$1K, $25,546,223,576 total tracked volume (Jul 12 2025 → Apr 8 2026). PRE-LAUNCH BUNDLING: Two hubs distributed $4.02B to 928 pre-seeded wallets 48 hours before public launch. Hub 1 (Cfq1ts1i…bgZt) sent $3,351,517,962 to 77 wallets; Hub 2 (5D95TQGU…L2oj) sent $670,057,757 to 851 wallets in a single 44-minute window on Jul 12. LAUNCH BURST: July 14 produced $3,952,423,485 in one day — majority concentrated into a 90-second window (12:18–12:20 UTC) across 8 wallets. Single biggest transfer: $578,761,043 to 8UhbNoBX…TogC (zero outflow, still holding). SILENT OVERHANG: 12 wallets received direct from Hub 1 and have never sent a single outbound transfer in the entire 9-month dataset — $1,631,584,995 in unrealised positions sitting above retail. NET EXTRACTORS: $4,176,939,665 confirmed sent-much-greater-than-received across the top coordinated wallets. "BUYBACK" NARRATIVE: Sep 11 produced a $489,372,123 day; traced in 75 seconds to a relay chain (Hub 1 → EaR9UPcF…eREu → FWznbcNX…ouN5) — pre-existing supply routed between coordinated wallets, no open-market purchase required. VOLUME FARMING: still running 9 months post-launch — March 2026 logged 481,531 transactions @ $1.17B, the highest tx count in the dataset. CROSS-INVESTIGATION: serial router ARu4n5mF…5SZn is now confirmed active in all 12 YAKK investigations ($24.4M tracked volume in $PUMP alone); multi-token hub router AgmLJBMD…zN51 confirmed with $1.11M sent (88 txs), also flagged in the @daumenxyz KOL Exposé case. Gini 0.9571 (far above 0.85 HIGH_RISK threshold). Classification: CABAL / FARMED — Tier 1. Full methodology + 1,252 CSV index: /news/pump-expose.html.' },
];
export default function Ledger({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const gated = !walletConnected || ystBalance < 250000;
  return (
    <section id="section-ledger" className="sec-pad">
      <div className="sec-header">
        <div className="sec-eyebrow">09 — THE BOOK OF SIN</div>
        <div className="sec-title">Rug Ledger <span className="badge b-red" style={{marginLeft:'0.5rem',fontSize:11}}>{ENTRIES.length} EXPOSED</span></div>
        <div className="sec-bar" />
      </div>
      <div className="warn-bar">NOT FINANCIAL ADVICE — Structural estimates only. On-chain behavioral analysis. Patterns ≠ proof of intent. DYOR.</div>
      <div style={{background:'rgba(239,68,68,0.04)',border:'1px solid rgba(239,68,68,0.18)',borderRadius:9,padding:'20px 24px',marginBottom:20}}>
        <div style={{fontFamily:'Space Mono,monospace',fontSize:9,color:'var(--red)',letterSpacing:'0.18em',marginBottom:5}}>YAKK CABAL CUMULATIVE RUG LEDGER</div>
        <div style={{fontFamily:'Syne,sans-serif',fontWeight:800,fontSize:'clamp(24px,5vw,36px)',color:'var(--red)'}}>~$5.22B–$9.79B+</div>
        <div style={{fontSize:12,color:'var(--muted)',marginTop:5}}>{ENTRIES.length} investigations · 1.23M txs tracked in $PUMP alone · The ledger never closes.</div>
      </div>
      {gated && (<div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:6,padding:'10px 14px',marginBottom:16,fontSize:11,color:'var(--dim)'}}>🔒 250,000+ $YST required for full investigation details — <span style={{color:'var(--muted)'}}>Connect wallet to verify</span></div>)}
      <div style={{overflow:'hidden',borderRadius:9,border:'1px solid var(--border)'}}>
        <div style={{overflowX:'auto',WebkitOverflowScrolling:'touch' as any}}>
          <table style={{tableLayout:'fixed',width:'100%',minWidth:560,borderCollapse:'collapse',fontSize:12}}>
            <colgroup><col style={{width:32}} /><col style={{width:100}} /><col style={{width:160}} /><col /><col style={{width:88}} /></colgroup>
            <thead>
              <tr style={{background:'var(--bg4)'}}>
                {['#','TOKEN','EXTRACTION EST.','KEY PATTERN','STATUS'].map(h=>(<th key={h} style={{padding:'10px',textAlign:'left',fontWeight:700,fontSize:10,letterSpacing:'0.8px',color:'var(--muted)',textTransform:'uppercase',fontFamily:'Syne,sans-serif',whiteSpace:'nowrap',borderBottom:'1px solid var(--border)'}}>{h}</th>))}
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map(e=>(<>
                <tr key={e.token} onClick={()=>setSelected(selected===e.token?null:e.token)} style={{cursor:'pointer',background:selected===e.token?'var(--bg4)':'transparent'}}>
                  <td style={{padding:'10px',color:'var(--dim)',fontFamily:'Space Mono,monospace',fontSize:9,borderTop:'1px solid var(--border)'}}>{e.num}</td>
                  <td style={{padding:'10px',color:'#fff',fontWeight:700,fontFamily:'Syne,sans-serif',fontSize:12,borderTop:'1px solid var(--border)'}}>{e.token}</td>
                  <td style={{padding:'10px',fontFamily:'Space Mono,monospace',fontSize:11,borderTop:'1px solid var(--border)'}}>{e.extraction}</td>
                  <td style={{padding:'10px',fontSize:11,color:'var(--muted)',lineHeight:1.5,borderTop:'1px solid var(--border)'}}>{e.pattern}</td>
                  <td style={{padding:'10px',borderTop:'1px solid var(--border)'}}><span className="badge b-red">{e.status}</span></td>
                </tr>
                {selected===e.token&&(<tr key={e.token+'-d'} style={{background:'var(--bg3)'}}><td colSpan={5} style={{padding:'12px 14px',fontSize:12,color:'var(--muted)',borderTop:'1px solid var(--border)',lineHeight:1.7}}>{e.detail}</td></tr>)}
              </>))}
              <tr style={{background:'rgba(247,201,72,0.04)',borderTop:'1px solid rgba(247,201,72,0.15)'}}>
                <td colSpan={2} style={{padding:'10px',fontFamily:'Syne,sans-serif',fontWeight:800,color:'var(--gold)',fontSize:12,borderTop:'2px solid rgba(247,201,72,0.3)'}}>RUNNING TOTAL</td>
                <td style={{padding:'10px',fontFamily:'Space Mono,monospace',fontSize:17,fontWeight:700,color:'var(--red)',borderTop:'2px solid rgba(247,201,72,0.3)'}}>~$5.22B–$9.79B+</td>
                <td colSpan={2} style={{padding:'10px',fontSize:11,color:'var(--red)',fontStyle:'italic',borderTop:'2px solid rgba(247,201,72,0.3)'}}>Twelve tokens · $PUMP alone: 1,252 CSVs / 1.23M txs / $25.55B volume tracked.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p style={{fontSize:11,color:'var(--dim)',marginTop:16,fontStyle:'italic'}}>Full $PUMP investigation → <a href="/news/pump-expose.html" style={{color:'var(--red)'}}>read the deep dive</a>. New investigations added as evidence is confirmed. Submit a tip via Cabal Scanner.</p>
    </section>
  );
}
