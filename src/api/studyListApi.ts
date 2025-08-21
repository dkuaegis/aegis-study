import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { StudyListItem } from "@/types/study";

export const STUDIES_QUERY_KEY = ["studies"] as const;

async function fetchStudies(signal?: AbortSignal): Promise<StudyListItem[]> {
    return apiClient
        .get(API_ENDPOINTS.STUDIES, { signal })
        .json<StudyListItem[]>();
}

export const useStudyListQuery = (
    onError?: (error: HTTPError) => void
): UseQueryResult<StudyListItem[], HTTPError> => {
    return useQuery<StudyListItem[], HTTPError>({
        queryKey: STUDIES_QUERY_KEY,
        queryFn: ({ signal }) => fetchStudies(signal),
        ...(onError && { onError }),
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });
};
