import { apiClient } from "@/lib/apiClient";

export interface AttendanceCodeResponse {
    code: string;
    sessionId: number;
}

export async function fetchAttendanceCode(
    studyId: number
): Promise<AttendanceCodeResponse> {
    const res = await apiClient
        .post(`studies/${studyId}/attendance-code`)
        .json<AttendanceCodeResponse>();
    return res;
}
