/**
 * /terms — Terms of Service
 * Static server component — no client JS required.
 */
export const metadata = {
  title:       'Terms of Service | YAKK Studios',
  description: 'Terms of Service for YAKK Studios and the YST token-gated platform.',
};

export default function TermsPage() {
  const sections: { heading: string; body: string }[] = [
    {
      heading: '1. Acceptance of Terms',
      body: `By accessing or using the YAKK Studios platform ("Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree, do not access or use the Platform. These Terms apply to all visitors, users, and holders who interact with the Platform.`,
    },
    {
      heading: '2. No Financial Advice',
      body: `Nothing on the Platform constitutes financial, investment, legal, or tax advice. All content — including token analysis, cabal investigations, screener data, and market commentary — is provided for informational and educational purposes only. YAKK Studios is not a registered investment adviser, broker-dealer, or financial institution. You are solely responsible for your own investment decisions. Cryptocurrency investments carry substantial risk of loss, including the total loss of capital.`,
    },
    {
      heading: '3. Token-Gated Access',
      body: `Access to certain features of the Platform requires holding a minimum balance of $YST tokens in a verified Solana wallet. YAKK Studios reserves the right to modify the minimum balance requirement, add or remove features from gated tiers, or discontinue token-gated access at any time without prior notice. Holding $YST does not guarantee any specific return, benefit, or access tier in perpetuity.`,
    },
    {
      heading: '4. Wallet Connectivity and Security',
      body: `When you connect a wallet to the Platform, you sign a cryptographic message to prove wallet ownership. No private keys are transmitted, stored, or accessed. You are solely responsible for the security of your wallet, seed phrase, and connected devices. YAKK Studios shall not be liable for any loss of funds resulting from wallet compromise, phishing, or user error.`,
    },
    {
      heading: '5. On-Chain Data and Third-Party Sources',
      body: `Data displayed on the Platform may be sourced from third-party providers including Helius, DexScreener, CoinGecko, and public Solana RPC nodes. YAKK Studios does not guarantee the accuracy, completeness, or timeliness of this data. On-chain data is provided "as is" without warranty of any kind. You should independently verify any data before making financial decisions.`,
    },
    {
      heading: '6. Intellectual Property',
      body: `All content, design, code, research, and analysis produced by YAKK Studios is the intellectual property of YAKK Studios and may not be reproduced, distributed, or monetised without written permission. User-generated content (wallet addresses, submitted investigations) remains the property of the respective user but grants YAKK Studios a non-exclusive licence to display and process it within the Platform.`,
    },
    {
      heading: '7. Prohibited Conduct',
      body: `You agree not to: (a) attempt to circumvent token-gate security mechanisms; (b) use automated bots or scrapers against the Platform without prior written consent; (c) submit false or misleading information in cabal investigations or reports; (d) engage in market manipulation, coordinated pump-and-dump schemes, or any activity that harms other users; (e) violate applicable laws or regulations of your jurisdiction.`,
    },
    {
      heading: '8. Limitation of Liability',
      body: `To the maximum extent permitted by applicable law, YAKK Studios and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising out of or in connection with your use of the Platform, even if advised of the possibility of such damages. The total aggregate liability of YAKK Studios shall not exceed the greater of £100 GBP or the amount you paid to access the Platform in the preceding 12 months.`,
    },
    {
      heading: '9. Disclaimers',
      body: `THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. YAKK Studios does not warrant that the Platform will be uninterrupted, error-free, or free of harmful components. The $YST token is a utility token; its value is speculative and may be zero.`,
    },
    {
      heading: '10. Governing Law and Disputes',
      body: `These Terms shall be governed by and construed in accordance with the laws of England and Wales, without regard to conflict of law principles. Any dispute arising under these Terms shall be submitted to the exclusive jurisdiction of the courts of England and Wales. If any provision of these Terms is found unenforceable, the remaining provisions shall remain in full force and effect.`,
    },
    {
      heading: '11. Changes to Terms',
      body: `YAKK Studios reserves the right to modify these Terms at any time. Material changes will be notified via the Platform or official YAKK Studios social channels. Continued use of the Platform after changes constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.`,
    },
    {
      heading: '12. Contact',
      body: `For questions about these Terms, contact YAKK Studios via the official Discord server at discord.gg/yakkstudios or the contact details published on the Platform.`,
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
            fontSize:   clamp(24, 32),
            margin:     '0 0 12px',
          }}>
            Terms of Service
          </h1>
          <div style={{ color: 'var(--dim)', fontSize: 11, fontFamily: 'Space Mono, monospace' }}>
            Last updated: 7 April 2026 · Effective immediately
          </div>
          <div style={{
            marginTop: 20,
            padding: '14px 18px',
            background: 'rgba(224,96,126,0.06)',
            border: '1px solid rgba(224,96,126,0.18)',
            borderRadius: 8,
            fontSize: 12,
            color: 'var(--muted)',
            lineHeight: 1.6,
          }}>
            <strong style={{ color: 'var(--pink)' }}>Important:</strong> YAKK Studios is not a regulated financial service. Nothing on this platform is investment advice. $YST is a speculative utility token. You may lose all funds you invest in cryptocurrency.
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
          <a href="/privacy" style={{ color: 'var(--dim)', fontSize: 11, textDecoration: 'none', fontFamily: 'Space Mono, monospace' }}>
            Privacy Policy →
          </a>
        </div>

      </div>
    </div>
  );
}

// Fluid font-size helper (avoids Tailwind)
function clamp(_min: number, max: number): number {
  // Returns max for server render; media queries handle responsive sizing via CSS if needed
  return max;
}
