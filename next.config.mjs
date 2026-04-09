/** @type {import('next').NextConfig} */

// ── Security Headers ──────────────────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for styles; tighten with nonce in future
  "style-src 'self' 'unsafe-inline'",
  // unsafe-eval needed by Next.js dev mode; webpack chunks in prod
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  // Images: self + CDNs used by token metadata
  "img-src 'self' data: blob: https://unavatar.io https://pbs.twimg.com https://cdn.pump.fun https://arweave.net https://nftstorage.link",
  // API calls + LiveKit WebSocket (wildcard covers cloud.livekit.io and custom servers)
  "connect-src 'self' https://api.dexscreener.com https://api.coingecko.com wss://*.livekit.cloud wss://*.livekit.io wss://signal.livekit.io",
  // Microphone for voice lounge only; block camera, geolocation, etc.
  "media-src 'self' blob:",
  "font-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const SECURITY_HEADERS = [
  // Force HTTPS for 2 years; include subdomains; eligible for preload list
  { key: 'Strict-Transport-Security',     value: 'max-age=63072000; includeSubDomains; preload' },
  // Block clickjacking
  { key: 'X-Frame-Options',              value: 'SAMEORIGIN' },
  // Prevent MIME sniffing
  { key: 'X-Content-Type-Options',       value: 'nosniff' },
  // Limit referrer to origin only on cross-origin requests
  { key: 'Referrer-Policy',             value: 'strict-origin-when-cross-origin' },
  // Explicitly block dangerous browser features; allow microphone for voice lounge
  { key: 'Permissions-Policy',          value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=()' },
  // DNS prefetching
  { key: 'X-DNS-Prefetch-Control',      value: 'on' },
  // Content Security Policy
  { key: 'Content-Security-Policy',     value: CSP },
];

const nextConfig = {
  // Treat livekit-server-sdk as an external package (ESM-only, cannot be bundled by Next.js).
  // Without this, Next.js strips the import and voice-token/route.ts compiles to an
  // identical bundle as stats/route.ts, causing Vercel's EEXIST symlink error.
  // NOTE: Next.js 14.2.x uses experimental.serverComponentsExternalPackages
  // (serverExternalPackages is Next.js 15+ syntax and is silently ignored in 14.x)
  experimental: {
    serverComponentsExternalPackages: ['tweetnacl'],
  },

  // ── Force unique chunk identity per API route ──────────────────────────────
  // Disables webpack scope hoisting (module concatenation) for server bundles.
  // Without this, Next.js merges small route modules into identical output chunks
  // causing Vercel's output adapter to EEXIST when it tries to symlink duplicate
  // .func bundles. Belt-and-suspenders alongside the maxDuration exports.
  webpack(config, { isServer }) {
    if (isServer) {
      config.optimization = {
        ...config.optimization,
        concatenateModules: false,
      };
    }
    return config;
  },

  // Re-enable TypeScript checking — hiding errors masks security bugs
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'unavatar.io' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 'cdn.pump.fun' },
      { protocol: 'https', hostname: 'arweave.net' },
      { protocol: 'https', hostname: 'nftstorage.link' },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
      {
        // CORS for API routes: only allow same origin in production
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: process.env.NEXT_PUBLIC_APP_URL ?? 'https://yakkstudios.vercel.app' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          { key: 'Access-Control-Max-Age',        value: '86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
