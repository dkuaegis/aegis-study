import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type {
    StudyCategory,
    StudyLevel,
    StudyRecruitmentMethod,
} from "@/types/study";

export interface CreateStudyPayload {
    title: string;
    category: StudyCategory;
    level: StudyLevel;
    description: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: number | null;
    schedule: string;
    curricula: string[];
    qualifications: string[];
}

export async function createStudy(
    payload: CreateStudyPayload
): Promise<unknown> {
    return apiClient
        .post(API_ENDPOINTS.STUDIES, {
            json: payload,
        })
        .json();
}

export const useCreateStudyMutation = (
    onSuccess?: (data: unknown) => void,
    onError?: (error: unknown) => void
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStudy,
        onSuccess: (res: unknown) => {
            queryClient.invalidateQueries({ queryKey: ["studies"] });
            queryClient.invalidateQueries({ queryKey: ["userRoles"] });
            if (onSuccess) onSuccess(res);
        },
        onError: (err: unknown) => {
            if (onError) onError(err);
        },
    });
};
