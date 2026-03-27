'use client';
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
            <div className="sb-brand-name">
              $YAKK <span>STUDIOS</span>
            </div>
            <div className="sb-brand-sub">On-Chain. No Middlemen.</div>
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
            {NAV.map((section) => (
              <div key={section.title}>
                <div className="nav-section">{section.title}</div>
                {section.items.map((item) => {
                  const gated      = GATED_SECTIONS.has(item.id);
                  const accessible = hasAccess(item.id);
                  const isWhale    = item.whaleOnly;

                  return (
                    <div
                      key={item.id}
                      className={`nav-item ${isWhale ? 'whale-item' : ''} ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => { onNavigate(item.id); onClose(); }}
                      title={
                        gated && !accessible
                          ? isWhale
                            ? 'Requires 10M $YST held'
                            : 'Requires 250K $YST held'
                          : item.label
                      }
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {item.label}
                      {isWhale && (
                        <span className="nav-badge whale">WHALE</span>
                      )}
                      {gated && !isWhale && !accessible && (
                        <span className="nav-badge locked">YST</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="sb-footer">
            <div className="sb-links">
              <a className="sb-link" href="https://x.com/YakkStudios" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <a className="sb-link" href="https://t.me/yakkstudios" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
              <a className="sb-link" href="https://stakepoint.app" target="_blank" rel="noopener noreferrer">
                StakePoint
              </a>
            </div>
            <div className="sb-version">v2.0.0 · Next.js</div>
          </div>

        </div>
      </aside>
    </>
  );
}
