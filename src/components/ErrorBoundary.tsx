import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="glass p-8 rounded-xl relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-light/5 opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>
              
              <div className="relative z-10 space-y-6 text-center">
                <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-text-primary">Something went wrong</h2>
                  <p className="text-sm text-text-secondary">
                    {this.state.error?.message || 'An unexpected error occurred'}
                  </p>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 transform hover:-translate-y-0.5"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 