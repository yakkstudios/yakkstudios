'use client';
import { useState } from 'react';

const ENTRIES = [
  {
    num: '01',
    token: '$BER',
    extraction: '~$128K',
    pattern: 'Coordinated dump post-listing',
    status: 'EXPOSED',
    detail: 'Linked wallets executed coordinated sell pressure within 48h of listing. Classic exit liquidity play targeting retail.',
  },
  {
    num: '02',
    token: '$PUNCH',
    extraction: '~$3.5–5M+',
    pattern: 'Serial extraction — dev wallet drains, LP pulls',
    status: 'EXPOSED',
    detail: 'Same dev infrastructure across multiple rugged tokens. Wallets share common funding source and timing signatures.',
  },
  {
    num: '03',
    token: '$JELLYBEAN',
    extraction: '~$600K–1M+',
    pattern: 'Cabal wallet relay patterns, structured exits',
    status: 'EXPOSED',
    detail: 'Wallet cluster analysis revealed structured exit strategy. Multiple wallets funded from same source executed staggered sells.',
  },
  {
    num: '04',
    token: '$URANUS',
    extraction: '~$3.5–5M+',
    pattern: 'Coordinated insider dump, known relay wallets',
    status: 'EXPOSED',
    detail: 'Known relay wallets from previous investigations. Coordinated insider dump confirmed through on-chain timing analysis.',
  },
  {
    num: '05',
    token: '$PIGEON',
    extraction: '~$500K–1M+',
    pattern: 'LP pulls, ghost wallet exits',
    status: 'EXPOSED',
    detail: 'Liquidity pulled through ghost wallets. Pattern matches known extraction playbook from previous cases.',
  },
  {
    num: '06',
    token: '$HOOD',
    extraction: '~$12–20M+',
    pattern: 'Large-scale dev extraction, insider coordination',
    status: 'EXPOSED',
    detail: 'Large-scale developer extraction with insider coordination. One of the largest documented cases in the YAKK investigation series.',
  },
  {
    num: '07',
    token: '$M3M3',
    extraction: '~$15–25M+',
    pattern: 'Repeat cabal operators, multi-token ring',
    status: 'EXPOSED',
    detail: 'Repeat cabal operators running a multi-token extraction ring. Same 15 wallets identified across multiple tokens.',
  },
  {
    num: '08',
    token: '$TRUMP',
    extraction: '~$1B–3.9B+',
    pattern: 'Largest documented — political memecoin exploitation',
    status: 'EXPOSED',
    detail: 'The largest documented memecoin extraction in history. Political memecoin exploitation at unprecedented scale.',
  },
  {
    num: '09',
    token: '$WATDOG',
    extraction: '~$300K–500K+',
    pattern: 'Wallet convergence, relay exits',
    status: 'EXPOSED',
    detail: 'Wallet convergence analysis confirmed relay exit patterns. Community-reported and verified through on-chain forensics.',
  },
  {
    num: '10',
    token: '$WAR',
    extraction: '~$8–15M+',
    pattern: 'DSKtmLoz $7.98M silent hold, 44-day live infrastructure',
    status: 'EXPOSED',
    detail: 'DSKtmLoz wallet held $7.98M silently for 44 days before executing through live infrastructure. Sophisticated extraction operation.',
  },
  {
    num: '11',
    token: '$BUTTCOIN',
    extraction: '~$5–8M+ net',
    pattern: '57-day investigation · $186M tracked · Highest ghost ratio',
    status: 'EXPOSED',
    detail: '57-day investigation. FFcYgSSg hub $3.01M net. 7abmyox relay $1.53M. 9GVJockJ convergence $2.38M+. 6 ghost exits in top 13. ARu4n5mF: 13,638 txns / $23M routed. $186,427,275 tracked. Highest ghost ratio documented.',
  },
];

