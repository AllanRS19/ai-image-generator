import { Outlet } from 'react-router-dom';
import Sidebar from './shared/Sidebar';
import RouteErrorBoundary from './RouteErrorBoundary';

const Layout = () => {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="ml-18">
                <RouteErrorBoundary>
                    <Outlet />
                </RouteErrorBoundary>
            </main>
        </div>
    );
}

export default Layout;