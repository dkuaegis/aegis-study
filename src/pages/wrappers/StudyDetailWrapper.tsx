import { useNavigate, useParams } from "react-router-dom";
import StudyDetailPage from "../StudyDetailPage";

export default function StudyDetailWrapper() {
    const { studyId } = useParams();
    const numericStudyId = Number(studyId);
    const navigate = useNavigate();

    // studyId가 유효하지 않은 경우 처리
    if (Number.isNaN(numericStudyId)) {
        return <div>유효하지 않은 스터디 ID입니다.</div>;
    }

    function handleBack() {
        navigate("/");
    }

    return (
        <StudyDetailPage
            studyId={numericStudyId}
            onBack={handleBack}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onViewApplications={(id) => navigate(`/applications/${id}`)}
            onViewMembers={(id) => navigate(`/members/${id}`)}
            onManageAttendance={(id) => navigate(`/attendance/${id}`)}
        />
    );
}
