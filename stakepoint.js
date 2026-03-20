// Vercel serverless function — proxies StakePoint API to avoid CORS
// Route: /api/stakepoint?mint={mintAddress}&type={locks|pool|stats}
// Deployed automatically by Vercel when this file is in /api/

export default async function handler(req, res) {
  // CORS headers so yakkstudios.xyz frontend can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { mint, type = 'locks' } = req.query;

  if (!mint) {
    return res.status(400).json({ error: 'mint parameter required' });
  }

  // Validate mint looks like a Solana address
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) {
    return res.status(400).json({ error: 'invalid mint address' });
  }

  // Map type to StakePoint endpoint
  const endpointMap = {
    locks: `https://stakepoint.app/api/locks/${mint}`,
    pool:  `https://stakepoint.app/api/pools/${mint}`,
    stats: `https://stakepoint.app/api/stats/${mint}`,
  };

  const url = endpointMap[type] || endpointMap.locks;

  try {
    const upstream = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'YAKKStudios/1.0',
      },
    });

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: `StakePoint API returned ${upstream.status}`,
        endpoint: url,
      });
    }

    const data = await upstream.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(502).json({
      error: 'Failed to reach StakePoint API',
      detail: err.message,
    });
  }
}
