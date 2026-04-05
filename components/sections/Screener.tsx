'use client';
import { useState, useEffect } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

// ── Token definitions ────────────────────────────────────────────────────────
// `mint`  → Solana token mint address (for Solscan + Jupiter links)
// `pair`  → DexScreener pair/pool address (for chart iframe embed)
//           If no dedicated pair known, falls back to mint (shows DexScreener token page)
const INITIAL_TOKENS = [
  {
    id: 1, emoji: '🩷', ticker: 'YST', name: 'YAKK Studios Token',
    price: 0.0000018, chg: 1.44, vol: '$24.1K', liq: '$189K',
    mcap: '$1.8M', fdv: '$1.8M', txns: '1,204', buys: '682', sells: '522',
    holders: '4,281', cat: 'yakk', isNew: false, updated: true,
    mint: 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
    pair: 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM', // Meteora pool = DexScreener pair
  },
  {
    id: 2, emoji: '🟢', ticker: 'SPT', name: 'StakePoint Token',
    price: 0.00000042, chg: 0.88, vol: '$3.2K', liq: '$41K',
    mcap: '$420K', fdv: '$420K', txns: '312', buys: '188', sells: '124',
    holders: '1,120', cat: 'yakk', isNew: false, updated: true,
    mint: 'SPT_MINT_ADDRESS_TODO',   // ← Jay: replace with real SPT mint
    pair: 'SPT_PAIR_ADDRESS_TODO',   // ← Jay: replace with real DexScreener pair
  },
  {
    id: 3, emoji: '🔒', ticker: 'LOCK', name: 'Streamlock',
    price: 0.0426, chg: 2.63, vol: '$97', liq: '$12K',
    mcap: '$26K', fdv: '$25K', txns: '3', buys: '3', sells: '0',
    holders: '—', cat: 'yakk', isNew: false, updated: true,
    mint: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump', // pump.fun token mint
    pair: 'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump', // fallback to mint for now
  },
  {
    id: 4, emoji: '◎', ticker: 'SOL', name: 'Solana',
    price: 142.30, chg: 2.14, vol: '$1.8B', liq: '$4.2B',
    mcap: '$68.4B', fdv: '$78B', txns: '14.2M', buys: '7.8M', sells: '6.4M',
    holders: '—', cat: 'bluechip', isNew: false, updated: false,
    mint: 'So11111111111111111111111111111111111111112',
    pair: 'So11111111111111111111111111111111111111112', // SOL token page on DexScreener
  },
  {
    id: 5, emoji: '🐕', ticker: 'WIF', name: 'dogwifhat',
    price: 0.614, chg: 5.81, vol: '$142M', liq: '$22M',
    mcap: '$614M', fdv: '$614M', txns: '38K', buys: '22K', sells: '16K',
    holders: '194K', cat: 'bluechip', isNew: false, updated: false,
    mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    pair: 'EP2ib6dYdEeqD8MfE2ezHCxX3kP3K2eLKkirfPm5eyMx', // main WIF/SOL Raydium pair
  },
];

const MOCK_TXNS = [
  { date: 'Apr 05', type: 'BUY',  usd: '$142',  amount: '78,888,888 YST',  sol: '0.94', price: '$0.0000018', maker: '8xK4...2mPq', txn: '4yR2...kL8p' },
  { date: 'Apr 05', type: 'SELL', usd: '$89',   amount: '49,444,444 YST',  sol: '0.59', price: '$0.0000018', maker: '3vNx...9wTj', txn: '7mF8...nQ3r' },
  { date: 'Apr 05', type: 'BUY',  usd: '$210',  amount: '116,666,666 YST', sol: '1.40', price: '$0.0000018', maker: '5kLp...4dRs', txn: '2hN6...wY9t' },
  { date: 'Apr 04', type: 'BUY',  usd: '$55',   amount: '30,555,555 YST',  sol: '0.37', price: '$0.0000018', maker: '9aTm...7vQk', txn: '6pJ4...xM2s' },
  { date: 'Apr 04', type: 'SELL', usd: '$320',  amount: '177,777,777 YST', sol: '2.13', price: '$0.0000018', maker: '2fRw...8nBj', txn: '3kL9...tH7m' },
  { date: 'Apr 04', type: 'BUY',  usd: '$178',  amount: '98,888,888 YST',  sol: '1.18', price: '$0.0000018', maker: '7xCd...3pLs', txn: '9rW5...bN4k' },
];

