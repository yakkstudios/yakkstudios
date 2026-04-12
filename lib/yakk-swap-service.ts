export type QuoteRequest = {
  fromChain: string;
  toChain: "solana";
  fromToken: string;
  toToken: string;
  amount: string;
  destinationAddress: string;
  slippageBps: number;
};

export type QuoteResponse = {
  provider: "mayan" | "wormhole" | "mock";
  routeId: string;
  estimatedOut: string;
  minOut: string;
  bridgeFeeUsd?: string;
  etaSeconds?: number;
  raw?: unknown;
};

export type SwapResponse = {
  provider: string;
  routeId: string;
  approvalTarget?: string;
  txRequest?: unknown;
  raw?: unknown;
};

const MAYAN_API_BASE = process.env.MAYAN_API_BASE || "https://explorer-api.mayan.finance";

export async function getQuote(request: QuoteRequest): Promise<QuoteResponse> {
  const routeProvider = process.env.YAKK_SWAP_PROVIDER || "mock";

  if (routeProvider === "mock") {
    const amount = Number(request.amount || "0");
    const estimatedOut = amount > 0 ? (amount * 97.5).toFixed(4) : "0";
    return {
      provider: "mock",
      routeId: `mock-${Date.now()}`,
      estimatedOut,
      minOut: (Number(estimatedOut) * 0.995).toFixed(4),
      bridgeFeeUsd: amount > 0 ? "4.20" : "0",
      etaSeconds: 180,
      raw: { note: "Replace mock provider with real provider integration." },
    };
  }

  if (routeProvider === "mayan") {
    return quoteWithMayan(request);
  }

  throw new Error(`Unsupported provider: ${routeProvider}`);
}

export async function createSwap(request: QuoteRequest & { routeId?: string }): Promise<SwapResponse> {
  const routeProvider = process.env.YAKK_SWAP_PROVIDER || "mock";

  if (routeProvider === "mock") {
    return {
      provider: "mock",
      routeId: request.routeId || `mock-${Date.now()}`,
      raw: {
        note: "Replace this with provider-specific transaction building and wallet execution.",
        request,
      },
    };
  }

  if (routeProvider === "mayan") {
    return {
      provider: "mayan",
      routeId: request.routeId || `mayan-${Date.now()}`,
      raw: {
        note: "Wire Mayan SDK or widget execution here. Keep API keys and signing logic server-side if required.",
        request,
      },
    };
  }

  throw new Error(`Unsupported provider: ${routeProvider}`);
}

async function quoteWithMayan(request: QuoteRequest): Promise<QuoteResponse> {
  const url = new URL(`${MAYAN_API_BASE}/v3/quote`);
  url.searchParams.set("fromChain", request.fromChain);
  url.searchParams.set("toChain", request.toChain);
  url.searchParams.set("fromToken", request.fromToken);
  url.searchParams.set("toToken", request.toToken);
  url.searchParams.set("amount", request.amount);
  url.searchParams.set("slippageBps", String(request.slippageBps));
  url.searchParams.set("destAddr", request.destinationAddress);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Mayan quote request failed.");
  }

  const data = await response.json();

  return {
    provider: "mayan",
    routeId: data.routeId || `mayan-${Date.now()}`,
    estimatedOut: String(data.expectedAmountOut ?? data.toAmount ?? "0"),
    minOut: String(data.minAmountOut ?? data.minToAmount ?? "0"),
    bridgeFeeUsd: data.bridgeFeeUsd ? String(data.bridgeFeeUsd) : undefined,
    etaSeconds: typeof data.etaSeconds === "number" ? data.etaSeconds : undefined,
    raw: data,
  };
}
