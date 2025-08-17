import {
    type UseMutationResult,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";
import { STUDY_DETAIL_QUERY_KEY } from "./studyDetailApi";

interface UpdateStudyRequest {
    title: string;
    category: string;
    level: string;
    description: string;
    recruitmentMethod: string;
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
    recruitmentMethod: string;
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
        recruitmentMethod:
            data.recruitmentMethod === "선착순" ? "FCFS" : "APPLICATION",
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
            // 해당 스터디의 상세 정보 캐시 무효화 (올바른 쿼리 키 사용)
            queryClient.invalidateQueries({
                queryKey: STUDY_DETAIL_QUERY_KEY(studyId),
            });
            // 스터디 목록 캐시도 무효화 (목록에서도 업데이트된 정보가 보이도록)
            queryClient.invalidateQueries({ queryKey: ["studies"] });

            if (onSuccess) onSuccess();
        },
        ...(onError && { onError }),
    });
};
