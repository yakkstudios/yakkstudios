# YAKK Studios — 7-Layer Skill Stack

> Skeleton definitions for all 7 YAKK skills.
> Hand this to Claude when he's back — he can build each as a proper Claude Code skill file.
> These map to the empire's 5 verticals + 2 cross-cutting capabilities.

---

## Skill 1: yakk-dapp-dev

**Purpose**: DApp development — building/fixing sections, wiring APIs, Vercel deploys
**Trigger**: Any work on yakkstudios.xyz or the yakkstudios repo

**Context to load**:
- CLAUDE.md (repo memory)
- Architecture (Next.js 14, TypeScript, React 18, Solana)
- Design system (globals.css classes)
- Nav structure + token gating logic
- All 32 section statuses

**Rules**:
- Always run `npx next build` before pushing
- Use existing CSS classes — don't reinvent
- Token gating: `walletConnected && ystBalance >= 250_000`
- Every push auto-deploys via Vercel
- Check CHANGELOG before making changes

**Key files**: app/page.tsx, lib/constants.ts, components/sections/*, globals.css

---

## Skill 2: yakk-defi-ops

**Purpose**: $YST token operations — price monitoring, holder tracking, whale alerts, liquidity
**Trigger**: Anything about $YST price, holders, whales, staking, liquidity

**Context to load**:
- YST Mint: jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV
- Meteora Pool: FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM
- DexScreener API endpoint
- Gate thresholds (250K standard, 10M whale)
- n8n workflow configs

**Capabilities**:
- Fetch live price/volume/liquidity from DexScreener
- Query holder balances via Helius/RPC
- Monitor whale movements
- Update holders.ts snapshot
- Check token gate eligibility

**APIs**: DexScreener (public), Helius (key in env), Solana RPC (public)

---

## Skill 3: yakk-agency

**Purpose**: AI Services Agency operations — client pitches, proposals, pricing, outreach
**Trigger**: Agency work, client acquisition, service packaging, revenue targets

**Context to load**:
- Target: £10K MRR by Q3 2026
- Services: AI automation, multi-agent consulting, DeFi bot development
- Archive docs: ClientPitch.pdf, AgencyLaunch PromptPack, MarketIntelligence Brief
- Pricing tiers (TBD — need to define)

**Capabilities**:
- Draft client proposals and pitches
- Research prospect companies (via Apollo.io)
- Build service packages
- Track revenue pipeline
- Generate case studies from internal work

**Connected tools**: Apollo.io, Zoho Mail (shyfts@yakkstudios.xyz), Gmail

---

## Skill 4: yakk-github-archive

**Purpose**: Triage, catalogue, and deploy from the 1000+ repo archive
**Trigger**: Finding repos, evaluating tools, deploying from archive, repo research

**Context to load**:
- CSV/XLSX repo files with 1000+ entries
- 6 categories: Multi-Agent Frameworks, Claude Integrations, Grok Tools, Memory/RAG, n8n/MCP, Gemini CLI/API
- 900+ tagged high priority (needs triage to top 5%)
- Integration briefs from archive

**Capabilities**:
- Search and filter repos by category/relevance
- Evaluate repo quality (stars, recent commits, documentation)
- Generate integration briefs for promising repos
- Track which repos have been deployed/tested
- Identify duplicates and overlapping tools

**Triage criteria**:
1. Active maintenance (commits in last 6 months)
2. Documentation quality
3. Direct applicability to YAKK verticals
4. Deployment complexity (prefer low)
5. Community adoption (stars, forks)

---

## Skill 5: yakk-multi-agent

**Purpose**: Orchestrate the multi-model AI stack — Grok, Claude, Gemini, Perplexity
**Trigger**: Multi-model tasks, parallel analysis, cross-model review

**Context to load**:
- xAI API key + endpoints (chat, image, video, TTS)
- Model hierarchy:
  - Routine: grok-4-1-fast-non-reasoning ($0.20/$0.50 per 1M)
  - Quality: grok-4.20-0309-reasoning ($2/$6 per 1M)
  - Image: grok-imagine-image ($0.02/img)
  - Video: grok-imagine-video ($0.05/sec)
  - TTS: Eve voice ($4.20/1M chars)
- Perplexity: research + search + embeddings
- Gemini: QA audit, architecture review
- Claude: primary developer, deep reasoning

**Capabilities**:
- Route tasks to optimal model by cost/quality
- Run parallel analysis across models
- Synthesize multi-model outputs
- Generate images/video/audio via Grok
- Use Perplexity for real-time research

**Decision logic**:
- Quick lookup → Perplexity search
- Code generation → Claude
- QA/review → Gemini
- Creative/content → Grok
- Multi-perspective → All in parallel

---

## Skill 6: yakk-content

**Purpose**: Content creation pipeline — X/Twitter posts, video scripts, branding, marketing
**Trigger**: Social media, content calendar, brand assets, marketing materials

**Context to load**:
- X/Twitter: @YAKKStudios (Developer App ID: 32667451)
- Silent Video Content Pipeline (from archive)
- Brand voice: technical but accessible, Web3-native, anti-rug ethos
- YouTube Analytics (connected)

**Capabilities**:
- Draft X/Twitter threads and posts
- Generate image assets via Grok Imagine
- Create video scripts for Silent Video Pipeline
- Build marketing materials for agency
- Track content performance (YouTube Analytics, Google Analytics)

**Brand rules**:
- Never use legal name publicly (use "shyfts" or "YAKK Studios")
- Anti-pump, anti-rug positioning
- Technical credibility over hype
- Community-first messaging

---

## Skill 7: yakk-research-weapon

**Purpose**: Competitive intelligence, market research, opportunity scanning
**Trigger**: Market analysis, competitor research, trend monitoring, strategic decisions

**Context to load**:
- Research Weapon Prompts (from archive)
- Sun Tzu strategy framework
- Aristotle First Principles
- Elon Roadmap Destructor
- LeCun Cognitive Architecture
- Finnhub (connected — real-time market data)

**Capabilities**:
- Deep competitive analysis on any market/company
- Crypto market scanning and opportunity identification
- Agency prospect research
- Technology trend analysis
- Strategic recommendation with framework application

**Frameworks to apply**:
1. Sun Tzu: What asymmetric advantage exists?
2. First Principles: What assumptions can we break?
3. Elon: What steps can we eliminate/compress?
4. LeCun: How does this system learn and adapt?

---

## Implementation Notes for Claude

When building these as proper skill files:
1. Each skill should be a `.md` file in the repo root or a `/skills` directory
2. Use YAML frontmatter for metadata (name, trigger, version)
3. Keep context sections concise — link to full docs rather than duplicating
4. Include example prompts/commands for each capability
5. Version them — these will evolve as the empire grows
6. Cross-reference: skills should know about each other (e.g., yakk-dapp-dev should know yakk-defi-ops exists for price data)
