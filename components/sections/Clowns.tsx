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
  tokens?: string[];       // tokens they were connected to
  linkedTo?: string[];     // other KOLs sharing dev wallets
}

const KOLS: Kol[] = [
  // TIER 1 ───────────────────────────────────────────────────────────────────
  {
    handle: 'runitbackghost', name: 'S', tier: 1,
    sol: '3,229', usd: '$1,118,549', devWallets: 2, connectionType: 'DIRECT',
    notes: 'Largest total received in the entire report. Single transfers in the thousands of SOL.',
  },
  {
    handle: 'Chestererer', name: 'chester', tier: 1,
    sol: '2,590', usd: '$439,049', devWallets: 1, connectionType: 'DIRECT',
    notes: 'Second largest single transfer in the report.',
  },
  {
    handle: 'risk100x', name: 'Risk', tier: 1,
    sol: '2,895+', usd: '$265,358+', devWallets: 3, connectionType: 'MIXED',
    notes: 'Most dev wallet appearances of any KOL in the report. Repeated pattern across multiple tokens.',
  },
  {
    handle: 'fnmilito', name: 'milito', tier: 1,
    sol: '1,085', usd: '$154,378', devWallets: 1, connectionType: 'DIRECT',
    notes: 'Over 1,000 SOL in a single direct transfer from a flagged dev wallet.',
  },
  {
    handle: 'ClownsTrenches', name: 'Clown', tier: 1,
    sol: '902', usd: '$105,635', devWallets: 1, connectionType: 'DIRECT',
    linkedTo: ['theunipcs', 'gr3gor14n'],
    notes: 'Dev wallet CzbN6T also sent 902 SOL to @theunipcs and @gr3gor14n. Hub-and-spoke pattern.',
  },
  {
    handle: 'zukiweb3', name: 'Zuki', tier: 1,
    sol: '888+', usd: '$82,306+', devWallets: 3, connectionType: 'MIXED',
    linkedTo: ['notdecu', 'Qavecc', 'Blueycryp', 'lyftical'],
    notes: 'Connected via intermediary wallet 3aYEDB — same hub linking multiple KOLs.',
  },
  {
    handle: 'Cented7', name: 'Cented', tier: 1,
    sol: '777+', usd: '$71,217+', devWallets: 4, connectionType: 'OWN WALLET',
    notes: 'Own wallet flagged as dev wallet. Listed as both recipient and operator. High-conviction own-wallet flag.',
  },
  {
    handle: 'Qavecc', name: 'Qavec', tier: 1,
    sol: '657+', usd: '$60,717+', devWallets: 2, connectionType: 'MIXED',
    linkedTo: ['zukiweb3', 'notdecu'],
  },
  {
    handle: 'notdecu', name: 'decu', tier: 1,
    usd: '>$100K indirect', devWallets: 1, connectionType: 'INDIRECT',
    linkedTo: ['zukiweb3', 'Qavecc', 'Blueycryp'],
    notes: '1,500 SOL routed via intermediary. "Particularly notable given the size."',
  },
  {
    handle: 'finnbags', name: 'FINN', tier: 1,
    sol: '60+', usd: '$5,500+', devWallets: 4, connectionType: 'DIRECT',
    notes: '"Consistently receiving SOL from flagged addresses" across multiple token investigations.',
  },
  {
    handle: 'coinsolmaxi', name: 'Hermes', tier: 1,
    devWallets: 3, connectionType: 'MIXED',
    notes: '"One of the most frequently linked influencers in the report." Appears across multiple separate investigations.',
  },
  {
    handle: 'Megga', name: 'Megga', tier: 1,
    devWallets: 1, connectionType: 'DIRECT',
    notes: '"Very strong connection" and "particularly high-conviction link." Single direct transfer flagged.',
  },
  // TIER 2 ───────────────────────────────────────────────────────────────────
  {
    handle: 'meechie', name: 'meechie', tier: 2,
    devWallets: 1, connectionType: 'OWN WALLET',
    notes: 'Own wallet listed as both main wallet and flagged dev wallet. Self-incriminating pattern.',
  },
  {
    handle: 'donuttcrypto', name: 'donutt', tier: 2,
    sol: '119.97', usd: '$11,039', devWallets: 1, connectionType: 'DIRECT',
  },
  {
    handle: 'ImTheBetman', name: 'Betman', tier: 2,
    sol: '43.15', usd: '$3,987', devWallets: 1, connectionType: 'DIRECT',
  },
  {
    handle: 'kadenox', name: 'kadenox', tier: 2,
    sol: '4.30+', devWallets: 2, connectionType: 'MIXED',
    linkedTo: ['Cented7'],
    notes: 'Also connected via @Cented7 flagged wallet.',
  },
  {
    handle: 'Yennii56', name: 'Yennii', tier: 2,
    sol: '10', usd: '$926', devWallets: 1, connectionType: 'DIRECT',
  },
  {
    handle: 'igndex', name: 'igndex', tier: 2,
    sol: '10.40', usd: '$953', devWallets: 1, connectionType: 'DIRECT',
  },
  {
    handle: 'theunipcs', name: 'Bonk Guy', tier: 2,
    usd: 'Token transfer', devWallets: 1, connectionType: 'DIRECT',
    linkedTo: ['ClownsTrenches', 'gr3gor14n'],
    notes: 'Shares dev wallet CzbN6T with @ClownsTrenches. 902 SOL sent through same hub.',
  },
  {
    handle: 'gr3gor14n', name: 'gr3gor14n', tier: 2,
    usd: 'Token transfer', devWallets: 1, connectionType: 'DIRECT',
    linkedTo: ['ClownsTrenches', 'theunipcs'],
    notes: 'Shares dev wallet CzbN6T with @ClownsTrenches.',
  },
  {
    handle: 'himothy', name: 'himothy', tier: 2,
    usd: 'Small indirect', devWallets: 2, connectionType: 'INDIRECT',
  },
  {
    handle: 'Blueycryp', name: 'Bluey', tier: 2,
    devWallets: 1, connectionType: 'INDIRECT',
    linkedTo: ['notdecu', 'Qavecc', 'zukiweb3'],
    notes: 'Via intermediary 3aYEDB — same hub as @notdecu, @Qavecc, @zukiweb3.',
  },
  {
    handle: 'lyftical', name: 'lyftical', tier: 2,
    devWallets: 1, connectionType: 'INDIRECT',
    linkedTo: ['zukiweb3'],
    notes: 'Via intermediary 3aYEDB.',
  },
  // TIER 3 — listed for completeness
  ...(['TheRealZrool','s1mple_s1mple','cladzsol','tdmilky','im0pnl','Al4neu',
    'slingoorio','ColerCooks','NADGEMS','fz7','LeckSol','CookerFlips',
    'vibed333','treysocial','imsheepsol','Log100x','zXDuckyXz','matsu_sol',
    'yodefv','SmokezXBT','radiancebrr','kreo444','beaverd'] as string[]).map((h): Kol => ({
    handle: h, name: h, tier: 3, sol: '0.002–5+', devWallets: 1,
    connectionType: 'INDIRECT', notes: 'Weak signal. Verify independently before drawing conclusions.',
  })),
];

