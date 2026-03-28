'use client';
import { useState } from 'react';

interface Props { walletConnected: boolean; ystBalance: number; onNavigate: (id: string) => void; }

type Mode = 'discipline' | 'raid' | 'risk' | 'lore';

const MODE_LABELS: Record<Mode, string> = {
  discipline: 'DISCIPLINE MODE',
  raid: 'RAID STRATEGIST',
  risk: 'RISK OFFICER',
  lore: 'YAKK LORE',
};

const WELCOME_MSG: Record<Mode, string> = {
  discipline: "The den is open. The mountain is watching. I'm your $YAKKAI consigliere. Discipline, strategy, risk. Ask anything. Don't waste my time with paper hands questions. GET YAKKED. 😈",
  raid: "Raid Strategist mode engaged. I'll help you coordinate raids, grow the community, and maximize impact on every target. What's the mission?",
  risk: "Risk Officer mode. I assess threats, evaluate positions, and protect the herd from rugs. What needs assessing?",
  lore: "Yakk Lore mode. The mountain has secrets. Ask me about the origins of the cult, the pink yakk prophecy, and the golden tail of destiny.",
};

const AI_RESPONSES: Record<string, string> = {
  '/pep': "YOU ARE THE YAKK. The mountain does not bow — it is climbed. Stop checking the chart every 5 minutes. Conviction holders win. GET YAKKED. 😈",
  '/discipline': "Discipline is the edge. Set your entry. Set your exit. Do NOT move your stop loss. The cult does not capitulate — we accumulate.",
  'Should I sell?': "Never ask the coach that. You either have a plan or you don't. If you have to ask, you didn't have conviction to begin with. Define your target. Stick to it.",
  'How do I raid effectively?': "Effective raids: 1) Hit the target early (first 30 min matters). 2) Engage authentically — don't just like. 3) Tag frens. 4) Drop the 😈. 5) Log your raid link in the hub. Max XP.",
};

export default function Coach({ walletConnected, ystBalance, onNavigate }: Props) {
  const hasAccess = walletConnected && ystBalance >= 250_000;
  const [mode, setMode] = useState<Mode>('discipline');
  const [msgs, setMsgs] = useState([
    { role: 'ai', text: WELCOME_MSG['discipline'] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode);
    setMsgs([{ role: 'ai', text: WELCOME_MSG[newMode] }]);
  };

  const sendMsg = (text?: string) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', text: q }]);
    setLoading(true);
    setTimeout(() => {
      const reply = AI_RESPONSES[q] ||
        `${MODE_LABELS[mode]} responding: "${q}" — The yakk sees all. Position size wisely, stay in the den, and remember: the mountain rewards patience. What else do you need?`;
      setMsgs(m => [...m, { role: 'ai', text: reply }]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="sec-pad">
      <div className="sec-eyebrow">06 — $YAKKAI COACH</div>
      <div className="sec-title" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        YAKKAI Coach{' '}
        <span style={{ fontSize: 9, background: 'rgba(247,201,72,0.15)', border: '1px solid rgba(247,201,72,0.4)', color: 'var(--gold)', padding: '2px 7px', borderRadius: 3, letterSpacing: 1, fontFamily: 'Space Mono,monospace', verticalAlign: 'middle' }}>✦ CLAUDE</span>
        {' '}
        <span style={{ fontSize: 9, background: 'rgba(10,10,30,0.6)', border: '1px solid rgba(255,255,255,0.12)', color: '#888', padding: '2px 7px', borderRadius: 3, letterSpacing: 1, fontFamily: 'Space Mono,monospace', verticalAlign: 'middle' }}>GROK <span style={{ color: '#ff6b6b', fontSize: 8 }}>SOON</span></span>
      </div>
      <div className="sec-bar" />

      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'var(--bg4)', borderRadius: 5 }}>
        <span style={{ fontSize: 12 }}>250,000+ $YST 🪙Held</span>
        <span className={`badge ${hasAccess ? 'b-green' : 'b-dim'}`}>
          {hasAccess ? 'ACCESS GRANTED' : !walletConnected ? 'NOT CHECKED' : 'INSUFFICIENT'}
        </span>
      </div>

      <div style={{ maxWidth: 640 }}>
        {/* Mode Pills */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
          {(['discipline', 'raid', 'risk', 'lore'] as Mode[]).map(m => (
            <div
              key={m}
              className={`mode-pill${mode === m ? ' active' : ''}`}
              onClick={() => handleSetMode(m)}
              style={{ cursor: 'pointer' }}
            >
              {MODE_LABELS[m]}
            </div>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="chat-msgs" id="chat-msgs">
          {msgs.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'msg-user' : 'msg-ai'}>
              {msg.role === 'ai' && <div className="ai-lbl">YAKKAI — {MODE_LABELS[mode]}</div>}
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="msg-ai">
              <div className="ai-lbl">YAKKAI — {MODE_LABELS[mode]}</div>
              <span style={{ opacity: 0.6, fontFamily: 'Space Mono,monospace', fontSize: 11 }}>thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 9, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 9px' }} onClick={() => sendMsg('/pep')}>/pep</button>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 9px' }} onClick={() => sendMsg('/discipline')}>/discipline</button>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 9px' }} onClick={() => sendMsg('Should I sell?')}>/should i sell</button>
          <button className="btn btn-ghost" style={{ fontSize: 9, padding: '4px 9px' }} onClick={() => sendMsg('How do I raid effectively?')}>/raid tips</button>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 7 }}>
          <input
            className="chat-inp"
            id="chat-in"
            type="text"
            placeholder="Ask YAKKAI anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button className="btn btn-pink" onClick={() => sendMsg()}>SEND</button>
        </div>
      </div>
    </div>
  );
}
