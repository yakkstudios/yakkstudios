'use client';
import { useState, useMemo } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   YAKK FORENSIC VIEW — v0.1
   Replaces the DexScreener iframe in Screener.tsx and Terminal.tsx.
   Mission: make the YAKK scoring + forensic data the hero, not candles.
   - SOL (bluechip): TradingView free embed (CEX price, not DEX)
   - YAKK targets (YST / LOCK / SPT / any forensic case): Forensic panel
   See CLAUDE.md §1 for design tokens (no Tailwind).
   ───────────────────────────────────────────────────────────────────────── */

interface RiskScore {
  score: number;
  grade: string;
  factors: string[];
}

interface ForensicToken {
  ticker: string;
  name: string;
  price: number;
  chg: number;
  dex: string;            // pair address
  mint?: string;
  pairAddress?: string;
  cat?: string;           // 'yakk' | 'bluechip' | ...
  quoteTicker?: string;
  risk?: RiskScore;
  /* Optional forensic fields — v0.1 shows placeholders if missing.
     Phase 2 will wire these from /api/gate-check + /api/screener.risk */
  gini?: number;                    // 0..1, distribution concentration
  topHolderPct?: number;             // % held by #1 holder
  lpLocked?: boolean | null;
  lpLockSource?: string;             // e.g. 'Streamflow' | 'PinkSale'
  cabalWallets?: number;             // count of flagged wallets currently holding
  netExtractorUsd?: number;          // $ tracked as net extraction
  holdersTotal?: number;
}

interface WhaleMove {
  side: 'BUY' | 'SELL';
  timeAgo: string;
  amountUsd: number;
  wallet: string;
  flagged?: boolean;
}

interface Props {
  token: ForensicToken;
  isMobile?: boolean;
  /* Live whale feed — if omitted, shows placeholder notice. */
  whaleFeed?: WhaleMove[];
}

/* ── TradingView symbol mapping for bluechips ─────────────────────────────
   Only used when token.cat === 'bluechip'. Extend as needed. */
const TV_SYMBOLS: Record<string, string> = {
  SOL:  'COINBASE:SOLUSD',
  BTC:  'COINBASE:BTCUSD',
  ETH:  'COINBASE:ETHUSD',
};

