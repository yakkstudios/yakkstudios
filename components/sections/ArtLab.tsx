'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const GALLERY = [
  { id: 1, title: 'YAKK Genesis Banner', type: 'BANNER', size: '1500×500', img: '🦅', badge: 'b-gold' },
  { id: 2, title: 'Clown Card PFP', type: 'PFP', size: '1000×1000', img: '🤡', badge: 'b-yakk' },
  { id: 3, title: 'Whale Club Pass', type: 'NFT ART', size: '2000×2000', img: '🐋', badge: 'b-blue' },
  { id: 4, title: 'YAKK Logo Pack', type: 'BRAND', size: 'SVG', img: '🎨', badge: 'b-green' },
  { id: 5, title: 'Raid Trophy #1', type: 'TROPHY', size: '800×800', img: '⚔️', badge: 'b-dim' },
  { id: 6, title: 'Token Launch Art', type: 'PROMO', size: '1200×630', img: '🚀', badge: 'b-yakk' },
];

const TOOLS = [
  { name: 'PFP Generator', desc: 'Generate custom YAKK PFP overlays with your wallet address embedded.', icon: '👤', status: 'LIVE', badge: 'b-green' },
  { name: 'Banner Maker', desc: 'Create Twitter/X banners with YAKK branding and holder badge.', icon: '🖼️', status: 'LIVE', badge: 'b-green' },
  { name: 'Meme Generator', desc: 'Drop YAKK memes fast — pre-loaded templates, custom text.', icon: '😂', status: 'BETA', badge: 'b-yakk' },
  { name: 'AI Art Studio', desc: 'Generate AI art with YAKK-themed styles and prompts.', icon: '🤖', status: 'SOON', badge: 'b-dim' },
];

export default function ArtLab({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [activeTab, setActiveTab] = useState<'gallery' | 'tools'>('gallery');
  const [prompt, setPrompt] = useState('');

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,#a855f7,var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">🎨 ART LAB</div>
          <span className="badge b-yakk">CREATIVE</span>
        </div>
        <div className="sec-sub">Create YAKK-branded art, PFPs, banners &amp; memes. Holder-exclusive creative suite.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> 🪙 Required</span>
          {hasAccess
            ? <span className="badge b-green">✓ ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? '🔒 NEED MORE YST' : '🔒 CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎨</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Art Lab — Holders Only</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Connect your wallet &amp; hold 250K+ $YST to access the creative suite.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter →</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {(['gallery', 'tools'] as const).map(t => (
              <button key={t} className={`mode-pill ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t === 'gallery' ? '🖼️ Gallery' : '🔧 Tools'}
              </button>
            ))}
          </div>

          {activeTab === 'gallery' && (
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>YAKK ASSET LIBRARY</div>
              <div className="grid3" style={{ marginBottom: 20 }}>
                {GALLERY.map(item => (
                  <div key={item.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: 100, background: 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>{item.img}</div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className={`badge ${item.badge}`}>{item.type}</span>
                        <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{item.size}</span>
                      </div>
                      <button className="btn btn-outline" style={{ width: '100%', fontSize: 10, justifyContent: 'center' }}>Download</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, color: 'var(--muted)', letterSpacing: 1.2, marginBottom: 12 }}>CREATIVE TOOLS</div>
              {TOOLS.map(tool => (
                <div key={tool.name} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ fontSize: 32, width: 48, height: 48, background: 'var(--bg4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{tool.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13 }}>{tool.name}</div>
                      <span className={`badge ${tool.badge}`}>{tool.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{tool.desc}</div>
                  </div>
                  <button className={`btn ${tool.status === 'SOON' ? 'btn-outline' : 'btn-pink'}`} style={{ fontSize: 10, whiteSpace: 'nowrap' }} disabled={tool.status === 'SOON'}>
                    {tool.status === 'SOON' ? 'Coming Soon' : 'Launch →'}
                  </button>
                </div>
              ))}

              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '18px 20px', marginTop: 16 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 10 }}>🤖 AI ART PROMPT</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="field-inp" placeholder="Describe your YAKK-themed art..." value={prompt} onChange={e => setPrompt(e.target.value)} style={{ flex: 1 }} />
                  <button className="btn btn-pink" style={{ whiteSpace: 'nowrap' }}>Generate</button>
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>AI art generation coming soon — powered by YAKK Studios API.</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
