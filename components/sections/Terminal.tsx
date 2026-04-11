'use client';
import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import ForensicView from '../ForensicView';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

/* ── YAKK trusted list + SOL bluechip only ──────────────────────────────── */
const TOKENS = [
  {
    ticker: 'YST',  name: 'YAKK Studios Token',
    price: 0.0000018, chg: 1.44,
    mcap: '$1.8M', vol: '$24.1K', liq: '$189K', holders: '—', buys: '682', sells: '522',
    dex: 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM',
    ca: 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
    fallbackEmoji: '🩷',
  },
  {
    ticker: 'SPT',  name: 'StakePoint Token',
    price: 0.00000042, chg: 0.88,
    mcap: '$420K', vol: '$3.2K', liq: '$41K', holders: '—', buys: '188', sells: '124',
    dex: 'A1d4sAmgi4Njnodmc289HP7TaPxw54n4Ey3LRDfrBvo5',
    ca: '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',
    fallbackEmoji: '🟢',
  },
  {
    ticker: 'LOCK', name: 'StreamLock',
    price: 0.0426, chg: 2.63,
    mcap: '$26K', vol: '$97', liq: '$12K', holders: '—', buys: '3', sells: '0',
    dex: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
    ca: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump',
    fallbackEmoji: '🔒',
  },
  {
    ticker: 'SOL',  name: 'Solana',
    price: 142.30, chg: 2.14,
    mcap: '$68.4B', vol: '$1.8B', liq: '$4.2B', holders: '—', buys: '7.8M', sells: '6.4M',
    dex: '8sLbNZoA1cfnvMJLPfp98ZLAnFSYCFApfJKMbiXNLwxj',
    ca: 'So11111111111111111111111111111111111111112',
    fallbackEmoji: '◎',
  },
];

/* ── Local logo paths — served from /public ─────────────────────────────── */
const LOGO_MAP: Record<string, string> = {
  YST:  '/yst-logo.jpg',
  SPT:  '/spt-logo.jpg',
  LOCK: '/lock-logo.jpg',
  SOL:  '/sol-logo.png',
};

const MOCK_RECENT = [
  { type: 'BUY',  amt: '0.94 SOL', tok: '78.8M YST',  time: '2m ago'  },
  { type: 'SELL', amt: '0.59 SOL', tok: '49.4M YST',  time: '5m ago'  },
  { type: 'BUY',  amt: '1.40 SOL', tok: '116.6M YST', time: '8m ago'  },
  { type: 'BUY',  amt: '0.37 SOL', tok: '30.5M YST',  time: '14m ago' },
];

function fmtPrice(p: number) {
  if (p >= 1) return '$' + p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 0.001) return '$' + p.toFixed(6);
  return '$' + p.toFixed(10).replace(/0+$/, '');
}

