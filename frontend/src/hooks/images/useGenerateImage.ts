import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneratedImage } from "../../types/image";
import { generateImage } from "../../api/images";

export function useGenerateImage(onSuccess?: (image: GeneratedImage) => void) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateImage,
        onSuccess: (created) => {
            queryClient.setQueryData(['image', created.id], created);
            onSuccess?.(created);
        }
    });
}