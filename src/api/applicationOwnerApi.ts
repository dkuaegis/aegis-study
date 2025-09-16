import {
    type UseMutationResult,
    type UseQueryOptions,
    type UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { HTTPError } from "ky";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

// Types
export interface ApplicationApiResponse {
    studyApplicationId: number;
    name: string;
    studentId: string;
    phoneNumber: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    updatedAt: string;
}

export interface ApplicationTextResponse {
    applicationReason: string;
}

export interface UpdateApplicationStatusPayload {
    status: "APPROVED" | "REJECTED";
}

// Query Keys
export const APPLICATION_QUERY_KEYS = {
    studyApplications: (studyId: number) =>
        ["studyApplications", studyId] as const,
    applicationText: (studyId: number, applicationId: number) =>
        ["applicationText", studyId, applicationId] as const,
} as const;

// Fetch Functions
export async function fetchStudyApplications(
    studyId: number,
    signal?: AbortSignal
): Promise<ApplicationApiResponse[]> {
    try {
        const res = await apiClient
            .get(API_ENDPOINTS.STUDY_APPLICATIONS(studyId), { signal })
            .json<ApplicationApiResponse[]>();
        return res;
    } catch (err: unknown) {
        const name = (err as { name?: string })?.name;
        if (
            name === "AbortError" ||
            name === "CanceledError" ||
            name === "CancelledError"
        ) {
            throw err as Error;
        }
        if (err instanceof HTTPError) {
            const message = getApplicationActionErrorMessage(
                err.response.status
            );
            throw new Error(message);
        }
        throw new Error("지원자 목록을 불러오는 중 오류가 발생했습니다.");
    }
}

export async function fetchApplicationText(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<ApplicationTextResponse> {
    try {
        const res = await apiClient
            .get(API_ENDPOINTS.APPLICATION_DETAIL(studyId, applicationId), {
                signal,
            })
            .json<ApplicationTextResponse>();
        return res;
    } catch (err: unknown) {
        if (err instanceof HTTPError) {
            const message = getApplicationActionErrorMessage(
                err.response.status
            );
            throw new Error(message);
        }
        throw new Error("지원서를 불러오는 중 오류가 발생했습니다.");
    }
}

export function getApplicationActionErrorMessage(statusCode: number): string {
    switch (statusCode) {
        case 403:
            return "스터디장이 아닙니다.";
        case 404:
            return "지원서를 찾을 수 없습니다.";
        default:
            return "지원서 처리 중 오류가 발생했습니다.";
    }
}

export async function updateApplicationStatus(
    studyId: number,
    applicationId: number,
    payload: UpdateApplicationStatusPayload,
    signal?: AbortSignal
): Promise<void> {
    try {
        await apiClient.patch(
            API_ENDPOINTS.UPDATE_APPLICATION_STATUS(studyId, applicationId),
            {
                json: payload,
                signal,
            }
        );
    } catch (err: unknown) {
        if (err instanceof HTTPError) {
            const message = getApplicationActionErrorMessage(
                err.response.status
            );
            throw new Error(message);
        }
        throw new Error("지원서 상태 변경 중 오류가 발생했습니다.");
    }
}

export async function approveApplication(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<void> {
    try {
        await apiClient.put(
            API_ENDPOINTS.APPROVE_APPLICATION(studyId, applicationId),
            {
                signal,
            }
        );
    } catch (err: unknown) {
        if (err instanceof HTTPError) {
            const message = getApplicationActionErrorMessage(
                err.response.status
            );
            throw new Error(message);
        }
        throw new Error("지원서 승인 중 오류가 발생했습니다.");
    }
}

export async function rejectApplication(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<void> {
    try {
        await apiClient.put(
            API_ENDPOINTS.REJECT_APPLICATION(studyId, applicationId),
            {
                signal,
            }
        );
    } catch (err: unknown) {
        if (err instanceof HTTPError) {
            const message = getApplicationActionErrorMessage(
                err.response.status
            );
            throw new Error(message);
        }
        throw new Error("지원서 거절 중 오류가 발생했습니다.");
    }
}

// Query Hooks
export const useStudyApplicationsQuery = (
    studyId: number,
    options?: Partial<UseQueryOptions<ApplicationApiResponse[], Error>>
): UseQueryResult<ApplicationApiResponse[], Error> => {
    return useQuery<ApplicationApiResponse[], Error>({
        queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
        queryFn: ({ signal }) => fetchStudyApplications(studyId, signal),
        enabled: Number.isFinite(studyId) && studyId > 0,
        staleTime: 30_000, // 30초
        gcTime: 5 * 60_000, // 5분
        refetchOnWindowFocus: false,
        ...options,
    });
};

export const useApplicationTextQuery = (
    studyId: number,
    applicationId: number,
    enabled: boolean = true
): UseQueryResult<ApplicationTextResponse, Error> => {
    return useQuery<ApplicationTextResponse, Error>({
        queryKey: APPLICATION_QUERY_KEYS.applicationText(
            studyId,
            applicationId
        ),
        queryFn: ({ signal }) =>
            fetchApplicationText(studyId, applicationId, signal),
        enabled:
            enabled &&
            Number.isFinite(studyId) &&
            studyId > 0 &&
            Number.isFinite(applicationId) &&
            applicationId > 0,
        staleTime: 5 * 60_000, // 5분
        gcTime: 10 * 60_000, // 10분
        refetchOnWindowFocus: false,
    });
};

// Mutation Hooks
export const useUpdateApplicationStatusMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<
    void,
    Error,
    { applicationId: number; status: "APPROVED" | "REJECTED" }
> => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        Error,
        { applicationId: number; status: "APPROVED" | "REJECTED" }
    >({
        mutationFn: ({ applicationId, status }) =>
            updateApplicationStatus(studyId, applicationId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};

export const useApproveApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (applicationId: number) =>
            approveApplication(studyId, applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};

export const useRejectApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: Error) => void
): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (applicationId: number) =>
            rejectApplication(studyId, applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
            if (onSuccess) onSuccess();
        },
        onError: (error: Error) => {
            if (onError) onError(error);
        },
    });
};
