# YAKK Studios — Site Hold Toggle

**Purpose:** put the live yakkstudios.xyz dApp into a quiet maintenance window without touching the codebase each time.

## Files involved

- `app/paused/page.tsx` — the hold screen shown to visitors.
- `middleware.ts` — checks `SITE_PAUSED` env var and redirects traffic to `/paused` when set.

## Turn the hold ON

1. Vercel → Project → Settings → Environment Variables. Add:
   - Key: `SITE_PAUSED`
   - Value: `true`
   - Environment: **Production** (and Preview, if you want previews paused too).
2. Redeploy (push any commit, or "Redeploy" the latest deployment from Vercel UI).
3. Every page request (except the allowlist below) will 307-redirect to `/paused`.

## Turn the hold OFF

1. Delete the `SITE_PAUSED` env var, or set it to `false`.
2. Redeploy.
3. Normal routing and the `yst_access` token gate resume.

## What stays reachable while paused

Middleware keeps these paths alive so previews, favicons and basic integrations don't break:

- `/paused`
- `/_next/*`
- `/favicon.ico`, `/apple-icon*`, `/icon*`
- `/robots.txt`, `/sitemap.xml`
- `/api/price`, `/api/stats`

Add more allowlisted paths by editing `HOLD_ALLOWLIST` in `middleware.ts`.

## How the token gate interacts

When `SITE_PAUSED=true`, the hold redirect fires first, so the token-gated routes (`/dashboard`, `/screener`, `/terminal`, etc.) also resolve to `/paused`. You don't need to turn the gate off separately.

When `SITE_PAUSED` is unset or false, middleware falls through to the normal `yst_access` cookie check for those routes — unchanged behaviour.

## Copy on the hold screen

Intentionally vague: "Temporarily offline · back shortly · $YST holdings and on-chain positions unaffected." No project names, timelines or figures. Update by editing `app/paused/page.tsx` — it's a pure React component using the project's CSS vars (`--bg`, `--pink`, `--gold`, etc.), so it inherits the brand automatically.
