import {
    type UseMutationResult,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import type { StudyRecruitmentMethod } from "@/types/study";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { STUDY_DETAIL_QUERY_KEY } from "./studyDetailApi";

interface UpdateStudyRequest {
    title: string;
    category: string;
    level: string;
    description: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: number;
    schedule: string;
    curricula: string;
    qualifications: string;
}

interface CurriculumItem {
    value: string;
}

interface RequirementItem {
    value: string;
}

export interface StudyFormData {
    title: string;
    category: string;
    difficulty: string;
    introduction: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: string;
    schedule: string;
    curriculum: CurriculumItem[];
    requirements: RequirementItem[];
}

export async function updateStudy(
    studyId: number,
    data: StudyFormData,
    signal?: AbortSignal
): Promise<void> {
    const requestData: UpdateStudyRequest = {
        title: data.title,
        category: data.category,
        level: data.difficulty,
        description: data.introduction,
        recruitmentMethod: data.recruitmentMethod, // enum 값을 그대로 사용
        maxParticipants: parseInt(data.maxParticipants),
        schedule: data.schedule,
        curricula: data.curriculum
            .map((item: CurriculumItem) => item.value.trim())
            .filter((v) => v !== "")
            .join("\n"),
        qualifications: data.requirements
            .map((item: RequirementItem) => item.value.trim())
            .filter((v) => v !== "")
            .join("\n"),
    };

    await apiClient.put(`${API_ENDPOINTS.STUDIES}/${studyId}`, {
        json: requestData,
        signal,
    });
}

export const useUpdateStudyMutation = (
    studyId: number,
    onSuccess?: () => void,
    onError?: (error: HTTPError) => void
): UseMutationResult<void, HTTPError, StudyFormData> => {
    const queryClient = useQueryClient();

    return useMutation<void, HTTPError, StudyFormData>({
        mutationFn: (data: StudyFormData) => updateStudy(studyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
            });
            queryClient.invalidateQueries({ queryKey: ["studies"] });

            if (onSuccess) onSuccess();
        },
        onError,
    });
};
