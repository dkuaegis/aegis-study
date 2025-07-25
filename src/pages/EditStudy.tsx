import { ArrowLeft, Calendar, Plus, Users, X } from "lucide-react";
import { useEffect } from "react";
import type { FieldError } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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

export default function EditStudy({ studyId, onBack }: EditStudyProps) {
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
            const existingData = existingStudyData[studyId as keyof typeof existingStudyData];
            if (existingData) {
                reset({
                    title: existingData.title,
                    category: existingData.category,
                    difficulty: existingData.difficulty,
                    introduction: existingData.introduction,
                    recruitmentMethod: existingData.recruitmentMethod,
                    maxParticipants: existingData.maxParticipants,
                    schedule: existingData.schedule,
                    curriculum: existingData.curriculum.map((v) => ({ value: v })),
                    requirements: existingData.requirements.map((v) => ({ value: v })),
                });
            }
        };
        loadStudyData();
    }, [studyId, reset]);

    const onSubmit = async (data: FormValues) => {
        // 커리큘럼/자격 최소 1개 이상, 빈 값 제거
        const filteredCurriculum = data.curriculum.map((item) => item.value).filter((v) => v.trim() !== "");
        const filteredRequirements = data.requirements.map((item) => item.value).filter((v) => v.trim() !== "");

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
                    {/* 기본 정보 */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="font-semibold text-gray-900 text-lg">
                                기본 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="title"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    스터디명 *
                                </Label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{
                                        required: "스터디명을 입력하세요.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="title"
                                            placeholder="스터디 제목을 입력하세요"
                                            className={`mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.title && isDirty ? "border-red-500" : ""}`}
                                            aria-invalid={!!errors.title}
                                        />
                                    )}
                                />
                                {errors.title && (
                                    <span className="mt-1 block text-red-500 text-xs">
                                        {errors.title.message}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        카테고리 *
                                    </Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        rules={{
                                            required: "카테고리를 선택하세요.",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                aria-invalid={!!errors.category}
                                            >
                                                <SelectTrigger className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.category && isDirty ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="카테고리를 선택하세요" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem
                                                            key={category.value}
                                                            value={category.value}
                                                        >
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && (
                                        <span className="mt-1 block text-red-500 text-xs">
                                            {errors.category.message}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <Label className="font-medium text-gray-900 text-sm">
                                        난이도 *
                                    </Label>
                                    <Controller
                                        name="difficulty"
                                        control={control}
                                        rules={{
                                            required: "난이도를 선택하세요.",
                                        }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                aria-invalid={!!errors.difficulty}
                                            >
                                                <SelectTrigger className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.difficulty && isDirty ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="난이도를 선택하세요" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {difficulties.map((difficulty) => (
                                                        <SelectItem
                                                            key={difficulty.value}
                                                            value={difficulty.value}
                                                        >
                                                            {difficulty.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.difficulty && (
                                        <span className="mt-1 block text-red-500 text-xs">
                                            {errors.difficulty.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="introduction"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    스터디 소개 *
                                </Label>
                                <Controller
                                    name="introduction"
                                    control={control}
                                    rules={{
                                        required: "스터디 소개를 입력하세요.",
                                    }}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            id="introduction"
                                            placeholder="스터디에 대한 자세한 소개를 작성해주세요"
                                            className={`mt-1 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.introduction && isDirty ? "border-red-500" : ""}`}
                                            aria-invalid={!!errors.introduction}
                                        />
                                    )}
                                />
                                {errors.introduction && (
                                    <span className="mt-1 block text-red-500 text-xs">
                                        {errors.introduction.message}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* 모집 설정 */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="font-semibold text-gray-900 text-lg">
                                모집 설정
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="mb-3 block font-medium text-gray-900 text-sm">
                                    모집 방법
                                </Label>
                                <Controller
                                    name="recruitmentMethod"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            className="flex gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="선착순"
                                                    id="first-come"
                                                />
                                                <Label
                                                    htmlFor="first-come"
                                                    className="cursor-pointer text-gray-700 text-sm"
                                                >
                                                    선착순 모집
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="지원서"
                                                    id="application"
                                                />
                                                <Label
                                                    htmlFor="application"
                                                    className="cursor-pointer text-gray-700 text-sm"
                                                >
                                                    지원서 심사
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    )}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="maxParticipants"
                                    className="font-medium text-gray-900 text-sm"
                                >
                                    모집 인원
                                </Label>
                                <div className="mt-1 flex items-center">
                                    <Users className="mr-2 h-4 w-4 text-gray-400" />
                                    <Controller
                                        name="maxParticipants"
                                        control={control}
                                        rules={{
                                            required: "모집 인원을 입력하세요.",
                                            min: {
                                                value: 1,
                                                message: "최소 1명 이상 입력하세요.",
                                            },
                                            max: {
                                                value: 50,
                                                message: "최대 50명까지 입력 가능합니다.",
                                            },
                                            validate: (value) =>
                                                value !== "" ||
                                                "모집 인원을 입력하세요.",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="maxParticipants"
                                                type="number"
                                                placeholder="최대 인원수"
                                                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.maxParticipants && isDirty ? "border-red-500" : ""}`}
                                                min="1"
                                                max="50"
                                                aria-invalid={!!errors.maxParticipants}
                                            />
                                        )}
                                    />
                                    {errors.maxParticipants && (
                                        <span className="mt-1 block text-red-500 text-xs">
                                            {errors.maxParticipants.message}
                                        </span>
                                    )}
                                    <span className="ml-2 text-gray-500 text-sm">
                                        명
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 일정 정보 */}
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

                    {/* 커리큘럼 */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    커리큘럼
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendCurriculum({ value: "" })}
                                    className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    추가
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {curriculumFields.map((field, index: number) => (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-8 text-gray-500 text-sm">
                                        {index + 1}.
                                    </span>
                                    <Controller
                                        name={`curriculum.${index}.value`}
                                        control={control}
                                        rules={{
                                            required: "커리큘럼 내용을 입력하세요.",
                                            validate: (value: string) =>
                                                value.trim() !== "" ||
                                                "커리큘럼 내용을 입력하세요.",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder={`${index + 1}주차 내용을 입력하세요`}
                                                className={`flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.curriculum?.[index] && isDirty ? "border-red-500" : ""}`}
                                                aria-invalid={!!errors.curriculum?.[index]}
                                            />
                                        )}
                                    />
                                    {curriculumFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeCurriculum(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {errors.curriculum?.[index] && (
                                        <span className="ml-2 text-red-500 text-xs">
                                            {typeof errors.curriculum[index] === "object" &&
                                            errors.curriculum[index] !== null &&
                                            "message" in errors.curriculum[index] &&
                                            typeof (errors.curriculum[index] as FieldError).message === "string"
                                                ? (errors.curriculum[index] as FieldError).message
                                                : ""}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {errors.curriculum &&
                                typeof errors.curriculum.message === "string" && (
                                    <span className="mt-1 block text-red-500 text-xs">
                                        {errors.curriculum.message}
                                    </span>
                                )}
                        </CardContent>
                    </Card>

                    {/* 지원 자격 */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="font-semibold text-gray-900 text-lg">
                                    지원 자격
                                </CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendRequirement({ value: "" })}
                                    className="border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50"
                                >
                                    <Plus className="mr-1 h-4 w-4" />
                                    추가
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {requirementFields.map((field, index: number) => (
                                <div
                                    key={field.id}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-gray-500 text-sm">
                                        •
                                    </span>
                                    <Controller
                                        name={`requirements.${index}.value`}
                                        control={control}
                                        rules={{
                                            required: "지원 자격 조건을 입력하세요.",
                                            validate: (value: string) =>
                                                value.trim() !== "" ||
                                                "지원 자격 조건을 입력하세요.",
                                        }}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="지원 자격 조건을 입력하세요"
                                                className={`flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.requirements?.[index] && isDirty ? "border-red-500" : ""}`}
                                                aria-invalid={!!errors.requirements?.[index]}
                                            />
                                        )}
                                    />
                                    {requirementFields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRequirement(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {errors.requirements?.[index] && (
                                        <span className="ml-2 text-red-500 text-xs">
                                            {typeof errors.requirements[index] === "object" &&
                                            errors.requirements[index] !== null &&
                                            "message" in errors.requirements[index] &&
                                            typeof (errors.requirements[index] as FieldError).message === "string"
                                                ? (errors.requirements[index] as FieldError).message
                                                : ""}
                                        </span>
                                    )}
                                </div>
                            ))}
                            {errors.requirements &&
                                typeof errors.requirements.message === "string" && (
                                    <span className="mt-1 block text-red-500 text-xs">
                                        {errors.requirements.message}
                                    </span>
                                )}
                        </CardContent>
                    </Card>

                    {/* 버튼 */}
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
