'use client';
import { useState } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

/* ── Static mock data ─────────────────────── */
const TOKENS = [
  { id:1, emoji:'🩷', ticker:'YST',  name:'YAKK Studios Token', price:0.0000018, chg:1.44,  vol:'$24.1K', liq:'$189K', mcap:'$1.8M', fdv:'$1.8M', txns:'1,204', buys:'682', sells:'522', holders:'4,281', cat:'yakk', isNew:false, updated:true, dex:'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM' },
  { id:2, emoji:'🟢', ticker:'SPT',  name:'StakePoint Token',    price:0.00000042, chg:0.88,  vol:'$3.2K',  liq:'$41K',  mcap:'$420K', fdv:'$420K', txns:'312',   buys:'188', sells:'124', holders:'1,120', cat:'yakk', isNew:false, updated:true, dex:'spt' },
  { id:3, emoji:'🔒', ticker:'LOCK', name:'Streamlock',          price:0.0426,     chg:2.63,  vol:'$97',    liq:'$12K',  mcap:'$26K',  fdv:'$25K',  txns:'3',     buys:'3',   sells:'0',   holders:'—',     cat:'yakk', isNew:false, updated:true, dex:'FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump' },
  { id:4, emoji:'◎',  ticker:'SOL',  name:'Solana',              price:142.30,     chg:2.14,  vol:'$1.8B',  liq:'$4.2B', mcap:'$68.4B',fdv:'$78B',  txns:'14.2M', buys:'7.8M',sells:'6.4M',holders:'—',     cat:'bluechip', isNew:false, updated:false, dex:'so11111111111111111111111111111111111111112' },
  { id:5, emoji:'🐕', ticker:'WIF',  name:'dogwifhat',           price:0.614,      chg:5.81,  vol:'$142M',  liq:'$22M',  mcap:'$614M', fdv:'$614M', txns:'38K',   buys:'22K', sells:'16K', holders:'194K',  cat:'bluechip', isNew:false, updated:false, dex:'wif' },
];

const MOCK_TXNS = [
  { date:'Mar 28', type:'BUY',  usd:'$142',  amount:'78,888,888 YST', sol:'0.94', price:'$0.0000018', maker:'8xK4...2mPq', txn:'4yR2...kL8p' },
  { date:'Mar 28', type:'SELL', usd:'$89',   amount:'49,444,444 YST', sol:'0.59', price:'$0.0000018', maker:'3vNx...9wTj', txn:'7mF8...nQ3r' },
  { date:'Mar 28', type:'BUY',  usd:'$210',  amount:'116,666,666 YST',sol:'1.40', price:'$0.0000018', maker:'5kLp...4dRs', txn:'2hN6...wY9t' },
  { date:'Mar 27', type:'BUY',  usd:'$55',   amount:'30,555,555 YST', sol:'0.37', price:'$0.0000018', maker:'9aTm...7vQk', txn:'6pJ4...xM2s' },
  { date:'Mar 27', type:'SELL', usd:'$320',  amount:'177,777,777 YST',sol:'2.13', price:'$0.0000018', maker:'2fRw...8nBj', txn:'3kL9...tH7m' },
  { date:'Mar 27', type:'BUY',  usd:'$178',  amount:'98,888,888 YST', sol:'1.18', price:'$0.0000018', maker:'7xCd...3pLs', txn:'9rW5...bN4k' },
];

function fmtPrice(p: number) {
  if (p >= 1) return '$' + p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 0.001) return '$' + p.toFixed(6);
  return '$' + p.toFixed(10).replace(/0+$/, '');
}

