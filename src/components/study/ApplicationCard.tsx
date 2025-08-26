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
import type { Application } from "@/types/study";
import { StudyRecruitmentMethod, ApplicationStatus } from "@/types/study";

type ApplicationCardProps = {
    application: Application;
    onStatusChange: (id: number, status: ApplicationStatus.APPROVED | ApplicationStatus.REJECTED) => void;
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

    const handleLoadApplicationText = async () => {
        if (applicationReason) return; // 이미 로드된 경우 재요청하지 않음

        try {
            setIsLoadingText(true);
            setTextError(null);
            const response = await fetchApplicationText(
                studyId,
                application.id
            );
            setApplicationReason(response.applicationReason);
        } catch (error) {
            console.error("Failed to load application text:", error);
            setTextError("지원서를 불러오는데 실패했습니다.");
        } finally {
            setIsLoadingText(false);
        }
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case ApplicationStatus.PENDING:
                return (
                    <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
                        검토 중
                    </Badge>
                );
            case ApplicationStatus.APPROVED:
                return (
                    <Badge className="border-green-200 bg-green-100 text-green-800">
                        승인
                    </Badge>
                );
            case ApplicationStatus.REJECTED:
                return (
                    <Badge className="border-red-200 bg-red-100 text-red-800">
                        거절
                    </Badge>
                );
            default:
                return <Badge variant="secondary">알 수 없음</Badge>;
        }
    };

    const getInitials = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    return (
        <Card className="border border-gray-200 transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 font-semibold text-blue-600 text-lg">
                                {getInitials(application.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {application.name}
                            </h3>
                            <div className="mt-1 flex items-center text-gray-500 text-sm">
                                <span className="mr-2 font-medium">📞</span>
                                {application.phone}
                            </div>
                            <div className="mt-1 flex items-center text-gray-500 text-sm">
                                <span className="mr-2 font-medium">🎓</span>
                                학번: {application.studentNumber}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {getStatusBadge(application.status)}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {recruitmentMethod ===
                            StudyRecruitmentMethod.APPLICATION && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
                                        onClick={handleLoadApplicationText}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        지원서 보기
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center">
                                            <FileText className="mr-2 h-5 w-5 text-blue-600" />
                                            {application.name}님의 지원서
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-6">
                                        <div className="mb-4 rounded-lg bg-gray-50 p-4">
                                            <div className="mb-2 flex items-center justify-between text-gray-600 text-sm">
                                                <span>
                                                    지원자: {application.name}
                                                </span>
                                                <span>
                                                    학번:{" "}
                                                    {application.studentNumber}
                                                </span>
                                            </div>
                                        </div>
                                        {isLoadingText ? (
                                            <div className="flex min-h-[250px] items-center justify-center">
                                                <div className="text-center">
                                                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-blue-600 border-b-2"></div>
                                                    <p className="text-gray-500 text-sm">
                                                        지원서를 불러오는 중...
                                                    </p>
                                                </div>
                                            </div>
                                        ) : textError ? (
                                            <div className="flex min-h-[250px] items-center justify-center">
                                                <div className="text-center">
                                                    <p className="text-red-600 text-sm">
                                                        {textError}
                                                    </p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={
                                                            handleLoadApplicationText
                                                        }
                                                        className="mt-2"
                                                    >
                                                        다시 시도
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Textarea
                                                value={applicationReason}
                                                readOnly
                                                className="min-h-[250px] resize-none border-gray-200 bg-white"
                                                placeholder="지원서 내용을 불러오는 중..."
                                            />
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {application.status === ApplicationStatus.PENDING && (
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    onStatusChange(application.id, ApplicationStatus.APPROVED)
                                }
                                className="bg-green-600 text-white shadow-sm hover:bg-green-700"
                            >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                승인
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                    onStatusChange(application.id, ApplicationStatus.REJECTED)
                                }
                                className="border-red-200 bg-white text-red-600 hover:bg-red-50"
                            >
                                <XCircle className="mr-1 h-4 w-4" />
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
