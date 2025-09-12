import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Timer,
    XCircle,
} from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/useToast";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "late" | "absent";

interface AttendanceProps {
    studyId: number;
    onBack: (id: number) => void;
}

interface Student {
    id: string;
    name: string;
    status: AttendanceStatus;
    checkTime?: string;
}

interface WeeklyAttendance {
    [week: number]: Student[];
}

const AttendancePage = ({ studyId, onBack }: AttendanceProps) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [attendanceCode, setAttendanceCode] = useState<string>("");
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendance>({
        1: [
            { id: "1", name: "김철수", status: "absent" },
            { id: "2", name: "이영희", status: "absent" },
            { id: "3", name: "박민수", status: "absent" },
            { id: "4", name: "정수진", status: "absent" },
            { id: "5", name: "최동현", status: "absent" },
        ],
        2: [
            {
                id: "1",
                name: "김철수",
                status: "present",
                checkTime: "14:30:15",
            },
            { id: "2", name: "이영희", status: "late", checkTime: "14:35:22" },
            { id: "3", name: "박민수", status: "absent" },
            {
                id: "4",
                name: "정수진",
                status: "present",
                checkTime: "14:29:45",
            },
            {
                id: "5",
                name: "최동현",
                status: "present",
                checkTime: "14:28:10",
            },
        ],
        3: [
            {
                id: "1",
                name: "김철수",
                status: "present",
                checkTime: "14:25:30",
            },
            {
                id: "2",
                name: "이영희",
                status: "present",
                checkTime: "14:27:18",
            },
            { id: "3", name: "박민수", status: "late", checkTime: "14:40:12" },
            { id: "4", name: "정수진", status: "absent" },
            {
                id: "5",
                name: "최동현",
                status: "present",
                checkTime: "14:26:55",
            },
        ],
    });
    const toast = useToast();

    const students = weeklyAttendance[currentWeek] || [];
    const [submittedWeeks, setSubmittedWeeks] = useState<Set<number>>(
        new Set()
    );

    // 출석 코드 발급 API 연동
    const generateAttendanceCode = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            const res: AttendanceCodeResponse =
                await fetchAttendanceCode(studyId);
            setAttendanceCode(res.code);
        } catch (_e) {
            toast({ description: "출석 코드 발급에 실패했습니다." });
        } finally {
            setIsGenerating(false);
        }
    };

    const getStatusIcon = (status: AttendanceStatus) => {
        switch (status) {
            case "present":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "late":
                return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case "absent":
                return <XCircle className="h-4 w-4 text-red-600" />;
        }
    };

    const submitAttendance = () => {
        setSubmittedWeeks((prev) => new Set([...prev, currentWeek]));
        const isResubmit = submittedWeeks.has(currentWeek);
        toast({
            description: `${currentWeek}주차 출석 현황이 ${isResubmit ? "정정" : "제출"}되었습니다.`,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="출석 관리" onBack={() => onBack(studyId)} />
            <div className="mx-auto max-w-6xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            주차별 출석 현황
                        </CardTitle>
                        <CardDescription>
                            각 주차별 출석 현황을 확인할 수 있습니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label
                                    className="font-medium text-sm"
                                    htmlFor="week-select"
                                >
                                    주차 선택:
                                </label>
                                <Select
                                    value={currentWeek.toString()}
                                    onValueChange={(value) =>
                                        setCurrentWeek(Number(value))
                                    }
                                >
                                    <SelectTrigger
                                        className="w-32"
                                        id="week-select"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(weeklyAttendance).map(
                                            (week) => (
                                                <SelectItem
                                                    key={week}
                                                    value={week}
                                                >
                                                    {week}주차
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse rounded-lg border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-200 p-3 text-left font-medium">
                                                이름
                                            </th>
                                            {Object.keys(weeklyAttendance).map(
                                                (week) => (
                                                    <th
                                                        key={week}
                                                        className="border border-gray-200 p-3 text-center font-medium"
                                                    >
                                                        {week}주차
                                                    </th>
                                                )
                                            )}
                                            <th className="border border-gray-200 p-3 text-center font-medium">
                                                출석률
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => {
                                            const studentWeeklyData =
                                                Object.keys(
                                                    weeklyAttendance
                                                ).map((week) => {
                                                    const weekData =
                                                        weeklyAttendance[
                                                            Number(week)
                                                        ];
                                                    const studentData =
                                                        weekData.find(
                                                            (s) =>
                                                                s.id ===
                                                                student.id
                                                        );
                                                    return (
                                                        studentData?.status ||
                                                        "absent"
                                                    );
                                                });

                                            const attendanceCount =
                                                studentWeeklyData.filter(
                                                    (status) =>
                                                        status === "present" ||
                                                        status === "late"
                                                ).length;
                                            const attendanceRate = Math.round(
                                                (attendanceCount /
                                                    studentWeeklyData.length) *
                                                    100
                                            );

                                            return (
                                                <tr
                                                    key={student.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="border border-gray-200 p-3 font-medium">
                                                        {student.name}
                                                    </td>
                                                    {Object.keys(
                                                        weeklyAttendance
                                                    ).map((week) => {
                                                        const weekNum =
                                                            Number(week);
                                                        const weekData =
                                                            weeklyAttendance[
                                                                weekNum
                                                            ];
                                                        const studentData =
                                                            weekData.find(
                                                                (s) =>
                                                                    s.id ===
                                                                    student.id
                                                            );
                                                        const status =
                                                            studentData?.status ||
                                                            "absent";

                                                        return (
                                                            <td
                                                                key={week}
                                                                className="border border-gray-200 p-2 text-center"
                                                            >
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Select
                                                                        value={
                                                                            status
                                                                        }
                                                                        onValueChange={(
                                                                            value: AttendanceStatus
                                                                        ) => {
                                                                            const currentTime =
                                                                                new Date().toLocaleTimeString(
                                                                                    "ko-KR"
                                                                                );
                                                                            setWeeklyAttendance(
                                                                                (
                                                                                    prev
                                                                                ) => ({
                                                                                    ...prev,
                                                                                    [weekNum]:
                                                                                        prev[
                                                                                            weekNum
                                                                                        ].map(
                                                                                            (
                                                                                                s
                                                                                            ) =>
                                                                                                s.id ===
                                                                                                student.id
                                                                                                    ? {
                                                                                                          ...s,
                                                                                                          status: value,
                                                                                                          checkTime:
                                                                                                              value !==
                                                                                                              "absent"
                                                                                                                  ? currentTime
                                                                                                                  : undefined,
                                                                                                      }
                                                                                                    : s
                                                                                        ),
                                                                                })
                                                                            );
                                                                        }}
                                                                    >
                                                                        <SelectTrigger className="h-8 w-16 p-1">
                                                                            <SelectValue>
                                                                                {getStatusIcon(
                                                                                    status
                                                                                )}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="present">
                                                                                <div className="flex items-center gap-2">
                                                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                                                    출석
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="late">
                                                                                <div className="flex items-center gap-2">
                                                                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                                                    지각
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="absent">
                                                                                <div className="flex items-center gap-2">
                                                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                                                    결석
                                                                                </div>
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="border border-gray-200 p-3 text-center font-medium">
                                                        <span
                                                            className={cn(
                                                                "rounded-full px-2 py-1 text-sm",
                                                                attendanceRate >=
                                                                    80
                                                                    ? "bg-green-100 text-green-800"
                                                                    : attendanceRate >=
                                                                        60
                                                                      ? "bg-yellow-100 text-yellow-800"
                                                                      : "bg-red-100 text-red-800"
                                                            )}
                                                        >
                                                            {attendanceRate}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
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
                                    {isGenerating
                                        ? "생성 중..."
                                        : "출석 코드 생성"}
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                출석 현황 제출
                            </CardTitle>
                            <CardDescription>
                                현재 주차의 출석 현황을 제출합니다. 제출 후에도
                                수정 및 재제출이 가능합니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">
                                        현재 주차: {currentWeek}주차
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {submittedWeeks.has(currentWeek)
                                            ? "✅ 제출됨 (재제출 가능)"
                                            : "⏳ 제출 대기"}
                                    </p>
                                </div>
                                <Button
                                    onClick={submitAttendance}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    {submittedWeeks.has(currentWeek)
                                        ? "재제출"
                                        : "출석 현황 제출"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
