import { useState, useEffect } from "react";
import { getStudyApplications, updateApplicationStatus, type ApplicationApiResponse } from "@/lib/applicationApi";
import type { Application, StudyData } from "@/types/study";

// API 응답을 내부 타입으로 변환하는 함수
const transformApiApplication = (apiApp: ApplicationApiResponse): Application => ({
    id: apiApp.studyApplicationId,
    name: apiApp.name,
    phone: apiApp.phoneNumber,
    studentNumber: apiApp.studentId,
    status: apiApp.status, // 이제 대문자로 그대로 사용
    // applicationText는 별도 API로 로드하므로 여기서는 포함하지 않음
    createdAt: apiApp.createdAt,
    updatedAt: apiApp.updatedAt,
});

export function useApplications(studyId: number) {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [studyInfo, setStudyInfo] = useState<StudyData | null>(null);

    // API에서 지원자 데이터 가져오기
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiApplications = await getStudyApplications(studyId);
                const transformedApplications = apiApplications.map(transformApiApplication);
                
                setApplications(transformedApplications);
                setStudyInfo({
                    studyTitle: "스터디", // API에서 스터디 정보도 가져와야 함
                    recruitmentMethod: "지원서", // 임시값, 실제로는 API에서 가져와야 함
                    applications: transformedApplications,
                });
            } catch (err) {
                console.error("Failed to fetch applications:", err);
                setError("지원자 데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [studyId]);

    const handleStatusChange = async (
        applicationId: number,
        newStatus: "APPROVED" | "REJECTED"
    ) => {
        try {
            await updateApplicationStatus(studyId, applicationId, newStatus);
            
            // 로컬 상태 업데이트
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error("Failed to update application status:", err);
            setError("지원자 상태 변경에 실패했습니다.");
        }
    };

    const getFilteredApplications = (filter: string) => {
        switch (filter) {
            case "pending":
                return applications.filter((app) => app.status === "PENDING");
            case "approved":
                return applications.filter((app) => app.status === "APPROVED");
            case "rejected":
                return applications.filter((app) => app.status === "REJECTED");
            default:
                return applications;
        }
    };

    const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "PENDING").length,
        approved: applications.filter((app) => app.status === "APPROVED")
            .length,
        rejected: applications.filter((app) => app.status === "REJECTED")
            .length,
    };

    const filteredApplications = getFilteredApplications(selectedFilter);

    return {
        selectedFilter,
        setSelectedFilter,
        applications,
        setApplications,
        studyInfo,
        handleStatusChange,
        getFilteredApplications,
        stats,
        filteredApplications,
        loading,
        error,
    };
}
