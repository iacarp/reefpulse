import React from 'react';
import { registerRootComponent } from 'expo';
import App from './App';

// Custom error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: 'monospace',
          padding: '20px',
          color: '#ff0000',
          backgroundColor: '#000000',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          height: '100vh',
          overflow: 'auto'
        }}>
          <h1>🔴 ReefPulse Error</h1>
          {this.state.error?.message}
          {'\n\n'}
          {this.state.error?.stack}
        </div>
      );
    }

    return <App />;
  }
}

registerRootComponent(() => <ErrorBoundary><App /></ErrorBoundary>);
