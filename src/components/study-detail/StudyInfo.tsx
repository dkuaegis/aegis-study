import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { StudyRecruitmentMethod, type StudyDetail } from "@/types/study";

interface StudyInfoProps {
  study: StudyDetail;
}

export const StudyInfo = ({ study }: StudyInfoProps) => {
  const getRecruitmentMethodText = (method: StudyRecruitmentMethod) => {
    return method === StudyRecruitmentMethod.FCFS 
      ? "선착순 모집" 
      : "지원서 심사";
  };

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="font-semibold text-gray-900 text-lg">
          스터디 정보
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-medium text-gray-900 text-sm">
            스터디장
          </Label>
          <p className="mt-1 text-gray-700">{study.instructor}</p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div>
          <Label className="font-medium text-gray-900 text-sm">
            모집 방법
          </Label>
          <p className="mt-1 text-gray-700">
            {getRecruitmentMethodText(study.recruitmentMethod)}
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div>
          <Label className="font-medium text-gray-900 text-sm">
            제한 인원
          </Label>
          <p className="mt-1 text-gray-700">
            {study.participantCount}/{study.maxParticipants}명
          </p>
        </div>
        
        <Separator className="bg-gray-200" />
        
        <div>
          <Label className="font-medium text-gray-900 text-sm">일정</Label>
          <p className="mt-1 text-gray-700">{study.schedule}</p>
        </div>
        
        <Separator className="bg-gray-200" />
      </CardContent>
    </Card>
  );
};

export default StudyInfo;
