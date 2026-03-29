import type { Metadata } from 'next';
import './globals.css';
import { SolanaProvider } from '@/components/SolanaProvider';

const SITE_URL = 'https://www.yakkstudios.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '$YAKK Studios | On-Chain Trading Platform for Solana',
    template: '%s | $YAKK Studios',
  },
  description:
    'The professional on-chain trading platform built by the community, for the community. ' +
    'Screen Solana tokens, investigate wallets, trade with AI, earn yield — no KYC, no custody, no middlemen. ' +
    'Powered by $YST. 30+ tools including token screener, AI trader, cabal investigator, OTC desk, and more.',
  keywords: [
    'YAKK', 'YST', '$YST', 'Solana', 'DeFi', 'on-chain',
    'token screener', 'AI trader', 'crypto trading', 'wallet analyzer',
    'yield finder', 'Solana DeFi', 'DEX tools', 'no KYC crypto',
    'decentralized trading', 'cabal investigator', 'OTC desk',
    'Solana token', 'crypto tools', 'YAKK Studios',
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
    title: '$YAKK Studios | The Solana Intelligence Terminal',
    description:
      'On-Chain. No Middlemen. No Apologies. Professional trading and accountability platform for the DeFi world.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '$YAKK Studios — The Solana Intelligence Terminal',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@YakkStudios',
    creator: '@YakkStudios',
    title: '$YAKK Studios | The Solana Intelligence Terminal',
    description:
      'On-Chain. No Middlemen. No Apologies. Professional DeFi accountability powered by $YST.',
    images: ['/og-image.png'],
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
        <meta name="theme-color" content="#e8206a" />
        <meta name="msapplication-TileColor" content="#0d0d0d" />
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
              '@type': 'WebApplication',
              name: '$YAKK Studios',
              url: 'https://www.yakkstudios.xyz',
              description:
                'Professional on-chain trading platform for Solana. Screen tokens, investigate wallets, trade with AI, earn yield. No KYC, no custody, community-built.',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'YAKK Studios',
                url: 'https://www.yakkstudios.xyz',
                sameAs: [
                  'https://x.com/YakkStudios',
                  'https://t.me/yakkstudios',
                ],
              },
              featureList: [
                'Solana Token Screener',
                'AI Trading Assistant',
                'On-Chain Wallet Analyzer',
                'Yield Finder',
                'OTC Desk',
                'NFT Market',
                'Prediction Markets',
                'Cabal Investigator',
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
