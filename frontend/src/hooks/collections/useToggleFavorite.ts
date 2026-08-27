import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    addImageToCollection,
    createCollection,
    listCollections,
    removeImageFromCollection,
} from '../../api/collections';

const FAVORITES_COLLECTION_NAME = 'Favorites';

async function getOrCreateFavoritesCollection() {
    const collections = await listCollections();
    const existing = collections.find(
        (c) => c.name === FAVORITES_COLLECTION_NAME,
    );
    return existing ?? createCollection(FAVORITES_COLLECTION_NAME);
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            imageId,
            isFavorited,
        }: {
            imageId: string;
            isFavorited: boolean;
        }) => {
            const favorites = await getOrCreateFavoritesCollection();

            if (isFavorited) {
                await removeImageFromCollection(favorites.id, imageId);
            } else {
                await addImageToCollection(favorites.id, imageId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.invalidateQueries({ queryKey: ['favorites-collection'] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
}