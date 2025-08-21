import { useMemo, useState } from "react";
import {
    type ApplicationApiResponse,
    useApproveApplicationMutation,
    useRejectApplicationMutation,
    useStudyApplicationsQuery,
    useUpdateApplicationStatusMutation,
} from "@/api/applicationOwnerApi";
import type { Application, StudyData } from "@/types/study";
import { StudyRecruitmentMethod } from "@/types/study";

function transformApiApplication(apiApp: ApplicationApiResponse): Application {
    return {
        id: apiApp.studyApplicationId,
        name: apiApp.name,
        phone: apiApp.phoneNumber,
        studentNumber: apiApp.studentId,
        status: apiApp.status,
        createdAt: apiApp.createdAt,
        updatedAt: apiApp.updatedAt,
    };
}

export function useApplications(studyId: number) {
    const [selectedFilter, setSelectedFilter] = useState<
        "ALL" | "PENDING" | "APPROVED" | "REJECTED"
    >("ALL");

    // API 쿼리 사용
    const {
        data: apiApplications,
        isLoading: loading,
        error: queryError,
    } = useStudyApplicationsQuery(studyId);

    // 상태 업데이트 뮤테이션들
    const statusMutation = useUpdateApplicationStatusMutation(studyId);
    const approveMutation = useApproveApplicationMutation(studyId);
    const rejectMutation = useRejectApplicationMutation(studyId);

    // 에러 처리
    const error =
        queryError?.message ||
        statusMutation.error?.message ||
        approveMutation.error?.message ||
        rejectMutation.error?.message ||
        null;

    // 데이터 변환
    const applications = useMemo(
        () => apiApplications?.map(transformApiApplication) || [],
        [apiApplications]
    );

    // 필터링된 지원서
    const filteredApplications = useMemo(
        () =>
            applications.filter(
                (app) =>
                    selectedFilter === "ALL" || app.status === selectedFilter
            ),
        [applications, selectedFilter]
    );

    // 통계
    const stats = useMemo(
        () => ({
            total: applications.length,
            pending: applications.filter((app) => app.status === "PENDING")
                .length,
            approved: applications.filter((app) => app.status === "APPROVED")
                .length,
            rejected: applications.filter((app) => app.status === "REJECTED")
                .length,
        }),
        [applications]
    );

    // 상태 변경 핸들러
    const handleStatusChange = (
        applicationId: number,
        newStatus: "APPROVED" | "REJECTED"
    ) => {
        if (newStatus === "APPROVED") {
            approveMutation.mutate(applicationId);
        } else if (newStatus === "REJECTED") {
            rejectMutation.mutate(applicationId);
        }
    };

    // 스터디 정보 (임시 - 실제로는 별도 API에서 가져와야 함)
    const studyInfo: StudyData | null =
        applications.length > 0
            ? {
                  studyTitle: "스터디 제목", // 실제 API 데이터로 대체 필요
                  recruitmentMethod: StudyRecruitmentMethod.APPLICATION,
                  applications,
              }
            : null;

    return {
        applications,
        filteredApplications,
        selectedFilter,
        setSelectedFilter,
        stats,
        handleStatusChange,
        studyInfo,
        loading:
            loading ||
            statusMutation.isPending ||
            approveMutation.isPending ||
            rejectMutation.isPending,
        error,
    };
}
