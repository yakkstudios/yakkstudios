/**
 * /privacy — Privacy Policy
 * Static server component — no client JS required.
 */
export const metadata = {
  title:       'Privacy Policy | YAKK Studios',
  description: 'Privacy Policy for YAKK Studios and the YST token-gated platform.',
};

export default function PrivacyPage() {
  const sections: { heading: string; body: string }[] = [
    {
      heading: '1. Overview',
      body: `YAKK Studios ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains what data we collect when you use the Platform, how we use it, and your rights. YAKK Studios operates as a pseudonymous, wallet-native platform and is designed to collect the minimum data necessary to provide its services.`,
    },
    {
      heading: '2. Data We Collect',
      body: `Wallet address: When you connect a wallet and complete verification, your Solana public key is processed to check on-chain $YST balance via the Helius RPC API. Your public key is a publicly visible blockchain identifier — it is not personal data in the traditional sense, but we treat it with care. Session cookie: Upon successful verification, we set an httpOnly session cookie ("yst_access") that records your access grant. This cookie contains no personally identifiable information beyond a boolean access flag. It expires after 1 hour. Usage data: Standard server logs (IP address, user agent, request timestamp) may be retained for up to 30 days for security and abuse-prevention purposes. We do not link log data to individual wallet addresses.`,
    },
    {
      heading: '3. Data We Do NOT Collect',
      body: `We do not collect: private keys, seed phrases, or any wallet credentials; real names, email addresses, or government ID; payment card details or banking information; location data beyond the coarse country-level derived from IP; any data from your connected wallet beyond $YST token balance. We do not use analytics services (e.g., Google Analytics) that track individual users across sessions.`,
    },
    {
      heading: '4. How We Use Data',
      body: `Wallet addresses and balance data are used solely to determine token-gate access and return an appropriate session cookie. We do not sell, rent, or share your wallet address with third parties for marketing purposes. On-chain data (wallet address and balance) is queried from Helius RPC on each verification request and is not stored by YAKK Studios beyond the active request cycle.`,
    },
    {
      heading: '5. Third-Party Services',
      body: `We use the following third-party services: Helius (helius.dev) — Solana RPC provider used to query $YST token balances. Your wallet address is sent to Helius servers during verification. Please review Helius's own privacy policy. DexScreener — Market data displayed in the Screener and Terminal sections. Price charts may be embedded via iframes hosted by DexScreener. Vercel — Our hosting provider. Vercel may log request metadata. Please review Vercel's privacy policy. We do not pass your wallet address to DexScreener or Vercel.`,
    },
    {
      heading: '6. Cookies',
      body: `We use one first-party httpOnly cookie ("yst_access") to maintain your access session. This cookie is: set only after successful on-chain verification; marked httpOnly (not accessible to JavaScript); marked Secure in production (HTTPS only); set with SameSite=Lax to prevent cross-site request forgery; valid for 1 hour, after which you must re-verify. We do not use tracking cookies, advertising cookies, or third-party analytics cookies.`,
    },
    {
      heading: '7. Data Retention',
      body: `Access cookies expire after 1 hour and are not stored server-side. Server access logs are retained for up to 30 days. We do not maintain a database of verified wallet addresses between sessions. Each verification is stateless — your balance is checked fresh on each re-verification.`,
    },
    {
      heading: '8. Security',
      body: `Verification uses ed25519 cryptographic signature proofs to confirm wallet ownership without transmitting private keys. All communication between your browser and the Platform is encrypted via TLS (HTTPS). The session cookie is httpOnly and cannot be read by client-side scripts, mitigating XSS token theft. We apply rate limiting to verification endpoints to prevent abuse.`,
    },
    {
      heading: '9. Your Rights',
      body: `Depending on your jurisdiction, you may have rights regarding your personal data. Where applicable (for example, under the UK GDPR or GDPR): Right of access: You may request confirmation of what data we hold about you. Right to erasure: You may request deletion of any identifiable data we hold. Right to object: You may object to certain processing activities. Given the minimal and pseudonymous nature of data we hold, requests can typically be fulfilled immediately. Contact us via the official YAKK Studios Discord server to exercise any of these rights.`,
    },
    {
      heading: '10. Children',
      body: `The Platform is not intended for users under the age of 18. We do not knowingly collect data from minors. If you are under 18, please do not access or use the Platform.`,
    },
    {
      heading: '11. Changes to This Policy',
      body: `We may update this Privacy Policy to reflect changes in our practices or applicable law. Material changes will be announced via the Platform or official YAKK Studios social channels. Continued use of the Platform after changes constitutes acceptance of the revised Policy.`,
    },
    {
      heading: '12. Contact',
      body: `For privacy-related enquiries or data subject requests, contact YAKK Studios via the official Discord server at discord.gg/yakkstudios.`,
    },
  ];

  return (
    <div style={{
      minHeight:  '100vh',
      background: 'var(--bg)',
      padding:    '60px 20px 80px',
      fontFamily: 'Syne, sans-serif',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily:   'Space Mono, monospace',
            fontSize:     9,
            color:        'var(--pink)',
            letterSpacing: '0.16em',
            marginBottom: 10,
          }}>
            LEGAL
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 900,
            fontSize:   32,
            margin:     '0 0 12px',
          }}>
            Privacy Policy
          </h1>
          <div style={{ color: 'var(--dim)', fontSize: 11, fontFamily: 'Space Mono, monospace' }}>
            Last updated: 7 April 2026 · Effective immediately
          </div>
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            background: 'rgba(247,201,72,0.04)',
            border: '1px solid rgba(247,201,72,0.15)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--gold)' }}>TL;DR:</strong> We collect your wallet address only to check $YST balance. We do not store it, sell it, or share it. Session access is maintained via a 1-hour httpOnly cookie. No tracking. No ads.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 40 }} />

        {/* Sections */}
        {sections.map((s) => (
          <div key={s.heading} style={{ marginBottom: 32 }}>
            <h2 style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize:   16,
              color:      'var(--text)',
              margin:     '0 0 10px',
            }}>
              {s.heading}
            </h2>
            <p style={{
              fontSize:   13,
              color:      'var(--muted)',
              lineHeight: 1.75,
              margin:     0,
            }}>
              {s.body}
            </p>
          </div>
        ))}

        {/* Footer nav */}
        <div style={{
          marginTop:  48,
          paddingTop: 24,
          borderTop:  '1px solid var(--border)',
          display:    'flex',
          gap:        16,
          flexWrap:   'wrap',
        }}>
          <a href="/" style={{ color: 'var(--dim)', fontSize: 11, textDecoration: 'none', fontFamily: 'Space Mono, monospace' }}>
            ← Home
          </a>
          <a href="/terms" style={{ color: 'var(--dim)', fontSize: 11, textDecoration: 'none', fontFamily: 'Space Mono, monospace' }}>
            Terms of Service →
          </a>
        </div>

      </div>
    </div>
  );
}