const SPECIAL: Kol = {
  handle: 'daumenxyz', name: 'daumenxyz', tier: 'special',
  sol: '0.53 direct + $241K flagged hub', devWallets: 2, connectionType: 'MIXED',
  notes: 'Only name appearing in BOTH @postmodernism KOL research AND independent $PUNCH investigation. Publicly challenged findings — creating the double-sourced confirmation.',
};

const TIER_CFG = {
  1:       { label: 'TIER 1 — HIGHEST CONVICTION', color: '#ff3a5c', bg: 'rgba(255,58,92,0.08)',   border: 'rgba(255,58,92,0.25)'   },
  2:       { label: 'TIER 2 — MEDIUM CONVICTION',  color: '#ff9900', bg: 'rgba(255,153,0,0.06)',   border: 'rgba(255,153,0,0.2)'    },
  3:       { label: 'TIER 3 — WEAK / NOTABLE',     color: '#555',    bg: 'rgba(80,80,80,0.05)',    border: 'rgba(80,80,80,0.15)'    },
  special: { label: '⚡ SPECIAL CASE',             color: '#e040fb', bg: 'rgba(224,64,251,0.08)', border: 'rgba(224,64,251,0.25)'  },
};

const CONN_COLOR: Record<string,string> = {
  DIRECT: '#ff3a5c', INDIRECT: '#ff9900', MIXED: '#e040fb', 'OWN WALLET': '#ff3a5c',
};

