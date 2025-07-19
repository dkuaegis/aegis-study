import { useNavigate, useParams } from "react-router-dom";
import EditStudy from "../EditStudy";

function EditStudyWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <EditStudy
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default EditStudyWrapper;
