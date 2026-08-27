import { apiClient } from './apiClient';
import type { Collection } from '../types/collection';

export function listCollections() {
    return apiClient<Collection[]>('/collections');
}

export function getCollectionById(id: string) {
    return apiClient<Collection>(`/collections/${id}`);
}

export function createCollection(name: string) {
    return apiClient<Collection>('/collections', {
        method: 'POST',
        body: JSON.stringify({ name }),
    });
}

export function addImageToCollection(collectionId: string, imageId: string) {
    return apiClient<Collection>(`/collections/${collectionId}/images`, {
        method: 'POST',
        body: JSON.stringify({ imageId }),
    });
}

export function removeImageFromCollection(
    collectionId: string,
    imageId: string,
) {
    return apiClient<Collection>(
        `/collections/${collectionId}/images/${imageId}`,
        { method: 'DELETE' },
    );
}