/* ── Token logo — local image with emoji fallback ───────────────────────── */
function TokenLogo({ ticker, size = 16 }: { ticker: string; size?: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logoUrl = LOGO_MAP[ticker];
  const tok = TOKENS.find(t => t.ticker === ticker);
  const emoji = tok?.fallbackEmoji ?? '🪙';

  if (logoUrl && !imgFailed) {
    return (
      <img
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
        onError={() => setImgFailed(true)}
      />
    );
  }
  return <span style={{ fontSize: size * 0.85 }}>{emoji}</span>;
}

export default function Terminal({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  useEffect(() => {
    if (!publicKey || !connection) { setSolBalance(null); return; }
    connection.getBalance(publicKey)
      .then(lamports => setSolBalance(lamports / 1_000_000_000))
      .catch(() => setSolBalance(null));
  }, [publicKey, connection]);

  const [tokens, setTokens] = useState(TOKENS);
  const [selectedToken, setSelectedToken] = useState<typeof TOKENS[0] | null>(null);
  const [timeframe, setTimeframe] = useState('15');
  const [fromAmt, setFromAmt] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [customSlip, setCustomSlip] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [risk, setRisk] = useState('2');
  const [stopLoss, setStopLoss] = useState('20');

  /* ── Live data from /api/screener — updates prices + pair addresses ─────── */
  useEffect(() => {
    async function fetchScreenerData() {
      try {
        const res = await fetch('/api/screener');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.tokens) return;
        setTokens(prev => prev.map(t => {
          const live = data.tokens.find((lt: any) => lt.ticker === t.ticker);
          if (!live || !live.live) return t;
          return {
            ...t,
            price:  live.price  > 0 ? live.price  : t.price,
            chg:    live.chg    ?? t.chg,
            vol:    live.vol    || t.vol,
            liq:    live.liq    || t.liq,
            mcap:   live.mcap   || t.mcap,
            buys:   live.buys   || t.buys,
            sells:  live.sells  || t.sells,
            // ← use DexScreener pair address so chart iframe works
            dex:    live.dex    || t.dex,
          };
        }));
        setSelectedToken(prev => {
          if (!prev) return prev;
          const live = data.tokens.find((lt: any) => lt.ticker === prev.ticker);
          if (!live || !live.live) return prev;
          return {
            ...prev,
            price:  live.price  > 0 ? live.price  : prev.price,
            chg:    live.chg    ?? prev.chg,
            vol:    live.vol    || prev.vol,
            liq:    live.liq    || prev.liq,
            mcap:   live.mcap   || prev.mcap,
            buys:   live.buys   || prev.buys,
            sells:  live.sells  || prev.sells,
            dex:    live.dex    || prev.dex,
          };
        });
      } catch { /* silently fall back to static data */ }
    }
    fetchScreenerData();
  }, []);

  const toAmt = fromAmt && selectedToken
    ? (parseFloat(fromAmt) * 142.30 / selectedToken.price).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : '0.00';
  const fromUsd = fromAmt ? (parseFloat(fromAmt) * 142.30).toFixed(2) : '0.00';
  const toUsd = fromAmt && selectedToken
    ? (parseFloat(fromAmt) * 142.30).toFixed(2)
    : '0.00';

  const posResult = portfolio && risk && stopLoss
    ? {
        riskAmt: (parseFloat(portfolio) * parseFloat(risk) / 100).toFixed(2),
        posSize: (parseFloat(portfolio) * parseFloat(risk) / 100 / (parseFloat(stopLoss) / 100)).toFixed(2),
      }
    : null;

  return (
    <div style={{ height: 'calc(100vh - 74px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
        <div id="terminal-wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', height: 'calc(100vh - 74px)', overflow: 'hidden' }}>

          {/* ═══ LEFT: Chart + timeframes ═══ */}
          <div id="term-left" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
            <div id="term-chart-hdr" style={{ padding: '10px 14px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>

              {/* Token selector pills with logos */}
              <div className="term-tok-sel" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1, padding: 0, border: 'none' }}>
                {tokens.map(t => (
                  <button
                    key={t.ticker}
                    className={`term-tok-btn${selectedToken?.ticker === t.ticker ? ' active' : ''}`}
                    onClick={() => setSelectedToken(t)}
                    style={{
                      padding: '5px 11px', borderRadius: '4px', fontFamily: 'Space Mono,monospace', fontSize: '9px',
                      letterSpacing: '0.06em', cursor: 'pointer', background: selectedToken?.ticker === t.ticker ? 'rgba(224,96,126,0.1)' : 'var(--bg3)',
                      border: `1px solid ${selectedToken?.ticker === t.ticker ? 'var(--pink)' : 'var(--border)'}`,
                      color: selectedToken?.ticker === t.ticker ? 'var(--pink)' : 'var(--muted)', transition: 'all 0.12s',
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}
                  >
                    <TokenLogo ticker={t.ticker} size={14} />
                    {t.ticker}
                    <span className="tt-chg" style={{ fontSize: '8px', color: t.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {t.chg >= 0 ? '+' : ''}{t.chg.toFixed(1)}%
                    </span>
                  </button>
                ))}
              </div>

              {/* Timeframe buttons */}
              <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto', flexShrink: 0 }}>
                {[['1','1M'],['5','5M'],['15','15M'],['60','1H'],['240','4H'],['D','1D']].map(([val,lbl]) => (
                  <button
                    key={val}
                    className={`tf${timeframe === val ? ' active' : ''}`}
                    onClick={() => setTimeframe(val)}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              {/* Price display */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '16px' }}>
                  {selectedToken ? fmtPrice(selectedToken.price) : '—'}
                </div>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: selectedToken ? (selectedToken.chg >= 0 ? 'var(--green)' : 'var(--red)') : 'var(--dim)' }}>
                  {selectedToken ? `${selectedToken.chg >= 0 ? '+' : ''}${selectedToken.chg.toFixed(2)}%` : '—'}
                </div>
              </div>
            </div>

            {/* Chart area — YAKK Forensic View (SOL branch uses TradingView) */}
            <div id="term-chart" style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'var(--bg)', padding: 10 }}>
              {selectedToken ? (
                <ForensicView token={selectedToken} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '28px' }}>🩷</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>Select a token to trade</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>Forensic View powered by YAKK</div>
                </div>
              )}
            </div>
          </div>

          {/* ═══ RIGHT: Swap panel ═══ */}
          <div id="term-right" style={{ overflowY: 'auto', background: 'var(--bg2)', display: 'flex', flexDirection: 'column' }}>

            {/* Swap widget */}
            <div className="swap-panel" style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
              <div className="swap-panel-title" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>Swap</span>
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>via YAKK Swap</span>
                  <button
                    onClick={() => onNavigate('bridge')}
                    style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--blue)', textDecoration: 'none', padding: '2px 5px', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '3px', background: 'transparent', cursor: 'pointer' }}
                  >
                    JUP
                  </button>
                </div>
              </div>

              {/* Quick buy amounts */}
              <div className="quick-amts" style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', marginRight: '2px' }}>QUICK:</span>
                {[0.1, 0.5, 1, 5].map(amt => (
                  <button
                    key={amt}
                    className="quick-amt"
                    onClick={() => setFromAmt(String(amt))}
                    style={{ padding: '3px 8px', borderRadius: '3px', fontFamily: 'Space Mono,monospace', fontSize: '8px', cursor: 'pointer', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--muted)' }}
                  >
                    {amt} SOL
                  </button>
                ))}
              </div>

              {/* FROM box */}
              <div className="swap-dir" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                <div className="swap-box" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '7px', padding: '10px 12px' }}>
                  <div className="swap-box-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>FROM</span>
                    <span>Balance: {solBalance !== null ? solBalance.toFixed(3) : '—'} SOL</span>
                  </div>
                  <div className="swap-box-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      className="swap-amt"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={fromAmt}
                      onChange={e => setFromAmt(e.target.value)}
                      style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text)', width: '100%' }}
                    />
                    <div className="swap-tok-badge" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: '5px', flexShrink: 0, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px' }}>
                      <span>◎</span> SOL
                    </div>
                  </div>
                  <div className="swap-usd-val" style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '4px' }}>≈ ${fromUsd}</div>
                </div>

                <div className="swap-arrow" style={{ textAlign: 'center', cursor: 'pointer', padding: '2px 0', color: 'var(--muted)', fontSize: '14px', userSelect: 'none' }}>⇅</div>

                {/* TO box */}
                <div className="swap-box" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '7px', padding: '10px 12px' }}>
                  <div className="swap-box-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>TO (ESTIMATED)</span>
                    <span>Balance: —</span>
                  </div>
                  <div className="swap-box-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--dim)' }}>{toAmt}</div>
                    <div className="swap-tok-badge" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: '5px', flexShrink: 0, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px' }}>
                      {selectedToken ? <TokenLogo ticker={selectedToken.ticker} size={14} /> : <span>🩷</span>}
                      {selectedToken?.ticker || 'YST'}
                    </div>
                  </div>
                  <div className="swap-usd-val" style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginTop: '4px' }}>≈ ${toUsd}</div>
                </div>
              </div>

              {/* Slippage */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', marginBottom: '5px' }}>SLIPPAGE TOLERANCE</div>
                <div className="slippage-row" style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {[0.5, 1, 2, 5].map(s => (
                    <button
                      key={s}
                      className={`slip-opt${slippage === s && !customSlip ? ' active' : ''}`}
                      onClick={() => { setSlippage(s); setCustomSlip(''); }}
                      style={{
                        padding: '3px 8px', borderRadius: '3px', fontFamily: 'Space Mono,monospace', fontSize: '8px', cursor: 'pointer',
                        background: slippage === s && !customSlip ? 'rgba(247,201,72,0.1)' : 'var(--bg3)',
                        border: `1px solid ${slippage === s && !customSlip ? 'var(--gold)' : 'var(--border)'}`,
                        color: slippage === s && !customSlip ? 'var(--gold)' : 'var(--muted)',
                      }}
                    >
                      {s}%
                    </button>
                  ))}
                  <input
                    className="slip-custom"
                    type="number"
                    min="0.1"
                    max="50"
                    step="0.1"
                    placeholder="Custom"
                    value={customSlip}
                    onChange={e => { setCustomSlip(e.target.value); if (e.target.value) setSlippage(parseFloat(e.target.value)); }}
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '3px', padding: '3px 6px', fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--text)', outline: 'none', width: '52px' }}
                  />
                  <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>%</span>
                </div>
              </div>

              {/* Route info */}
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '5px', padding: '7px 10px', marginBottom: '8px', fontSize: '10px', color: 'var(--muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--dim)' }}>Route</span>
                  <span>YAKK best route</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <span style={{ color: 'var(--dim)' }}>Price impact</span>
                  <span style={{ color: 'var(--green)' }}>&lt; 0.1%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--dim)' }}>Min received</span>
                  <span>—</span>
                </div>
              </div>

              {/* Swap button */}
              <button
                className="swap-btn swap-btn-connect"
                style={{ width: '100%', padding: '11px', borderRadius: '7px', fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '13px', letterSpacing: '0.06em', cursor: 'pointer', border: 'none', background: 'var(--pink)', color: '#fff' }}
              >
                {walletConnected ? 'EXECUTE SWAP' : 'CONNECT WALLET TO TRADE'}
              </button>

              {/* Zero-fee notice */}
              <div className="fee-notice" style={{ marginTop: '8px', padding: '6px 9px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '4px', fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--green)', lineHeight: 1.5 }}>
                ✓ YAKK TERMINAL charges 0% extra fees<br/>
                YAKK Swap fee: 0.1% (lowest on market)<br/>
                No hidden MEV. No extraction. Just the swap.
              </div>
            </div>

            {/* Token stats */}
            <div className="term-stats" style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px', marginBottom: '8px' }}>Token Stats</div>
              <div className="ts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  ['MARKET CAP', selectedToken?.mcap],
                  ['24H VOLUME', selectedToken?.vol],
                  ['LIQUIDITY', selectedToken?.liq],
                  ['HOLDERS', selectedToken?.holders],
                  ['BUYS (24H)', selectedToken?.buys, 'up'],
                  ['SELLS (24H)', selectedToken?.sells, 'dn'],
                ].map(([lbl, val, cls]) => (
                  <div key={lbl as string} className="ts-cell" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '5px', padding: '8px 10px' }}>
                    <div className="ts-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', letterSpacing: '0.12em', color: 'var(--dim)', marginBottom: '3px' }}>{lbl}</div>
                    <div className={`ts-val${cls ? ' ' + cls : ''}`} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '13px', color: cls === 'up' ? 'var(--green)' : cls === 'dn' ? 'var(--red)' : undefined }}>
                      {(val as string) && (val as string) !== '$0' ? (val as string) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Position sizing calculator */}
            <div className="position-calc" style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
              <div className="pc-title" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px', marginBottom: '8px' }}>Position Calculator</div>
              <div className="pc-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="pc-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', minWidth: '70px' }}>Portfolio</span>
                <input
                  className="pc-inp"
                  type="number"
                  placeholder="e.g. 1000"
                  value={portfolio}
                  onChange={e => setPortfolio(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '5px 8px', fontSize: '11px', color: 'var(--text)', outline: 'none', fontFamily: 'Space Mono,monospace' }}
                />
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>USD</span>
              </div>
              <div className="pc-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="pc-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', minWidth: '70px' }}>Risk %</span>
                <input
                  className="pc-inp"
                  type="number"
                  placeholder="e.g. 2"
                  value={risk}
                  onChange={e => setRisk(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '5px 8px', fontSize: '11px', color: 'var(--text)', outline: 'none', fontFamily: 'Space Mono,monospace' }}
                />
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>%</span>
              </div>
              <div className="pc-row" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span className="pc-lbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', minWidth: '70px' }}>Stop loss</span>
                <input
                  className="pc-inp"
                  type="number"
                  placeholder="e.g. 20"
                  value={stopLoss}
                  onChange={e => setStopLoss(e.target.value)}
                  style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '4px', padding: '5px 8px', fontSize: '11px', color: 'var(--text)', outline: 'none', fontFamily: 'Space Mono,monospace' }}
                />
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>% below</span>
              </div>
              {posResult && portfolio && (
                <div className="pc-result" style={{ background: 'rgba(247,201,72,0.05)', border: '1px solid rgba(247,201,72,0.15)', borderRadius: '5px', padding: '8px 10px', fontSize: '11px', lineHeight: 1.8, marginTop: '6px' }}>
                  <div>Risk amount: <strong style={{ color: 'var(--gold)' }}>${posResult.riskAmt}</strong></div>
                  <div>Position size: <strong style={{ color: 'var(--text)' }}>${posResult.posSize}</strong></div>
                </div>
              )}
            </div>

            {/* Recent trades */}
            <div className="term-recent" style={{ padding: '10px 12px' }}>
              <div className="tr-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px' }}>Recent Trades</span>
                <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>via Solscan</span>
              </div>
              {selectedToken ? MOCK_RECENT.map((tr, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontFamily: 'Space Mono,monospace', fontSize: '9px' }}>
                  <span style={{ color: tr.type === 'BUY' ? 'var(--green)' : 'var(--red)', fontWeight: 700, width: '30px' }}>{tr.type}</span>
                  <span>{tr.amt}</span>
                  <span style={{ color: 'var(--muted)' }}>{tr.tok}</span>
                  <span style={{ color: 'var(--dim)' }}>{tr.time}</span>
                </div>
              )) : (
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', textAlign: 'center', padding: '12px 0' }}>
                  Select a token to see trades
                </div>
              )}
            </div>

            {/* YAKK swap notice */}
            <div className="jup-notice" style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', lineHeight: 1.7 }}>
              Swaps powered by <strong style={{ color: 'var(--text)' }}>YAKK Bridge Aggregator</strong> — deBridge, Wormhole, Mayan &amp; Allbridge routing.<br/>
              Connect Phantom or Backpack to execute trades.<br/>
              YAKK Terminal applies <strong style={{ color: 'var(--green)' }}>zero additional fees</strong>.<br/>
              CA: <span style={{ color: 'var(--gold)', wordBreak: 'break-all' }}>{selectedToken?.ca || '—'}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
