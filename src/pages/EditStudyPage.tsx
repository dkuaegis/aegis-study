import StudyFormContent from "@/components/study/StudyFormContent";
import Header from "@/components/ui/Header";
import { useToast } from "@/components/ui/useToast";
import { StudyFormProvider } from "@/hooks/useStudyForm";
import { type StudyFormData, useUpdateStudyMutation } from "@/lib/editStudyApi";
import { useStudyDetailQuery } from "@/lib/studyDetailApi";
import type { StudyRecruitmentMethod } from "@/types/study";

interface EditStudyProps {
    studyId: number;
    onBack: () => void;
}

interface FormValues {
    title: string;
    category: string;
    difficulty: string;
    introduction: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: string;
    maxParticipantsLimitType?: string;
    schedule: string;
    curriculum: { value: string }[];
    requirements: { value: string }[];
}

const EditStudyPage = ({ studyId, onBack }: EditStudyProps) => {
    const toast = useToast();

    const { data: study, isLoading, isError } = useStudyDetailQuery(studyId);

    const mapFormValuesToStudyData = (
        formValues: FormValues
    ): StudyFormData => {
        return {
            title: formValues.title,
            category: formValues.category,
            difficulty: formValues.difficulty,
            introduction: formValues.introduction,
            recruitmentMethod: formValues.recruitmentMethod,
            maxParticipants: formValues.maxParticipants,
            schedule: formValues.schedule,
            curriculum: formValues.curriculum,
            requirements: formValues.requirements,
        };
    };

    const handleSuccess = () => {
        toast({ description: "스터디가 성공적으로 수정되었습니다!" });
        onBack();
    };

    const handleError = () => {
        toast({
            description: "스터디 수정 중 오류가 발생했습니다.",
        });
    };

    const updateMutation = useUpdateStudyMutation(
        studyId,
        handleSuccess,
        handleError
    );

    const handleUpdate = (formValues: FormValues) => {
        const payload: StudyFormData = mapFormValuesToStudyData(formValues);
        updateMutation.mutate(payload);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="스터디 수정하기" onBack={onBack} />
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-gray-500">
                        스터디 정보를 불러오는 중...
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !study) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header title="스터디 수정하기" onBack={onBack} />
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-red-500">
                        스터디 정보를 불러올 수 없습니다.
                    </div>
                </div>
            </div>
        );
    }

    const initialValues: FormValues = {
        title: study.title,
        category: study.category,
        difficulty: study.level,
        introduction: study.description,
        recruitmentMethod: study.recruitmentMethod,
        maxParticipants: study.maxParticipants.toString(),
        maxParticipantsLimitType:
            study.maxParticipants === 0 ? "unlimited" : "limited",
        schedule: study.schedule,
        curriculum: study.curricula
            .split(/\r?\n/)
            .filter((v) => v.trim() !== "")
            .map((v) => ({ value: v })),
        requirements: study.qualifications
            .split(/\r?\n/)
            .filter((v) => v.trim() !== "")
            .map((v) => ({ value: v })),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="스터디 수정하기" onBack={onBack} />

            <div className="mx-auto max-w-4xl p-6">
                <StudyFormProvider
                    initialValues={initialValues}
                    onSuccess={handleUpdate}
                    isEditMode={true}
                >
                    <StudyFormContent
                        onCancel={onBack}
                        submitText="수정 완료"
                        submittingText="수정 중..."
                    />
                </StudyFormProvider>
            </div>
        </div>
    );
};

export default EditStudyPage;