/* ── Formatters ───────────────────────────────────────────────────────── */
function fmtUsd(n: number | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

function giniColor(g: number): string {
  if (g >= 0.85) return '#f87171';   // HIGH_RISK per CLAUDE.md §3
  if (g >= 0.70) return '#fb923c';
  if (g >= 0.50) return '#f7c948';
  return '#4ade80';
}

function giniLabel(g: number): string {
  if (g >= 0.85) return 'HIGH RISK';
  if (g >= 0.70) return 'CONCENTRATED';
  if (g >= 0.50) return 'MODERATE';
  return 'DISTRIBUTED';
}

function riskColor(grade: string): string {
  switch (grade) {
    case 'A': return '#4ade80';
    case 'B': return '#86efac';
    case 'C': return '#f7c948';
    case 'D': return '#fb923c';
    case 'F': return '#f87171';
    default:  return '#9a9aa8';
  }
}

/* ── TradingView embed (SOL / bluechips only) ─────────────────────────── */
function TradingViewChart({ symbol, height }: { symbol: string; height: number }) {
  const src =
    'https://s.tradingview.com/widgetembed/?' +
    'frameElementId=tv_chart' +
    `&symbol=${encodeURIComponent(symbol)}` +
    '&interval=60' +
    '&theme=dark' +
    '&style=1' +
    '&toolbar_bg=%23050509' +
    '&hide_side_toolbar=1' +
    '&hide_top_toolbar=0' +
    '&hide_legend=0' +
    '&save_image=0' +
    '&locale=en';
  return (
    <div style={{
      height,
      borderRadius: 10,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      background: '#0a0a10',
    }}>
      <iframe
        key={symbol}
        src={src}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title={`${symbol} chart — TradingView`}
        loading="lazy"
      />
      <div style={{
        fontSize: 9, color: '#666', padding: '4px 10px',
        textAlign: 'right', background: '#0a0a10',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        Price data · TradingView (CEX aggregate)
      </div>
    </div>
  );
}

/* ── Main ForensicView ─────────────────────────────────────────────────── */
export default function ForensicView({ token, isMobile = false, whaleFeed = [] }: Props) {

  /* SOL / BTC / ETH — use TradingView, skip the forensic panel. */
  const tvSymbol = token.cat === 'bluechip' ? TV_SYMBOLS[token.ticker] : undefined;
  if (tvSymbol) {
    return <TradingViewChart symbol={tvSymbol} height={isMobile ? 280 : 380} />;
  }

  /* Else render the Forensic View. */
  const score = token.risk?.score ?? 0;
  const grade = token.risk?.grade ?? '—';
  const factors = token.risk?.factors ?? [];
  const gini = token.gini ?? null;
  const topPct = token.topHolderPct ?? null;
  const lpLocked = token.lpLocked;
  const cabalCount = token.cabalWallets ?? null;
  const netExtracted = token.netExtractorUsd ?? null;

  const [chartMenuOpen, setChartMenuOpen] = useState(false);
  const externalChartLinks = useMemo(() => {
    const pair = token.pairAddress || token.dex;
    const mint = token.mint || pair;
    return [
      { name: 'Birdeye',     url: `https://birdeye.so/token/${mint}?chain=solana` },
      { name: 'DexScreener', url: `https://dexscreener.com/solana/${pair}` },
      { name: 'GeckoTerminal', url: `https://www.geckoterminal.com/solana/pools/${pair}` },
    ];
  }, [token.pairAddress, token.dex, token.mint]);

  return (
    <div style={{
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'linear-gradient(180deg, rgba(224,96,126,0.04), rgba(5,5,9,0.4))',
      padding: isMobile ? 14 : 18,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
    }}>

      {/* Header: YAKK Forensic View label + external chart dropdown */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>🩷</span>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 800, color: 'var(--pink, #e0607e)',
              textTransform: 'uppercase', letterSpacing: 1.5,
            }}>
              YAKK Forensic View
            </div>
            <div style={{ fontSize: 9, color: '#666', marginTop: 1 }}>
              The only view that shows you the cabal
            </div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setChartMenuOpen(v => !v)}
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#c9c9d1',
              fontSize: 10, fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: 0.5,
            }}
          >
            VIEW CANDLES ▾
          </button>
          {chartMenuOpen && (
            <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 4,
              background: '#0a0a10',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: 4,
              zIndex: 10,
              minWidth: 150,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
              {externalChartLinks.map(link => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setChartMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    fontSize: 11,
                    color: '#c9c9d1',
                    textDecoration: 'none',
                    borderRadius: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(224,96,126,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {link.name} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* YAKK SCORE hero — big, gold, unmissable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
        gap: 14,
        alignItems: 'stretch',
      }}>
        <div style={{
          padding: 16,
          borderRadius: 10,
          background: 'radial-gradient(circle at top left, rgba(247,201,72,0.08), rgba(5,5,9,0.3))',
          border: '1px solid rgba(247,201,72,0.2)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
            YAKK Score
          </div>
          <div style={{
            fontSize: isMobile ? 42 : 56,
            fontWeight: 900,
            color: riskColor(grade),
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {score || '—'}
          </div>
          <div style={{
            marginTop: 6, fontSize: 10, fontWeight: 800,
            color: riskColor(grade),
            letterSpacing: 1,
          }}>
            GRADE {grade}
          </div>
        </div>

        {/* Forensic factors list */}
        <div style={{
          padding: 14,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <div style={{ fontSize: 9, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Risk Factors
          </div>
          {factors.length > 0 ? factors.slice(0, 4).map((f, i) => (
            <div key={i} style={{ fontSize: 11, color: '#c9c9d1', lineHeight: 1.4 }}>
              · {f}
            </div>
          )) : (
            <div style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>
              No factors flagged — awaiting /api/gate-check wire-up.
            </div>
          )}
        </div>
      </div>

      {/* Forensic stat grid — holders / gini / LP / cabal wallets */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: 8,
      }}>
        {/* Holder concentration (Gini) */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Concentration</div>
          {gini != null ? (
            <>
              <div style={{ ...statValueStyle, color: giniColor(gini) }}>
                {gini.toFixed(3)}
              </div>
              <div style={{ fontSize: 8, color: giniColor(gini), fontWeight: 700, letterSpacing: 0.5 }}>
                {giniLabel(gini)}
              </div>
            </>
          ) : (
            <div style={{ ...statValueStyle, color: '#666' }}>—</div>
          )}
        </div>

        {/* Top holder % */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Top Wallet</div>
          <div style={{ ...statValueStyle, color: topPct != null && topPct > 15 ? '#fb923c' : '#f5f5f7' }}>
            {topPct != null ? topPct.toFixed(1) + '%' : '—'}
          </div>
          <div style={{ fontSize: 8, color: '#666' }}>
            {token.holdersTotal != null ? token.holdersTotal.toLocaleString() + ' holders' : 'of supply'}
          </div>
        </div>

        {/* LP lock status */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>LP Lock</div>
          <div style={{
            ...statValueStyle,
            color: lpLocked === true ? '#4ade80' : lpLocked === false ? '#f87171' : '#666',
          }}>
            {lpLocked === true ? 'LOCKED' : lpLocked === false ? 'UNLOCKED' : '—'}
          </div>
          <div style={{ fontSize: 8, color: '#666' }}>
            {token.lpLockSource ?? 'awaiting check'}
          </div>
        </div>

        {/* Cabal wallet count */}
        <div style={statBoxStyle}>
          <div style={statLabelStyle}>Cabal Flags</div>
          <div style={{
            ...statValueStyle,
            color: cabalCount != null && cabalCount > 0 ? '#f87171' : '#4ade80',
          }}>
            {cabalCount != null ? cabalCount : '—'}
          </div>
          <div style={{ fontSize: 8, color: '#666' }}>
            {netExtracted != null ? fmtUsd(netExtracted) + ' net' : 'wallets holding'}
          </div>
        </div>
      </div>

      {/* Whale feed strip — the live replacement for chart candles */}
      <div style={{
        padding: 12,
        borderRadius: 10,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 10, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Live Whale Moves
          </div>
          <div style={{ fontSize: 8, color: '#666' }}>
            {whaleFeed.length > 0 ? 'Last 5 · live' : 'awaiting /api/whale-feed wire-up'}
          </div>
        </div>
        {whaleFeed.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {whaleFeed.slice(0, 5).map((w, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 80px 100px',
                gap: 8,
                alignItems: 'center',
                fontSize: 11,
                padding: '4px 0',
                borderBottom: i < 4 ? '1px dashed rgba(255,255,255,0.04)' : 'none',
              }}>
                <span style={{
                  color: w.side === 'BUY' ? '#4ade80' : '#f87171',
                  fontWeight: 700,
                  fontSize: 10,
                }}>
                  ● {w.side}
                </span>
                <span style={{ color: '#c9c9d1', fontFamily: 'monospace', fontSize: 10 }}>
                  {w.wallet}
                  {w.flagged && <span style={{ color: '#f87171', marginLeft: 4 }}>⚠ CABAL</span>}
                </span>
                <span style={{ color: '#9a9aa8', fontSize: 10 }}>{w.timeAgo}</span>
                <span style={{
                  color: '#f5f5f7', fontVariantNumeric: 'tabular-nums',
                  textAlign: 'right', fontWeight: 700,
                }}>
                  {fmtUsd(w.amountUsd)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            fontSize: 10, color: '#666', fontStyle: 'italic',
            padding: '8px 0', textAlign: 'center',
          }}>
            Whale feed will populate once /api/whale-feed is live-wired to this view.
          </div>
        )}
      </div>

      {/* Footer attribution */}
      <div style={{
        fontSize: 9, color: '#555', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8,
      }}>
        Forensic scoring by YAKK · Powered by Helius RPC + YAKK Cabal Registry
      </div>
    </div>
  );
}

/* ── shared style tokens ─────────────────────────────────────────────── */
const statBoxStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
};

const statLabelStyle: React.CSSProperties = {
  fontSize: 9,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: 1,
  marginBottom: 4,
};

const statValueStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 800,
  color: '#f5f5f7',
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1.1,
};
