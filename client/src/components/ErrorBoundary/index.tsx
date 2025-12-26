import { Component, ErrorInfo, ReactNode } from 'react';
import styles from './index.module.scss';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = (): void => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      if (typeof fallback === 'function') {
        return fallback(error, this.handleRetry);
      }

      if (fallback) {
        return fallback;
      }

      return (
        <div className={styles.container} role="alert">
          <div className={styles.content}>
            <div className={styles.icon}>🚨</div>
            <h1 className={styles.title}>Oops! Something Went Wrong</h1>
            <p className={styles.description}>
              The elevator system encountered an unexpected error.
              Don't worry, you can try restarting the system.
            </p>
            <details className={styles.details}>
              <summary className={styles.summary}>Technical Details</summary>
              <pre className={styles.errorMessage}>
                {error.message || 'Unknown error'}
              </pre>
            </details>
            <button onClick={this.handleRetry} className={styles.button}>
              <span>🔄</span>
              Restart System
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}