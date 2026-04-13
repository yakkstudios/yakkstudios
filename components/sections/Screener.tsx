'use client';
import { useState, useEffect, useMemo } from 'react';
import ForensicView from '../ForensicView';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

/* ── Types matching /api/screener response ───────────────────────────────── */
interface PriceChanges { m5: number; h1: number; h6: number; h24: number; }
interface Volumes      { m5: number; h1: number; h6: number; h24: number; }
interface TxnBucket    { buys: number; sells: number; }
interface TxnBreakdown { m5: TxnBucket; h1: TxnBucket; h6: TxnBucket; h24: TxnBucket; }
interface RawNums      { liq: number; mcap: number; fdv: number; vol24: number; buys24: number; sells24: number; }
interface TokenInfo {
  imageUrl: string;
  header: string;
  openGraph: string;
  websites: Array<{ label?: string; url: string }>;
  socials:  Array<{ type?: string;  platform?: string; handle?: string; url: string }>;
}
interface RiskScore    { score: number; grade: string; factors: string[]; }

interface ScreenerToken {
  id: number;
  ticker: string;
  name: string;
  emoji?: string;
  fallbackEmoji?: string;
  cat: string;
  price: number;
  chg: number;
  vol: string;
  liq: string;
  mcap: string;
  fdv: string;
  txns: string;
  buys: string;
  sells: string;
  holders: string;
  dex: string;
  mint?: string;
  isNew: boolean;
  updated: boolean;
  live?: boolean;
  priceChanges?: PriceChanges;
  volumes?: Volumes;
  txnBreakdown?: TxnBreakdown;
  raw?: RawNums;
  pairAddress?: string;
  pairCreatedAt?: number;
  ageDays?: number;
  quoteTicker?: string;
  info?: TokenInfo;
  risk?: RiskScore;
}

const EMPTY_CHG: PriceChanges = { m5: 0, h1: 0, h6: 0, h24: 0 };
const EMPTY_VOL: Volumes      = { m5: 0, h1: 0, h6: 0, h24: 0 };
const EMPTY_TXN: TxnBreakdown = {
  m5:  { buys: 0, sells: 0 },
  h1:  { buys: 0, sells: 0 },
  h6:  { buys: 0, sells: 0 },
  h24: { buys: 0, sells: 0 },
};
const EMPTY_INFO: TokenInfo = { imageUrl: '', header: '', openGraph: '', websites: [], socials: [] };
const EMPTY_RISK: RiskScore = { score: 0, grade: '—', factors: [] };

