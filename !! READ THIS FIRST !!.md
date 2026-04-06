# YAKK STUDIOS — GitHub Upload Guide
**Last updated: 2026-04-07**

---

## 🚨 STEP 1 — FIX THE BUILD (push these TWO files first, nothing else)

The build is failing with: `EEXIST: symlink 'voice-token.func' → '/vercel/output/functions/api/stats.func'`

Push these two files to the **GitHub root** — Vercel will auto-deploy and the build will pass:

```
next.config.mjs   →  GitHub root (replaces existing)
package.json      →  GitHub root (replaces existing — adds tweetnacl dep)
```

`next.config.mjs` adds `experimental: { serverComponentsExternalPackages: ['livekit-server-sdk'] }`
which tells Next.js 14.2.x NOT to bundle livekit — fixing the bundle dedup collision.

---

## 🔐 STEP 2 — Token Gate (push together as one commit)

| File | Where | What |
|------|-------|------|
| `app/api/gate-check/route.ts` | `app/api/gate-check/route.ts` | ⭐ UPGRADED — signature verification + tiered access |
| `app/locked/page.tsx` | `app/locked/page.tsx` | ⭐ NEW — wallet connect + signing flow UI |
| `middleware.ts` | root | Protects 10 gated routes via `yst_access` cookie |

**What's new in gate-check (v2):**
- Requires ed25519 signature proof — closes wallet-spoofing attack (anyone could previously call gate-check with a whale's pubkey and get a cookie)
- Nonce + timestamp replay protection — 2-minute sliding window
- Tiered access: HOLDER (250K+ $YST) and WHALE (10M+ $YST)
- Sets `yst_tier` cookie (non-httpOnly) so client UI can read current tier
- Dev wallet bypass via `DEV_WALLETS` env var
- Cookie TTL upgraded from 10 min → 1 hour
- Now uses `uiAmount` (display units) for tier comparison — matches constants.ts directly

**New env vars to add in Vercel dashboard:**
- `HELIUS_API_KEY` — your Helius API key
- `YST_MINT` — `jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV`
- `DEV_WALLETS` — `7CsMUvuHub7dVTeVij8S5baWNHnNDwS2yqyv4ZYQKV9n` (comma-separated list)
- `NEXT_PUBLIC_APP_URL` — `https://yakkstudios.vercel.app`

---

## ⚖️ STEP 3 — Legal Pages (investor audit items)

| File | Where | What |
|------|-------|------|
| `app/terms/page.tsx` | `app/terms/page.tsx` | ⭐ NEW — full Terms of Service at /terms |
| `app/privacy/page.tsx` | `app/privacy/page.tsx` | ⭐ NEW — full Privacy Policy at /privacy |

Terms covers: no financial advice, token-gate terms, wallet security, IP, prohibited conduct, limitation of liability, England & Wales jurisdiction.

Privacy covers: minimal data collection (wallet address only for balance check), httpOnly session cookie, no tracking, Helius/DexScreener/Vercel third parties, GDPR rights.

---

## 📁 STEP 4 — Components (push together)

```
components/ErrorBoundary.tsx
components/Sidebar.tsx
components/TickerBar.tsx
components/sections/Alerts.tsx
components/sections/Clowns.tsx
components/sections/Features.tsx
components/sections/Home.tsx
components/sections/Launchpad.tsx
components/sections/NftDrop.tsx
components/sections/NftMarket.tsx
components/sections/Portfolio.tsx
components/sections/Raffle.tsx
components/sections/Screener.tsx         ← sandbox removed, live pair address
components/sections/Services.tsx         ← Deep Cabal = 1 SOL
components/sections/Terminal.tsx         ← full rewrite, LOCK added
components/sections/TokenCreator.tsx
components/sections/Wallet.tsx
components/sections/Wren.tsx
```

**Also push:**
```
lib/constants.ts
```

---

## 🖼 STEP 5 — Public assets (upload via GitHub UI)

```
public/yst-logo.jpg
public/yst-banner.jpg
public/lock-logo.jpg
public/lock-banner.jpg
public/spt-logo.jpg
public/spt-banner.jpg
public/sol-logo.png
public/sol-banner.png
public/yakk-y.jpg
```

---

## ✅ Already in GitHub — don't re-upload

```
app/api/stats/route.ts
app/api/price/route.ts
app/api/ticker/route.ts
app/api/whale-feed/route.ts
app/api/voice-token/route.ts
app/api/screener/route.ts
```
