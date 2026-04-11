'use client';
import { HUBS, TOOL_TO_HUB, GATED_SECTIONS, WHALE_GATE, YST_GATE } from '@/lib/constants';

interface Props {
  activeSection: string;
  walletConnected: boolean;
  ystBalance: number;
  onNavigate: (id: string) => void;
}

/**
 * HubTabBar renders a horizontal tab strip above a tool page that belongs to
 * a hub. It shows the hub breadcrumb + every sibling tool as a clickable pill.
 * Whale-only and YST-gated tools are rendered with lock badges.
 *
 * If the active section is NOT inside any hub (e.g. 'home', 'wallet', 'terms',
 * 'services'), the component returns null and renders nothing.
 */
export default function HubTabBar({
  activeSection,
  walletConnected,
  ystBalance,
  onNavigate,
}: Props) {
  const hubId = TOOL_TO_HUB[activeSection];
  if (!hubId) return null;
  const hub = HUBS.find((h) => h.id === hubId);
  if (!hub) return null;

  const hasAccess = (toolId: string, whaleOnly: boolean | undefined) => {
    if (!walletConnected) return !GATED_SECTIONS.has(toolId) && !whaleOnly;
    if (whaleOnly) return ystBalance >= WHALE_GATE;
    if (GATED_SECTIONS.has(toolId)) return ystBalance >= YST_GATE;
    return true;
  };

  return (
    <div
      style={{
        padding: '14px 20px 10px',
        borderBottom: '1px solid rgba(224,96,126,0.12)',
        background:
          'linear-gradient(180deg, rgba(224,96,126,0.04) 0%, rgba(5,5,9,0) 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Breadcrumb + blurb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 18 }}>{hub.icon}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: 'var(--pink)',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
          }}
        >
          {hub.label}
        </span>
        <span style={{ fontSize: 11, color: '#9a9aa8' }}>/ {hub.blurb}</span>
      </div>

      {/* Tab strip */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'thin',
        }}
      >
        {hub.tools.map((tool) => {
          const active = tool.id === activeSection;
          const locked = !hasAccess(tool.id, tool.whaleOnly);
          return (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              title={
                locked
                  ? tool.whaleOnly
                    ? 'Requires 10M $YST'
                    : 'Requires 250K $YST'
                  : tool.label
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                background: active
                  ? 'var(--pink)'
                  : locked
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.04)',
                color: active ? '#050509' : locked ? '#666' : '#f5f5f7',
                border: active
                  ? '1px solid var(--pink)'
                  : '1px solid rgba(255,255,255,0.08)',
                opacity: locked ? 0.6 : 1,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 13 }}>{tool.icon}</span>
              {tool.label}
              {locked && tool.whaleOnly && (
                <span
                  style={{
                    fontSize: 8,
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: 'rgba(247,201,72,0.15)',
                    color: '#f7c948',
                    border: '1px solid rgba(247,201,72,0.3)',
                    fontWeight: 700,
                  }}
                >
                  🐋
                </span>
              )}
              {locked && !tool.whaleOnly && (
                <span
                  style={{
                    fontSize: 8,
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: 'rgba(224,96,126,0.15)',
                    color: 'var(--pink)',
                    border: '1px solid rgba(224,96,126,0.3)',
                    fontWeight: 700,
                  }}
                >
                  YST
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
