/**
 * YAKK Studios — Discord Verification Bot
 * ════════════════════════════════════════
 * Verifies Solana wallet ownership and checks $YST / $SPT holdings.
 * Assigns roles based on tier. Blocks non-holders from gated channels.
 *
 * Commands:
 *   /verify       — Start wallet verification flow
 *   /balance      — Check your current token balances
 *   /whois        — (Admin) Look up a member's verified wallet
 *   /revoke       — (Admin) Remove verification from a member
 *
 * Roles assigned automatically:
 *   ✅ YST Holder    — holds 250,000+ $YST
 *   ✅ SPT Holder    — holds 1,000,000+ $SPT
 *   🐋 Whale Club   — holds 10,000,000+ of BOTH $YST AND $SPT
 *   ❌ Unverified   — no qualifying holdings (access denied to gated channels)
 *
 * Architecture:
 *   - discord.js v14 (slash commands, buttons, modals)
 *   - Express server on PORT 3001 handles Phantom signature callbacks
 *   - @solana/web3.js checks on-chain balances
 *   - In-memory pending sessions; add Redis/DB for persistence
 */

require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder,
        ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
        PermissionFlagsBits } = require('discord.js');
const { Connection, PublicKey } = require('@solana/web3.js');
const nacl   = require('tweetnacl');
const bs58   = require('bs58');
const crypto = require('crypto');
const express = require('express');
const path   = require('path');

/* ═══════════════════════════════════════════════════
   CONFIG — override via .env
═══════════════════════════════════════════════════ */
const CONFIG = {
  DISCORD_TOKEN:     process.env.DISCORD_TOKEN,
  CLIENT_ID:         process.env.CLIENT_ID,
  GUILD_ID:          process.env.GUILD_ID,        // your server ID

  // Role IDs (create these in your server first, paste IDs here)
  ROLE_YST_HOLDER:   process.env.ROLE_YST_HOLDER,
  ROLE_SPT_HOLDER:   process.env.ROLE_SPT_HOLDER,
  ROLE_WHALE:        process.env.ROLE_WHALE,
  ROLE_UNVERIFIED:   process.env.ROLE_UNVERIFIED, // role to REMOVE on verify

  // Token gates
  YST_MINT:          'jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV',
  SPT_MINT:          '6uUU2z5GBasaxnkcqiQVHa2SXL68mAXDsq1zYN5Qxrm7',
  YST_GATE:          250_000,
  SPT_GATE:        1_000_000,
  WHALE_GATE:     10_000_000,

  SOLANA_RPC:        process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  VERIFY_BASE_URL:   process.env.VERIFY_BASE_URL || 'http://localhost:3001', // e.g. https://verify.yakkstudios.xyz
  PORT:              process.env.PORT || 3001,

  // Session TTL: 10 minutes to complete verification
  SESSION_TTL_MS:    10 * 60 * 1000,
};

/* ═══════════════════════════════════════════════════
   SOLANA HELPERS
═══════════════════════════════════════════════════ */
const connection = new Connection(CONFIG.SOLANA_RPC, 'confirmed');

async function getTokenBalance(walletAddress, mintAddress) {
  try {
    const wallet = new PublicKey(walletAddress);
    const mint   = new PublicKey(mintAddress);
    const accounts = await connection.getParsedTokenAccountsByOwner(wallet, { mint });
    return accounts.value.reduce((sum, a) =>
      sum + (a.account.data.parsed?.info?.tokenAmount?.uiAmount || 0), 0);
  } catch (e) {
    console.error(`Balance fetch error (${mintAddress}):`, e.message);
    return 0;
  }
}

