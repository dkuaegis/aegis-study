import { X } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { type StudyDetail, StudyRecruitmentMethod } from "@/types/study";
import { getApplicationSectionTitle } from "@/utils/studyStatusHelpers";

interface ApplicationSectionProps {
    study: StudyDetail;
    isOwner?: boolean;
    applicationState: {
        applicationText: string;
        isApplying: boolean;
        isCancelling: boolean;
        isApplicationModalOpen: boolean;
        userApplicationStatus: "approved" | "pending" | "rejected" | null;
        setApplicationText: (text: string) => void;
        setIsApplicationModalOpen: (open: boolean) => void;
        setUserApplicationStatus: (
            status: "approved" | "pending" | "rejected" | null
        ) => void;
        handleApply: () => Promise<void>;
        handleCancelApplication: () => Promise<void>;
    };
}

export const ApplicationSection = ({
    study,
    isOwner = false,
    applicationState,
}: ApplicationSectionProps) => {
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
    } = applicationState;

    if (isOwner) {
        return null; // 스터디장은 신청 섹션이 불필요
    }

    const cardTitle = getApplicationSectionTitle(
        userApplicationStatus,
        study.recruitmentMethod
    );

    const renderPendingStatus = () => (
        <div className="space-y-4 text-center">
            <p className="text-gray-600">스터디 신청이 검토 중입니다.</p>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full border-red-600 bg-transparent text-red-600 hover:bg-red-50"
                    >
                        <X className="mr-1 h-4 w-4" />
                        신청 취소
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>신청 취소</AlertDialogTitle>
                        <AlertDialogDescription>
                            스터디 신청을 취소하시겠습니까? 이후 다시 신청할 수
                            있습니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>돌아가기</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelApplication}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isCancelling ? "취소 중..." : "신청 취소"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

    const renderApprovedStatus = () => (
        <div className="space-y-4">
            <div className="text-center">
                <p className="mb-2 font-medium text-green-600">
                    스터디에 참여 중입니다!
                </p>
            </div>
            <Separator className="bg-gray-200" />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full border-red-600 bg-transparent text-red-600 hover:bg-red-50"
                    >
                        <X className="mr-1 h-4 w-4" />
                        스터디 탈퇴
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>스터디 탈퇴</AlertDialogTitle>
                        <AlertDialogDescription>
                            스터디에서 탈퇴하시겠습니까? 탈퇴 후 다시 참여하려면
                            재신청이 필요합니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>돌아가기</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleCancelApplication}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isCancelling ? "탈퇴 중..." : "탈퇴하기"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );

    const renderRejectedStatus = () => (
        <div className="space-y-4 text-center">
            <p className="text-red-600">신청이 거절되었습니다.</p>
            <p className="text-gray-500 text-sm">다른 스터디를 찾아보세요.</p>
            <Button
                onClick={() => setUserApplicationStatus(null)}
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            >
                다시 지원하기
            </Button>
        </div>
    );

    const renderApplicationForm = () => {
        if (study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION) {
            return (
                <>
                    <p className="mb-2 text-center text-gray-500 text-xs">
                        지원 동기 및 각오를 작성해주세요
                    </p>
                    <Button
                        onClick={() => setIsApplicationModalOpen(true)}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isApplying}
                    >
                        {isApplying ? "처리 중..." : "지원서 작성하기"}
                    </Button>

                    {/* 지원서 작성 모달 */}
                    <AlertDialog
                        open={isApplicationModalOpen}
                        onOpenChange={setIsApplicationModalOpen}
                    >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>지원서 작성</AlertDialogTitle>
                                <AlertDialogDescription>
                                    지원 동기 및 각오를 작성해주세요.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Textarea
                                id="application"
                                placeholder="스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요."
                                value={applicationText}
                                onChange={(e) =>
                                    setApplicationText(e.target.value)
                                }
                                className="mt-2 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel
                                    onClick={() =>
                                        setIsApplicationModalOpen(false)
                                    }
                                >
                                    닫기
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async () => {
                                        await handleApply();
                                        setIsApplicationModalOpen(false);
                                    }}
                                    disabled={
                                        !applicationText.trim() || isApplying
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {isApplying ? "처리 중..." : "제출"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            );
        } else {
            // 선착순 모집
            return (
                <>
                    <Button
                        onClick={handleApply}
                        disabled={isApplying}
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                    >
                        {isApplying ? "처리 중..." : "지원하기"}
                    </Button>
                    <p className="text-center text-gray-500 text-xs">
                        선착순으로 모집되며, 정원이 마감되면 자동으로
                        마감됩니다.
                    </p>
                </>
            );
        }
    };

    const renderContent = () => {
        switch (userApplicationStatus) {
            case "pending":
                return renderPendingStatus();
            case "approved":
                return renderApprovedStatus();
            case "rejected":
                return renderRejectedStatus();
            default:
                return renderApplicationForm();
        }
    };

    return (
        <Card className="border-gray-200">
            <CardHeader>
                <CardTitle className="font-semibold text-gray-900 text-lg">
                    {cardTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">{renderContent()}</CardContent>
        </Card>
    );
};

export default ApplicationSection;
