import { useNavigate } from "react-router-dom";
import StudyFormContent from "@/components/study/StudyFormContent";
import Header from "@/components/ui/Header";
import { StudyFormProvider } from "@/hooks/useStudyForm";

const CreateStudyPage = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    const handleSuccess = () => {
        alert("스터디가 성공적으로 개설되었습니다!");
        handleBack();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="스터디 개설하기" onBack={handleBack} />

            <div className="mx-auto max-w-4xl p-6">
                <StudyFormProvider onSuccess={handleSuccess}>
                    <StudyFormContent
                        onCancel={handleBack}
                        submitText="스터디 개설하기"
                        submittingText="개설 중..."
                    />
                </StudyFormProvider>
            </div>
        </div>
    );
};

export default CreateStudyPage;
