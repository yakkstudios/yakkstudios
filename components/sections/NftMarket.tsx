'use client';
import { useState } from 'react';

const CHAINS = [
  { id: 'solana', label: 'Solana', icon: '◎', color: '#9945FF', live: true },
  { id: 'ethereum', label: 'Ethereum', icon: 'Ξ', color: '#627EEA', live: false },
  { id: 'polygon', label: 'Polygon', icon: '⬡', color: '#8247E5', live: false },
  { id: 'base', label: 'Base', icon: '🔵', color: '#0052FF', live: false },
  { id: 'arbitrum', label: 'Arbitrum', icon: '🔷', color: '#12AAFF', live: false },
  { id: 'bnb', label: 'BNB Chain', icon: '●', color: '#F0B90B', live: false },
];

const SORT_OPTIONS = ['RECENT', 'PRICE: LOW', 'PRICE: HIGH', 'TRENDING'];

interface NFT {
  id: string;
  name: string;
  collection: string;
  price: string;
  chain: string;
}

// Placeholder NFTs — will be replaced by live data once multi-chain APIs connected
const MOCK_NFTS: NFT[] = [
  { id: '1', name: 'YAKK #001', collection: 'YAKKS', price: '2.5 SOL', chain: 'solana' },
  { id: '2', name: 'YAKK #042', collection: 'YAKKS', price: '3.1 SOL', chain: 'solana' },
  { id: '3', name: 'YAKK #187', collection: 'YAKKS', price: '1.8 SOL', chain: 'solana' },
];

export default function NftMarket({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const [activeChain, setActiveChain] = useState('solana');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('RECENT');
  const [selected, setSelected] = useState<NFT | null>(null);

  const filtered = MOCK_NFTS.filter(n =>
    n.chain === activeChain &&
    (search === '' || n.name.toLowerCase().includes(search.toLowerCase()) || n.collection.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <section id="section-nftmarket" style={{ padding: '20px' }}>

      {/* Header */}
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>
        🖼 NFT MARKET
      </h2>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
        Buy, sell and explore NFTs across 6 chains — no KYC, your keys your money.
      </p>

      {/* Chain selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {CHAINS.map(({ id, label, icon, color, live }) => (
          <button
            key={id}
            onClick={() => live && setActiveChain(id)}
            style={{
              background: activeChain === id ? color + '22' : '#0d0d0d',
              border: `1px solid ${activeChain === id ? color : '#1a1a1a'}`,
              color: activeChain === id ? color : '#555',
              padding: '5px 12px', borderRadius: 20, cursor: live ? 'pointer' : 'default',
              fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
              opacity: live ? 1 : 0.4,
            }}>
            <span>{icon}</span>
            <span>{label}</span>
            {live && <span style={{ fontSize: 9, color: '#00c896', marginLeft: 2 }}>✓</span>}
            {!live && <span style={{ fontSize: 9, color: '#444', marginLeft: 2 }}>soon</span>}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search collections or NFTs…"
          style={{
            flex: 1, minWidth: 180, background: '#111', border: '1px solid #1a1a1a',
            borderRadius: 4, color: '#ccc', padding: '8px 12px', fontSize: 12, outline: 'none',
          }}
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ background: '#111', border: '1px solid #1a1a1a', color: '#888', padding: '8px 10px', borderRadius: 4, fontSize: 11, outline: 'none', cursor: 'pointer' }}>
          {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {walletConnected && (
          <button style={{ background: '#e8206a', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
            + LIST NFT
          </button>
        )}
      </div>

      {/* Connect prompt */}
      {!walletConnected && (
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚡ Connect wallet to buy or list NFTs
        </div>
      )}

      {/* NFT grid */}
      {selected ? (
        // Detail view
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, padding: '20px' }}>
          <button
            onClick={() => setSelected(null)}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 12, marginBottom: 12, padding: 0 }}>
            ← Back
          </button>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 160, height: 160, background: '#111', borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
              🖼
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{selected.name}</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>{selected.collection}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#e8206a', marginBottom: 16 }}>{selected.price}</div>
              <button
                disabled={!walletConnected}
                style={{ background: walletConnected ? '#e8206a' : '#1a1a1a', border: 'none', color: walletConnected ? '#fff' : '#444', padding: '10px 24px', borderRadius: 6, fontWeight: 700, cursor: walletConnected ? 'pointer' : 'default', fontSize: 13 }}>
                {walletConnected ? 'BUY NOW' : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
          {filtered.map(nft => (
            <div
              key={nft.id}
              onClick={() => setSelected(nft)}
              style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#e8206a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#1a1a1a')}>
              <div style={{ height: 120, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🖼</div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#ccc', marginBottom: 2 }}>{nft.name}</div>
                <div style={{ fontSize: 10, color: '#555', marginBottom: 6 }}>{nft.collection}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#e8206a' }}>{nft.price}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#333', fontSize: 12 }}>
          {search ? 'No results for "' + search + '"' : 'No NFTs listed on ' + activeChain + ' yet.'}
        </div>
      )}
    </section>
  );
}
