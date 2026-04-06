'use client';

/**
 * /locked — Token gate landing page.
 *
 * Middleware redirects here when `yst_access` cookie is absent.
 * Flow: connect wallet → sign message → POST /api/gate-check → redirect to original path.
 *
 * Signing proves wallet ownership without any transaction / gas fees.
 * The message format is: YAKK_ACCESS:<pubkey>:<nonce>:<timestamp>
 */

import { Suspense, useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter, useSearchParams } from 'next/navigation';

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = 'idle' | 'signing' | 'verifying' | 'success' | 'denied' | 'error';

// ── Helpers ───────────────────────────────────────────────────────────────────
function uint8ToBase64(arr: Uint8Array): string {
  let binary = '';
  arr.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

// ── Inner content (needs useSearchParams → must be inside Suspense) ───────────
function LockedContent() {
  const { publicKey, signMessage, connected } = useWallet();
  const router   = useRouter();
  const params   = useSearchParams();
  const from     = params.get('from') ?? '/dashboard';

  const [status,  setStatus]  = useState<Status>('idle');
  const [errMsg,  setErrMsg]  = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [tier,    setTier]    = useState<string>('');

  // Prevent double-fire on strict mode double-mount
  const verifying = useRef(false);

  useEffect(() => {
    if (connected && publicKey && signMessage && status === 'idle' && !verifying.current) {
      void runVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, publicKey, signMessage]);

  async function runVerification() {
    if (!publicKey || !signMessage || verifying.current) return;
    verifying.current = true;
    setStatus('signing');
    setErrMsg('');

    try {
      // 1. Build signed message
      const nonce     = crypto.randomUUID();
      const timestamp = Date.now();
      const message   = `YAKK_ACCESS:${publicKey.toBase58()}:${nonce}:${timestamp}`;
      const encoded   = new TextEncoder().encode(message);

      let sigBytes: Uint8Array;
      try {
        sigBytes = await signMessage(encoded);
      } catch {
        setErrMsg('Signing cancelled. Click "Retry" to try again.');
        setStatus('error');
        verifying.current = false;
        return;
      }

      const signature = uint8ToBase64(sigBytes);
      setStatus('verifying');

      // 2. Submit to gate-check
      const res = await fetch('/api/gate-check', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          message,
          signature,
          nonce,
          timestamp,
        }),
      });

      const data = await res.json().catch(() => ({})) as {
        access?: boolean;
        tier?: string;
        balance?: number;
        error?: string;
      };

      if (res.ok && data.access) {
        setTier(data.tier ?? '');
        setStatus('success');
        // Short delay so user sees the success state before redirect
        setTimeout(() => router.push(from), 800);
      } else if (res.status === 403) {
        setBalance(data.balance ?? 0);
        setStatus('denied');
        verifying.current = false;
      } else {
        setErrMsg(data.error ?? 'Verification failed — please try again.');
        setStatus('error');
        verifying.current = false;
      }
    } catch {
      setErrMsg('Network error. Check your connection and retry.');
      setStatus('error');
      verifying.current = false;
    }
  }

  function handleRetry() {
    verifying.current = false;
    setStatus('idle');
    // Small tick to let state settle, then re-trigger
    setTimeout(() => {
      if (connected && publicKey && signMessage) void runVerification();
    }, 50);
  }

  const isBusy   = status === 'signing' || status === 'verifying' || status === 'success';
  const canRetry = status === 'error' || status === 'denied';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: 'Syne, sans-serif',
    }}>

      {/* ── Brand header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 38, marginBottom: 10 }}>🔐</div>
        <div style={{
          fontFamily:  'Syne, sans-serif',
          fontWeight:  900,
          fontSize:    28,
          letterSpacing: '0.06em',
          background:  'linear-gradient(135deg, var(--pink), var(--gold))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          marginBottom: 6,
        }}>
          YAKK STUDIOS
        </div>
        <div style={{
          fontFamily:   'Space Mono, monospace',
          fontSize:     9,
          color:        'var(--dim)',
          letterSpacing: '0.16em',
        }}>
          HOLDER ACCESS REQUIRED
        </div>
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div style={{
        background:   'var(--bg2)',
        border:       '1px solid var(--border)',
        borderRadius: 14,
        padding:      '32px 28px',
        maxWidth:     440,
        width:        '100%',
        textAlign:    'center',
      }}>

        {/* idle + not connected */}
        {status === 'idle' && !connected && (
          <>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6, lineHeight: 1.7 }}>
              Connect your wallet to verify $YST holdings and access YAKK tools.
            </p>
            <p style={{
              fontFamily:   'Space Mono, monospace',
              fontSize:     9,
              color:        'var(--dim)',
              letterSpacing: '0.12em',
              marginBottom: 24,
            }}>
              MINIMUM: 250,000 $YST
            </p>
          </>
        )}

        {/* idle + connected (waiting to trigger) */}
        {status === 'idle' && connected && (
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
            Wallet connected. Preparing signature request...
          </p>
        )}

        {/* signing */}
        {status === 'signing' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>✍️</div>
            <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Approve in wallet
            </div>
            <div style={{ color: 'var(--dim)', fontSize: 11, lineHeight: 1.6 }}>
              Sign the message in Phantom to prove wallet ownership.
              <br />No transaction — no SOL spent.
            </div>
          </div>
        )}

        {/* verifying */}
        {status === 'verifying' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>⏳</div>
            <div style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Checking $YST balance...
            </div>
            <div style={{ color: 'var(--dim)', fontSize: 11 }}>
              Querying on-chain holdings via Helius RPC.
            </div>
          </div>
        )}

        {/* success */}
        {status === 'success' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
            <div style={{ color: 'var(--green, #4ade80)', fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
              Access Granted
            </div>
            {tier && (
              <div style={{
                display: 'inline-block',
                padding: '3px 10px',
                background: tier === 'WHALE' ? 'rgba(247,201,72,0.12)' : 'rgba(74,222,128,0.08)',
                border: `1px solid ${tier === 'WHALE' ? 'rgba(247,201,72,0.3)' : 'rgba(74,222,128,0.2)'}`,
                borderRadius: 20,
                fontFamily: 'Space Mono, monospace',
                fontSize: 9,
                color: tier === 'WHALE' ? 'var(--gold)' : 'var(--green, #4ade80)',
                letterSpacing: '0.1em',
                marginBottom: 10,
              }}>
                {tier === 'WHALE' ? '🐋 WHALE TIER' : '🪙 HOLDER TIER'}
              </div>
            )}
            <div style={{ color: 'var(--dim)', fontSize: 11 }}>Redirecting...</div>
          </div>
        )}

        {/* denied — insufficient $YST */}
        {status === 'denied' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>🚫</div>
            <div style={{ color: 'var(--pink)', fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
              Insufficient $YST
            </div>
            {balance !== null && (
              <div style={{
                fontFamily:   'Space Mono, monospace',
                fontSize:     11,
                color:        'var(--muted)',
                marginBottom: 4,
              }}>
                Your balance: {balance.toLocaleString()} $YST
              </div>
            )}
            <div style={{ color: 'var(--dim)', fontSize: 11, marginBottom: 20 }}>
              Required: 250,000 $YST
            </div>
            <a
              href="https://jup.ag/swap/SOL-YST"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{ display: 'inline-block', marginBottom: 12, textDecoration: 'none' }}
            >
              Get $YST on Jupiter →
            </a>
          </div>
        )}

        {/* error */}
        {status === 'error' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 26, marginBottom: 10 }}>⚠️</div>
            <div style={{ color: 'var(--pink)', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
              Verification Error
            </div>
            <div style={{ color: 'var(--dim)', fontSize: 11 }}>{errMsg}</div>
          </div>
        )}

        {/* ── Wallet button / address display ────────────────────────────── */}
        {!connected ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WalletMultiButton />
          </div>
        ) : (
          <div>
            {/* Address badge */}
            <div style={{
              fontFamily:   'Space Mono, monospace',
              fontSize:     9,
              color:        'var(--dim)',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              {publicKey?.toBase58().slice(0, 8)}...{publicKey?.toBase58().slice(-8)}
            </div>

            {/* Retry / disconnect */}
            {!isBusy && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                {canRetry && (
                  <button className="btn btn-pink" onClick={handleRetry}>
                    Retry Verification →
                  </button>
                )}
                <WalletMultiButton />
              </div>
            )}
          </div>
        )}

        {/* ── Security note ───────────────────────────────────────────────── */}
        <div style={{
          marginTop:    24,
          paddingTop:   16,
          borderTop:    '1px solid var(--border)',
          fontFamily:   'Space Mono, monospace',
          fontSize:     9,
          color:        'var(--dim)',
          lineHeight:   1.7,
          letterSpacing: '0.04em',
        }}>
          🔑 Ed25519 signature proof — no transaction, no gas.
          <br />
          Your private key never leaves your wallet.
        </div>
      </div>

      {/* ── Back link ─────────────────────────────────────────────────────── */}
      <div style={{ marginTop: 20 }}>
        <a href="/" style={{
          color:          'var(--dim)',
          fontSize:       11,
          textDecoration: 'none',
          fontFamily:     'Space Mono, monospace',
          letterSpacing:  '0.08em',
        }}>
          ← BACK TO HOME
        </a>
      </div>

    </div>
  );
}

// ── Page export — Suspense required for useSearchParams in Next.js 14 ─────────
export default function LockedPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Space Mono, monospace',
        fontSize: 11,
        color: 'var(--dim)',
        letterSpacing: '0.08em',
      }}>
        LOADING...
      </div>
    }>
      <LockedContent />
    </Suspense>
  );
}
