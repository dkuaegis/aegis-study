import { apiClient } from "@/lib/apiClient";

export interface AttendanceCodeResponse {
    code: string;
    sessionId: number;
}

export interface AttendanceSubmissionResponse {
    attendanceId: number;
    sessionId: number;
}

export function getAttendanceErrorMessage(statusCode: number): string {
    switch (statusCode) {
        case 400:
            return "잘못된 출석 코드입니다.";
        case 403:
            return "스터디원이 아닙니다.";
        case 404:
            return "오늘 진행되는 세션이 없습니다.";
        case 409:
            return "이미 출석이 완료되었습니다.";
        default:
            return "출석 처리 중 오류가 발생했습니다.";
    }
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