async function checkHoldings(walletAddress) {
  const [ystBal, sptBal] = await Promise.all([
    getTokenBalance(walletAddress, CONFIG.YST_MINT),
    getTokenBalance(walletAddress, CONFIG.SPT_MINT),
  ]);
  return {
    ystBal,
    sptBal,
    isYstHolder:   ystBal  >= CONFIG.YST_GATE,
    isSptHolder:   sptBal  >= CONFIG.SPT_GATE,
    isWhale:       ystBal  >= CONFIG.WHALE_GATE && sptBal >= CONFIG.WHALE_GATE,
    qualifies:     ystBal  >= CONFIG.YST_GATE   || sptBal >= CONFIG.SPT_GATE,
  };
}

/* ═══════════════════════════════════════════════════
   SIGNATURE VERIFICATION
═══════════════════════════════════════════════════ */
function verifySignature(walletAddress, message, signatureB58) {
  try {
    const pubKey    = new PublicKey(walletAddress).toBytes();
    const msgBytes  = new TextEncoder().encode(message);
    const sigBytes  = bs58.decode(signatureB58);
    return nacl.sign.detached.verify(msgBytes, sigBytes, pubKey);
  } catch (e) {
    return false;
  }
}

/* ═══════════════════════════════════════════════════
   PENDING SESSIONS  (walletAddress ← sessionId ← discordUserId)
═══════════════════════════════════════════════════ */
const pendingSessions = new Map(); // sessionId → { discordUserId, message, expiresAt }
const verifiedWallets = new Map(); // discordUserId → walletAddress

function createSession(discordUserId) {
  // Clean up any stale existing session for this user
  for (const [id, sess] of pendingSessions) {
    if (sess.discordUserId === discordUserId) pendingSessions.delete(id);
  }
  const sessionId = crypto.randomBytes(16).toString('hex');
  const message   = `YAKK Studios Wallet Verification\nUser: ${discordUserId}\nNonce: ${sessionId}\nTimestamp: ${Date.now()}\n\nBy signing this message you prove wallet ownership. No transaction is made.`;
  pendingSessions.set(sessionId, {
    discordUserId,
    message,
    expiresAt: Date.now() + CONFIG.SESSION_TTL_MS,
  });
  return { sessionId, message };
}

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, sess] of pendingSessions) {
    if (sess.expiresAt < now) pendingSessions.delete(id);
  }
}, 5 * 60 * 1000);

/* ═══════════════════════════════════════════════════
   DISCORD CLIENT
═══════════════════════════════════════════════════ */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

async function assignRoles(member, holdings) {
  const toAdd    = [];
  const toRemove = [];

  if (holdings.isWhale)     toAdd.push(CONFIG.ROLE_WHALE);
  if (holdings.isYstHolder) toAdd.push(CONFIG.ROLE_YST_HOLDER);
  if (holdings.isSptHolder) toAdd.push(CONFIG.ROLE_SPT_HOLDER);
  if (CONFIG.ROLE_UNVERIFIED) toRemove.push(CONFIG.ROLE_UNVERIFIED);

  // Filter out null/undefined role IDs
  const validAdd    = toAdd.filter(Boolean);
  const validRemove = toRemove.filter(Boolean);

  await Promise.allSettled([
    ...validAdd.map(r    => member.roles.add(r).catch(() => {})),
    ...validRemove.map(r => member.roles.remove(r).catch(() => {})),
  ]);
}

async function removeAllYakkRoles(member) {
  const roles = [CONFIG.ROLE_WHALE, CONFIG.ROLE_YST_HOLDER, CONFIG.ROLE_SPT_HOLDER].filter(Boolean);
  await Promise.allSettled(roles.map(r => member.roles.remove(r).catch(() => {})));
  if (CONFIG.ROLE_UNVERIFIED) await member.roles.add(CONFIG.ROLE_UNVERIFIED).catch(() => {});
}

