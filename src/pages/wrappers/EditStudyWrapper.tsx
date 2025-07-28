import { useNavigate, useParams } from "react-router-dom";
import EditStudyPage from "../EditStudyPage";

function EditStudyWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <EditStudyPage
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default EditStudyWrapper;
