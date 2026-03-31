# CLAUDE.md — YAKK Studios Repository Memory

> This file is Claude's persistent memory for the yakkstudios/yakkstudios repo.
> Claude Code reads this automatically on every session start.
> Last updated: 2026-03-29

## Project Overview

**YAKK Studios DApp** — Solana-based DeFi platform at https://yakkstudios.xyz
- **Stack**: Next.js 14, TypeScript, React 18, Solana Web3.js, Vercel auto-deploy
- **Repo**: https://github.com/yakkstudios/yakkstudios
- **Founder**: Jay Green (alias: shyfts) — CEO/Founder
- **Partner**: Tommy Watt (role/equity TBD)

## Architecture

```
app/
  layout.tsx          — Root layout, OG meta, SolanaProvider wrapper
  page.tsx            — Main SPA, renders all 32 sections via switch
  globals.css         — Full design system (synced from HTML original)
  api/
    price/route.ts    — Live $YST price from DexScreener (60s cache)
    holders/route.ts  — Live holder count (Birdeye + RPC fallback)
    voice-token/      — Voice token endpoint
api/
  ai.js               — Anthropic proxy (wallet-verified)
  stakepoint.js       — StakePoint proxy
  stats.ts            — Live YST stats from DexScreener (60s cache)
components/
  Sidebar.tsx         — Nav sidebar (reads NAV from lib/constants.ts)
  TickerBar.tsx       — Top ticker bar with live price
  SolanaProvider.tsx  — Wallet adapter setup
  GateBadge.tsx       — Token gate badge component
  sections/           — All 32 section components (see below)
lib/
  constants.ts        — NAV structure, GATED_SECTIONS, token config
  holders.ts          — Static holder balance snapshot (needs automation)
n8n-workflows/        — 4 workflow JSONs for n8n import
discord-bot/          — Discord verification bot
```

## All 32 Sections (components/sections/)

| Section | File | Builder | Status |
|---------|------|---------|--------|
| Home | Home.tsx | Claude | Live + wired to /api/price |
| Screener | Screener.tsx | Claude | Live + wired to /api/price |
| Terminal | Terminal.tsx | Claude | Live |
| Predictions | Predictions.tsx | Claude | Live |
| Services | Services.tsx | Claude | Live |
| Update | Update.tsx | Pre-existing | Live |
| Trusted | Trusted.tsx | Pre-existing | Live |
| Clowns | Clowns.tsx | Pre-existing | Live |
| YakkTrader | YakkTrader.tsx | Pre-existing | Live |
| Cabal | Cabal.tsx | Pre-existing | Live |
| NftMarket | NftMarket.tsx | Pre-existing | Live |
| StakePoint | Stakepoint.tsx | Pre-existing | Live |
| News | News.tsx | Pre-existing | Live |
| Members | Members.tsx | Pre-existing | Live |
| WhaleClub | WhaleClub.tsx | Claude+Gemini | Live (gold redesign) |
| Ledger | Ledger.tsx | Claude | Live (11 cases) |
| Whitepaper | Whitepaper.tsx | Pre-existing | Live |
| Wren | Wren.tsx | Claude+Gemini | Live (wallet fixed) |
| Wallet | Wallet.tsx | Perplexity | Live |
| Portfolio | Portfolio.tsx | Perplexity | Live |
| OtcDesk | OtcDesk.tsx | Perplexity | Live |
| Launchpad | Launchpad.tsx | Perplexity | Live |
| YieldFinder | YieldFinder.tsx | Perplexity | Live |
| Raids | Raids.tsx | Perplexity | Live |
| Coach | Coach.tsx | Perplexity | Live |
| ArtLab | ArtLab.tsx | Perplexity | Live |
| Raffle | Raffle.tsx | Perplexity | Live |
| Alerts | Alerts.tsx | Perplexity | Live |
| Bridge | Bridge.tsx | Perplexity | Live (NEW) |
| TokenCreator | TokenCreator.tsx | Perplexity | Live |
| TgBot | TgBot.tsx | Perplexity | Live |
| Features | Features.tsx | Perplexity | Live |
| Privacy | Privacy.tsx | Perplexity | Live |
| PrivacyPolicy | PrivacyPolicy.tsx | Claude | Live (legal) |
| Terms | Terms.tsx | Claude | Live (legal) |

