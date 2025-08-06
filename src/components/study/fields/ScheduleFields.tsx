import { Calendar } from "lucide-react";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudyFormContext } from "@/hooks/useStudyForm";

const ScheduleFields = () => {
    const {
        form: { control },
    } = useStudyFormContext();

    return (
        <Card className="border-gray-200">
            <CardHeader>
                <CardTitle className="font-semibold text-gray-900 text-lg">
                    일정 정보
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label
                        htmlFor="schedule"
                        className="font-medium text-gray-900 text-sm"
                    >
                        스터디 일정
                    </Label>
                    <div className="mt-1 flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                        <Controller
                            name="schedule"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="schedule"
                                    placeholder="예: 매주 화, 목 19:00-21:00"
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            )}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ScheduleFields;
