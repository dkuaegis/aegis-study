import { useParams } from "react-router-dom";
import StudyMembers from "../StudyMembers";

function StudyMembersWrapper({ onBack }: { onBack: () => void }) {
    const { studyId } = useParams<{ studyId: string }>();

    return <StudyMembers studyId={Number(studyId)} onBack={onBack} />;
}

export default StudyMembersWrapper;
