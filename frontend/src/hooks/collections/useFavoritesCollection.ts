import { useQuery } from '@tanstack/react-query';
import { getCollectionById, listCollections } from '../../api/collections';
import { useAuthStore } from '../../store/authStore';

const FAVORITES_COLLECTION_NAME = 'Favorites';

export function useFavoritesCollection() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['favorites-collection'],
        queryFn: async () => {
            const collections = await listCollections();
            const favorites = collections.find(
                (c) => c.name === FAVORITES_COLLECTION_NAME,
            );

            if (!favorites) return null;

            return getCollectionById(favorites.id);
        },
        enabled: !!token,
    });
}