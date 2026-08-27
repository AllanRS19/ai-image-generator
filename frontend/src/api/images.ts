import type { PaginatedResult } from "../types/feed";
import type { GeneratedImage, GenerateImagePayload } from "../types/image";
import { apiClient } from "./apiClient";

export function generateImage(payload: GenerateImagePayload) {
    return apiClient<GeneratedImage>('/generate', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export function getImageById(id: string) {
    return apiClient<GeneratedImage>(`/image/${id}`, { skipAuth: true });
}

export function getGenerationHistory() {
    return apiClient<PaginatedResult<GeneratedImage>>('/history');
}