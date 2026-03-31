'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Wallet({ walletConnected, ystBalance, onNavigate }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const ystHeld = ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">08 — PROFILE</div>
      <div className="sec-title">Profile &amp; Wallet</div>
      <div className="sec-bar"></div>

      <div style={{ maxWidth: 520 }}>
        {/* Connect wallet card */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(224,96,126,0.07),rgba(247,201,72,0.04))',
          border: '1px solid rgba(224,96,126,0.18)',
          borderRadius: 11,
          padding: 26,
          textAlign: 'center',
          marginBottom: 18,
        }}>
          <div style={{ fontSize: 28, marginBottom: 9 }}>👛</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
            {walletConnected ? 'Wallet Connected' : 'Connect Your Wallet'}
          </div>
          {!walletConnected ? (
            <>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                Connect Phantom to verify $YST holdings, check WL eligibility, and pay for screener updates.
              </p>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--dim)', marginBottom: 14, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
                🔑 Your keys, your money. The whole point of crypto is self-custody — you don&apos;t make an account with us. Your wallet <em>is</em> your account.
              </p>
              <button className="btn btn-pink">CONNECT PHANTOM</button>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'var(--dim)', marginBottom: 6 }}>
                Phantom wallet connected
              </p>
              <div style={{ marginBottom: 14 }}>
                <span className={`badge ${ystBalance >= 10_000_000 ? 'b-gold' : ystBalance >= 250_000 ? 'b-green' : 'b-dim'}`}>
                  {ystBalance >= 10_000_000 ? '🐋 WHALE' : ystBalance >= 250_000 ? '🪙 HOLDER' : '⚠ BELOW THRESHOLD'}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
                {ystBalance.toLocaleString()} $YST
              </div>
            </>
          )}
        </div>

        {/* Stat cards grid */}
        <div className="grid2" style={{ marginBottom: 14 }}>
          <div className="stat-card">
            <div className="slbl">$YST STAKED</div>
            <div className="sval" style={{ color: 'var(--pink)' }}>
              {walletConnected ? ystBalance.toLocaleString() : '—'}
            </div>
            <div className="ssub">{walletConnected ? '$YST tokens' : 'Connect wallet to check'}</div>
          </div>
          <div className="stat-card">
            <div className="slbl">WL STATUS</div>
            <div className="sval" style={{ fontSize: 14 }}>
              {walletConnected ? (ystHeld ? 'ELIGIBLE' : 'INELIGIBLE') : 'PENDING'}
            </div>
            <div className="ssub">{walletConnected ? (ystHeld ? '250K+ $YST ✓' : 'Need 250K $YST') : 'StakePoint for WL'}</div>
          </div>
        </div>

        {/* Portfolio card — shown when wallet connected */}
        {walletConnected && (
          <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(96,165,250,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13 }}>💼 PORTFOLIO</div>
              <button
                className="btn btn-ghost"
                style={{ fontSize: 8, padding: '4px 8px' }}
                onClick={handleRefresh}
              >
                {refreshing ? '…' : '↻ REFRESH'}
              </button>
            </div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22, color: 'var(--gold)', marginBottom: 10 }}>
              $0.00
            </div>
            <div style={{ fontSize: 11, color: 'var(--dim)' }}>
              Portfolio data loads after wallet verification.
            </div>
          </div>
        )}

        {/* WL Eligibility */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 9 }}>
            WL ELIGIBILITY — YAKKS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
              <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
              <span className={`badge ${walletConnected ? (ystHeld ? 'b-green' : 'b-red') : 'b-dim'}`}>
                {walletConnected ? (ystHeld ? '✓ MET' : '✗ NOT MET') : 'NOT CHECKED'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
              <span style={{ fontSize: 12 }}>Active in Discord/TG Raids</span>
              <span className="badge b-dim">NOT CHECKED</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--dim)', marginTop: 9 }}>
            No Genesis NFT required — fresh start for YAKKS. 3,333 total pieces. 33% Paper Hands Tax funds Save the Wren 🌱
          </p>
        </div>

        {/* Upgrade prompt if connected but below threshold */}
        {walletConnected && !ystHeld && (
          <div style={{ background: 'rgba(247,201,72,0.04)', border: '1px solid rgba(247,201,72,0.15)', borderRadius: 10, padding: '16px 20px', marginTop: 14 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--gold)', marginBottom: 6 }}>Upgrade Your Access</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
              You need 250,000 $YST to unlock all YAKK Studios tools &amp; rev-share rewards.
            </div>
            <div className="prog-bar" style={{ marginBottom: 8 }}>
              <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
            </div>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)', marginBottom: 12 }}>
              {ystBalance.toLocaleString()} / 250,000 $YST
            </div>
            <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              Get More $YST on Jupiter →
            </a>
          </div>
        )}

        {/* Quick links when connected */}
        {walletConnected && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Solscan ↗</a>
            <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Birdeye ↗</a>
            <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer" className="btn btn-gold">StakePoint ↗</a>
          </div>
        )}
      </div>
    </div>
  );
}

