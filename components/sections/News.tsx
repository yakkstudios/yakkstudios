'use client';
import { useState } from 'react';

interface SectionProps {
  walletConnected: boolean;
  walletAddress?: string;
  ystBalance?: number;
  onNavigate?: (id: string) => void;
}

interface Article {
  id: string;
  slug: string;
  dateLabel: string;
  category: string;
  title: string;
  subtitle: string;
  author: string;
  sources?: string;
  tags: string[];
  readTime: string;
  featured?: boolean;
}

const ARTICLES: Article[] = [
  {
    id: 'kol-expose',
    slug: '/news/kol-expose.html',
    dateLabel: 'March 2025',
    category: 'INVESTIGATION',
    title: 'The Dev Wallets. The KOLs. The Receipts.',
    subtitle: 'We mapped the extraction layer. Now we map the promotional layer. 113+ blacklisted dev wallets. 39 KOL wallets connected on-chain. Same ecosystem. Different floor. All on-chain.',
    author: '$YAKK Cabal',
    sources: '@degengamblah · @postmodernism',
    tags: ['KOL EXPOSE', 'ON-CHAIN', 'SOLANA', 'INVESTIGATION'],
    readTime: '8 min',
    featured: true,
  },
];

function ArticleViewer({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <div className="news-viewer" style={{ height: 'calc(100vh - var(--ticker-h))' }}>
      <div className="news-viewer-bar">
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          ← Back to News
        </button>
        <a
          className="btn btn-ghost btn-sm"
          href={article.slug}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Full ↗
        </a>
      </div>
      <iframe
        src={article.slug}
        className="news-iframe"
        title={article.title}
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
}

export default function News({ }: SectionProps) {
  const [openArticle, setOpenArticle] = useState<Article | null>(null);

  if (openArticle) {
    return <ArticleViewer article={openArticle} onBack={() => setOpenArticle(null)} />;
  }

  return (
    <div className="sec-pad">
      <div className="sec-header">
        <div className="sec-bar" />
        <h1 className="sec-title">YAKK NEWS</h1>
        <p className="sec-sub">
          Investigations, on-chain research &amp; company updates from $YAKK Studios.
        </p>
      </div>

      <div className="news-list">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className={`news-card ${article.featured ? 'news-card-featured' : ''}`}
            onClick={() => setOpenArticle(article)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setOpenArticle(article)}
          >
            <div className="news-card-top">
              <span className="news-cat-badge">{article.category}</span>
              {article.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="news-tag">{tag}</span>
              ))}
              <span className="news-meta-right">
                {article.dateLabel} · {article.readTime}
              </span>
            </div>
            <h2 className="news-card-title">{article.title}</h2>
            <p className="news-card-sub">{article.subtitle}</p>
            <div className="news-card-footer">
              <div>
                <span className="news-author">{article.author}</span>
                {article.sources && (
                  <span className="news-sources"> · Source: {article.sources}</span>
                )}
              </div>
              <span className="news-read-cta">READ ARTICLE →</span>
            </div>
            {article.featured && (
              <div className="news-featured-strip">
                <span>11 Tokens · $87B+ tracked · 113+ dev wallets · 39 KOL connections</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="news-footer-note">
        More investigations and updates coming soon. Follow{" "}
        <a href="https://x.com/YakkStudios" target="_blank" rel="noopener noreferrer" className="news-link">
          @YakkStudios
        </a>{" "}
        and join{" "}
        <a href="https://t.me/yakkcult" target="_blank" rel="noopener noreferrer" className="news-link">
          t.me/yakkcult
        </a>{" "}
        for live updates.
      </div>
    </div>
  );
}
