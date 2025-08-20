import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/useToast";
import {
    useCancelEnrollmentMutation,
    useEnrollInStudyMutation,
    useStudyStatusQuery,
} from "@/lib/enrollmentApi";
import { StudyRecruitmentMethod } from "@/types/study";

interface UseStudyApplicationProps {
    studyId: number;
    recruitmentMethod: StudyRecruitmentMethod;
}

export const useStudyApplication = ({
    studyId,
    recruitmentMethod,
}: UseStudyApplicationProps) => {
    const [applicationText, setApplicationText] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [userApplicationStatus, setUserApplicationStatus] = useState<
        "approved" | "pending" | "rejected" | null
    >(null);

    const toast = useToast();

    // 상태 조회 쿼리
    const { data: statusData } = useStudyStatusQuery(studyId);

    // 상태 데이터가 변경되면 로컬 상태 업데이트
    useEffect(() => {
        if (statusData) {
            // API 상태를 로컬 상태 형식으로 변환
            const status = statusData.status.toLowerCase() as "approved" | "pending" | "rejected";
            setUserApplicationStatus(status);
        } else {
            // statusData가 null이면 신청하지 않은 상태
            setUserApplicationStatus(null);
        }
    }, [statusData]);

    // API Mutations
    const enrollMutation = useEnrollInStudyMutation(
        studyId,
        (data) => {
            // 성공 콜백 - 상태는 쿼리에서 자동으로 업데이트됨
            if (data.status === "approved") {
                toast({
                    description:
                        "지원이 완료되었습니다! 스터디에 참여하게 되었습니다.",
                });
            } else {
                toast({
                    description:
                        "지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.",
                });
            }
            setApplicationText("");
            setIsApplying(false);
        },
        (error) => {
            // 에러 콜백
            console.error("Enrollment failed:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "지원 중 오류가 발생했습니다. 다시 시도해주세요.";
            toast({
                description: errorMessage,
            });
            setIsApplying(false);
        }
    );

    const cancelMutation = useCancelEnrollmentMutation(
        studyId,
        () => {
            // 성공 콜백 - 상태는 쿼리에서 자동으로 업데이트됨
            const wasApproved = userApplicationStatus === "approved";
            toast({
                description: wasApproved
                    ? "스터디에서 탈퇴되었습니다."
                    : "스터디 신청이 취소되었습니다.",
            });
            setIsCancelling(false);
        },
        (error) => {
            // 에러 콜백
            console.error("Cancel enrollment failed:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "취소 중 오류가 발생했습니다. 다시 시도해주세요.";
            toast({
                description: errorMessage,
            });
            setIsCancelling(false);
        }
    );

    const handleApply = async () => {
        setIsApplying(true);

        // 모집 방식에 따라 applicationReason 설정
        const applicationReason =
            recruitmentMethod === StudyRecruitmentMethod.APPLICATION
                ? applicationText.trim()
                : null;

        enrollMutation.mutate({ applicationReason });
    };

    const handleCancelApplication = async () => {
        setIsCancelling(true);
        cancelMutation.mutate();
    };

    return {
        // State
        applicationText,
        isApplying,
        isCancelling,
        isApplicationModalOpen,
        userApplicationStatus,

        // Actions
        setApplicationText,
        setIsApplicationModalOpen,
        setUserApplicationStatus,
        handleApply,
        handleCancelApplication,
    };
};