## Token Gating

- **Standard gate**: 250,000 $YST
- **Whale gate**: 10,000,000 $YST (WhaleClub only)
- **Logic**: `walletConnected && ystBalance >= 250_000`
- **Client-side by design** — architectural decision documented in commit f1225db
- **Gated sections** (in constants.ts GATED_SECTIONS):
  screener, terminal, cabal, yakktrader, predictions, coach, tgbot, update,
  artlab, raids, launchpad, otcdesk, yieldfinder, portfolio, privacy,
  tokencreator, ledger, members, whaleclub, bridge, alerts

## Key Constants

```typescript
YST_MINT = "jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV"
YST_GATE = 250_000
WHALE_GATE = 10_000_000
METEORA_POOL = "FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM"
DEXSCREENER_API = "https://api.dexscreener.com/latest/dex/tokens/{mint}"
```

## Nav Structure (lib/constants.ts)

```
OVERVIEW:  Home, YAKK News, AI Services
TRADING:   Screener*, Terminal*, Predictions*, OTC Desk*, Price Alerts*, Bridge*
YAKK AI:   AI Trader*, YAKKAI Coach*, Cabal Investigator*
RESEARCH:  Trusted List, Portfolio*, Certified Clowns
DEFI:      StakePoint, Yield Finder*, YAKK Ventures*, NFT Market, NFT Raffle
CREATE:    Token Creator*, Art Lab*, TG Trade Bot*, Privacy Router*, Update Token*
COMMUNITY: Raid Hub*, Feature Requests, Saving The Wren
ACCOUNT:   Profile, Members*, Whale Club🐋, Rug Ledger*, Whitepaper
(* = token gated, 🐋 = whale gated)
```

## CSS Design System (globals.css)

Use these classes — don't reinvent:
- **Layout**: `sec-pad`, `sec-eyebrow`, `sec-title`, `sec-bar`, `sec-header`, `sec-sub`
- **Grids**: `grid2`, `grid3`, `grid4`
- **Cards**: `card`, `card-sm`, `stat-card` + `slbl`, `sval`, `ssub`
- **Buttons**: `btn-primary`, `btn-pink`, `btn-gold`, `btn-green`, `btn-ghost`, `btn-outline`, `btn-sm`, `btn-xs`
- **Badges**: `badge`, `b-dim`, `b-pink`, `b-green`, `b-gold`, `b-blue`, `b-red`
- **Forms**: `inp`, `field-inp`, `field-lbl`, `field-sel`
- **Utility**: `prog-bar`, `prog-fill`, `warn-bar`, `mode-pill`, `chat-msgs`
- **Responsive**: grid collapse at 768px

## API Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| /api/price | GET | Live $YST price from DexScreener (60s cache) |
| /api/holders | GET | Live holder count (Birdeye + RPC fallback) |
| /api/stats | GET | Full YST stats bundle from DexScreener |
| /api/ai | POST | Anthropic Claude proxy (wallet-verified) |
| /api/stakepoint | * | StakePoint proxy |
| /api/voice-token | GET | Voice token endpoint |

## n8n Workflows (n8n-workflows/)

| File | Purpose | API Keys Needed |
|------|---------|-----------------|
| yst-price-tracker.json | Live price monitoring | None (DexScreener public) |
| whale-alert-monitor.json | Large tx alerts | None (public RPC) |
| new-holder-welcome.json | New holder notifications | None (public RPC) |
| twitter-raid-tracker.json | Twitter mention tracking | Twitter Bearer token |

## Deployment

- **Every push to main auto-deploys** to yakkstudios.xyz via Vercel (~60s)
- **Build MUST stay GREEN** — run `npx next build` before pushing
- **Never push broken builds** — the site is live

