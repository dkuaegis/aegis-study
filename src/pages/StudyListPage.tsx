import { BarChart3, Clock, User, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const studyData = [
    {
        id: 1,
        title: "Spring과 함께 백엔드 개발자 되기",
        status: "모집중",
        category: "WEB",
        difficulty: "중급",
        schedule: "모집 후 결정",
        participants: "10/20명",
        manager: "관리자",
    },
    {
        id: 2,
        title: "React 입문",
        status: "모집중",
        category: "WEB",
        difficulty: "입문",
        schedule: "모집 후 결정",
        participants: "10/20명",
        manager: "관리자",
    },
    {
        id: 3,
        title: "Python 데이터 분석",
        status: "진행중",
        category: "DATA",
        difficulty: "중급",
        schedule: "주 2회",
        participants: "15/20명",
        manager: "관리자",
    },
    {
        id: 4,
        title: "Flutter 모바일 앱 개발",
        status: "모집중",
        category: "MOBILE",
        difficulty: "고급",
        schedule: "주 3회",
        participants: "8/15명",
        manager: "관리자",
    },
];

interface StudyListMainProps {
    onCreateStudy: () => void;
    onViewStudyDetail: (studyId: number) => void;
}

const StudyList = ({
    onCreateStudy,
    onViewStudyDetail,
}: StudyListMainProps) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 ">
            <header className="border-gray-200 border-b bg-white px-6 py-4">
                <div className="flex items-center">
                    <span className="pl-[10%] font-bold text-gray-900 text-xl">
                        스터디 목록
                    </span>
                </div>
            </header>
            <main className="mx-auto max-w-6xl items-center p-6">

                <div className="mb-6 flex justify-end">
                    <Button
                        onClick={onCreateStudy}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        스터디 개설하기
                    </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {studyData.map((study) => (
                        <Card
                            key={study.id}
                            className="cursor-pointer border-gray-200 transition-shadow hover:shadow-md"
                            onClick={() => onViewStudyDetail(study.id)}
                        >
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div>
                                        <Badge
                                            variant="secondary"
                                            className={`${
                                                study.status === "모집중"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : study.status === "진행중"
                                                      ? "bg-gray-100 text-gray-800"
                                                      : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {study.status}
                                        </Badge>
                                    </div>

                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                        {study.title}
                                    </h3>

                                    <div className="space-y-3 text-gray-600 text-sm">
                                        <div className="flex items-center">
                                            <BarChart3 className="mr-2 h-4 w-4" />
                                            <span>{study.difficulty}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4" />
                                            <span>{study.schedule}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-4 w-4" />
                                            <span>{study.participants}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <User className="mr-2 h-4 w-4" />
                                            <span>{study.manager}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Badge
                                            variant="outline"
                                            className="border-gray-300 text-gray-600"
                                        >
                                            #{study.category}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default StudyList;