const STATUS_COLOR: Record<string, string> = {
  EXPOSED: 'var(--red)',
  PENDING: 'var(--yellow)',
  CLEARED: 'var(--green)',
};

export default function Ledger({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const gated = !walletConnected || ystBalance < 250000;
  const exposedCount = ENTRIES.filter(e => e.status === 'EXPOSED').length;

  return (
    <section id="section-ledger" className="sec-pad">
      {/* Header */}
      <div className="sec-header">
        <div className="sec-eyebrow">09 — THE BOOK OF SIN</div>
        <div className="sec-title">
          Rug Ledger
          <span className="badge b-red" style={{ marginLeft: '0.5rem', fontSize: 11 }}>{exposedCount} EXPOSED</span>
        </div>
        <div className="sec-bar" />
      </div>

      {/* Disclaimer */}
      <div className="warn-bar">
        NOT FINANCIAL ADVICE — Structural estimates only. On-chain behavioral analysis. Patterns ≠ proof of intent. DYOR.
      </div>

      {/* Cumulative total hero */}
      <div style={{
        background: 'rgba(239,68,68,0.04)',
        border: '1px solid rgba(239,68,68,0.18)',
        borderRadius: 9,
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--red)', letterSpacing: '0.18em', marginBottom: 5 }}>
          YAKK CABAL CUMULATIVE RUG LEDGER
        </div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 36px)', color: 'var(--red)' }}>
          ~$1.043B–$3.98B+
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 5 }}>
          {ENTRIES.length} investigations. The ledger never closes.
        </div>
      </div>

      {/* PUNCH highlight bar */}
      <div style={{
        background: 'rgba(239,68,68,0.03)',
        border: '1px solid rgba(239,68,68,0.13)',
        borderRadius: 7,
        padding: '10px 14px',
        marginBottom: 16,
        fontFamily: 'Space Mono,monospace',
        fontSize: 9,
        color: 'var(--red)',
        letterSpacing: '0.1em',
      }}>
        ▼ $PUNCH — SERIAL EXTRACTOR — DEV DRAINS · LP PULLS · COORDINATED DUMPS
      </div>

      {/* PUNCH stats */}
      <div className="grid3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="slbl">TOTAL TRACKED ($PUNCH)</div>
          <div className="sval" style={{ color: 'var(--red)', fontSize: 17 }}>~$3.5–5M+</div>
        </div>
        <div className="stat-card">
          <div className="slbl">DEV WALLET DRAINS</div>
          <div className="sval" style={{ color: 'var(--yellow)', fontSize: 17 }}>Multiple</div>
          <div className="ssub">LP pulls confirmed</div>
        </div>
        <div className="stat-card">
          <div className="slbl">NET EXTRACTION FLOOR</div>
          <div className="sval" style={{ color: 'var(--pink)', fontSize: 17 }}>~$3.5–5M+</div>
        </div>
      </div>

      {/* Gate banner */}
      {gated && (
        <div style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '10px 14px',
          marginBottom: 16,
          fontSize: 11,
          color: 'var(--dim)',
        }}>
          🔒 250,000+ $YST required for full investigation details — <span style={{ color: 'var(--muted)' }}>Connect wallet to verify</span>
        </div>
      )}

      {/* Investigation Table */}
      <div className="ledger-table-wrap" style={{ overflow: 'hidden', borderRadius: 9, border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ tableLayout: 'fixed', width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 12 }}>
            <colgroup>
              <col style={{ width: 32 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 120 }} />
              <col />
              <col style={{ width: 88 }} />
            </colgroup>
            <thead>
              <tr style={{ background: 'var(--bg4)' }}>
                {['#', 'TOKEN', 'EXTRACTION EST.', 'KEY PATTERN', 'STATUS'].map(h => (
                  <th key={h} style={{
                    padding: '10px 10px',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.8px',
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    fontFamily: 'Syne,sans-serif',
                    whiteSpace: 'nowrap',
                    borderBottom: '1px solid var(--border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((e) => (
                <>
                  <tr
                    key={e.token}
                    onClick={() => setSelected(selected === e.token ? null : e.token)}
                    style={{
                      cursor: 'pointer',
                      background: selected === e.token ? 'var(--bg4)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    <td style={{ padding: '10px', color: 'var(--dim)', fontFamily: 'Space Mono,monospace', fontSize: 9, borderTop: '1px solid var(--border)' }}>
                      {e.num}
                    </td>
                    <td style={{ padding: '10px', color: '#fff', fontWeight: 700, fontFamily: 'Syne,sans-serif', fontSize: 12, borderTop: '1px solid var(--border)' }}>
                      {e.token}
                    </td>
                    <td style={{ padding: '10px', fontFamily: 'Space Mono,monospace', fontSize: 11, color: 'var(--text)', borderTop: '1px solid var(--border)' }}>
                      {e.extraction}
                    </td>
                    <td style={{ padding: '10px', fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, borderTop: '1px solid var(--border)' }}>
                      {e.pattern}
                    </td>
                    <td style={{ padding: '10px', borderTop: '1px solid var(--border)' }}>
                      <span className="badge b-red">{e.status}</span>
                    </td>
                  </tr>
                  {selected === e.token && (
                    <tr key={e.token + '-detail'} style={{ background: 'var(--bg3)' }}>
                      <td colSpan={5} style={{
                        padding: '12px 14px',
                        fontSize: 12,
                        color: 'var(--muted)',
                        borderTop: '1px solid var(--border)',
                        lineHeight: 1.7,
                      }}>
                        {e.detail}
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {/* Subtotal row */}
              <tr style={{ background: 'rgba(247,201,72,0.04)', borderTop: '1px solid rgba(247,201,72,0.15)' }}>
                <td colSpan={2} style={{
                  padding: '10px',
                  fontFamily: 'Syne,sans-serif',
                  fontWeight: 800,
                  color: 'var(--gold)',
                  fontSize: 12,
                  borderTop: '2px solid rgba(247,201,72,0.3)',
                }}>
                  TOKENS 1–10 SUBTOTAL
                </td>
                <td style={{
                  padding: '10px',
                  fontFamily: 'Space Mono,monospace',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text)',
                  borderTop: '2px solid rgba(247,201,72,0.3)',
                }}>
                  ~$1.043B–$3.972B+
                </td>
                <td colSpan={2} style={{
                  padding: '10px',
                  fontSize: 10,
                  color: 'var(--dim)',
                  fontStyle: 'italic',
                  borderTop: '2px solid rgba(247,201,72,0.3)',
                }}>
                  Same 15 wallets. Same relay patterns. Every time.
                </td>
              </tr>
              {/* Running total row */}
              <tr style={{ background: 'rgba(239,68,68,0.06)' }}>
                <td colSpan={2} style={{
                  padding: '10px',
                  fontFamily: 'Syne,sans-serif',
                  fontWeight: 800,
                  color: 'var(--red)',
                  fontSize: 13,
                  borderTop: '2px solid rgba(239,68,68,0.4)',
                }}>
                  RUNNING TOTAL
                </td>
                <td style={{
                  padding: '10px',
                  fontFamily: 'Space Mono,monospace',
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--red)',
                  borderTop: '2px solid rgba(239,68,68,0.4)',
                }}>
                  ~$1.048B–$3.98B+
                </td>
                <td colSpan={2} style={{
                  padding: '10px',
                  fontSize: 11,
                  color: 'var(--red)',
                  fontStyle: 'italic',
                  borderTop: '2px solid rgba(239,68,68,0.4)',
                }}>
                  Eleven tokens. $186M tracked in $BUTTCOIN alone. The ledger never closes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--dim)', marginTop: 16, fontStyle: 'italic' }}>
        New investigations added as evidence is confirmed. Submit a tip via Cabal Scanner.
      </p>
    </section>
  );
}
