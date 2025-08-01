import { useState } from "react";

export interface Application {
    id: number;
    name: string;
    phone: string;
    studentNumber: string;
    status: "pending" | "approved" | "rejected";
    applicationText: string;
}

export interface StudyData {
    studyTitle: string;
    recruitmentMethod: string;
    applications: Application[];
}

export function useApplications(
    applicationsData: Record<number, StudyData>,
    studyId: number
) {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [applications, setApplications] = useState(
        applicationsData[studyId as keyof typeof applicationsData]
            ?.applications || []
    );

    const studyInfo =
        applicationsData[studyId as keyof typeof applicationsData];

    const handleStatusChange = (
        applicationId: number,
        newStatus: "approved" | "rejected"
    ) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            )
        );
    };

    const getFilteredApplications = (filter: string) => {
        switch (filter) {
            case "pending":
                return applications.filter((app) => app.status === "pending");
            case "approved":
                return applications.filter((app) => app.status === "approved");
            case "rejected":
                return applications.filter((app) => app.status === "rejected");
            default:
                return applications;
        }
    };

    const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        approved: applications.filter((app) => app.status === "approved")
            .length,
        rejected: applications.filter((app) => app.status === "rejected")
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
    };
}
