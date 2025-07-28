import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { StudyFormFields } from "@/components/study/StudyFormFields";
import { Button } from "@/components/ui/button";

interface EditStudyProps {
    studyId: number;
    onBack: () => void;
}

const existingStudyData = {
    1: {
        title: "Spring과 함께 백엔드 개발자 되기",
        category: "WEB",
        difficulty: "중급",
        introduction: `Spring Framework를 활용한 백엔드 개발 스터디입니다. 
실무에서 사용되는 Spring Boot, Spring Security, JPA 등을 학습하며 
실제 프로젝트를 통해 백엔드 개발 역량을 키워나갑니다.

초보자도 참여할 수 있도록 기초부터 차근차근 진행하며, 
팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.`,
        recruitmentMethod: "지원서",
        maxParticipants: "20",
        schedule: "매주 화, 목 19:00-21:00",
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
    },
};

interface FormValues {
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

export default function EditStudyPage({ studyId, onBack }: EditStudyProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, isSubmitting },
        setError,
        reset,
    } = useForm<FormValues>({
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

    // 기존 데이터 로딩
    useEffect(() => {
        const loadStudyData = async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            const existingData =
                existingStudyData[studyId as keyof typeof existingStudyData];
            if (existingData) {
                reset({
                    title: existingData.title,
                    category: existingData.category,
                    difficulty: existingData.difficulty,
                    introduction: existingData.introduction,
                    recruitmentMethod: existingData.recruitmentMethod,
                    maxParticipants: existingData.maxParticipants,
                    schedule: existingData.schedule,
                    curriculum: existingData.curriculum.map((v) => ({
                        value: v,
                    })),
                    requirements: existingData.requirements.map((v) => ({
                        value: v,
                    })),
                });
            }
        };
        loadStudyData();
    }, [studyId, reset]);

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

        console.log("수정된 스터디:", studyData);
        alert("스터디가 성공적으로 수정되었습니다!");
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
                        스터디 수정하기
                    </h1>
                    <p className="text-gray-600">
                        스터디 정보를 수정하고 업데이트하세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <StudyFormFields
                        control={control}
                        errors={errors}
                        isDirty={isDirty}
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
                            {isSubmitting ? "수정 중..." : "수정 완료"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
