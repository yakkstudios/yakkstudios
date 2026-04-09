'use client';
import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import Sidebar from '@/components/Sidebar';
import TickerBar from '@/components/TickerBar';
import { YST_MINT, YST_GATE, WHALE_GATE, DEV_WALLETS } from '@/lib/constants';
import { HOLDER_SNAPSHOT } from '@/lib/holders';
// Sections — only import what exists in components/sections/
import Home from '@/components/sections/Home';
import Screener from '@/components/sections/Screener';
import Terminal from '@/components/sections/Terminal';
import Clowns from '@/components/sections/Clowns';
import NftMarket from '@/components/sections/NftMarket';
import Launchpad from '@/components/sections/Launchpad';
import TokenCreator from '@/components/sections/TokenCreator';
import Features from '@/components/sections/Features';
import Portfolio from '@/components/sections/Portfolio';
import Raffle from '@/components/sections/Raffle';
import Wallet from '@/components/sections/Wallet';
import Ledger from '@/components/sections/Ledger';
import News from '@/components/sections/News';
import Services from '@/components/sections/Services';
import Wren from '@/components/sections/Wren';
import NftDrop from '@/components/sections/NftDrop';
import Alerts from '@/components/sections/Alerts';
// Error boundary
import ErrorBoundary from '@/components/ErrorBoundary';

type SectionId =
  | 'home' | 'screener' | 'terminal' | 'clowns'
  | 'nftmarket' | 'launchpad' | 'tokencreator'
  | 'features' | 'portfolio' | 'raffle' | 'wallet'
  | 'ledger' | 'news' | 'services' | 'wren'
  | 'nftdrop' | 'alerts';

async function fetchYstBalance(connection: any, walletPk: PublicKey): Promise<number> {
  try {
    const mint = new PublicKey(YST_MINT);
    const accounts = await connection.getParsedTokenAccountsByOwner(walletPk, { mint });
    const bal = accounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    return Math.floor(bal);
  } catch { return 0; }
}

export default function App() {
  const [section, setSection] = useState<SectionId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ystBalance, setYstBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const { connected, publicKey, disconnect } = useWallet();
  const { connection } = useConnection();
  const { setVisible: setWalletModalVisible } = useWalletModal();
  const walletConnected = connected && !!publicKey;
  const walletAddress = publicKey?.toBase58();

  useEffect(() => {
    if (!walletConnected || !publicKey) { setYstBalance(0); return; }
    const addr = publicKey.toBase58();
    const snapshotBal = HOLDER_SNAPSHOT[addr] ?? -1;
    if (snapshotBal >= 0) { setYstBalance(snapshotBal); return; }
    setBalanceLoading(true);
    fetchYstBalance(connection, publicKey)
      .then(live => setYstBalance(live))
      .finally(() => setBalanceLoading(false));
  }, [walletConnected, publicKey, connection]);

  const navigate = useCallback((id: string) => {
    setSection(id as SectionId);
    setSidebarOpen(false);
    const mainEl = document.getElementById('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect().catch(() => {});
    setYstBalance(0);
  }, [disconnect]);

  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Home', screener: 'YAKK Screener', terminal: 'YAKK Terminal',
      clowns: 'Certified Clowns', nftmarket: 'NFT Market', launchpad: 'YAKK Ventures',
      tokencreator: 'Token Creator', features: 'Requests', portfolio: 'Portfolio',
      raffle: 'NFT Raffle', wallet: 'Profile', ledger: 'Rug Ledger',
      news: 'YAKK News', services: 'AI Services', wren: 'Saving The Wren',
      nftdrop: 'YAKK GEN I — NFT Drop', alerts: 'Price Alerts',
    };
    document.title = (titles[section] ?? section.toUpperCase()) + ' | $YAKK Studios';
  }, [section]);

  const walletLabel = walletAddress
    ? walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)
    : '';

  const isDevWallet = DEV_WALLETS.has(walletAddress ?? '');
  const effectiveYstBalance = isDevWallet ? 999_999_999 : ystBalance;
  const sectionProps = { walletConnected, ystBalance: effectiveYstBalance, onNavigate: navigate };

  return (
    <div id="app">
      <div id="mobile-header">
        <button id="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">☰</button>
        <div id="mob-brand">$YAKK <span>STUDIOS</span></div>
        {walletConnected ? (
          <button className="btn btn-ghost btn-sm" onClick={handleDisconnect}>
            {walletLabel}{balanceLoading ? ' …' : isDevWallet ? ' · DEV' : ` · ${ystBalance.toLocaleString()} YST`}
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setWalletModalVisible(true)} style={{ fontSize: 11 }}>
            CONNECT
          </button>
        )}
      </div>
      <Sidebar
        activeSection={section} onNavigate={navigate}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        walletConnected={walletConnected} walletAddress={walletAddress}
        ystBalance={effectiveYstBalance}
      />
      <div id="main-wrap">
        <TickerBar walletConnected={walletConnected} walletLabel={walletLabel} onDisconnect={handleDisconnect} />
        <div id="main">
          <div className={`page-section ${section === 'home'         ? 'active' : ''}`}><ErrorBoundary sectionName="Home">        <Home         {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'screener'     ? 'active' : ''}`}><ErrorBoundary sectionName="Screener">    <Screener     {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'terminal'     ? 'active' : ''}`}><ErrorBoundary sectionName="Terminal">    <Terminal     {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'clowns'       ? 'active' : ''}`}><ErrorBoundary sectionName="Clowns">      <Clowns       {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'nftmarket'    ? 'active' : ''}`}><ErrorBoundary sectionName="NFT Market">  <NftMarket    {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'launchpad'    ? 'active' : ''}`}><ErrorBoundary sectionName="Launchpad">   <Launchpad    {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'tokencreator' ? 'active' : ''}`}><ErrorBoundary sectionName="Token">       <TokenCreator {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'features'     ? 'active' : ''}`}><ErrorBoundary sectionName="Requests">    <Features     {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'portfolio'    ? 'active' : ''}`}><ErrorBoundary sectionName="Portfolio">   <Portfolio    {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'raffle'       ? 'active' : ''}`}><ErrorBoundary sectionName="Raffle">      <Raffle       {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'wallet'       ? 'active' : ''}`}><ErrorBoundary sectionName="Profile">     <Wallet       {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'ledger'       ? 'active' : ''}`}><ErrorBoundary sectionName="Rug Ledger">  <Ledger       {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'news'         ? 'active' : ''}`}><ErrorBoundary sectionName="News">        <News         {...sectionProps} /></ErrorBoundary></div>
          <div className={`page-section ${section === 'services'     ? 'active' : ''}`}><ErrorBoundary sectionName="AI Services"> <Services /></ErrorBoundary></div>
          <div className={`page-section ${section === 'wren'         ? 'active' : ''}`}><ErrorBoundary sectionName="Wren">        <Wren /></ErrorBoundary></div>
          <div className={`page-section ${section === 'nftdrop'      ? 'active' : ''}`}><ErrorBoundary sectionName="NFT Drop">    <NftDrop /></ErrorBoundary></div>
          <div className={`page-section ${section === 'alerts'       ? 'active' : ''}`}><ErrorBoundary sectionName="Alerts">      <Alerts       {...sectionProps} /></ErrorBoundary></div>
        </div>
      </div>
    </div>
  );
}
