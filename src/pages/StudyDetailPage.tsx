import {
    CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ApplicationSection from "@/components/study-detail/ApplicationSection";
import StudyHeader from "@/components/study-detail/StudyHeader";
import { useStudyApplication } from "@/hooks/useStudyApplication";
import { useStudyDetailQuery } from "@/lib/studyDetailApi";
import { StudyRecruitmentMethod } from "@/types/study";

interface StudyDetailProps {
    studyId: number;
    onBack: () => void;
    onEdit?: (studyId: number) => void;
    onViewApplications?: (studyId: number) => void;
    onViewMembers?: (studyId: number) => void;
    onManageAttendance?: (studyId: number) => void;
    isOwner?: boolean;
    initialUserApplicationStatus?: "approved" | "pending" | "rejected" | null;
    currentUserId: string;
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
    } = useStudyDetailQuery(studyId);

    const {
        applicationText,
        isApplying,
        isCancelling,
        isApplicationModalOpen,
        userApplicationStatus,
        setApplicationText,
        setIsApplicationModalOpen,
        setUserApplicationStatus,
        handleApply,
        handleCancelApplication,
    } = useStudyApplication({
        studyId,
        recruitmentMethod: study?.recruitmentMethod ?? StudyRecruitmentMethod.APPLICATION,
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
                    <div className="space-y-6 lg:col-span-2">
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    스터디 소개
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                                    {study.description}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    커리큘럼
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {study.curricula
                                        .split("\n")
                                        .map((item: string) => (
                                            <div
                                                key={item.substring(0, 20)}
                                                className="flex items-start"
                                            >
                                                <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-600" />
                                                <span className="text-gray-700">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    지원 자격
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {study.qualifications
                                        .split("\n")
                                        .map((qualification: string) => (
                                            <div
                                                key={qualification.substring(
                                                    0,
                                                    20
                                                )}
                                                className="flex items-start"
                                            >
                                                <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                                                <span className="text-gray-700">
                                                    {qualification}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    스터디 정보
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        스터디장
                                    </Label>
                                    <p className="mt-1 text-gray-700">
                                        {study.instructor}
                                    </p>
                                </div>
                                <Separator className="bg-gray-200" />
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        모집 방법
                                    </Label>
                                    <p className="mt-1 text-gray-700">
                                        {study.recruitmentMethod ===
                                        StudyRecruitmentMethod.FCFS
                                            ? "선착순 모집"
                                            : "지원서 심사"}
                                    </p>
                                </div>
                                <Separator className="bg-gray-200" />
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        제한 인원
                                    </Label>
                                    <p className="mt-1 text-gray-700">
                                        {study.participantCount}/
                                        {study.maxParticipants}명
                                    </p>
                                </div>
                                <Separator className="bg-gray-200" />
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        일정
                                    </Label>
                                    <p className="mt-1 text-gray-700">
                                        {study.schedule}
                                    </p>
                                </div>
                                <Separator className="bg-gray-200" />
                            </CardContent>
                        </Card>

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
                                setUserApplicationStatus,
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
