# YAKK STUDIOS — BATCH FIX INSTRUCTIONS
# Generated: 2026-04-04 | Session: Claude Sonnet 4.6

## FILES TO COPY → PASTE INTO GITHUB

All files are in: `12_FIXES/ready-to-copy/`
Copy each file to the matching path in your GitHub repo.

---

## 1. components/sections/Terms.tsx
CHANGES:
- Section 10 (Governing Law): England and Wales → Scotland + Portugal
- Footer stamp: England & Wales → Scotland, UK & Portugal
- Contact email: hello@yakkstudios.xyz → shyfts@yakkstudios.xyz
- Last updated date: March 2026 → April 2026

## 2. components/sections/Trusted.tsx
CHANGES:
- Full rewrite — removed Murad, Ansem, Cobie, Gainzy, InverseBrah, Kook Capital
- Only ZachXBT and 0xfoobar remain (genuine track record, no direct interaction needed)
- List now framed as @shyfts_-curated, real engagement only
- Nominate link now points to @shyfts_ not @YAKKStudios
- CRITICAL BUG FIX: locked-overlay now uses early return pattern — content no longer leaks

## 3. components/sections/Update.tsx
CHANGES:
- CRITICAL BUG FIX: whale gate was CSS-only (content leaked through)
- Now uses early return pattern — zero content renders for non-whale wallets
- Updated version counter: 27 → 32 sections, Mar 2025 → Apr 2026

## 4. components/sections/Portfolio.tsx
CHANGES:
- CRITICAL BUG FIX: removed duplicate `const hasAccess` (TypeScript/Vercel error)
- Gate now correctly requires 10M+ YST (whale-only)
- Now uses early return pattern — content fully blocked for non-whales

## 5. components/sections/Wallet.tsx (Profile)
CHANGES:
- Added Discord link card with OAuth2 flow (requires NEXT_PUBLIC_DISCORD_CLIENT_ID env var)
- Added holder community section (messaging teaser + members link)
- Updated WL eligibility to include Discord verification check
- Discord quick link added to footer buttons
- Cleaner isHolder / isWhale naming throughout

## 6. components/MarqueeBanner.tsx (NEW FILE)
- New scrolling ticker banner component
- 18 messages covering key selling points
- Pink/gold/muted colour rotation
- Pure CSS animation (no deps, 60s loop)
- Import in app/page.tsx + place above or below TickerBar

---

## ALSO NEEDED: constants.ts change (do this manually in GitHub editor)

In `lib/constants.ts` (or wherever NAV is defined):
Find:   { id: 'wren', label: 'SAVE THE WREN', icon: '🌱' }
Change to: { id: 'wren', label: 'SAVE THE WREN', icon: '🛡️' }

---

## TO ADD MarqueeBanner to the app:

In `app/page.tsx`, add import at top:
  import MarqueeBanner from '@/components/MarqueeBanner';

Then in the JSX, place it right after <TickerBar ... /> :
  <TickerBar ... />
  <MarqueeBanner />

---

## DISCORD ENV VAR NEEDED:
Add to Vercel environment variables:
  NEXT_PUBLIC_DISCORD_CLIENT_ID = [your Discord app client ID]

Create Discord app at: https://discord.com/developers/applications
Set redirect URI to: https://yakkstudios.xyz/api/discord/callback

---

## COMMIT MESSAGE:
fix: whale gate leak + Terms jurisdiction + Trusted list + Profile Discord + Marquee banner

- Update.tsx: early return gate — content no longer leaks to non-whale wallets
- Portfolio.tsx: remove duplicate const hasAccess (TypeScript error), fix gate
- Trusted.tsx: early return gate + rewrite to @shyfts_ interactions only
- Terms.tsx: Scotland + Portugal jurisdiction, shyfts@ email, April 2026 date
- Wallet.tsx: Discord OAuth2 link card, holder community section, Discord quick link
- MarqueeBanner.tsx: new scrolling ticker with 18 brand messages
- constants.ts: Wren icon 🌱 → 🛡️ (manual edit needed)
