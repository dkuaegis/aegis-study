import {
    type UseMutationResult,
    type UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { HTTPError } from "ky";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

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

// 사용자 지원서 상세 정보
export interface UserApplicationDetail {
    studyApplicationId: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    applicationReason: string;
    studyTitle: string;
    studyDescription: string;
}

// 지원서 수정 페이로드
export interface UpdateApplicationPayload {
    applicationReason: string;
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

        if (response.ok) {
            const fallback: EnrollmentResponse = {
                message: "지원이 완료되었습니다.",
                status: "PENDING",
            };
            if (response.status === 204) return fallback;
            const contentType =
                response.headers.get("content-type")?.toLowerCase() ?? "";
            if (!contentType.includes("application/json")) return fallback;
            try {
                return (await response.json()) as EnrollmentResponse;
            } catch {
                return fallback;
            }
        }

        throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error: unknown) {
        if (error instanceof HTTPError) {
            const status = error.response?.status;
            switch (status) {
                case 400:
                    throw new Error("잘못된 요청 데이터입니다.");
                case 404:
                    throw new Error("스터디를 찾을 수 없습니다.");
                case 409:
                    throw new Error("이미 신청된 상태입니다.");
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
        if (error instanceof HTTPError) {
            if (error.response?.status === 404) {
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
        if (error instanceof HTTPError) {
            const status = error.response?.status;
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
    userApplication: (studyId: number) => ["userApplication", studyId] as const,
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
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
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
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
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

// 사용자 지원서 상세 조회 API
export async function getUserApplicationDetail(
    studyId: number,
    signal?: AbortSignal
): Promise<UserApplicationDetail> {
    try {
        return await apiClient
            .get(API_ENDPOINTS.USER_APPLICATION(studyId), { signal })
            .json<UserApplicationDetail>();
    } catch (error: unknown) {
        if (error instanceof HTTPError) {
            const status = error.response?.status;
            switch (status) {
                case 404:
                    throw new Error("지원서를 찾을 수 없습니다.");
                default:
                    throw new Error("지원서 조회 중 오류가 발생했습니다.");
            }
        }
        throw error;
    }
}

// 사용자 지원서 수정 API
export async function updateUserApplication(
    studyId: number,
    payload: UpdateApplicationPayload,
    signal?: AbortSignal
): Promise<void> {
    try {
        await apiClient.put(API_ENDPOINTS.USER_APPLICATION(studyId), {
            json: payload,
            signal,
        });
    } catch (error: unknown) {
        if (error instanceof HTTPError) {
            const status = error.response?.status;
            switch (status) {
                case 400:
                    throw new Error("잘못된 요청 데이터입니다.");
                case 404:
                    throw new Error("지원서를 찾을 수 없습니다.");
                default:
                    throw new Error("지원서 수정 중 오류가 발생했습니다.");
            }
        }
        throw error;
    }
}

// 사용자 지원서 상세 조회 쿼리 훅
export const useUserApplicationDetailQuery = (
    studyId: number,
    enabled: boolean = false
): UseQueryResult<UserApplicationDetail | null, Error> => {
    return useQuery<UserApplicationDetail | null, Error>({
        queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
        queryFn: ({ signal }) => getUserApplicationDetail(studyId, signal),
        enabled: enabled && Number.isFinite(studyId) && studyId > 0,
        staleTime: 5 * 60 * 1000, // 5분
        gcTime: 10 * 60 * 1000, // 10분
    });
};

// 사용자 지원서 수정 뮤테이션 훅
export const useUpdateUserApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<void, Error, UpdateApplicationPayload> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, UpdateApplicationPayload>({
        mutationFn: (payload) => updateUserApplication(studyId, payload),
        onSuccess: () => {
            // 관련 쿼리들 무효화
            queryClient.invalidateQueries({
                queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
            });
            queryClient.invalidateQueries({
                queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
            });
            queryClient.invalidateQueries({
                queryKey: ["studyDetail", studyId],
            });
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};
