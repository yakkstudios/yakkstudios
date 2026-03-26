'use client';

import { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TickerBar from '@/components/TickerBar';
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

type SectionId = 'home'|'screener'|'terminal'|'update'|'trusted'|'clowns'|'yakktrader'|'predictions'|'cabal'|'nftmarket'|'launchpad'|'otcdesk'|'yieldfinder'|'alerts'|'privacy't'tokencreator'|'tgbot'|'features'|'portfolio'|"stakepoint'|'artlab'|'coach'|'raids'|'raffle't'wallet'|'members'|'whaleclub'|'ledger'|'whitepaper';

export default function App() {
  const [section, setSection] = useState<SectionId>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string|undefined>();
  const [ystBalance, setYstBalance] = useState(0);
  const navigate = useCallback((id:string) => { setSection(id as SectionId); setSidebarOpen(false); const m=document.getElementById('main'); if(m) m.scrollTop=0; },[]);
  const toggleWallet = useCallback(() => { if(walletConnected){ setWalletConnected(false); setWalletAddress(undefined); setYstBalance(0); } else { alert('Wallet adapter coming soon.'); } },[walletConnected]);
  useEffect(() => { document.title=({home:'$YAKK Studios',screener:'YAKK Screener',terminal:'YAKK Terminal',yakktrader:'YAKK AI Trader',predictions:'Prediction Markets',cabal:'Cabal Investigator',launchpad:'YAKK Ventures',otcdesk:'OTC Desk'yieldfinder:'Yield Finder',stakepoint:'StakePoint',wallet:'Profile',members:'Members',whaleclub:'Whale Club'}[section] ?? section.toUpperCase())+' | $YAKK Studios'; },[section]);
  const wlbl=walletAddress?walletAddress.slice(0,4)+'â¦,'+walletAddress.slice(-4):'';
  const sp={walletConnected,ystBalance,onNavigate:navigate};
  return (<div id="app"><div id="mobile-header"><button id="mob-menu-btn" onClick={()=>setSidebarOpen(true)}>â°</button><div id="mob-brand">$YAKK <span>STUDIOS</span></div><button className="btn btn-ghost btn-sm" onClick={toggleWallet}>{walletConnected?wlbl:'CONNECT'}</button></div><Sidebar activeSection={section} onNavigate={navigate} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} walletConnected={walletConnected} walletAddress={walletAddress} ystBalance={ystBalance}/><div id="main-wrap"><TickerBar onConnectWallet={toggleWallet} walletConnected={walletConnected} walletLabel={wlbl}/><div id="main"><div className={`page-section ${section=='home'?'active':''}`}><Home {...sp}/></div><div className={`page-section ${section=='screener'?'active':''}`}><Screener {...sp}/></div><div className={`page-section ${section=='terminal'?'active':''}`}><Terminal {...sp}/></div><div className={`page-section ${section=='update'?'active':''}`}><Update {...sp}/></div><div className={`page-section ${section=='trusted'?'active':''}`}><Trusted {...sp}/></div><div className={`page-section ${section=='clowns'?'active':''}`}><Clowns {...sp}/></div><div className={`page-section ${section=='yakktrader'?'active':''}`}><YakkTrader {...sp}/></div><div className={`page-section ${section=='predictions'?'active':''}`}><Predictions {...sp}/></div><div className={`page-section ${section=='cabal'?'active':''}`}><Cabal {...sp}/></div><div className={`page-section ${section=='nftmarket'?'active':''}`}><NftMarket {...sp}/></div><div className={`page-section ${section=='launchpad'?'active':''}`}><Launchpad {...sp}/></div><div className={`page-section ${section=='otcdesk'?'active':''}`}><OtcDesk {...sp}/></div><div className={`page-section ${section=='yieldfinder'?'active':''}`}><YieldFinder {...sp}/></div><div className={`page-section ${section=='alerts'?'active':''}`}><Alerts {...sp}/></div><div className={`page-section ${section=='privacy'?'active':''}`}><Privacy {...sp}/></div><div className={`page-section ${section=='tokencreator'?'active':''}`}><TokenCreator {...sp}/></div><div className={`page-section ${section=='tgbot'?'active':''}`}><TgBot {...sp}/></div><div className={`page-section ${section=='features'?'active':''}`}><Features {...sp}/></div><div className={`page-section ${section=='portfolio'?'active':''}`}><Portfolio {...sp}/></div><div className={`page-section ${section=='stakepoint'?'active':''}`}><Stakepoint {...sp}/></div><div className={`page-section ${section=='artlab'?'active':''}`}><ArtLab {...sp}/></div><div className={`page-section ${section=='coach'?'active':''}`}><Coach {...sp}/></div><div className={`page-section ${section=='raids'?'active':''}`}><Raids {...sp}/></div><div className={`page-section ${section=='raffle'?'active':''}`}><Raffle {...sp}/></div><div className={`page-section ${section=='wallet'?'active':''}`}><Wallet {...sp}/></div><div className={`page-section ${section=='members'?'active':''}`}><Members {...sp}/></div><div className={`page-section ${section=='whaleclub'?'active':''}`}><WhaleClub {...sp}/></div><div className={`page-section ${section=='ledger'?'active':''}`}><Ledger {...sp}/></div><div className={`page-section ${section=='whitepaper'?'active':''}`}><Whitepaper {...sp}/></div></div></div></div>);
}
