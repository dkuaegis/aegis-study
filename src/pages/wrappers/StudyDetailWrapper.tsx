import { useParams, useNavigate } from "react-router-dom";
import StudyDetail from "../StudyDetail";

interface Study {
    id: number;
    title: string;
    status: string;
    category: string;
    difficulty: string;
    participants: string;
    manager: string;
    recruitmentMethod: string;
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
        recruitmentMethod: "지원서", // "선착순" or "지원서"
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
        recruitmentMethod: "선착순",
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
}

export default function StudyDetailWrapper({ onBack }: { onBack: () => void }) {
    const { studyId } = useParams();
    const numericStudyId = Number(studyId);
    const navigate = useNavigate();

    const currentUserId = "user123";
    const study = studyDetailData[numericStudyId];

    if (!study) {
        return <div>스터디를 찾을 수 없습니다.</div>;
    }

    const isOwner = study.ownerId === currentUserId;

    return (
        <StudyDetail
            studyId={numericStudyId}
            onBack={onBack}
            isOwner={isOwner}
            currentUserId={currentUserId}
            onEdit={(id) => navigate(`/edit/${id}`)}
            onViewApplications={(id) => console.log("Applications", id)}
            onViewMembers={(id) => console.log("Members", id)}
        />
    );
}
