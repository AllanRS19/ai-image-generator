import { useNavigate } from 'react-router-dom';
import { useImage } from '../hooks/images/useImage';

interface ImageDetailsModalProps {
    imageId: string;
    onClose: () => void;
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const ImageDetailsModal = ({ imageId, onClose }: ImageDetailsModalProps) => {
    const { data: image, isLoading } = useImage(imageId);
    const navigate = useNavigate();

    const handleGenerateWithSettings = () => {
        if (!image) return;

        navigate('/', {
            state: {
                prompt: image.prompt,
                negativePrompt: image.negativePrompt ?? '',
                resolution: image.resolution,
                guidance: image.guidance,
            },
        });
    };

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative flex h-148 w-205 rounded-xl bg-app-bg p-8 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 flex size-10 items-center justify-center rounded-lg bg-surface cursor-pointer"
                    aria-label="Close"
                >
                    <img src="/icons/close-alt.svg" alt="" className="size-6" />
                </button>

                {isLoading || !image ? (
                    <p className="text-app-muted">Loading…</p>
                ) : (
                    <>
                        <div className="flex flex-col gap-3">
                            <div className="size-73 overflow-hidden rounded-lg border-4 border-surface">
                                {image.imageUrl ? (
                                    <img
                                        src={image.imageUrl}
                                        alt={image.prompt}
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-full items-center justify-center text-app-muted">
                                        {image.status === 'failed' ? 'Failed' : 'Generating…'}
                                    </div>
                                )}
                            </div>

                            {image.imageUrl && (
                                <a
                                    href={image.imageUrl}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-fit items-center gap-2 rounded-lg bg-surface px-4 py-2 text-sm font-medium text-app-text"
                                >
                                    <img src="/icons/down-arrow.svg" alt="" className="size-6" />
                                    Download
                                </a>
                            )}
                        </div>

                        <div className="ml-8 flex w-[320px] flex-col justify-between">
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-app-muted">
                                        Prompt details
                                    </p>
                                    <p className="text-base text-app-text">{image.prompt}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-app-muted">
                                        Negative prompt
                                    </p>
                                    <p className="text-base text-app-text">
                                        {image.negativePrompt || 'Null'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-app-muted">
                                        Created on
                                    </p>
                                    <p className="text-base text-app-text">
                                        {formatDate(image.createdAt)}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-app-muted">
                                        Input Resolution
                                    </p>
                                    <p className="text-base text-app-text">{image.resolution}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-app-muted">Seed</p>
                                    <p className="text-base text-app-text">{image.seed}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerateWithSettings}
                                className="flex items-center justify-center gap-2 rounded-xl bg-accent py-3 text-base font-semibold text-app-text cursor-pointer"
                            >
                                <img src="/icons/sparkles.svg" alt="" className="size-6" />
                                Generate with this settings
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}

export default ImageDetailsModal;