/* ── YAKK Trusted List + Blue Chips only (seed data; /api/screener overrides) */
const INITIAL_TOKENS: ScreenerToken[] = [
  {
    id: 1, ticker: 'YST', name: 'YAKK Studios Token',
    price: 0.0000018, chg: 1.44,
    vol: '$24.1K', liq: '$189K', mcap: '$1.8M', fdv: '$1.8M',
    txns: '1,204', buys: '682', sells: '522', holders: '4,281',
    cat: 'yakk', isNew: false, updated: true,
    dex: 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM',
    mint: 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
    fallbackEmoji: '🩷',
    priceChanges: EMPTY_CHG, volumes: EMPTY_VOL, txnBreakdown: EMPTY_TXN,
    raw: { liq: 189000, mcap: 1800000, fdv: 1800000, vol24: 24100, buys24: 682, sells24: 522 },
    pairAddress: 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM',
    pairCreatedAt: 0, ageDays: 0, quoteTicker: 'SOL',
    info: EMPTY_INFO, risk: EMPTY_RISK,
  },
  {
    id: 2, ticker: 'SPT', name: 'StakePoint',
    price: 0.00000042, chg: 0.88,
    vol: '$3.2K', liq: '$41K', mcap: '$420K', fdv: '$420K',
    txns: '312', buys: '188', sells: '124', holders: '1,120',
    cat: 'yakk', isNew: false, updated: true,
    dex: 'A1d4sAmgi4Njnodmc289HP7TaPxw54n4Ey3LRDfrBvo5',
    mint: '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',
    fallbackEmoji: '🏆',
    priceChanges: EMPTY_CHG, volumes: EMPTY_VOL, txnBreakdown: EMPTY_TXN,
    raw: { liq: 41000, mcap: 420000, fdv: 420000, vol24: 3200, buys24: 188, sells24: 124 },
    pairAddress: 'A1d4sAmgi4Njnodmc289HP7TaPxw54n4Ey3LRDfrBvo5',
    pairCreatedAt: 0, ageDays: 0, quoteTicker: 'SOL',
    info: EMPTY_INFO, risk: EMPTY_RISK,
  },
  {
    id: 3, ticker: 'LOCK', name: 'StreamLock',
    price: 0.0426, chg: 2.63,
    vol: '$97', liq: '$12K', mcap: '$26K', fdv: '$25K',
    txns: '3', buys: '3', sells: '0', holders: '—',
    cat: 'yakk', isNew: false, updated: true,
    dex: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
    mint: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
    fallbackEmoji: '🔒',
    priceChanges: EMPTY_CHG, volumes: EMPTY_VOL, txnBreakdown: EMPTY_TXN,
    raw: { liq: 12000, mcap: 26000, fdv: 25000, vol24: 97, buys24: 3, sells24: 0 },
    pairAddress: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
    pairCreatedAt: 0, ageDays: 0, quoteTicker: 'SOL',
    info: EMPTY_INFO, risk: EMPTY_RISK,
  },
  {
    id: 4, ticker: 'SOL', name: 'Solana',
    price: 142.30, chg: 2.14,
    vol: '$1.2B', liq: '$38.4M', mcap: '$67.1B', fdv: '$80.2B',
    txns: '412,301', buys: '228,104', sells: '184,197', holders: '—',
    cat: 'bluechip', isNew: false, updated: false,
    dex: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
    mint: 'So11111111111111111111111111111111111111112',
    fallbackEmoji: '◎',
    priceChanges: EMPTY_CHG, volumes: EMPTY_VOL, txnBreakdown: EMPTY_TXN,
    raw: { liq: 38400000, mcap: 67100000000, fdv: 80200000000, vol24: 1200000000, buys24: 228104, sells24: 184197 },
    pairAddress: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
    pairCreatedAt: 0, ageDays: 0, quoteTicker: 'USDC',
    info: EMPTY_INFO, risk: EMPTY_RISK,
  },
];

const PLACEHOLDER_TXNS = [
  { type: 'BUY',  time: '2m',  token: 'YST',  amount: '12,400',  price: '0.0000018',  value: '$22',  wallet: '7xKz...9mPq' },
  { type: 'BUY',  time: '4m',  token: 'YST',  amount: '8,200',   price: '0.0000018',  value: '$15',  wallet: 'Hn2P...4kLm' },
  { type: 'SELL', time: '6m',  token: 'YST',  amount: '3,100',   price: '0.0000017',  value: '$5',   wallet: 'Bk8J...3xRt' },
  { type: 'BUY',  time: '11m', token: 'YST',  amount: '24,500',  price: '0.0000018',  value: '$44',  wallet: 'Qw4V...7nYz' },
  { type: 'BUY',  time: '14m', token: 'YST',  amount: '5,600',   price: '0.0000018',  value: '$10',  wallet: 'Mx9T...2cBn' },
];

/* ── Formatters ──────────────────────────────────────────────────────────── */
const SUBSCRIPTS = ['\u2080','\u2081','\u2082','\u2083','\u2084','\u2085','\u2086','\u2087','\u2088','\u2089'];
function fmtPrice(p: number): string {
  if (!Number.isFinite(p) || p <= 0) return '$0';
  if (p >= 1000)  return '$' + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (p >= 1)     return '$' + p.toFixed(3);
  if (p >= 0.01)  return '$' + p.toFixed(4);
  if (p >= 0.001) return '$' + p.toFixed(5);
  // Sub-cent: use subscript zero compact format e.g. $0.0₅1234
  const s = p.toFixed(20);
  const dot = s.indexOf('.');
  if (dot === -1) return '$' + p.toExponential(3);
  const decimals = s.slice(dot + 1);
  let leadingZeros = 0;
  while (leadingZeros < decimals.length && decimals[leadingZeros] === '0') leadingZeros++;
  const sig = decimals.slice(leadingZeros, leadingZeros + 4);
  if (leadingZeros < 4) return '$' + p.toFixed(6);
  const subDigits = String(leadingZeros).split('').map(d => SUBSCRIPTS[parseInt(d, 10)]).join('');
  return `$0.0${subDigits}${sig}`;
}

