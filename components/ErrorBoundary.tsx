'use client';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[ErrorBoundary][${this.props.sectionName ?? 'Unknown'}]`,
      error.message,
      '\n',
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="sec-pad"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg)',
            border: '1px solid var(--pink)',
            borderRadius: '8px',
            margin: '1rem',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚠️</div>
          <div
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--pink)',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {this.props.sectionName ?? 'Section'} — Something went wrong
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem', maxWidth: 360, margin: '0 auto 1.5rem' }}>
            This section encountered an error. Refresh the page or tap retry to reload it.
          </p>
          <button
            className="btn btn-pink"
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{ fontSize: '0.8rem' }}
          >
            ↻ Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
