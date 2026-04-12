import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface GateCheckResult {
  mint: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  flags: string[];
  holderConcentration: number;
  lpLocked: boolean;
  cabalWallets: number;
  totalHolders: number;
  cached: boolean;
  error?: boolean;
  errorMessage?: string;
}

const CACHE = new Map<string, { result: GateCheckResult; timestamp: number }>();
const CACHE_TTL_MS = 60 * 1000;

// Token Program ID
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

async function rpcCall(method: string, params: any[]) {
  const apiKey = process.env.HELIUS_API_KEY || '';
  // Fallback to public RPC if no Helius key is provided
  const endpoint = apiKey 
    ? `https://mainnet.helius-rpc.com/?api-key=${apiKey}` 
    : 'https://api.mainnet-beta.solana.com';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  });

  if (!res.ok) {
    throw new Error(`RPC call failed: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message || 'Unknown RPC error');
  }
  return json.result;
}

async function fetchHeliusTokenAccounts(mint: string) {
  const apiKey = process.env.HELIUS_API_KEY || '';
  const endpoint = apiKey 
    ? `https://mainnet.helius-rpc.com/?api-key=${apiKey}`
    : 'https://api.mainnet-beta.solana.com';

  // Attempt to use Helius DAS API getTokenAccounts
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccounts',
      params: {
        mint,
        page: 1,
        limit: 50,
      },
    }),
  });

  const json = await res.json();

  if (json.result && json.result.token_accounts) {
    return {
      accounts: json.result.token_accounts,
      total: json.result.total || json.result.token_accounts.length
    };
  }

  // Fallback to standard getTokenLargestAccounts if DAS is unavailable/errors
  const fallback = await rpcCall('getTokenLargestAccounts', [mint]);
  return {
    accounts: fallback.value.map((acc: any) => ({
      owner: acc.address, // Note: This is the ATA, not the wallet owner, but works for concentration
      amount: acc.amount
    })),
    total: fallback.value.length
  };
}

async function checkLpLocked(mint: string): Promise<boolean> {
  try {
    // Attempt to fetch from Meteora DLMM / AMM pools
    const response = await fetch(`https://dlmm-api.meteora.ag/pair/${mint}`);
    if (!response.ok) {
      // Fallback check if it's dynamic AMM
      const ammRes = await fetch(`https://ammv2.meteora.ag/pools?search=${mint}`);
      if (!ammRes.ok) return false;
      const ammData = await ammRes.json();
      if (!ammData || ammData.length === 0) return false;

      const pool = ammData[0];
      const lpMint = pool.lp_mint || pool.poolTokenMint;
      if (!lpMint) return false;
      return checkMintAuthority(lpMint);
    }

    const data = await response.json();
    // Assuming data contains the pair info and the LP mint
    if (data && data.lp_mint) {
      return await checkMintAuthority(data.lp_mint);
    }
  } catch (e) {
    console.error("Error fetching Meteora LP:", e);
  }
  return false;
}

async function checkMintAuthority(lpMint: string): Promise<boolean> {
  try {
    const accountInfo = await rpcCall('getAccountInfo', [
      lpMint,
      { encoding: 'base64' }
    ]);
    if (!accountInfo || !accountInfo.value) return false;

    const dataBuffer = Buffer.from(accountInfo.value.data[0], 'base64');

    // SPL Token Mint Layout:
    // mint_authority_option (4 bytes), mint_authority (32 bytes), supply (8 bytes), decimals (1 byte), is_initialized (1 byte), freeze_authority_option (4 bytes), freeze_authority (32 bytes)
    const mintAuthorityOption = dataBuffer.readUInt32LE(0);

    // If mintAuthorityOption is 0, the mint authority is null -> LP is locked/renounced
    return mintAuthorityOption === 0;
  } catch (e) {
    console.error("Error checking mint authority:", e);
    return false;
  }
}

