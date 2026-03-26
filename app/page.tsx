'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TickerBar from '@/components/TickerBar';

// Sections
import Home       from '@/components/sections/Home';
import Screener   from '@/components/sections/Screener';
import Terminal   from '@/components/sections/Terminal';
import Update     from '@/components/sections/Update';
import Trusted    from '@/components/sections/Trusted';
import Clowns     from '@/components/sections/Clowns';
import YakkTrader from '@/components/sections/YakkTrader';
import Predictions from '@/components/sections/Predictions';
import Cabal      from '@/components/sections/Cabal';
import NftMarket  from '@/components/sections/NftMarket';
import Launchpad  from '@/components/sections/Launchpad';
import OtcDesk    from '@/components/sections/OtcDesk';
import YieldFinder from '@/components/sections/YieldFinder';
import Alerts     from '@/components/sections/Alerts';
import Privacy    from '@/components/sections/Privacy';
import TokenCreator from '@/components/sections/TokenCreator';
import TgBot      from '@/components/sections/TgBot';
import Features   from '@/components/sections/Features';
import Portfolio  from '@/components/sections/Portfolio';
import Stakepoint from '@/components/sections/Stakepoint';
import ArtLab     from '@/components/sections/ArtLab';
import Coach      from '@/components/sections/Coach';
import Raids      from '@/components/sections/Raids';
import Raffle     from '@/components/sections/Raffle';
import Wallet     from '@/components/sections/Wallet';
import Members    from '@/components/sections/Members';
import WhaleClub  from '@/components/sections/WhaleClub';
import Ledger     from '@/components/sections/Ledger';
import Whitepaper from '@/components/sections/Whitepaper';

type SectionId =
  | 'home' | 'screener' | 'terminal' | 'update' | 'trusted' | 'clowns'
  | 'yakktrader' | 'predictions' | 'cabal' | 'nftmarket' | 'launchpad'
  | 'otcdesk' | 'yieldfinder' | 'alerts' | 'privacy' | 'tokencreator'
  | 'tgbot' | 'features' | 'portfolio' | 'stakepoint' | 'artlab' | 'coach'
  | 'raids' | 'raffle' | 'wallet' | 'members' | 'whaleclub' | 'ledger'
  | 'whitepaper';

