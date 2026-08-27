import { useQuery } from '@tanstack/react-query';
import { getFeed, searchFeed } from '../../api/feed';

export function useFeed(query: string) {
    const trimmed = query.trim();

    return useQuery({
        queryKey: ['feed', trimmed],
        queryFn: () => (trimmed ? searchFeed(trimmed) : getFeed()),
    });
}