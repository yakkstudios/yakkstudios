/**
 * YAKK Studios — X (Twitter) Automation Engine
 * ══════════════════════════════════════════════
 *
 * Features:
 *   1. Scheduled hype posts  — price updates, cult callouts, market signals
 *   2. Payment-triggered rug exposure — someone pays 1 SOL to the investigation
 *      wallet → YAKKAI builds the rug thread → auto-posts to @YAKKStudios
 *   3. Milestone alerts      — market cap, holder count, lock achievements
 *   4. Raid callouts         — tweet when a new raid is active
 *
 * Running modes:
 *   node index.js hype         — post one hype tweet now
 *   node index.js price        — post a price update now
 *   node index.js watch        — watch investigation wallet for 1 SOL payments
 *   node index.js schedule     — run all scheduled jobs (cron)
 *
 * Scheduling (cron):
 *   Price update    — every 6 hours
 *   Hype tweet      — every 12 hours
 *   Holder check    — daily
 *   Payment watcher — runs continuously
 */

require('dotenv').config();
const { TwitterApi }  = require('twitter-api-v2');
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const cron = require('node-cron');

/* ═══════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════ */
const CONFIG = {
  // Twitter API v2 credentials
  // Get from https://developer.twitter.com/en/portal/dashboard
  TWITTER_APP_KEY:        process.env.TWITTER_APP_KEY,
  TWITTER_APP_SECRET:     process.env.TWITTER_APP_SECRET,
  TWITTER_ACCESS_TOKEN:   process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_ACCESS_SECRET:  process.env.TWITTER_ACCESS_SECRET,

  // Anthropic (for AI-generated exposure threads)
  ANTHROPIC_KEY:          process.env.ANTHROPIC_KEY,

  // Solana
  SOLANA_RPC:             process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  INVESTIGATION_WALLET:   '7P7xYDAyeV13vumm8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB',
  EXPOSURE_PAYMENT_SOL:   1.0,  // 1 SOL triggers a rug exposure thread

  // Token mints
  YST_MINT: 'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
  SPT_MINT: '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',

  // DexScreener
  DEX_YST_URL: 'https://api.dexscreener.com/latest/dex/tokens/jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
  DEX_SPT_URL: 'https://api.dexscreener.com/latest/dex/tokens/6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',
};

/* ═══════════════════════════════════════════════
   TWITTER CLIENT
═══════════════════════════════════════════════ */
function getTwitterClient() {
  return new TwitterApi({
    appKey:       CONFIG.TWITTER_APP_KEY,
    appSecret:    CONFIG.TWITTER_APP_SECRET,
    accessToken:  CONFIG.TWITTER_ACCESS_TOKEN,
    accessSecret: CONFIG.TWITTER_ACCESS_SECRET,
  }).readWrite;
}

async function tweet(text) {
  const client = getTwitterClient();
  const result = await client.v2.tweet(text);
  console.log(`[TWEET] Posted: ${text.substring(0, 60)}… (id: ${result.data.id})`);
  return result.data.id;
}

async function tweetThread(tweets) {
  const client = getTwitterClient();
  let lastId = null;
  for (const text of tweets) {
    const payload = { text };
    if (lastId) payload.reply = { in_reply_to_tweet_id: lastId };
    const result = await client.v2.tweet(payload);
    lastId = result.data.id;
    console.log(`[THREAD] Part posted: ${text.substring(0, 50)}…`);
    // Pause between tweets to avoid rate limiting
    await new Promise(r => setTimeout(r, 1500));
  }
  return lastId;
}

/* ═══════════════════════════════════════════════
   PRICE / MARKET DATA
═══════════════════════════════════════════════ */
async function fetchPrice(url) {
  try {
    const res  = await fetch(url);
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) return null;
    return {
      price:    parseFloat(pair.priceUsd || 0),
      change1h: parseFloat(pair.priceChange?.h1 || 0),
      change24h:parseFloat(pair.priceChange?.h24 || 0),
      mcap:     pair.fdv || pair.marketCap || 0,
      volume24h:pair.volume?.h24 || 0,
      symbol:   pair.baseToken?.symbol || '?',
    };
  } catch { return null; }
}

function fmtPrice(p) {
  if (!p || p === 0) return '$0';
  if (p >= 0.01) return '$' + p.toFixed(4);
  // Scientific notation prevention
  const s = p.toFixed(12).replace(/0+$/, '');
  return '$' + s;
}

function fmtMcap(v) {
  if (!v) return '?';
  if (v >= 1e9) return '$' + (v/1e9).toFixed(2) + 'B';
  if (v >= 1e6) return '$' + (v/1e6).toFixed(2) + 'M';
  if (v >= 1e3) return '$' + (v/1e3).toFixed(1) + 'K';
  return '$' + v.toFixed(0);
}

function arrow(pct) { return pct >= 0 ? '🟢 +' : '🔴 '; }
function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ═══════════════════════════════════════════════
   TWEET TEMPLATES
