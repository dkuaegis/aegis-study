import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { StudyDetail } from "@/types/study";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

export const STUDY_DETAIL_QUERY_KEY = (studyId: number) =>
    ["studyDetail", studyId] as const;

export async function fetchStudyDetail(
    studyId: number,
    signal?: AbortSignal
): Promise<StudyDetail> {
    return apiClient
        .get(`${API_ENDPOINTS.STUDIES}/${studyId}`, { signal })
        .json<StudyDetail>();
}

export const useStudyDetailQuery = (
    studyId: number,
    onError?: (error: Error) => void
): UseQueryResult<StudyDetail, Error> => {
    return useQuery<StudyDetail, Error>({
        queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
        queryFn: ({ signal }) => fetchStudyDetail(studyId, signal),
        enabled: !!studyId,
        ...(onError && { onError }),
    });
};
