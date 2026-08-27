import { useState } from 'react';
import { useGetGenerationHistory } from '../hooks/images/useGetGenerationHistory';
import ImageDetailsModal from '../components/ImageDetailsModal';
import type { GeneratedImage } from '../types/image';
import { formatDate } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

const HistoryItem = ({
    item,
    onOpenDetails,
}: {
    item: GeneratedImage;
    onOpenDetails: (id: string) => void;
}) => {
    return (
        <div className="flex gap-24 border-b border-surface pb-8 last:border-b-0">
            <button
                type="button"
                onClick={() => onOpenDetails(item.id)}
                className="size-81.75 shrink-0 overflow-hidden rounded-lg border-4 border-surface"
            >
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="size-full object-cover"
                        loading='lazy'
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-app-muted">
                        {item.status === 'failed' ? 'Failed' : 'Generating…'}
                    </div>
                )}
            </button>

            <div className="flex flex-wrap content-start gap-x-24 gap-y-6">
                <div className="flex w-67.75 flex-col gap-2">
                    <p className="text-xs font-semibold text-app-muted">
                        Prompt details
                    </p>
                    <p className="text-base text-app-text">{item.prompt}</p>
                </div>
                <div className="flex w-67.75 flex-col gap-2">
                    <p className="text-xs font-semibold text-app-muted">
                        Negative prompt
                    </p>
                    <p className="text-base text-app-text">
                        {item.negativePrompt || 'Null'}
                    </p>
                </div>
                <div className="flex w-67.75 flex-col gap-2">
                    <p className="text-xs font-semibold text-app-muted">Created on</p>
                    <p className="text-base text-app-text">
                        {formatDate(item.createdAt)}
                    </p>
                </div>
                <div className="flex w-67.75 flex-col gap-2">
                    <p className="text-xs font-semibold text-app-muted">
                        Input Resolution
                    </p>
                    <p className="text-base text-app-text">{item.resolution}</p>
                </div>
                <div className="flex w-67.75 flex-col gap-2">
                    <p className="text-xs font-semibold text-app-muted">Seed</p>
                    <p className="text-base text-app-text">{item.seed}</p>
                </div>
            </div>
        </div>
    );
}

const HistoryPage = () => {
    const token = useAuthStore((state) => state.token);
    const { data, isLoading } = useGetGenerationHistory();
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

    return (
        <div className="p-8 text-slate-100">
            <h1 className="text-2xl font-semibold">Generation History</h1>

            {!token ? (
                <div className="flex h-[calc(100vh-96px)] flex-col items-center justify-center gap-3">
                    <h2 className="text-lg text-red-500">
                        You must be logged in to view your history
                    </h2>
                    <p>Please login to your account by clicking the bottom-left button</p>
                </div>
            ) : (
                <div>
                    {isLoading ? (
                        <div className="flex h-[calc(100vh-96px)] flex-col items-center justify-center gap-3">
                            <p className="text-app-muted">Loading generation history...</p>
                        </div>
                    ) : !data || data.items.length === 0 ? (
                        <p className="text-app-muted">No images found.</p>
                    ) : (
                        <div className="mt-8 flex flex-col gap-8">
                            {data.items.map((item) => (
                                <HistoryItem
                                    key={item.id}
                                    item={item}
                                    onOpenDetails={setSelectedImageId}
                                />
                            ))}
                        </div>
                    )}
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

export default HistoryPage;