// ── Token config ─────────────────────────────────────────────────────────────
export const YST_MINT = 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV';
export const YST_GATE = 250_000;
export const WHALE_GATE = 10_000_000;

// ── Dev wallet bypass (always full access, regardless of YST balance) ────────
export const DEV_WALLETS = new Set([
  '7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n',
]);

// ── DexScreener endpoints ────────────────────────────────────────────────────
export const DEX_API = 'https://api.dexscreener.com';

// ── Nav structure ─────────────────────────────────────────────────────────────
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  gated?: boolean;
  whaleOnly?: boolean;
  comingSoon?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  collapsed?: boolean;
}

export const GATED_SECTIONS = new Set([
  'screener','terminal','cabal','yakktrader','predictions','coach',
  'tgbot','update','artlab','raids','launchpad','otcdesk','yieldfinder',
  'portfolio','privacy','tokencreator','ledger','members','whaleclub',
  'bridge','alerts',
]);

// ── Focused nav: core items + NFT drop + legal + collapsed Labs (whale-only) ──
export const NAV: NavSection[] = [
  {
    title: 'CORE',
    items: [
      { id: 'home',     label: 'HOME',               icon: '🏠' },
      { id: 'screener', label: 'YAKK SCREENER',      icon: '🔍', gated: true },
      { id: 'cabal',    label: 'CABAL INVESTIGATOR',  icon: '🕵️', gated: true },
      { id: 'coach',    label: 'YAKKAI COACH',        icon: '🧠', gated: true },
      { id: 'clowns',   label: 'CERTIFIED CLOWNS',   icon: '🤡' },
      { id: 'services', label: 'AI SERVICES',         icon: '💼' },
    ],
  },
  {
    title: 'INFO',
    items: [
      { id: 'news',       label: 'YAKK NEWS',   icon: '📰' },
      { id: 'whitepaper', label: 'WHITEPAPER',   icon: '📄' },
      { id: 'ledger',     label: 'RUG LEDGER',   icon: '📒', gated: true },
      { id: 'stakepoint', label: 'STAKEPOINT',   icon: '🏆' },
    ],
  },
  {
    title: 'COMMUNITY',
    items: [
      { id: 'nftdrop',   label: 'NFT DROP — APR 20', icon: '🎴' },
      { id: 'wallet',    label: 'PROFILE',            icon: '👤' },
      { id: 'members',   label: 'MEMBERS',            icon: '👾', gated: true },
      { id: 'whaleclub', label: 'WHALE CLUB',         icon: '🐋', whaleOnly: true },
      { id: 'features',  label: 'REQUESTS',           icon: '💡' },
      { id: 'wren',      label: 'SAVE THE WREN',      icon: '🛡️' },
    ],
  },
  {
    title: 'LABS',
    collapsed: true,
    items: [
      { id: 'terminal',     label: 'YAKK TERMINAL',   icon: '⚡',  whaleOnly: true },
      { id: 'yakktrader',   label: 'AI TRADER',        icon: '🤖',  whaleOnly: true },
      { id: 'predictions',  label: 'PREDICTIONS',      icon: '🎯',  whaleOnly: true },
      { id: 'otcdesk',      label: 'OTC DESK',         icon: '🤝',  whaleOnly: true },
      { id: 'alerts',       label: 'PRICE ALERTS',     icon: '🔔',  whaleOnly: true },
      { id: 'bridge',       label: 'BRIDGE',           icon: '🌉',  whaleOnly: true },
      { id: 'yieldfinder',  label: 'YIELD FINDER',     icon: '💰',  whaleOnly: true },
      { id: 'launchpad',    label: 'YAKK VENTURES',    icon: '🦅',  whaleOnly: true },
      { id: 'portfolio',    label: 'PORTFOLIO',         icon: '📊',  whaleOnly: true },
      { id: 'nftmarket',    label: 'NFT MARKET',       icon: '🖼️',  whaleOnly: true },
      { id: 'raffle',       label: 'NFT RAFFLE',       icon: '🎟️',  whaleOnly: true },
      { id: 'tokencreator', label: 'TOKEN CREATOR',    icon: '🪙',  whaleOnly: true },
      { id: 'artlab',       label: 'ART LAB',          icon: '🎨',  whaleOnly: true },
      { id: 'tgbot',        label: 'TG TRADE BOT',     icon: '📱',  whaleOnly: true },
      { id: 'privacy',      label: 'PRIVACY ROUTER',   icon: '🕵️',  whaleOnly: true },
      { id: 'update',       label: 'UPDATE TOKEN',     icon: '🚀',  whaleOnly: true },
      { id: 'raids',        label: 'RAID HUB',         icon: '⚔️',  whaleOnly: true },
      { id: 'trusted',      label: 'TRUSTED LIST',     icon: '🛡️',  whaleOnly: true },
    ],
  },
  {
    title: 'LEGAL',
    items: [
      { id: 'terms',         label: 'TERMS OF SERVICE', icon: '📜' },
      { id: 'privacypolicy', label: 'PRIVACY POLICY',   icon: '🔒' },
    ],
  },
];

// ── Home cards (only show core features) ────────────────────────────────────
export interface HomeCard {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  accent: string;
}

export const HOME_CARDS: HomeCard[] = [
  { id: 'screener',   emoji: '🔍', title: 'YAKK SCREENER',      desc: 'Real-time Solana token screening. Filter by volume, liquidity & momentum.',    accent: 'var(--pink)'  },
  { id: 'cabal',      emoji: '🕵️', title: 'CABAL INVESTIGATOR', desc: 'On-chain wallet analysis. Track influencers, whales & insider wallets.',       accent: 'var(--pink)'  },
  { id: 'coach',      emoji: '🧠', title: 'YAKKAI COACH',       desc: 'AI-powered trading assistant. Get insights and analysis on any Solana token.', accent: 'var(--blue)'  },
  { id: 'clowns',     emoji: '🤡', title: 'CERTIFIED CLOWNS',   desc: 'On-chain forensics. Anti-rug scoring and wallet investigation reports.',       accent: 'var(--pink)'  },
  { id: 'services',   emoji: '💼', title: 'AI SERVICES',         desc: 'Professional AI services for Web3 projects. Strategy, automation, agents.',   accent: 'var(--green)' },
  { id: 'stakepoint', emoji: '🏆', title: 'STAKEPOINT',         desc: 'Stake your $YST to earn rewards and unlock all platform tools.',               accent: 'var(--gold)'  },
  { id: 'ledger',     emoji: '📒', title: 'RUG LEDGER',         desc: 'Community-sourced database of known rugs, scams, and suspicious projects.',    accent: 'var(--pink)'  },
  { id: 'news',       emoji: '📰', title: 'YAKK NEWS',          desc: 'Curated crypto news feed. Stay ahead of the market.',                          accent: 'var(--blue)'  },
];
