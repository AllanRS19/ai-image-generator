import type { PublicUser } from './user';

export interface FeedItem {
    id: string;
    prompt: string;
    imageUrl: string | null;
    createdAt: string;
    author: PublicUser;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}