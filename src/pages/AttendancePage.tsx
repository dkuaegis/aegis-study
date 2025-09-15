import { Timer } from "lucide-react";
import { useState } from "react";
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

interface AttendanceProps {
    studyId: number;
    onBack: (id: number) => void;
}

const AttendancePage = ({ studyId, onBack }: AttendanceProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [attendanceCode, setAttendanceCode] = useState<string>("");
    const toast = useToast();

    const generateAttendanceCode = async () => {
        if (isGenerating) return;
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
