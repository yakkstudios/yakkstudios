'use client';

import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';

// RPC endpoint — set NEXT_PUBLIC_RPC_URL in Vercel env vars for production
// (e.g. your Helius or Quicknode private RPC). Falls back to public endpoint.
// SECURITY: Never hardcode API keys here — they're visible in client bundles.
const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_URL ??
  'https://api.mainnet-beta.solana.com';

export function SolanaProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
