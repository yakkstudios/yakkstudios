# YAKK Studios Changelog — 2026-03-28

## DApp Updates (yakkstudios.xyz)

### Screener.tsx — Major Update (Claude)
- **Added**: StreamLock ($LOCK) to YST Trusted list
  - CA: `FNhcY1cwQvQqaM8CUjXSuoGKJniwC4maBRLqNRLipump`
  - Emoji: lock, Price: $0.0426, 24h: +2.63%
- **Removed**: BONK (id:4), JTO (id:6) — identified as extraction factories
- **Removed**: MICHI (id:7), Peaky Sol (id:8) — removed from new pairs
- **Renamed**: "YAKK" filter label to "YST TRUSTED"
- **Changed**: Token badge from "YAKK" to "YST" checkmark
- Token count: 8 → 5 (YST, SPT, LOCK, SOL, WIF)

### Predictions.tsx — Build Fix (Claude)
- Clean re-injection to fix Vercel build error from previous session
- No functional changes — same prediction markets, YAKKAI chat, YST price predictions
- Build status: GREEN (succeeded with peer dep warnings only)

### Full Section Cleanup Sprint — 15 Sections Ported (Perplexity)
All 15 remaining sections rewritten from monolithic HTML (`index.html`) to individual React/Next.js TSX components. Each component matches the HTML visual reference, uses the design system CSS classes, and follows the standard `Props` interface (`walletConnected`, `ystBalance`, `onNavigate`).

#### globals.css — Design System Sync
- **Added** 20+ missing CSS classes that were only in the HTML: `sec-eyebrow`, `card-sm`, `grid2`, `grid3`, `grid4`, `stat-card`, `slbl`, `sval`, `ssub`, `prog-bar`, `prog-fill`, `btn-pink`, `btn-outline`, `field-inp`, `field-lbl`, `field-sel`, `warn-bar`, `mode-pill`, `chat-msgs`
- **Added** responsive breakpoints for new grid/card classes (768px)
- **Updated** `sec-bar` to gradient style matching HTML (`linear-gradient(90deg, pink, gold)`)
- **Updated** `sec-title` font-size to `clamp(26px, 3vw, 44px)` matching HTML
- Commit: `7a21b0f`

#### page.tsx — Bridge Integration
- **Added** `Bridge` import and `'bridge'` to `SectionId` union type
- **Added** Bridge render slot in section list
- **Added** `bridge: 'Bridge'` to page title map
- Commit: `0a26a4c`

#### lib/constants.ts — Nav + Gating Updates
- **Added** `'bridge'` and `'alerts'` to `GATED_SECTIONS` set
- **Added** Bridge nav item (🌉 BRIDGE) to TRADING section
- **Updated** Alerts nav item to `gated: true`
- Commit: `75c9501`

#### Tier 1 — Revenue/Core Features
| Component | Lines | Key Changes | Commit |
|-----------|-------|-------------|--------|
| **Wallet.tsx** | 155 | Rewrote to match HTML: sec-eyebrow "08 — PROFILE", connect wallet card with 👛, grid2 stat-cards ($YST STAKED, WL STATUS), portfolio card on connect, WL eligibility checklist, 3333 NFT pieces note, progress bar + Jupiter link | `db786c1` |
| **Portfolio.tsx** | 153 | Rewrote: sec-eyebrow "YOUR HOLDINGS", connect notice, 4-stat summary grid, holdings list with live ystBalance, recent transactions, Birdeye/Solscan links | `f55cbeb` |
| **OtcDesk.tsx** | 145 | Rewrote: sec-eyebrow "PEER-TO-PEER", two-column POST ORDER form + OPEN ORDERS panel, desk pulse indicator, escrow protection notice | `4a7c96e` |
| **Launchpad.tsx** | 182 | Rewrote: sec-eyebrow "YAKK VENTURES", SUBMIT PROJECT form + ACTIVE LAUNCHES panel with mock data (YAKK Studios 73% LIVE, YakkBlinders 12% PENDING) | `7996743` |
| **YieldFinder.tsx** | 200 | Rewrote: sec-eyebrow "MULTICHAIN", chain + type filters, 6 yield cards from HTML (Raydium 847%, Marinade 7.2%, Kamino 12.4%, Orca 34%, PancakeSwap 28%, Uniswap 18%), DYOR disclaimer | `e4083e7` |

#### Tier 2 — Community/Engagement
| Component | Lines | Key Changes | Commit |
|-----------|-------|-------------|--------|
| **Raids.tsx** | 143 | Rewrote: sec-eyebrow "07 — RAID HUB", grid2 with DAILY TARGETS + LEADERBOARD, LOG YOUR RAID input with XP tracking, YOUR STATS box | `4720295` |
| **Coach.tsx** | 130 | Rewrote: ✦ CLAUDE + GROK SOON badges, 4 mode pills (DISCIPLINE/RAID STRATEGIST/RISK OFFICER/YAKK LORE), chat-msgs container, quick command buttons | `d539e06` |
| **ArtLab.tsx** | 183 | Rewrote: PROMPT BUILDER with locked prefix, SCENE/STYLE selects, 5 MJ REFERENCE PROMPTS, copy + share buttons | `d6f3a4d` |
| **Raffle.tsx** | 209 | Rewrote: sec-eyebrow "YAKK — NFT RAFFLE ENGINE", raffle create form (NFT name, ticket price, max tickets, datetime, wallet), 0.05 SOL setup fee | `64343e5` |
| **Alerts.tsx** | 141 | Rewrote: sec-eyebrow "NOTIFICATIONS", two-column CREATE ALERT + ACTIVE ALERTS, browser notification permission, per-alert delete buttons | `f261a76` |

