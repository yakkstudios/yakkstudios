# Home.tsx — DEX Banner Live Data Fix

## What's wrong
The stat card section (around line 168-174) already uses `stats?.price` etc. for live data.
But the inline DEX banner (around line 147-153) still has hardcoded em-dashes:
```tsx
['PRICE USD', '—'],
['24H VOLUME', '—'],
['MARKET CAP', '—'],
['LIQUIDITY', '—'],
['BUYS / SELLS', '— / —'],
['HOLDERS', '—'],
```

## Fix
Replace that array with:
```tsx
['PRICE USD', stats?.price ? fmtPrice(stats.price) : '—'],
['24H VOLUME', stats?.volume24h ? fmtNum(stats.volume24h) : '—'],
['MARKET CAP', stats?.marketCap ? fmtNum(stats.marketCap) : '—'],
['LIQUIDITY', stats?.liquidity ? fmtNum(stats.liquidity) : '—'],
['BUYS / SELLS', '— / —'],
['HOLDERS', '—'],
```

Note: Buys/Sells and Holders aren't in the DexScreener response, so they stay as dashes for now unless we add a Helius RPC call.

## Also: Change fetch URL
Home.tsx currently calls `/api/price`. Should call `/api/stats` instead (which has n8n fallback chain).
Line ~66: change `fetch('/api/price')` to `fetch('/api/stats')`
