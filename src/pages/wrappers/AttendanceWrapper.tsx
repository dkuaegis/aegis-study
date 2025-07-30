import { useNavigate, useParams } from "react-router-dom";
import AttendancePage from "../AttendancePage";

function AttendanceWrapper() {
    const { studyId } = useParams<{ studyId: string }>();
    const navigate = useNavigate();

    return (
        <AttendancePage
            studyId={Number(studyId)}
            onBack={() => navigate(`/detail/${studyId}`)}
        />
    );
}

export default AttendanceWrapper;
