import { BarChart3, Clock, User, Users } from "lucide-react";
import { useStudyListQuery } from "@/api/studyListApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/ui/Header";
import {
    StudyCategoryLabels,
    StudyLevelLabels,
    type StudyListItem,
} from "@/types/study";

interface StudyListMainProps {
    onCreateStudy: () => void;
    onViewStudyDetail: (studyId: number) => void;
}

const StudyList = ({
    onCreateStudy,
    onViewStudyDetail,
}: StudyListMainProps) => {
    const {
        data: studies = [],
        isLoading: loading,
        error,
    } = useStudyListQuery();

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header />
            <div className="mb-6 flex w-full justify-end px-6 pt-6">
                <Button
                    onClick={onCreateStudy}
                    className="group relative overflow-hidden bg-blue-600 text-white transition-colors hover:bg-blue-700"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
                    >
                        <span
                            aria-hidden="true"
                            className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
                        />
                    </span>
                    <span className="relative z-10">스터디 개설하기</span>
                </Button>
            </div>
            <main className="mx-auto max-w-none items-center px-6 pb-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                            <div className="text-gray-500">로딩 중...</div>
                        </div>
                    ) : error ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                            <div className="text-red-500">
                                스터디 목록을 불러오는데 실패했습니다.
                            </div>
                        </div>
                    ) : (
                        studies.map((study: StudyListItem) => (
                            <Card
                                key={study.id}
                                className="w-full min-w-0 cursor-pointer border-gray-200 transition-shadow hover:shadow-md"
                                onClick={() => onViewStudyDetail(study.id)}
                            >
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        <div>
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
                                                    : "모집완료"}
                                            </Badge>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                            {study.title}
                                        </h3>

                                        <div className="space-y-3 text-gray-600 text-sm">
                                            <div className="flex items-center">
                                                <BarChart3 className="mr-2 h-4 w-4" />
                                                <span>
                                                    {
                                                        StudyLevelLabels[
                                                            study.level
                                                        ]
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                <span>{study.schedule}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>
                                                    {study.maxParticipants === 0
                                                        ? "제한 없음"
                                                        : `${study.participantCount}/${study.maxParticipants}명`}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>{study.instructor}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Badge
                                                variant="outline"
                                                className="border-gray-300 text-gray-600"
                                            >
                                                #
                                                {
                                                    StudyCategoryLabels[
                                                        study.category
                                                    ]
                                                }
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudyList;
