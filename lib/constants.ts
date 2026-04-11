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
  'screener','terminal','cabal','yakktrader','predictions',
  'tgbot','update','artlab','raids','launchpad','otcdesk','yieldfinder',
  'portfolio','privacy','tokencreator','ledger','members','whaleclub',
  'bridge','alerts','trusted',
]);

// ── Hub definitions (4 mega-sections with horizontal tabs) ───────────────────
// Each hub is a category in the sidebar. Clicking it routes to the first tool,
// and a HubTabBar at the top of every tool page shows sibling tools as tabs.
export interface HubDef {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  tools: NavItem[];
}

export const HUBS: HubDef[] = [
  {
    id: 'trade',
    label: 'TRADE',
    icon: '📈',
    blurb: 'Screen, chart, and execute on Solana.',
    tools: [
      { id: 'screener',    label: 'SCREENER',    icon: '🔍', gated: true },
      { id: 'terminal',    label: 'TERMINAL',    icon: '⚡', whaleOnly: true },
      { id: 'yakktrader',  label: 'AI TRADER',    icon: '🤖', whaleOnly: true },
      { id: 'predictions', label: 'PREDICTIONS', icon: '🎯', whaleOnly: true },
      { id: 'alerts',      label: 'ALERTS',       icon: '🔔', whaleOnly: true },
      { id: 'otcdesk',     label: 'OTC DESK',     icon: '🤝', whaleOnly: true },
      { id: 'bridge',      label: 'BRIDGE',       icon: '🌉', whaleOnly: true },
      { id: 'tgbot',       label: 'TG BOT',       icon: '📱', whaleOnly: true },
    ],
  },
  {
    id: 'investigate',
    label: 'INVESTIGATE',
    icon: '🕵️',
    blurb: 'On-chain forensics. Cabal intel. Rug archive.',
    tools: [
      { id: 'cabal',   label: 'CABAL',         icon: '🕵️', gated: true },
      { id: 'clowns',  label: 'CLOWNS',        icon: '🤡' },
      { id: 'ledger',  label: 'RUG LEDGER',    icon: '📒', gated: true },
      { id: 'trusted', label: 'TRUSTED LIST',  icon: '🛡️', whaleOnly: true },
      { id: 'raids',   label: 'RAID HUB',      icon: '⚔️', whaleOnly: true },
    ],
  },
  {
    id: 'earn',
    label: 'EARN',
    icon: '💰',
    blurb: 'Stake, farm, and compound $YST yield.',
    tools: [
      { id: 'stakepoint',  label: 'STAKEPOINT',    icon: '🏆' },
      { id: 'yieldfinder', label: 'YIELD FINDER',  icon: '💰', whaleOnly: true },
      { id: 'launchpad',   label: 'VENTURES',      icon: '🦅', whaleOnly: true },
      { id: 'portfolio',   label: 'PORTFOLIO',     icon: '📊', whaleOnly: true },
    ],
  },
  {
    id: 'whalelabs',
    label: 'WHALE LABS',
    icon: '🐋',
    blurb: 'Premium playground for 10M+ holders.',
    tools: [
      { id: 'nftmarket', label: 'NFT MARKET',    icon: '🖼️', whaleOnly: true },
      { id: 'raffle',    label: 'NFT RAFFLE',    icon: '🎟️', whaleOnly: true },
      { id: 'artlab',    label: 'ART LAB',       icon: '🎨', whaleOnly: true },
      { id: 'privacy',   label: 'PRIVACY',       icon: '🕵️', whaleOnly: true },
      { id: 'update',    label: 'CHANGELOG',     icon: '📋', whaleOnly: true },
    ],
  },
  {
    id: 'community',
    label: 'COMMUNITY',
    icon: '👥',
    blurb: 'News, members, causes, and your voice.',
    tools: [
      { id: 'news',       label: 'NEWS',           icon: '📰' },
      { id: 'members',    label: 'MEMBERS',        icon: '👾', gated: true },
      { id: 'whaleclub',  label: 'WHALE CLUB',     icon: '🐋', whaleOnly: true },
      { id: 'wren',       label: 'SAVE THE WREN',  icon: '🛡️' },
      { id: 'features',   label: 'REQUESTS',       icon: '💡' },
      { id: 'nftdrop',    label: 'NFT DROP',       icon: '🎟️' },
      { id: 'whitepaper', label: 'WHITEPAPER',     icon: '📄' },
    ],
  },
];

export const HUB_IDS = new Set(HUBS.map(h => h.id));

// Reverse map: tool id → parent hub id. Used by HubTabBar to know which tabs
// to render above any given tool page.
export const TOOL_TO_HUB: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const hub of HUBS) {
    for (const tool of hub.tools) m[tool.id] = hub.id;
  }
  return m;
})();

// ── Flat sidebar (hub-collapsed — 9 items total, zero visible tools) ─────────
export const NAV: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { id: 'home',     label: 'HOME',         icon: '🏠' },
      ...HUBS.map<NavItem>(h => ({ id: h.id, label: h.label, icon: h.icon })),
      { id: 'wallet',   label: 'PROFILE',      icon: '👤' },
      { id: 'services', label: 'AI SERVICES',  icon: '💼' },
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

// ── Home cards ────────────────────────────────────────────────────────────────
export interface HomeCard {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  accent: string;
}

export const HOME_CARDS: HomeCard[] = [
  { id: 'trade',       emoji: '📈', title: 'TRADE',        desc: 'Screener, Terminal, AI Trader, Predictions & more — everything you need to trade Solana.',   accent: 'var(--pink)'  },
  { id: 'investigate', emoji: '🕵️', title: 'INVESTIGATE', desc: 'Cabal intel, certified clowns, rug ledger and the trusted list. Full on-chain forensics.',    accent: 'var(--pink)'  },
  { id: 'earn',        emoji: '💰', title: 'EARN',         desc: 'StakePoint, Yield Finder, Ventures and Portfolio. Compound your $YST position.',              accent: 'var(--gold)'  },
  { id: 'whalelabs',   emoji: '🐋', title: 'WHALE LABS',   desc: 'NFT Market, Raffle, Art Lab, Privacy Router. The premium playground for 10M+ holders.',       accent: 'var(--blue)'  },
  { id: 'community',   emoji: '👥', title: 'COMMUNITY',    desc: 'News, members, the Wren campaign, feature requests and the whitepaper.',                     accent: 'var(--green)' },
  { id: 'services',    emoji: '💼', title: 'AI SERVICES',  desc: 'Professional AI services for Web3 projects. Strategy, automation, agents.',                  accent: 'var(--green)' },
];