function fmtPrice(p: number) {
  if (p >= 1)      return '$' + p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 0.001)  return '$' + p.toFixed(6);
  return '$' + p.toFixed(10).replace(/0+$/, '');
}

type Token = typeof INITIAL_TOKENS[0];

export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const [tokens, setTokens]               = useState<Token[]>(INITIAL_TOKENS);
  const [view, setView]                   = useState<'chart' | 'new' | 'gainers'>('chart');
  const [filter, setFilter]               = useState('all');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [timeframe, setTimeframe]         = useState('15');
  const [txnTab, setTxnTab]               = useState('all');
  const [search, setSearch]               = useState('');
  const [listSearch, setListSearch]       = useState('');

  // ── Live YST price ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchYSTPrice() {
      try {
        const res = await fetch('/api/price');
        if (!res.ok) return;
        const data = await res.json();
        const price    = parseFloat(data.price);
        const change   = data.change24h ?? 0;
        const volume   = data.volume24h ?? 0;
        if (!isNaN(price) && price > 0) {
          const fmtVol = volume >= 1_000_000 ? `$${(volume / 1_000_000).toFixed(1)}M`
                       : volume >= 1_000     ? `$${(volume / 1_000).toFixed(1)}K`
                       : `$${volume.toFixed(2)}`;
          const updater = (t: Token): Token =>
            t.ticker === 'YST' ? { ...t, price, chg: change, vol: fmtVol } : t;
          setTokens(prev => prev.map(updater));
          setSelectedToken(prev => prev?.ticker === 'YST' ? updater(prev) : prev);
        }
      } catch { /* silent fallback */ }
    }
    fetchYSTPrice();
  }, []);

  const filteredTokens = tokens.filter(t => {
    const q = (listSearch || search).toLowerCase();
    if (q && !t.ticker.toLowerCase().includes(q) && !t.name.toLowerCase().includes(q)) return false;
    if (filter === 'yakk')     return t.cat === 'yakk';
    if (filter === 'bluechip') return t.cat === 'bluechip';
    if (filter === 'updated')  return t.updated;
    if (filter === 'new')      return t.isNew;
    return true;
  });

  const filteredTxns = MOCK_TXNS.filter(tx =>
    txnTab === 'all' ? true : tx.type === txnTab.toUpperCase()
  );
  const gainers  = [...tokens].sort((a, b) => b.chg - a.chg);
  const newPairs = tokens.filter(t => t.isNew);

  // ── Chart iframe src — uses pair address, falls back to mint ───────────────
  function chartSrc(t: Token) {
    const addr = t.pair && !t.pair.includes('TODO') ? t.pair : t.mint;
    return `https://dexscreener.com/solana/${addr}?embed=1&theme=dark&trades=0&info=0`;
  }

  // ── Token action URLs ──────────────────────────────────────────────────────
  function dexUrl(t: Token)      { return `https://dexscreener.com/solana/${t.pair && !t.pair.includes('TODO') ? t.pair : t.mint}`; }
  function solscanUrl(t: Token)  { return `https://solscan.io/token/${t.mint}`; }
  function meteoraUrl(t: Token)  { return `https://app.meteora.ag/pools/${t.pair && !t.pair.includes('TODO') ? t.pair : t.mint}`; }
  function jupiterUrl(t: Token)  { return `https://jup.ag/swap/SOL-${t.mint}`; }

  return (
    <div style={{ height: 'calc(100vh - 74px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* ── Gate ──────────────────────────────────────────────────────────── */}
      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKK SCREENER</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>250,000+ $YST</strong> to access real-time token screening.
          </div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
            Get $YST
          </a>
        </div>
      )}

      {hasAccess && (
        <div id="screener-wrap" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

          {/* ── Toolbar ───────────────────────────────────────────────────── */}
          <div id="scr-toolbar" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flexShrink: 0, background: 'var(--bg2)' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '14px', color: 'var(--pink)', whiteSpace: 'nowrap' }}>
              YAKK <span style={{ color: 'var(--gold)' }}>SCREENER</span>
            </div>
            <input className="scr-search inp" type="text" placeholder="Search token, ticker…" value={search} onChange={e => setSearch(e.target.value)} style={{ minWidth: 0, flex: '1 1 180px' }} />
            <div className="scr-nav" style={{ display: 'flex', gap: '4px' }}>
              {(['chart', 'new', 'gainers'] as const).map(v => (
                <button key={v} className={`scr-nb mode-pill${view === v ? ' active' : ''}`} onClick={() => setView(v)}>
                  {v === 'chart' ? 'CHART' : v === 'new' ? 'NEW PAIRS' : 'GAINERS'}
                </button>
              ))}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '3px 9px', borderRadius: '3px', fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--green)' }}>$10 vs $300+ DEX</span>
              <button className="btn btn-pink" style={{ fontSize: '10px', padding: '5px 12px' }}>+ UPDATE TOKEN</button>
            </div>
          </div>

          {/* ── Body ──────────────────────────────────────────────────────── */}
          <div id="scr-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* Left: token list */}
            <div id="scr-left" style={{ width: '290px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
              <div style={{ padding: '9px 11px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <input className="scr-lp-search" type="text" placeholder="Filter tokens..." value={listSearch} onChange={e => setListSearch(e.target.value)} />
              </div>
              <div style={{ padding: '6px 11px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '4px', flexShrink: 0, overflowX: 'auto' }}>
                {['all', 'yakk', 'bluechip', 'updated', 'new'].map(f => (
                  <div key={f} className={`fp${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)} style={{ cursor: 'pointer' }}>
                    {f === 'yakk' ? 'YST TRUSTED' : f.toUpperCase()}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '22px 1fr 70px 64px', padding: '5px 11px', borderBottom: '1px solid var(--border)', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', flexShrink: 0, gap: '4px' }}>
                <div>#</div><div>TOKEN</div><div style={{ textAlign: 'right' }}>PRICE</div><div style={{ textAlign: 'right' }}>24H</div>
              </div>
              <div className="scr-list" style={{ flex: 1, overflowY: 'auto' }}>
                {filteredTokens.map((t, i) => (
                  <div key={t.id} onClick={() => { setSelectedToken(t); setView('chart'); }} style={{ display: 'grid', gridTemplateColumns: '22px 1fr 70px 64px', padding: '8px 11px', gap: '4px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.03)', background: selectedToken?.id === t.id ? 'rgba(224,96,126,0.06)' : 'transparent', alignItems: 'center' }}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>{i + 1}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '14px' }}>{t.emoji}</span>
                        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '11px' }}>{t.ticker}</span>
                        {t.cat === 'yakk' && <span style={{ fontSize: '7px', background: 'rgba(224,96,126,0.1)', color: 'var(--pink)', padding: '1px 4px', borderRadius: '3px', fontFamily: 'Space Mono,monospace' }}>YST ✓</span>}
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '10px' }}>{fmtPrice(t.price)}</div>
                    <div style={{ textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '10px', color: t.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {t.chg >= 0 ? '+' : ''}{t.chg.toFixed(2)}%
                    </div>
                  </div>
                ))}
                {filteredTokens.length === 0 && (
                  <div style={{ padding: '30px 11px', textAlign: 'center', color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '10px' }}>No tokens match filter</div>
                )}
              </div>
            </div>

            {/* Center: chart + stats + txns */}
            <div id="scr-center" style={{ flex: 1, overflowY: 'auto', minWidth: 0, background: 'var(--bg)' }}>
              {view === 'chart' && (
                <div>
                  {/* Chart header */}
                  <div className="ch-hdr" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'var(--bg2)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg3)', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      {selectedToken ? selectedToken.emoji : '📊'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '16px' }}>
                        {selectedToken ? `${selectedToken.ticker} / SOL` : 'Select a token'}
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', marginTop: '2px' }}>
                        Solana · {selectedToken ? 'DexScreener' : '—'}
                      </div>
                    </div>
                    {selectedToken && (<>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '17px', fontWeight: 700, marginLeft: '10px' }}>
                        {fmtPrice(selectedToken.price)}
                      </div>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: selectedToken.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {selectedToken.chg >= 0 ? '+' : ''}{selectedToken.chg.toFixed(2)}%
                      </span>
                    </>)}
                    <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                      {[['1', '1M'], ['5', '5M'], ['15', '15M'], ['60', '1H'], ['240', '4H'], ['D', '1D']].map(([val, lbl]) => (
                        <button key={val} className={`tf${timeframe === val ? ' active' : ''}`} onClick={() => setTimeframe(val)}>{lbl}</button>
                      ))}
                    </div>
                  </div>

                  {/* Chart iframe — FIXED */}
                  <div style={{ height: '380px', background: 'var(--bg)', position: 'relative' }}>
                    {selectedToken ? (
                      <iframe
                        key={selectedToken.id}
                        src={chartSrc(selectedToken)}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={`${selectedToken.ticker} Chart`}
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                        <div style={{ fontSize: '32px' }}>🩷</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--muted)' }}>Select a token to load chart</div>
                      </div>
                    )}
                  </div>

                  {/* Stats row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', borderBottom: '1px solid var(--border)' }}>
                    {[['LIQUIDITY', selectedToken?.liq], ['MKT CAP', selectedToken?.mcap], ['24H VOLUME', selectedToken?.vol], ['FDV', selectedToken?.fdv]].map(([lbl, val], idx) => (
                      <div key={lbl as string} className="scr-stat" style={{ padding: '9px 13px', borderRight: idx < 3 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.13em', color: 'var(--dim)', marginBottom: '3px' }}>{lbl}</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px' }}>{(val as string) || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stats row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', borderBottom: '1px solid var(--border)' }}>
                    {[['TXNS (24H)', selectedToken?.txns, ''], ['BUYS', selectedToken?.buys, 'up'], ['SELLS', selectedToken?.sells, 'dn'], ['HOLDERS', selectedToken?.holders, '']].map(([lbl, val, cls], idx) => (
                      <div key={lbl as string} className="scr-stat" style={{ padding: '9px 13px', borderRight: idx < 3 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.13em', color: 'var(--dim)', marginBottom: '3px' }}>{lbl}</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px', color: cls === 'up' ? 'var(--green)' : cls === 'dn' ? 'var(--red)' : undefined }}>{(val as string) || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Txns */}
                  <div style={{ padding: '7px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--bg2)' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>Transactions</div>
                    <div style={{ display: 'flex', gap: '2px', marginLeft: '7px' }}>
                      {['all', 'buy', 'sell'].map(tab => (
                        <button key={tab} className={`txn-tab${txnTab === tab ? ' active' : ''}`} onClick={() => setTxnTab(tab)}>
                          {tab === 'all' ? 'All' : tab === 'buy' ? 'Buys' : 'Sells'}
                        </button>
                      ))}
                    </div>
                    {selectedToken && (
                      <a href={solscanUrl(selectedToken)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', fontSize: '8px', color: 'var(--blue)', padding: '2px 5px', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '3px', textDecoration: 'none' }}>
                        SOLSCAN →
                      </a>
                    )}
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <colgroup><col style={{ width: '76px' }}/><col style={{ width: '48px' }}/><col style={{ width: '66px' }}/><col style={{ width: '120px' }}/><col style={{ width: '62px' }}/><col style={{ width: '86px' }}/><col style={{ width: '96px' }}/><col style={{ width: '76px' }}/></colgroup>
                      <thead>
                        <tr>{['DATE','TYPE','USD','AMOUNT','SOL','PRICE','MAKER','TXN'].map(h => (
                          <th key={h} style={{ padding: '6px 12px', textAlign: h === 'TYPE' || h === 'DATE' ? 'left' : 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                        ))}</tr>
                      </thead>
                      <tbody>
                        {selectedToken ? filteredTxns.map((tx, i) => (
                          <tr key={i}>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', color: 'var(--dim)' }}>{tx.date}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace' }}>
                              <span style={{ color: tx.type === 'BUY' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{tx.type}</span>
                            </td>
                            {[tx.usd, tx.amount, tx.sol, tx.price].map((v, j) => (
                              <td key={j} style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: j === 1 ? 'var(--muted)' : undefined }}>{v}</td>
                            ))}
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: 'var(--blue)' }}>{tx.maker}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: 'var(--blue)' }}>{tx.txn}</td>
                          </tr>
                        )) : (
                          <tr><td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '9px' }}>Select a token to load transactions</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {view === 'new' && (
                <div style={{ padding: '18px' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>New Pairs</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginBottom: '14px' }}>Recently listed via $10 YAKK Screener update</div>
                  {newPairs.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '10px' }}>
                      {newPairs.map(t => (
                        <div key={t.id} onClick={() => { setSelectedToken(t); setView('chart'); }} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '20px' }}>{t.emoji}</span>
                            <div>
                              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>{t.ticker}</div>
                              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>{t.name}</div>
                            </div>
                            <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono,monospace', fontSize: '10px', color: t.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>{t.chg >= 0 ? '+' : ''}{t.chg.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '10px' }}>No new pairs yet — listed tokens appear here after a $10 screener update.</div>
                  )}
                </div>
              )}

              {view === 'gainers' && (
                <div style={{ padding: '18px' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Top Gainers — 24H</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginBottom: '14px' }}>Sorted by 24H price change</div>
                  {gainers.map((t, i) => (
                    <div key={t.id} onClick={() => { setSelectedToken(t); setView('chart'); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '10px', color: 'var(--dim)', width: '18px' }}>{i + 1}</div>
                      <span style={{ fontSize: '18px' }}>{t.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>{t.ticker}</div>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>{t.name}</div>
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px' }}>{fmtPrice(t.price)}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', fontWeight: 700, color: t.chg >= 0 ? 'var(--green)' : 'var(--red)', width: '70px', textAlign: 'right' }}>
                        {t.chg >= 0 ? '+' : ''}{t.chg.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: token detail */}
            <div id="scr-right" style={{ width: '272px', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
              {selectedToken ? (
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg3)', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {selectedToken.emoji}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '15px' }}>{selectedToken.ticker}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>{selectedToken.name}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', letterSpacing: '0.1em', marginBottom: '4px' }}>PRICE</div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '20px', fontWeight: 700 }}>{fmtPrice(selectedToken.price)}</div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', color: selectedToken.chg >= 0 ? 'var(--green)' : 'var(--red)', marginTop: '2px' }}>
                      {selectedToken.chg >= 0 ? '▲ +' : '▼ '}{selectedToken.chg.toFixed(2)}%
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                    {[['LIQUIDITY', selectedToken.liq], ['MKT CAP', selectedToken.mcap], ['24H VOL', selectedToken.vol], ['FDV', selectedToken.fdv], ['TXNS', selectedToken.txns], ['HOLDERS', selectedToken.holders]].map(([lbl, val]) => (
                      <div key={lbl as string} style={{ padding: '10px', background: 'var(--bg3)' }}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: '3px' }}>{lbl}</div>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', fontWeight: 700 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a href={dexUrl(selectedToken)} target="_blank" rel="noopener noreferrer" className="btn btn-pink" style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}>📊 DexScreener</a>
                    <a href={solscanUrl(selectedToken)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}>🔍 Solscan</a>
                    <a href={jupiterUrl(selectedToken)} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}>⚡ Trade on Jupiter</a>
                  </div>
                  {selectedToken.cat === 'yakk' && (
                    <div style={{ marginTop: '12px', background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--pink)', letterSpacing: '0.1em' }}>YAKK VERIFIED ✓</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', color: 'var(--dim)', marginTop: '3px' }}>Community audited token</div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '260px', gap: '7px' }}>
                  <div style={{ fontSize: '22px' }}>👈</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', color: 'var(--muted)' }}>Select a token</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
