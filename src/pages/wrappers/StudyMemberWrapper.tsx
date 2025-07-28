import { useNavigate, useParams } from "react-router-dom";
import StudyMembersPage from "../StudyMembersPage";

function StudyMembersWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <StudyMembersPage
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default StudyMembersWrapper;
