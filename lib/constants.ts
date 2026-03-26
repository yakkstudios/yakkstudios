// ââ Token config âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export const YST_MINT = 'AhqBZEsADHGGFJQEPjAbF4RvHhpfKjaejhxFfMYFDkfz';
export const YST_GATE = 250_000;
export const WHALE_GATE = 10_000_000;

// ââ DexScreener endpoints ââââââââââââââââââââââââââââââââââââââââââââââââââ
export const DEX_API = 'https://api.dexscreener.com';

// ââ Nav structure âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
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
    title: 'CORE',
    items: [
      { id: 'home',     label: 'HOME / DEN',        icon: 'ð ' },
      { id: 'screener', label: 'YAKK SCREENER',      icon: 'ð', gated: true },
      { id: 'terminal', label: 'YAKK TERMINAL',      icon: 'â¡', gated: true },
      { id: 'update',   label: 'UPDATE TOKEN',       icon: 'ð', gated: true },
      { id: 'trusted',  label: 'TRUSTED LIST',       icon: 'ð¡ï¸' },
      { id: 'clowns',   label: 'CERTIFIED CLOWNS',   icon: 'ð¤¡' },
    ],
  },
  {
    title: 'CULT TOOLS',
    items: [
      { id: 'yakktrader',   label: 'YAKK AI TRADER',     icon: 'ð¤', gated: true },
      { id: 'predictions',  label: 'PREDICTION MARKETS', icon: 'ð®', gated: true },
      { id: 'cabal',        label: 'CABAL INVESTIGATOR',  icon: 'ð', gated: true },
      { id: 'nftmarket',    label: 'NFT MARKET',          icon: 'ð' },
      { id: 'launchpad',    label: 'YAKK VENTURES',       icon: 'ð¦', gated: true },
      { id: 'otcdesk',      label: 'OTC DESK',            icon: 'ð¤', gated: true },
      { id: 'yieldfinder',  label: 'YIELD FINDER',        icon: 'ð°', gated: true },
      { id: 'alerts',       label: 'PRICE ALERTS',        icon: 'ð' },
      { id: 'privacy',      label: 'PRIVACY ROUTER',      icon: 'ðµï¸', gated: true },
      { id: 'tokencreator', label: 'TOKEN CREATOR',       icon: 'ðª', gated: true },
      { id: 'tgbot',        label: 'TG TRADE BOT',        icon: 'ð¤', gated: true },
      { id: 'features',     label: 'FEATURE REQUESTS',    icon: 'ð¡' },
      { id: 'portfolio',    label: 'PORTFOLIO',           icon: 'ð', gated: true },
      { id: 'stakepoint',   label: 'STAKEPOINT',          icon: 'ð' },
      { id: 'artlab',       label: 'ART LAB',             icon: 'ð¨', gated: true },
      { id: 'coach',        label: 'YAKKAI COACH',        icon: 'ð§ ', gated: true },
      { id: 'raids',        label: 'RAID HUB',            icon: 'âï¸', gated: true },
      { id: 'raffle',       label: 'NFT RAFFLE',          icon: 'ðï¸' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { id: 'wallet',     label: 'PROFILE',       icon: 'ð' },
      { id: 'members',    label: 'MEMBERS',        icon: 'ð¾', gated: true },
      { id: 'whaleclub',  label: 'WHALE CLUB',     icon: 'ð', whaleOnly: true },
      { id: 'ledger',     label: 'RUG LEDGER',     icon: 'ð', gated: true },
      { id: 'whitepaper', label: 'WHITEPAPER',     icon: 'ð' },
    ],
  },
];

// ââ Home cards ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export interface HomeCard {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  accent: string;
}

export const HOME_CARDS: HomeCard[] = [
  { id: 'screener',     emoji: 'ð', title: 'YAKK SCREENER',      desc: 'Real-time Solana token screening. Filter by volume, liquidity & momentum.',  accent: 'var(--pink)' },
  { id: 'terminal',     emoji: 'â¡', title: 'YAKK TERMINAL',      desc: 'Advanced trading terminal. Charts, order book, and one-click trades.',        accent: 'var(--pink)' },
  { id: 'yakktrader',   emoji: 'ð¤', title: 'YAKK AI TRADER',     desc: 'AI-powered trading signals. Let the bot find the plays you miss.',             accent: 'var(--blue)' },
  { id: 'cabal',        emoji: 'ð', title: 'CABAL INVESTIGATOR',  desc: 'On-chain wallet analysis. Track influencers, whales & insider wallets.',       accent: 'var(--pink)' },
  { id: 'predictions',  emoji: 'ð¯', title: 'PREDICTION MARKETS',  desc: 'Predict token price movements. Earn rewards for accurate calls.',              accent: 'var(--pink)' },
  { id: 'otcdesk',      emoji: 'ð¤', title: 'OTC DESK',            desc: 'Peer-to-peer token swaps. No slippage. Private & trustless.',                  accent: 'var(--green)' },
  { id: 'launchpad',    emoji: 'ð', title: 'YAKK VENTURES',       desc: 'Community-vetted token launches. Early access for $YST holders.',             accent: 'var(--gold)' },
  { id: 'yieldfinder',  emoji: 'ð°', title: 'YIELD FINDER',        desc: 'Discover the best yield opportunities across Solana DeFi.',                   accent: 'var(--green)' },
  { id: 'nftmarket',    emoji: 'ð', title: 'NFT MARKET',          desc: 'Browse and trade YAKK ecosystem NFTs. Floor prices live.',                    accent: 'var(--blue)' },
  { id: 'stakepoint',   emoji: 'ð', title: 'STAKEPOINT',          desc: 'Stake your $YST to earn rewards and unlock all platform tools.',              accent: 'var(--gold)' },
  { id: 'portfolio',    emoji: 'ð', title: 'PORTFOLIO TRACKER',   desc: 'Track your Solana portfolio performance in real time.',                        accent: 'var(--green)' },
  { id: 'raids',        emoji: 'âï¸', title: 'RAID HUB',            desc: 'Coordinate community raids. Boost visibility for $YAKK.',                    accent: 'var(--pink)' },
];
