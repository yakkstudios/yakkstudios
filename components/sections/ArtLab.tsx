'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

const CORE_PREFIX = 'Vibrant pink yakk, dense hot-pink fur, silver curved horns, black feet/paws, intense yellow eyes under black mask, gold-dripping tail, fluffy chibi round body, cinematic chiaroscuro lighting —';

const SCENES = [
  { value: 'Himalayan peak at golden hour, epic fantasy matte painting', label: 'Mountain Peak — Golden Hour' },
  { value: 'underground mafia den, velvet curtains, gold candlesticks', label: 'Underground Mafia Den' },
  { value: 'cyberpunk neon alley, holographic crypto charts, rain-soaked', label: 'Cyberpunk Alley' },
  { value: "Peaky Blinders 1920s Birmingham, sharp suits, flat caps, street fog", label: 'Peaky Blinders Era' },
  { value: 'obsidian throne room, ice and glowing cult runes, dark fantasy', label: 'Dark Fantasy Throne' },
];

const STYLES = [
  { value: 'cinematic fantasy illustration, volumetric light, 4K', label: 'Cinematic Fantasy' },
  { value: 'anime digital art, cel-shaded, dynamic pose', label: 'Anime / Cel-Shaded' },
  { value: 'dark oil painting, baroque style', label: 'Baroque Oil Painting' },
  { value: '3D render, octane, studio lighting', label: '3D Render — Octane' },
  { value: 'propaganda poster, flat graphic, bold silhouette', label: 'Propaganda Poster' },
];

const MJ_REFERENCES = [
  {
    label: 'PROMPT 01 — MOUNTAIN EMPIRE',
    txt: 'Vibrant pink yakk, gold-dripping tail, standing on Himalayan peak at golden hour, cult army of pink yakks behind holding pink banners, god rays, cinematic fantasy matte painting, 4K --ar 16:9 --style raw',
  },
  {
    label: 'PROMPT 02 — MAFIA CONSIGLIERE',
    txt: 'Pink yakk in Peaky Blinders suit, flat cap, mahogany table, candlelight, ledger books and crypto charts, baroque drama, chiaroscuro oil painting --ar 16:9 --style raw',
  },
  {
    label: 'PROMPT 03 — CYBERPUNK OVERLORD',
    txt: 'Pink yakk as cyberpunk crypto overlord, laser eyes, gold chain, neon alley, holographic charts floating, anime cel-shaded dynamic pose --ar 9:16 --style raw',
  },
  {
    label: 'PROMPT 04 — THRONE GUARDIAN',
    txt: 'Pink yakk on obsidian ice throne, dark fantasy, glowing cult runes, three NFT silhouettes bowing, golden chains, dramatic underlighting --ar 16:9',
  },
  {
    label: 'PROMPT 05 — PROPAGANDA POSTER',
    txt: 'Soviet propaganda poster, pink yakk leading crypto army, bold flat design, hot pink black and gold only, constructivist style, no text in image --ar 2:3',
  },
];

export default function ArtLab({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 10_000_000;
  const [scene, setScene] = useState(SCENES[0].value);
  const [style, setStyle] = useState(STYLES[0].value);
  const [extraProps, setExtraProps] = useState('');
  const [builtPrompt, setBuiltPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const buildPrompt = () => {
    const parts = [CORE_PREFIX, scene, style];
    if (extraProps.trim()) parts.push(extraProps.trim());
    const result = parts.join(' ') + ' --ar 16:9 --style raw';
    setBuiltPrompt(result);
    setShowPrompt(true);
    setCopied(false);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(builtPrompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">05 — YAKK ART LAB</div>
      <div className="sec-title">Art Lab</div>
      <div className="sec-bar" />

      {!hasAccess && (
        <div className="locked-overlay">
          <div className="locked-icon">🐋</div>
          <div className="locked-title">WHALE CLUB EXCLUSIVE</div>
          <div className="locked-sub">
            Connect your wallet and hold 10,000,000 $YST to unlock this tool.
          </div>
        </div>
      )}

      {hasAccess && (<>
      <div className="grid2" style={{ gap: 28 }}>
        {/* Left: Prompt Builder */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>PROMPT BUILDER</div>

            {/* Core Prefix */}
            <div style={{ marginBottom: 11 }}>
              <label className="field-lbl" style={{ marginTop: 0 }}>🐋 CORE YAKK PREFIX (LOCKED)</label>
              <textarea
                className="field-inp"
                rows={2}
                readOnly
                value={CORE_PREFIX}
                style={{ background: 'rgba(224,96,126,0.04)', borderColor: 'rgba(224,96,126,0.15)', color: 'var(--muted)', cursor: 'not-allowed', fontSize: 11 }}
              />
            </div>

            {/* Scene */}
            <div style={{ marginBottom: 11 }}>
              <label className="field-lbl" style={{ marginTop: 0 }}>SCENE</label>
              <select
                className="field-sel"
                value={scene}
                onChange={e => setScene(e.target.value)}
              >
                {SCENES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Style */}
            <div style={{ marginBottom: 11 }}>
              <label className="field-lbl" style={{ marginTop: 0 }}>STYLE</label>
              <select
                className="field-sel"
                value={style}
                onChange={e => setStyle(e.target.value)}
              >
                {STYLES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Extra Details */}
            <div style={{ marginBottom: 14 }}>
              <label className="field-lbl" style={{ marginTop: 0 }}>EXTRA DETAILS</label>
              <input
                className="field-inp"
                type="text"
                placeholder="holding a ledger book, surrounded by cult members..."
                value={extraProps}
                onChange={e => setExtraProps(e.target.value)}
              />
            </div>

            <button
              className="btn btn-pink"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={buildPrompt}
            >
              BUILD PROMPT →
            </button>
          </div>

          {/* Prompt Output */}
          {showPrompt && (
            <div className="card">
              <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 8, color: 'var(--gold)', letterSpacing: '0.15em', marginBottom: 8 }}>MIDJOURNEY PROMPT — COPY &amp; PASTE</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.7, fontStyle: 'italic', padding: 11, background: 'var(--bg4)', borderRadius: 5 }}>
                {builtPrompt}
              </div>
              <div style={{ display: 'flex', gap: 7, marginTop: 10 }}>
                <button className="btn btn-gold" style={{ fontSize: 10, padding: '5px 12px' }} onClick={copyPrompt}>
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
                <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline" style={{ fontSize: 10, padding: '5px 12px' }}>SHARE TG</button>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right: MJ Reference Prompts */}
        <div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>MJ REFERENCE PROMPTS</div>
          {MJ_REFERENCES.map(ref => (
            <div key={ref.label} className="mj-card">
              <div className="mj-lbl">{ref.label}</div>
              <div className="mj-txt">{ref.txt}</div>
            </div>
          ))}
        </div>
      </div>
      </>)}
    </div>
  );
}
