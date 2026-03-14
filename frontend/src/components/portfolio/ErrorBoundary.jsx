import React from 'react';

/**
 * Catches React errors in the tree and shows a fallback so the app doesn't blank.
 * Focus is moved to the "Try again" button for keyboard/screen-reader users.
 */
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  tryAgainRef = React.createRef();

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.hasError && !prevState.hasError && this.tryAgainRef.current) {
      this.tryAgainRef.current.focus();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16"
          role="alert"
          aria-live="assertive"
        >
          <h1 className="font-display text-2xl font-extrabold mb-4 text-[var(--white)]">
            Something went wrong
          </h1>
          <p className="font-body text-[15px] text-[var(--muted)] mb-8 text-center max-w-md">
            An unexpected error occurred. Please refresh the page or try again later.
          </p>
          <button
            ref={this.tryAgainRef}
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="btn-primary font-display text-[13px] font-semibold px-[22px] py-[11px] cursor-pointer bg-[var(--sungold)] text-[var(--void)] border-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--white)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
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
