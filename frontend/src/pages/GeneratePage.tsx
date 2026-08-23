import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient, ApiError } from '../api/apiClient';
import { COLOR_SWATCHES, RESOLUTIONS } from '../constants';

type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface GeneratedImage {
    id: string;
    prompt: string;
    status: ImageStatus;
    imageUrl: string | null;
    failureReason: string | null;
}

const GeneratePage = () => {
    const token = useAuthStore((state) => state.token);

    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [color, setColor] = useState<string | null>(null);
    const [resolution, setResolution] = useState(RESOLUTIONS[0].value);
    const [guidance, setGuidance] = useState(7.5);

    const [image, setImage] = useState<GeneratedImage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, []);

    const pollImageStatus = (id: string) => {
        pollRef.current = setInterval(() => {
            void (async () => {
                try {
                    const updated = await apiClient<GeneratedImage>(`/image/${id}`, {
                        skipAuth: true,
                    });
                    setImage(updated);

                    if (updated.status === 'completed' || updated.status === 'failed') {
                        if (pollRef.current) clearInterval(pollRef.current);
                    }
                } catch {
                    if (pollRef.current) clearInterval(pollRef.current);
                }
            })();
        }, 2000);
    };

    const handleSubmit = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            const created = await apiClient<GeneratedImage>('/generate', {
                method: 'POST',
                body: JSON.stringify({
                    prompt,
                    negativePrompt: negativePrompt || undefined,
                    color: color ?? undefined,
                    resolution,
                    guidance,
                }),
            });

            setImage(created);
            pollImageStatus(created.id);
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : 'Something went wrong';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isGenerating = image?.status === 'pending' || image?.status === 'processing';

    return (
        <div className="flex gap-7.5 px-18 py-13">
            <div className="flex w-full flex-col gap-8">
                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-app-muted">Prompt</label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe the image you want to generate"
                        rows={3}
                        className="rounded-lg border-[0.5px] border-surface-border bg-surface p-4 text-base text-app-text placeholder:text-app-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-app-muted">
                        Negative Prompt (Optional)
                    </label>
                    <input
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Enter the prompt"
                        className="rounded-lg border-[0.5px] border-surface-border bg-surface p-4 text-base text-app-text placeholder:text-app-muted focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-app-muted">Colors</label>
                    <div className="flex gap-3">
                        {COLOR_SWATCHES.map((swatch) => (
                            <button
                                key={swatch.name}
                                type="button"
                                onClick={() => setColor(swatch.name)}
                                className={`size-8 overflow-hidden rounded-full ring-offset-2 ring-offset-app-bg transition-shadow ${color === swatch.name ? 'ring-2 ring-accent' : ''
                                    }`}
                                aria-label={swatch.name}
                            >
                                <img src={swatch.icon} alt={swatch.name} className="size-full" />
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => setColor(null)}
                            className="flex size-8 items-center justify-center rounded-full ring-2 ring-app-muted bg-transparent"
                            aria-label="Clear color"
                        >
                            <img src="/icons/close.svg" alt="Clear" className="size-4" />
                        </button>
                    </div>
                </div>

                <div className="flex w-127.75 flex-col gap-3">
                    <label className="text-sm font-semibold text-app-muted">Resolution</label>
                    <div className="flex flex-wrap gap-3">
                        {RESOLUTIONS.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setResolution(option.value)}
                                className={`rounded-lg px-3 py-2 text-xs transition-colors ${resolution === option.value
                                    ? 'bg-accent text-app-text'
                                    : 'bg-surface text-app-text hover:bg-surface-border'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-app-muted">
                        Guidance ({guidance.toFixed(1)})
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={20}
                        step={0.1}
                        value={guidance}
                        onChange={(e) => setGuidance(Number(e.target.value))}
                        className="h-1.5 w-full appearance-none rounded-full bg-surface-border accent-accent"
                    />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                {!token && (
                    <p className="text-sm text-app-muted">
                        Sign in with GitHub (bottom-left) to generate images.
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={!token || !prompt.trim() || isSubmitting || isGenerating}
                    className="generate-image-button"
                >
                    <img src="/icons/sparkles.svg" alt="" className="size-6" />
                    {isGenerating ? 'Generating…' : 'Generate Image'}
                </button>
            </div>

            <div className="flex w-full h-150 items-center justify-center rounded-lg border-4 border-surface bg-surface">
                {image?.imageUrl ? (
                    <img
                        src={image.imageUrl}
                        alt={image.prompt}
                        className="size-full rounded-lg object-cover"
                    />
                ) : isGenerating ? (
                    <p className="text-app-muted">Generating your image…</p>
                ) : image?.status === 'failed' ? (
                    <p className="px-8 text-center text-red-400">
                        Generation failed: {image.failureReason}
                    </p>
                ) : (
                    <p className="text-app-muted">Your generated image will appear here</p>
                )}
            </div>
        </div>
    );
}

export default GeneratePage;