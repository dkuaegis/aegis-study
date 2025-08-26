import { useMemo, useState } from "react";
import {
    type ApplicationApiResponse,
    useApproveApplicationMutation,
    useRejectApplicationMutation,
    useStudyApplicationsQuery,
    useUpdateApplicationStatusMutation,
} from "@/api/applicationOwnerApi";
import { useStudyDetailQuery } from "@/api/studyDetailApi";
import type { Application, StudyData } from "@/types/study";
import { ApplicationStatus } from "@/types/study";

function transformApiApplication(apiApp: ApplicationApiResponse): Application {
    return {
        id: apiApp.studyApplicationId,
        name: apiApp.name,
        phone: apiApp.phoneNumber,
        studentNumber: apiApp.studentId,
        status: apiApp.status as ApplicationStatus,
        createdAt: apiApp.createdAt,
        updatedAt: apiApp.updatedAt,
    };
}

export function useApplications(studyId: number) {
    const [selectedFilter, setSelectedFilter] = useState<
        "ALL" | ApplicationStatus
    >("ALL");

    // API 쿼리 사용
    const {
        data: apiApplications,
        isLoading: applicationsLoading,
        error: applicationsError,
    } = useStudyApplicationsQuery(studyId);

    const {
        data: studyDetail,
        isLoading: studyLoading,
        error: studyError,
    } = useStudyDetailQuery(studyId);

    // 상태 업데이트 뮤테이션들
    const statusMutation = useUpdateApplicationStatusMutation(studyId);
    const approveMutation = useApproveApplicationMutation(studyId);
    const rejectMutation = useRejectApplicationMutation(studyId);

    // 에러 처리
    const error =
        applicationsError?.message ||
        studyError?.message ||
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
            pending: applications.filter((app) => app.status === ApplicationStatus.PENDING)
                .length,
            approved: applications.filter((app) => app.status === ApplicationStatus.APPROVED)
                .length,
            rejected: applications.filter((app) => app.status === ApplicationStatus.REJECTED)
                .length,
        }),
        [applications]
    );

    // 상태 변경 핸들러
    const handleStatusChange = (
        applicationId: number,
        newStatus: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED
    ) => {
        if (newStatus === ApplicationStatus.APPROVED) {
            approveMutation.mutate(applicationId);
        } else if (newStatus === ApplicationStatus.REJECTED) {
            rejectMutation.mutate(applicationId);
        }
    };

    // 실제 API에서 가져온 스터디 정보 사용
    const studyInfo: StudyData | null = useMemo(
        () =>
            studyDetail
                ? {
                      studyTitle: studyDetail.title,
                      recruitmentMethod: studyDetail.recruitmentMethod,
                      applications,
                  }
                : null,
        [studyDetail, applications]
    );

    return {
        applications,
        filteredApplications,
        selectedFilter,
        setSelectedFilter,
        stats,
        handleStatusChange,
        studyInfo,
        loading:
            applicationsLoading ||
            studyLoading ||
            statusMutation.isPending ||
            approveMutation.isPending ||
            rejectMutation.isPending,
        error,
    };
}