## Environment Variables

See `.env.example` for required vars:
- `HELIUS_API_KEY` — Solana RPC (rotated in commit 991e556)
- `ANTHROPIC_API_KEY` — Claude proxy
- `NEXT_PUBLIC_*` — Client-side config

## Security Notes

- Helius API key was rotated (commit 991e556)
- /api/ai requires wallet verification
- Token gating is client-side by design (not a security boundary)
- Use `shyfts` alias publicly, never legal name

## Pending Work (Priority Order)

1. **n8n webhook fallback** — /api/stats should try n8n webhook first, fall back to DexScreener
2. **Whale feed API** — /api/whale-feed.ts to receive + display whale alerts in Alerts.tsx
3. **SEO completion** — create /public/og-image.png, add JSON-LD structured data, generate sitemap
4. **holders.ts automation** — daily script to refresh holder balances from Helius/RPC
5. **Visual QA pass** — compare each section against HTML original on mobile + desktop
6. **FlipBlock** — potential YST Trusted addition (CA not yet provided)

## Multi-Agent Context

This repo is maintained by a multi-agent team:
- **Claude** (Anthropic) — Primary developer, DApp features, security
- **Perplexity Computer** — Sprint execution, bulk porting, infrastructure, research
- **Gemini** (Google) — QA auditing, code review, architecture review
- **Grok** (xAI) — Content generation, image/video assets, alternative perspectives

When working on this repo, check this file first. If unsure about architecture decisions, check the commit history and CHANGELOG-2026-03-28.md.

## Empire Context

This DApp is one of 5 verticals in the YAKK Studios empire:
1. **AI Services Agency** — Revenue engine, target £10K MRR by Q3 2026
2. **DeFi Platform + $YST Token** — This repo
3. **Multi-Agent AI Orchestration** — Grok + Claude + Gemini + Perplexity
4. **GitHub Archive** — 1000+ curated repos for deployment
5. **Personal Wealth Strategy** — Separated from company

Full context: See Notion Command Center at https://www.notion.so/332a2edd87348141833cdd2026c6bc35

## Self-Improving Loop (Mandatory Protocol)

Every agent working on this repo MUST follow this compound-learning protocol. Static rules don't scale — this CLAUDE.md should get smarter with every session.

### BEFORE each task
1. **Audit recent learnings** — scan the Fatal Error Prevention section and the last commit messages. Ask: "what broke last time and why?"
2. **Form a hypothesis** — before writing code, state your approach in one sentence. Example: "I'll add X by Y pattern to avoid the Z failure mode we hit before."
3. **Check section status table** — confirm which sections are locked vs. active before touching any component.

### AFTER each task
1. **Stress-test your output** — mentally run the JSX Fragment check, the API fallback check, and the determinism check against what you just wrote.
2. **Extract the insight** — if you caught something, fixed something, or learned something non-obvious, add it to Fatal Error Prevention below.
3. **Lock in the rule** — one concrete, testable rule. Not "be careful with fragments" — write "If `{condition && (` contains more than one child, wrap in `<>...</>`."

### Fatal Error Prevention (self-updating)

Add new rules here as they're discovered. Never delete old ones.

| # | Rule | Trigger |
|---|------|---------|
| 1 | `{condition && (<>...</>)}` required whenever multiple JSX siblings exist inside a conditional render | Vercel build failures |
| 2 | `Gini > 0.85` = High Risk, `< 5 holders` = High Risk — hardcoded thresholds, no ML | Forensics reliability |
| 3 | All Helius RPC calls must have `try/catch` with `DATA_UNAVAILABLE` fallback — never throw to the UI | Runtime crashes |
| 4 | `revalidate = 30` on all `/api/*` routes that call external APIs — prevents cold-start hammering | Rate limits / cost |
| 5 | Token mint addresses are case-sensitive in comparisons — always `.toLowerCase()` both sides | Silent data mismatches |
| 6 | Never read, expose, or reference `.env` / `.env.local` — rotate keys immediately if leaked | Security |
