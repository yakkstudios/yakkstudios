import type { Metadata } from 'next';
import './globals.css';
import { SolanaProvider } from '@/components/SolanaProvider';

export const metadata: Metadata = {
  title: '$YAKK Studios | On-Chain. No Middlemen.',
  description:
    'The professional on-chain trading platform built by the community, for the community. ' +
    'Screen tokens, investigate wallets, trade with AI, and earn yield — no KYC, no custody, no middlemen.',
  keywords: 'YAKK, YST, Solana, DeFi, token screener, AI trader, on-chain',
  openGraph: {
    title: '$YAKK Studios',
    description: 'On-Chain. No Middlemen.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <SolanaProvider>
          {children}
        </SolanaProvider>
      </body>
    </html>
  );
}
