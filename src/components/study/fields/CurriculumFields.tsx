import type { FieldError } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { useStudyFormContext } from "@/hooks/useStudyForm";

const CurriculumFields = () => {
    const {
        form: { control, formState: { errors, isDirty } },
        curriculumFieldArray,
    } = useStudyFormContext();

    const {
        fields: curriculumFields,
        append: appendCurriculum,
        remove: removeCurriculum,
    } = curriculumFieldArray;

    return (
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
    );
};

export default CurriculumFields;