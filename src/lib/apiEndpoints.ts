export const API_ENDPOINTS = {
    STUDIES: "studies",
    PAYMENTS_STATUS: "payments/status",
    OAUTH_GOOGLE: "oauth2/authorization/google",
    STUDY_APPLICATIONS: (studyId: number) =>
        `studies/${studyId}/applications-instructor`,
} as const;
