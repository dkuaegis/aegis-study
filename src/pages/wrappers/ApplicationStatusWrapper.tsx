import { useParams } from "react-router-dom";
import ApplicationStatus from "../ApplicationStatus";

function ApplicationStatusWrapper({ onBack }: { onBack: () => void }) {
    const { studyId } = useParams<{ studyId: string }>();

    return <ApplicationStatus studyId={Number(studyId)} onBack={onBack} />;
}

export default ApplicationStatusWrapper;
