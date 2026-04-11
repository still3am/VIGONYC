import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#000', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <div style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 24, marginBottom: 12, fontWeight: 900 }}>Something went wrong</h1>
            <p style={{ color: '#999', marginBottom: 24 }}>An error occurred. Try refreshing the page.</p>
            <button onClick={() => window.location.reload()} style={{ background: '#C0C0C0', color: '#000', border: 'none', padding: '12px 24px', fontSize: 10, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 2, textTransform: 'uppercase' }}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}