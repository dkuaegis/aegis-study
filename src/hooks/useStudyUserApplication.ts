import { useEffect, useRef, useState } from "react";
import {
    useEnrollInStudyMutation,
    useStudyStatusQuery,
    useUpdateUserApplicationMutation,
    useUserApplicationDetailQuery,
} from "@/api/enrollmentApi";
import { useToast } from "@/components/ui/useToast";
import {
    ApplicationStatus,
    StudyRecruitmentMethod,
    type UserApplicationStatus,
} from "@/types/study";

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
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [userApplicationStatus, setUserApplicationStatus] =
        useState<UserApplicationStatus>(null);
    const [shouldLoadApplicationDetail, setShouldLoadApplicationDetail] =
        useState(false);

    const [editingApplicationText, setEditingApplicationText] = useState("");

    const lastKnownStatusRef = useRef<
        "APPROVED" | "PENDING" | "REJECTED" | null
    >(null);

    const toast = useToast();

    // 상태 조회 쿼리
    // 선착순(FCFS)일 경우나 특정 에러(예: 403) 발생 직후에는 상태 조회를 수행하지 않도록 제어
    const [suppressStatusFetch, setSuppressStatusFetch] = useState(false);

    const { data: statusData } = useStudyStatusQuery(
        studyId,
        recruitmentMethod !== StudyRecruitmentMethod.FCFS && !suppressStatusFetch
    );

    // 지원서 상세 조회 쿼리 (PENDING 상태이고 APPLICATION 방식일 때 자동 활성화)
    const shouldAutoLoadApplication =
        userApplicationStatus === ApplicationStatus.PENDING &&
        recruitmentMethod === StudyRecruitmentMethod.APPLICATION;

    const {
        isLoading: isLoadingApplicationDetail,
        refetch: refetchApplicationDetail,
    } = useUserApplicationDetailQuery(
        studyId,
        shouldLoadApplicationDetail || shouldAutoLoadApplication
    );

    // 상태 데이터가 변경되면 로컬 상태 업데이트
    useEffect(() => {
        const raw = statusData?.status;
        if (typeof raw === "string") {
            // API 상태를 로컬 상태 형식으로 안전하게 변환 (대문자 처리)
            const normalized = raw.toUpperCase();
            const allowed =
                normalized === ApplicationStatus.APPROVED ||
                normalized === ApplicationStatus.PENDING ||
                normalized === ApplicationStatus.REJECTED;
            const safeStatus = allowed
                ? (normalized as ApplicationStatus)
                : null;
            setUserApplicationStatus(safeStatus);
            lastKnownStatusRef.current = safeStatus;
        } else {
            // statusData가 null/undefined이거나 형태가 예상과 다름
            setUserApplicationStatus(null);
            lastKnownStatusRef.current = null;
        }
    }, [statusData]);

    // API Mutations
    const enrollMutation = useEnrollInStudyMutation(
        studyId,
        (data) => {
            // 성공 콜백 - 상태는 쿼리에서 자동으로 업데이트됨
            if (data.status === "APPROVED") {
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
            if (error instanceof Error && /지원 기간/i.test(error.message)) {
                setSuppressStatusFetch(true);
                // 억제는 일시적으로 유지하고 몇 초 후 자동 해제
                setTimeout(() => setSuppressStatusFetch(false), 5000);
            }

            setIsApplying(false);
        }
    );

    // 지원서 수정 뮤테이션
    const updateMutation = useUpdateUserApplicationMutation(
        studyId,
        () => {
            toast({
                description: "지원서가 성공적으로 수정되었습니다.",
            });
            setIsApplying(false);
            setShouldLoadApplicationDetail(false);
            setIsApplicationModalOpen(false); // 모달 닫기
        },
        (error) => {
            console.error("Update application failed:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "지원서 수정 중 오류가 발생했습니다. 다시 시도해주세요.";
            toast({
                description: errorMessage,
            });
            setIsApplying(false);
        }
    );

    const handleApply = async () => {
        if (isApplying) return;
        if (recruitmentMethod === StudyRecruitmentMethod.APPLICATION) {
            const trimmedText = applicationText.trim();
            if (!trimmedText) {
                toast({
                    description: "지원 사유를 입력해주세요.",
                });
                return;
            }
        }

        setIsApplying(true);

        const applicationReason =
            recruitmentMethod === StudyRecruitmentMethod.APPLICATION
                ? applicationText.trim()
                : null;

        enrollMutation.mutate({ applicationReason });
    };

    // 지원서 수정하기 버튼 클릭 시 호출
    const handleEditApplication = async () => {
        setShouldLoadApplicationDetail(true);
        try {
            const result = await refetchApplicationDetail();
            // 편집 시작 시에만 설정
            setEditingApplicationText(result.data?.applicationReason || "");
            setIsApplicationModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch application detail:", error);
            toast({
                description: "지원서 정보를 불러오는데 실패했습니다.",
            });
        }
    };

    // 지원서 수정 완료 시 호출
    const handleUpdateApplication = async () => {
        // 중복 요청 방지
        if (isApplying) return;

        // 공백 입력 차단
        const trimmedText = editingApplicationText.trim();
        if (!trimmedText) {
            toast({
                description: "지원 사유를 입력해주세요.",
            });
            return;
        }

        setIsApplying(true);
        updateMutation.mutate({ applicationReason: trimmedText });
    };

    return {
        // State
        applicationText,
        isApplying,
        isApplicationModalOpen,
        userApplicationStatus,
        isLoadingApplicationDetail,
        editingApplicationText,

        // Actions
        setApplicationText,
        setIsApplicationModalOpen,
        setEditingApplicationText,
        handleApply,
        handleEditApplication,
        handleUpdateApplication,
    };
};
