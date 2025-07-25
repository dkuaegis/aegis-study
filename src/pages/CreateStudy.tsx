import { ArrowLeft } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { StudyFormFields } from "@/components/study/StudyFormFields";
import { Button } from "@/components/ui/button";

interface CreateStudyProps {
    onBack: () => void;
}

import type { FieldValues } from "react-hook-form";

interface FormValues extends FieldValues {
    title: string;
    category: string;
    difficulty: string;
    introduction: string;
    recruitmentMethod: string;
    maxParticipants: string;
    schedule: string;
    curriculum: { value: string }[];
    requirements: { value: string }[];
}

export default function CreateStudy({ onBack }: CreateStudyProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({
        defaultValues: {
            title: "",
            category: "",
            difficulty: "",
            introduction: "",
            recruitmentMethod: "선착순",
            maxParticipants: "",
            schedule: "",
            curriculum: [{ value: "" }],
            requirements: [{ value: "" }],
        },
        mode: "onBlur",
    });

    const categories = [
        { value: "WEB", label: "웹 개발" },
        { value: "MOBILE", label: "모바일" },
        { value: "AI", label: "AI/ML" },
        { value: "DATA", label: "데이터" },
        { value: "BACKEND", label: "백엔드" },
        { value: "FRONTEND", label: "프론트엔드" },
        { value: "DEVOPS", label: "DevOps" },
        { value: "DESIGN", label: "디자인" },
    ];

    const difficulties = [
        { value: "입문", label: "입문" },
        { value: "초급", label: "초급" },
        { value: "중급 이상", label: "중급 이상" },
    ];

    const {
        fields: curriculumFields,
        append: appendCurriculum,
        remove: removeCurriculum,
    } = useFieldArray<FormValues, "curriculum">({
        control,
        name: "curriculum",
    });

    const {
        fields: requirementFields,
        append: appendRequirement,
        remove: removeRequirement,
    } = useFieldArray<FormValues, "requirements">({
        control,
        name: "requirements",
    });

    const onSubmit = async (data: FormValues) => {
        // 커리큘럼/자격 최소 1개 이상, 빈 값 제거
        const filteredCurriculum = data.curriculum
            .map((item) => item.value)
            .filter((v) => v.trim() !== "");
        const filteredRequirements = data.requirements
            .map((item) => item.value)
            .filter((v) => v.trim() !== "");

        let hasError = false;
        if (filteredCurriculum.length === 0) {
            setError("curriculum", {
                type: "manual",
                message: "커리큘럼을 1개 이상 입력하세요.",
            });
            hasError = true;
        }
        if (filteredRequirements.length === 0) {
            setError("requirements", {
                type: "manual",
                message: "지원 자격을 1개 이상 입력하세요.",
            });
            hasError = true;
        }
        if (hasError) return;

        await new Promise((resolve) => setTimeout(resolve, 1500));

        const studyData = {
            ...data,
            curriculum: filteredCurriculum,
            requirements: filteredRequirements,
        };

        console.log("생성된 스터디:", studyData);
        alert("스터디가 성공적으로 개설되었습니다!");
        onBack();
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
                <div className="mb-6">
                    <h1 className="mb-2 font-bold text-3xl text-gray-900">
                        스터디 개설하기
                    </h1>
                    <p className="text-gray-600">
                        새로운 스터디를 개설하고 함께 공부할 멤버들을
                        모집해보세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <StudyFormFields
                        control={control}
                        errors={errors}
                        categories={categories}
                        difficulties={difficulties}
                        curriculumFields={curriculumFields}
                        appendCurriculum={appendCurriculum}
                        removeCurriculum={removeCurriculum}
                        requirementFields={requirementFields}
                        appendRequirement={appendRequirement}
                        removeRequirement={removeRequirement}
                        isSubmitting={isSubmitting}
                    />
                    <div className="flex justify-end gap-3 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onBack}
                            className="border-gray-300 bg-transparent text-gray-700"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {isSubmitting ? "개설 중..." : "스터디 개설하기"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
