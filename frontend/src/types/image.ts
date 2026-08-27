import type { PublicUser } from "./user";

export type ImageStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface GeneratedImage {
    id: string;
    prompt: string;
    negativePrompt: string | null;
    resolution: string;
    guidance: number;
    seed: string;
    status: ImageStatus;
    imageUrl: string | null;
    failureReason: string | null;
    createdAt: string;
    author?: PublicUser;
}

export interface GenerateImagePayload {
    prompt: string;
    negativePrompt?: string;
    color?: string;
    resolution: string;
    guidance: number;
}