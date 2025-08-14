import {
    CheckCircle,
    Settings,
    UserCheck,
    Users,
    UsersIcon,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/useToast";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import {
    StudyCategoryLabels,
    type StudyDetail,
    StudyRecruitmentMethod,
} from "@/types/study";

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
    const [applicationText, setApplicationText] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const [study, setStudy] = useState<StudyDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const [userApplicationStatus, setUserApplicationStatus] = useState<
        "approved" | "pending" | "rejected" | null
    >(null);

    useEffect(() => {
        const controller = new AbortController();
        const fetchStudy = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await apiClient
                    .get(`${API_ENDPOINTS.STUDIES}/${studyId}`, {
                        signal: controller.signal,
                    })
                    .json<StudyDetail>();
                setStudy(data);
            } catch (err) {
                if (
                    typeof err === "object" &&
                    err !== null &&
                    "name" in err &&
                    (err as { name?: string }).name === "AbortError"
                ) {
                    return;
                }
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("알 수 없는 오류가 발생했습니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudy();
        return () => controller.abort();
    }, [studyId]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-gray-500">
                    스터디 정보를 불러오는 중...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-red-500">{error}</div>
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

    const handleApply = async () => {
        setIsApplying(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (study.recruitmentMethod === StudyRecruitmentMethod.FCFS) {
            setUserApplicationStatus("approved");
            toast({
                description:
                    "지원이 완료되었습니다! 스터디에 참여하게 되었습니다.",
            });
        } else {
            setUserApplicationStatus("pending");
            toast({
                description:
                    "지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.",
            });
        }
        setIsApplying(false);
        setApplicationText("");
    };

    const handleCancelApplication = async () => {
        setIsCancelling(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setUserApplicationStatus(null);
        if (userApplicationStatus === "approved") {
            toast({ description: "스터디에서 탈퇴되었습니다." });
        } else {
            toast({ description: "스터디 신청이 취소되었습니다." });
        }
        setIsCancelling(false);
    };

    const getApplicationStatusBadge = (status: string | null) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        신청 대기 중
                    </Badge>
                );
            case "approved":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        참여 중
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge className="bg-red-100 text-red-800">
                        신청 거절됨
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="스터디 지원하기" onBack={onBack} />

            <div className="mx-auto max-w-4xl p-6">
                <Card className="mb-6 border-gray-200">
                    <CardHeader>
                        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
                            <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className={`${
                                            study.participantCount <
                                                study.maxParticipants ||
                                            study.maxParticipants === 0
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {study.participantCount <
                                            study.maxParticipants ||
                                        study.maxParticipants === 0
                                            ? "모집중"
                                            : "진행중"}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-gray-300 text-gray-600"
                                    >
                                        #{StudyCategoryLabels[study.category]}
                                    </Badge>
                                    {userApplicationStatus &&
                                        getApplicationStatusBadge(
                                            userApplicationStatus
                                        )}
                                </div>
                                <CardTitle className="font-bold text-2xl text-gray-900">
                                    {study.title}
                                </CardTitle>
                                {isOwner && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit?.(studyId)}
                                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Settings className="mr-1 h-4 w-4" />
                                            스터디 수정
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onViewApplications?.(studyId)
                                            }
                                            className="border-green-600 text-green-600 hover:bg-green-50"
                                        >
                                            <UsersIcon className="mr-1 h-4 w-4" />
                                            스터디 지원현황
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onViewMembers?.(studyId)
                                            }
                                            className="border-purple-600 text-purple-600 hover:bg-purple-50"
                                        >
                                            <Users className="mr-1 h-4 w-4" />
                                            스터디원 관리
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onManageAttendance?.(studyId)
                                            }
                                            className="border-orange-600 text-orange-600 hover:bg-orange-50"
                                        >
                                            <UserCheck className="mr-1 h-4 w-4" />
                                            출석 관리
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {userApplicationStatus === "approved" &&
                                !isOwner && (
                                    <div className="w-full shrink-0 border-gray-200 border-t pt-4 md:w-auto md:border-gray-200 md:border-t-0 md:border-l md:pl-4">
                                        <div className="flex items-end gap-2">
                                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                                <Label
                                                    htmlFor={`attendance-code-${studyId}`}
                                                    className="font-medium text-sm"
                                                >
                                                    출석코드
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id={`attendance-code-${studyId}`}
                                                    placeholder="코드를 입력하세요"
                                                    className="h-9"
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="h-9"
                                            >
                                                입력
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </CardHeader>
                </Card>

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

                        {!isOwner && (
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="font-semibold text-gray-900 text-lg">
                                        {userApplicationStatus === "pending"
                                            ? "신청 현황"
                                            : userApplicationStatus ===
                                                "approved"
                                              ? "참여 현황"
                                              : userApplicationStatus ===
                                                  "rejected"
                                                ? "신청 결과"
                                                : study.recruitmentMethod ===
                                                    StudyRecruitmentMethod.FCFS
                                                  ? "지원하기"
                                                  : "지원서 작성"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {userApplicationStatus === "pending" && (
                                        <div className="space-y-4 text-center">
                                            <p className="text-gray-600">
                                                스터디 신청이 검토 중입니다.
                                            </p>
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
                                                        <AlertDialogTitle>
                                                            신청 취소
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            스터디 신청을
                                                            취소하시겠습니까?
                                                            이후 다시 신청할 수
                                                            있습니다.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            돌아가기
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleCancelApplication
                                                            }
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            {isCancelling
                                                                ? "취소 중..."
                                                                : "신청 취소"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}

                                    {userApplicationStatus === "approved" && (
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
                                                        <AlertDialogTitle>
                                                            스터디 탈퇴
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            스터디에서
                                                            탈퇴하시겠습니까?
                                                            탈퇴 후 다시
                                                            참여하려면 재신청이
                                                            필요합니다.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            돌아가기
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={
                                                                handleCancelApplication
                                                            }
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            {isCancelling
                                                                ? "탈퇴 중..."
                                                                : "탈퇴하기"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    )}

                                    {userApplicationStatus === "rejected" && (
                                        <div className="space-y-4 text-center">
                                            <p className="text-red-600">
                                                신청이 거절되었습니다.
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                다른 스터디를 찾아보세요.
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    setUserApplicationStatus(
                                                        null
                                                    )
                                                }
                                                variant="outline"
                                                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                                            >
                                                다시 지원하기
                                            </Button>
                                        </div>
                                    )}

                                    {!userApplicationStatus &&
                                        (study.recruitmentMethod ===
                                        StudyRecruitmentMethod.APPLICATION ? (
                                            <>
                                                <p className="mb-2 text-center text-gray-500 text-xs">
                                                    지원 동기 및 각오를
                                                    작성해주세요
                                                </p>
                                                <Button
                                                    onClick={() =>
                                                        setIsApplicationModalOpen(
                                                            true
                                                        )
                                                    }
                                                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                                    disabled={isApplying}
                                                >
                                                    {isApplying
                                                        ? "처리 중..."
                                                        : "지원서 작성하기"}
                                                </Button>
                                                <AlertDialog
                                                    open={
                                                        isApplicationModalOpen
                                                    }
                                                    onOpenChange={
                                                        setIsApplicationModalOpen
                                                    }
                                                >
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                지원서 작성
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                지원 동기 및
                                                                각오를
                                                                작성해주세요.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <Textarea
                                                            id="application"
                                                            placeholder="스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요."
                                                            value={
                                                                applicationText
                                                            }
                                                            onChange={(e) =>
                                                                setApplicationText(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="mt-2 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                        />
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel
                                                                onClick={() =>
                                                                    setIsApplicationModalOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                닫기
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={async () => {
                                                                    await handleApply();
                                                                    setIsApplicationModalOpen(
                                                                        false
                                                                    );
                                                                }}
                                                                disabled={
                                                                    !applicationText.trim() ||
                                                                    isApplying
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                {isApplying
                                                                    ? "처리 중..."
                                                                    : "제출"}
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    onClick={handleApply}
                                                    disabled={isApplying}
                                                    className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    {isApplying
                                                        ? "처리 중..."
                                                        : "지원하기"}
                                                </Button>
                                                <p className="text-center text-gray-500 text-xs">
                                                    선착순으로 모집되며, 정원이
                                                    마감되면 자동으로
                                                    마감됩니다.
                                                </p>
                                            </>
                                        ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyDetailPage;
