'use client';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Privacy({ walletConnected, ystBalance, onNavigate }: Props) {
  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--blue),var(--green))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🔐 PRIVACY POLICY</div>
        </div>
        <div className="sec-sub">How YAKK Studios handles your data, wallet connections and analytics.</div>
      </div>

      <div style={{ maxWidth: 700 }}>
        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Data We Collect</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            YAKK Studios collects minimal data. When you connect your wallet, we read your public Solana wallet address and on-chain $YST balance to verify access tier. We do not store private keys, seed phrases or any sensitive credentials — ever.
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Wallet Connections</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            Wallet connections are read-only. YAKK Studios never initiates transactions without your explicit approval. All transaction signing happens in your wallet (Phantom, Backpack, etc.) and is under your full control. We use your public address only to check $YST balance via the Solana RPC.
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Analytics &amp; Cookies</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            We use privacy-respecting analytics to understand aggregate usage patterns (pages visited, feature usage). No personally identifiable information is tied to analytics. We do not use third-party advertising cookies or sell your data to any third party.
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Third-Party Integrations</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            YAKK Studios integrates with third-party services including DexScreener, Jupiter, Magic Eden, Tensor, StakePoint and Birdeye. Each of these services operates under their own privacy policies. Interactions with embedded iframes (charts, swap widgets) are governed by those respective providers.
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Data Retention</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            We do not retain your wallet address or balance data after your session ends. Holder snapshot data used for access verification is stored server-side and refreshed periodically. You can request removal of any stored data by contacting the team via Telegram.
          </div>
        </div>

        <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Disclaimer</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            YAKK Studios is a community-driven platform and does not provide financial or investment advice. All information on this platform is for educational and entertainment purposes only. Trading cryptocurrency involves significant risk. Never invest more than you can afford to lose. Always do your own research (DYOR).
          </div>
        </div>

        <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '16px 20px' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--blue)', marginBottom: 6 }}>Questions or Concerns?</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>Reach out to the YAKK Studios team directly on Telegram for any privacy-related enquiries.</div>
          <a href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: 11 }}>Contact via Telegram →</a>
        </div>

        <div style={{ marginTop: 16, fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>
          Last updated: March 2025 · YAKK Studios
        </div>
      </div>
    </div>
  );
}
