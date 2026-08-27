import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '../api/apiClient';
import { COLOR_SWATCHES, RESOLUTIONS } from '../constants';
import { useGenerateImage } from '../hooks/images/useGenerateImage';
import { useImage } from '../hooks/images/useImage';

interface PrefillState {
    prompt?: string;
    negativePrompt?: string;
    resolution?: string;
    guidance?: number;
}

const GeneratePage = () => {
    const token = useAuthStore((state) => state.token);
    const location = useLocation();
    const prefill = (location.state as PrefillState | null) ?? {};

    const [prompt, setPrompt] = useState(prefill.prompt ?? '');
    const [negativePrompt, setNegativePrompt] = useState(
        prefill.negativePrompt ?? '',
    );
    const [color, setColor] = useState<string | null>(null);
    const [resolution, setResolution] = useState(
        prefill.resolution ?? RESOLUTIONS[0].value,
    );
    const [guidance, setGuidance] = useState(prefill.guidance ?? 7.5);
    const [activeImageId, setActiveImageId] = useState<string | null>(null);

    const generateMutation = useGenerateImage((created) => setActiveImageId(created.id));

    const { data: image } = useImage(activeImageId);

    const handleSubmit = () => {
        generateMutation.mutate({
            prompt,
            negativePrompt: negativePrompt || undefined,
            color: color ?? undefined,
            resolution,
            guidance
        });
    }

    const isGenerating = image?.status === 'pending' || image?.status === 'processing';

    const errorMessage = generateMutation.error instanceof ApiError
        ? generateMutation.error.message
        : generateMutation.error
            ? 'Something went wrong'
            : null;

    return (
        <div className="flex flex-col xl:flex-row gap-7.5 px-18 py-13">
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

                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

                {!token && (
                    <p className="text-sm text-app-muted">
                        Sign in with GitHub (bottom-left) to generate images.
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => void handleSubmit()}
                    disabled={!token || !prompt.trim() || generateMutation.isPending || isGenerating}
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