function KolCard({ k }: { k: Kol }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TIER_CFG[k.tier];
  const hasExtra = !!(k.notes || (k.linkedTo && k.linkedTo.length > 0));

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: 8,
        overflow: 'hidden',
        transition: 'border-color 0.15s',
      }}
    >
      {/* ── Card header — always visible ─────────────────────────── */}
      <div
        style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, cursor: hasExtra ? 'pointer' : 'default' }}
        onClick={() => hasExtra && setExpanded(e => !e)}
      >
        {/* Row 1: handle + badges */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a
              href={`https://x.com/${k.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ color: cfg.color, fontWeight: 700, fontSize: 13, textDecoration: 'none', fontFamily: 'monospace' }}
            >
              @{k.handle}
            </a>
            {k.name !== k.handle && (
              <span style={{ color: '#777', fontSize: 11 }}>&quot;{k.name}&quot;</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: `${cfg.color}22`, color: cfg.color, fontWeight: 700 }}>
              {TIER_CFG[k.tier].label.split('—')[0].trim()}
            </span>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: `${CONN_COLOR[k.connectionType]}22`, color: CONN_COLOR[k.connectionType], fontWeight: 700 }}>
              {k.connectionType}
            </span>
            <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#666' }}>
              {k.devWallets} dev wallet{k.devWallets !== 1 ? 's' : ''}
            </span>
            {hasExtra && (
              <span style={{ fontSize: 9, color: '#555', marginLeft: 2 }}>{expanded ? '▲' : '▼'}</span>
            )}
          </div>
        </div>

        {/* Row 2: amounts if available */}
        {(k.sol || k.usd) && (
          <div style={{ display: 'flex', gap: 12, fontSize: 12, fontFamily: 'monospace', color: '#ccc', flexWrap: 'wrap' }}>
            {k.sol && (
              <span>
                <span style={{ color: '#555', fontSize: 9, marginRight: 4 }}>RECEIVED</span>
                <span style={{ color: '#f7c948', fontWeight: 700 }}>{k.sol} SOL</span>
              </span>
            )}
            {k.usd && (
              <span>
                <span style={{ color: '#555', fontSize: 9, marginRight: 4 }}>≈</span>
                <span style={{ color: '#aaa' }}>{k.usd}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Expanded detail panel ─────────────────────────────────── */}
      {expanded && hasExtra && (
        <div style={{
          padding: '0 14px 14px 14px',
          borderTop: `1px solid ${cfg.border}`,
          paddingTop: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {k.notes && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 5,
              padding: '8px 12px',
              fontSize: 11,
              color: '#aaa',
              lineHeight: 1.6,
            }}>
              <span style={{ color: '#555', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>Evidence note</span>
              {k.notes}
            </div>
          )}
          {k.linkedTo && k.linkedTo.length > 0 && (
            <div>
              <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 6 }}>
                Shares dev infrastructure with
              </span>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {k.linkedTo.map(h => (
                  <a
                    key={h}
                    href={`https://x.com/${h}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 10, color: '#e040fb', background: 'rgba(224,64,251,0.08)', border: '1px solid rgba(224,64,251,0.2)', borderRadius: 3, padding: '2px 7px', textDecoration: 'none', fontFamily: 'monospace' }}
                  >
                    @{h}
                  </a>
                ))}
              </div>
            </div>
          )}
          <a
            href={`https://x.com/${k.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
            style={{ fontSize: 9, padding: '3px 10px', alignSelf: 'flex-start', borderColor: cfg.color, color: cfg.color }}
          >
            View @{k.handle} on X ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function Clowns({ walletConnected, ystBalance, onNavigate }: Props) {
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3 | 'special'>('all');
  const [search, setSearch] = useState('');

  const tier1   = KOLS.filter(k => k.tier === 1);
  const tier2   = KOLS.filter(k => k.tier === 2);
  const tier3   = KOLS.filter(k => k.tier === 3);

  const visible = (list: Kol[], t: 1 | 2 | 3) =>
    list.filter(k =>
      (filter === 'all' || filter === t) &&
      (!search || k.handle.toLowerCase().includes(search.toLowerCase()) || k.name.toLowerCase().includes(search.toLowerCase()))
    );

  const showSpecial =
    (filter === 'all' || filter === 'special') &&
    (!search || SPECIAL.handle.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="sec-pad">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sec-header">
        <div className="sec-bar" />
        <div className="sec-title">🤡 CERTIFIED CLOWNS</div>
        <div className="sec-sub">
          Known bad actors and shill merchants tracked by on-chain forensics.
          Patterns are not proof of wrongdoing. Verify independently at{' '}
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pink)' }}>Solscan</a>.
          Click any card to expand evidence detail.
        </div>
      </div>

      {/* ── Summary stats ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
        {[
          ['39 KOL wallets', '#ff3a5c'],
          ['113+ dev wallets blacklisted', '#ff9900'],
          ['$3.98B+ extraction floor', '#e040fb'],
          ['11 tokens investigated', '#4fc3f7'],
        ].map(([label, color]) => (
          <div
            key={String(label)}
            style={{ fontSize: 10, fontWeight: 700, color, background: `${color}11`, border: `1px solid ${color}33`, borderRadius: 4, padding: '4px 10px' }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* ── Sources ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <a
          href="/news/kol-expose.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,58,92,0.1)', border: '1px solid rgba(255,58,92,0.3)', borderRadius: 6, padding: '7px 14px', color: 'var(--pink)', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}
        >
          📄 Full KOL Exposé Report
        </a>
        <span style={{ fontSize: 10, color: '#555' }}>
          Research:{' '}
          <a href="https://x.com/degengamblah" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>@degengamblah</a>
          {' '}·{' '}
          <a href="https://x.com/postmodernism" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>@postmodernism</a>
          {' '}·{' '}
          <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" style={{ color: '#777' }}>$YAKK Cabal</a>
        </span>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, alignItems: 'center' }}>
        {(['all', 1, 2, 3, 'special'] as const).map(f => (
          <button
            key={String(f)}
            onClick={() => setFilter(f)}
            style={{
              padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              border: '1px solid',
              borderColor: filter === f ? 'var(--pink)' : '#2a2a2a',
              background: filter === f ? 'rgba(255,58,92,0.12)' : 'transparent',
              color: filter === f ? 'var(--pink)' : '#555',
            }}
          >
            {f === 'all' ? 'ALL' : f === 'special' ? 'SPECIAL' : `TIER ${f}`}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search handle..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 11, background: '#111', border: '1px solid #2a2a2a', borderRadius: 4, color: '#ccc', width: 160, outline: 'none' }}
        />
      </div>

      {/* ── Special case ───────────────────────────────────────────────── */}
      {showSpecial && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#e040fb', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
            ⚡ SPECIAL CASE — DOUBLE-SOURCED
          </div>
          <KolCard k={SPECIAL} />
        </div>
      )}

      {/* ── Tier 1 ─────────────────────────────────────────────────────── */}
      {visible(tier1, 1).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff3a5c', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            TIER 1 — HIGHEST CONVICTION
            <span style={{ color: '#ff3a5c', background: 'rgba(255,58,92,0.12)', borderRadius: 3, padding: '1px 7px', fontWeight: 400 }}>
              {visible(tier1, 1).length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible(tier1, 1).map(k => <KolCard key={k.handle} k={k} />)}
          </div>
        </div>
      )}

      {/* ── Tier 2 ─────────────────────────────────────────────────────── */}
      {visible(tier2, 2).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#ff9900', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            TIER 2 — MEDIUM CONVICTION
            <span style={{ color: '#ff9900', background: 'rgba(255,153,0,0.1)', borderRadius: 3, padding: '1px 7px', fontWeight: 400 }}>
              {visible(tier2, 2).length}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible(tier2, 2).map(k => <KolCard key={k.handle} k={k} />)}
          </div>
        </div>
      )}

      {/* ── Tier 3 — compact pill list ──────────────────────────────────── */}
      {visible(tier3, 3).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#555', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>
            TIER 3 — WEAK SIGNAL / NOTABLE
            <span style={{ color: '#555', background: 'rgba(80,80,80,0.1)', borderRadius: 3, padding: '1px 7px', fontWeight: 400 }}>
              {visible(tier3, 3).length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {visible(tier3, 3).map(k => (
              <a
                key={k.handle}
                href={`https://x.com/${k.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 10, color: '#555', background: '#141414', border: '1px solid #252525', borderRadius: 4, padding: '3px 8px', textDecoration: 'none', fontFamily: 'monospace' }}
              >
                @{k.handle}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Disclaimer ─────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 14px', background: 'rgba(255,153,0,0.04)', border: '1px solid rgba(255,153,0,0.12)', borderRadius: 6, fontSize: 10, color: '#555', lineHeight: 1.7 }}>
        All data publicly verifiable on-chain at Solscan.io. Patterns do not constitute proof of wrongdoing.
        This list is maintained for community awareness. Not financial advice. Not legal advice. Verify independently.
      </div>
    </div>
  );
}