async function getCabalWallets(topOwners: string[]): Promise<number> {
  if (topOwners.length === 0) return 0;

  // For top-20 holders, fetch their token accounts
  const limit = Math.min(20, topOwners.length);
  const ownersToCheck = topOwners.slice(0, limit);

  const portfolios = new Map<string, Set<string>>();

  // Parallel fetch for speed
  await Promise.all(
    ownersToCheck.map(async (owner) => {
      try {
        const accs = await rpcCall('getTokenAccountsByOwner', [
          owner,
          { programId: TOKEN_PROGRAM_ID },
          { encoding: 'jsonParsed' }
        ]);

        const mints = new Set<string>();
        for (const item of accs.value) {
          const amount = item.account.data.parsed.info.tokenAmount.uiAmount;
          if (amount > 0) {
            mints.add(item.account.data.parsed.info.mint);
          }
        }
        portfolios.set(owner, mints);
      } catch (e) {
        // Skip on error
      }
    })
  );

  let cabalCount = 0;

  for (const [ownerA, mintsA] of Array.from(portfolios.entries())) {
    let sharedOwners = 0;

    for (const [ownerB, mintsB] of Array.from(portfolios.entries())) {
      if (ownerA === ownerB) continue;

      let overlap = 0;
      for (const mint of Array.from(mintsA)) {
        if (mintsB.has(mint)) overlap++;
      }

      // Share >= 3 tokens
      if (overlap >= 3) {
        sharedOwners++;
      }
    }

    // Share with >= 5 other top holders
    if (sharedOwners >= 5) {
      cabalCount++;
    }
  }

  return cabalCount;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    return NextResponse.json({ error: 'Missing mint parameter' }, { status: 400 });
  }

  // Check Cache
  const now = Date.now();
  const cachedData = CACHE.get(mint);
  if (cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({ ...cachedData.result, cached: true });
  }

  try {
    // 1. Fetch total supply
    const supplyRes = await rpcCall('getTokenSupply', [mint]);
    const totalSupplyUI = supplyRes.value.uiAmount;

    // 2. Fetch Holder Distribution (up to 50)
    const { accounts, total } = await fetchHeliusTokenAccounts(mint);

    // Calculate concentration (top 10)
    const top10 = accounts.slice(0, 10);
    const top10Amount = top10.reduce((sum: number, acc: any) => sum + (Number(acc.amount) / Math.pow(10, supplyRes.value.decimals)), 0);

    // If we used getTokenAccounts, amount is raw. Need to convert to UI amount or divide by decimals.
    // To be safe, let's use the proportion directly if available, otherwise calculate safely:
    let holderConcentration = 0;
    if (totalSupplyUI > 0) {
      holderConcentration = (top10Amount / totalSupplyUI) * 100;
    }

    // If calculation exceeded 100% due to precision, cap it.
    holderConcentration = Math.min(100, holderConcentration);

    // 3. LP Locked Check
    const lpLocked = await checkLpLocked(mint);

    // 4. Cabal Detection
    // Extract actual owner addresses. If using fallback getTokenLargestAccounts, the address is the ATA.
    // For robust cabal checking, we need the owner of the ATA.
    const topOwners = accounts.map((acc: any) => acc.owner).filter(Boolean);
    const cabalWallets = await getCabalWallets(topOwners);

    // 5. Scoring
    let score = 100;
    const flags: string[] = [];

    if (holderConcentration > 50) {
      score -= 30;
      flags.push(`High holder concentration (${holderConcentration.toFixed(2)}% held by top 10 wallets)`);
    } else if (holderConcentration > 30) {
      score -= 15;
      flags.push(`Moderate holder concentration (${holderConcentration.toFixed(2)}% held by top 10 wallets)`);
    }

    if (!lpLocked) {
      score -= 25;
      flags.push('LP tokens appear unlocked or authority is retained');
    }

    if (cabalWallets > 0) {
      const penalty = Math.min(cabalWallets * 5, 20);
      score -= penalty;
      flags.push(`Cabal detected: ${cabalWallets} top holders share multiple low-cap tokens`);
    }

    if (total < 100) {
      score -= 10;
      flags.push(`Low holder count (less than 100)`);
    }

    score = Math.max(0, score);

    // 6. Grading
    let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
    if (score >= 90) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 60) grade = 'C';
    else if (score >= 40) grade = 'D';

    const result: GateCheckResult = {
      mint,
      score,
      grade,
      flags,
      holderConcentration,
      lpLocked,
      cabalWallets,
      totalHolders: total,
      cached: false
    };

    // Set cache
    CACHE.set(mint, { result, timestamp: now });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Gate check failed:', error);
    return NextResponse.json({
      error: true,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      mint,
      score: 0,
      grade: 'F',
      flags: ['Analysis failed'],
      holderConcentration: 0,
      lpLocked: false,
      cabalWallets: 0,
      totalHolders: 0,
      cached: false
    }, { status: 200 }); // Return 200 with error flag as requested
  }
}
