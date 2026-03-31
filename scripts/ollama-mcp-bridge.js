#!/usr/bin/env node
/**
 * YAKK Studios — Ollama MCP Bridge
 * Bridges Cursor AI IDE ↔ local Hermes3 (Ollama) via MCP protocol (JSON-RPC 2.0 over stdio)
 *
 * Setup:  node scripts/ollama-mcp-bridge.js
 * Config: .cursor/mcp.json (auto-registered)
 *
 * Tools exposed to Cursor:
 *   hermes_ask          — general YAKK-context chat with Hermes
 *   hermes_jsx_audit    — scan a component for JSX Fragment bugs
 *   hermes_risk_check   — classify a token via deterministic YAKK risk model
 *   hermes_gen_section  — generate a new section component from a spec
 *   hermes_ts_review    — TypeScript review with YAKK rules enforced
 */

const readline = require('readline');
const http = require('http');

// ─── Config ────────────────────────────────────────────────────────────────
const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'hermes3:8b';

// ─── YAKK System Context ───────────────────────────────────────────────────
const YAKK_SYSTEM = `You are the YAKK Studios Agentic OS assistant — an expert Next.js 14 / TypeScript / Solana developer embedded in the YAKK codebase.

MISSION: Build the $10B+ anti-corruption rail for Solana. Protect retail.

LIVE APP: https://yakkstudios.xyz
REPO: https://github.com/yakkstudios/yakkstudios
STACK: Next.js 14 App Router, TypeScript, React 18, Solana wallet adapter, Vercel. NO Tailwind — custom CSS vars only.

DESIGN SYSTEM:
  Pink: #e0607e | Gold: #f7c948 | Dark bg: #050509 | Text: #f5f5f7
  CSS classes: sec-pad, sec-eyebrow, sec-title, sec-bar, card, card-sm, grid2, grid3, grid4
  Buttons: btn btn-primary, btn btn-pink, btn btn-gold, btn btn-green, btn btn-ghost
  Badges:  badge b-pink, b-green, b-gold, b-blue, b-red, b-dim
  Forms:   inp, field-inp, field-lbl, field-sel
  NEVER use Tailwind. NEVER use hardcoded hex colours — use CSS var references.

TOKEN GATES:
  Standard: walletConnected && ystBalance >= 250_000
  Whale:    walletConnected && ystBalance >= 10_000_000
  YST Mint: jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV
  Meteora:  FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM

FATAL RULES (enforce in every review):
  1. JSX Fragment: {condition && (<>...</>)} — ALWAYS <> </> with multiple JSX siblings or comments
  2. No duplicate const declarations — watch hasAccess, walletConnected across refactors
  3. RPC calls always in try/catch — return 0 or "DATA_UNAVAILABLE" on failure, never throw
  4. Forensics are DETERMINISTIC: Gini > 0.85 = HIGH_RISK, holderCount < 5 = HIGH_RISK
  5. NEVER read or reference .env files in component code
  6. NO Tailwind classes, ever

SECTION PROPS INTERFACE (every section uses this exactly):
  interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void }

LOCKED OVERLAY (exact — do not vary):
  <div className="locked-overlay">
    <div className="locked-icon">🐋</div>
    <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
    <div className="locked-sub">Hold <strong>10,000,000 $YST</strong> to unlock.</div>
    <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST</a>
  </div>`;

// ─── Ollama HTTP call ───────────────────────────────────────────────────────
function ollamaChat(messages, options = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature: options.temperature ?? 0.3,
        num_predict: options.max_tokens ?? 2048,
      },
    });

    const url = new URL('/api/chat', OLLAMA_URL);
    const req = http.request(
      { hostname: url.hostname, port: url.port || 11434, path: url.pathname, method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.message?.content || parsed.error || 'No response');
          } catch {
            resolve(data);
          }
        });
      }
    );
    req.on('error', (e) => reject(e));
    req.setTimeout(120000, () => { req.destroy(); reject(new Error('Ollama timeout after 120s')); });
    req.write(payload);
    req.end();
  });
}

// ─── Tool implementations ───────────────────────────────────────────────────
async function hermes_ask({ prompt, temperature }) {
  const result = await ollamaChat([
    { role: 'system', content: YAKK_SYSTEM },
    { role: 'user',   content: prompt },
  ], { temperature });
  return { content: [{ type: 'text', text: result }] };
}

async function hermes_jsx_audit({ code, filename }) {
  const prompt = `You are auditing a YAKK Studios React/TypeScript component for JSX Fragment violations.

FILE: ${filename || 'component.tsx'}

THE BUG PATTERN TO FIND:
  WRONG:  {condition && (
            {/* comment */}
            <div>...</div>
            <div>...</div>
          )}
  WRONG:  {condition && (
            <div>...</div>
            <div>...</div>
          )}

  CORRECT: {condition && (<>
              {/* comment */}
              <div>...</div>
              <div>...</div>
            </>)}

COMPONENT CODE:
\`\`\`tsx
${code}
\`\`\`

List every location where a JSX Fragment is missing.
If the file is clean, say "✅ No JSX Fragment violations found."
For each violation, provide: line number, the broken pattern, and the corrected version.`;

  const result = await ollamaChat([
    { role: 'system', content: YAKK_SYSTEM },
    { role: 'user',   content: prompt },
  ]);
  return { content: [{ type: 'text', text: result }] };
}

