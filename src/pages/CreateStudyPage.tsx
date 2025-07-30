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
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-black">
                            <img
                                src="/aegis-logo-2500w-opti.png"
                                alt="Aegis Logo"
                                width={56}
                                height={56}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold text-gray-900 text-xl">
                            Aegis
                        </span>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-4xl p-6">
                <div className="mb-6">
                    <h1 className="mb-2 font-bold text-3xl text-gray-900">
                        스터디 개설하기
                    </h1>
                    <p className="text-gray-600">
                        새로운 스터디를 개설하고 함께 공부할 멤버들을
                        모집해보세요.
                    </p>
                </div>

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
