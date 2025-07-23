import { useNavigate, useParams } from "react-router-dom";
import StudyMembers from "../StudyMembers";

function StudyMembersWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <StudyMembers
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default StudyMembersWrapper;
