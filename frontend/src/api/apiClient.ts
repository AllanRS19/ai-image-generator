import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface RequestOptions extends RequestInit {
    skipAuth?: boolean;
}

export async function apiClient<T>(
    path: string,
    options: RequestOptions = {},
): Promise<T> {
    const { skipAuth, headers, ...rest } = options;
    const token = useAuthStore.getState().token;

    const finalHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: finalHeaders,
    });

    if (!response.ok) {
        const errorBody: unknown = await response.json().catch(() => null);
        const message =
            errorBody && typeof errorBody === 'object' && 'message' in errorBody
                ? String((errorBody as { message: unknown }).message)
                : `Request failed with status ${response.status}`;

        throw new ApiError(response.status, message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}