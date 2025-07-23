import { useNavigate, useParams } from "react-router-dom";
import ApplicationStatus from "../ApplicationStatus";

function ApplicationStatusWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <ApplicationStatus
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default ApplicationStatusWrapper;