#### Tier 3 — Utility/Info
| Component | Lines | Key Changes | Commit |
|-----------|-------|-------------|--------|
| **Bridge.tsx** | 233 | **NEW FILE**: sec-eyebrow "CROSS-CHAIN", from/to chain selectors, amount input with mock quote, 4 aggregator grid (deBridge, Wormhole, Allbridge, Mayan), token gate | `8da4d36` |
| **TokenCreator.tsx** | 291 | Rewrote: sec-eyebrow "ANTI-PUMP ANTI-RUG", full application form, YAKK vs Pump.fun comparison grid, requirements checklist, recently approved panel | `aecbc71` |
| **TgBot.tsx** | 195 | Rewrote: sec-eyebrow "AI-POWERED", bot config form, Safety Rails card, bot preview panel, Telegram notification mock with BUY/SKIP buttons | `7d26b38` |
| **Features.tsx** | 171 | Rewrote: sec-eyebrow "COMMUNITY DRIVEN", submit form with category select, voteable feature list sorted by votes, 4 seeded items | `e59d77d` |
| **Privacy.tsx** | 178 | Rewrote: sec-eyebrow "STEALTH MODE", 3-card overview (Anti Copy-Trade, Wallet Unlinking, MEV Protection), Private Transfer form with hops/timing, legal disclaimer | `57e8376` |

### Vercel Deployment
- Latest deploy triggered by commit `57e8376` (Privacy.tsx — final file in sprint)
- Previous known-good deploy: `dpl_Dbeoyji23Hex3NS4aQBL7Sho3Sm7` (Predictions re-inject)
- Build was GREEN locally before push (`next build` succeeded)
- Auto-deploy: GitHub push to main → Vercel builds → yakkstudios.xyz

## Architecture Summary (Current State)

### Component Status — ALL 32 SECTIONS PORTED
Every section is now a standalone React/TSX component under `components/sections/`:

| Status | Sections |
|--------|----------|
| **Claude-built** | Home, Screener, Terminal, Predictions, Services |
| **Previously confirmed** | Update, Trusted, Clowns, YakkTrader, Cabal, NftMarket, StakePoint, News, Members, WhaleClub, Ledger, Whitepaper, Wren |
| **Perplexity sprint** | Wallet, Portfolio, OtcDesk, Launchpad, YieldFinder, Raids, Coach, ArtLab, Raffle, Alerts, Bridge (NEW), TokenCreator, TgBot, Features, Privacy |

### Design System CSS (globals.css)
All CSS classes from the monolithic HTML are now properly defined in `app/globals.css`:
- Layout: `sec-pad`, `sec-eyebrow`, `sec-title`, `sec-bar`, `sec-header`, `sec-sub`
- Grids: `grid2`, `grid3`, `grid4`
- Cards: `card`, `card-sm`, `stat-card` + sub-labels (`slbl`, `sval`, `ssub`)
- Buttons: `btn-primary`, `btn-pink`, `btn-gold`, `btn-green`, `btn-ghost`, `btn-outline`, `btn-sm`, `btn-xs`
- Badges: `badge`, `b-dim`, `b-pink`, `b-green`, `b-gold`, `b-blue`, `b-red`
- Forms: `inp`, `field-inp`, `field-lbl`, `field-sel`
- Utility: `prog-bar`, `prog-fill`, `warn-bar`, `mode-pill`, `chat-msgs`
- Responsive: grid collapse at 768px, stat-card padding adjustment

### Token Gating (constants.ts)
```
GATED_SECTIONS = screener, terminal, cabal, yakktrader, predictions, coach,
  tgbot, update, artlab, raids, launchpad, otcdesk, yieldfinder,
  portfolio, privacy, tokencreator, ledger, members, whaleclub,
  bridge, alerts
```
- Standard gate: 250,000 $YST
- Whale gate: 10,000,000 $YST (whaleclub only)

### Nav Structure (constants.ts)
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

## Archive Updates
- Updated `PERPLEXITY-INSTRUCTIONS.md` — marked Screener/Terminal/Predictions as DONE, added current status section
- Created `PROMPT-PERPLEXITY-CleanupSprint.md` — section porting instructions for 15 remaining sections
- Created `PROMPT-GROK-CleanupSprint.md` — real-time data, content, competitive intel, n8n planning
- Created `PROMPT-GEMINI-CleanupSprint.md` — QA audit, code review, architecture review, coordination

## Pending / Next Steps
- **Verify Vercel deploy** — check https://yakkstudios.xyz that all sections render correctly
- **FlipBlock**: Jay mentioned as potential YST Trusted addition, CA not yet provided
- **Bridge nav in Sidebar**: Bridge is in constants.ts NAV but verify it renders in sidebar correctly
- **Peer dependency cleanup**: qrcode.react, react-qr-reader, react-native warnings remain
- **holders.ts**: May need daily CSV update for new holders
- **Visual QA pass**: Compare each ported section against the HTML original on mobile + desktop
- **Live API connections**: Currently all sections use mock/static data — future work to connect real APIs (DexScreener, Jupiter, etc.)
