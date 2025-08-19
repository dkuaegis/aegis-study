import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudyDetail } from "@/types/study";

interface StudyContentProps {
    study: StudyDetail;
}

export const StudyContent = ({ study }: StudyContentProps) => {
    return (
        <div className="space-y-6 lg:col-span-2">
            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="font-semibold text-gray-900 text-lg">
                        스터디 소개
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {study.description}
                    </p>
                </CardContent>
            </Card>

            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="font-semibold text-gray-900 text-lg">
                        커리큘럼
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {study.curricula
                            .split("\n")
                            .filter((item) => item.trim() !== "")
                            .map((item: string) => (
                                <div
                                    key={item.substring(0, 20)}
                                    className="flex items-start"
                                >
                                    <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-blue-600" />
                                    <span className="text-gray-700">{item}</span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200">
                <CardHeader>
                    <CardTitle className="font-semibold text-gray-900 text-lg">
                        지원 자격
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {study.qualifications
                            .split("\n")
                            .filter((qualification) => qualification.trim() !== "")
                            .map((qualification: string) => (
                                <div
                                    key={qualification.substring(0, 20)}
                                    className="flex items-start"
                                >
                                    <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400" />
                                    <span className="text-gray-700">
                                        {qualification}
                                    </span>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudyContent;
