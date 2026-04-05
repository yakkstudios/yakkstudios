'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; sectionName?: string; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[ErrorBoundary] ${this.props.sectionName ?? 'Unknown'}:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sec-pad" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: 32, marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: 'var(--pink)', marginBottom: '1rem', fontFamily: 'Syne,sans-serif' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: 13 }}>
            {this.props.sectionName
              ? `The ${this.props.sectionName} section hit an error.`
              : 'This section encountered an error.'}
          </p>
          <button
            className="btn btn-pink"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
