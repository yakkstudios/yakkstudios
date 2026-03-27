'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Connection } from '@solana/web3.js';
import Sidebar from '@/components/Sidebar';
import TickerBar from '@/components/TickerBar';
// Sections
import Home        from '@/components/sections/Home';
import Screener    from '@/components/sections/Screener';
import Terminal    from '@/components/sections/Terminal';
import Update      from '@/components/sections/Update';
import Trusted     from '@/components/sections/Trusted';
import Clowns      from '@/components/sections/Clowns';
import YakkTrader  from '@/components/sections/YakkTrader';
import Predictions from '@/components/sections/Predictions';
import Cabal       from '@/components/sections/Cabal';
import NftMarket   from '@/components/sections/NftMarket';
import Launchpad   from '@/components/sections/Launchpad';
import OtcDesk     from '@/components/sections/OtcDesk';
import YieldFinder from '@/components/sections/YieldFinder';
import Alerts      from '@/components/sections/Alerts';
import Privacy     from '@/components/sections/Privacy';
import TokenCreator from '@/components/sections/TokenCreator';
import TgBot       from '@/components/sections/TgBot';
import Features    from '@/components/sections/Features';
import Portfolio   from '@/components/sections/Portfolio';
import Stakepoint  from '@/components/sections/Stakepoint';
import ArtLab      from '@/components/sections/ArtLab';
import Coach       from '@/components/sections/Coach';
import Raids       from '@/components/sections/Raids';
import Raffle      from '@/components/sections/Raffle';
import Wallet      from '@/components/sections/Wallet';
import Members     from '@/components/sections/Members';
import WhaleClub   from '@/components/sections/WhaleClub';
import Ledger      from '@/components/sections/Ledger';
import Whitepaper  from '@/components/sections/Whitepaper';
import News        from '@/components/sections/News';

// ── Correct $YST mint address ─────────────────────────────────────────────
const YST_MINT = new PublicKey('jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV');

type SectionId =
  | 'home' | 'news' | 'screener' | 'terminal' | 'update' | 'trusted' | 'clowns'
  | 'yakktrader' | 'predictions' | 'cabal' | 'nftmarket' | 'launchpad'
  | 'otcdesk' | 'yieldfinder' | 'alerts' | 'privacy' | 'tokencreator'
  | 'tgbot' | 'features' | 'portfolio' | 'stakepoint' | 'artlab' | 'coach'
  | 'raids' | 'raffle' | 'wallet' | 'members' | 'whaleclub' | 'ledger'
  | 'whitepaper';

