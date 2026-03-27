'use client';

interface GateBadgeProps {
  checked?: boolean;
  whaleOnly?: boolean;
}

export default function GateBadge({ checked = false, whaleOnly = false }: GateBadgeProps) {
  const threshold = whaleOnly ? '10,000,000' : '250,000';
  const label = whaleOnly ? 'WHALE CLUB' : 'NOT CHECKED';

  return (
    <div className="gate-badge">
      <span className="gate-badge-text">
        <span>{threshold}+ $YST</span> Held
      </span>
      <span className={`badge ${checked ? 'b-green' : 'b-dim'}`}>
        {checked ? '✓ VERIFIED' : label}
      </span>
    </div>
  );
}
