// ── Token config ─────────────────────────────────────────────────────────────
export const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
export const YST_GATE = 250_000;
export const WHALE_GATE = 10_000_000;

// ── DexScreener endpoints ────────────────────────────────────────────────────
export const DEX_API = 'https://api.dexscreener.com';

// ── Nav structure ─────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  gated?: boolean;
  whaleOnly?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const GATED_SECTIONS = new Set([
  'screener','terminal','cabal','yakktrader','predictions','coach',
  'tgbot','update','artlab','raids','launchpad','otcdesk','yieldfinder',
  'portfolio','privacy','tokencreator','ledger','members','whaleclub',
]);

export const NAV: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { id: 'home', label: 'HOME / DEN', icon: '🏠' },
    ],
  },
  {
    title: 'TRADING',
    items: [
      { id: 'screener',    label: 'YAKK SCREENER',      icon: '🔍', gated: true },
      { id: 'terminal',    label: 'YAKK TERMINAL',      icon: '⚡', gated: true },
      { id: 'predictions', label: 'PREDICTION MARKETS', icon: '🎯', gated: true },
      { id: 'otcdesk',     label: 'OTC DESK',           icon: '🤝', gated: true },
      { id: 'alerts',      label: 'PRICE ALERTS',       icon: '🔔' },
    ],
  },
  {
    title: 'YAKK AI',
    items: [
      { id: 'yakktrader', label: 'YAKK AI TRADER',     icon: '🤖', gated: true },
      { id: 'coach',      label: 'YAKKAI COACH',       icon: '🧠', gated: true },
      { id: 'cabal',      label: 'CABAL INVESTIGATOR', icon: '🕵️', gated: true },
    ],
  },
  {
    title: 'RESEARCH',
    items: [
      { id: 'trusted',   label: 'TRUSTED LIST',     icon: '🛡️' },
      { id: 'portfolio', label: 'PORTFOLIO',        icon: '📊', gated: true },
      { id: 'clowns',    label: 'CERTIFIED CLOWNS', icon: '🤡' },
    ],
  },
  {
    title: 'DEFI & EARN',
    items: [
      { id: 'stakepoint',  label: 'STAKEPOINT',    icon: '🏆' },
      { id: 'yieldfinder', label: 'YIELD FINDER',  icon: '💰', gated: true },
      { id: 'launchpad',   label: 'YAKK VENTURES', icon: '🦅', gated: true },
      { id: 'nftmarket',   label: 'NFT MARKET',    icon: '🖼️' },
      { id: 'raffle',      label: 'NFT RAFFLE',    icon: '🎟️' },
    ],
  },
  {
    title: 'CREATE',
    items: [
      { id: 'tokencreator', label: 'TOKEN CREATOR',  icon: '🪙', gated: true },
      { id: 'artlab',       label: 'ART LAB',        icon: '🎨', gated: true },
      { id: 'tgbot',        label: 'TG TRADE BOT',   icon: '📱', gated: true },
      { id: 'privacy',      label: 'PRIVACY ROUTER', icon: '🕵️', gated: true },
      { id: 'update',       label: 'UPDATE TOKEN',   icon: '🚀', gated: true },
    ],
  },
  {
    title: 'COMMUNITY',
    items: [
      { id: 'raids',    label: 'RAID HUB',         icon: '⚔️', gated: true },
      { id: 'features', label: 'FEATURE REQUESTS', icon: '💡' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'wallet',     label: 'PROFILE',    icon: '👤' },
      { id: 'members',    label: 'MEMBERS',    icon: '👾', gated: true },
      { id: 'whaleclub',  label: 'WHALE CLUB', icon: '🐋', whaleOnly: true },
      { id: 'ledger',     label: 'RUG LEDGER', icon: '📒', gated: true },
      { id: 'whitepaper', label: 'WHITEPAPER', icon: '📄' },
    ],
  },
];

// ── Home cards ──────────────────────────────────────────────────────────────
export interface HomeCard {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  accent: string;
}

export const HOME_CARDS: HomeCard[] = [
  { id: 'screener',    emoji: '🔍', title: 'YAKK SCREENER',      desc: 'Real-time Solana token screening. Filter by volume, liquidity & momentum.',    accent: 'var(--pink)'  },
  { id: 'terminal',    emoji: '⚡', title: 'YAKK TERMINAL',      desc: 'Advanced trading terminal. Charts, order book, and one-click trades.',         accent: 'var(--pink)'  },
  { id: 'yakktrader',  emoji: '🤖', title: 'YAKK AI TRADER',     desc: 'AI-powered trading signals. Let the bot find the plays you miss.',             accent: 'var(--blue)'  },
  { id: 'cabal',       emoji: '🕵️', title: 'CABAL INVESTIGATOR', desc: 'On-chain wallet analysis. Track influencers, whales & insider wallets.',       accent: 'var(--pink)'  },
  { id: 'predictions', emoji: '🎯', title: 'PREDICTION MARKETS', desc: 'Predict token price movements. Earn rewards for accurate calls.',              accent: 'var(--pink)'  },
  { id: 'otcdesk',     emoji: '🤝', title: 'OTC DESK',           desc: 'Peer-to-peer token swaps. No slippage. Private & trustless.',                  accent: 'var(--green)' },
  { id: 'launchpad',   emoji: '🦅', title: 'YAKK VENTURES',      desc: 'Community-vetted token launches. Early access for $YST holders.',             accent: 'var(--gold)'  },
  { id: 'yieldfinder', emoji: '💰', title: 'YIELD FINDER',       desc: 'Discover the best yield opportunities across Solana DeFi.',                    accent: 'var(--green)' },
  { id: 'nftmarket',   emoji: '🖼️', title: 'NFT MARKET',         desc: 'Browse and trade YAKK ecosystem NFTs. Floor prices live.',                    accent: 'var(--blue)'  },
  { id: 'stakepoint',  emoji: '🏆', title: 'STAKEPOINT',         desc: 'Stake your $YST to earn rewards and unlock all platform tools.',              accent: 'var(--gold)'  },
  { id: 'portfolio',   emoji: '📊', title: 'PORTFOLIO TRACKER',  desc: 'Track your Solana portfolio P&L and holdings in real time.',                  accent: 'var(--green)' },
  { id: 'raids',       emoji: '⚔️', title: 'RAID HUB',           desc: 'Coordinate community raids. Boost visibility for $YAKK.',                    accent: 'var(--pink)'  },
];
