interface LoginModalProps {
    onClose: () => void;
}

const GITHUB_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/github`;

const LoginModal = ({ onClose }: LoginModalProps) => {
    return (
        <div className="fixed inset-0 size-full flex items-center justify-center backdrop-blur-sm">
            <div className="relative max-w-xl w-full p-20 rounded-xl bg-app-bg shadow-lg flex flex-col items-center justify-center gap-4">
                <h2 className="text-xl text-white">Sign In to Continue</h2>
                <a
                    href={GITHUB_LOGIN_URL}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent text-white py-3"
                    aria-label="Sign in with GitHub"
                >
                    <img src="/icons/github.svg" alt="Sign in" className="size-6" />
                    <p className="text-sm">Sign in with Github</p>
                </a>

                <button
                    className="absolute top-3 right-3 size-10 flex items-center justify-center rounded-lg cursor-pointer bg-surface"
                    onClick={onClose}
                >
                    <img
                        src="/icons/close-alt.svg"
                        alt="Close"
                        width={24}
                        height={24}
                    />
                </button>
            </div>
        </div>
    )
}

export default LoginModal;