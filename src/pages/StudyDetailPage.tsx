import ApplicationSection from "@/components/study-detail/ApplicationSection";
import StudyContent from "@/components/study-detail/StudyContent";
import StudyHeader from "@/components/study-detail/StudyHeader";
import StudyInfo from "@/components/study-detail/StudyInfo";
import Header from "@/components/ui/Header";
import { useStudyApplication } from "@/hooks/useStudyApplication";
import { useStudyDetailQuery } from "@/lib/studyDetailApi";
import { StudyRecruitmentMethod } from "@/types/study";

interface StudyDetailProps {
    studyId?: string;
    onBack?: () => void;
    onEdit?: (studyId: number) => void;
    onViewApplications?: (studyId: number) => void;
    onViewMembers?: (studyId: number) => void;
    onManageAttendance?: (studyId: number) => void;
    isOwner?: boolean;
    initialUserApplicationStatus?: "APPROVED" | "PENDING" | "REJECTED" | null;
}

const StudyDetailPage = ({
    studyId,
    onBack,
    onEdit,
    onViewApplications,
    onViewMembers,
    onManageAttendance,
    isOwner = false,
}: StudyDetailProps) => {
    const {
        data: study,
        isLoading,
        isError,
        error,
    } = useStudyDetailQuery(Number(studyId));

    const {
        applicationText,
        isApplying,
        isCancelling,
        isApplicationModalOpen,
        userApplicationStatus,
        setApplicationText,
        setIsApplicationModalOpen,
        handleApply,
        handleCancelApplication,
    } = useStudyApplication({
        studyId: Number(studyId),
        recruitmentMethod:
            study?.recruitmentMethod ?? StudyRecruitmentMethod.APPLICATION,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-gray-500">
                    스터디 정보를 불러오는 중...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-red-500">
                    {error?.message ?? "오류가 발생했습니다."}
                </div>
            </div>
        );
    }

    if (!study) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-gray-500">스터디를 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="스터디 지원하기" onBack={onBack} />

            <div className="mx-auto max-w-4xl p-6">
                <StudyHeader
                    study={study}
                    isOwner={isOwner}
                    userApplicationStatus={userApplicationStatus}
                    onEdit={onEdit}
                    onViewApplications={onViewApplications}
                    onViewMembers={onViewMembers}
                    onManageAttendance={onManageAttendance}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <StudyContent study={study} />

                    <div className="space-y-6">
                        <StudyInfo study={study} />

                        <ApplicationSection
                            study={study}
                            isOwner={isOwner}
                            applicationState={{
                                applicationText,
                                isApplying,
                                isCancelling,
                                isApplicationModalOpen,
                                userApplicationStatus,
                                setApplicationText,
                                setIsApplicationModalOpen,
                                handleApply,
                                handleCancelApplication,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyDetailPage;
