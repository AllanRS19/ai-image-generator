import { useQuery } from "@tanstack/react-query";
import { getImageById } from "../../api/images";

export function useImage(imageId: string | null) {
    return useQuery({
        queryKey: ['image', imageId],
        queryFn: () => getImageById(imageId as string),
        enabled: !!imageId,
        refetchInterval: (query) => {
            const status = query.state.data?.status;
            return status === 'pending' || status === 'processing' ? 2000 : false;
        }
    })
}