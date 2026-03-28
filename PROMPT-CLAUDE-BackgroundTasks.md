# Claude Background Tasks — YAKK Studios Empire

## Context
You are helping Jay (YAKK Studios founder) build the YakkStudios empire. The main DApp is at https://yakkstudios.xyz with repo at https://github.com/yakkstudios/yakkstudios (Next.js 14, TypeScript, React 18, Solana, Vercel auto-deploy).

**What's been done today (by Perplexity):**
- All 32 DApp sections are now ported to React/Next.js TSX components
- CSS design system synced from HTML to globals.css
- Bridge.tsx created as a new component
- 4 n8n workflows built and pushed to `n8n-workflows/` folder in repo
- `/api/stats` route added — fetches live $YST price from DexScreener with 60s cache
- GitHub connector is live, Vercel auto-deploys on push to main

## Your Tasks (Priority Order)

### 1. Wire Live $YST Price Into the DApp (HIGH PRIORITY)
The Home section (`components/sections/Home.tsx`) currently shows static placeholder data for $YST price, holder count, etc. Wire it to fetch from `/api/stats` on mount.

**What to do:**
- In `Home.tsx`, add a `useEffect` that fetches `/api/stats` 
- Update the stat cards that currently show "—" or "Fetching..." with real data:
  - `$YST PRICE` → `data.price` (format as `$0.00000XXX`)
  - `24H VOLUME` → `data.volume24h` (format as `$XXk`)
  - `24H CHANGE` → `data.change24h` (format as `+X.XX%`, green/red color)
- Also update `TickerBar.tsx` if it has placeholder price data

**Files:** `components/sections/Home.tsx`, `components/TickerBar.tsx`

### 2. Wire Live Price Into Screener (HIGH PRIORITY)
The Screener (`components/sections/Screener.tsx`) has YST in its token list with a static price. Wire it to fetch from `/api/stats` too so YST price updates in real-time.

### 3. Connect the n8n Webhook Endpoints to the DApp
Once Jay activates the n8n workflows, the following webhooks will be live:
- `GET https://yakkstudios.app.n8n.cloud/webhook/yst-stats` — returns live YST stats JSON
- `POST https://yakkstudios.app.n8n.cloud/webhook/helius-yst-webhook` — receives Helius whale alerts

Create a fallback in `/api/stats` that tries the n8n webhook first, falls back to direct DexScreener if n8n is down.

### 4. Helius Webhook Setup (MEDIUM)
Set up the Helius webhook configuration for the whale alert monitor:
- Create `/api/whale-feed.ts` — an API route that receives whale alert POSTs from n8n and stores them
- Add a simple in-memory or file-based recent whale alerts feed
- Wire into the Alerts.tsx component to display recent whale movements

### 5. SEO + Meta Tags Audit (MEDIUM)
Review `app/layout.tsx` and ensure:
- All OpenGraph tags are correct
- Twitter cards work
- Canonical URL is set
- Structured data (JSON-LD) covers all major sections
- Sitemap generation if not present

### 6. holders.ts Update Script (LOW)
The DApp uses `lib/holders.ts` for a static snapshot of holder balances. Create a script that:
- Fetches all YST token accounts from Helius or RPC
- Generates an updated `holders.ts` file
- Can be run periodically (daily)

## Architecture Reference
```
app/
  layout.tsx          — Root layout, meta tags, SolanaProvider
  page.tsx            — Main SPA, renders all 32 sections
  globals.css         — All CSS (design system synced from HTML)
api/
  price.ts            — Existing price endpoint  
  stats.ts            — NEW: live YST stats from DexScreener
  voice-token.ts      — Voice token endpoint
components/
  Sidebar.tsx         — Nav sidebar (reads from lib/constants.ts NAV)
  TickerBar.tsx       — Top ticker bar with price display
  sections/           — All 32 section components
lib/
  constants.ts        — NAV structure, GATED_SECTIONS, token config
  holders.ts          — Static holder balance snapshot
n8n-workflows/        — 4 workflow JSON files for n8n import
```

## Key Constants
- YST Mint: `jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV`
- YST Gate: 250,000 $YST
- Whale Gate: 10,000,000 $YST
- Meteora Pool: `FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM`
- DexScreener API: `https://api.dexscreener.com/latest/dex/tokens/{mint}`

## Rules
- Every push to main auto-deploys to yakkstudios.xyz via Vercel (~60s)
- Build must stay GREEN — run `npx next build` before pushing
- Use the existing CSS design system classes (don't reinvent)
- Token gating: `walletConnected && ystBalance >= 250_000`