async function hermes_risk_check({ mint, gini, holder_count, is_whitelisted }) {
  const prompt = `Classify this Solana token using the YAKK deterministic risk model.

Token data:
- Mint address: ${mint}
- Gini coefficient: ${gini}
- Unique holder count: ${holder_count}
- Whitelisted (YST/USDC): ${is_whitelisted ? 'YES' : 'NO'}

Rules (DETERMINISTIC — no probabilities):
1. If whitelisted → LOW_RISK (skip all other checks)
2. If gini > 0.85 → HIGH_RISK
3. If holder_count < 5 → HIGH_RISK
4. If DATA_UNAVAILABLE for gini or holders → DATA_UNAVAILABLE
5. Otherwise → LOW_RISK

Return ONLY valid JSON:
{"classification":"HIGH_RISK|LOW_RISK|DATA_UNAVAILABLE","reason":"one sentence","gini":${gini},"holderCount":${holder_count}}`;

  const result = await ollamaChat([
    { role: 'system', content: YAKK_SYSTEM },
    { role: 'user',   content: prompt },
  ], { temperature: 0 });
  return { content: [{ type: 'text', text: result }] };
}

async function hermes_gen_section({ name, gate, description }) {
  const gateType = gate === 'whale' ? 'WHALE (10,000,000 $YST)' : 'STANDARD (250,000 $YST)';
  const gateConst = gate === 'whale'
    ? 'const hasAccess = walletConnected && ystBalance >= 10_000_000;'
    : 'const hasAccess = walletConnected && ystBalance >= 250_000;';
  const lockedTitle = gate === 'whale' ? 'WHALE CLUB EXCLUSIVE' : 'TOKEN HOLDER EXCLUSIVE';
  const lockedSub = gate === 'whale'
    ? 'Hold <strong>10,000,000 $YST</strong> to unlock.'
    : 'Hold <strong>250,000 $YST</strong> to unlock.';

  const prompt = `Generate a complete Next.js 14 TSX component for the YAKK Studios DApp.

Section name: ${name}
Gate type: ${gateType}
Content description: ${description}

REQUIRED STRUCTURE:
\`\`\`tsx
'use client';
import React from 'react';

interface Props {
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

export default function ${name}({ walletConnected, ystBalance, onNavigate }: Props) {
  ${gateConst}

  return (
    <div className="sec-pad">
      {/* Section header */}
      <div className="sec-header">
        {/* ... */}
      </div>

      {/* Locked state */}
      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">${lockedTitle}</div>
          <div className="locked-sub">${lockedSub}</div>
          <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Get $YST</a>
        </div>
      )}

      {/* Accessible content — MUST use Fragment wrapper */}
      {hasAccess && (<>
        {/* content here */}
      </>)}
    </div>
  );
}
\`\`\`

Fill in the section content based on the description. Follow all YAKK rules strictly.
Use only CSS classes from the design system. No Tailwind. No hardcoded colours.`;

  const result = await ollamaChat([
    { role: 'system', content: YAKK_SYSTEM },
    { role: 'user',   content: prompt },
  ], { max_tokens: 4096 });
  return { content: [{ type: 'text', text: result }] };
}

async function hermes_ts_review({ code, filename }) {
  const prompt = `Review this TypeScript/React component for issues specific to the YAKK Studios codebase.

FILE: ${filename || 'component.tsx'}

Check for ALL of the following:
1. ❌ JSX Fragment violations ({condition && (multiple children)} without <> </>)
2. ❌ Duplicate const declarations (especially hasAccess)
3. ❌ Missing try/catch around any RPC/fetch calls
4. ❌ Tailwind classes (className="..." containing Tailwind utility names)
5. ❌ Hardcoded hex colours (e.g. #e0607e — should use var(--pink) or CSS class)
6. ❌ Props interface not matching standard { walletConnected, ystBalance, onNavigate }
7. ❌ .env variable access in client component
8. ⚠️  Any TypeScript 'any' types that could be improved
9. ⚠️  Missing 'use client' directive

CODE:
\`\`\`tsx
${code}
\`\`\`

Format your response as:
ERRORS (build-breaking):
  [list each ❌ item found with line number and fix]

WARNINGS (non-breaking):
  [list each ⚠️ item found]

VERDICT: PASS | FAIL`;

  const result = await ollamaChat([
    { role: 'system', content: YAKK_SYSTEM },
    { role: 'user',   content: prompt },
  ]);
  return { content: [{ type: 'text', text: result }] };
}

