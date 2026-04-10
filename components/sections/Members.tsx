'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function Members({ walletConnected = false, ystBalance = 0, onNavigate }: { walletConnected?: boolean; ystBalance?: number; onNavigate?: (s: string) => void }) {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ name: '', xHandle: '', telegram: '', bio: '', website: '' });
  const TIERS = [{ name: 'YAKKED', min: 0, color: '#555', icon: '🐣' },{ name: 'HOLDER', min: 10000, color: '#888', icon: '💎' },{ name: 'STAKED', min: 50000, color: '#e8c440', icon: '⚡' },{ name: 'CABAL', min: 250000, color: '#e8206a', icon: '🔴' },{ name: 'WHALE', min: 1000000, color: '#00c896', icon: '🐋' }];
  const tier = [...TIERS].reverse().find(t => ystBalance >= t.min) || TIERS[0];
  const gated = !walletConnected || ystBalance < 250000;
  const inputStyle = { width: '100%', background: '#111', border: '1px solid #1a1a1a', borderRadius: 4, color: '#ccc', padding: '9px 12px', fontSize: 12, outline: 'none', boxSizing: 'border-box' as const };
  const saveProfile = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <section id="section-members" style={{ padding: '20px' }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 4px' }}>👤 MEMBERS</h2>
      <p style={{ fontSize: 12, color: '#555', marginBottom: 20 }}>Register your cult identity. Stored locally — only you can see it.</p>
      {gated && <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, padding: '10px 14px', marginBottom: 20, fontSize: 11, color: '#666' }}>🔒 250,000+ $YST required — <span style={{ color: '#444' }}>NOT CHECKED</span></div>}
      {walletConnected && <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, background: '#0d0d0d', border: `1px solid ${tier.color}33`, borderRadius: 6, padding: '12px 16px' }}><span style={{ fontSize: 22 }}>{tier.icon}</span><div><div style={{ fontSize: 14, fontWeight: 800, color: tier.color }}>{tier.name}</div><div style={{ fontSize: 10, color: '#555' }}>{ystBalance.toLocaleString()} $YST</div></div></div>}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>TIERS</div>
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 6, overflow: 'hidden' }}>
          {TIERS.map(({ name, min, color, icon }, i) => (<div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 14px', borderBottom: i < TIERS.length - 1 ? '1px solid #111' : 'none', background: tier.name === name ? '#111' : 'transparent' }}><span style={{ fontSize: 12, color }}>{icon} {name}</span><span style={{ fontSize: 11, color: '#555' }}>{min === 0 ? 'Any holder' : min.toLocaleString() + '+ $YST'}</span></div>))}
        </div>
      </div>
      <div style={{ opacity: gated ? 0.4 : 1, pointerEvents: gated ? 'none' : 'auto' }}>
        <div style={{ fontSize: 10, color: '#555', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>YOUR PROFILE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([['name','DISPLAY NAME','text'],['xHandle','X HANDLE','text'],['telegram','TELEGRAM','text'],['website','WEBSITE','url']] as [keyof typeof profile, string, string][]).map(([field,label,type]) => (<div key={field}><label style={{ fontSize: 10, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>{label}</label><input type={type} value={profile[field]} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))} style={inputStyle} /></div>))}
          <div><label style={{ fontSize: 10, color: '#555', letterSpacing: 1, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>BIO (MAX 120 CHARS)</label><textarea value={profile.bio} maxLength={120} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} /><div style={{ fontSize: 10, color: '#444', textAlign: 'right', marginTop: 2 }}>{profile.bio.length}/120</div></div>
        </div>
        <button onClick={saveProfile} disabled={!walletConnected} style={{ marginTop: 16, background: saved ? '#00c896' : '#e8206a', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>{saved ? '✓ SAVED' : '💾 SAVE PROFILE'}</button>
      </div>
    </section>
  );
}
