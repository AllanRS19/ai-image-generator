import { useOptimistic, useState, useTransition } from 'react';
import { useFavoritesCollection } from '../hooks/collections/useFavoritesCollection';
import { useToggleFavorite } from '../hooks/collections/useToggleFavorite';
import { useAuthStore } from '../store/authStore';
import FeedCard from '../components/FeedCard';
import ImageDetailsModal from '../components/ImageDetailsModal';
import type { FeedItem } from '../types/feed';
import { sileo } from 'sileo';

const CollectionsPage = () => {
    const token = useAuthStore((state) => state.token);
    const { data: collection, isLoading } = useFavoritesCollection();
    const toggleFavorite = useToggleFavorite();
    const [, startTransition] = useTransition();
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    const images = collection?.images ?? [];

    const [optimisticImages, removeOptimisticImage] = useOptimistic(
        images,
        (current: FeedItem[], imageId: string) =>
            current.filter((img) => img.id !== imageId),
    );

    const handleRemoveFavorite = (imageId: string) => {
        startTransition(async () => {
            removeOptimisticImage(imageId);

            try {
                await toggleFavorite.mutateAsync({ imageId, isFavorited: true });
                sileo.success({
                    title: 'Removed from Favorites'
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
            <h1 className="mb-8 text-xl font-semibold text-app-text">My Collection</h1>

            {!token ? (
                <div className="flex h-[calc(100vh-160px)] flex-col items-center justify-center gap-3">
                    <h2 className="text-lg text-red-500">
                        You must be logged in to view your collection
                    </h2>
                    <p className="text-app-muted">
                        Please login to your account by clicking the bottom-left button
                    </p>
                </div>
            ) : isLoading ? (
                <p className="text-app-muted">Loading your collection…</p>
            ) : optimisticImages.length === 0 ? (
                <p className="text-app-muted">
                    You haven't saved any images yet. Bookmark images from the Feed to
                    see them here.
                </p>
            ) : (
                <div className="columns-4 gap-6">
                    {optimisticImages.map((item) => (
                        <FeedCard
                            key={item.id}
                            item={item}
                            isFavorited
                            onToggleFavorite={handleRemoveFavorite}
                            onOpenDetails={setSelectedImageId}
                            canFavorite
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
};

export default CollectionsPage;