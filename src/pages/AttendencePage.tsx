import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Timer,
    XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AttendanceStatus = "present" | "late" | "absent";

interface Student {
    id: string;
    name: string;
    status: AttendanceStatus;
    checkTime?: string;
    isManuallyModified: boolean;
}

interface WeeklyAttendance {
    [week: number]: Student[];
}

export default function AttendanceSystem() {
    const [attendanceCode, setAttendanceCode] = useState<string>("");
    const [timer, setTimer] = useState<number>(0);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [currentWeek, setCurrentWeek] = useState<number>(1);
    const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendance>({
        1: [
            { id: "1", name: "김철수", status: "absent", isManuallyModified: false },
            { id: "2", name: "이영희", status: "absent", isManuallyModified: false },
            { id: "3", name: "박민수", status: "absent", isManuallyModified: false },
            { id: "4", name: "정수진", status: "absent", isManuallyModified: false },
            { id: "5", name: "최동현", status: "absent", isManuallyModified: false },
        ],
        2: [
            { id: "1", name: "김철수", status: "present", checkTime: "14:30:15", isManuallyModified: false },
            { id: "2", name: "이영희", status: "late", checkTime: "14:35:22", isManuallyModified: false },
            { id: "3", name: "박민수", status: "absent", isManuallyModified: false },
            { id: "4", name: "정수진", status: "present", checkTime: "14:29:45", isManuallyModified: false },
            { id: "5", name: "최동현", status: "present", checkTime: "14:28:10", isManuallyModified: false },
        ],
        3: [
            { id: "1", name: "김철수", status: "present", checkTime: "14:25:30", isManuallyModified: false },
            { id: "2", name: "이영희", status: "present", checkTime: "14:27:18", isManuallyModified: false },
            { id: "3", name: "박민수", status: "late", checkTime: "14:40:12", isManuallyModified: true },
            { id: "4", name: "정수진", status: "absent", isManuallyModified: false },
            { id: "5", name: "최동현", status: "present", checkTime: "14:26:55", isManuallyModified: false },
        ],
    });

    const students = weeklyAttendance[currentWeek] || [];
    const [submittedWeeks, setSubmittedWeeks] = useState<Set<number>>(new Set());

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((timer) => timer - 1);
            }, 1000);
        } else if (timer === 0 && isTimerActive) {
            setIsTimerActive(false);
            setAttendanceCode("");
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const generateAttendanceCode = () => {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        setAttendanceCode(code);
        setTimer(60); // 1분
        setIsTimerActive(true);
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const submitAttendance = () => {
        setSubmittedWeeks((prev) => new Set([...prev, currentWeek]));
        const isResubmit = submittedWeeks.has(currentWeek);
        alert(
            `${currentWeek}주차 출석 현황이 ${isResubmit ? "재" : ""}제출되었습니다.`
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="border-gray-200 border-b bg-white px-6 py-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <title>뒤로가기</title>
                            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        뒤로가기
                    </Button>
                    <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black">
                            <img
                                src="/aegis-logo-2500w-opti.png"
                                alt="Aegis Logo"
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold text-gray-900 text-xl">
                            Aegis
                        </span>
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-6xl space-y-6">

                {/* 주차별 출석 현황 */}
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
                            {/* 주차 선택 */}
                            <div className="flex items-center gap-4">
                                <label className="font-medium text-sm" htmlFor="week-select">
                                    주차 선택:
                                </label>
                                <Select
                                    value={currentWeek.toString()}
                                    onValueChange={(value) =>
                                        setCurrentWeek(Number(value))
                                    }
                                >
                                    <SelectTrigger className="w-32" id="week-select">
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
                            {/* 전체 주차 요약 표 */}
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
                                                                                                          isManuallyModified: true,
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
                                                                    {studentData?.isManuallyModified && (
                                                                        <span className="text-blue-600 text-xs">
                                                                            수정됨
                                                                        </span>
                                                                    )}
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

                {/* 스터디장 뷰 */}
                <div className="space-y-6">
                    {/* 출석 코드 생성 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Timer className="h-5 w-5" />
                                출석 코드 관리
                            </CardTitle>
                            <CardDescription>
                                출석 코드를 생성하고 1분간 유효합니다.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center gap-4 sm:flex-row">
                                <Button
                                    onClick={generateAttendanceCode}
                                    disabled={isTimerActive}
                                    className="w-full sm:w-auto"
                                >
                                    출석 코드 생성
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
                                        {isTimerActive && (
                                            <div className="flex items-center gap-2 text-orange-600">
                                                <Clock className="h-4 w-4" />
                                                <span className="font-bold font-mono">
                                                    {formatTime(timer)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 출석 현황 제출 */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" />
                                출석 현황 제출
                            </CardTitle>
                            <CardDescription>
                                현재 주차의 출석 현황을 제출합니다. 제출
                                후에도 수정 및 재제출이 가능합니다.
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
}
