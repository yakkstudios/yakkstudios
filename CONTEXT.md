# YAKK Studios — Session Context

## Project Overview
- **Site**: https://yakkstudios.xyz
- **GitHub**: https://github.com/yakkstudios/yakkstudios (branch: main)
- **Vercel project**: prj_VXC5Dla2BWSMBql83Lib4gw59QFt (team: team_mvZM9oPZGfv3JZ4yNIgzff1g)
- **Auto-deploy**: GitHub push to main → Vercel builds and deploys yakkstudios.xyz

## Stack
- Single-file SPA: index.html (515-524KB)
- Solana dapp using @solana/web3.js@1.98.0
- Fonts: Syne + Space Mono (Google Fonts)
- No build step — plain HTML/CSS/JS, deployed as static site on Vercel

## Key Tokens
- **$YST** (YAKK Supremacy Token) — Meteora DBC pool on Solana
- **$SPT** (Supremacy Token)
- YST gate threshold: 250,000 $YST

## Completed Fixes (this session pair)

### 1. web3.js CDN Fallback (commit 5905a5b)
- unpkg.com was returning 503 for @solana/web3.js@1.98.0
- Added onerror fallback to jsdelivr CDN on script tag (line ~73)
```html
<script src="https://unpkg.com/@solana/web3.js@1.98.0/lib/index.iife.min.js"
  onerror="this.onerror=null;this.src='https://cdn.jsdelivr.net/npm/@solana/web3.js@1.98.0/lib/index.iife.min.js'"></script>
```

### 2. YST Gate Expanded (commit 5905a5b)
- Added 'coach' and 'tgbot' to GATED_SECTIONS array (~line 4608)
```js
const GATED_SECTIONS = ['screener','terminal','cabal','yakktrader','predictions','coach','tgbot'];
```
- Gate threshold: YST_GATE = 250000 (250k $YST required)
- updateGates() injects .yst-gate-overlay on gated sections when wallet not holding enough

### 3. Mobile Polish (commit 295764f)
- Added to @media(max-width:768px) block in index.html:
  - Hide scrollbars on #main and #dex-banner (webkit + scrollbar-width:none)
  - overscroll-behavior-y:contain on #main (prevents iOS bounce page jump)
  - iOS safe-area padding on #section-home .sec-pad

## Mobile Layout Architecture
- Breakpoints: 768px (mobile) and 480px (small mobile)
- #mobile-header: fixed 48px bar with hamburger (☰), $YAKK STUDIOS brand, 🔗 WALLET
- #sidebar: fixed slide-out overlay (left:-240px → 0 when .mob-open)
- #sb-overlay: dim backdrop when sidebar open
- #main-wrap: height:calc(100vh - 48px), flex column container
- Grid collapse: .grid4 → 2 columns, .grid2 → 1 column
- Hero: flex-direction:column (text above, image below)
- Stat cards: auto-fill minmax(148px,1fr) → naturally 2 columns at 390px

## YST Gate System
```js
const YST_GATE = 250000;
const GATED_SECTIONS = ['screener','terminal','cabal','yakktrader','predictions','coach','tgbot'];
// ystGated = true when wallet holds >= 250k YST
// updateGates() called on wallet connect/disconnect
// injects .yst-gate-overlay div over gated sections
```

## GitHub Web Editor Notes (hard-won knowledge)
- File is 515-524KB — do NOT use execCommand('selectAll') + insertText on full content → tab freezes permanently
- CodeMirror 6 Find & Replace: open with physical Ctrl+F keypress (NOT Ctrl+H — types 'h' into editor)
- Replace All works for single-line string replacements without regex needed
- After Replace All, Commit changes... button → fill message → Commit changes (green button)
- GitHub session cookies work for reading but NOT for api.github.com writes (CORS issue)
- resize_window MCP tool doesn't change actual viewport in this VM (screen is fixed 1536px)

## Vercel Deployment History (recent)
| Deployment ID | Status | Commit |
|---|---|---|
| dpl_7N1inW8wXtqaLgkNbSEfeLXjefpV | READY ✓ | Polish: hide mobile scrollbars (295764f) |
| dpl_Boi4DWFzezYLSZVByVm7Kn75toRj | READY | Fix: web3.js CDN fallback + YST gate (5905a5b) |

## Current Production State (2026-03-21)
- yakkstudios.xyz is live and READY on Vercel
- web3.js loads from unpkg with jsdelivr fallback → "SOL online" status
- YAKKAI Coach (section-coach) and TG Trade Bot (section-tgbot) require 250k $YST
- Mobile view: clean responsive layout with hamburger menu, slide-out sidebar
- All 7 sections gated: screener, terminal, cabal, yakktrader, predictions, coach, tgbot
