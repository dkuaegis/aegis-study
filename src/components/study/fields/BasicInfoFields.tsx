import type { FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudyFormContext } from "@/hooks/useStudyForm";

const BasicInfoFields = () => {
    const {
        form: {
            control,
            formState: { errors, dirtyFields },
        },
        categories,
        difficulties,
    } = useStudyFormContext();

    return (
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
                            <Textarea
                                {...field}
                                id="title"
                                placeholder="스터디 제목을 입력하세요"
                                className={`mt-1 min-h-[40px] resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.title && dirtyFields.title ? "border-red-500" : ""}`}
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
                <div className="grid grid-cols-2 gap-4">
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
                                        className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.category && dirtyFields.category ? "border-red-500" : ""}`}
                                    >
                                        <SelectValue placeholder="카테고리를 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(
                                            (category: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <SelectItem
                                                    key={category.value}
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </SelectItem>
                                            )
                                        )}
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
                                        className={`mt-1 border-gray-300 focus:border-blue-500 ${errors.difficulty && dirtyFields.difficulty ? "border-red-500" : ""}`}
                                    >
                                        <SelectValue placeholder="난이도를 선택하세요" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {difficulties.map(
                                            (difficulty: {
                                                value: string;
                                                label: string;
                                            }) => (
                                                <SelectItem
                                                    key={difficulty.value}
                                                    value={difficulty.value}
                                                >
                                                    {difficulty.label}
                                                </SelectItem>
                                            )
                                        )}
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
                                className={`mt-1 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${errors.introduction && dirtyFields.introduction ? "border-red-500" : ""}`}
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
    );
};

export default BasicInfoFields;
