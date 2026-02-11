import { CheckCircle, Eye, FileText, XCircle } from "lucide-react";
import { useState } from "react";
import { fetchApplicationText } from "@/api/applicationOwnerApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/useToast";
import type { Application } from "@/types/study";
import { ApplicationStatus, StudyRecruitmentMethod } from "@/types/study";

type ApplicationCardProps = {
  application: Application;
  onStatusChange: (
    id: number,
    status: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED,
  ) => void;
  recruitmentMethod: StudyRecruitmentMethod;
  studyId: number;
};

const ApplicationCard = ({
  application,
  onStatusChange,
  recruitmentMethod,
  studyId,
}: ApplicationCardProps) => {
  const [applicationReason, setApplicationReason] = useState<string>("");
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const toast = useToast();

  const handleLoadApplicationText = async () => {
    if (applicationReason) return; // 이미 로드된 경우 재요청하지 않음

    try {
      setIsLoadingText(true);
      setTextError(null);
      const response = await fetchApplicationText(studyId, application.id);
      setApplicationReason(response.applicationReason);
    } catch (err: unknown) {
      console.error("Failed to load application text:", err);
      const message =
        err instanceof Error
          ? err.message
          : "지원서를 불러오는 데 실패했습니다.";
      setTextError(message);
      toast({ description: message });
    } finally {
      setIsLoadingText(false);
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return <Badge className="status-badge-pending">검토 중</Badge>;
      case ApplicationStatus.APPROVED:
        return <Badge className="status-badge-approved">승인</Badge>;
      case ApplicationStatus.REJECTED:
        return <Badge className="status-badge-rejected">거절</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="application-card">
      <CardContent className="application-card-content">
        <div className="application-header">
          <div className="application-avatar-section">
            <Avatar className="application-avatar">
              <AvatarFallback className="application-avatar-fallback">
                {getInitials(application.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="application-name">{application.name}</h3>
              <div className="mt-1 flex items-center text-gray-500 text-sm">
                <span className="mr-2 font-medium">📞</span>
                {application.phone}
              </div>
              <div className="application-contact-info">
                <span className="application-contact-icon">🎓</span>
                학번: {application.studentNumber}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(application.status)}
          </div>
        </div>

        <div className="application-actions">
          <div className="application-actions-left">
            {recruitmentMethod === StudyRecruitmentMethod.APPLICATION && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-view-application"
                    onClick={handleLoadApplicationText}
                  >
                    <Eye className="icon-size-sm" />
                    지원서 보기
                  </Button>
                </DialogTrigger>
                <DialogContent className="dialog-max-width">
                  <DialogHeader>
                    <DialogTitle className="dialog-header-title">
                      <FileText className="dialog-icon" />
                      {application.name}님의 지원서
                    </DialogTitle>
                  </DialogHeader>
                  <div className="dialog-content">
                    <div className="dialog-info-box">
                      <div className="dialog-info-row">
                        <span>지원자: {application.name}</span>
                        <span>학번: {application.studentNumber}</span>
                      </div>
                    </div>
                    {isLoadingText ? (
                      <div className="dialog-loading-container">
                        <div className="dialog-loading-content">
                          <div className="dialog-loading-spinner"></div>
                          <p className="dialog-loading-text">
                            지원서를 불러오는 중...
                          </p>
                        </div>
                      </div>
                    ) : textError ? (
                      <div className="dialog-loading-container">
                        <div className="dialog-loading-content">
                          <p className="dialog-error-text">{textError}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLoadApplicationText}
                            className="dialog-retry-button"
                          >
                            다시 시도
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        value={applicationReason}
                        readOnly
                        className="dialog-textarea"
                        placeholder="지원서 내용을 불러오는 중..."
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {application.status === ApplicationStatus.PENDING && (
            <div className="application-actions-right">
              <Button
                size="sm"
                onClick={() =>
                  onStatusChange(application.id, ApplicationStatus.APPROVED)
                }
                className="btn-approve"
              >
                <CheckCircle className="icon-size-xs" />
                승인
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onStatusChange(application.id, ApplicationStatus.REJECTED)
                }
                className="btn-reject"
              >
                <XCircle className="icon-size-xs" />
                거절
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