function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '0%';
  const abs = Math.abs(n);
  if (abs >= 1000) return (n >= 0 ? '+' : '') + (n / 1000).toFixed(1) + 'K%';
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%';
}

function fmtUsd(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return '$0';
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
}

function fmtAge(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return '—';
  if (days < 1/24)  return Math.round(days * 1440) + 'm';
  if (days < 1)     return Math.round(days * 24) + 'h';
  if (days < 30)    return Math.round(days) + 'd';
  if (days < 365)   return Math.round(days / 30) + 'mo';
  return (days / 365).toFixed(1) + 'y';
}

function pctColor(n: number): string {
  if (!Number.isFinite(n) || n === 0) return '#9a9aa8';
  return n > 0 ? '#4ade80' : '#f87171';
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

function shortAddr(a: string): string {
  if (!a || a.length < 12) return a || '—';
  return a.slice(0, 4) + '…' + a.slice(-4);
}

/* ── TokenLogo: local static logo with emoji fallback ─────────────────────── */
function TokenLogo({
  token, logoMap, size = 36,
}: { token: ScreenerToken; logoMap: Record<string, string>; size?: number }) {
  const src = logoMap[token.ticker] ?? token.info?.imageUrl ?? '';
  const [err, setErr] = useState(false);
  if (src && !err) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={token.ticker}
        onError={() => setErr(true)}
        style={{
          width: size, height: size, borderRadius: '50%',
          objectFit: 'cover', flexShrink: 0,
          boxShadow: '0 0 0 1px rgba(224,96,126,0.3)',
        }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(224,96,126,0.25), rgba(247,201,72,0.15))',
      border: '1px solid rgba(224,96,126,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, flexShrink: 0,
    }}>
      {token.fallbackEmoji ?? token.emoji ?? '•'}
    </div>
  );
}

/* ── BuySellBar: horizontal gradient split ───────────────────────────────── */
function BuySellBar({ buys, sells }: { buys: number; sells: number }) {
  const total = buys + sells;
  const buyPct  = total > 0 ? (buys / total) * 100 : 50;
  const sellPct = 100 - buyPct;
  return (
    <div style={{
      width: '100%', height: 8, borderRadius: 4, overflow: 'hidden',
      display: 'flex', background: 'rgba(255,255,255,0.05)',
    }}>
      <div style={{ width: `${buyPct}%`,  background: '#4ade80' }} />
      <div style={{ width: `${sellPct}%`, background: '#f87171' }} />
    </div>
  );
}

