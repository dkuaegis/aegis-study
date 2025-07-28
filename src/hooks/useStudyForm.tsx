import type React from "react";
import { createContext, useContext } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import type { FieldValues, UseFormReturn, UseFieldArrayReturn } from "react-hook-form";

export interface CurriculumItem { value: string }
export interface RequirementItem { value: string }

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

const StudyFormContext = createContext<StudyFormContextProps | undefined>(undefined);

export const useStudyFormContext = () => {
  const ctx = useContext(StudyFormContext);
  if (!ctx) throw new Error("useStudyFormContext must be used within StudyFormProvider");
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

  const curriculumFieldArray = useFieldArray<FormValues, "curriculum">({
    control: form.control,
    name: "curriculum",
  });

  const requirementFieldArray = useFieldArray<FormValues, "requirements">({
    control: form.control,
    name: "requirements",
  });

  const onSubmit = async (data: FormValues) => {
    const filteredCurriculum = data.curriculum.map((item) => item.value).filter((v) => v.trim() !== "");
    const filteredRequirements = data.requirements.map((item) => item.value).filter((v) => v.trim() !== "");

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

    await new Promise((resolve) => setTimeout(resolve, 1500));


    if (onSuccess) {
      // FormValues 타입에 맞게 변환
      onSuccess({
        ...data,
        curriculum: filteredCurriculum.map((v) => ({ value: v })),
        requirements: filteredRequirements.map((v) => ({ value: v })),
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
  return <StudyFormContext.Provider value={value}>{children}</StudyFormContext.Provider>;
};