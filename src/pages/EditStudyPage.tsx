import StudyFormContent from "@/components/study/StudyFormContent";
import Header from "@/components/ui/Header";
import { StudyFormProvider } from "@/hooks/useStudyForm";

interface EditStudyProps {
    studyId: number;
    onBack: () => void;
}

const existingStudyData = {
    1: {
        title: "Spring과 함께 백엔드 개발자 되기",
        category: "WEB",
        difficulty: "중급",
        introduction: `Spring Framework를 활용한 백엔드 개발 스터디입니다. 
실무에서 사용되는 Spring Boot, Spring Security, JPA 등을 학습하며 
실제 프로젝트를 통해 백엔드 개발 역량을 키워나갑니다.

초보자도 참여할 수 있도록 기초부터 차근차근 진행하며, 
팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.`,
        recruitmentMethod: "지원서",
        maxParticipants: "20",
        schedule: "매주 화, 목 19:00-21:00",
        curriculum: [
            "1주차: Spring Boot 기초 및 환경 설정",
            "2주차: Spring MVC 패턴과 REST API",
            "3주차: 데이터베이스 연동 (JPA, Hibernate)",
            "4주차: Spring Security 인증/인가",
            "5주차: 테스트 코드 작성 (JUnit, Mockito)",
            "6주차: 팀 프로젝트 기획 및 설계",
            "7주차: 팀 프로젝트 개발",
            "8주차: 프로젝트 발표 및 코드 리뷰",
        ],
        requirements: [
            "Java 기초 문법을 알고 있는 분",
            "객체지향 프로그래밍에 대한 기본 이해",
            "데이터베이스 기초 지식 (SQL)",
            "Git 사용 경험 (기초 수준)",
            "매주 정기 모임 참석 가능한 분",
        ],
    },
};

const EditStudyPage = ({ studyId, onBack }: EditStudyProps) => {
    const existingData =
        existingStudyData[studyId as keyof typeof existingStudyData];
    const initialValues = existingData
        ? {
              ...existingData,
              curriculum: existingData.curriculum.map((v) => ({ value: v })),
              requirements: existingData.requirements.map((v) => ({
                  value: v,
              })),
          }
        : undefined;

    const handleSuccess = () => {
        alert("스터디가 성공적으로 수정되었습니다!");
        onBack();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="스터디 수정하기" onBack={onBack} />

            <div className="mx-auto max-w-4xl p-6">
                <StudyFormProvider
                    initialValues={initialValues}
                    onSuccess={handleSuccess}
                >
                    <StudyFormContent
                        onCancel={onBack}
                        submitText="수정 완료"
                        submittingText="수정 중..."
                    />
                </StudyFormProvider>
            </div>
        </div>
    );
};

export default EditStudyPage;
