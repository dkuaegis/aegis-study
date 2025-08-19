import { AlertCircle, CheckCircle, Clock, User, XCircle } from "lucide-react";
import ApplicationCard from "@/components/study/ApplicationCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import { useApplications } from "@/hooks/useApplications";

interface ApplicationStatusProps {
    studyId: number;
    onBack: () => void;
}

const ApplicationStatusPage = ({ studyId, onBack }: ApplicationStatusProps) => {
    const {
        selectedFilter,
        setSelectedFilter,
        studyInfo,
        handleStatusChange,
        stats,
        filteredApplications,
        loading,
        error,
    } = useApplications(studyId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="스터디 지원현황" onBack={onBack} />
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2"></div>
                            <p className="text-gray-500">
                                지원자 데이터를 불러오는 중...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="스터디 지원현황" onBack={onBack} />
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <AlertCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <p className="text-lg text-red-600">{error}</p>
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                다시 시도
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!studyInfo) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="스터디 지원현황" onBack={onBack} />
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg">
                                스터디를 찾을 수 없습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
            <Header title="스터디 지원현황" onBack={onBack} />

            <div className="mx-auto max-w-7xl p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
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
                                                    studyId={studyId}
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
};

export default ApplicationStatusPage;
