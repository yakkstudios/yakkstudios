'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  walletConnected: boolean;
  walletAddress?: string;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

const WHALE_THRESHOLD = 10_000_000;

// ── Whale Perks ────────────────────────────────────────────────────────────
const PERKS = [
  {
    icon: '🎙️',
    title: 'Private Voice Lounge',
    desc: 'Real-time encrypted voice chat with verified 10M+ holders. Alpha calls, deal flow, private raids.',
  },
  {
    icon: '📡',
    title: 'Whale-Only Signals',
    desc: 'Direct feed of large wallet movements, early token unlocks, and institutional-scale on-chain activity.',
  },
  {
    icon: '💎',
    title: 'Rev-Share Priority',
    desc: 'Whales receive enhanced rev-share weighting. The more you hold, the more you earn from platform fees.',
  },
  {
    icon: '🗳️',
    title: 'Protocol Governance',
    desc: 'Shape the future of YAKK Studios. Vote on new tools, fee structures, and ecosystem partnerships.',
  },
  {
    icon: '🤝',
    title: 'OTC Deal Desk',
    desc: 'Private OTC matching for large block trades. No slippage, no public order book exposure.',
  },
  {
    icon: '🚀',
    title: 'Launchpad Early Access',
    desc: 'First allocation rights on YAKK Ventures projects — before any public or presale announcements.',
  },
];

// ── Voice Room ─────────────────────────────────────────────────────────────
interface Participant {
  identity: string;
  isSpeaking: boolean;
  isMuted: boolean;
}

