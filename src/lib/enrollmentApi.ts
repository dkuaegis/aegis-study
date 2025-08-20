import {
    type UseMutationResult,
    type UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

// Types
export interface EnrollmentPayload {
    applicationReason: string | null;
}

export interface EnrollmentResponse {
    message: string;
    status: "APPROVED" | "PENDING";
}

export interface StudyStatusResponse {
    studyApplicationId: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

// API Functions
export async function enrollInStudy(
    studyId: number,
    payload: EnrollmentPayload,
    signal?: AbortSignal
): Promise<EnrollmentResponse> {
    try {
        const response = await apiClient.post(
            API_ENDPOINTS.STUDY_ENROLLMENT(studyId),
            {
                json: payload,
                signal,
            }
        );

        if (response.status === 201) {
            return await response.json<EnrollmentResponse>();
        }

        throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: unknown) {
        if (error instanceof Error && "response" in error) {
            const httpError = error as HTTPError;
            const status = httpError.response?.status;
            switch (status) {
                case 400:
                    throw new Error("잘못된 요청 데이터입니다.");
                case 404:
                    throw new Error("스터디를 찾을 수 없습니다.");
                default:
                    throw new Error("스터디 신청 중 오류가 발생했습니다.");
            }
        }
        throw error;
    }
}

export async function getStudyStatus(
    studyId: number,
    signal?: AbortSignal
): Promise<StudyStatusResponse | null> {
    try {
        return await apiClient
            .get(API_ENDPOINTS.STUDY_STATUS(studyId), { signal })
            .json<StudyStatusResponse>();
    } catch (error: unknown) {
        // 404는 신청하지 않은 상태로 처리
        if (error && typeof error === "object" && "response" in error) {
            const httpError = error as HTTPError;
            if (httpError.response?.status === 404) {
                return null;
            }
        }
        throw error;
    }
}

export async function cancelEnrollment(
    studyId: number,
    signal?: AbortSignal
): Promise<void> {
    try {
        await apiClient.delete(API_ENDPOINTS.STUDY_ENROLLMENT(studyId), {
            signal,
        });
    } catch (error: unknown) {
        // HTTP 에러 처리
        if (error && typeof error === "object" && "response" in error) {
            const httpError = error as HTTPError;
            const status = httpError.response?.status;
            switch (status) {
                case 400:
                    throw new Error("잘못된 요청입니다.");
                case 404:
                    throw new Error("스터디를 찾을 수 없습니다.");
                default:
                    throw new Error("신청 취소 중 오류가 발생했습니다.");
            }
        }
        throw error;
    }
}

// Query Keys
export const ENROLLMENT_QUERY_KEYS = {
    studyStatus: (studyId: number) => ["studyStatus", studyId] as const,
} as const;

// Query Hooks
export const useStudyStatusQuery = (
    studyId: number
): UseQueryResult<StudyStatusResponse | null, Error> => {
    return useQuery<StudyStatusResponse | null, Error>({
        queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
        queryFn: ({ signal }) => getStudyStatus(studyId, signal),
        enabled: Number.isFinite(studyId) && studyId > 0,
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
};

// Mutation Hooks
export const useEnrollInStudyMutation = (
    studyId: number,
    onSuccess?: (data: EnrollmentResponse) => void,
    onError?: (error: Error) => void
): UseMutationResult<EnrollmentResponse, Error, EnrollmentPayload> => {
    const queryClient = useQueryClient();

    return useMutation<EnrollmentResponse, Error, EnrollmentPayload>({
        mutationFn: (payload) => enrollInStudy(studyId, payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["studyDetail", studyId],
            });
            queryClient.invalidateQueries({
                queryKey: ["studies"],
            });
            // 상태 쿼리도 무효화
            queryClient.invalidateQueries({
                queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
            });
            if (onSuccess) onSuccess(data);
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};

export const useCancelEnrollmentMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<void, Error, void> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: () => cancelEnrollment(studyId),
        onSuccess: () => {
            // 스터디 상세 정보 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ["studyDetail", studyId],
            });
            // 스터디 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ["studies"],
            });
            // 상태 쿼리도 무효화
            queryClient.invalidateQueries({
                queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
            });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};
