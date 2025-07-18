import { useParams } from "react-router-dom";
import EditStudy from "../EditStudy";

function EditStudyWrapper({ onBack }: { onBack: () => void }) {
    const { studyId } = useParams<{ studyId: string }>();

    return (
        <EditStudy
            studyId={Number(studyId)}
            onBack={onBack}
        />
    );
}

export default EditStudyWrapper;
