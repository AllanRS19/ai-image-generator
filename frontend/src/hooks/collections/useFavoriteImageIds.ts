import { useQuery } from '@tanstack/react-query';
import { getCollectionById, listCollections } from '../../api/collections';
import { useAuthStore } from '../../store/authStore';

const FAVORITES_COLLECTION_NAME = 'Favorites';

export function useFavoriteImageIds() {
    const token = useAuthStore((state) => state.token);

    return useQuery({
        queryKey: ['favorites'],
        queryFn: async () => {
            const collections = await listCollections();
            const favorites = collections.find(
                (c) => c.name === FAVORITES_COLLECTION_NAME,
            );

            if (!favorites) return new Set<string>();

            const detailed = await getCollectionById(favorites.id);
            return new Set((detailed.images ?? []).map((img) => img.id));
        },
        enabled: !!token,
    });
}