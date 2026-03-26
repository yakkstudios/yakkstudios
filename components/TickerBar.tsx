'use client';
import { useEffect, useState, useCallback } from 'react';

interface PriceData {
  symbol: string;
  price: string;
  change24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
}

interface TickerBarProps {
  onConnectWallet: () => void;
  walletConnected: boolean;
  walletLabel: string;
}

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000)     return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)         return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function formatPrice(p: string): string {
  const n = parseFloat(p);
  if (!n) return '$0.00';
  if (n < 0.000001) return '$' + n.toExponential(2);   // $1.23e-7
  if (n < 0.0001)   return '$' + n.toFixed(7);          // $0.0000456
  if (n < 0.01)     return '$' + n.toFixed(5);          // $0.00456
  if (n < 1)        return '$' + n.toFixed(4);          // $0.4567
  return '$' + n.toFixed(4);                             // $1.2345
}

export default function TickerBar({
  onConnectWallet,
  walletConnected,
  walletLabel,
}: TickerBarProps) {
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/price');
      if (!res.ok) throw new Error('bad response');
      const json = await res.json();
      setData(json);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, 30_000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  const changeClass = data ? (data.change24h >= 0 ? 'up' : 'down') : '';
  const changeSign  = data && data.change24h >= 0 ? '+' : '';

  return (
    <div id="ticker-bar">
      {/* Ticker 1 – price */}
      <span className="tick-inner" id="t1">
        <span className="tick-label">$YST</span>
        <span className="tick-price">
          {loading ? '...' : error ? 'N/A' : formatPrice(data?.price ?? '0')}
        </span>
        {data && (
          <span className={`tick-change ${changeClass}`}>
            {changeSign}{data.change24h.toFixed(2)}%
          </span>
        )}
      </span>

      {/* Ticker 2 – market data (hidden on mobile via CSS) */}
      <span className="tick-inner" id="t2">
        <span className="tick-label">MCAP</span>
        <span className="tick-mcap">
          {loading ? '...' : error ? 'N/A' : formatNum(data?.marketCap ?? 0)}
        </span>
        <span className="tick-label" style={{ marginLeft: 8 }}>VOL</span>
        <span className="tick-mcap">
          {loading ? '...' : error ? 'N/A' : formatNum(data?.volume24h ?? 0)}
        </span>
      </span>

      {/* Wallet button */}
      <div className="tick-wallet-area">
        <button
          className={`btn ${walletConnected ? 'btn-ghost' : 'btn-primary'} btn-sm`}
          onClick={onConnectWallet}
        >
          {walletConnected ? walletLabel : 'CONNECT WALLET'}
        </button>
      </div>
    </div>
  );
}
