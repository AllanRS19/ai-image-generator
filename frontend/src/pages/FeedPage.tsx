import { useEffect, useOptimistic, useState, useTransition } from 'react';
import { useFeed } from '../hooks/feed/useFeed';
import { useFavoriteImageIds } from '../hooks/collections/useFavoriteImageIds';
import { useToggleFavorite } from '../hooks/collections/useToggleFavorite';
import { useAuthStore } from '../store/authStore';
import FeedCard from '../components/FeedCard';
import ImageDetailsModal from '../components/ImageDetailsModal';
import { sileo } from 'sileo';

const FeedPage = () => {
    const token = useAuthStore((state) => state.token);
    const [searchInput, setSearchInput] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(searchInput), 400);
        return () => clearTimeout(timeout);
    }, [searchInput]);

    const { data, isLoading } = useFeed(debouncedQuery);
    const { data: favoriteIds } = useFavoriteImageIds();
    const toggleFavorite = useToggleFavorite();
    const [, startTransition] = useTransition();

    const [optimisticFavorites, setOptimisticFavorite] = useOptimistic(
        favoriteIds ?? new Set<string>(),
        (current, imageId: string) => {
            const next = new Set(current);
            if (next.has(imageId)) {
                next.delete(imageId);
            } else {
                next.add(imageId);
            }
            return next;
        },
    );

    const handleToggleFavorite = (imageId: string) => {
        const wasFavorited = optimisticFavorites.has(imageId);

        startTransition(async () => {
            setOptimisticFavorite(imageId);

            try {
                await toggleFavorite.mutateAsync({
                    imageId,
                    isFavorited: wasFavorited,
                });
                sileo.success({
                    title: wasFavorited ? 'Removed from Favorites' : 'Saved to Favorites',
                });
            } catch {
                sileo.error({
                    title: 'Could not update favorites — please try again'
                });
            }
        });
    };

    return (
        <div className="px-17.75 py-8">
            <div className="relative mb-6 w-128.25">
                <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search images by keywords"
                    className="w-full rounded-lg border-2 border-surface bg-transparent py-3 pl-4 pr-12 text-base text-app-text placeholder:text-app-muted focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <img
                    src="/icons/search.svg"
                    alt=""
                    className="pointer-events-none absolute right-4 top-1/2 size-6 -translate-y-1/2"
                />
            </div>

            {isLoading ? (
                <p className="text-app-muted">Loading feed…</p>
            ) : !data || data.items.length === 0 ? (
                <p className="text-app-muted">No images found.</p>
            ) : (
                <div className="columns-4 gap-6">
                    {data.items.map((item) => (
                        <FeedCard
                            key={item.id}
                            item={item}
                            isFavorited={optimisticFavorites.has(item.id)}
                            onToggleFavorite={handleToggleFavorite}
                            onOpenDetails={setSelectedImageId}
                            canFavorite={!!token}
                        />
                    ))}
                </div>
            )}

            {selectedImageId && (
                <ImageDetailsModal
                    imageId={selectedImageId}
                    onClose={() => setSelectedImageId(null)}
                />
            )}
        </div>
    );
}

export default FeedPage;