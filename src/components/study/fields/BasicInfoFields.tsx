import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/ui/form-field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useStudyFormContext } from "@/hooks/useStudyForm";

const INTRODUCTION_MAX_LENGTH = 1000;
const TITLE_MAX_LENGTH = 30;

const BasicInfoFields = () => {
    const { difficulties, categories } = useStudyFormContext();

    return (
        <Card className="border-gray-200">
            <CardHeader>
                <CardTitle className="font-semibold text-gray-900 text-lg">
                    기본 정보
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    name="title"
                    label="스터디명"
                    required
                    rules={{
                        required: "스터디명을 입력하세요.",
                        maxLength: {
                            value: TITLE_MAX_LENGTH,
                            message: `스터디명은 ${TITLE_MAX_LENGTH}자 이내로 입력해주세요.`,
                        },
                    }}
                >
                    {(field, { hasError, isDirty }) => (
                        <Textarea
                            {...field}
                            maxLength={TITLE_MAX_LENGTH}
                            placeholder="스터디명을 입력하세요"
                            className={`mt-1 min-h-[40px] resize-y border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${hasError && isDirty ? "border-red-500" : ""}`}
                        />
                    )}
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        name="category"
                        label="카테고리"
                        required
                        rules={{ required: "카테고리를 선택하세요." }}
                    >
                        {(field, { hasError, isDirty }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                name={field.name}
                            >
                                <SelectTrigger
                                    ref={field.ref}
                                    id={field.id}
                                    onBlur={field.onBlur}
                                    aria-invalid={field["aria-invalid"]}
                                    aria-describedby={field["aria-describedby"]}
                                    className={`mt-1 border-gray-300 focus:border-blue-500 ${hasError && isDirty ? "border-red-500" : ""}`}
                                >
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
                    </FormField>
                    <FormField
                        name="difficulty"
                        label="난이도"
                        required
                        rules={{ required: "난이도를 선택하세요." }}
                    >
                        {(field, { hasError, isDirty }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                name={field.name}
                            >
                                <SelectTrigger
                                    ref={field.ref}
                                    id={field.id}
                                    onBlur={field.onBlur}
                                    aria-invalid={field["aria-invalid"]}
                                    aria-describedby={field["aria-describedby"]}
                                    className={`mt-1 border-gray-300 focus:border-blue-500 ${hasError && isDirty ? "border-red-500" : ""}`}
                                >
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
                    </FormField>
                </div>
                <FormField
                    name="introduction"
                    label="스터디 소개"
                    required
                    rules={{
                        required: "스터디 소개를 입력하세요.",
                        maxLength: {
                            value: INTRODUCTION_MAX_LENGTH,
                            message: `스터디 소개는 ${INTRODUCTION_MAX_LENGTH}자 이내로 입력해주세요.`,
                        },
                    }}
                >
                    {(field, { hasError, isDirty }) => (
                        <Textarea
                            {...field}
                            maxLength={INTRODUCTION_MAX_LENGTH}
                            placeholder="스터디에 대한 자세한 소개를 작성해주세요"
                            className={`mt-1 min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${hasError && isDirty ? "border-red-500" : ""}`}
                        />
                    )}
                </FormField>
            </CardContent>
        </Card>
    );
};

export default BasicInfoFields;
