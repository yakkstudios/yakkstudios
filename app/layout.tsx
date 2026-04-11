import type { Metadata } from 'next';
import './globals.css';
import { SolanaProvider } from '@/components/SolanaProvider';

const SITE_URL = 'https://www.yakkstudios.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '$YAKK Studios — The Solana Intelligence Terminal',
    template: '%s | $YAKK Studios',
  },
  description:
    'The Solana Intelligence Terminal. Screen tokens, expose cabals, investigate wallets, trade with AI and earn yield — ' +
    'all on-chain, no KYC, no custody, no middlemen. 30+ token-gated tools powered by $YST. ' +
    'Built by the community, for the community. On-chain. No middlemen. No apologies.',
  keywords: [
    'YAKK', 'YAKK Studios', 'YST', '$YST', '$YAKK', 'Solana', 'SOL', 'DeFi', 'on-chain intelligence',
    'Solana intelligence terminal', 'token screener', 'Solana token screener', 'AI trader', 'AI trading bot',
    'crypto forensics', 'wallet analyzer', 'cabal investigator', 'rug ledger', 'rug detector',
    'on-chain forensics', 'on-chain analytics', 'yield finder', 'DeFi yield', 'Solana DeFi',
    'DEX tools', 'DEX screener', 'no KYC crypto', 'decentralized trading', 'OTC desk',
    'whale tracker', 'memecoin screener', 'Pump.fun', 'Solana memecoin', 'Solana DeFi tools',
    'token-gated platform', 'crypto accountability', 'retail protection', 'anti-rug',
    'Solana analytics', 'bubblemaps', 'cabal wallet registry', 'pump detector',
  ],
  authors: [{ name: 'YAKK Studios', url: SITE_URL }],
  creator: 'YAKK Studios',
  publisher: 'YAKK Studios',
  applicationName: '$YAKK Studios',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: '$YAKK Studios',
    title: '$YAKK Studios — The Solana Intelligence Terminal',
    description:
      'On-Chain. No Middlemen. No Apologies. Screen tokens, expose cabals, trade with AI and earn yield. Powered by $YST.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '$YAKK Studios — The Solana Intelligence Terminal. $3.9B+ tracked on-chain. 74 clowns exposed. 30+ token-gated tools.',
        type: 'image/png',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YakkStudios',
    creator: '@YakkStudios',
    title: '$YAKK Studios — The Solana Intelligence Terminal',
    description:
      'On-Chain. No Middlemen. No Apologies. $3.9B+ tracked. 30+ token-gated tools. Powered by $YST.',
    images: [
      {
        url: '/og-image.png',
        alt: '$YAKK Studios — The Solana Intelligence Terminal',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
    apple: { url: '/apple-icon.svg', type: 'image/svg+xml' },
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: SITE_URL,
  },
  category: 'finance',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FF2E9A" />
        <meta name="msapplication-TileColor" content="#0A0A0F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="YAKK Studios" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}#organization`,
                  name: 'YAKK Studios',
                  alternateName: ['$YAKK Studios', 'Yakk Studios'],
                  url: SITE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/yakk-logo.jpg`,
                    width: 512,
                    height: 512,
                  },
                  description:
                    'YAKK Studios is the community-built Solana intelligence terminal — on-chain accountability, cabal forensics and token-gated trading tools powered by $YST.',
                  sameAs: [
                    'https://x.com/YakkStudios',
                    'https://t.me/yakkstudios',
                    'https://github.com/yakkstudios',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}#website`,
                  url: SITE_URL,
                  name: '$YAKK Studios',
                  description:
                    'The Solana Intelligence Terminal. On-chain. No middlemen. No apologies.',
                  publisher: { '@id': `${SITE_URL}#organization` },
                  inLanguage: 'en-US',
                },
                {
                  '@type': 'WebApplication',
                  '@id': `${SITE_URL}#webapp`,
                  name: '$YAKK Studios',
                  url: SITE_URL,
                  description:
                    'Professional on-chain intelligence terminal for Solana. Screen tokens, expose cabals, investigate wallets, trade with AI, and earn yield. No KYC, no custody, community-built. Powered by $YST.',
                  applicationCategory: 'FinanceApplication',
                  applicationSubCategory: 'DeFi',
                  operatingSystem: 'Web',
                  browserRequirements: 'Requires JavaScript and a Solana wallet (Phantom, Solflare, Backpack).',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  creator: { '@id': `${SITE_URL}#organization` },
                  image: `${SITE_URL}/og-image.png`,
                  screenshot: `${SITE_URL}/og-image.png`,
                  featureList: [
                    'Solana Token Screener',
                    'AI Trading Assistant',
                    'On-Chain Wallet Analyzer',
                    'Cabal Investigator',
                    'Rug Ledger',
                    'Yield Finder',
                    'OTC Desk',
                    'Whale Feed',
                    'Telegram Trading Bot',
                    'Prediction Markets',
                    'NFT Market',
                    'Token-Gated Access via $YST',
                  ],
                  keywords: 'Solana, DeFi, on-chain, token screener, AI trader, cabal investigator, rug detector, $YST, $YAKK, yield finder, Pump.fun',
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
