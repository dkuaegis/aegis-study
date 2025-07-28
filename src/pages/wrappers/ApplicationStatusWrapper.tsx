import { useNavigate, useParams } from "react-router-dom";
import ApplicationStatusPage from "../ApplicationStatusPage";

function ApplicationStatusWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <ApplicationStatusPage
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default ApplicationStatusWrapper;