═══════════════════════════════════════════════ */
const HYPE_TEMPLATES = [
  (yst, spt) =>
    `$YST ${fmtPrice(yst?.price)} | ${arrow(yst?.change24h)}${yst?.change24h?.toFixed(1)}% 24h\n$SPT ${fmtPrice(spt?.price)} | ${arrow(spt?.change24h)}${spt?.change24h?.toFixed(1)}% 24h\n\nThe cult doesn't sleep.\n\n#YAKK #YST #SPT #Solana`,

  (yst) =>
    `YAKK Studios update 🐾\n\n$YST price: ${fmtPrice(yst?.price)}\nMcap: ${fmtMcap(yst?.mcap)}\n24h: ${arrow(yst?.change24h)}${yst?.change24h?.toFixed(1)}%\n\nAnti-greed. Anti-extraction. All cult.\n\n🔒 Tokens locked on-chain\n🐋 Whale Club active\n\n#YST #YAKK #Solana`,

  (yst, spt) =>
    `Real ones hold through the noise.\n\n$YST ${fmtPrice(yst?.price)} ${arrow(yst?.change1h)}${yst?.change1h?.toFixed(1)}% 1h\n$SPT ${fmtPrice(spt?.price)} ${arrow(spt?.change1h)}${spt?.change1h?.toFixed(1)}% 1h\n\nNot financial advice.\nNot your average project.\n\n#YAKK #YST #SPT #Solana 🐾`,

  (yst) =>
    `45,000,000+ $YST locked on-chain.\nProof: stakepoint.app 🔒\n\nWhile others rug, we lock.\nWhile others shill, we build.\n\nThe ledger doesn't lie.\n\n$YST: ${fmtPrice(yst?.price)} | Mcap: ${fmtMcap(yst?.mcap)}\n\n#YAKK #YST #Solana`,

  () =>
    `YAKK Studios — where degens become investigators 🔍\n\n✅ Live token screener\n✅ On-chain cabal investigator\n✅ Anti-rug intelligence\n✅ AI trading signals\n✅ Whale Club (10M+ $YST & $SPT)\n\nlinktr.ee/yakkstudios\n\n#Solana #DeFi #YAKK`,

  (yst) =>
    `The cult never apes.\nThe cult investigates.\nThe cult holds.\n\n$YST: ${fmtPrice(yst?.price)}\n\nJoin the anti-greed movement 🐾\nlinktr.ee/yakkstudios\n\n#YAKK #YST #Solana #AntiRug`,

  () =>
    `Everything YAKK in one place 🐾\n\n🔗 linktr.ee/yakkstudios\n\n→ Dapp: yakkstudios.xyz\n→ Telegram: t.me/yakkcult\n→ Stake: stakepoint.app\n\nAnti-greed. On-chain. For real ones.\n\n#YAKK #YST #SPT #Solana`,
];

const MILESTONE_TEMPLATES = {
  lockProof: () =>
    `📢 On-chain proof of commitment:\n\n🔒 Lock #1001 — 25,398,079 $YST — unlocks Apr 19 2026\n🔒 Lock #1000 — 20,000,000 $YST — unlocks Mar 13 2027\n\nTotal locked: 45M+ $YST\nVerify: stakepoint.app\n\nThis is what trust looks like on-chain.\n\n#YAKK #YST #Solana #TokenLock`,
};

/* ═══════════════════════════════════════════════
   SCHEDULED POSTS
═══════════════════════════════════════════════ */
async function postHypeTweet() {
  const [yst, spt] = await Promise.all([fetchPrice(CONFIG.DEX_YST_URL), fetchPrice(CONFIG.DEX_SPT_URL)]);
  const template = randItem(HYPE_TEMPLATES);
  const text = template(yst, spt);
  await tweet(text);
}

async function postLockProof() {
  await tweet(MILESTONE_TEMPLATES.lockProof());
}

/* ═══════════════════════════════════════════════
   PAYMENT-TRIGGERED RUG EXPOSURE
   ─────────────────────────────────────────────
   Watches the investigation wallet for incoming
   transactions of exactly 1 SOL. When detected:
   1. Fetches the sending wallet address
   2. Calls YAKKAI to build a rug exposure thread
   3. Posts it to @YAKKStudios automatically
═══════════════════════════════════════════════ */
const connection = new Connection(CONFIG.SOLANA_RPC, 'confirmed');
const processedSigs = new Set(); // avoid processing same tx twice

async function buildExposureThread(payerWallet, targetWallet) {
  if (!CONFIG.ANTHROPIC_KEY) {
    console.log('[EXPOSURE] No ANTHROPIC_KEY set — skipping AI thread generation');
    return null;
  }

  const prompt = `You are YAKKAI, the YAKK Studios on-chain investigator. Someone has paid 1 SOL to investigate wallet: ${targetWallet || payerWallet}

Generate a Twitter exposure thread (max 8 tweets, each under 270 characters). The thread should:
- Start with a hook tweet (🚨 THREAD: ...)
- Explain what wallet is being investigated and why it's suspicious
- Cover typical rug patterns (bundled buys, LP removal, insider allocations, coordinated dumps)
- Advise the community what to look for on Solscan/Birdeye
- End with a call to action to follow @YAKKStudios and join the cult
- Use the YAKK voice: direct, anti-greed, slightly menacing, cult-like
- Include #YAKK #AntiRug #Solana hashtags on the last tweet only

Format: Return a JSON array of tweet strings. Example:
["Tweet 1 text", "Tweet 2 text", ...]`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': CONFIG.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  const text = data?.content?.[0]?.text || '';

  // Extract JSON array from response
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    console.error('[EXPOSURE] Could not parse AI response');
    return null;
  }

  try {
    return JSON.parse(match[0]);
  } catch {
    console.error('[EXPOSURE] JSON parse failed');
    return null;
  }
}

