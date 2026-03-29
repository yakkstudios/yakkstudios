# Gemini Pro — YAKK Studios DApp QA Audit

## Your Role
You are performing a comprehensive quality audit of https://yakkstudios.xyz — a Solana DeFi token-gated DApp built with Next.js 14, TypeScript, React 18. Deployed on Vercel.

## What to Audit

### 1. Live Site Visual QA
Visit https://www.yakkstudios.xyz and check:
- [ ] Home page loads without errors
- [ ] Stat cards show LIVE $YST price (should be ~$0.000001784, NOT "—" or "Fetching...")
- [ ] Ticker bar at the top shows $YST price and 24h change
- [ ] Sidebar navigation works — click through ALL sections
- [ ] Token gate overlay appears on gated sections when wallet not connected (should show 🔒 icon + "Connect your wallet and hold 250,000+ $YST")
- [ ] Mobile responsive — check at 390px width
- [ ] No console errors (open DevTools → Console)

### 2. API Endpoints
Test these endpoints and verify responses:
- `GET https://www.yakkstudios.xyz/api/price` → should return JSON with price, change24h, volume24h, liquidity, marketCap
- `GET https://www.yakkstudios.xyz/api/holders` → should return JSON with holders count

### 3. Section-by-Section Check
Navigate to each section via sidebar and verify it renders properly:

**OVERVIEW**: Home, YAKK News, AI Services
**TRADING**: Screener (should show live YST price), Terminal, Predictions, OTC Desk, Price Alerts, Bridge
**YAKK AI**: AI Trader, YAKKAI Coach, Cabal Investigator
**RESEARCH**: Trusted List, Portfolio, Certified Clowns
**DEFI**: StakePoint, Yield Finder, YAKK Ventures, NFT Market, NFT Raffle
**CREATE**: Token Creator, Art Lab, TG Trade Bot, Privacy Router, Update Token
**COMMUNITY**: Raid Hub, Feature Requests, Saving The Wren
**ACCOUNT**: Profile, Members, Whale Club, Rug Ledger, Whitepaper

For EACH section check:
- Does it render without blank white screen?
- Does it show the correct sec-eyebrow / sec-title / sec-bar pattern?
- Do buttons/inputs look styled correctly (not unstyled HTML)?
- Are forms functional (inputs accept text, selects work, buttons respond)?

### 4. SEO & Meta Tags
Check:
- [ ] Page title updates when switching sections (should be "[Section] | $YAKK Studios")
- [ ] OpenGraph tags present (view source → search for og:)
- [ ] Twitter card meta tags present
- [ ] Canonical URL set
- [ ] favicon loads

### 5. Performance
- [ ] First Contentful Paint under 2s
- [ ] No layout shift issues
- [ ] Images/assets loading correctly (check for broken yakk-logo.png, og-image.svg)

### 6. Security Headers
Check response headers for:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY or SAMEORIGIN
- Strict-Transport-Security

## Report Format
For each issue found, report:
```
SEVERITY: Critical / Major / Minor / Suggestion
SECTION: [section name]
ISSUE: [description]
FIX: [suggested fix]
```

## Key Context
- GitHub repo: https://github.com/yakkstudios/yakkstudios
- YST Mint: jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV
- 32 sections total, all gated sections require 250K $YST
- CSS design system uses classes: sec-pad, sec-eyebrow, sec-title, sec-bar, card, card-sm, stat-card, grid2-4, btn-pink/gold/outline/ghost, badge, slbl/sval/ssub
