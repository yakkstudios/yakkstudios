'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

interface FeatureItem {
  title: string;
  category: string;
  author: string;
  votes: number;
}

const INITIAL_FEATURES: FeatureItem[] = [
  { title: 'Limit orders on DEX terminal', category: 'Trading', author: '@degenking', votes: 247 },
  { title: 'Mobile app (iOS + Android)', category: 'Mobile', author: '@moonshot_jay', votes: 189 },
  { title: 'Portfolio tracker with PnL history', category: 'Trading', author: '@yakker_sol', votes: 134 },
  { title: 'Cross-chain portfolio view', category: 'DeFi', author: '@bridgemax', votes: 98 },
];

const inputStyle: React.CSSProperties = {
  background: 'var(--bg4)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 6,
  padding: '8px 12px',
  color: 'var(--text)',
  fontFamily: 'Space Mono,monospace',
  fontSize: 11,
  outline: 'none',
};

export default function Features({ walletConnected, ystBalance, onNavigate }: Props) {
  const [features, setFeatures] = useState<FeatureItem[]>(INITIAL_FEATURES);
  const [voted, setVoted] = useState<number[]>([]);

  // Submit form state
  const [frTitle, setFrTitle] = useState('');
  const [frCategory, setFrCategory] = useState('');
  const [frDesc, setFrDesc] = useState('');
  const [frTwitter, setFrTwitter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const vote = (i: number) => {
    if (voted.includes(i)) return;
    setVoted(v => [...v, i]);
    setFeatures(f => f.map((item, j) => j === i ? { ...item, votes: item.votes + 1 } : item));
  };

  const submit = () => {
    if (!frTitle.trim()) return;
    const newItem: FeatureItem = {
      title: frTitle,
      category: frCategory || 'Other',
      author: frTwitter || 'anonymous',
      votes: 1,
    };
    setFeatures(f => [...f, newItem]);
    setFrTitle('');
    setFrCategory('');
    setFrDesc('');
    setFrTwitter('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">COMMUNITY DRIVEN</div>
      <div className="sec-title">Feature Requests</div>
      <div className="sec-bar" />
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 20 }}>
        Got an idea? Drop it here. We review submissions weekly and ship the most upvoted ones. You build the roadmap.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Submit */}
        <div className="card-sm">
          <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em', marginBottom: 14 }}>SUBMIT IDEA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              type="text"
              placeholder="Feature title (e.g. Limit orders on DEX)"
              value={frTitle}
              onChange={e => setFrTitle(e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
            <select
              value={frCategory}
              onChange={e => setFrCategory(e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">Select category</option>
              <option value="Trading">Trading</option>
              <option value="NFTs">NFTs</option>
              <option value="DeFi">DeFi / Yield</option>
              <option value="Privacy">Privacy</option>
              <option value="Social">Social</option>
              <option value="Mobile">Mobile</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Describe your idea in a few sentences…"
              rows={4}
              value={frDesc}
              onChange={e => setFrDesc(e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
            />
            <input
              type="text"
              placeholder="Your Twitter (optional, for credit)"
              value={frTwitter}
              onChange={e => setFrTwitter(e.target.value)}
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box' }}
            />
            <button className="btn btn-pink" onClick={submit} style={{ width: '100%' }} disabled={!frTitle.trim()}>
              SUBMIT REQUEST
            </button>
            {submitted && (
              <div style={{ fontSize: 10, color: 'var(--green)', textAlign: 'center' }}>✓ Submitted! Thanks for the idea.</div>
            )}
            <p style={{ fontSize: 9, color: 'var(--dim)', textAlign: 'center', margin: 0 }}>
              Reviewed every Friday. Top voted ideas shipped within 2 weeks.
            </p>
          </div>
        </div>

        {/* Top requests */}
        <div className="card-sm">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontFamily: 'Space Mono,monospace', fontSize: 9, color: 'var(--dim)', letterSpacing: '0.12em' }}>TOP REQUESTS</div>
            <span style={{ fontSize: 9, color: 'var(--dim)' }}>Updated weekly</span>
          </div>
          <div>
            {[...features]
              .sort((a, b) => b.votes - a.votes)
              .map((item, i) => {
                const origIdx = features.indexOf(item);
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: 'var(--bg4)', borderRadius: 7, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</div>
                      <div style={{ fontSize: 9, color: 'var(--dim)', marginTop: 2 }}>{item.category} · {item.author}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={() => vote(origIdx)}
                        disabled={voted.includes(origIdx)}
                        style={{
                          background: voted.includes(origIdx) ? 'rgba(224,96,126,0.15)' : 'none',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: 6,
                          padding: '4px 10px',
                          cursor: voted.includes(origIdx) ? 'default' : 'pointer',
                          fontSize: 12,
                          color: voted.includes(origIdx) ? 'var(--pink)' : 'var(--text)',
                        }}
                      >
                        ▲
                      </button>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--pink)', marginTop: 2 }}>{item.votes}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
}