async function handlePayment(sig, payerWallet, targetWallet) {
  console.log(`[EXPOSURE] 1 SOL payment detected from ${payerWallet} | tx: ${sig}`);

  // Build the thread
  const thread = await buildExposureThread(payerWallet, targetWallet);

  if (!thread || !thread.length) {
    // Fallback: post a manual investigation notice
    await tweet(
      `🚨 NEW INVESTIGATION OPENED\n\nWallet flagged for review: ${payerWallet.slice(0,8)}…${payerWallet.slice(-8)}\n\nYAKKAI is analysing on-chain patterns. Thread incoming.\n\n🔍 yakkstudios.xyz\n#YAKK #AntiRug #Solana`
    );
    return;
  }

  console.log(`[EXPOSURE] Posting ${thread.length}-tweet thread`);
  await tweetThread(thread);
}

async function checkInvestigationWallet() {
  try {
    const walletPubkey = new PublicKey(CONFIG.INVESTIGATION_WALLET);
    const sigs = await connection.getSignaturesForAddress(walletPubkey, { limit: 10 });

    for (const sigInfo of sigs) {
      if (processedSigs.has(sigInfo.signature)) continue;
      processedSigs.add(sigInfo.signature);

      // Get full transaction
      const tx = await connection.getParsedTransaction(sigInfo.signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) continue;

      // Check if this is a SOL transfer TO the investigation wallet
      const preBalances  = tx.meta?.preBalances  || [];
      const postBalances = tx.meta?.postBalances || [];
      const accountKeys  = tx.transaction.message.accountKeys.map(k =>
        typeof k === 'string' ? k : k.pubkey?.toString()
      );

      const walletIdx = accountKeys.findIndex(k => k === CONFIG.INVESTIGATION_WALLET);
      if (walletIdx === -1) continue;

      const solDelta = (postBalances[walletIdx] - preBalances[walletIdx]) / LAMPORTS_PER_SOL;

      if (solDelta >= CONFIG.EXPOSURE_PAYMENT_SOL * 0.99) { // 1% tolerance for fees
        const payerAddress = accountKeys[0]; // first signer is the payer
        // Check if there's a memo (used as target wallet address)
        const memoInstr = tx.transaction.message.instructions?.find(i =>
          i.program === 'spl-memo' || i.programId?.toString() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
        );
        const targetWallet = memoInstr?.parsed || null;
        await handlePayment(sigInfo.signature, payerAddress, targetWallet);
      }
    }
  } catch (e) {
    console.error('[WATCHER] Error checking wallet:', e.message);
  }
}

/* ═══════════════════════════════════════════════
   SCHEDULER
═══════════════════════════════════════════════ */
function startScheduler() {
  console.log('🐾 YAKK X Automation — scheduler starting');

  // Price + hype tweet every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Posting hype tweet');
    await postHypeTweet().catch(e => console.error('[CRON] Hype tweet failed:', e.message));
  });

  // Lock proof tweet once a week (Monday 09:00 UTC)
  cron.schedule('0 9 * * 1', async () => {
    console.log('[CRON] Posting lock proof');
    await postLockProof().catch(e => console.error('[CRON] Lock proof failed:', e.message));
  });

  // Watch investigation wallet every 60 seconds
  cron.schedule('* * * * *', async () => {
    await checkInvestigationWallet().catch(e => console.error('[WATCHER] Error:', e.message));
  });

  console.log('✓ Scheduler active');
  console.log('  • Hype tweets: every 6 hours');
  console.log('  • Lock proof:  every Monday 09:00 UTC');
  console.log('  • Rug watcher: every 60 seconds');
}

/* ═══════════════════════════════════════════════
   CLI ENTRY POINT
═══════════════════════════════════════════════ */
const mode = process.argv[2];

(async () => {
  switch (mode) {
    case 'hype':
      console.log('Posting hype tweet…');
      await postHypeTweet();
      break;

    case 'price':
      console.log('Posting price update…');
      await postHypeTweet();
      break;

    case 'lock':
      console.log('Posting lock proof…');
      await postLockProof();
      break;

    case 'watch':
      console.log('Watching investigation wallet for payments…');
      // Run once immediately, then keep looping
      setInterval(checkInvestigationWallet, 60_000);
      await checkInvestigationWallet();
      break;

    case 'schedule':
    default:
      startScheduler();
      break;
  }
})();
