'use client';
import { useState } from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

const TOKENS = [
  { emoji:'🩷', ticker:'YST',  name:'YAKK Studios Token', price:0.0000018, chg:1.44,  mcap:'$1.8M', vol:'$24.1K', liq:'$189K', holders:'4,281', buys:'682', sells:'522', dex:'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM', ca:'YSTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYST' },
  { emoji:'🟢', ticker:'SPT',  name:'StakePoint Token',   price:0.00000042, chg:0.88,  mcap:'$420K', vol:'$3.2K',  liq:'$41K',  holders:'1,120', buys:'188', sells:'124', dex:'spt', ca:'SPTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxSPT' },
  { emoji:'◎',  ticker:'SOL',  name:'Solana',             price:142.30,     chg:2.14,  mcap:'$68.4B',vol:'$1.8B',  liq:'$4.2B', holders:'—',     buys:'7.8M',sells:'6.4M',dex:'so11111111111111111111111111111111111111112', ca:'So1111...1112' },
  { emoji:'🟡', ticker:'BONK', name:'Bonk',               price:0.0000194,  chg:-3.22, mcap:'$1.2B', vol:'$89.4M', liq:'$31M',  holders:'680K',  buys:'19K', sells:'23K', dex:'bonk', ca:'DezX...bonk' },
  { emoji:'🐕', ticker:'WIF',  name:'dogwifhat',          price:0.614,      chg:5.81,  mcap:'$614M', vol:'$142M',  liq:'$22M',  holders:'194K',  buys:'22K', sells:'16K', dex:'wif', ca:'EKpQ...wif' },
];

const MOCK_RECENT = [
  { type:'BUY',  amt:'0.94 SOL', tok:'78.8M YST', time:'2m ago' },
  { type:'SELL', amt:'0.59 SOL', tok:'49.4M YST', time:'5m ago' },
  { type:'BUY',  amt:'1.40 SOL', tok:'116.6M YST', time:'8m ago' },
  { type:'BUY',  amt:'0.37 SOL', tok:'30.5M YST', time:'14m ago' },
];

function fmtPrice(p: number) {
  if (p >= 1) return '$' + p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 0.001) return '$' + p.toFixed(6);
  return '$' + p.toFixed(10).replace(/0+$/, '');
}

export default function Terminal({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;

  const [selectedToken, setSelectedToken] = useState<typeof TOKENS[0] | null>(null);
  const [timeframe, setTimeframe] = useState('15');
  const [fromAmt, setFromAmt] = useState('');
  const [slippage, setSlippage] = useState(1);
  const [customSlip, setCustomSlip] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [risk, setRisk] = useState('2');
  const [stopLoss, setStopLoss] = useState('20');

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
          <div className="locked-icon">🔒</div>
          <div className="locked-title">YAKK TERMINAL</div>
          <div className="locked-sub">
            Connect your wallet and hold <strong>250,000+ $YST</strong> to access the trading terminal.
          </div>
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
              {/* Token selector pills */}
              <div className="term-tok-sel" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1, padding: 0, border: 'none' }}>
                {TOKENS.map(t => (
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
                    <span>{t.emoji}</span> {t.ticker}
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

            {/* Chart area */}
            <div id="term-chart" style={{ flex: 1, overflow: 'hidden', position: 'relative', background: 'var(--bg)' }}>
              {selectedToken ? (
                <iframe
                  src={`https://dexscreener.com/solana/${selectedToken.dex}?embed=1&theme=dark&trades=0&info=0`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title={`${selectedToken.ticker} Chart`}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '28px' }}>⚡</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '13px', color: 'var(--muted)' }}>Select a token to trade</div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: '9px', color: 'var(--dim)' }}>Chart powered by TradingView</div>
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
                    <span>Balance: — SOL</span>
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
                      <span>{selectedToken?.emoji || '🩷'}</span> {selectedToken?.ticker || 'YST'}
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
                CONNECT WALLET TO TRADE
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
                      {(val as string) || '—'}
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
