'use client';
import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Sidebar from '@/components/Sidebar';
import TickerBar from '@/components/TickerBar';
import { YST_MINT, YST_GATE, WHALE_GATE } from '@/lib/constants';
import { HOLDER_SNAPSHOT } from '@/lib/holders';
// Sections
import Home from '@/components/sections/Home';
import Screener from '@/components/sections/Screener';
import Terminal from '@/components/sections/Terminal';
import Update from '@/components/sections/Update';
import Trusted from '@/components/sections/Trusted';
import Clowns from '@/components/sections/Clowns';
import YakkTrader from '@/components/sections/YakkTrader';
import Predictions from '@/components/sections/Predictions';
import Cabal from '@/components/sections/Cabal';
import NftMarket from '@/components/sections/NftMarket';
import Launchpad from '@/components/sections/Launchpad';
import OtcDesk from '@/components/sections/OtcDesk';
import YieldFinder from '@/components/sections/YieldFinder';
import Alerts from '@/components/sections/Alerts';
import Privacy from '@/components/sections/Privacy';
import TokenCreator from '@/components/sections/TokenCreator';
import TgBot from '@/components/sections/TgBot';
import Features from '@/components/sections/Features';
import Portfolio from '@/components/sections/Portfolio';
import Stakepoint from '@/components/sections/Stakepoint';
import ArtLab from '@/components/sections/ArtLab';
import Coach from '@/components/sections/Coach';
import Raids from '@/components/sections/Raids';
import Raffle from '@/components/sections/Raffle';
import Wallet from '@/components/sections/Wallet';
import Members from '@/components/sections/Members';
import WhaleClub from '@/components/sections/WhaleClub';
import Ledger from '@/components/sections/Ledger';
import Whitepaper from '@/components/sections/Whitepaper';

type SectionId =
  | 'home' | 'screener' | 'terminal' | 'update' | 'trusted' | 'clowns'
  | 'yakktrader' | 'predictions' | 'cabal' | 'nftmarket' | 'launchpad'
  | 'otcdesk' | 'yieldfinder' | 'alerts' | 'privacy' | 'tokencreator'
  | 'tgbot' | 'features' | 'portfolio' | 'stakepoint' | 'artlab' | 'coach'
  | 'raids' | 'raffle' | 'wallet' | 'members' | 'whaleclub' | 'ledger' | 'whitepaper';

