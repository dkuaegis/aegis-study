import { BarChart3, Clock, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchStudies } from "@/lib/studyListApi";
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
    const [studies, setStudies] = useState<StudyListItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStudies = async () => {
            try {
                const data = await fetchStudies();
                setStudies(data);
            } catch (error) {
                console.error("Failed to fetch studies:", error);
            } finally {
                setLoading(false);
            }
        };

        getStudies();
    }, []);
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 ">
            <Header title="스터디 목록" />
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
                    {loading ? (
                        <div className="col-span-full flex items-center justify-center py-8">
                            <div className="text-gray-500">로딩 중...</div>
                        </div>
                    ) : (
                        studies.map((study) => (
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
