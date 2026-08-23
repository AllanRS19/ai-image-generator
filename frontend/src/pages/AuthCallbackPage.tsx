import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const setToken = useAuthStore((state) => state.setToken);

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            setToken(token);
        }

        navigate('/', { replace: true });
    }, [searchParams, navigate, setToken]);

    return (
        <div className="flex min-h-screen items-center justify-center text-slate-100">
            Signing you in…
        </div>
    );
}

export default AuthCallbackPage;