/* ═══════════════════════════════════════════════════
   SLASH COMMAND REGISTRATION
═══════════════════════════════════════════════════ */
const commands = [
  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your Solana wallet and get your YAKK roles'),

  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current $YST and $SPT balances'),

  new SlashCommandBuilder()
    .setName('whois')
    .setDescription('(Admin) Look up a member\'s verified wallet')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(o => o.setName('member').setDescription('Member to look up').setRequired(true)),

  new SlashCommandBuilder()
    .setName('revoke')
    .setDescription('(Admin) Remove a member\'s verification')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(o => o.setName('member').setDescription('Member to revoke').setRequired(true)),
];

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(CONFIG.DISCORD_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CONFIG.CLIENT_ID, CONFIG.GUILD_ID),
      { body: commands.map(c => c.toJSON()) },
    );
    console.log('✓ Slash commands registered');
  } catch (e) {
    console.error('Command registration failed:', e);
  }
}

/* ═══════════════════════════════════════════════════
   COMMAND HANDLERS
═══════════════════════════════════════════════════ */
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  /* /verify */
  if (interaction.isChatInputCommand() && interaction.commandName === 'verify') {
    const { sessionId, message } = createSession(interaction.user.id);
    const verifyUrl = `${CONFIG.VERIFY_BASE_URL}/?session=${sessionId}`;

    const embed = new EmbedBuilder()
      .setColor(0xE0607E)
      .setTitle('🔒 YAKK Studios — Wallet Verification')
      .setDescription(
        'To get your role, you need to prove you hold qualifying tokens.\n\n' +
        '**Requirements (either qualifies):**\n' +
        `• 250,000+ $YST\n` +
        `• 1,000,000+ $SPT\n` +
        `• 10M+ of BOTH = 🐋 Whale Club\n\n` +
        '**How it works:**\n' +
        '1. Click **Verify Wallet** below\n' +
        '2. Connect your Phantom wallet\n' +
        '3. Sign a message (no transaction, no fees)\n' +
        '4. Bot checks your balance and assigns your role\n\n' +
        '⏱ Link expires in 10 minutes.'
      )
      .setFooter({ text: 'YAKK Studios • Anti-greed Solana cult' });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🔗 Verify Wallet')
        .setStyle(ButtonStyle.Link)
        .setURL(verifyUrl),
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }

  /* /balance */
  if (interaction.isChatInputCommand() && interaction.commandName === 'balance') {
    const wallet = verifiedWallets.get(interaction.user.id);
    if (!wallet) {
      return interaction.reply({ content: '❌ You haven\'t verified a wallet yet. Use `/verify` first.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: true });
    const holdings = await checkHoldings(wallet);
    const embed = new EmbedBuilder()
      .setColor(holdings.isWhale ? 0xF7C948 : holdings.qualifies ? 0x22C55E : 0xEF4444)
      .setTitle('💼 Your YAKK Holdings')
      .addFields(
        { name: '$YST Balance', value: holdings.ystBal.toLocaleString(), inline: true },
        { name: '$SPT Balance', value: holdings.sptBal.toLocaleString(), inline: true },
        { name: 'Status',       value: holdings.isWhale ? '🐋 Whale Club' : holdings.qualifies ? '✅ Verified Holder' : '❌ Below threshold', inline: true },
      )
      .setFooter({ text: `Wallet: ${wallet.slice(0,8)}…${wallet.slice(-4)}` });
    await interaction.editReply({ embeds: [embed] });
  }

  /* /whois (admin) */
  if (interaction.isChatInputCommand() && interaction.commandName === 'whois') {
    const target = interaction.options.getUser('member');
    const wallet = verifiedWallets.get(target.id);
    if (!wallet) return interaction.reply({ content: `❌ ${target.username} has no verified wallet.`, ephemeral: true });
    const embed = new EmbedBuilder()
      .setColor(0x60A5FA)
      .setTitle(`🔍 Wallet Lookup — ${target.username}`)
      .addFields({ name: 'Verified Wallet', value: `\`${wallet}\`` });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  /* /revoke (admin) */
  if (interaction.isChatInputCommand() && interaction.commandName === 'revoke') {
    const target  = interaction.options.getUser('member');
    const guild   = interaction.guild;
    const member  = await guild.members.fetch(target.id).catch(() => null);
    verifiedWallets.delete(target.id);
    if (member) await removeAllYakkRoles(member);
    await interaction.reply({ content: `✅ Verification revoked for ${target.username}.`, ephemeral: true });
    console.log(`[REVOKE] ${target.username} (${target.id}) revoked by ${interaction.user.username}`);
  }
});

/* ═══════════════════════════════════════════════════
   EXPRESS SERVER — handles Phantom callback
═══════════════════════════════════════════════════ */
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'verify')));

