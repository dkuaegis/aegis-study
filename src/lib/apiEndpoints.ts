export const API_ENDPOINTS = {
    STUDIES: "studies",
    PAYMENTS_STATUS: "payments/status",
    OAUTH_GOOGLE: "oauth2/authorization/google",
    STUDY_APPLICATIONS: (studyId: number) =>
        `studies/${studyId}/applications-instructor`,
    APPROVE_APPLICATION: (studyId: number, applicationId: number) =>
        `studies/${studyId}/applications/${applicationId}/approve`,
    REJECT_APPLICATION: (studyId: number, applicationId: number) =>
        `studies/${studyId}/applications/${applicationId}/reject`,
    STUDY_ENROLLMENT: (studyId: number) => `studies/${studyId}/enrollment`,
} as const;
