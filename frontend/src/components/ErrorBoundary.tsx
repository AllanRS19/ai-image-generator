import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Unhandled UI error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-[calc(100vh-96px)] flex-col items-center justify-center gap-4 px-8 text-center">
                    <h1 className="text-xl font-semibold text-app-text">
                        Something went wrong
                    </h1>
                    <p className="text-app-muted">
                        An unexpected error occurred while loading this page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-app-text cursor-pointer"
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;