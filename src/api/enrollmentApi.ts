import {
    type QueryClient,
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

export interface UserApplicationDetail {
    studyApplicationId: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    applicationReason: string;
    studyTitle: string;
    studyDescription: string;
}

export interface UpdateApplicationPayload {
    applicationReason: string;
}

// Constants
const QUERY_OPTIONS = {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
} as const;

const ERROR_MESSAGES = {
    enrollment: {
        400: "잘못된 요청 데이터입니다.",
        403: "지원 기간이 아닙니다.",
        404: "스터디를 찾을 수 없습니다.",
        409: "이미 신청된 상태입니다.",
        default: "스터디 신청 중 오류가 발생했습니다.",
    },
    cancel: {
        400: "잘못된 요청입니다.",
        404: "스터디를 찾을 수 없습니다.",
        default: "신청 취소 중 오류가 발생했습니다.",
    },
    userApplication: {
        404: "지원서를 찾을 수 없습니다.",
        default: "지원서 조회 중 오류가 발생했습니다.",
    },
    updateApplication: {
        400: "잘못된 요청 데이터입니다.",
        404: "지원서를 찾을 수 없습니다.",
        default: "지원서 수정 중 오류가 발생했습니다.",
    },
} as const;

export const ENROLLMENT_QUERY_KEYS = {
    studyStatus: (studyId: number) => ["studyStatus", studyId] as const,
    userApplication: (studyId: number) => ["userApplication", studyId] as const,
} as const;

// Utility Functions
function handleHTTPError(
    error: unknown,
    errorMessages: Record<number | "default", string>
): never {
    if (error instanceof HTTPError) {
        const status = error.response?.status;
        const message =
            (status && errorMessages[status]) || errorMessages.default;
        throw new Error(message);
    }
    throw error;
}

function invalidateStudyQueries(
    queryClient: QueryClient,
    studyId: number
): void {
    queryClient.invalidateQueries({ queryKey: ["studyDetail", studyId] });
    queryClient.invalidateQueries({ queryKey: ["studies"] });
    queryClient.invalidateQueries({ queryKey: ["userRoles"] });
    queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
    });
    queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
    });
}

function isValidStudyId(studyId: number): boolean {
    return Number.isFinite(studyId) && studyId > 0;
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

        const fallback: EnrollmentResponse = {
            message: "지원이 완료되었습니다.",
            status: "PENDING",
        };
        if (response.status === 204) return fallback;
        const contentType =
            response.headers.get("content-type")?.toLowerCase() ?? "";
        if (!contentType.startsWith("application/json")) return fallback;
        try {
            return (await response.json()) as EnrollmentResponse;
        } catch {
            return fallback;
        }
    } catch (error: unknown) {
        handleHTTPError(error, ERROR_MESSAGES.enrollment);
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
        if (error instanceof HTTPError && error.response?.status === 404) {
            return null;
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
        handleHTTPError(error, ERROR_MESSAGES.cancel);
    }
}

export async function getUserApplicationDetail(
    studyId: number,
    signal?: AbortSignal
): Promise<UserApplicationDetail> {
    try {
        return await apiClient
            .get(API_ENDPOINTS.USER_APPLICATION(studyId), { signal })
            .json<UserApplicationDetail>();
    } catch (error: unknown) {
        handleHTTPError(error, ERROR_MESSAGES.userApplication);
    }
}

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
        handleHTTPError(error, ERROR_MESSAGES.updateApplication);
    }
}

// Query Hooks
export const useStudyStatusQuery = (
    studyId: number,
    enabled: boolean = true
): UseQueryResult<StudyStatusResponse | null, Error> => {
    return useQuery<StudyStatusResponse | null, Error>({
        queryKey: ENROLLMENT_QUERY_KEYS.studyStatus(studyId),
        queryFn: ({ signal }) => getStudyStatus(studyId, signal),
        enabled: enabled && isValidStudyId(studyId),
        ...QUERY_OPTIONS,
    });
};

export const useUserApplicationDetailQuery = (
    studyId: number,
    enabled: boolean = false
): UseQueryResult<UserApplicationDetail, Error> => {
    return useQuery<UserApplicationDetail, Error>({
        queryKey: ENROLLMENT_QUERY_KEYS.userApplication(studyId),
        queryFn: ({ signal }) => getUserApplicationDetail(studyId, signal),
        enabled: enabled && isValidStudyId(studyId),
        ...QUERY_OPTIONS,
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
            invalidateStudyQueries(queryClient, studyId);
            onSuccess?.(data);
        },
        onError: (error: Error) => {
            onError?.(error);
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
            invalidateStudyQueries(queryClient, studyId);
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};

export const useUpdateUserApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<void, Error, UpdateApplicationPayload> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, UpdateApplicationPayload>({
        mutationFn: (payload) => updateUserApplication(studyId, payload),
        onSuccess: () => {
            invalidateStudyQueries(queryClient, studyId);
            onSuccess?.();
        },
        onError: (error: Error) => {
            onError?.(error);
        },
    });
};
