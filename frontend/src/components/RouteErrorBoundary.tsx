import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

function RouteErrorBoundary({ children }: { children: ReactNode }) {
    const location = useLocation();

    // Remounting on pathname change means navigating to a different page
    // automatically clears a crashed error state — no manual "reset" needed.
    return <ErrorBoundary key={location.pathname}>{children}</ErrorBoundary>;
}

export default RouteErrorBoundary;