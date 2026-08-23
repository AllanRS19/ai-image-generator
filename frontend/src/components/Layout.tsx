import { Outlet } from 'react-router-dom';
import Sidebar from './shared/Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <main className="ml-18">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;