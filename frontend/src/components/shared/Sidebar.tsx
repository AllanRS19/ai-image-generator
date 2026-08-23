import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { navItems } from '../../constants';

const GITHUB_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/github`;

function Sidebar() {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    return (
        <aside className="sidebar">
            <img src="/icons/logo.svg" alt="Logo" className="size-5.5" />

            <nav className="navbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                            `flex size-10 items-center justify-center rounded-lg p-2 transition-colors ${isActive ? 'bg-accent' : 'hover:bg-surface'
                            }`
                        }
                    >
                        <img src={item.icon} alt={item.label} className="size-6" />
                    </NavLink>
                ))}
            </nav>

            <div className="mt-auto">
                {token ? (
                    <button
                        onClick={logout}
                        className="flex size-10 items-center justify-center rounded-lg bg-surface p-2"
                        aria-label="Sign out"
                    >
                        <img src="/icons/signout.svg" alt="Sign out" className="size-6" />
                    </button>
                ) : (
                    <a
                        href={GITHUB_LOGIN_URL}
                        className="flex size-10 items-center justify-center rounded-lg bg-surface p-2"
                        aria-label="Sign in with GitHub"
                    >
                        <img src="/icons/signin.svg" alt="Sign in" className="size-6" />
                    </a>
                )}
            </div>
        </aside >
    );
}

export default Sidebar;