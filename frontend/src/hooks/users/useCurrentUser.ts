import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../api/users";
import { useAuthStore } from "../../store/authStore";

export function useCurrentUser() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['me'],
        queryFn: getCurrentUser,
        enabled: !!token,
        staleTime: 5 * 60_000
    });
}