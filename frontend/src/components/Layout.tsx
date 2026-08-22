import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
    { to: '/', label: 'Generate', end: true },
    { to: '/feed', label: 'Feed' },
    { to: '/history', label: 'History' },
    { to: '/collections', label: 'My Collection' },
];

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-950">
            <nav className="border-b border-slate-800 px-6 py-4">
                <ul className="flex gap-6">
                    {navItems.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${isActive
                                        ? 'text-slate-100'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default Layout;