import type React from "react";
import { createContext, useContext } from "react";
import {
    StudyCategory,
    StudyLevel,
    type StudyRecruitmentMethod,
    StudyCategoryLabels,
    StudyLevelLabels,
} from "@/types/study";
import type {
    FieldValues,
    UseFieldArrayReturn,
    UseFormReturn,
} from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";

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
    recruitmentMethod: string;
    maxParticipants: string;
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
    onSubmit: (data: FormValues) => Promise<void>;
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
    onSuccess?: (data: FormValues) => void
) => {
    const form = useForm<FormValues>({
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

    const onSubmit = async (data: FormValues) => {
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

        const payload = {
            title: data.title,
            category: data.category as StudyCategory ?? "ETC",
            level: data.difficulty as StudyLevel ?? "BASIC",
            description: data.introduction,
            recruitmentMethod: data.recruitmentMethod as StudyRecruitmentMethod ?? "FCFS",
            maxParticipants: data.maxParticipants ? Number(data.maxParticipants) : null,
            schedule: data.schedule,
            curricula: filteredCurriculum,
            qualifications: filteredRequirements,
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/studies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error("스터디 개설 실패");
            }
            if (onSuccess) {
                onSuccess(data);
            }
        } catch (err) {
            console.error(err);
            form.setError("title", {
                type: "manual",
                message: "스터디 개설 중 오류가 발생했습니다.",
            });
        }
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
}> = ({ children, initialValues, onSuccess }) => {
    const value = useStudyForm(initialValues, onSuccess);
    return (
        <StudyFormContext.Provider value={value}>
            {children}
        </StudyFormContext.Provider>
    );
};
