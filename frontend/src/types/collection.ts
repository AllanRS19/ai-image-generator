import type { FeedItem } from './feed';

export interface Collection {
    id: string;
    name: string;
    ownerId: string;
    images?: FeedItem[];
    createdAt: string;
}