/* ── RiskBadge: compact pill + full panel ────────────────────────────────── */
function RiskBadge({ risk, variant = 'pill' }: { risk: RiskScore; variant?: 'pill' | 'panel' }) {
  const color = riskColor(risk.grade);
  if (variant === 'pill') {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 10px', borderRadius: 999,
        background: `${color}1a`,
        border: `1px solid ${color}55`,
        fontSize: 11, fontWeight: 700,
        color,
      }}>
        <span style={{ fontSize: 13 }}>{risk.grade}</span>
        <span style={{ opacity: 0.75 }}>{risk.score}</span>
      </div>
    );
  }
  return (
    <div style={{
      padding: 16, borderRadius: 12,
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color}33`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#9a9aa8' }}>
          YAKK Risk Score
        </div>
        <div style={{
          fontSize: 10, padding: '3px 8px', borderRadius: 999,
          background: 'rgba(247,201,72,0.1)', color: '#f7c948',
          border: '1px solid rgba(247,201,72,0.3)',
        }}>
          DETERMINISTIC
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
        <div style={{ fontSize: 44, fontWeight: 800, color, lineHeight: 1 }}>{risk.grade}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f7' }}>{risk.score}<span style={{ color: '#555', fontSize: 14 }}>/100</span></div>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ width: `${risk.score}%`, height: '100%', background: color, transition: 'width 0.4s ease' }} />
      </div>
      {risk.factors.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {risk.factors.map((f) => (
            <span key={f} style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#c9c9d1', textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const [tokens, setTokens]     = useState<ScreenerToken[]>(INITIAL_TOKENS);
  const [summary, setSummary]   = useState({ totalVol24: 0, totalLiq: 0, totalTxns24: 0, pairsTracked: 0 });
  const [view, setView]         = useState<'trending' | 'new' | 'gainers'>('trending');
  const [filter, setFilter]     = useState<'all' | 'yakk' | 'bluechip' | 'updated' | 'new'>('all');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [timeframe, setTimeframe]   = useState<'m5' | 'h1' | 'h6' | 'h24'>('h24');
  const [txnTab, setTxnTab]         = useState<'m5' | 'h1' | 'h6' | 'h24'>('h24');
  const [search, setSearch]         = useState('');
  const [isMobile, setIsMobile]     = useState(false);
  const [logoMap, setLogoMap]       = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  /* viewport watcher */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* local static logo map (per CLAUDE.md — never fetch from DexScreener) */
  useEffect(() => {
    setLogoMap({
      YST:  '/yst-logo.jpg',
      SPT:  '/spt-logo.jpg',
      LOCK: '/lock-logo.jpg',
      SOL:  '/sol-logo.png',
    });
  }, []);

  /* live data poll every 30s */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/screener', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (Array.isArray(data.tokens) && data.tokens.length > 0) {
          setTokens(data.tokens);
        }
        if (data.summary) setSummary(data.summary);
        setLastUpdate(Date.now());
      } catch {
        /* silent — UI falls back to seed data */
      }
    };
    load();
    const id = setInterval(load, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  /* derived list — filter + search + view sort */
  const filtered = useMemo(() => {
    let list = tokens.slice();
    if (filter !== 'all') {
      if (filter === 'updated') list = list.filter(t => t.updated);
      else if (filter === 'new') list = list.filter(t => t.isNew);
      else list = list.filter(t => t.cat === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(t =>
        t.ticker.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        (t.mint ?? '').toLowerCase().includes(q)
      );
    }
    if (view === 'new') {
      list.sort((a, b) => (a.ageDays ?? 9999) - (b.ageDays ?? 9999));
    } else if (view === 'gainers') {
      list.sort((a, b) => (b.chg ?? 0) - (a.chg ?? 0));
    } else {
      list.sort((a, b) => (b.raw?.vol24 ?? 0) - (a.raw?.vol24 ?? 0));
    }
    return list;
  }, [tokens, filter, search, view]);

  const selected = useMemo(
    () => tokens.find(t => t.id === selectedId) ?? tokens[0],
    [tokens, selectedId]
  );

  /* ── Gate ───────────────────────────────────────────────────────────────── */
  if (!hasAccess) {
    return (
      <section className="section" id="screener">
        <div className="container">
          <div className="locked-overlay" style={{ minHeight: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ color: 'var(--pink)', marginBottom: 12 }}>Screener Locked</h2>
            <p style={{ color: '#c9c9d1', maxWidth: 480, textAlign: 'center', marginBottom: 20 }}>
              The YAKK Screener requires a connected wallet holding at least <strong>250,000 YST</strong>.
              Live price, risk-scored rows, DexScreener-parity detail panels, and YAKK-unique Rug Risk
              grades are reserved for the trusted holder tier.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('home')}>
              Back to Home
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── Subcomponent fragments ─────────────────────────────────────────────── */

  const summaryBar = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12,
      marginBottom: 16,
    }}>
      {[
        { label: '24H VOLUME',  value: fmtUsd(summary.totalVol24) },
        { label: 'LIQUIDITY',   value: fmtUsd(summary.totalLiq) },
        { label: '24H TXNS',    value: summary.totalTxns24.toLocaleString() },
        { label: 'PAIRS LIVE',  value: String(summary.pairsTracked) },
      ].map((s) => (
        <div key={s.label} style={{
          padding: '12px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 10, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
            {s.label}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f7' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );

  const toolbar = (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 'auto' }}>
        <h2 style={{ margin: 0, fontSize: 20, color: 'var(--pink)', fontWeight: 800, letterSpacing: 0.5 }}>
          YAKK SCREENER
        </h2>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(74,222,128,0.12)',
          border: '1px solid rgba(74,222,128,0.35)',
          color: '#4ade80', fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#4ade80',
            boxShadow: '0 0 8px #4ade80',
          }} />
          LIVE
        </span>
        <span style={{ fontSize: 10, color: '#666' }}>
          {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search token / mint…"
        style={{
          flex: '1 1 180px',
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#f5f5f7',
          fontSize: 12,
          outline: 'none',
        }}
      />

      <div style={{ display: 'flex', gap: 6 }}>
        {(['trending', 'new', 'gainers'] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: '7px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5,
              background: view === v ? 'var(--pink)' : 'rgba(255,255,255,0.04)',
              color: view === v ? '#050509' : '#c9c9d1',
              border: view === v ? '1px solid var(--pink)' : '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );

  const metaChips = (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
      {([
        { id: 'all',      label: 'ALL' },
        { id: 'yakk',     label: 'YST TRUSTED' },
        { id: 'bluechip', label: 'BLUECHIP' },
        { id: 'updated',  label: 'UPDATED' },
        { id: 'new',      label: 'NEW' },
      ] as const).map((c) => (
        <button
          key={c.id}
          onClick={() => setFilter(c.id)}
          style={{
            padding: '6px 12px', borderRadius: 999, fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: 0.6, cursor: 'pointer',
            background: filter === c.id ? 'rgba(247,201,72,0.15)' : 'rgba(255,255,255,0.03)',
            color: filter === c.id ? '#f7c948' : '#9a9aa8',
            border: filter === c.id ? '1px solid rgba(247,201,72,0.4)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );

  // Desktop list is always in a narrow split-panel (~40% width) so use a
  // condensed 5-col layout to prevent price from overflowing onto token logos.
  const listGridCols = isMobile
    ? '36px 1fr auto'
    : '32px minmax(110px,2fr) auto auto auto';

  const listPanel = (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Sticky header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: listGridCols,
        gap: 10,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: 700,
        position: 'sticky', top: 0, zIndex: 2,
      }}>
        <div>#</div>
        <div>TOKEN</div>
        <div style={{ textAlign: 'right' }}>PRICE</div>
        <div style={{ textAlign: 'right' }}>24H</div>
        {!isMobile && <div style={{ textAlign: 'right' }}>RISK</div>}
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#666', fontSize: 12 }}>
            No tokens match your filter.
          </div>
        )}

        {filtered.map((t, i) => {
          const isSelected = selected?.id === t.id;
          const age = fmtAge(t.ageDays ?? 0);
          return (
            <button
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: listGridCols,
                gap: 10, alignItems: 'center',
                padding: '12px 14px',
                background: isSelected ? 'rgba(224,96,126,0.08)' : 'transparent',
                borderLeft: isSelected ? '2px solid var(--pink)' : '2px solid transparent',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                width: '100%', textAlign: 'left', cursor: 'pointer',
                color: '#f5f5f7',
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ fontSize: 11, color: '#666', fontWeight: 700 }}>#{i + 1}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <TokenLogo token={t} logoMap={logoMap} size={isMobile ? 32 : 36} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#f5f5f7' }}>{t.ticker}</span>
                    {t.cat === 'yakk' && (
                      <span style={{
                        fontSize: 8, padding: '1px 5px', borderRadius: 3,
                        background: 'rgba(224,96,126,0.15)', color: 'var(--pink)',
                        border: '1px solid rgba(224,96,126,0.3)',
                        fontWeight: 700, letterSpacing: 0.3,
                      }}>YST</span>
                    )}
                    {t.isNew && (
                      <span style={{
                        fontSize: 8, padding: '1px 5px', borderRadius: 3,
                        background: 'rgba(247,201,72,0.15)', color: '#f7c948',
                        border: '1px solid rgba(247,201,72,0.3)',
                        fontWeight: 700, letterSpacing: 0.3,
                      }}>NEW</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 10, color: '#666',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {t.name}{age !== '—' ? ` · ${age}` : ''}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: 12, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                {fmtPrice(t.price)}
              </div>

              <div style={{ textAlign: 'right', fontSize: 11, fontWeight: 700, color: pctColor(t.chg), fontVariantNumeric: 'tabular-nums' }}>
                {fmtPct(t.chg)}
              </div>
              {!isMobile && (
                <div style={{ textAlign: 'right' }}>
                  {t.risk && t.risk.grade !== '—' ? <RiskBadge risk={t.risk} /> : <span style={{ fontSize: 11, color: '#666' }}>—</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ── Detail panel ──────────────────────────────────────────────────────── */
  const bannerMap: Record<string, string> = {
    YST: '/yst-banner.png',
    SPT: '/spt-banner.jpg',
    LOCK: '/lock-banner.jpg',
    SOL: '/sol-banner.png',
  };

  const detailPanel = selected ? (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      minHeight: 0,
    }}>
      {/* Banner image — full width, no overlay */}
      {bannerMap[selected.ticker] && (
        <div style={{
          width: '100%',
                              borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bannerMap[selected.ticker]}
            alt={`${selected.ticker} banner`}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* Token details bar */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        {isMobile && (
          <button
            onClick={() => setSelectedId(-1)}
            style={{
              padding: '6px 10px', borderRadius: 8,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#f5f5f7', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', marginRight: 4,
            }}
          >
            ← BACK
          </button>
        )}
        <TokenLogo token={selected} logoMap={logoMap} size={isMobile ? 44 : 56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color: '#f5f5f7' }}>
              {selected.ticker}
            </span>
            <span style={{ fontSize: 12, color: '#9a9aa8' }}>/ {selected.quoteTicker ?? 'SOL'}</span>
            {selected.risk && selected.risk.grade !== '—' && <RiskBadge risk={selected.risk} />}
          </div>
          <div style={{ fontSize: 11, color: '#9a9aa8', marginTop: 2 }}>
            {selected.name}{selected.ageDays ? ` · Age ${fmtAge(selected.ageDays)}` : ''}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontSize: isMobile ? 16 : 22, fontWeight: 800, color: '#f5f5f7',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {fmtPrice(selected.price)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: pctColor(selected.chg) }}>
            {fmtPct(selected.chg)}
          </div>
        </div>
      </div>

      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
        {/* Price-change pill strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
        }}>
          {(['m5', 'h1', 'h6', 'h24'] as const).map((k) => {
            const v = selected.priceChanges?.[k] ?? 0;
            const active = timeframe === k;
            return (
              <button
                key={k}
                onClick={() => setTimeframe(k)}
                style={{
                  padding: '10px 6px', borderRadius: 8, cursor: 'pointer',
                  background: active ? 'rgba(224,96,126,0.12)' : 'rgba(255,255,255,0.03)',
                  border: active ? '1px solid rgba(224,96,126,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                  {k === 'm5' ? '5M' : k.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: pctColor(v) }}>
                  {fmtPct(v)}
                </div>
              </button>
            );
          })}
        </div>

        {/* YAKK Forensic View — replaces DexScreener iframe. SOL uses TradingView. */}
        <ForensicView token={selected} isMobile={isMobile} />

        {/* 4-stat grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          {[
            { label: 'LIQUIDITY', value: selected.liq },
            { label: 'MCAP',      value: selected.mcap },
            { label: '24H VOL',   value: selected.vol },
            { label: 'FDV',       value: selected.fdv },
          ].map((s) => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f5f5f7', fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* TXNS tabbed breakdown */}
        <div style={{
          padding: 14, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Transactions
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['m5', 'h1', 'h6', 'h24'] as const).map((k) => {
                const active = txnTab === k;
                return (
                  <button
                    key={k}
                    onClick={() => setTxnTab(k)}
                    style={{
                      padding: '4px 10px', borderRadius: 6, cursor: 'pointer',
                      background: active ? 'rgba(224,96,126,0.15)' : 'transparent',
                      border: active ? '1px solid rgba(224,96,126,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: active ? 'var(--pink)' : '#9a9aa8',
                      fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    }}
                  >
                    {k === 'm5' ? '5M' : k.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
          {(() => {
            const b = selected.txnBreakdown?.[txnTab]?.buys ?? 0;
            const s = selected.txnBreakdown?.[txnTab]?.sells ?? 0;
            const total = b + s;
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#f5f5f7' }}>
                    {total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 10, color: '#666' }}>TOTAL TXNS</div>
                </div>
                <BuySellBar buys={b} sells={s} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
                  <div>
                    <span style={{ color: '#4ade80', fontWeight: 700 }}>● BUYS</span>
                    <span style={{ color: '#c9c9d1', marginLeft: 6, fontVariantNumeric: 'tabular-nums' }}>{b.toLocaleString()}</span>
                  </div>
                  <div>
                    <span style={{ color: '#c9c9d1', marginRight: 6, fontVariantNumeric: 'tabular-nums' }}>{s.toLocaleString()}</span>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>SELLS ●</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>

        {/* Volume breakdown */}
        <div style={{
          padding: 14, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 11, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            Volume
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {(['m5', 'h1', 'h6', 'h24'] as const).map((k) => {
              const v = selected.volumes?.[k] ?? 0;
              return (
                <div key={k} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                    {k === 'm5' ? '5M' : k.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#f5f5f7', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtUsd(v)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk panel */}
        {selected.risk && <RiskBadge risk={selected.risk} variant="panel" />}

        {/* Socials + websites */}
        {(selected.info?.websites?.length || selected.info?.socials?.length) ? (
          <div style={{
            padding: 14, borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 11, color: '#9a9aa8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Links
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selected.info?.websites?.map((w) => (
                <a
                  key={w.url}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px', borderRadius: 999,
                    background: 'rgba(224,96,126,0.1)',
                    border: '1px solid rgba(224,96,126,0.3)',
                    color: 'var(--pink)', fontSize: 11, fontWeight: 700,
                    textDecoration: 'none', letterSpacing: 0.3,
                  }}
                >
                  🌐 {w.label ?? 'Website'}
                </a>
              ))}
              {selected.info?.socials?.map((s) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '6px 12px', borderRadius: 999,
                    background: 'rgba(247,201,72,0.1)',
                    border: '1px solid rgba(247,201,72,0.3)',
                    color: '#f7c948', fontSize: 11, fontWeight: 700,
                    textDecoration: 'none', letterSpacing: 0.3, textTransform: 'capitalize',
                  }}
                >
                  {(s.type ?? s.platform ?? 'link')}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {/* Pair metadata */}
        <div style={{
          padding: 14, borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: 8,
          fontSize: 11,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pair</span>
            <a
              href={`https://solscan.io/account/${selected.pairAddress ?? selected.dex}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--pink)', fontFamily: 'monospace', textDecoration: 'none' }}
            >
              {shortAddr(selected.pairAddress ?? selected.dex)} ↗
            </a>
          </div>
          {selected.mint && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>Mint</span>
              <a
                href={`https://solscan.io/token/${selected.mint}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--pink)', fontFamily: 'monospace', textDecoration: 'none' }}
              >
                {shortAddr(selected.mint)} ↗
              </a>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>Age</span>
            <span style={{ color: '#c9c9d1' }}>{fmtAge(selected.ageDays ?? 0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ color: '#666', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quote</span>
            <span style={{ color: '#c9c9d1' }}>{selected.quoteTicker ?? 'SOL'}</span>
          </div>
        </div>

        {/* Transactions table */}
        <div style={{
          borderRadius: 12, overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            padding: '10px 14px',
            background: 'rgba(0,0,0,0.3)',
            fontSize: 10, color: '#666',
            textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            Live Feed (sample)
          </div>
          <div>
            {PLACEHOLDER_TXNS.map((tx, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '60px 50px 1fr 70px 70px',
                gap: 8,
                padding: '10px 14px',
                fontSize: 11,
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{
                  color: tx.type === 'BUY' ? '#4ade80' : '#f87171',
                  fontWeight: 700,
                }}>
                  {tx.type}
                </span>
                <span style={{ color: '#666' }}>{tx.time}</span>
                <span style={{ color: '#c9c9d1', fontVariantNumeric: 'tabular-nums' }}>{tx.amount}</span>
                <span style={{ color: '#c9c9d1', fontVariantNumeric: 'tabular-nums' }}>{tx.value}</span>
                <span style={{ color: '#666', fontFamily: 'monospace' }}>{tx.wallet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  /* ── Main layout ───────────────────────────────────────────────────────── */
  return (
    <section className="section" id="screener">
      <div className="container" style={{ maxWidth: 1400 }}>
        {summaryBar}
        {toolbar}
        {metaChips}

        {isMobile ? (
          <div style={{ height: 'calc(100vh - 280px)', minHeight: 500 }}>
            {selected && selectedId > 0 ? detailPanel : listPanel}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.6fr)',
            gap: 14,
            height: 'calc(100vh - 280px)',
            minHeight: 640,
          }}>
            {listPanel}
            {detailPanel}
          </div>
        )}
      </div>
    </section>
  );
}
