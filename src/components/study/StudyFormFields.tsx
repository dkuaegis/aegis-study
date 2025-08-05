import { Calendar, Plus, Users, X } from "lucide-react";
import type { FieldError } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
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
import { useStudyFormContext } from "@/hooks/useStudyForm";

const MAX_PARTICIPANTS = 50;
const MIN_PARTICIPANTS = 1;

const StudyFormFields = () => {
    const {
        form: {
            control,
            formState: { errors, isDirty },
        },
        categories,
        difficulties,
        curriculumFieldArray,
        requirementFieldArray,
    } = useStudyFormContext();

    const {
        fields: curriculumFields,
        append: appendCurriculum,
        remove: removeCurriculum,
    } = curriculumFieldArray;
    const {
        fields: requirementFields,
        append: appendRequirement,
        remove: removeRequirement,
    } = requirementFieldArray;

    const maxParticipantsLimitType = useWatch({
        control,
        name: "maxParticipantsLimitType",
    });

    return (
        <>
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
                            rules={{ required: "스터디명을 입력하세요." }}
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
                                {(errors.title as FieldError).message}
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
                                rules={{ required: "카테고리를 선택하세요." }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        aria-invalid={!!errors.category}
                                    >
                                        <SelectTrigger
                                            className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.category && isDirty ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder="카테고리를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category: { value: string; label: string }) => (
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
                                    {(errors.category as FieldError).message}
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
                                rules={{ required: "난이도를 선택하세요." }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        aria-invalid={!!errors.difficulty}
                                    >
                                        <SelectTrigger
                                            className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.difficulty && isDirty ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder="난이도를 선택하세요" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {difficulties.map((difficulty: { value: string; label: string }) => (
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
                                    {(errors.difficulty as FieldError).message}
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
                            rules={{ required: "스터디 소개를 입력하세요." }}
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
                                {(errors.introduction as FieldError).message}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

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
                        <Label className="font-medium text-gray-900 text-sm">
                            모집 인원
                        </Label>
                        <Controller
                            name="maxParticipantsLimitType"
                            control={control}
                            defaultValue="unlimited"
                            render={({ field }) => (
                                <RadioGroup
                                    {...field}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="mt-1 flex gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="unlimited"
                                            id="unlimited"
                                        />
                                        <Label
                                            htmlFor="unlimited"
                                            className="cursor-pointer text-gray-700 text-sm"
                                        >
                                            제한 없음
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="limited"
                                            id="limited"
                                        />
                                        <Label
                                            htmlFor="limited"
                                            className="cursor-pointer text-gray-700 text-sm"
                                        >
                                            제한 있음
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        <Controller
                            name="maxParticipants"
                            control={control}
                            rules={{
                                validate: (value) => {
                                    if (maxParticipantsLimitType !== "limited")
                                        return true;
                                    const numValue = Number(value);
                                    if (
                                        !value ||
                                        Number.isNaN(numValue) ||
                                        !Number.isInteger(numValue) ||
                                        numValue < MIN_PARTICIPANTS ||
                                        numValue > MAX_PARTICIPANTS
                                    ) {
                                        return "1~50명 사이로 입력하세요.";
                                    }
                                    return true;
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    {maxParticipantsLimitType === "limited" && (
                                        <div className="mt-2 flex items-center">
                                            <Users className="mr-2 h-4 w-4 text-gray-400" />
                                            <Input
                                                {...field}
                                                id="maxParticipants"
                                                type="number"
                                                placeholder="최대 인원수"
                                                className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${fieldState.invalid && isDirty ? "border-red-500" : ""}`}
                                                min={MIN_PARTICIPANTS}
                                                max={MAX_PARTICIPANTS}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                            <span className="ml-2 text-gray-500 text-sm">
                                                명
                                            </span>
                                        </div>
                                    )}
                                    {fieldState.invalid && (
                                        <span className="mt-1 block text-red-500 text-xs">
                                            {fieldState.error?.message}
                                        </span>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </CardContent>
            </Card>

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
                    {curriculumFields.map((field: { id: string; value: string }, index: number) => (
                        <div key={field.id} className="flex items-center gap-2">
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
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        placeholder={
                                            "학습할 내용을 나열해주세요."
                                        }
                                        className={`flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.curriculum?.[index] && isDirty ? "border-red-500" : ""}`}
                                        aria-invalid={
                                            !!errors.curriculum?.[index]
                                        }
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
                                    {(errors.curriculum[index] as FieldError)
                                        ?.message ?? ""}
                                </span>
                            )}
                        </div>
                    ))}
                    {errors.curriculum &&
                        typeof (errors.curriculum as FieldError).message ===
                        "string" && (
                            <span className="mt-1 block text-red-500 text-xs">
                                {(errors.curriculum as FieldError).message}
                            </span>
                        )}
                </CardContent>
            </Card>

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
                    {requirementFields.map((field: { id: string; value: string }, index: number) => (
                        <div key={field.id} className="flex items-center gap-2">
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
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                        name={field.name}
                                        onBlur={field.onBlur}
                                        ref={field.ref}
                                        placeholder="지원 자격 조건을 입력하세요"
                                        className={`flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.requirements?.[index] && isDirty ? "border-red-500" : ""}`}
                                        aria-invalid={
                                            !!errors.requirements?.[index]
                                        }
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
                                    {(errors.requirements[index] as FieldError)
                                        ?.message ?? ""}
                                </span>
                            )}
                        </div>
                    ))}
                    {errors.requirements &&
                        typeof (errors.requirements as FieldError).message ===
                        "string" && (
                            <span className="mt-1 block text-red-500 text-xs">
                                {(errors.requirements as FieldError).message}
                            </span>
                        )}
                </CardContent>
            </Card>
        </>
    );
};

export default StudyFormFields;