/**
 * GET /api/message?session=SESSION_ID
 * Returns the message the user needs to sign
 */
app.get('/api/message', (req, res) => {
  const { session } = req.query;
  if (!session) return res.json({ error: 'Missing session' });
  const sess = pendingSessions.get(session);
  if (!sess) return res.json({ error: 'Session expired or invalid. Run /verify again.' });
  if (Date.now() > sess.expiresAt) {
    pendingSessions.delete(session);
    return res.json({ error: 'Session expired. Run /verify again.' });
  }
  res.json({ message: sess.message });
});

/**
 * POST /api/verify
 * Body: { sessionId, walletAddress, signature }
 */
app.post('/api/verify', async (req, res) => {
  const { sessionId, walletAddress, signature } = req.body || {};

  if (!sessionId || !walletAddress || !signature) {
    return res.json({ ok: false, error: 'Missing fields' });
  }

  // Validate wallet address format
  if (!/^[A-Za-z0-9]{32,44}$/.test(walletAddress)) {
    return res.json({ ok: false, error: 'Invalid wallet address' });
  }

  const session = pendingSessions.get(sessionId);
  if (!session) return res.json({ ok: false, error: 'Session expired or invalid. Run /verify again.' });
  if (Date.now() > session.expiresAt) {
    pendingSessions.delete(sessionId);
    return res.json({ ok: false, error: 'Session expired. Run /verify again.' });
  }

  // Verify signature
  const valid = verifySignature(walletAddress, session.message, signature);
  if (!valid) return res.json({ ok: false, error: 'Signature verification failed. Please try again.' });

  // Check on-chain holdings
  const holdings = await checkHoldings(walletAddress);
  pendingSessions.delete(sessionId);

  if (!holdings.qualifies) {
    return res.json({
      ok: false,
      error: `Insufficient holdings. Need 250k+ $YST or 1M+ $SPT.\n` +
             `Your wallet: ${holdings.ystBal.toLocaleString()} $YST | ${holdings.sptBal.toLocaleString()} $SPT`,
    });
  }

  // Store verified wallet
  verifiedWallets.set(session.discordUserId, walletAddress);

  // Assign Discord roles
  try {
    const guild  = client.guilds.cache.get(CONFIG.GUILD_ID);
    const member = await guild.members.fetch(session.discordUserId);
    await assignRoles(member, holdings);
  } catch (e) {
    console.error('Role assignment error:', e.message);
    return res.json({ ok: false, error: 'Roles could not be assigned. Contact an admin.' });
  }

  const tierMsg = holdings.isWhale
    ? '🐋 Welcome to the Whale Club.'
    : `✅ Verified as ${[holdings.isYstHolder && 'YST Holder', holdings.isSptHolder && 'SPT Holder'].filter(Boolean).join(' + ')}`;

  console.log(`[VERIFY] ${session.discordUserId} → ${walletAddress} | YST:${holdings.ystBal} SPT:${holdings.sptBal}`);

  return res.json({
    ok: true,
    message: tierMsg,
    ystBal: holdings.ystBal,
    sptBal: holdings.sptBal,
    tier: holdings.isWhale ? 'whale' : 'holder',
  });
});

/* ═══════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════ */
client.once('ready', async () => {
  console.log(`✓ YAKK Bot online as ${client.user.tag}`);
  await registerCommands();
});

client.login(CONFIG.DISCORD_TOKEN);
app.listen(CONFIG.PORT, () => console.log(`✓ Verify server running on port ${CONFIG.PORT}`));
