import { useState } from "react";
import { useToast } from "@/components/ui/useToast";
import { StudyRecruitmentMethod } from "@/types/study";

interface UseStudyApplicationProps {
  studyId: number;
  recruitmentMethod: StudyRecruitmentMethod;
}

export const useStudyApplication = ({ 
  studyId: _studyId, // TODO: API 연동 시 사용 예정
  recruitmentMethod 
}: UseStudyApplicationProps) => {
  const [applicationText, setApplicationText] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [userApplicationStatus, setUserApplicationStatus] = useState<
    "approved" | "pending" | "rejected" | null
  >(null);
  
  const toast = useToast();

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (recruitmentMethod === StudyRecruitmentMethod.FCFS) {
      setUserApplicationStatus("approved");
      toast({
        description: "지원이 완료되었습니다! 스터디에 참여하게 되었습니다.",
      });
    } else {
      setUserApplicationStatus("pending");
      toast({
        description: "지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.",
      });
    }
    
    setIsApplying(false);
    setApplicationText("");
  };

  const handleCancelApplication = async () => {
    setIsCancelling(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const wasApproved = userApplicationStatus === "approved";
    setUserApplicationStatus(null);
    
    toast({ 
      description: wasApproved 
        ? "스터디에서 탈퇴되었습니다." 
        : "스터디 신청이 취소되었습니다." 
    });
    
    setIsCancelling(false);
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