// Fetch live YST token balance for wallets NOT in snapshot
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
  const walletConnected = connected && !!publicKey;
  const walletAddress = publicKey?.toBase58();

  // Fetch YST balance whenever wallet connects
  useEffect(() => {
    if (!walletConnected || !publicKey) { setYstBalance(0); return; }
    const addr = publicKey.toBase58();
    const snapshotBal = HOLDER_SNAPSHOT[addr] ?? -1;
    if (snapshotBal >= 0) { setYstBalance(snapshotBal); return; }
    setBalanceLoading(true);
    fetchYstBalance(connection, publicKey)
      .then(live => { setYstBalance(live); })
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

  // Update document title on section change
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'Home',
      screener: 'YAKK Screener',
      terminal: 'YAKK Terminal',
      yakktrader: 'YAKK AI Trader',
      predictions: 'Prediction Markets',
      cabal: 'Cabal Investigator',
      launchpad: 'YAKK Ventures',
      otcdesk: 'OTC Desk',
      yieldfinder: 'Yield Finder',
      stakepoint: 'StakePoint',
      wallet: 'Profile',
      members: 'Members',
      whaleclub: 'Whale Club',
    };
    document.title = (titles[section] ?? section.toUpperCase()) + ' | $YAKK Studios';
  }, [section]);

  const walletLabel = walletAddress
    ? walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)
    : '';
  const sectionProps = { walletConnected, ystBalance, onNavigate: navigate };

  return (
    <div id="app">
      <div id="mobile-header">
        <button id="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          â°
        </button>
        <div id="mob-brand">
          $YAKK <span>STUDIOS</span>
        </div>
        {walletConnected ? (
          <button className="btn btn-ghost btn-sm" onClick={handleDisconnect}>
            {walletLabel}{balanceLoading ? ' â¦' : ` Â· ${ystBalance.toLocaleString()} YST`}
          </button>
        ) : (
          <w-sol-button style={{ '--wsol-border-radius': '4px', '--wsol-font-size': '11px' } as any} />
        )}
      </div>
      <Sidebar
        activeSection={section} onNavigate={navigate}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        walletConnected={walletConnected} walletAddress={walletAddress}
        ystBalance={ystBalance}
      />
      <div id="main-wrap">
        <TickerBar onConnectWallet={() => {}} walletConnected={walletConnected} walletLabel={walletLabel} />
        <div id="main">
          <div className={`page-section ${section === 'home' ? 'active' : ''}`}><Home {...sectionProps} /></div>
          <div className={`page-section ${section === 'screener' ? 'active' : ''}`}><Screener {...sectionProps} /></div>
          <div className={`page-section ${section === 'terminal' ? 'active' : ''}`}><Terminal {...sectionProps} /></div>
          <div className={`page-section ${section === 'update' ? 'active' : ''}`}><Update {...sectionProps} /></div>
          <div className={`page-section ${section === 'trusted' ? 'active' : ''}`}><Trusted {...sectionProps} /></div>
          <div className={`page-section ${section === 'clowns' ? 'active' : ''}`}><Clowns {...sectionProps} /></div>
          <div className={`page-section ${section === 'yakktrader' ? 'active' : ''}`}><YakkTrader {...sectionProps} /></div>
          <div className={`page-section ${section === 'predictions' ? 'active' : ''}`}><Predictions {...sectionProps} /></div>
          <div className={`page-section ${section === 'cabal' ? 'active' : ''}`}><Cabal {...sectionProps} /></div>
          <div className={`page-section ${section === 'nftmarket' ? 'active' : ''}`}><NftMarket {...sectionProps} /></div>
          <div className={`page-section ${section === 'launchpad' ? 'active' : ''}`}><Launchpad {...sectionProps} /></div>
          <div className={`page-section ${section === 'otcdesk' ? 'active' : ''}`}><OtcDesk {...sectionProps} /></div>
          <div className={`page-section ${section === 'yieldfinder' ? 'active' : ''}`}><YieldFinder {...sectionProps} /></div>
          <div className={`page-section ${section === 'alerts' ? 'active' : ''}`}><Alerts {...sectionProps} /></div>
          <div className={`page-section ${section === 'privacy' ? 'active' : ''}`}><Privacy {...sectionProps} /></div>
          <div className={`page-section ${section === 'tokencreator'? 'active' : ''}`}><TokenCreator{...sectionProps} /></div>
          <div className={`page-section ${section === 'tgbot' ? 'active' : ''}`}><TgBot {...sectionProps} /></div>
          <div className={`page-section ${section === 'features' ? 'active' : ''}`}><Features {...sectionProps} /></div>
          <div className={`page-section ${section === 'portfolio' ? 'active' : ''}`}><Portfolio {...sectionProps} /></div>
          <div className={`page-section ${section === 'stakepoint' ? 'active' : ''}`}><Stakepoint {...sectionProps} /></div>
          <div className={`page-section ${section === 'artlab' ? 'active' : ''}`}><ArtLab {...sectionProps} /></div>
          <div className={`page-section ${section === 'coach' ? 'active' : ''}`}><Coach {...sectionProps} /></div>
          <div className={`page-section ${section === 'raids' ? 'active' : ''}`}><Raids {...sectionProps} /></div>
          <div className={`page-section ${section === 'raffle' ? 'active' : ''}`}><Raffle {...sectionProps} /></div>
          <div className={`page-section ${section === 'wallet' ? 'active' : ''}`}><Wallet {...sectionProps} /></div>
          <div className={`page-section ${section === 'members' ? 'active' : ''}`}><Members {...sectionProps} /></div>
          <div className={`page-section ${section === 'whaleclub' ? 'active' : ''}`}><WhaleClub {...sectionProps} /></div>
          <div className={`page-section ${section === 'ledger' ? 'active' : ''}`}><Ledger {...sectionProps} /></div>
          <div className={`page-section ${section === 'whitepaper' ? 'active' : ''}`}><Whitepaper {...sectionProps} /></div>
        </div>
      </div>
    </div>
  );
}
