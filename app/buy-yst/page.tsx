"use client";

import { useMemo, useState } from "react";

const YST_MINT = "jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV";
const DEFAULT_SOLANA_DESTINATION = "";

type ChainKey =
  | "ethereum"
  | "polygon"
  | "base"
  | "arbitrum"
  | "optimism"
  | "bnb"
  | "avalanche"
  | "monad"
  | "bitcoin";

type TokenOption = {
  symbol: string;
  address: string;
  decimals?: number;
};

type ChainOption = {
  key: ChainKey;
  label: string;
  family: "evm" | "btc";
  tokens: TokenOption[];
};

type QuoteRequest = {
  fromChain: ChainKey;
  toChain: "solana";
  fromToken: string;
  toToken: string;
  amount: string;
  destinationAddress: string;
  slippageBps: number;
};

type QuoteResponse = {
  provider: "mayan" | "wormhole" | "mock";
  routeId: string;
  estimatedOut: string;
  minOut: string;
  bridgeFeeUsd?: string;
  etaSeconds?: number;
  raw?: unknown;
};

type SwapExecution = {
  provider: string;
  approvalTarget?: string;
  txRequest?: unknown;
  routeId: string;
  raw?: unknown;
};

const SOURCE_CHAINS: ChainOption[] = [
  {
    key: "ethereum",
    label: "Ethereum",
    family: "evm",
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
      { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
      { symbol: "WBTC", address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", decimals: 8 },
    ],
  },
  {
    key: "polygon",
    label: "Polygon",
    family: "evm",
    tokens: [
      { symbol: "POL", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", decimals: 6 },
      { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AaCB8eFfE7F", decimals: 6 },
      { symbol: "WETH", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", decimals: 18 },
    ],
  },
  {
    key: "base",
    label: "Base",
    family: "evm",
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0x833589fCD6EDB6E08f4c7C32D4f71b54bdA02913", decimals: 6 },
    ],
  },
  {
    key: "arbitrum",
    label: "Arbitrum",
    family: "evm",
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
      { symbol: "USDT", address: "0xFd086bC7CD5C481DCC9C85ebe478A1C0b69FCbb9", decimals: 6 },
    ],
  },
  {
    key: "optimism",
    label: "Optimism",
    family: "evm",
    tokens: [
      { symbol: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0x0b2c639c533813f4aa9d7837caf62653d097ff85", decimals: 6 },
    ],
  },
  {
    key: "bnb",
    label: "BNB Chain",
    family: "evm",
    tokens: [
      { symbol: "BNB", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
      { symbol: "USDC", address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", decimals: 18 },
    ],
  },
  {
    key: "avalanche",
    label: "Avalanche",
    family: "evm",
    tokens: [
      { symbol: "AVAX", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", decimals: 6 },
    ],
  },
  {
    key: "monad",
    label: "Monad",
    family: "evm",
    tokens: [
      { symbol: "MON", address: "0x0000000000000000000000000000000000000000", decimals: 18 },
      { symbol: "USDC", address: "0x0000000000000000000000000000000000000001", decimals: 6 },
    ],
  },
  {
    key: "bitcoin",
    label: "Bitcoin",
    family: "btc",
    tokens: [{ symbol: "BTC", address: "btc", decimals: 8 }],
  },
];

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function isValidSolanaAddress(value: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value.trim());
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function getCrossChainQuote(request: QuoteRequest): Promise<QuoteResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_YAKK_SWAP_API;

  if (!backendUrl) {
    const amount = Number(request.amount || "0");
    const estimatedOut = amount > 0 ? (amount * 97.5).toFixed(4) : "0";
    return {
      provider: "mock",
      routeId: `mock-${Date.now()}`,
      estimatedOut,
      minOut: (Number(estimatedOut) * 0.995).toFixed(4),
      bridgeFeeUsd: amount > 0 ? "4.20" : "0",
      etaSeconds: 180,
      raw: { note: "Set NEXT_PUBLIC_YAKK_SWAP_API to use your real quote backend." },
    };
  }

  return fetchJson<QuoteResponse>(`${backendUrl}/quote`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

async function createSwapExecution(request: QuoteRequest & { routeId?: string }): Promise<SwapExecution> {
  const backendUrl = process.env.NEXT_PUBLIC_YAKK_SWAP_API;

  if (!backendUrl) {
    return {
      provider: "mock",
      routeId: request.routeId || `mock-${Date.now()}`,
      raw: { note: "Wire this to your backend signer / route builder." },
    };
  }

  return fetchJson<SwapExecution>(`${backendUrl}/swap`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export default function BuyYstBridgePage() {
  const [fromChain, setFromChain] = useState<ChainKey>("ethereum");
  const [fromToken, setFromToken] = useState<string>(SOURCE_CHAINS[0].tokens[0].address);
  const [amount, setAmount] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>(DEFAULT_SOLANA_DESTINATION);
  const [slippageBps, setSlippageBps] = useState<number>(100);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Ready to route into $YST on Solana.");

  const selectedChain = useMemo(
    () => SOURCE_CHAINS.find((chain) => chain.key === fromChain) ?? SOURCE_CHAINS[0],
    [fromChain]
  );

  const selectedToken = useMemo(
    () => selectedChain.tokens.find((token) => token.address === fromToken) ?? selectedChain.tokens[0],
    [selectedChain, fromToken]
  );

  function handleChainChange(next: ChainKey) {
    const chain = SOURCE_CHAINS.find((item) => item.key === next) ?? SOURCE_CHAINS[0];
    setFromChain(chain.key);
    setFromToken(chain.tokens[0].address);
    setQuote(null);
    setError(null);
  }

  async function handleQuote() {
    setError(null);
    setQuote(null);

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount to quote the swap.");
      return;
    }

    if (!isValidSolanaAddress(destinationAddress)) {
      setError("Enter a valid Solana destination address for YST delivery.");
      return;
    }

    setLoadingQuote(true);
    setStatus("Fetching route and quote...");

    try {
      const nextQuote = await getCrossChainQuote({
        fromChain,
        toChain: "solana",
        fromToken: selectedToken.address,
        toToken: YST_MINT,
        amount,
        destinationAddress,
        slippageBps,
      });
      setQuote(nextQuote);
      setStatus(`Quote ready via ${nextQuote.provider}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch quote.";
      setError(message);
      setStatus("Quote failed.");
    } finally {
      setLoadingQuote(false);
    }
  }

  async function handleSwap() {
    setError(null);

    if (!quote) {
      setError("Request a quote before starting the swap.");
      return;
    }

    setExecuting(true);
    setStatus("Preparing source-chain transaction...");

    try {
      const execution = await createSwapExecution({
        fromChain,
        toChain: "solana",
        fromToken: selectedToken.address,
        toToken: YST_MINT,
        amount,
        destinationAddress,
        slippageBps,
        routeId: quote.routeId,
      });

      console.log("swap execution", execution);
      setStatus(
        execution.provider === "mock"
          ? "Execution payload created. Wire wallet signing and provider SDK next."
          : `Swap payload created via ${execution.provider}. Prompt wallet signing next.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to prepare swap.";
      setError(message);
      setStatus("Swap preparation failed.");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f10] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex w-fit items-center rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">
              YAKK cross-chain
            </span>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Swap into $YST from major chains without making users learn Solana first.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              This starter page is built for a provider-backed bridge swap flow. It assumes the user starts on
              Ethereum, Polygon, Base, Arbitrum, Optimism, BNB Chain, Avalanche, Monad, or Bitcoin and ends with
              $YST delivered to a Solana wallet.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Destination token</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-sm font-semibold text-emerald-300">
                YST
              </div>
              <div>
                <p className="text-lg font-medium text-white">YAKK Studios Token</p>
                <p className="max-w-[280px] break-all text-sm text-zinc-500">{YST_MINT}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Source chain</span>
                  <select
                    value={fromChain}
                    onChange={(e) => handleChainChange(e.target.value as ChainKey)}
                    className="h-12 rounded-2xl border border-white/10 bg-[#101617] px-4 text-sm text-white outline-none focus:border-emerald-400/60"
                  >
                    {SOURCE_CHAINS.map((chain) => (
                      <option key={chain.key} value={chain.key}>
                        {chain.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Source token</span>
                  <select
                    value={fromToken}
                    onChange={(e) => setFromToken(e.target.value)}
                    className="h-12 rounded-2xl border border-white/10 bg-[#101617] px-4 text-sm text-white outline-none focus:border-emerald-400/60"
                  >
                    {selectedChain.tokens.map((token) => (
                      <option key={token.address} value={token.address}>
                        {token.symbol}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_220px]">
                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Amount</span>
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={`Enter ${selectedToken.symbol} amount`}
                    className="h-12 rounded-2xl border border-white/10 bg-[#101617] px-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/60"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-medium text-zinc-300">Slippage</span>
                  <select
                    value={slippageBps}
                    onChange={(e) => setSlippageBps(Number(e.target.value))}
                    className="h-12 rounded-2xl border border-white/10 bg-[#101617] px-4 text-sm text-white outline-none focus:border-emerald-400/60"
                  >
                    <option value={50}>0.50%</option>
                    <option value={100}>1.00%</option>
                    <option value={150}>1.50%</option>
                    <option value={300}>3.00%</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-zinc-300">Solana destination address</span>
                <input
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="Paste the Solana wallet that should receive YST"
                  className="h-12 rounded-2xl border border-white/10 bg-[#101617] px-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-emerald-400/60"
                />
              </label>

              <div className="grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
                <p>
                  Source family: <span className="text-zinc-100">{selectedChain.family === "evm" ? "EVM" : "BTC-like"}</span>
                </p>
                <p>
                  Route target: <span className="text-zinc-100">$YST on Solana</span>
                </p>
                <p>
                  Status: <span className="text-emerald-300">{status}</span>
                </p>
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleQuote}
                  disabled={loadingQuote}
                  className={classNames(
                    "inline-flex h-12 items-center justify-center rounded-2xl px-5 text-sm font-medium transition",
                    loadingQuote
                      ? "cursor-not-allowed bg-zinc-700 text-zinc-300"
                      : "bg-emerald-400 text-[#051112] hover:bg-emerald-300"
                  )}
                >
                  {loadingQuote ? "Getting quote..." : "Get quote"}
                </button>

                <button
                  onClick={handleSwap}
                  disabled={executing || !quote}
                  className={classNames(
                    "inline-flex h-12 items-center justify-center rounded-2xl border px-5 text-sm font-medium transition",
                    executing || !quote
                      ? "cursor-not-allowed border-white/10 bg-white/5 text-zinc-500"
                      : "border-white/15 bg-white/5 text-white hover:border-emerald-400/40 hover:bg-white/10"
                  )}
                >
                  {executing ? "Preparing swap..." : "Start swap"}
                </button>
              </div>
            </div>
          </div>

          <aside className="grid gap-6">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">Quote preview</h2>
              <div className="mt-5 grid gap-4 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Expected YST out</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{quote?.estimatedOut ?? "--"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-zinc-500">Min received</p>
                    <p className="mt-1 text-white">{quote?.minOut ?? "--"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-zinc-500">ETA</p>
                    <p className="mt-1 text-white">{quote?.etaSeconds ? `${quote.etaSeconds}s` : "--"}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Provider</p>
                  <p className="mt-1 text-white">{quote?.provider ?? "--"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-zinc-500">Bridge / route fee</p>
                  <p className="mt-1 text-white">{quote?.bridgeFeeUsd ? `$${quote.bridgeFeeUsd}` : "--"}</p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <h2 className="text-lg font-medium text-white">Claude handoff notes</h2>
              <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
                <p>
                  Replace the mock quote and swap helpers with your backend route service so secrets, relayer logic,
                  and provider-specific SDK calls stay server-side.
                </p>
                <p>
                  Keep the destination token locked to YST for now. If you later want a general swap terminal, make
                  output token configurable and preserve YST as the default highlighted route.
                </p>
                <p>
                  Add wallet connectors per source chain family. EVM chains should use your preferred wallet stack,
                  while Bitcoin should use a provider-specific flow if supported by your routing backend.
                </p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
