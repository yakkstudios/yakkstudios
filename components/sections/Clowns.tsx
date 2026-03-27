'use client';

import { useState } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

interface Kol {
  handle: string;
  name: string;
  tier: 1 | 2 | 3 | 'special';
  sol?: string;
  usd?: string;
  devWallets: number;
  connectionType: 'DIRECT' | 'INDIRECT' | 'MIXED' | 'OWN WALLET';
  notes?: string;
}

const KOLS: Kol[] = [
  // TIER 1
  { handle: 'runitbackghost', name: 'S', tier: 1, sol: '3,229', usd: '$1,118,549', devWallets: 2, connectionType: 'DIRECT', notes: 'Largest total received in the entire report.' },
  { handle: 'Chestererer', name: 'chester', tier: 1, sol: '2,590', usd: '$439,049', devWallets: 1, connectionType: 'DIRECT', notes: 'Second largest single transfer in the report.' },
  { handle: 'risk100x', name: 'Risk', tier: 1, sol: '2,895+', usd: '$265,358+', devWallets: 3, connectionType: 'MIXED', notes: 'Most dev wallet appearances of any KOL in the report.' },
  { handle: 'fnmilito', name: 'milito', tier: 1, sol: '1,085', usd: '$154,378', devWallets: 1, connectionType: 'DIRECT', notes: 'Over 1,000 SOL in a single direct transfer.' },
  { handle: 'ClownsTrenches', name: 'Clown', tier: 1, sol: '902', usd: '$105,635', devWallets: 1, connectionType: 'DIRECT', notes: 'Same dev wallet also connected to @theunipcs and @gr3gor14n.' },
  { handle: 'zukiweb3', name: 'Zuki', tier: 1, sol: '888+', usd: '$82,306+', devWallets: 3, connectionType: 'MIXED' },
  { handle: 'Cented7', name: 'Cented', tier: 1, sol: '777+', usd: '$71,217+', devWallets: 4, connectionType: 'OWN WALLET', notes: 'Own wallet flagged as dev wallet. Appears as both recipient and operator.' },
  { handle: 'Qavecc', name: 'Qavec', tier: 1, sol: '657+', usd: '$60,717+', devWallets: 2, connectionType: 'MIXED' },
  { handle: 'notdecu', name: 'decu', tier: 1, usd: '>$100K indirect', devWallets: 1, connectionType: 'INDIRECT', notes: '1,500 SOL via intermediary. "Particularly notable given the size."' },
  { handle: 'finnbags', name: 'FINN', tier: 1, sol: '60+', usd: '$5,500+', devWallets: 4, connectionType: 'DIRECT', notes: '"Consistently receiving SOL from flagged addresses."' },
  { handle: 'coinsolmaxi', name: 'Hermes', tier: 1, devWallets: 3, connectionType: 'MIXED', notes: '"One of the most frequently linked influencers in the report."' },
  { handle: 'Megga', name: 'Megga', tier: 1, devWallets: 1, connectionType: 'DIRECT', notes: '"Very strong connection" and "particularly high-conviction link."' },
  // TIER 2
  { handle: 'meechie', name: 'meechie', tier: 2, devWallets: 1, connectionType: 'OWN WALLET', notes: 'Own wallet listed as both main and flagged dev wallet.' },
  { handle: 'donuttcrypto', name: 'donutt', tier: 2, sol: '119.97', usd: '$11,039', devWallets: 1, connectionType: 'DIRECT' },
  { handle: 'ImTheBetman', name: 'Betman', tier: 2, sol: '43.15', usd: '$3,987', devWallets: 1, connectionType: 'DIRECT' },
  { handle: 'kadenox', name: 'kadenox', tier: 2, sol: '4.30+', devWallets: 2, connectionType: 'MIXED', notes: 'Also connected via @Cented7 flagged wallet.' },
  { handle: 'Yennii56', name: 'Yennii', tier: 2, sol: '10', usd: '$926', devWallets: 1, connectionType: 'DIRECT' },
  { handle: 'igndex', name: 'igndex', tier: 2, sol: '10.40', usd: '$953', devWallets: 1, connectionType: 'DIRECT' },
  { handle: 'theunipcs', name: 'Bonk Guy', tier: 2, usd: 'Token transfer', devWallets: 1, connectionType: 'DIRECT', notes: 'Same dev wallet sent 902 SOL to @ClownsTrenches.' },
  { handle: 'gr3gor14n', name: 'gr3gor14n', tier: 2, usd: 'Token transfer', devWallets: 1, connectionType: 'DIRECT', notes: 'Shares dev wallet CzbN6T with @ClownsTrenches.' },
  { handle: 'himothy', name: 'himothy', tier: 2, usd: 'Small indirect', devWallets: 2, connectionType: 'INDIRECT' },
  { handle: 'Blueycryp', name: 'Bluey', tier: 2, devWallets: 1, connectionType: 'INDIRECT', notes: 'Via intermediary 3aYEDB (same wallet as @notdecu, @Qavecc, @zukiweb3).' },
  { handle: 'lyftical', name: 'lyftical', tier: 2, devWallets: 1, connectionType: 'INDIRECT', notes: 'Via intermediary 3aYEDB.' },
  // TIER 3
  ...(['TheRealZrool','s1mple_s1mple','cladzsol','tdmilky','im0pnl','Al4neu',
    'slingoorio','ColerCooks','NADGEMS','fz7','LeckSol','CookerFlips',
    'vibed333','treysocial','imsheepsol','Log100x','zXDuckyXz','matsu_sol',
    'yodefv','SmokezXBT','radiancebrr','kreo444','beaverd'] as string[]).map((h): Kol => ({
    handle: h, name: h, tier: 3, sol: '0.002-5+', devWallets: 1,
    connectionType: 'INDIRECT', notes: 'Listed for completeness. Verify before judging.',
  })),
];

