import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

export interface StudyMemberApiResponse {
    name: string;
    studentId: string;
    phoneNumber: string;
}

export async function fetchStudyMembers(
    studyId: number,
    signal?: AbortSignal
): Promise<StudyMemberApiResponse[]> {
    return apiClient
        .get(API_ENDPOINTS.STUDY_MEMBERS_INSTRUCTOR(studyId), { signal })
        .json<StudyMemberApiResponse[]>();
}