function VoiceLounge({ walletAddress }: { walletAddress: string }) {
  const [status, setStatus]           = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMsg, setErrorMsg]       = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isMuted, setIsMuted]         = useState(false);
  const [isSpeaking, setIsSpeaking]   = useState(false);
  const roomRef = useRef<any>(null);

  const identity = walletAddress
    ? walletAddress.slice(0, 4) + '...' + walletAddress.slice(-4)
    : 'whale-anon-' + Math.random().toString(36).slice(2, 6);

  const joinRoom = useCallback(async () => {
    setStatus('connecting');
    setErrorMsg('');
    try {
      // Fetch LiveKit token from our API
      const res = await fetch('/api/voice-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity, room: 'whale-lounge' }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? 'Failed to get voice token.');
        setStatus('error');
        return;
      }

      // Dynamically import livekit-client to keep bundle lean
      const { Room, RoomEvent, Track } = await import('livekit-client');
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      // Track participants
      const updateParticipants = () => {
        const parts: Participant[] = [];
        room.remoteParticipants.forEach((p: any) => {
          parts.push({
            identity: p.identity,
            isSpeaking: p.isSpeaking,
            isMuted: !p.isMicrophoneEnabled,
          });
        });
        // Add local
        parts.unshift({
          identity: identity + ' (you)',
          isSpeaking: isSpeaking,
          isMuted: isMuted,
        });
        setParticipants(parts);
      };

      room.on(RoomEvent.ParticipantConnected, updateParticipants);
      room.on(RoomEvent.ParticipantDisconnected, updateParticipants);
      room.on(RoomEvent.ActiveSpeakersChanged, updateParticipants);
      room.on(RoomEvent.TrackMuted, updateParticipants);
      room.on(RoomEvent.TrackUnmuted, updateParticipants);
      room.on(RoomEvent.Disconnected, () => setStatus('idle'));

      await room.connect(data.url, data.token);
      await room.localParticipant.setMicrophoneEnabled(true);
      setStatus('connected');
      updateParticipants();
    } catch (err: any) {
      setErrorMsg(err?.message ?? 'Could not connect to voice room.');
      setStatus('error');
    }
  }, [identity, isMuted, isSpeaking]);

  const leaveRoom = useCallback(async () => {
    if (roomRef.current) {
      await roomRef.current.disconnect();
      roomRef.current = null;
    }
    setParticipants([]);
    setStatus('idle');
  }, []);

  const toggleMute = useCallback(async () => {
    if (roomRef.current) {
      const local = roomRef.current.localParticipant;
      await local.setMicrophoneEnabled(isMuted);
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { leaveRoom(); };
  }, [leaveRoom]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,0,0,0) 60%)',
      border: '1px solid rgba(0,255,136,0.2)',
      borderRadius: 12,
      padding: 24,
      marginBottom: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>🎙️</span>
        <div>
          <h3 style={{ margin: 0, color: 'var(--gold)', fontFamily: 'var(--font-mono)', fontSize: 15 }}>
            WHALE VOICE LOUNGE
          </h3>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 12 }}>
            Encrypted · 10M+ $YST holders only · No logs
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {status === 'connected' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,255,136,0.15)', color: '#00ff88',
              borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 700,
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#00ff88',
                animation: 'pulse 1.5s infinite',
              }} />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* Participants */}
      {status === 'connected' && participants.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            {participants.length} whale{participants.length !== 1 ? 's' : ''} in room
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {participants.map((p, i) => (
              <div key={i} style={{
                background: p.isSpeaking ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.04)',
                border: p.isSpeaking ? '1px solid #00ff88' : '1px solid var(--border)',
                borderRadius: 20, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: p.isSpeaking ? '#00ff88' : 'var(--fg)',
                transition: 'all 0.2s',
              }}>
                <span>{p.isMuted ? '🔇' : '🎤'}</span>
                {p.identity}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{
          background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
          borderRadius: 8, padding: '12px 16px', marginBottom: 16,
          color: '#ff8080', fontSize: 13,
        }}>
          {errorMsg}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {status !== 'connected' ? (
          <button
            onClick={joinRoom}
            disabled={status === 'connecting'}
            style={{
              background: status === 'connecting' ? 'rgba(0,255,136,0.1)' : 'rgba(0,255,136,0.15)',
              border: '1px solid rgba(0,255,136,0.4)',
              color: '#00ff88', borderRadius: 8, padding: '10px 20px',
              fontSize: 13, fontWeight: 700, cursor: status === 'connecting' ? 'wait' : 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {status === 'connecting' ? 'CONNECTING...' : 'JOIN VOICE LOUNGE'}
          </button>
        ) : (
          <>
            <button
              onClick={toggleMute}
              style={{
                background: isMuted ? 'rgba(255,80,80,0.15)' : 'rgba(0,255,136,0.1)',
                border: isMuted ? '1px solid rgba(255,80,80,0.4)' : '1px solid rgba(0,255,136,0.3)',
                color: isMuted ? '#ff8080' : '#00ff88',
                borderRadius: 8, padding: '10px 18px', fontSize: 13,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              {isMuted ? '🔇 UNMUTE' : '🎤 MUTE'}
            </button>
            <button
              onClick={leaveRoom}
              style={{
                background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
                color: '#ff8080', borderRadius: 8, padding: '10px 18px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}
            >
              LEAVE ROOM
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function WhaleClub({ walletConnected, walletAddress, ystBalance, onNavigate }: Props) {
  const isWhale = ystBalance >= WHALE_THRESHOLD;

  // ── Gate: not connected ──
  if (!walletConnected) {
    return (
      <div className="section-container">
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '80px auto' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐋</div>
          <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
            WHALE CLUB
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
            Connect your wallet to verify your $YST balance. Whale Club requires
            holding{' '}
            <strong style={{ color: 'var(--fg)' }}>10,000,000 $YST</strong> or more.
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('wallet')}>
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  // ── Gate: not a whale ──
  if (!isWhale) {
    const needed = WHALE_THRESHOLD - ystBalance;
    const pct    = Math.min(100, (ystBalance / WHALE_THRESHOLD) * 100);
    return (
      <div className="section-container">
        <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐋</div>
          <h2 style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>
            WHALE CLUB
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
            You hold{' '}
            <strong style={{ color: 'var(--fg)' }}>
              {ystBalance.toLocaleString()} $YST
            </strong>
            . Whale Club requires{' '}
            <strong style={{ color: 'var(--gold)' }}>10M $YST</strong>.
            You need{' '}
            <strong style={{ color: 'var(--fg)' }}>
              {needed.toLocaleString()} more
            </strong>{' '}
            to enter.
          </p>
          {/* Progress bar */}
          <div style={{
            background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 8,
            marginBottom: 24, overflow: 'hidden',
          }}>
            <div style={{
              width: pct + '%', height: '100%',
              background: 'linear-gradient(90deg, var(--gold), #00ff88)',
              borderRadius: 8, transition: 'width 0.5s ease',
            }} />
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 24 }}>
            {pct.toFixed(1)}% of the way there
          </p>
          <a
            href="https://raydium.io/swap/?outputMint=jYwmSavfx69a35JEkpyrxu9JUjvswEvfnhLCDV9vREV"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Buy More $YST
          </a>
        </div>
      </div>
    );
  }

  // ── Full Whale View ──
  return (
    <div className="section-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <span style={{ fontSize: 40 }}>🐋</span>
          <div>
            <h1 style={{
              margin: 0, fontSize: 26, fontFamily: 'var(--font-mono)',
              color: 'var(--gold)', letterSpacing: 2,
            }}>
              WHALE CLUB
            </h1>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>
              Verified 10M+ $YST holder — welcome to the deep end
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span style={{
              background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
              color: 'var(--gold)', borderRadius: 20, padding: '6px 16px',
              fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)',
            }}>
              {ystBalance.toLocaleString()} $YST
            </span>
          </div>
        </div>
      </div>

      {/* Voice Lounge */}
      <VoiceLounge walletAddress={walletAddress ?? 'whale-anon'} />

      {/* Perks Grid */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{
          fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--muted)',
          letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20,
        }}>
          WHALE PERKS
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {PERKS.map((perk, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 22px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,215,0,0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{perk.icon}</div>
              <h3 style={{
                margin: '0 0 8px', fontSize: 13, fontWeight: 700,
                fontFamily: 'var(--font-mono)', color: 'var(--fg)',
              }}>
                {perk.title}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                {perk.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p style={{ color: 'var(--muted)', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
        Whale Club perks expand as the platform grows. Future staking rewards via{' '}
        <a href="https://stakepoint.app" target="_blank" rel="noopener noreferrer"
          style={{ color: 'var(--gold)' }}>
          StakePoint
        </a>
        {' '}will further amplify your position.
      </p>
    </div>
  );
    }