const SPECIAL: Kol = {
  handle: 'daumenxyz', name: 'daumenxyz', tier: 'special',
  sol: '0.53 direct + $241K flagged hub', devWallets: 2, connectionType: 'MIXED',
  notes: 'Only name in BOTH @postmodernism KOL research AND independent $PUNCH investigation. Publicly challenged findings.',
};

const TIER_CFG = {
  1:       { label: 'TIER 1', color: '#ff3a5c', bg: 'rgba(255,58,92,0.08)'   },
  2:       { label: 'TIER 2', color: '#ff9900', bg: 'rgba(255,153,0,0.08)'   },
  3:       { label: 'TIER 3', color: '#666',    bg: 'rgba(102,102,102,0.06)' },
  special: { label: 'SPECIAL',color: '#e040fb', bg: 'rgba(224,64,251,0.10)' },
};
const CONN_COLOR: Record<string,string> = {
  DIRECT:'#ff3a5c', INDIRECT:'#ff9900', MIXED:'#e040fb', 'OWN WALLET':'#ff3a5c',
};

function KolCard({ k }: { k: Kol }) {
  const cfg = TIER_CFG[k.tier];
  return (
    <div style={{ background: cfg.bg, border: `1px solid ${cfg.color}22`, borderLeft: `3px solid ${cfg.color}`, borderRadius: 6, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <a href={`https://x.com/${k.handle}`} target="_blank" rel="noopener noreferrer"
          style={{ color: cfg.color, fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'monospace' }}>
          @{k.handle}
          {k.name !== k.handle && <span style={{ color: '#aaa', fontWeight: 400, marginLeft: 6 }}>"{k.name}"</span>}
        </a>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${cfg.color}22`, color: cfg.color, fontWeight: 700 }}>{cfg.label}</span>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: `${CONN_COLOR[k.connectionType]}22`, color: CONN_COLOR[k.connectionType], fontWeight: 700 }}>{k.connectionType}</span>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#888' }}>{k.devWallets} dev wallet{k.devWallets !== 1 ? 's' : ''}</span>
        </div>
      </div>
      {(k.sol || k.usd) && (
        <div style={{ fontSize: 12, color: '#ddd', fontFamily: 'monospace' }}>
          {k.sol && <span>{k.sol} SOL</span>}
          {k.sol && k.usd && <span style={{ color: '#555', margin: '0 6px' }}>·</span>}
          {k.usd && <span style={{ color: '#aaa' }}>{k.usd}</span>}
        </div>
      )}
      {k.notes && <div style={{ fontSize: 11, color: '#777', fontStyle: 'italic', lineHeight: 1.4 }}>{k.notes}</div>}
    </div>
  );
}

export default function Clowns({ walletConnected, ystBalance, onNavigate }: Props) {
  const [filter, setFilter] = useState<'all'|1|2|3|'special'>('all');
  const [search, setSearch] = useState('');

  const tier1 = KOLS.filter(k => k.tier === 1);
  const tier2 = KOLS.filter(k => k.tier === 2);
  const tier3 = KOLS.filter(k => k.tier === 3);

  const visible = (list: Kol[], t: 1|2|3) =>
    list.filter(k => (filter === 'all' || filter === t) &&
      (!search || k.handle.toLowerCase().includes(search.toLowerCase())));

  const showSpecial = (filter === 'all' || filter === 'special') &&
    (!search || SPECIAL.handle.includes(search.toLowerCase()));

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">CERTIFIED CLOWNS</div>
        </div>
        <div className="sec-sub">
          Known bad actors &amp; shill merchants tracked by on-chain research.
          Patterns not equal proof of wrongdoing. Verify at{' '}
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>Solscan</a>.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {[['39 KOL wallets','#ff3a5c'],['113+ dev wallets blacklisted','#ff9900'],['$3.98B+ extraction floor','#e040fb'],['11 tokens investigated','#4fc3f7']].map(([label,color])=>(
          <div key={label} style={{ fontSize: 11, fontWeight: 700, color, background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 4, padding: '4px 10px' }}>{label}</div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <a href="/news/kol-expose.html" target="_blank" rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,58,92,0.1)', border: '1px solid rgba(255,58,92,0.3)', borderRadius: 6, padding: '7px 14px', color: 'var(--pink)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
          Full KOL Expose Article
        </a>
        <span style={{ fontSize: 11, color: '#555' }}>
          Research: <a href="https://x.com/degengamblah" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>@degengamblah</a> · <a href="https://x.com/postmodernism" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>@postmodernism</a> · <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>$YAKK Cabal</a>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        {(['all',1,2,3,'special'] as const).map(f=>(
          <button key={String(f)} onClick={()=>setFilter(f)}
            style={{ padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid', borderColor: filter===f?'var(--pink)':'#2a2a2a', background: filter===f?'rgba(255,58,92,0.12)':'transparent', color: filter===f?'var(--pink)':'#555' }}>
            {f==='all'?'ALL':f==='special'?'SPECIAL':`T${f}`}
          </button>
        ))}
        <input type="text" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 12, background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, color: '#ccc', width: 160 }} />
      </div>

      {showSpecial && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#e040fb', marginBottom: 8, letterSpacing: 1 }}>SPECIAL CASE - DOUBLE-SOURCED</div>
          <KolCard k={SPECIAL} />
        </div>
      )}
      {visible(tier1,1).length>0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff3a5c', marginBottom: 8, letterSpacing: 1 }}>TIER 1 - HIGHEST CONVICTION ({visible(tier1,1).length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{visible(tier1,1).map(k=><KolCard key={k.handle} k={k}/>)}</div>
        </div>
      )}
      {visible(tier2,2).length>0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#ff9900', marginBottom: 8, letterSpacing: 1 }}>TIER 2 - MEDIUM CONVICTION ({visible(tier2,2).length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{visible(tier2,2).map(k=><KolCard key={k.handle} k={k}/>)}</div>
        </div>
      )}
      {visible(tier3,3).length>0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#666', marginBottom: 8, letterSpacing: 1 }}>TIER 3 - WEAK / NOTABLE ({visible(tier3,3).length})</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {visible(tier3,3).map(k=>(
              <a key={k.handle} href={`https://x.com/${k.handle}`} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 11, color: '#666', background: '#181818', border: '1px solid #252525', borderRadius: 4, padding: '3px 8px', textDecoration: 'none', fontFamily: 'monospace' }}>
                @{k.handle}
              </a>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 24, padding: '10px 14px', background: 'rgba(255,153,0,0.05)', border: '1px solid rgba(255,153,0,0.15)', borderRadius: 6, fontSize: 11, color: '#666', lineHeight: 1.6 }}>
        All data publicly verifiable on-chain at Solscan. Patterns not equal proof of wrongdoing. Not financial advice.
      </div>
    </div>
  );
  }
