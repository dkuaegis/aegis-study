import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApplicationState } from "@/types/application";
import { type StudyDetail, StudyRecruitmentMethod } from "@/types/study";
import {
  getApplicationSectionTitle,
  isStudyRecruiting,
} from "@/utils/studyStatusHelpers";
import ApplicationForm from "./ApplicationForm";
import ApprovedApplicationStatus from "./ApprovedApplicationStatus";
import FirstComeForm from "./FirstComeForm";
import PendingApplicationStatus from "./PendingApplicationStatus";
import RejectedApplicationStatus from "./RejectedApplicationStatus";

interface ApplicationSectionProps {
  study: StudyDetail;
  isOwner?: boolean;
  isMember?: boolean;
  applicationState: ApplicationState;
}

export const ApplicationSection = ({
  study,
  isOwner = false,
  isMember = false,
  applicationState,
}: ApplicationSectionProps) => {
  const {
    isApplying,
    isApplicationModalOpen,
    userApplicationStatus,
    setIsApplicationModalOpen,
    handleApply,
  } = applicationState;

  if (isOwner) {
    return null;
  }

  const cardTitle = getApplicationSectionTitle(
    userApplicationStatus,
    study.recruitmentMethod,
  );

  const renderApplicationForm = () => {
    if (study.recruitmentMethod === StudyRecruitmentMethod.APPLICATION) {
      return (
        <ApplicationForm
          isApplying={isApplying}
          isApplicationModalOpen={isApplicationModalOpen}
          applicationText={applicationState.applicationText}
          setIsApplicationModalOpen={setIsApplicationModalOpen}
          handleApply={handleApply}
          setApplicationText={applicationState.setApplicationText}
        />
      );
    } else {
      const recruiting = isStudyRecruiting(study);
      return (
        <FirstComeForm
          isApplying={isApplying}
          recruiting={recruiting}
          handleApply={handleApply}
        />
      );
    }
  };

  const renderContent = () => {
    if (isMember) {
      return <ApprovedApplicationStatus />;
    }
    switch (userApplicationStatus) {
      case "PENDING":
        return (
          <PendingApplicationStatus
            study={study}
            isApplying={isApplying}
            isApplicationModalOpen={isApplicationModalOpen}
            isLoadingApplicationDetail={
              applicationState.isLoadingApplicationDetail ?? false
            }
            editingApplicationText={applicationState.editingApplicationText}
            setIsApplicationModalOpen={setIsApplicationModalOpen}
            handleEditApplication={applicationState.handleEditApplication}
            handleUpdateApplication={applicationState.handleUpdateApplication}
            setEditingApplicationText={
              applicationState.setEditingApplicationText
            }
          />
        );
      case "REJECTED":
        return <RejectedApplicationStatus />;
      default:
        return renderApplicationForm();
    }
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          {cardTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{renderContent()}</CardContent>
    </Card>
  );
};

export default ApplicationSection;
