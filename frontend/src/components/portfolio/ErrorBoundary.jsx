import React from 'react';

/**
 * Catches React errors and shows a fallback so the app doesn't blank.
 * See docs/IMPROVEMENTS.md.
 */
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
          <h1 className="font-display text-2xl font-extrabold mb-4 text-[var(--white)]">
            Something went wrong
          </h1>
          <p className="font-body text-[15px] text-[var(--muted)] mb-8 text-center max-w-md">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
