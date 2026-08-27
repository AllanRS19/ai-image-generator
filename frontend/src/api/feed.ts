import type { FeedItem, PaginatedResult } from '../types/feed';
import { apiClient } from './apiClient';

export function getFeed(page = 1, limit = 20) {
    return apiClient<PaginatedResult<FeedItem>>(
        `/feed?page=${page}&limit=${limit}`,
        { skipAuth: true },
    );
}

export function searchFeed(query: string, page = 1, limit = 20) {
    return apiClient<PaginatedResult<FeedItem>>(
        `/feed/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        { skipAuth: true },
    );
}