/**
 * React Error Boundary Components
 * Provides React-specific error handling with UI fallbacks
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorReporter, ErrorCategory } from '../../services/errorHandler';

// Error Boundary State
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// Error Boundary Props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

// Main Error Boundary Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Report error with boundary context
    errorReporter.reportError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      boundaryLevel: this.props.level || 'component',
    });

    // Update state with error info
    this.setState({ errorInfo });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} retry={this.retry} />;
      }

      // Use appropriate default fallback based on level
      switch (this.props.level) {
        case 'page':
          return <PageErrorFallback error={this.state.error} retry={this.retry} />;
        case 'section':
          return <SectionErrorFallback error={this.state.error} retry={this.retry} />;
        default:
          return <ComponentErrorFallback error={this.state.error} retry={this.retry} />;
      }
    }

    return this.props.children;
  }
}

// Error Fallback Component Props
interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

// Page-Level Error Fallback (Full Screen)
export const PageErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  const category = errorReporter.categorizeError(error);
  const userMessage = errorReporter.getUserFriendlyMessage(error, category);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-slate-600 mb-6">{userMessage}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={retry}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full text-blue-600 py-2 px-4 hover:text-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>

        {import.meta.env.DEV && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

// Section-Level Error Fallback (Part of Page)
export const SectionErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  const category = errorReporter.categorizeError(error);
  const userMessage = errorReporter.getUserFriendlyMessage(error, category);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-1">
            Section Error
          </h3>
          <p className="text-sm text-red-700 mb-3">{userMessage}</p>
          <button
            onClick={retry}
            className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
          >
            Retry Section
          </button>
        </div>
      </div>

      {import.meta.env.DEV && (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-red-600 hover:text-red-700">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
};

// Component-Level Error Fallback (Inline)
export const ComponentErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
      <div className="flex items-center space-x-2">
        <svg
          className="w-4 h-4 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <span className="text-sm text-yellow-800">
          Component failed to load
        </span>
        <button
          onClick={retry}
          className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors ml-auto"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

// HOC for automatic error boundary wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Async Error Boundary Hook
export function useAsyncError() {
  const [, setError] = React.useState<Error | null>(null);
  
  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
}

export default ErrorBoundary;