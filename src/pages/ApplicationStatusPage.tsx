import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    Eye,
    FileText,
    Mail,
    User,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Application {
    id: number;
    name: string;
    email: string;
    appliedAt: string;
    status: "pending" | "approved" | "rejected";
    applicationText: string;
}

interface ApplicationStatusProps {
    studyId: number;
    onBack: () => void;
}
interface StudyData {
    studyTitle: string;
    recruitmentMethod: string;
    applications: Application[];
}

const applicationsData: Record<number, StudyData> = {
    1: {
        studyTitle: "Spring과 함께 백엔드 개발자 되기",
        recruitmentMethod: "지원서",
        applications: [
            {
                id: 1,
                name: "김개발",
                email: "kim.dev@example.com",
                appliedAt: "2024-01-15",
                status: "pending",
                applicationText: `안녕하세요...`,
            },
        ],
    },
};

export default function ApplicationStatusPage({
    studyId,
    onBack,
}: ApplicationStatusProps) {
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [applications, setApplications] = useState(
        applicationsData[studyId as keyof typeof applicationsData]
            ?.applications || []
    );

    const studyInfo =
        applicationsData[studyId as keyof typeof applicationsData];

    if (!studyInfo) {
        return <div>스터디를 찾을 수 없습니다.</div>;
    }

    const handleStatusChange = (
        applicationId: number,
        newStatus: "approved" | "rejected"
    ) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            )
        );
    };

    const getFilteredApplications = (filter: string) => {
        switch (filter) {
            case "pending":
                return applications.filter((app) => app.status === "pending");
            case "approved":
                return applications.filter((app) => app.status === "approved");
            case "rejected":
                return applications.filter((app) => app.status === "rejected");
            default:
                return applications;
        }
    };

    const stats = {
        total: applications.length,
        pending: applications.filter((app) => app.status === "pending").length,
        approved: applications.filter((app) => app.status === "approved")
            .length,
        rejected: applications.filter((app) => app.status === "rejected")
            .length,
    };

    const filteredApplications = getFilteredApplications(selectedFilter);

    const filterOptions = [
        {
            key: "all",
            label: "전체",
            count: stats.total,
            icon: User,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            hoverColor: "hover:bg-blue-100",
            activeColor: "bg-blue-100 text-blue-700 border-blue-200",
        },
        {
            key: "pending",
            label: "검토 중",
            count: stats.pending,
            icon: Clock,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            hoverColor: "hover:bg-yellow-100",
            activeColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
        },
        {
            key: "approved",
            label: "승인",
            count: stats.approved,
            icon: CheckCircle,
            color: "text-green-600",
            bgColor: "bg-green-50",
            hoverColor: "hover:bg-green-100",
            activeColor: "bg-green-100 text-green-700 border-green-200",
        },
        {
            key: "rejected",
            label: "거절",
            count: stats.rejected,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
            hoverColor: "hover:bg-red-100",
            activeColor: "bg-red-100 text-red-700 border-red-200",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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

            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <h1 className="mb-2 font-bold text-3xl text-gray-900">
                        지원 현황
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {studyInfo.studyTitle}
                    </p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Left Sidebar - Filters */}
                    <aside className="w-full rounded-lg border border-gray-200 bg-white p-6 lg:h-fit lg:w-80">
                        <h2 className="mb-4 font-semibold text-gray-900 text-lg">
                            지원자 필터
                        </h2>
                        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-x-visible lg:pb-0">
                            {filterOptions.map((option) => {
                                const IconComponent = option.icon;
                                const isActive = selectedFilter === option.key;
                                return (
                                    <button
                                        type="button"
                                        key={option.key}
                                        onClick={() =>
                                            setSelectedFilter(option.key)
                                        }
                                        className={`flex flex-shrink-0 items-center justify-between rounded-lg border p-4 transition-all duration-200 lg:w-full ${
                                            isActive
                                                ? `${option.activeColor} border-current`
                                                : `border-gray-200 ${option.hoverColor} hover:border-gray-300`
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <div
                                                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                                                    isActive
                                                        ? "bg-white"
                                                        : option.bgColor
                                                }`}
                                            >
                                                <IconComponent
                                                    className={`h-5 w-5 ${isActive ? option.color : option.color}`}
                                                />
                                            </div>
                                            <span
                                                className={`font-medium ${isActive ? "text-current" : "text-gray-700"}`}
                                            >
                                                {option.label}
                                            </span>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className={`${
                                                isActive
                                                    ? "border-current bg-white text-current"
                                                    : "border-gray-200 bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {option.count}
                                        </Badge>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Content - Applications List */}
                    <main className="flex-1">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="border-gray-100 border-b bg-white">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="font-semibold text-gray-900 text-xl">
                                        {
                                            filterOptions.find(
                                                (opt) =>
                                                    opt.key === selectedFilter
                                            )?.label
                                        }{" "}
                                        지원자
                                    </CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-gray-600"
                                    >
                                        {filteredApplications.length}명
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {filteredApplications.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                            <User className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 text-lg">
                                            해당하는 지원자가 없습니다.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredApplications.map(
                                            (application) => (
                                                <ApplicationCard
                                                    key={application.id}
                                                    application={application}
                                                    onStatusChange={
                                                        handleStatusChange
                                                    }
                                                    recruitmentMethod={
                                                        studyInfo.recruitmentMethod
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>
        </div>
    );
}

function ApplicationCard({
    application,
    onStatusChange,
    recruitmentMethod,
}: {
    application: Application;
    onStatusChange: (id: number, status: "approved" | "rejected") => void;
    recruitmentMethod: string;
}) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge className="border-yellow-200 bg-yellow-100 text-yellow-800">
                        검토 중
                    </Badge>
                );
            case "approved":
                return (
                    <Badge className="border-green-200 bg-green-100 text-green-800">
                        승인
                    </Badge>
                );
            case "rejected":
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
                                <Mail className="mr-2 h-4 w-4" />
                                {application.email}
                            </div>
                            <div className="mt-1 flex items-center text-gray-500 text-sm">
                                <Calendar className="mr-2 h-4 w-4" />
                                지원일: {application.appliedAt}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        {getStatusBadge(application.status)}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {recruitmentMethod === "지원서" && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50"
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
                                                    지원일:{" "}
                                                    {application.appliedAt}
                                                </span>
                                            </div>
                                        </div>
                                        <Textarea
                                            value={application.applicationText}
                                            readOnly
                                            className="min-h-[250px] resize-none border-gray-200 bg-white"
                                        />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    {application.status === "pending" && (
                        <div className="flex space-x-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    onStatusChange(application.id, "approved")
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
                                    onStatusChange(application.id, "rejected")
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
}
