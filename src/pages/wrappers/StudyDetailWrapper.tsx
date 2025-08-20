import { useNavigate, useParams } from "react-router-dom";
import { StudyRecruitmentMethod } from "@/types/study";
import StudyDetailPage from "../StudyDetailPage";

interface Study {
    id: number;
    title: string;
    status: string;
    category: string;
    difficulty: string;
    participants: string;
    manager: string;
    recruitmentMethod: StudyRecruitmentMethod;
    maxParticipants: number;
    currentParticipants: number;
    schedule: string;
    introduction: string;
    curriculum: string[];
    requirements: string[];
    ownerId: string;
}

const studyDetailData: Record<number, Study> = {
    1: {
        id: 1,
        title: "Spring과 함께 백엔드 개발자 되기",
        status: "모집중",
        category: "WEB",
        difficulty: "중급",
        participants: "10/20명",
        manager: "관리자",
        recruitmentMethod: StudyRecruitmentMethod.APPLICATION, // "선착순" or "지원서"
        maxParticipants: 20,
        currentParticipants: 10,
        schedule: "매주 화, 목 19:00-21:00",
        introduction: `Spring Framework를 활용한 백엔드 개발 스터디입니다.
    실무에서 사용되는 Spring Boot, Spring Security, JPA 등을 학습하며
    실제 프로젝트를 통해 백엔드 개발 역량을 키워나갑니다.
    
    초보자도 참여할 수 있도록 기초부터 차근차근 진행하며,
    팀 프로젝트를 통해 협업 경험도 쌓을 수 있습니다.`,
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
        ownerId: "user123",
    },
    2: {
        id: 2,
        title: "React 입문",
        status: "모집중",
        category: "WEB",
        difficulty: "입문",
        participants: "10/20명",
        manager: "관리자",
        recruitmentMethod: StudyRecruitmentMethod.FCFS,
        maxParticipants: 20,
        currentParticipants: 10,
        schedule: "매주 토 14:00-17:00",
        introduction: `React를 처음 배우는 분들을 위한 입문 스터디입니다.
    JavaScript 기초부터 React의 핵심 개념까지 차근차근 학습합니다.
    
    실습 위주로 진행되며, 간단한 웹 애플리케이션을 만들어보면서
    React의 동작 원리를 이해할 수 있습니다.`,
        curriculum: [
            "1주차: JavaScript ES6+ 문법 복습",
            "2주차: React 기초 (JSX, 컴포넌트)",
            "3주차: State와 Props 이해하기",
            "4주차: 이벤트 처리와 조건부 렌더링",
            "5주차: React Hooks (useState, useEffect)",
            "6주차: 미니 프로젝트 (Todo App 만들기)",
        ],
        requirements: [
            "HTML, CSS 기초 지식",
            "JavaScript 기본 문법 이해",
            "프로그래밍 경험 (언어 무관)",
            "학습 의지가 강한 분",
        ],
        ownerId: "user124",
    },
    3: {
        id: 3,
        title: "Python 데이터 분석",
        status: "진행중",
        category: "DATA",
        difficulty: "중급",
        participants: "15/20명",
        manager: "관리자",
        recruitmentMethod: StudyRecruitmentMethod.APPLICATION,
        maxParticipants: 20,
        currentParticipants: 15,
        schedule: "주 2회",
        introduction: `Python과 데이터 분석 라이브러리(Pandas, Numpy 등)를 활용한 데이터 분석 실습 중심 스터디입니다.
실제 데이터셋을 다루며 데이터 전처리, 시각화, 통계 분석, 간단한 머신러닝까지 경험할 수 있습니다.`,
        curriculum: [
            "1주차: Python 데이터 분석 환경 구축",
            "2주차: Pandas 기초와 데이터 다루기",
            "3주차: 데이터 시각화(Matplotlib, Seaborn)",
            "4주차: 통계 분석 기초",
            "5주차: 머신러닝 개요 및 실습",
            "6주차: 프로젝트 실습",
        ],
        requirements: [
            "Python 기초 문법 이해",
            "데이터 분석에 관심 있는 분",
            "노트북 지참 가능자",
        ],
        ownerId: "user125",
    },
    4: {
        id: 4,
        title: "Flutter 모바일 앱 개발",
        status: "모집중",
        category: "MOBILE",
        difficulty: "고급",
        participants: "8/15명",
        manager: "관리자",
        recruitmentMethod: StudyRecruitmentMethod.FCFS,
        maxParticipants: 15,
        currentParticipants: 8,
        schedule: "주 3회",
        introduction: `Flutter를 활용한 모바일 앱 개발 심화 스터디입니다.
실제 앱을 기획하고 개발하며, 퍼블리싱까지 경험할 수 있습니다.`,
        curriculum: [
            "1주차: Flutter 개발 환경 구축",
            "2주차: 위젯과 레이아웃 이해",
            "3주차: 상태 관리(BLoC, Provider)",
            "4주차: 네트워크 통신 및 API 연동",
            "5주차: 실전 앱 프로젝트",
        ],
        requirements: [
            "Dart/Flutter 개발 경험",
            "모바일 앱 개발에 관심 있는 분",
            "팀 프로젝트 경험자 우대",
        ],
        ownerId: "user126",
    },
};

export default function StudyDetailWrapper() {
    const { studyId } = useParams();
    const numericStudyId = Number(studyId);
    const navigate = useNavigate();

    const currentUserId = "user123";
    const study = studyDetailData[numericStudyId];

    // 스터디 id가 3이면 스터디원 권한으로 "참여 중" 상태로 전달
    const initialUserApplicationStatus =
        numericStudyId === 3 ? "APPROVED" : undefined;

    if (!study) {
        return <div>스터디를 찾을 수 없습니다.</div>;
    }

    const isOwner = study.ownerId === currentUserId;

    function handleBack() {
        navigate("/");
    }

    return (
        <StudyDetailPage
            studyId={numericStudyId}
            onBack={handleBack}
            isOwner={isOwner}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onViewApplications={(id) => navigate(`/applications/${id}`)}
            onViewMembers={(id) => navigate(`/members/${id}`)}
            onManageAttendance={(id) => navigate(`/attendance/${id}`)}
            initialUserApplicationStatus={initialUserApplicationStatus}
        />
    );
}
