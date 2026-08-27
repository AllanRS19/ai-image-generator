import type { FeedItem } from '../types/feed';

interface FeedCardProps {
    item: FeedItem;
    isFavorited: boolean;
    onToggleFavorite: (imageId: string) => void;
    onOpenDetails: (imageId: string) => void;
    canFavorite: boolean;
}

const FeedCard = ({
    item,
    isFavorited,
    onToggleFavorite,
    onOpenDetails,
    canFavorite,
}: FeedCardProps) => {
    return (
        <div className="mb-6 break-inside-avoid">
            <button
                type="button"
                onClick={() => onOpenDetails(item.id)}
                className="block w-full overflow-hidden rounded-lg border-4 border-surface"
            >
                <img
                    src={item.imageUrl ?? undefined}
                    alt={item.prompt}
                    className="w-full object-cover"
                />
            </button>
            <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {item.author.avatarUrl && (
                        <img
                            src={item.author.avatarUrl}
                            alt={item.author.username}
                            className="size-6 rounded-full"
                        />
                    )}
                    <p className="text-xs font-medium tracking-tight text-app-text">
                        {item.author.username}
                    </p>
                </div>
                {canFavorite && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(item.id);
                        }}
                        className={`flex size-7 items-center justify-center rounded ${isFavorited ? 'bg-accent' : 'bg-surface'
                            }`}
                        aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                    >
                        <img src="/icons/bookmark.svg" alt="" className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default FeedCard;