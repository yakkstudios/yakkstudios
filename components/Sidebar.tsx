'use client';
import { useState } from 'react';
import { NAV, GATED_SECTIONS } from '@/lib/constants';

interface SidebarProps {
  activeSection: string;
  onNavigate: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  walletConnected: boolean;
  walletAddress?: string;
  ystBalance?: number;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  isOpen,
  onClose,
  walletConnected,
  walletAddress,
  ystBalance = 0,
}: SidebarProps) {
  const [labsOpen, setLabsOpen] = useState(false);

  const shortAddr = walletAddress
    ? walletAddress.slice(0, 4) + '…' + walletAddress.slice(-4)
    : '';

  const hasAccess = (id: string) => {
    if (!GATED_SECTIONS.has(id)) return true;
    if (id === 'whaleclub') return ystBalance >= 10_000_000;
    return ystBalance >= 250_000;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sb-overlay open" onClick={onClose} />}

      <aside id="sidebar" className={isOpen ? 'open' : ''}>
        <div id="sidebar-inner">

          {/* Brand */}
          <div className="sb-brand">
            <div className="sb-logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/yakk-y.jpg"
                alt="YAKK Studios logo"
                width="48"
                height="48"
                style={{ borderRadius: 8, display: 'block', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
            <div className="sb-brand-name">
              $YAKK <span>STUDIOS</span>
            </div>
            <div className="sb-brand-sub">改善 · On-Chain Intelligence</div>
          </div>

          {/* Wallet status */}
          <div className="sb-wallet-status">
            <div className={`dot ${walletConnected ? 'connected' : ''}`} />
            <span id="sol-status-label">
              {walletConnected ? shortAddr : 'WALLET NOT CONNECTED'}
            </span>
          </div>

          {/* Nav */}
          <div className="sb-nav-scroll">
            {NAV.map((section) => {
              const isLabs = section.collapsed;
              return (
                <div key={section.title}>
                  {isLabs ? (
                    <div
                      className="nav-section nav-section-toggle"
                      onClick={() => setLabsOpen(!labsOpen)}
                      style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: labsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                      {section.title}
                      <span style={{ fontSize: 9, color: 'var(--dim)', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
                        {section.items.length}
                      </span>
                    </div>
                  ) : (
                    <div className="nav-section">{section.title}</div>
                  )}

                  {/* Collapsed Labs: only show if toggled open */}
                  {(!isLabs || labsOpen) && section.items.map((item) => {
                    const gated = GATED_SECTIONS.has(item.id);
                    const accessible = hasAccess(item.id);
                    const isWhale = item.whaleOnly;
                    const isSoon = item.comingSoon;
                    return (
                      <div
                        key={item.id}
                        className={`nav-item ${isWhale ? 'whale-item' : ''} ${activeSection === item.id ? 'active' : ''} ${isSoon ? 'nav-item-soon' : ''}`}
                        onClick={() => { onNavigate(item.id); onClose(); }}
                        title={
                          isSoon
                            ? `${item.label} — Coming Soon`
                            : gated && !accessible
                            ? isWhale
                              ? 'Requires 10M $YST held'
                              : 'Requires 250K $YST held'
                            : item.label
                        }
                        style={isSoon ? { opacity: 0.5 } : undefined}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        {item.label}
                        {isSoon && (
                          <span className="nav-badge soon" style={{
                            background: 'rgba(255,255,255,0.08)',
                            color: 'var(--dim)',
                            fontSize: 8,
                            padding: '1px 5px',
                            borderRadius: 3,
                            marginLeft: 'auto',
                            fontFamily: 'var(--font-mono)',
                            letterSpacing: '0.5px',
                          }}>SOON</span>
                        )}
                        {!isSoon && isWhale && (
                          <span className="nav-badge whale">WHALE</span>
                        )}
                        {!isSoon && gated && !isWhale && !accessible && (
                          <span className="nav-badge locked">YST</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="sb-footer">
            <div className="sb-links">
              <a className="sb-link" href="https://x.com/YakkStudios" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a className="sb-link" href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="sb-link" href="https://app.meteora.ag/pools/FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM" target="_blank" rel="noopener noreferrer">Buy $YST</a>
            </div>
            <div className="sb-version">v2.3.0 · Next.js</div>
          </div>

        </div>
      </aside>
    </>
  );
}
