import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { navItems } from '../../constants';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';
import UserMenu from '../UserMenu';

const Sidebar = () => {
    const token = useAuthStore((state) => state.token);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const body = document.body;
        if (isModalOpen && !token) {
            body.classList.add('overflow-hidden');
        } else {
            body.classList.remove('overflow-hidden');
        }
    }, [isModalOpen, token]);

    return (
        <aside className="sidebar z-50">
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
                    <UserMenu />
                ) : (
                    <button
                        className="flex size-10 items-center justify-center rounded-lg cursor-pointer bg-surface p-2"
                        aria-label="Sign in with GitHub"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <img src="/icons/signin.svg" alt="Sign in" className="size-6" />
                    </button>
                )}
            </div>

            {isModalOpen && !token && (
                <LoginModal
                    onClose={() => setIsModalOpen(false)}
                />
            )}

        </aside>
    );
}

export default Sidebar;