export default function Screener({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const [view, setView] = useState<'chart' | 'new' | 'gainers'>('chart');
  const [filter, setFilter] = useState('all');
  const [selectedToken, setSelectedToken] = useState<typeof TOKENS[0] | null>(null);
  const [timeframe, setTimeframe] = useState('15');
  const [txnTab, setTxnTab] = useState('all');
  const [search, setSearch] = useState('');
  const [listSearch, setListSearch] = useState('');

  const filteredTokens = TOKENS.filter(t => {
    if (listSearch && !t.ticker.toLowerCase().includes(listSearch.toLowerCase()) && !t.name.toLowerCase().includes(listSearch.toLowerCase())) return false;
    if (search && !t.ticker.toLowerCase().includes(search.toLowerCase()) && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'yakk') return t.cat === 'yakk';
    if (filter === 'bluechip') return t.cat === 'bluechip';
    if (filter === 'updated') return t.updated;
    if (filter === 'new') return t.isNew;
    return true;
  });

  const filteredTxns = MOCK_TXNS.filter(tx => {
    if (txnTab === 'buy') return tx.type === 'BUY';
    if (txnTab === 'sell') return tx.type === 'SELL';
    return true;
  });

  const gainers = [...TOKENS].sort((a, b) => b.chg - a.chg);
  const newPairs = TOKENS.filter(t => t.isNew);

  return (
    <div style={{ height: 'calc(100vh - 74px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Token gate */}
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
          {/* ═══ TOOLBAR ═══ */}
          <div id="scr-toolbar" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flexShrink: 0, background: 'var(--bg2)' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '14px', color: 'var(--pink)', whiteSpace: 'nowrap' }}>
              YAKK <span style={{ color: 'var(--gold)' }}>SCREENER</span>
            </div>
            <input
              className="scr-search"
              type="text"
              placeholder="Search token, ticker, CA..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="scr-nav">
              <button className={`scr-nb${view === 'chart' ? ' active' : ''}`} onClick={() => setView('chart')}>CHART</button>
              <button className={`scr-nb${view === 'new' ? ' active' : ''}`} onClick={() => setView('new')}>NEW PAIRS</button>
              <button className={`scr-nb${view === 'gainers' ? ' active' : ''}`} onClick={() => setView('gainers')}>GAINERS</button>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '3px 9px', borderRadius: '3px', fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--green)' }}>$10 vs $300+ DEX</span>
              <button className="btn btn-pink" style={{ fontSize: '10px', padding: '5px 12px' }}>+ UPDATE TOKEN</button>
              <button className="btn btn-outline" style={{ fontSize: '10px', padding: '5px 12px' }}>🔗 Wallet</button>
            </div>
          </div>

          {/* ═══ BODY ═══ */}
          <div id="scr-body" style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>

            {/* ─── LEFT: Token list ─── */}
            <div id="scr-left" style={{ width: '290px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
              <div className="scr-lp-top" style={{ padding: '9px 11px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
                <input
                  className="scr-lp-search"
                  type="text"
                  placeholder="Filter tokens..."
                  value={listSearch}
                  onChange={e => setListSearch(e.target.value)}
                />
              </div>
              <div className="scr-filters" style={{ padding: '6px 11px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '4px', flexShrink: 0, overflowX: 'auto' }}>
                {['all', 'yakk', 'bluechip', 'updated', 'new'].map(f => (
                  <div
                    key={f}
                    className={`fp${filter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                    style={{ cursor: 'pointer' }}
                  >
                    {f === 'yakk' ? 'YST TRUSTED' : f.toUpperCase()}
                  </div>
                ))}
              </div>
              <div className="scr-col-hdr" style={{ display: 'grid', gridTemplateColumns: '22px 1fr 70px 64px', padding: '5px 11px', borderBottom: '1px solid var(--border)', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', flexShrink: 0, gap: '4px' }}>
                <div>#</div><div>TOKEN</div><div style={{ textAlign: 'right' }}>PRICE</div><div style={{ textAlign: 'right' }}>24H</div>
              </div>
              <div className="scr-list" style={{ flex: 1, overflowY: 'auto' }}>
                {filteredTokens.map((t, i) => (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedToken(t); setView('chart'); }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '22px 1fr 70px 64px',
                      padding: '8px 11px',
                      gap: '4px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255,255,255,0.03)',
                      background: selectedToken?.id === t.id ? 'rgba(224,96,126,0.06)' : 'transparent',
                      transition: 'background 0.1s',
                      alignItems: 'center',
                    }}
                  >
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
                  <div style={{ padding: '30px 11px', textAlign: 'center', color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '10px' }}>
                    No tokens match filter
                  </div>
                )}
              </div>
            </div>

            {/* ─── CENTER: Chart + stats + txns ─── */}
            <div id="scr-center" style={{ flex: 1, overflowY: 'auto', minWidth: 0, background: 'var(--bg)' }}>

              {/* CHART VIEW */}n              {view === 'chart' && (
                <div>
                  {/* Chart header */}
                  <div className="ch-hdr" style={{ padding: '11px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', background: 'var(--bg2)' }}>
                    <div className="ch-img" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg3)', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                      {selectedToken ? selectedToken.emoji : '📊'}
                    </div>
                    <div>
                      <div className="ch-pair" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '16px', color: selectedToken ? 'var(--text)' : 'var(--muted)' }}>
                        {selectedToken ? `${selectedToken.ticker} / SOL` : 'Select a token'}
                      </div>
                      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>Solana</span>
                        <span style={{ color: 'var(--dim)', fontSize: '8px' }}>·</span>
                        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>{selectedToken ? 'DexScreener' : '—'}</span>
                      </div>
                    </div>
                    <div className="ch-price" style={{ fontFamily: 'Space Mono,monospace', fontSize: selectedToken ? '17px' : '13px', fontWeight: 700, marginLeft: '10px', color: selectedToken ? 'var(--text)' : 'var(--dim)' }}>
                      {selectedToken ? fmtPrice(selectedToken.price) : '—'}
                    </div>
                    {selectedToken && (
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: selectedToken.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                        {selectedToken.chg >= 0 ? '+' : ''}{selectedToken.chg.toFixed(2)}%
                      </span>
                    )}
                    <div className="tf-row" style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
                      {[['1', '1M'], ['5', '5M'], ['15', '15M'], ['60', '1H'], ['240', '4H'], ['D', '1D']].map(([val, lbl]) => (
                        <button
                          key={val}
                          className={`tf${timeframe === val ? ' active' : ''}`}
                          onClick={() => setTimeframe(val)}
                        >
                          {lbl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chart area */}
                  <div style={{ height: '380px', background: 'var(--bg)', position: 'relative' }}>
                    {selectedToken ? (
                      <iframe
                        src={`https://dexscreener.com/solana/${selectedToken.dex}?embed=1&theme=dark&trades=0&info=0`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={`${selectedToken.ticker} Chart`}
                      />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '8px' }}>
                        <div style={{ fontSize: '32px' }}>🩷</div>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px', color: 'var(--muted)' }}>Select a token to load chart</div>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>TradingView · Data via Solscan</div>
                      </div>
                    )}
                  </div>

                  {/* Stats row 1 */}
                  <div className="scr-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', borderBottom: '1px solid var(--border)' }}>
                    {[
                      ['LIQUIDITY', selectedToken?.liq],
                      ['MKT CAP', selectedToken?.mcap],
                      ['24H VOLUME', selectedToken?.vol],
                      ['FDV', selectedToken?.fdv],
                    ].map(([lbl, val], idx) => (
                      <div key={lbl as string} className="scr-stat" style={{ padding: '9px 13px', borderRight: idx < 3 ? '1px solid var(--border)' : 'none' }}>
                        <div className="scr-slbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.13em', color: 'var(--dim)', marginBottom: '3px' }}>{lbl}</div>
                        <div className="scr-sval" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px' }}>{(val as string) || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stats row 2 */}
                  <div className="scr-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', borderBottom: '1px solid var(--border)' }}>
                    {[
                      ['TXNS (24H)', selectedToken?.txns, ''],
                      ['BUYS', selectedToken?.buys, 'up'],
                      ['SELLS', selectedToken?.sells, 'dn'],
                      ['HOLDERS', selectedToken?.holders, ''],
                    ].map(([lbl, val, cls], idx) => (
                      <div key={lbl as string} className="scr-stat" style={{ padding: '9px 13px', borderRight: idx < 3 ? '1px solid var(--border)' : 'none' }}>
                        <div className="scr-slbl" style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.13em', color: 'var(--dim)', marginBottom: '3px' }}>{lbl}</div>
                        <div className={`scr-sval ${cls}`} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '14px', color: cls === 'up' ? 'var(--green)' : cls === 'dn' ? 'var(--red)' : undefined }}>{(val as string) || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Transactions header */}
                  <div className="txns-hdr" style={{ padding: '7px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--bg2)' }}>
                    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>Transactions</div>
                    <div style={{ display: 'flex', gap: '2px', marginLeft: '7px' }}>
                      {['all', 'buy', 'sell'].map(tab => (
                        <button
                          key={tab}
                          className={`txn-tab${txnTab === tab ? ' active' : ''}`}
                          onClick={() => setTxnTab(tab)}
                        >
                          {tab === 'all' ? 'All' : tab === 'buy' ? 'Buys' : 'Sells'}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>Via Solscan</span>
                      {selectedToken && (
                        <a
                          href={`https://solscan.io/token/${selectedToken.dex}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="scan-lnk"
                          style={{ fontSize: '8px', color: 'var(--blue)', textDecoration: 'none', padding: '2px 5px', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '3px' }}
                        >
                          SOLSCAN →
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Transactions table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table className="txn-tbl" style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                      <colgroup>
                        <col style={{ width: '76px' }} />
                        <col style={{ width: '48px' }} />
                        <col style={{ width: '66px' }} />
                        <col style={{ width: '96px' }} />
                        <col style={{ width: '62px' }} />
                        <col style={{ width: '86px' }} />
                        <col style={{ width: '96px' }} />
                        <col style={{ width: '76px' }} />
                      </colgroup>
                      <thead>
                        <tr>
                          <th style={{ padding: '6px 12px', textAlign: 'left', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>DATE</th>
                          <th style={{ padding: '6px 12px', textAlign: 'left', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>TYPE</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>USD</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>AMOUNT</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>SOL</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>PRICE</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>MAKER</th>
                          <th style={{ padding: '6px 12px', textAlign: 'right', fontFamily: 'Space Mono,monospace', fontSize: '8px', letterSpacing: '0.1em', color: 'var(--dim)', background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>TXN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedToken ? filteredTxns.map((tx, i) => (
                          <tr key={i}>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', color: 'var(--dim)' }}>{tx.date}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'left' }}>
                              <span style={{ color: tx.type === 'BUY' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>{tx.type}</span>
                            </td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right' }}>{tx.usd}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: 'var(--muted)' }}>{tx.amount}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right' }}>{tx.sol}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right' }}>{tx.price}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: 'var(--blue)' }}>{tx.maker}</td>
                            <td style={{ padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '10px', fontFamily: 'Space Mono,monospace', textAlign: 'right', color: 'var(--blue)' }}>{tx.txn}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '9px' }}>
                              Select a token to load transactions
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* NEW PAIRS VIEW */}
              {view === 'new' && (
                <div style={{ padding: '18px' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>New Pairs</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginBottom: '14px' }}>Recently listed via $10 YAKK Screener update</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))', gap: '10px' }}>
                    {newPairs.length > 0 ? newPairs.map(t => (
                      <div
                        key={t.id}
                        onClick={() => { setSelectedToken(t); setView('chart'); }}
                        style={{
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          padding: '12px',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '20px' }}>{t.emoji}</span>
                          <div>
                            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>{t.ticker}</div>
                            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>{t.name}</div>
                          </div>
                          <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono,monospace', fontSize: '10px', color: t.chg >= 0 ? 'var(--green)' : 'var(--red)' }}>
                            {t.chg >= 0 ? '+' : ''}{t.chg.toFixed(1)}%
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontFamily: 'Space Mono,monospace', fontSize: '9px' }}>
                          <div><span style={{ color: 'var(--dim)' }}>PRICE </span><span>{fmtPrice(t.price)}</span></div>
                          <div><span style={{ color: 'var(--dim)' }}>VOL </span><span>{t.vol}</span></div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: '10px', padding: '20px' }}>No new pairs found</div>
                    )}
                  </div>
                </div>
              )}

              {/* GAINERS VIEW */}
              {view === 'gainers' && (
                <div style={{ padding: '18px' }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>Top Gainers — 24H</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)', marginBottom: '14px' }}>Sorted by 24H price change</div>
                  {gainers.map((t, i) => (
                    <div
                      key={t.id}
                      onClick={() => { setSelectedToken(t); setView('chart'); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                    >
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '10px', color: 'var(--dim)', width: '18px' }}>{i + 1}</div>
                      <span style={{ fontSize: '18px' }}>{t.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px' }}>{t.ticker}</div>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)' }}>{t.name}</div>
                      </div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', textAlign: 'right' }}>{fmtPrice(t.price)}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', fontWeight: 700, color: t.chg >= 0 ? 'var(--green)' : 'var(--red)', width: '70px', textAlign: 'right' }}>
                        {t.chg >= 0 ? '+' : ''}{t.chg.toFixed(2)}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── RIGHT: Token detail panel ─── */}
            <div id="scr-right" style={{ width: '272px', background: 'var(--bg2)', borderLeft: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0 }}>
              {selectedToken ? (
                <div style={{ padding: '16px' }}>
                  {/* Token header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg3)', border: '2px solid var(--border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {selectedToken.emoji}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '15px' }}>{selectedToken.ticker}</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>{selectedToken.name}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--dim)', letterSpacing: '0.1em', marginBottom: '4px' }}>PRICE</div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '20px', fontWeight: 700 }}>{fmtPrice(selectedToken.price)}</div>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', color: selectedToken.chg >= 0 ? 'var(--green)' : 'var(--red)', marginTop: '2px' }}>
                      {selectedToken.chg >= 0 ? '▲' : '▼'} {selectedToken.chg >= 0 ? '+' : ''}{selectedToken.chg.toFixed(2)}%
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                    {[
                      ['LIQUIDITY', selectedToken.liq],
                      ['MKT CAP', selectedToken.mcap],
                      ['24H VOL', selectedToken.vol],
                      ['FDV', selectedToken.fdv],
                      ['TXNS', selectedToken.txns],
                      ['HOLDERS', selectedToken.holders],
                    ].map(([lbl, val]) => (
                      <div key={lbl as string} style={{ padding: '10px', background: 'var(--bg3)' }}>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: '3px' }}>{lbl}</div>
                        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '11px', fontWeight: 700 }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a
                      href={`https://dexscreener.com/solana/${selectedToken.dex}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-pink"
                      style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}
                    >
                      📊 DexScreener
                    </a>
                    <a
                      href={`https://solscan.io/token/${selectedToken.dex}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                      style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}
                    >
                      🔍 Solscan
                    </a>
                    <a
                      href={`https://app.meteora.ag/pools/${selectedToken.dex}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-gold"
                      style={{ fontSize: '10px', textAlign: 'center', padding: '8px', display: 'block' }}
                    >
                      ⚡ Trade on Meteora
                    </a>
                  </div>

                  {/* Category badge */}
                  {selectedToken.cat === 'yakk' && (
                    <div style={{ marginTop: '12px', background: 'rgba(224,96,126,0.08)', border: '1px solid rgba(224,96,126,0.2)', borderRadius: '6px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '8px', color: 'var(--pink)', letterSpacing: '0.1em' }}>YAKK VERIFIED ✓</div>
                      <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '7px', color: 'var(--dim)', marginTop: '3px' }}>Community audited token</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rp-empty" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '260px', gap: '7px' }}>
                  <div style={{ fontSize: '22px' }}>👈</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '12px', color: 'var(--muted)' }}>Select a token</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>Token details appear here</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
