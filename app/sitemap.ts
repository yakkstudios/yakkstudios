import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.yakkstudios.xyz';

// All navigable sections — keeps Google indexed on every tool
const SECTIONS = [
  'home', 'screener', 'portfolio', 'alerts', 'raids', 'members',
  'ledger', 'cabal', 'predictions', 'trusted', 'launchpad',
  'otc-desk', 'stakepoint', 'yield-finder', 'nft-market',
  'bridge', 'token-creator', 'ai-trader', 'tg-bot', 'terminal',
  'news', 'art-lab', 'whale-club', 'whitepaper', 'services',
  'wallet', 'wren', 'update', 'privacy', 'terms',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Root — highest priority
  const root: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Section anchors — DApp is SPA so all sections live at /
  // Still useful for crawlers to see canonical URL surface area
  const sections: MetadataRoute.Sitemap = SECTIONS.map(slug => ({
    url: `${SITE_URL}/#${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: slug === 'screener' || slug === 'cabal' || slug === 'ledger' ? 0.9 : 0.7,
  }));

  return [...root, ...sections];
}
