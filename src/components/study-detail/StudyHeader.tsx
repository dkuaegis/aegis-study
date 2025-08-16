import { Settings, UsersIcon, Users, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudyCategoryLabels, type StudyDetail } from "@/types/study";

interface StudyHeaderProps {
  study: StudyDetail;
  isOwner?: boolean;
  userApplicationStatus?: "approved" | "pending" | "rejected" | null;
  onEdit?: (studyId: number) => void;
  onViewApplications?: (studyId: number) => void;
  onViewMembers?: (studyId: number) => void;
  onManageAttendance?: (studyId: number) => void;
}

export const StudyHeader = ({
  study,
  isOwner = false,
  userApplicationStatus,
  onEdit,
  onViewApplications,
  onViewMembers,
  onManageAttendance,
}: StudyHeaderProps) => {
  const getRecruitmentStatusBadge = () => {
    const isRecruiting = study.participantCount < study.maxParticipants || study.maxParticipants === 0;
    return (
      <Badge
        variant="secondary"
        className={`${
          isRecruiting
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {isRecruiting ? "모집중" : "진행중"}
      </Badge>
    );
  };

  const getApplicationStatusBadge = () => {
    switch (userApplicationStatus) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">신청 대기 중</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800">참여 중</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">신청 거절됨</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-6 border-gray-200">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              {getRecruitmentStatusBadge()}
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                #{StudyCategoryLabels[study.category]}
              </Badge>
              {getApplicationStatusBadge()}
            </div>
            <CardTitle className="font-bold text-2xl text-gray-900">
              {study.title}
            </CardTitle>
            
            {isOwner && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(study.id)}
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="mr-1 h-4 w-4" />
                  스터디 수정
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplications?.(study.id)}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <UsersIcon className="mr-1 h-4 w-4" />
                  스터디 지원현황
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewMembers?.(study.id)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  <Users className="mr-1 h-4 w-4" />
                  스터디원 관리
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageAttendance?.(study.id)}
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <UserCheck className="mr-1 h-4 w-4" />
                  출석 관리
                </Button>
              </div>
            )}
          </div>
          
          {/* 출석코드 입력 */}
          {userApplicationStatus === "approved" && !isOwner && (
            <div className="w-full shrink-0 border-gray-200 border-t pt-4 md:w-auto md:border-gray-200 md:border-t-0 md:border-l md:pl-4">
              <div className="flex items-end gap-2">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label
                    htmlFor={`attendance-code-${study.id}`}
                    className="font-medium text-sm"
                  >
                    출석코드
                  </Label>
                  <Input
                    type="text"
                    id={`attendance-code-${study.id}`}
                    placeholder="코드를 입력하세요"
                    className="h-9"
                  />
                </div>
                <Button type="submit" size="sm" className="h-9">
                  입력
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
};

export default StudyHeader;
