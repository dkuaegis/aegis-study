import {
    type UseMutationResult,
    useMutation,
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
    status: "approved" | "pending";
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
        
        // 201: 스터디 참여 신청 성공
        if (response.status === 201) {
            return response.json<EnrollmentResponse>();
        }
        
        throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: unknown) {
        // HTTP 에러 처리
        if (error && typeof error === 'object' && 'response' in error) {
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
        if (error && typeof error === 'object' && 'response' in error) {
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

// Mutation Hooks
export const useEnrollInStudyMutation = (
    studyId: number,
    onSuccess?: (data: EnrollmentResponse) => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<EnrollmentResponse, HTTPError, EnrollmentPayload> => {
    const queryClient = useQueryClient();

    return useMutation<EnrollmentResponse, HTTPError, EnrollmentPayload>({
        mutationFn: (payload) => enrollInStudy(studyId, payload),
        onSuccess: (data) => {
            // 스터디 상세 정보 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ["studyDetail", studyId],
            });
            // 스터디 목록 캐시 무효화
            queryClient.invalidateQueries({
                queryKey: ["studies"],
            });
            if (onSuccess) onSuccess(data);
        },
        onError: (error: HTTPError) => {
            if (onError) onError(error);
        },
    });
};

export const useCancelEnrollmentMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<void, HTTPError, void> => {
    const queryClient = useQueryClient();

    return useMutation<void, HTTPError, void>({
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
            if (onSuccess) onSuccess();
        },
        onError: (error: HTTPError) => {
            if (onError) onError(error);
        },
    });
};
