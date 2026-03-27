'use client';

import { ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// Import wallet adapter default styles (dark theme works fine with our UI)
import '@solana/wallet-adapter-react-ui/styles.css';

// Use a custom RPC if provided — strongly recommended in production
// Set NEXT_PUBLIC_RPC_URL in Vercel env vars (e.g. Helius or QuickNode free tier)
const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_URL ?? 'https://api.mainnet-beta.solana.com';

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
