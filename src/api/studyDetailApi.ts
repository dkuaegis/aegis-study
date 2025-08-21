import { type UseQueryResult, useQuery } from "@tanstack/react-query";
import type { HTTPError, TimeoutError } from "ky";
import type { StudyDetail } from "@/types/study";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

// Ky에서 발생할 수 있는 모든 오류 타입을 포괄하는 유니온 타입
type StudyDetailError = HTTPError | TimeoutError | DOMException | TypeError;

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
    studyId: number
): UseQueryResult<StudyDetail, StudyDetailError> => {
    return useQuery<StudyDetail, StudyDetailError>({
        queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
        queryFn: ({ signal }) => fetchStudyDetail(studyId, signal),
        enabled: Number.isFinite(studyId) && studyId > 0,
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
    });
};
