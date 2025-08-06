import { useStudyFormContext } from "@/hooks/useStudyForm";
import BasicInfoFields from "./fields/BasicInfoFields";
import RecruitmentFields from "./fields/RecruitmentFields";
import ScheduleFields from "./fields/ScheduleFields";
import CurriculumFields from "./fields/CurriculumFields";
import RequirementsFields from "./fields/RequirementsFields";

const StudyFormFields = () => {
    useStudyFormContext();
    return (
        <>
            <BasicInfoFields />
            <RecruitmentFields />
            <ScheduleFields />
            <CurriculumFields />
            <RequirementsFields />
        </>
    );
};

export default StudyFormFields;
