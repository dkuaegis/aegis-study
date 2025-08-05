import ky from "ky";
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
    return ky
        .post(`${import.meta.env.VITE_API_URL}/studies`, {
            json: payload,
            credentials: "include",
        })
        .json();
}
