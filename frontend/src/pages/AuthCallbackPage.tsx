import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Token persistence (Zustand + storage) gets wired in next part.
            console.log('Received token:', token);
        }

        navigate('/', { replace: true });
    }, [searchParams, navigate]);

    return (
        <div className="flex min-h-screen items-center justify-center text-slate-100">
            Signing you in…
        </div>
    );
}

export default AuthCallbackPage;