'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const COMMANDS = [
  { cmd: '/price $YST', desc: 'Get live $YST price, market cap and 24h change.' },
  { cmd: '/wallet <address>', desc: 'Look up any Solana wallet holdings and activity.' },
  { cmd: '/top', desc: 'Top 10 YAKK holders leaderboard.' },
  { cmd: '/alert <token> <price>', desc: 'Set a price alert for any Solana token.' },
  { cmd: '/raid', desc: 'See active YAKK raids and join in.' },
  { cmd: '/rug <token>', desc: 'Quick rug pull risk check on a token address.' },
  { cmd: '/chart $TOKEN', desc: 'Get a DexScreener chart link for any token.' },
  { cmd: '/stakepoint', desc: 'Your staking status and estimated rewards.' },
  { cmd: '/whale', desc: 'Recent whale wallet moves on Solana.' },
  { cmd: '/news', desc: 'Latest Solana and crypto news headlines.' },
];

const FEATURES = [
  { icon: '🔔', title: 'Price Alerts', desc: 'Set custom price alerts for any Solana token. Get instant Telegram pings.', status: 'LIVE', badge: 'b-green' },
  { icon: '📊', title: 'Portfolio Tracking', desc: 'Track your Solana wallet P&L directly from Telegram.', status: 'LIVE', badge: 'b-green' },
  { icon: '⚔️', title: 'Raid Notifications', desc: 'Get notified when a new YAKK raid goes live. Never miss community events.', status: 'LIVE', badge: 'b-green' },
  { icon: '🐋', title: 'Whale Alerts', desc: 'Monitor big wallet moves on Solana in real-time.', status: 'BETA', badge: 'b-yakk' },
  { icon: '🤖', title: 'AI Q&A', desc: 'Ask the bot anything about YAKK, Solana DeFi or your portfolio.', status: 'SOON', badge: 'b-dim' },
];

export default function TgBot({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🤖 TELEGRAM BOT</div>
          <span className="badge b-blue">LIVE</span>
        </div>
        <div className="sec-sub">The official YAKK Studios Telegram bot — price alerts, portfolio tracking, raids &amp; more.</div>
      </div>

      <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 48, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>@YAKKStudiosBot</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
            The official YAKK Studios Telegram bot. Get price alerts, track your portfolio, join raids and get alpha — all without leaving Telegram.
          </div>
          <a href="https://t.me/YAKKStudiosBot" target="_blank" rel="noopener noreferrer" className="btn btn-blue">
            Open Bot in Telegram →
          </a>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 36, color: 'var(--blue)' }}>1.2K</div>
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)' }}>ACTIVE USERS</div>
        </div>
      </div>

      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>FEATURES</div>
      <div className="grid3" style={{ marginBottom: 24 }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12 }}>{f.title}</div>
              <span className={`badge ${f.badge}`}>{f.status}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>BOT COMMANDS</div>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 24 }}>
        {COMMANDS.map((c, i) => (
          <div key={c.cmd} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px',
            borderBottom: i < COMMANDS.length - 1 ? '1px solid var(--border)' : undefined,
          }}>
            <code style={{ fontFamily: 'Space Mono,monospace', fontSize: 10, color: 'var(--pink)', background: 'var(--bg4)', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{c.cmd}</code>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>JOIN THE COMMUNITY</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="https://t.me/YAKKStudiosBot" target="_blank" rel="noopener noreferrer" className="btn btn-blue">@YAKKStudiosBot →</a>
        <a href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline">YAKK Community Chat →</a>
        <a href="https://t.me/yakkannouncements" target="_blank" rel="noopener noreferrer" className="btn btn-outline">Announcements Channel →</a>
      </div>
    </div>
  );
}
