import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { StudyListItem } from "@/types/study";

export async function fetchStudies(): Promise<StudyListItem[]> {
    return apiClient.get(API_ENDPOINTS.STUDIES).json<StudyListItem[]>();
}

export const useStudyListQuery = (onError?: (error: Error) => void) => {
    return useQuery<StudyListItem[], Error>({
        queryKey: ["studies"],
        queryFn: fetchStudies,
        ...(onError && { onError }),
    });
};
