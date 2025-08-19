import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

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

export const getStudyApplications = async (
    studyId: number
): Promise<ApplicationApiResponse[]> => {
    try {
        const response = await apiClient.get(
            API_ENDPOINTS.STUDY_APPLICATIONS(studyId)
        );
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch study applications:", error);
        throw error;
    }
};

export const getApplicationText = async (
    studyId: number,
    applicationId: number
): Promise<ApplicationTextResponse> => {
    try {
        const response = await apiClient.get(
            `studies/${studyId}/applications/${applicationId}`
        );
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch application text:", error);
        throw error;
    }
};

export const updateApplicationStatus = async (
    studyId: number,
    applicationId: number,
    status: "APPROVED" | "REJECTED"
): Promise<void> => {
    try {
        await apiClient.patch(
            `studies/${studyId}/applications/${applicationId}/status`,
            {
                json: { status },
            }
        );
    } catch (error) {
        console.error("Failed to update application status:", error);
        throw error;
    }
};
