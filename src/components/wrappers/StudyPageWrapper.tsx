import { useNavigate, useParams } from "react-router-dom";

type StudyPageWrapperProps = {
    PageComponent: React.ComponentType<{ studyId: number; onBack: () => void }>;
};

function StudyPageWrapper({ PageComponent }: StudyPageWrapperProps) {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <PageComponent
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default StudyPageWrapper;
