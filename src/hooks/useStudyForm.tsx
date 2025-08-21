import type React from "react";
import { createContext, useContext } from "react";
import type {
    FieldValues,
    UseFieldArrayReturn,
    UseFormReturn,
} from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { useCreateStudyMutation } from "@/api/createStudyApi";
import {
    StudyCategory,
    StudyCategoryLabels,
    StudyLevel,
    StudyLevelLabels,
    StudyRecruitmentMethod,
} from "@/types/study";

export interface CurriculumItem {
    value: string;
}
export interface RequirementItem {
    value: string;
}
export interface FormValues extends FieldValues {
    title: string;
    category: string;
    difficulty: string;
    introduction: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: string;
    maxParticipantsLimitType?: string;
    schedule: string;
    curriculum: CurriculumItem[];
    requirements: RequirementItem[];
}

interface StudyFormContextProps {
    form: UseFormReturn<FormValues>;
    curriculumFieldArray: UseFieldArrayReturn<FormValues, "curriculum">;
    requirementFieldArray: UseFieldArrayReturn<FormValues, "requirements">;
    categories: { value: string; label: string }[];
    difficulties: { value: string; label: string }[];
    onSubmit: (data: FormValues) => void;
    setError: UseFormReturn<FormValues>["setError"];
}

const StudyFormContext = createContext<StudyFormContextProps | undefined>(
    undefined
);

export const useStudyFormContext = () => {
    const ctx = useContext(StudyFormContext);
    if (!ctx)
        throw new Error(
            "useStudyFormContext must be used within StudyFormProvider"
        );
    return ctx;
};

export const useStudyForm = (
    initialValues?: Partial<FormValues>,
    onSuccess?: (data: FormValues) => void,
    isEditMode?: boolean
) => {
    const form = useForm<FormValues>({
        defaultValues: {
            title: "",
            category: "",
            difficulty: "",
            introduction: "",
            recruitmentMethod: StudyRecruitmentMethod.FCFS,
            maxParticipants: "",
            schedule: "",
            curriculum: [{ value: "" }],
            requirements: [{ value: "" }],
            ...initialValues,
        },
        mode: "onBlur",
    });

    const categories = Object.values(StudyCategory).map((value) => ({
        value,
        label: StudyCategoryLabels[value],
    }));

    const difficulties = Object.values(StudyLevel).map((value) => ({
        value,
        label: StudyLevelLabels[value],
    }));

    const curriculumFieldArray = useFieldArray<FormValues, "curriculum">({
        control: form.control,
        name: "curriculum",
    });

    const requirementFieldArray = useFieldArray<FormValues, "requirements">({
        control: form.control,
        name: "requirements",
    });

    const mutation = useCreateStudyMutation(
        (res: unknown) => {
            if (onSuccess) onSuccess(res as FormValues);
        },
        (_err: unknown) => {
            form.setError("title", {
                type: "manual",
                message: "스터디 개설 중 오류가 발생했습니다.",
            });
        }
    );

    const onSubmit = (data: FormValues) => {
        const filteredCurriculum = data.curriculum
            .map((item) => item.value)
            .filter((v) => v.trim() !== "");
        const filteredRequirements = data.requirements
            .map((item) => item.value)
            .filter((v) => v.trim() !== "");

        let hasError = false;
        if (filteredCurriculum.length === 0) {
            form.setError("curriculum", {
                type: "manual",
                message: "커리큘럼을 1개 이상 입력하세요.",
            });
            hasError = true;
        }
        if (filteredRequirements.length === 0) {
            form.setError("requirements", {
                type: "manual",
                message: "지원 자격을 1개 이상 입력하세요.",
            });
            hasError = true;
        }
        if (hasError) return;

        if (isEditMode && onSuccess) {
            onSuccess({
                ...data,
                curriculum: filteredCurriculum.map((v) => ({ value: v })),
                requirements: filteredRequirements.map((v) => ({ value: v })),
            });
            return;
        }

        const payload = {
            title: data.title,
            category: Object.values(StudyCategory).includes(
                data.category as StudyCategory
            )
                ? (data.category as StudyCategory)
                : StudyCategory.ETC,
            level: Object.values(StudyLevel).includes(
                data.difficulty as StudyLevel
            )
                ? (data.difficulty as StudyLevel)
                : StudyLevel.BASIC,
            description: data.introduction,
            recruitmentMethod: Object.values(StudyRecruitmentMethod).includes(
                data.recruitmentMethod as StudyRecruitmentMethod
            )
                ? (data.recruitmentMethod as StudyRecruitmentMethod)
                : ("FCFS" as StudyRecruitmentMethod),
            maxParticipants:
                data.maxParticipantsLimitType === "unlimited"
                    ? 0
                    : data.maxParticipants
                      ? Number(data.maxParticipants)
                      : null,
            schedule: data.schedule,
            curricula: filteredCurriculum.join("\n"),
            qualifications: filteredRequirements.join("\n"),
        };

        mutation.mutate(payload);
    };

    return {
        form,
        curriculumFieldArray,
        requirementFieldArray,
        categories,
        difficulties,
        onSubmit,
        setError: form.setError,
    };
};

export const StudyFormProvider: React.FC<{
    children: React.ReactNode;
    initialValues?: Partial<FormValues>;
    onSuccess?: (data: FormValues) => void;
    isEditMode?: boolean;
}> = ({ children, initialValues, onSuccess, isEditMode = false }) => {
    const value = useStudyForm(initialValues, onSuccess, isEditMode);
    return (
        <StudyFormContext.Provider value={value}>
            {children}
        </StudyFormContext.Provider>
    );
};
