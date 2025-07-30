import {
    ArrowLeft,
    BarChart3,
    CheckCircle,
    Clock,
    Settings,
    Timer,
    User,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface StudyDetailProps {
    studyId: number;
    onBack: () => void;
    onEdit?: (studyId: number) => void;
    onViewApplications?: (studyId: number) => void;
    onViewMembers?: (studyId: number) => void;
    onManageAttendance?: (studyId: number) => void;
    isOwner?: boolean;
    currentUserId?: string;
    initialUserApplicationStatus?: "approved" | "pending" | "rejected" | null;
}

const studyDetailData = {
    1: {
        id: 1,
        title: "Spring과 함께 백엔드 개발자 되기",
        status: "모집중",
        category: "WEB",
        difficulty: "중급",
        participants: "10/20명",
        manager: "관리자",
        recruitmentMethod: "지원서", // "선착순" or "지원서"
        maxParticipants: 20,
        currentParticipants: 10,
        schedule: "매주 화, 목 19:00-21:00",
        introduction: `Spring Framework를 활용한 백엔드 개발 스터디입니다.
실무에서 사용되는 Spring Boot, Spring Security, JPA 등을 학습하며
실제 프로젝트를 통해 백엔드 개발 역량을 키워나갑니다.

초보자도 참여할 수 있도록 기초부터 차근차근 진행하며,
팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.`,
        curriculum: [
            "1주차: Spring Boot 기초 및 환경 설정",
            "2주차: Spring MVC 패턴과 REST API",
            "3주차: 데이터베이스 연동 (JPA, Hibernate)",
            "4주차: Spring Security 인증/인가",
            "5주차: 테스트 코드 작성 (JUnit, Mockito)",
            "6주차: 팀 프로젝트 기획 및 설계",
            "7주차: 팀 프로젝트 개발",
            "8주차: 프로젝트 발표 및 코드 리뷰",
        ],
        requirements: [
            "Java 기초 문법을 알고 있는 분",
            "객체지향 프로그래밍에 대한 기본 이해",
            "데이터베이스 기초 지식 (SQL)",
            "Git 사용 경험 (기초 수준)",
            "매주 정기 모임 참석 가능한 분",
        ],
        ownerId: "user123",
    },
    2: {
        id: 2,
        title: "React 입문",
        status: "모집중",
        category: "WEB",
        difficulty: "입문",
        participants: "10/20명",
        manager: "관리자",
        recruitmentMethod: "선착순",
        maxParticipants: 20,
        currentParticipants: 10,
        schedule: "매주 토 14:00-17:00",
        introduction: `React를 처음 배우는 분들을 위한 입문 스터디입니다.
JavaScript 기초부터 React의 핵심 개념까지 차근차근 학습합니다.

실습 위주로 진행되며, 간단한 웹 애플리케이션을 만들어보면서
React의 동작 원리를 이해할 수 있습니다.`,
        curriculum: [
            "1주차: JavaScript ES6+ 문법 복습",
            "2주차: React 기초 (JSX, 컴포넌트)",
            "3주차: State와 Props 이해하기",
            "4주차: 이벤트 처리와 조건부 렌더링",
            "5주차: React Hooks (useState, useEffect)",
            "6주차: 미니 프로젝트 (Todo App 만들기)",
        ],
        requirements: [
            "HTML, CSS 기초 지식",
            "JavaScript 기본 문법 이해",
            "프로그래밍 경험 (언어 무관)",
            "학습 의지가 강한 분",
        ],
        ownerId: "user124",
    },
    3: {
        id: 3,
        title: "Python 데이터 분석",
        status: "진행중",
        category: "DATA",
        difficulty: "중급",
        participants: "15/20명",
        manager: "관리자",
        recruitmentMethod: "지원서",
        maxParticipants: 20,
        currentParticipants: 15,
        schedule: "주 2회",
        introduction: `Python과 데이터 분석 라이브러리(Pandas, Numpy 등)를 활용한 데이터 분석 실습 중심 스터디입니다.
실제 데이터셋을 다루며 데이터 전처리, 시각화, 통계 분석, 간단한 머신러닝까지 경험할 수 있습니다.`,
        curriculum: [
            "1주차: Python 데이터 분석 환경 구축",
            "2주차: Pandas 기초와 데이터 다루기",
            "3주차: 데이터 시각화(Matplotlib, Seaborn)",
            "4주차: 통계 분석 기초",
            "5주차: 머신러닝 개요 및 실습",
            "6주차: 프로젝트 실습",
        ],
        requirements: [
            "Python 기초 문법 이해",
            "데이터 분석에 관심 있는 분",
            "노트북 지참 가능자",
        ],
        ownerId: "user125",
    },
    4: {
        id: 4,
        title: "Flutter 모바일 앱 개발",
        status: "모집중",
        category: "MOBILE",
        difficulty: "고급",
        participants: "8/15명",
        manager: "관리자",
        recruitmentMethod: "선착순",
        maxParticipants: 15,
        currentParticipants: 8,
        schedule: "주 3회",
        introduction: `Flutter를 활용한 모바일 앱 개발 심화 스터디입니다.
실제 앱을 기획하고 개발하며, 퍼블리싱까지 경험할 수 있습니다.`,
        curriculum: [
            "1주차: Flutter 개발 환경 구축",
            "2주차: 위젯과 레이아웃 이해",
            "3주차: 상태 관리(BLoC, Provider)",
            "4주차: 네트워크 통신 및 API 연동",
            "5주차: 실전 앱 프로젝트",
        ],
        requirements: [
            "Dart/Flutter 개발 경험",
            "모바일 앱 개발에 관심 있는 분",
            "팀 프로젝트 경험자 우대",
        ],
        ownerId: "user126",
    },
};

const initialUserApplicationStatus: Record<
    string,
    Record<number, "approved" | "pending" | "rejected">
> = {
    user123: {
        1: "approved",
        2: "pending",
        3: "approved",
    },
    user456: {
        1: "pending",
    },
};

const StudyDetailPage = ({
    studyId,
    onBack,
    onEdit,
    onViewApplications,
    onViewMembers,
    onManageAttendance,
    isOwner = false,
    currentUserId = "user123",
}: StudyDetailProps) => {
    const [applicationText, setApplicationText] = useState("");
    const [isApplying, setIsApplying] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // 출석 관련 상태
    const [attendanceCode, setAttendanceCode] = useState<string>("");
    const [inputCode, setInputCode] = useState<string>("");
    const [timer, setTimer] = useState<number>(0);
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [attendanceStatus, setAttendanceStatus] = useState<
        "none" | "checked" | "late"
    >("none");

    // 사용자의 신청 상태를 로컬 state로 관리
    const [userApplicationStatus, setUserApplicationStatus] = useState<
        "approved" | "pending" | "rejected" | null
    >(
        typeof initialUserApplicationStatus === "string"
            ? initialUserApplicationStatus
            : initialUserApplicationStatus && currentUserId
              ? (initialUserApplicationStatus[currentUserId]?.[studyId] ?? null)
              : null
    );

    const study = studyDetailData[studyId as keyof typeof studyDetailData];

    // 타이머 효과
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

    if (!study) {
        return <div>스터디를 찾을 수 없습니다.</div>;
    }

    const handleApply = async () => {
        setIsApplying(true);
        // 지원 로직 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (study.recruitmentMethod === "선착순") {
            // 선착순인 경우 바로 승인
            setUserApplicationStatus("approved");
            alert("지원이 완료되었습니다! 스터디에 참여하게 되었습니다.");
        } else {
            // 지원서인 경우 대기 상태
            setUserApplicationStatus("pending");
            alert("지원서가 제출되었습니다! 검토 후 결과를 알려드리겠습니다.");
        }
        setIsApplying(false);
        setApplicationText("");
    };

    const handleCancelApplication = async () => {
        setIsCancelling(true);
        // 신청 취소 로직 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // 상태를 null로 변경하여 다시 지원하기 버튼이 나타나도록 함
        setUserApplicationStatus(null);
        if (userApplicationStatus === "approved") {
            alert("스터디에서 탈퇴되었습니다.");
        } else {
            alert("스터디 신청이 취소되었습니다.");
        }
        setIsCancelling(false);
    };

    // 출석 코드 생성 (스터디장용)
    const generateAttendanceCode = () => {
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        setAttendanceCode(code);
        setTimer(60); // 1분
        setIsTimerActive(true);
        alert(`출석 코드가 생성되었습니다: ${code}`);
    };

    // 출석 체크 (스터디원용)
    const checkAttendance = () => {
        if (inputCode === attendanceCode && attendanceCode) {
            const remainingTime = timer;
            const status = remainingTime > 30 ? "checked" : "late";
            setAttendanceStatus(status);
            setInputCode("");
            alert(
                `출석이 완료되었습니다! ${status === "late" ? "(지각)" : ""}`
            );
        } else {
            alert("올바르지 않은 출석 코드입니다.");
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            <header className="border-gray-200 border-b bg-white px-6 py-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
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

            <div className="mx-auto max-w-4xl p-6">
                {/* Study Header */}
                <Card className="mb-6 border-gray-200">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="mb-2 flex items-center gap-2">
                                    <Badge
                                        variant="secondary"
                                        className="bg-blue-100 text-blue-800"
                                    >
                                        {study.status}
                                    </Badge>
                                    <Badge
                                        variant="outline"
                                        className="border-gray-300 text-gray-600"
                                    >
                                        #{study.category}
                                    </Badge>
                                    {userApplicationStatus &&
                                        getApplicationStatusBadge(
                                            userApplicationStatus
                                        )}
                                </div>
                                <CardTitle className="mb-4 font-bold text-2xl text-gray-900">
                                    {study.title}
                                </CardTitle>
                                {isOwner && (
                                    <div className="mb-4 flex flex-wrap gap-2">
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
                                            지원 현황 보기
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
                                <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                                    <div className="flex items-center text-gray-600">
                                        <BarChart3 className="mr-2 h-4 w-4" />
                                        <span>{study.difficulty}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="mr-2 h-4 w-4" />
                                        <span>{study.participants}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{study.manager}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Study Introduction */}
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    스터디 소개
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                                    {study.introduction}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    커리큘럼
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {study.curriculum.map((item) => (
                                        <div
                                            key={item}
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

                        {/* Requirements */}
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    지원 자격
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {study.requirements.map((requirement) => (
                                        <div
                                            key={requirement}
                                            className="flex items-start"
                                        >
                                            <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                                            <span className="text-gray-700">
                                                {requirement}
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
                                        모집 방법
                                    </Label>
                                    <p className="mt-1 text-gray-700">
                                        {study.recruitmentMethod === "선착순"
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
                                        {study.currentParticipants}/
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
                            </CardContent>
                        </Card>

                        {/* 스터디장용 출석 코드 생성 */}
                        {isOwner && (
                            <Card className="border-gray-200">
                                <CardHeader>
                                    <CardTitle className="font-semibold text-gray-900 text-lg">
                                        출석 코드 생성
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        onClick={generateAttendanceCode}
                                        disabled={isTimerActive}
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                    >
                                        <Timer className="mr-2 h-4 w-4" />
                                        출석 코드 생성
                                    </Button>
                                    {attendanceCode && (
                                        <div className="space-y-2 text-center">
                                            <div className="rounded-lg bg-blue-50 p-4">
                                                <p className="mb-1 text-blue-600 text-sm">
                                                    출석 코드
                                                </p>
                                                <p className="font-bold font-mono text-2xl text-blue-800">
                                                    {attendanceCode}
                                                </p>
                                            </div>
                                            {isTimerActive && (
                                                <div className="flex items-center justify-center gap-2 text-orange-600">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-bold font-mono">
                                                        {formatTime(timer)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

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
                                                    "선착순"
                                                  ? "지원하기"
                                                  : "지원서 작성"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* 신청 상태에 따른 UI 분기 */}
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
                                                {attendanceStatus ===
                                                    "checked" && (
                                                    <Badge className="bg-green-100 text-green-800">
                                                        ✅ 출석 완료
                                                    </Badge>
                                                )}
                                                {attendanceStatus ===
                                                    "late" && (
                                                    <Badge className="bg-yellow-100 text-yellow-800">
                                                        ⚠️ 지각
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* 출석 체크 섹션 */}
                                            {attendanceCode &&
                                                attendanceStatus === "none" && (
                                                    <div className="space-y-3">
                                                        <Separator className="bg-gray-200" />
                                                        <div>
                                                            <Label className="font-medium text-gray-900 text-sm">
                                                                출석 체크
                                                            </Label>
                                                            <div className="mt-2 space-y-3">
                                                                <Input
                                                                    placeholder="출석 코드 입력 (숫자 5자리)"
                                                                    value={
                                                                        inputCode
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setInputCode(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    maxLength={
                                                                        5
                                                                    }
                                                                    className="text-center font-mono text-lg"
                                                                    type="number"
                                                                />
                                                                <Button
                                                                    onClick={
                                                                        checkAttendance
                                                                    }
                                                                    disabled={
                                                                        inputCode.length !==
                                                                            5 ||
                                                                        !attendanceCode
                                                                    }
                                                                    className="w-full bg-green-600 text-white hover:bg-green-700"
                                                                >
                                                                    <UserCheck className="mr-2 h-4 w-4" />
                                                                    출석하기
                                                                </Button>
                                                                {isTimerActive && (
                                                                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                                                                        <p className="text-blue-600 text-sm">
                                                                            출석
                                                                            체크
                                                                            가능
                                                                            시간:{" "}
                                                                            <span className="font-bold font-mono">
                                                                                {formatTime(
                                                                                    timer
                                                                                )}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                            {!attendanceCode &&
                                                attendanceStatus === "none" && (
                                                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                                                        <p className="text-gray-500 text-sm">
                                                            현재 활성화된 출석
                                                            코드가 없습니다.
                                                        </p>
                                                    </div>
                                                )}

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

                                    {!userApplicationStatus && (
                                        <>
                                            {study.recruitmentMethod ===
                                                "지원서" && (
                                                <div>
                                                    <Label
                                                        htmlFor="application"
                                                        className="font-medium text-gray-900 text-sm"
                                                    >
                                                        지원 동기 및 각오를
                                                        작성해주세요
                                                    </Label>
                                                    <Textarea
                                                        id="application"
                                                        placeholder="스터디에 지원하는 이유와 목표, 각오 등을 자유롭게 작성해주세요."
                                                        value={applicationText}
                                                        onChange={(e) =>
                                                            setApplicationText(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-2 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    />
                                                </div>
                                            )}
                                            <Button
                                                onClick={handleApply}
                                                disabled={
                                                    isApplying ||
                                                    (study.recruitmentMethod ===
                                                        "지원서" &&
                                                        !applicationText.trim())
                                                }
                                                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                {isApplying
                                                    ? "처리 중..."
                                                    : "지원하기"}
                                            </Button>
                                            {study.recruitmentMethod ===
                                                "선착순" && (
                                                <p className="text-center text-gray-500 text-xs">
                                                    선착순으로 모집되며, 정원이
                                                    마감되면 자동으로
                                                    마감됩니다.
                                                </p>
                                            )}
                                        </>
                                    )}
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
