import {
    type UseMutationResult,
    type UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
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
    return apiClient
        .get(API_ENDPOINTS.STUDY_APPLICATIONS(studyId), { signal })
        .json<ApplicationApiResponse[]>();
}

export async function fetchApplicationText(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<ApplicationTextResponse> {
    return apiClient
        .get(`studies/${studyId}/applications/${applicationId}`, { signal })
        .json<ApplicationTextResponse>();
}

export async function updateApplicationStatus(
    studyId: number,
    applicationId: number,
    payload: UpdateApplicationStatusPayload,
    signal?: AbortSignal
): Promise<void> {
    await apiClient.patch(
        `studies/${studyId}/applications/${applicationId}/status`,
        {
            json: payload,
            signal,
        }
    );
}

export async function approveApplication(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<void> {
    await apiClient.put(
        API_ENDPOINTS.APPROVE_APPLICATION(studyId, applicationId),
        {
            signal,
        }
    );
}

export async function rejectApplication(
    studyId: number,
    applicationId: number,
    signal?: AbortSignal
): Promise<void> {
    await apiClient.put(
        API_ENDPOINTS.REJECT_APPLICATION(studyId, applicationId),
        {
            signal,
        }
    );
}

// Query Hooks
export const useStudyApplicationsQuery = (
    studyId: number,
    onError?: (error: HTTPError) => void
): UseQueryResult<ApplicationApiResponse[], HTTPError> => {
    return useQuery<ApplicationApiResponse[], HTTPError>({
        queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
        queryFn: ({ signal }) => fetchStudyApplications(studyId, signal),
        enabled: Number.isFinite(studyId) && studyId > 0,
        ...(onError && { onError }),
        staleTime: 30_000, // 30초
        gcTime: 5 * 60_000, // 5분
        refetchOnWindowFocus: false,
    });
};

export const useApplicationTextQuery = (
    studyId: number,
    applicationId: number,
    enabled: boolean = true,
    onError?: (error: HTTPError) => void
): UseQueryResult<ApplicationTextResponse, HTTPError> => {
    return useQuery<ApplicationTextResponse, HTTPError>({
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
        ...(onError && { onError }),
        staleTime: 5 * 60_000, // 5분 (텍스트는 자주 변경되지 않음)
        gcTime: 10 * 60_000, // 10분
        refetchOnWindowFocus: false,
    });
};

// Mutation Hooks
export const useUpdateApplicationStatusMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<
    void,
    HTTPError,
    { applicationId: number; status: "APPROVED" | "REJECTED" }
> => {
    const queryClient = useQueryClient();

    return useMutation<
        void,
        HTTPError,
        { applicationId: number; status: "APPROVED" | "REJECTED" }
    >({
        mutationFn: ({ applicationId, status }) =>
            updateApplicationStatus(studyId, applicationId, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            if (onSuccess) onSuccess();
        },
        onError: (error: HTTPError) => {
            if (onError) onError(error);
        },
    });
};

export const useApproveApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<void, HTTPError, number> => {
    const queryClient = useQueryClient();

    return useMutation<void, HTTPError, number>({
        mutationFn: (applicationId: number) =>
            approveApplication(studyId, applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            if (onSuccess) onSuccess();
        },
        onError: (error: HTTPError) => {
            if (onError) onError(error);
        },
    });
};

export const useRejectApplicationMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<void, HTTPError, number> => {
    const queryClient = useQueryClient();

    return useMutation<void, HTTPError, number>({
        mutationFn: (applicationId: number) =>
            rejectApplication(studyId, applicationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: APPLICATION_QUERY_KEYS.studyApplications(studyId),
            });
            if (onSuccess) onSuccess();
        },
        onError: (error: HTTPError) => {
            if (onError) onError(error);
        },
    });
};