// ─── MCP Tool registry ──────────────────────────────────────────────────────
const TOOLS = {
  hermes_ask: {
    description: 'Chat with local Hermes3 model with full YAKK Studios context injected automatically.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt:      { type: 'string', description: 'Your question or task for Hermes.' },
        temperature: { type: 'number', description: 'Temperature (0–1). Default 0.3.', default: 0.3 },
      },
      required: ['prompt'],
    },
    handler: hermes_ask,
  },
  hermes_jsx_audit: {
    description: 'Scan a React/TypeScript component for JSX Fragment bugs ({condition && (multiple siblings without <></>)}). Pass the raw TSX code.',
    inputSchema: {
      type: 'object',
      properties: {
        code:     { type: 'string', description: 'The full TSX component code to audit.' },
        filename: { type: 'string', description: 'Optional filename for context (e.g. Alerts.tsx).' },
      },
      required: ['code'],
    },
    handler: hermes_jsx_audit,
  },
  hermes_risk_check: {
    description: 'Classify a Solana token using the YAKK deterministic risk model (Gini + holder count). Returns HIGH_RISK, LOW_RISK, or DATA_UNAVAILABLE.',
    inputSchema: {
      type: 'object',
      properties: {
        mint:          { type: 'string',  description: 'Token mint address.' },
        gini:          { type: 'number',  description: 'Gini coefficient (0–1). Pass -1 if unavailable.' },
        holder_count:  { type: 'integer', description: 'Unique holder count. Pass -1 if unavailable.' },
        is_whitelisted: { type: 'boolean', description: 'Whether this is YST or USDC (always LOW_RISK).' },
      },
      required: ['mint', 'gini', 'holder_count', 'is_whitelisted'],
    },
    handler: hermes_risk_check,
  },
  hermes_gen_section: {
    description: 'Generate a complete YAKK Studios section component from a description. Applies all design system rules automatically.',
    inputSchema: {
      type: 'object',
      properties: {
        name:        { type: 'string', description: 'PascalCase component name, e.g. "AirdropTracker".' },
        gate:        { type: 'string', enum: ['standard', 'whale'], description: '"standard" (250K YST) or "whale" (10M YST).' },
        description: { type: 'string', description: 'What the section should show / do.' },
      },
      required: ['name', 'gate', 'description'],
    },
    handler: hermes_gen_section,
  },
  hermes_ts_review: {
    description: 'Full TypeScript/React review against YAKK coding rules. Checks JSX Fragments, duplicate consts, RPC try/catch, no Tailwind, and more.',
    inputSchema: {
      type: 'object',
      properties: {
        code:     { type: 'string', description: 'The full TSX component code to review.' },
        filename: { type: 'string', description: 'Optional filename for context.' },
      },
      required: ['code'],
    },
    handler: hermes_ts_review,
  },
};

// ─── MCP JSON-RPC 2.0 server (stdio) ───────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, terminal: false });

function send(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

function errorResponse(id, code, message) {
  send({ jsonrpc: '2.0', id, error: { code, message } });
}

rl.on('line', async (line) => {
  let req;
  try { req = JSON.parse(line.trim()); } catch {
    errorResponse(null, -32700, 'Parse error');
    return;
  }

  const { id, method, params } = req;

  // ── Handshake ──
  if (method === 'initialize') {
    send({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'yakk-ollama-bridge', version: '1.0.0' },
      },
    });
    return;
  }

  if (method === 'initialized') return; // notification, no response

  // ── Tool list ──
  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0', id,
      result: {
        tools: Object.entries(TOOLS).map(([name, def]) => ({
          name,
          description: def.description,
          inputSchema: def.inputSchema,
        })),
      },
    });
    return;
  }

  // ── Tool call ──
  if (method === 'tools/call') {
    const toolName = params?.name;
    const toolArgs = params?.arguments || {};
    const tool = TOOLS[toolName];

    if (!tool) {
      errorResponse(id, -32601, `Unknown tool: ${toolName}`);
      return;
    }

    try {
      const result = await tool.handler(toolArgs);
      send({ jsonrpc: '2.0', id, result });
    } catch (err) {
      // If Ollama is offline, return a graceful error instead of crashing
      const msg = err.message?.includes('ECONNREFUSED')
        ? `Ollama is not running. Start it with: ollama serve\nThen pull model: ollama pull ${OLLAMA_MODEL}`
        : `Tool error: ${err.message}`;
      send({
        jsonrpc: '2.0', id,
        result: { content: [{ type: 'text', text: `⚠️ ${msg}` }], isError: true },
      });
    }
    return;
  }

  // ── Ping ──
  if (method === 'ping') {
    send({ jsonrpc: '2.0', id, result: {} });
    return;
  }

  errorResponse(id, -32601, `Method not found: ${method}`);
});

// Keep alive
process.stdin.resume();
process.on('SIGINT', () => process.exit(0));
