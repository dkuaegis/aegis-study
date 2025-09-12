import { apiClient } from "@/lib/apiClient";

export interface AttendanceCodeResponse {
    code: string;
    sessionId: number;
}

export interface AttendanceSubmissionResponse {
    attendanceId: number;
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

export async function submitAttendanceCode(
    studyId: number,
    code: string
): Promise<AttendanceSubmissionResponse> {
    const res = await apiClient
        .post(`studies/${studyId}/attendance`, {
            json: { code },
        })
        .json<AttendanceSubmissionResponse>();
    return res;
}
