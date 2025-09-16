import Lottie from "lottie-react";
import meditateData from "@/assets/Meditate girl.json";
import Header from "@/components/ui/Header";

interface ForbiddenPageProps {
    title: string;
    message?: string;
    onBack?: (() => void) | undefined;
}

const ForbiddenPage = ({
    title,
    message = "권한이 없습니다.",
    onBack,
}: ForbiddenPageProps) => {
    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            <Header title={title} onBack={onBack} />
            <div className="flex flex-1 items-center justify-center px-6">
                <div className="mx-auto max-w-md text-center">
                    <div className="mb-8">
                        <Lottie
                            loop
                            autoplay
                            animationData={meditateData}
                            style={{ width: 300, height: 300 }}
                        />
                    </div>
                    <p className="font-medium text-gray-600 text-xl">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForbiddenPage;
