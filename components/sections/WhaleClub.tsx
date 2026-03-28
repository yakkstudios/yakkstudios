'use client';
import { useState } from 'react';

// YST treasury / investigation wallet — publicly visible on Solscan
const OPS_WALLET = 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM';

const PERKS = [
  { icon: '🔍', label: 'Full Cabal Scanner access', tier: 'ELITE' },
  { icon: '📄', label: 'AI investigation reports', tier: 'ELITE' },
  { icon: '💬', label: 'Private Whale Telegram group', tier: 'ELITE' },
  { icon: '⚡', label: 'Early access to new tools', tier: 'ELITE' },
  { icon: '💰', label: 'Enhanced $YST RevShare', tier: 'ELITE' },
  { icon: '🐋', label: 'Whale Club NFT whitelist slot', tier: 'ELITE' },
];

const SOCIALS = [
  { label: 'WEBSITE', placeholder: 'yakkstudios.xyz' },
  { label: 'X / TWITTER', placeholder: '@YakkStudios' },
  { label: 'TELEGRAM', placeholder: 't.me/yakkstudios' },
  { label: 'DISCORD', placeholder: 'discord.gg/yakk (optional)' },
];

export default function WhaleClub({
  walletConnected = false,
  ystBalance = 0,
}: {
  walletConnected?: boolean;
  ystBalance?: number;
}) {
  const [copied, setCopied] = useState(false);
  const isElite = walletConnected && ystBalance >= 250000;
  const gated = !isElite;

  const copyWallet = () => {
    navigator.clipboard.writeText(OPS_WALLET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <section id="section-whaleclub" style={{ padding: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: 0 }}>
          🏆 WHALE CLUB
        </h2>
        {isElite && (
          <span style={{ fontSize: 10, color: '#00c896', border: '1px solid #00c896', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>
            🐋 ELITE HOLDER
          </span>
        )}
      </div>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>
        The inner circle. 250,000+ $YST staked on StakePoint.
      </p>

      {/* Gate */}
      {gated && (
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 11, color: '#666' }}>
          🔒 250,000+ $YST Staked on StakePoint required —{' '}
          <span style={{ color: '#444' }}>NOT CHECKED</span>
        </div>
      )}

      {/* Ops Wallet */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
          OPS WALLET — Investigation Fund
        </div>
        <p style={{ fontSize: 11, color: '#888', lineHeight: 1.6, margin: '0 0 12px' }}>
          This wallet tracks rugged funds and on-chain activity related to YAKK's investigations.
          Whales may coordinate with ops to fund recovery efforts.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <code style={{ fontSize: 11, color: '#ccc', background: '#111', padding: '4px 8px', borderRadius: 4, wordBreak: 'break-all', flex: 1 }}>
            {OPS_WALLET}
          </code>
          <button
            onClick={copyWallet}
            style={{ background: 'none', border: '1px solid #333', color: copied ? '#00c896' : '#888', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 11, whiteSpace: 'nowrap' }}>
            {copied ? '✓ Copied!' : '📋 COPY'}
          </button>
          <a
            href={`https://solscan.io/account/${OPS_WALLET}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 11, textDecoration: 'none' }}>
            🔍 SOLSCAN →
          </a>
        </div>
      </div>

      {/* Perks */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>ELITE PERKS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
          {PERKS.map(({ icon, label }) => (
            <div key={label} style={{
              background: '#0d0d0d', border: isElite ? '1px solid #e8206a33' : '1px solid #1a1a1a',
              borderRadius: 6, padding: '12px', display: 'flex', alignItems: 'flex-start', gap: 8,
              opacity: gated ? 0.5 : 1,
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontSize: 11, color: '#ccc', lineHeight: 1.4 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Socials / Contact */}
      <div style={{ opacity: gated ? 0.4 : 1, pointerEvents: gated ? 'none' : 'auto' }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>
          ✉️ TEXT: SOCIALS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SOCIALS.map(({ label, placeholder }) => (
            <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#555', width: 90, flexShrink: 0 }}>{label}</span>
              <input
                type="text"
                placeholder={placeholder}
                style={{ flex: 1, background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, color: '#ccc', padding: '7px 10px', fontSize: 12, outline: 'none' }}
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