export default function App() {
  const [section, setSection]   = useState<SectionId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wallet state (connect logic TBD — Solana wallet adapter)
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress]     = useState<string | undefined>();
  const [ystBalance, setYstBalance]           = useState(0);

  const navigate = useCallback((id: string) => {
    setSection(id as SectionId);
    setSidebarOpen(false);
    // Scroll main back to top on section change
    const mainEl = document.getElementById('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, []);

  const toggleWallet = useCallback(() => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress(undefined);
      setYstBalance(0);
    } else {
      // TODO: integrate @solana/wallet-adapter-react
      // For now, just mark as connected with a placeholder
      alert('Wallet adapter integration coming soon. Stake $YST at stakepoint.app to unlock tools.');
    }
  }, [walletConnected]);

  // Update document title on section change
  useEffect(() => {
    const titles: Record<string, string> = {
      home: '$YAKK Studios',
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
    ? walletAddress.slice(0, 4) + '\u2026' + walletAddress.slice(-4)
    : '';

  const sectionProps = {
    walletConnected,
    ystBalance,
    onNavigate: navigate,
  };

  return (
    <div id="app">
      {/* Mobile Header */}
      <div id="mobile-header">
        <button id="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          ☰
        </button>
        <div id="mob-brand">
          $YAKK <span>STUDIOS</span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={toggleWallet}>
          {walletConnected ? walletLabel : 'CONNECT'}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        activeSection={section}
        onNavigate={navigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        ystBalance={ystBalance}
      />

      {/* Main */}
      <div id="main-wrap">
        <TickerBar
          onConnectWallet={toggleWallet}
          walletConnected={walletConnected}
          walletLabel={walletLabel}
        />

        <div id="main">
          <div className={`page-section ${section === 'home'        ? 'active' : ''}`}><Home        {...sectionProps} /></div>
          <div className={`page-section ${section === 'screener'    ? 'active' : ''}`}><Screener    {...sectionProps} /></div>
          <div className={`page-section ${section === 'terminal'    ? 'active' : ''}`}><Terminal    {...sectionProps} /></div>
          <div className={`page-section ${section === 'update'      ? 'active' : ''}`}><Update      {...sectionProps} /></div>
          <div className={`page-section ${section === 'trusted'     ? 'active' : ''}`}><Trusted     {...sectionProps} /></div>
          <div className={`page-section ${section === 'clowns'      ? 'active' : ''}`}><Clowns      {...sectionProps} /></div>
          <div className={`page-section ${section === 'yakktrader'  ? 'active' : ''}`}><YakkTrader  {...sectionProps} /></div>
          <div className={`page-section ${section === 'predictions' ? 'active' : ''}`}><Predictions {...sectionProps} /></div>
          <div className={`page-section ${section === 'cabal'       ? 'active' : ''}`}><Cabal       {...sectionProps} /></div>
          <div className={`page-section ${section === 'nftmarket'   ? 'active' : ''}`}><NftMarket   {...sectionProps} /></div>
          <div className={`page-section ${section === 'launchpad'   ? 'active' : ''}`}><Launchpad   {...sectionProps} /></div>
          <div className={`page-section ${section === 'otcdesk'     ? 'active' : ''}`}><OtcDesk     {...sectionProps} /></div>
          <div className={`page-section ${section === 'yieldfinder' ? 'active' : ''}`}><YieldFinder {...sectionProps} /></div>
          <div className={`page-section ${section === 'alerts'      ? 'active' : ''}`}><Alerts      {...sectionProps} /></div>
          <div className={`page-section ${section === 'privacy'     ? 'active' : ''}`}><Privacy     {...sectionProps} /></div>
          <div className={`page-section ${section === 'tokencreator'? 'active' : ''}`}><TokenCreator{...sectionProps} /></div>
          <div className={`page-section ${section === 'tgbot'       ? 'active' : ''}`}><TgBot       {...sectionProps} /></div>
          <div className={`page-section ${section === 'features'    ? 'active' : ''}`}><Features    {...sectionProps} /></div>
          <div className={`page-section ${section === 'portfolio'   ? 'active' : ''}`}><Portfolio   {...sectionProps} /></div>
          <div className={`page-section ${section === 'stakepoint'  ? 'active' : ''}`}><Stakepoint  {...sectionProps} /></div>
          <div className={`page-section ${section === 'artlab'      ? 'active' : ''}`}><ArtLab      {...sectionProps} /></div>
          <div className={`page-section ${section === 'coach'       ? 'active' : ''}`}><Coach       {...sectionProps} /></div>
          <div className={`page-section ${section === 'raids'       ? 'active' : ''}`}><Raids       {...sectionProps} /></div>
          <div className={`page-section ${section === 'raffle'      ? 'active' : ''}`}><Raffle      {...sectionProps} /></div>
          <div className={`page-section ${section === 'wallet'      ? 'active' : ''}`}><Wallet      {...sectionProps} /></div>
          <div className={`page-section ${section === 'members'     ? 'active' : ''}`}><Members     {...sectionProps} /></div>
          <div className={`page-section ${section === 'whaleclub'   ? 'active' : ''}`}><WhaleClub   {...sectionProps} /></div>
          <div className={`page-section ${section === 'ledger'      ? 'active' : ''}`}><Ledger      {...sectionProps} /></div>
          <div className={`page-section ${section === 'whitepaper'  ? 'active' : ''}`}><Whitepaper  {...sectionProps} /></div>
        </div>
      </div>
    </div>
  );
}
