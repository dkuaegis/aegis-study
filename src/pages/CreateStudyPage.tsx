import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StudyFormContent from "@/components/study/StudyFormContent";
import { Button } from "@/components/ui/button";
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
            <header className="border-gray-200 border-b bg-white px-6 py-4">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        뒤로가기
                    </Button>
                    <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-xl">
                            스터디 개설하기
                        </span>
                    </div>
                </div>
            </header>

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
