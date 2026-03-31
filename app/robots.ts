import { MetadataRoute } from 'next';

const SITE_URL = 'https://www.yakkstudios.xyz';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',         // don't index API routes
          '/_next/',       // Next.js internals
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
