import { Timer } from "lucide-react";
import { useRef, useState } from "react";
import type { AttendanceCodeResponse } from "@/api/attendanceApi";
import { fetchAttendanceCode } from "@/api/attendanceApi";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { useToast } from "@/components/ui/useToast";
import { useUserRole } from "@/hooks/useUserRole";
import ForbiddenPage from "@/pages/ForbiddenPage";

interface AttendanceProps {
    studyId: number;
    onBack: (id: number) => void;
}

const AttendancePage = ({ studyId, onBack }: AttendanceProps) => {
    // 사용자 역할 확인
    const {
        isInstructor,
        isLoading: isRoleLoading,
        error: roleError,
    } = useUserRole();

    const [isGenerating, setIsGenerating] = useState(false);
    const [attendanceCode, setAttendanceCode] = useState<string>("");
    const toast = useToast();
    const inFlight = useRef(false);

    // 권한 확인 - 강사만 출석 코드를 생성할 수 있음
    const isOwner = isInstructor(studyId);

    if (isRoleLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="출석 관리" onBack={() => onBack(studyId)} />
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-gray-500">
                        권한 정보를 불러오는 중...
                    </div>
                </div>
            </div>
        );
    }

    if (roleError) {
        console.error("사용자 권한 조회 오류:", roleError);
        // 권한 오류 시에도 기본 권한으로 계속 진행
    }

    // 권한이 없는 경우
    if (!isOwner) {
        return (
            <ForbiddenPage
                title="출석 관리"
                message="이 스터디의 출석을 관리할 수 있는 권한이 없습니다."
                onBack={() => onBack(studyId)}
            />
        );
    }

    const generateAttendanceCode = async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setIsGenerating(true);
        try {
            const res: AttendanceCodeResponse =
                await fetchAttendanceCode(studyId);
            setAttendanceCode(res.code);
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "출석 코드 발급에 실패했습니다.";
            toast({ description: message });
        } finally {
            inFlight.current = false;
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="출석 관리" onBack={() => onBack(studyId)} />
            <div className="mx-auto max-w-2xl space-y-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Timer className="h-5 w-5" />
                            출석 코드 관리
                        </CardTitle>
                        <CardDescription>
                            출석 코드를 생성합니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                            <Button
                                onClick={generateAttendanceCode}
                                disabled={isGenerating}
                                className="w-full sm:w-auto"
                            >
                                {isGenerating ? "생성 중..." : "출석 코드 생성"}
                            </Button>
                            {attendanceCode && (
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <p className="text-gray-600 text-sm">
                                            출석 코드
                                        </p>
                                        <p className="font-bold font-mono text-2xl text-blue-600">
                                            {attendanceCode}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AttendancePage;
