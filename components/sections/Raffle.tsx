'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

interface RaffleEntry {
  id: number;
  name: string;
  ticketPrice: string;
  maxTickets: number;
  endDate: string;
  wallet: string;
  announce: string;
  ticketsSold: number;
}

const MOCK_ACTIVE: RaffleEntry[] = [];

export default function Raffle({ walletConnected, ystBalance, onNavigate }: Props) {
  const [activeRaffles, setActiveRaffles] = useState<RaffleEntry[]>(MOCK_ACTIVE);
  const [rfName, setRfName] = useState('');
  const [rfPrice, setRfPrice] = useState('');
  const [rfMax, setRfMax] = useState('');
  const [rfEnd, setRfEnd] = useState('');
  const [rfWallet, setRfWallet] = useState('7P7xYDAyeV13vumm8QK9Ns2nV5ZFJJB7n2NCCKmtNMMB');
  const [rfAnnounce, setRfAnnounce] = useState('');
  const [rfStatus, setRfStatus] = useState('');

  const raffleCreate = () => {
    if (!rfName || !rfPrice || !rfMax || !rfEnd || !rfWallet) {
      setRfStatus('â  Please fill in all fields.');
      return;
    }
    if (!walletConnected) {
      setRfStatus('â  Connect your wallet first.');
      return;
    }
    const newRaffle: RaffleEntry = {
      id: Date.now(),
      name: rfName,
      ticketPrice: rfPrice,
      maxTickets: parseInt(rfMax),
      endDate: rfEnd,
      wallet: rfWallet,
      announce: rfAnnounce,
      ticketsSold: 0,
    };
    setActiveRaffles(r => [...r, newRaffle]);
    setRfName(''); setRfPrice(''); setRfMax(''); setRfEnd(''); setRfAnnounce('');
    setRfStatus('â Raffle launched! Go live instantly after 0.05 SOL fee is confirmed.');
    setTimeout(() => setRfStatus(''), 5000);
  };

  const formatEnd = (dateStr: string) => {
    if (!dateStr) return 'â';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    if (diff <= 0) return 'ENDED';
    const days = Math.floor(diff / 86400000);
    const hrs = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hrs}h`;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  if (!hasAccess) return (
    <div className="sec-pad">
      <div className="locked-overlay">
        <div className="locked-icon">ð</div>
        <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
        <div className="locked-sub">
          Connect your wallet and hold <strong>10,000,000 $YST</strong> to unlock this tool.
        </div>
        <a className="btn btn-gold" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">
          Get $YST
        </a>
      </div>
    </div>
  );


  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">YAKK â NFT RAFFLE ENGINE</div>
      <div className="sec-title">NFT Raffles ðï¸</div>
      <div className="sec-bar" />

      <p style={{ color: 'var(--muted)', maxWidth: 580, marginBottom: 24, fontSize: 13, lineHeight: 1.8 }}>
        Create a raffle for your NFT. Set the prize, ticket price in SOL, and max tickets. Winners picked on-chain via verifiable randomness. All payments go directly to your wallet.
      </p>

      {/* Active Raffles */}
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        ACTIVE RAFFLES
        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', fontWeight: 400 }}>{activeRaffles.length} live</span>
      </div>

      <div className="raffle-grid" style={{ marginBottom: 28 }}>
        {activeRaffles.length === 0 ? (
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', padding: '28px 0', gridColumn: '1 / -1', textAlign: 'center' }}>
            No active raffles yet. Create one below. ð
          </div>
        ) : (
          activeRaffles.map(r => (
            <div key={r.id} className="card" style={{ padding: '16px 18px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{r.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>TICKET PRICE</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--gold)' }}>{r.ticketPrice} SOL</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>TICKETS</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>{r.ticketsSold}/{r.maxTickets}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--dim)' }}>ENDS IN</div>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>{formatEnd(r.endDate)}</div>
                </div>
              </div>
              <div className="prog-bar" style={{ marginBottom: 10 }}>
                <div className="prog-fill" style={{ width: Math.min(100, (r.ticketsSold / r.maxTickets) * 100) + '%' }} />
              </div>
              <button className="btn btn-gold" style={{ fontSize: 11, width: '100%', justifyContent: 'center' }}>
                ðï¸ Buy Ticket â {r.ticketPrice} SOL
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Raffle */}
      <div className="raffle-create-card">
        <div className="raffle-create-title">ðï¸ Create a Raffle</div>
        <div className="raffle-create-sub">Fill in the details, pay a 0.05 SOL setup fee to YAKK Studios, and your raffle goes live instantly. Ticket payments go straight to your wallet.</div>

        <label className="field-lbl" style={{ marginTop: 0 }}>NFT NAME / PRIZE DESCRIPTION</label>
        <input
          className="field-inp"
          id="rf-name"
          type="text"
          placeholder="e.g. YAKK Genesis #001 â 1/1 hand-drawn"
          value={rfName}
          onChange={e => setRfName(e.target.value)}
        />

        <label className="field-lbl">TICKET PRICE (SOL)</label>
        <input
          className="field-inp"
          id="rf-price"
          type="number"
          step={0.01}
          min={0.01}
          placeholder="0.1"
          value={rfPrice}
          onChange={e => setRfPrice(e.target.value)}
        />

        <label className="field-lbl">MAX TICKETS</label>
        <input
          className="field-inp"
          id="rf-max"
          type="number"
          step={1}
          min={2}
          max={1000}
          placeholder="100"
          value={rfMax}
          onChange={e => setRfMax(e.target.value)}
        />

        <label className="field-lbl">RAFFLE ENDS</label>
        <input
          className="field-inp"
          id="rf-end"
          type="datetime-local"
          value={rfEnd}
          onChange={e => setRfEnd(e.target.value)}
        />

        <label className="field-lbl">YOUR WALLET (RECEIVES TICKET PAYMENTS)</label>
        <input
          className="field-inp"
          id="rf-wallet"
          type="text"
          placeholder="Your Solana wallet address"
          value={rfWallet}
          onChange={e => setRfWallet(e.target.value)}
        />

        <label className="field-lbl">WINNER ANNOUNCEMENT (X LINK OR NOTE)</label>
        <input
          className="field-inp"
          id="rf-announce"
          type="text"
          placeholder="https://x.com/YAKKStudios or 'DM on X'"
          value={rfAnnounce}
          onChange={e => setRfAnnounce(e.target.value)}
        />

        <div style={{ background: 'rgba(247,201,72,0.07)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 7, padding: '11px 14px', margin: '14px 0', fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--gold)' }}>Setup fee: 0.05 SOL</strong> â YAKK Studios treasury.<br />
          All ticket sales go directly to your wallet. Winner drawn on-chain at close time.
        </div>

        <button
          id="rf-create-btn"
          className="btn btn-gold"
          style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: 11 }}
          onClick={raffleCreate}
        >
          ðï¸ PAY 0.05 SOL &amp; LAUNCH RAFFLE
        </button>

        {rfStatus && (
          <div className="inv-status" style={{ marginTop: 10, fontSize: 12, color: rfStatus.startsWith('â') ? 'var(--green)' : 'var(--red)', fontFamily: 'Space Mono,monospace' }}>
            {rfStatus}
          </div>
        i}
      </div>
    </div>
  );
}
