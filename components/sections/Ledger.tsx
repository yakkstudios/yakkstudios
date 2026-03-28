'use client';
import { useState } from 'react';

const ENTRIES = [
  {
    token: '$BER',
    extraction: '~$128K',
    pattern: 'Coordinated dump post-listing',
    status: 'EXPOSED',
    detail: 'Linked wallets executed coordinated sell pressure within 48h of listing. Classic exit liquidity play targeting retail.',
  },
  {
    token: '$PUNCH',
    extraction: '~$3.5–5M+',
    pattern: 'Serial extraction — developer pattern',
    status: 'EXPOSED',
    detail: 'Same dev infrastructure across multiple rugged tokens. Wallets share common funding source and timing signatures.',
  },
  {
    token: '$MOON',
    extraction: 'Under investigation',
    pattern: 'Suspicious wallet clustering',
    status: 'PENDING',
    detail: 'Early wallet activity shows pre-launch coordination. Investigation ongoing.',
  },
];

const STATUS_COLOR: Record<string, string> = {
  EXPOSED: '#e8206a',
  PENDING: '#e8c440',
  CLEARED: '#00c896',
};

export default function Ledger({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const gated = !walletConnected || ystBalance < 250000;

  return (
    <section id="section-ledger" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
          🗂 RUG LEDGER
        </h2>
        <span style={{ fontSize: 10, color: '#e8206a', border: '1px solid #e8206a', padding: '2px 8px', borderRadius: 10 }}>
          {ENTRIES.filter(e => e.status === 'EXPOSED').length} EXPOSED
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
        On-chain evidence archive. Every entry backed by wallet analysis.
      </p>

      {/* Gate banner */}
      {gated && (
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontSize: 11, color: '#666' }}>
          🔒 250,000+ $YST Staked on StakePoint required — <span style={{ color: '#444' }}>NOT CHECKED</span>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
              {['TOKEN', 'EXTRACTION EST.', 'KEY PATTERN', 'STATUS'].map((h) => (
                <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#555', fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENTRIES.map((e) => (
              <>
                <tr
                  key={e.token}
                  onClick={() => setSelected(selected === e.token ? null : e.token)}
                  style={{ borderBottom: '1px solid #0f0f0f', cursor: 'pointer', background: selected === e.token ? '#111' : 'transparent' }}
                >
                  <td style={{ padding: '10px', color: '#fff', fontWeight: 700 }}>{e.token}</td>
                  <td style={{ padding: '10px', color: '#ccc' }}>{e.extraction}</td>
                  <td style={{ padding: '10px', color: '#aaa' }}>{e.pattern}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      color: STATUS_COLOR[e.status] || '#888',
                      border: `1px solid ${STATUS_COLOR[e.status] || '#333'}`,
                      padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700
                    }}>{e.status}</span>
                  </td>
                </tr>
                {selected === e.token && (
                  <tr key={e.token + '-detail'} style={{ background: '#0a0a0a' }}>
                    <td colSpan={4} style={{ padding: '12px 14px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a', lineHeight: 1.6 }}>
                      {e.detail}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: '#444', marginTop: 16, fontStyle: 'italic' }}>
        New investigations added as evidence is confirmed. Submit a tip via Cabal Scanner.
      </p>
    </section>
  );
}
