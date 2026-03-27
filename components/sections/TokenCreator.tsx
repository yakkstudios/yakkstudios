'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

export default function TokenCreator({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', ticker: '', supply: '', decimals: '9', desc: '', twitter: '', telegram: '', website: '', revoke: true, freeze: true });

  const update = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" style={{ background: 'linear-gradient(90deg,var(--gold),var(--pink))' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div className="sec-title">ðª TOKEN CREATOR</div>
          <span className="badge b-gold">TOOL</span>
        </div>
        <div className="sec-sub">Launch your own SPL token on Solana in minutes. No code required. Metadata + socials included.</div>
        <div className="gate-badge">
          <span className="gate-badge-text"><span>250,000+ $YST</span> ðª Required</span>
          {hasAccess
            ? <span className="badge b-green">â ACCESS GRANTED</span>
            : <span className="badge b-dim">{walletConnected ? 'ð NEED MORE YST' : 'ð CONNECT WALLET'}</span>}
        </div>
      </div>

      {!walletConnected && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>ðª</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Token Creator â Holders Only</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Connect wallet &amp; hold 250K+ $YST to launch tokens with zero code.</div>
          <w-sol-button style={{ '--wsol-border-radius': '6px', '--wsol-font-size': '12px' } as any} />
        </div>
      )}

      {walletConnected && ystBalance < 250_000 && (
        <div className="locked-overlay">
          <div style={{ fontSize: 40, marginBottom: 12 }}>ð</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Need 250,000 $YST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>You have {ystBalance.toLocaleString()} $YST. Need {(250_000 - ystBalance).toLocaleString()} more.</div>
          <div className="prog-bar" style={{ maxWidth: 280, margin: '0 auto 16px' }}>
            <div className="prog-fill" style={{ width: Math.min(100, (ystBalance / 250_000) * 100) + '%' }} />
          </div>
          <a href="https://jup.ag/swap/SOL-YST" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Get $YST on Jupiter â</a>
        </div>
      )}

      {hasAccess && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {['Token Info', 'Metadata', 'Review &amp; Launch'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontFamily: 'Syne,sans-serif', fontWeight: 800, flexShrink: 0,
                  background: step > i + 1 ? 'var(--green)' : step === i + 1 ? 'var(--pink)' : 'var(--bg4)',
                  color: step >= i + 1 ? '#fff' : 'var(--dim)',
                  border: step === i + 1 ? '2px solid var(--pink)' : '2px solid transparent',
                }}>
                  {step > i + 1 ? 'â' : i + 1}
                </div>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 10, color: step >= i + 1 ? 'var(--text)' : 'var(--dim)' }} dangerouslySetInnerHTML={{ __html: label }} />
                {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--green)' : 'var(--border)' }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 16 }}>STEP 1 â TOKEN BASICS</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[
                  { label: 'TOKEN NAME', key: 'name', ph: 'e.g. YAKK Meme Coin' },
                  { label: 'TICKER', key: 'ticker', ph: 'e.g. $YMEME' },
                  { label: 'TOTAL SUPPLY', key: 'supply', ph: 'e.g. 1000000000' },
                  { label: 'DECIMALS', key: 'decimals', ph: '9' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>{f.label}</div>
                    <input className="field-inp" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} style={{ width: '100%' }} />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>DESCRIPTION</div>
                <textarea className="field-inp" placeholder="Describe your token..." rows={3} value={form.desc} onChange={e => update('desc', e.target.value)} style={{ width: '100%', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {[{ label: 'REVOKE MINT AUTHORITY', key: 'revoke' }, { label: 'REVOKE FREEZE AUTHORITY', key: 'freeze' }].map(opt => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" checked={(form as any)[opt.key]} onChange={e => update(opt.key, e.target.checked)} />
                    <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--muted)' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
              <button className="btn btn-pink" onClick={() => setStep(2)} disabled={!form.name || !form.ticker || !form.supply}>Next â</button>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 16 }}>STEP 2 â SOCIALS &amp; METADATA</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'TWITTER / X', key: 'twitter', ph: 'https://x.com/yourtoken' },
                  { label: 'TELEGRAM', key: 'telegram', ph: 'https://t.me/yourtoken' },
                  { label: 'WEBSITE', key: 'website', ph: 'https://yourtoken.xyz' },
                ].map(f => (
                  <div key={f.key}>
                    <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>{f.label}</div>
                    <input className="field-inp" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} style={{ width: '100%' }} />
                  </div>
                ))}
                <div>
                  <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>TOKEN IMAGE</div>
                  <button className="btn btn-outline" style={{ fontSize: 10, width: '100%', justifyContent: 'center' }}>Upload Image</button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => setStep(1)}>â Back</button>
                <button className="btn btn-pink" onClick={() => setStep(3)}>Next â</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px' }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, marginBottom: 16 }}>STEP 3 â REVIEW &amp; LAUNCH</div>
              <div style={{ background: 'var(--bg4)', borderRadius: 8, padding: '16px', marginBottom: 16 }}>
                {[
                  ['Name', form.name || 'â'],
                  ['Ticker', form.ticker || 'â'],
                  ['Supply', form.supply ? parseInt(form.supply.replace(/,/g, '')).toLocaleString() : 'â'],
                  ['Decimals', form.decimals],
                  ['Revoke Mint', form.revoke ? 'Yes â' : 'No'],
                  ['Revoke Freeze', form.freeze ? 'Yes â' : 'No'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)' }}>{k}</span>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 11 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 11, color: 'var(--muted)' }}>
                â¡ Launch fee: ~0.05 SOL (Solana network + metadata upload)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => setStep(2)}>â Back</button>
                <button className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>ð Launch Token</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 20, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 11, marginBottom: 6 }}>ð HOW IT WORKS</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
              Fill in your token details, add socials and metadata, then review and launch. The tool creates your SPL token mint on Solana, uploads metadata to IPFS, and optionally revokes mint/freeze authority to make the token immutable. You retain 100% of the initial supply.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
