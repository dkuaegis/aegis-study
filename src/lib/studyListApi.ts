import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { StudyListItem } from "@/types/study";

export const STUDIES_QUERY_KEY = ["studies"] as const;

export async function fetchStudies(
    signal?: AbortSignal
): Promise<StudyListItem[]> {
    return apiClient
        .get(API_ENDPOINTS.STUDIES, { signal })
        .json<StudyListItem[]>();
}

export const useStudyListQuery = (
    onError?: (error: Error) => void
): UseQueryResult<StudyListItem[], Error> => {
    return useQuery<StudyListItem[], Error>({
        queryKey: STUDIES_QUERY_KEY,
        queryFn: ({ signal }) => fetchStudies(signal),
        ...(onError && { onError }),
    });
};
