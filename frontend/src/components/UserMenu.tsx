import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../hooks/users/useCurrentUser';

const UserMenu = () => {

    const logout = useAuthStore((state) => state.logout);

    const { data: user } = useCurrentUser();
    const queryClient = useQueryClient();
    
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        queryClient.removeQueries({ queryKey: ['me'] });
        setIsOpen(false);
    };

    if (!user) {
        return <div className="size-10 animate-pulse rounded-lg bg-surface" />;
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex size-10 items-center justify-center rounded-lg cursor-pointer"
                aria-label="Account menu"
            >
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="size-9 rounded-full"
                    />
                ) : (
                    <div className="flex size-9 items-center justify-center rounded-full bg-surface text-xs text-app-text">
                        {user.username.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+12px)] w-32 rounded-lg bg-surface p-2 shadow-lg">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-sm text-app-text cursor-pointer"
                    >
                        <img src="/icons/signout.svg" alt="Sign out" className="size-6" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;