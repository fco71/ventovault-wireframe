import React from 'react';
import { TriangleAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    errorMessage: undefined,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Unhandled application error', error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-lg w-full rounded-3xl border border-error-200 bg-white/85 shadow-lg p-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-error-50 text-error-600">
              <TriangleAlert className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 font-display">Something went wrong</h1>
            <p className="text-sm text-gray-600 mt-3">
              We hit an unexpected issue and recovered safely. Refresh to continue.
            </p>
            {this.state.errorMessage && (
              <p className="mt-4 text-xs text-error-700 bg-error-50 border border-error-100 rounded-xl p-3 text-left">
                {this.state.errorMessage}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleRefresh}
              className="mt-6 btn btn-primary px-6 py-3"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
