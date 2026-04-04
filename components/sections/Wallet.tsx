'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Wallet({ walletConnected, ystBalance, onNavigate }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [discordLinked, setDiscordLinked] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleDiscordLink = () => {
    // Discord OAuth2 — redirect to Discord auth, return to /profile
    // Full implementation requires DISCORD_CLIENT_ID env var + /api/discord/callback route
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID ?? 'PENDING';
    const redirect  = encodeURIComponent(window.location.origin + '/api/discord/callback');
    const scope     = encodeURIComponent('identify guilds.members.read');
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
  };

  const isWhale  = ystBalance >= 10_000_000;
  const isHolder = ystBalance >= 250_000;

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">08 — PROFILE</div>
      <div className="sec-title">Profile &amp; Wallet</div>
      <div className="sec-bar" />

      <div style={{ maxWidth: 520 }}>

        {/* ── Wallet connect card ──────────────────────────────────────────── */}
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
                Connect Phantom to verify $YST holdings, check WL eligibility, and access all tools.
              </p>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, color: 'var(--dim)', marginBottom: 14, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
                🔑 Your keys, your money. Your wallet <em>is</em> your account.
              </p>
              <button className="btn btn-pink">CONNECT PHANTOM</button>
            </>
          ) : (
            <>
              <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'var(--dim)', marginBottom: 6 }}>
                Phantom wallet connected
              </p>
              <div style={{ marginBottom: 14 }}>
                <span className={`badge ${isWhale ? 'b-gold' : isHolder ? 'b-green' : 'b-dim'}`}>
                  {isWhale ? '🐋 WHALE' : isHolder ? '🪙 HOLDER' : '⚠ BELOW THRESHOLD'}
                </span>
              </div>
              <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
                {ystBalance.toLocaleString()} $YST
              </div>
            </>
          )}
        </div>

        {/* ── Stats grid ───────────────────────────────────────────────────── */}
        <div className="grid2" style={{ marginBottom: 14 }}>
          <div className="stat-card">
            <div className="slbl">$YST BALANCE</div>
            <div className="sval" style={{ color: 'var(--pink)' }}>
              {walletConnected ? ystBalance.toLocaleString() : '—'}
            </div>
            <div className="ssub">{walletConnected ? '$YST tokens' : 'Connect wallet'}</div>
          </div>
          <div className="stat-card">
            <div className="slbl">WL STATUS</div>
            <div className="sval" style={{ fontSize: 14 }}>
              {walletConnected ? (isHolder ? 'ELIGIBLE' : 'INELIGIBLE') : 'PENDING'}
            </div>
            <div className="ssub">{walletConnected ? (isHolder ? '250K+ $YST ✓' : 'Need 250K $YST') : 'Connect to check'}</div>
          </div>
        </div>

        {/* ── Discord link card ────────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 14, borderColor: discordLinked ? 'rgba(88,101,242,0.4)' : 'var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: discordLinked ? 8 : 14 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>Discord Verification</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Link Discord to verify holder status and unlock community roles.
              </div>
            </div>
            {discordLinked && <span className="badge b-green">LINKED ✓</span>}
          </div>
          {!discordLinked ? (
            <button
              className="btn btn-outline"
              style={{ borderColor: '#5865F2', color: '#5865F2', width: '100%', fontSize: 11 }}
              onClick={handleDiscordLink}
              disabled={!walletConnected}
            >
              {walletConnected ? 'Link Discord Account →' : 'Connect Wallet First'}
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--green)' }}>
              ✓ Discord linked — Holder role assigned automatically by bot.
            </div>
          )}
          <p style={{ fontSize: 10, color: 'var(--dim)', marginTop: 8, marginBottom: 0 }}>
            Roles: Holder (250K+), Whale (10M+). Verified via Collab.Land on the YAKK Discord server.
          </p>
        </div>

        {/* ── Portfolio card ───────────────────────────────────────────────── */}
        {walletConnected && (
          <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(96,165,250,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13 }}>💼 PORTFOLIO</div>
              <button className="btn btn-ghost" style={{ fontSize: 8, padding: '4px 8px' }} onClick={handleRefresh}>
                {refreshing ? '…' : '↻ REFRESH'}
              </button>
            </div>
            {isWhale ? (
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                Full portfolio tracker available in the{' '}
                <button className="btn btn-ghost" style={{ fontSize: 11, padding: 0, display: 'inline', textDecoration: 'underline' }} onClick={() => onNavigate('portfolio')}>
                  Portfolio section →
                </button>
              </div>
            ) : (
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>
                Portfolio tracker requires Whale Club access (10M+ $YST).
              </div>
            )}
          </div>
        )}

        {/* ── Holder interaction ───────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 14, borderColor: 'rgba(247,201,72,0.15)' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>👥 Holder Community</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
            Holder-to-holder messaging and community feed coming soon. Will sync to the YAKK mobile app when launched.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" style={{ fontSize: 10, opacity: 0.5, cursor: 'not-allowed' }} disabled>
              💬 Message Holders (Soon)
            </button>
            <button className="btn btn-outline" style={{ fontSize: 10 }} onClick={() => onNavigate('members')}>
              View Members →
            </button>
          </div>
        </div>

        {/* ── WL eligibility ───────────────────────────────────────────────── */}
        <div className="card-sm" style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 9 }}>
            WL ELIGIBILITY — NFT DROP · APRIL 20, 2026
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
              <span style={{ fontSize: 12 }}>250,000+ $YST 🪙 Held</span>
              <span className={`badge ${walletConnected ? (isHolder ? 'b-green' : 'b-red') : 'b-dim'}`}>
                {walletConnected ? (isHolder ? '✓ MET' : '✗ NOT MET') : 'NOT CHECKED'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
              <span style={{ fontSize: 12 }}>Discord Linked &amp; Verified</span>
              <span className={`badge ${discordLinked ? 'b-green' : 'b-dim'}`}>
                {discordLinked ? '✓ MET' : 'NOT CHECKED'}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--dim)', marginTop: 9, marginBottom: 0 }}>
            No Genesis NFT required — fresh start for YAKKS. 3,333 total pieces. 33.3% paperhands tax mechanic incoming.
          </p>
        </div>

        {/* ── Upgrade prompt ───────────────────────────────────────────────── */}
        {walletConnected && !isHolder && (
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

        {/* ── Quick links ──────────────────────────────────────────────────── */}
        {walletConnected && (
          <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Solscan ↗</a>
            <a href="https://birdeye.so" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Birdeye ↗</a>
            <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer" className="btn btn-gold">StakePoint ↗</a>
            <a href="https://discord.gg/yakkstudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ borderColor: '#5865F2', color: '#5865F2' }}>Discord ↗</a>
          </div>
        )}

      </div>
    </div>
  );
}
