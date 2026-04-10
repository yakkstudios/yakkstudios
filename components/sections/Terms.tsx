'use client';
const SECTIONS = [
  { title:'1. Acceptance of Terms', body:'By accessing or using the YAKK Studios platform at yakkstudios.xyz, you agree to be bound by these Terms of Service. If you do not agree, do not use this platform. Continued use constitutes ongoing acceptance of any updates.' },
  { title:'2. Not Financial Advice', body:'Nothing on this platform constitutes financial, investment, legal, or tax advice. YAKK Studios is not a registered broker or regulated financial institution. All content, tools, signals, and analytics are for informational and educational purposes only.' },
  { title:'3. $YST Token — Utility Token', body:'The $YST token is a utility token on the Solana blockchain. It is not a security, equity, share, bond, or regulated financial instrument. Holding $YST does not grant ownership of YAKK Studios. YAKK Studios makes no guarantees regarding the market value, liquidity, or future utility of $YST.' },
  { title:'4. Token-Gating — Access, Not Ownership', body:'Certain platform features require holding a minimum balance of $YST tokens. This token-gating model grants temporary access to features for the duration of your holding period. It does not confer ownership stake, equity interest, or governance rights in YAKK Studios. Access may be modified at any time.' },
  { title:'5. Non-Custodial Platform', body:'YAKK Studios does not custody, hold, manage, or control your funds, tokens, or private keys at any point. All transactions are executed directly on-chain via your connected wallet. You are solely responsible for the security of your wallet and seed phrase.' },
  { title:'6. AI Features — Experimental', body:'AI-powered features including YAKK Coach and YAKK Trader are experimental and provided on an as-is basis. Outputs from these tools are not verified, audited, or guaranteed for accuracy. They do not constitute investment advice. You assume all risk when acting on any AI-generated content.' },
  { title:'7. User Assumption of Risk', body:'You acknowledge that participating in cryptocurrency markets carries significant risk, including total loss of funds. On-chain transactions are irreversible. Smart contracts may contain bugs. Token prices are highly volatile. By using this platform, you assume full responsibility for all on-chain actions.' },
  { title:'8. Limitation of Liability', body:'To the fullest extent permitted by law, YAKK Studios, its founders, contributors, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this platform, including losses from transaction errors, market volatility, or platform downtime.' },
  { title:'9. Platform Changes', body:'YAKK Studios reserves the right to add, modify, suspend, or remove any feature at any time without notice. Token-gated features, access tiers, and $YST balance requirements may change. Continued use of the platform after any changes constitutes your acceptance.' },
  { title:'10. Governing Law', body:'These Terms are governed by the laws of Scotland, United Kingdom. Any disputes shall be subject to the exclusive jurisdiction of the courts of Scotland. YAKK Studios operates primarily from Scotland, UK, with secondary operations in Portugal.' },
  { title:'11. Contact', body:'', isContact: true },
];
export default function Terms() {
  return (
    <div className="sec-pad" style={{maxWidth:800}}>
      <div className="sec-eyebrow">LEGAL</div>
      <h2 className="sec-title">Terms of Service</h2>
      <div className="sec-bar" />
      <p style={{fontSize:12,color:'var(--muted)',marginBottom:32,lineHeight:1.7}}>Please read these terms carefully before using the YAKK Studios platform.</p>
      <div style={{display:'flex',flexDirection:'column',gap:4}}>
        {SECTIONS.map((sec,i)=>(<div key={i} className="card" style={{marginBottom:8,borderLeft:'3px solid var(--pink)'}}><h3 style={{fontFamily:'var(--font-heading)',fontWeight:700,fontSize:13,color:'var(--text)',marginBottom:10}}>{sec.title}</h3><p style={{fontSize:12,color:'var(--muted)',lineHeight:1.75,margin:0}}>{sec.isContact?(<>If you have any questions about these Terms of Service, contact us at <a href="mailto:shyfts@yakkstudios.xyz" style={{color:'var(--pink)',textDecoration:'underline'}}>shyfts@yakkstudios.xyz</a>.</>):sec.body}</p></div>))}
      </div>
      <div style={{marginTop:24,padding:'14px 18px',background:'rgba(224,96,126,0.07)',border:'1px solid rgba(224,96,126,0.25)',borderRadius:8}}>
        <p style={{fontSize:11,color:'var(--muted)',lineHeight:1.65,margin:0}}><span style={{color:'var(--pink)',fontWeight:700}}>DISCLAIMER: </span>$YST is a utility token. This platform does not provide financial advice. Crypto assets carry significant risk. Never invest more than you can afford to lose.</p>
      </div>
      <p style={{marginTop:20,fontSize:10,color:'var(--dim)',fontFamily:'var(--font-mono)',letterSpacing:'0.08em'}}>LAST UPDATED: APRIL 2026 · YAKK STUDIOS · SCOTLAND, UK &amp; PORTUGAL</p>
    </div>
  );
}