export default function App() {
  const [section, setSection]         = useState<SectionId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ystBalance, setYstBalance]   = useState(0);

  // ── Real wallet state from Solana wallet adapter ──────────────────────
  const { publicKey, connected, disconnect } = useWallet();
  const { connection }                        = useConnection();
  const { setVisible: openWalletModal }       = useWalletModal();

  const walletConnected = connected && !!publicKey;
  const walletAddress   = publicKey?.toBase58();

  // ── Fetch $YST balance whenever wallet connects / changes ─────────────
  useEffect(() => {
    if (!walletConnected || !publicKey) {
      setYstBalance(0);
      return;
    }

    let cancelled = false;

async function fetchBalance() {
        // Try multiple RPCs in order — improves reliability on mobile / iPad
              const rpcs = [
                      connection,
                              new Connection('https://api.mainnet-beta.solana.com', 'confirmed'),
                                      new Connection('https://solana-api.projectserum.com', 'confirmed'),
                                            ];
                                                  for (const conn of rpcs) {
                                                          try {
                                                                    const accounts = await conn.getParsedTokenAccountsByOwner(
                                                                                publicKey!,
                                                                                            { mint: YST_MINT }
                                                                                                      );
                                                                                                                if (cancelled) return;
                                                                                                                          const bal: number =
                                                                                                                                      accounts.value[0]?.account.data.parsed.info.tokenAmount.uiAmount ?? 0;
                                                                                                                                                setYstBalance(bal);
                                                                                                                                                          return;
                                                                                                                                                                  } catch {
                                                                                                                                                                            // try next RPC
                                                                                                                                                                                    }
                                                                                                                                                                                          }
                                                                                                                                                                                                if (!cancelled) setYstBalance(0);
                                                                                                                                                                                                    }
}

    fetchBalance();
    // Re-check every 60 s so balance stays current without page refresh
    const interval = setInterval(fetchBalance, 60_000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [walletConnected, publicKey, connection]);

  const navigate = useCallback((id: string) => {
    setSection(id as SectionId);
    setSidebarOpen(false);
    const mainEl = document.getElementById('main');
    if (mainEl) mainEl.scrollTop = 0;
  }, []);

  // Opens wallet selection modal on connect, disconnects on click when connected
  const toggleWallet = useCallback(() => {
    if (walletConnected) {
      disconnect();
    } else {
      openWalletModal(true);
    }
  }, [walletConnected, disconnect, openWalletModal]);

  // ── Document title ────────────────────────────────────────────────────
  useEffect(() => {
    const titles: Record<string, string> = {
      home: '$YAKK Studios',
      news: 'YAKK News',
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

  const sectionProps = { walletConnected, walletAddress, ystBalance, onNavigate: navigate };

  return (
    <div id="app">
      {/* Mobile Header */}
      <div id="mobile-header">
        <button id="mob-menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Menu">
          &#9776;
        </button>
        <div id="mob-brand">$YAKK <span>STUDIOS</span></div>
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
          <div className={`page-section ${section==='home'?'active':''}`}><Home {...sectionProps}/></div>
          <div className={`page-section ${section==='news'?'active':''}`}><News {...sectionProps}/></div>
          <div className={`page-section ${section==='screener'?'active':''}`}><Screener {...sectionProps}/></div>
          <div className={`page-section ${section==='terminal'?'active':''}`}><Terminal {...sectionProps}/></div>
          <div className={`page-section ${section==='update'?'active':''}`}><Update {...sectionProps}/></div>
          <div className={`page-section ${section==='trusted'?'active':''}`}><Trusted {...sectionProps}/></div>
          <div className={`page-section ${section==='clowns'?'active':''}`}><Clowns {...sectionProps}/></div>
          <div className={`page-section ${section==='yakktrader'?'active':''}`}><YakkTrader {...sectionProps}/></div>
          <div className={`page-section ${section==='predictions'?'active':''}`}><Predictions {...sectionProps}/></div>
          <div className={`page-section ${section==='cabal'?'active':''}`}><Cabal {...sectionProps}/></div>
          <div className={`page-section ${section==='nftmarket'?'active':''}`}><NftMarket {...sectionProps}/></div>
          <div className={`page-section ${section==='launchpad'?'active':''}`}><Launchpad {...sectionProps}/></div>
          <div className={`page-section ${section==='otcdesk'?'active':''}`}><OtcDesk {...sectionProps}/></div>
          <div className={`page-section ${section==='yieldfinder'?'active':''}`}><YieldFinder {...sectionProps}/></div>
          <div className={`page-section ${section==='alerts'?'active':''}`}><Alerts {...sectionProps}/></div>
          <div className={`page-section ${section==='privacy'?'active':''}`}><Privacy {...sectionProps}/></div>
          <div className={`page-section ${section==='tokencreator'?'active':''}`}><TokenCreator {...sectionProps}/></div>
          <div className={`page-section ${section==='tgbot'?'active':''}`}><TgBot {...sectionProps}/></div>
          <div className={`page-section ${section==='features'?'active':''}`}><Features {...sectionProps}/></div>
          <div className={`page-section ${section==='portfolio'?'active':''}`}><Portfolio {...sectionProps}/></div>
          <div className={`page-section ${section==='stakepoint'?'active':''}`}><Stakepoint {...sectionProps}/></div>
          <div className={`page-section ${section==='artlab'?'active':''}`}><ArtLab {...sectionProps}/></div>
          <div className={`page-section ${section==='coach'?'active':''}`}><Coach {...sectionProps}/></div>
          <div className={`page-section ${section==='raids'?'active':''}`}><Raids {...sectionProps}/></div>
          <div className={`page-section ${section==='raffle'?'active':''}`}><Raffle {...sectionProps}/></div>
          <div className={`page-section ${section==='wallet'?'active':''}`}><Wallet {...sectionProps}/></div>
          <div className={`page-section ${section==='members'?'active':''}`}><Members {...sectionProps}/></div>
          <div className={`page-section ${section==='whaleclub'?'active':''}`}><WhaleClub {...sectionProps}/></div>
          <div className={`page-section ${section==='ledger'?'active':''}`}><Ledger {...sectionProps}/></div>
          <div className={`page-section ${section==='whitepaper'?'active':''}`}><Whitepaper {...sectionProps}/></div>
        </div>
      </div>
    </div>
  );
    }
