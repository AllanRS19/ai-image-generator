import { useQuery } from "@tanstack/react-query";
import { getGenerationHistory } from "../../api/images";

export function useGetGenerationHistory() {
    return useQuery({
        queryKey: ['history'],
        queryFn: () => getGenerationHistory(),
    });
}