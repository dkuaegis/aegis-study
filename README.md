# Aegis Study

스터디 그룹을 효율적으로 관리하고 참여할 수 있는 웹 플랫폼입니다.

## 서비스 소개

스터디 생성, 참여, 출석 관리까지 원스톱으로 해결하는 스터디 관리 플랫폼

## 프로젝트 개요

Aegis Study는 개발자 및 학습자들이 스터디 그룹을 쉽게 생성하고 관리할 수 있도록 설계된 웹 애플리케이션입니다. 스터디장과 참가자 모두가 편리하게 사용할 수 있는 기능을 제공하며, 모바일 친화적인 반응형 디자인을 갖추고 있습니다.

## 주요 기능

- **스터디 관리**: 스터디 생성, 편집, 삭제 기능
- **참여 신청**: 지원서 작성 및 선착순 신청 방식 지원
- **신청 관리**: 스터디장용 신청 승인/거절 기능
- **출석 관리**: 스터디 출석 체크 및 관리
- **멤버 관리**: 스터디 멤버 목록 및 역할 관리
- **반응형 디자인**: 모바일 및 데스크톱 환경 최적화

## 기술 스택

### Frontend
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Radix UI** - 접근성 있는 UI 컴포넌트

### 상태 관리 및 데이터
- **Zustand** - 전역 상태 관리
- **TanStack Query** - 서버 상태 관리
- **React Hook Form** - 폼 관리

### 기타 라이브러리
- **React Router DOM** - 클라이언트 사이드 라우팅
- **Ky** - HTTP 클라이언트
- **Lucide React** - 아이콘
- **GSAP** - 애니메이션
- **Lottie React** - Lottie 애니메이션

### 개발 도구
- **Biome** - 코드 포맷팅 및 린팅
- **ESLint** - 코드 품질 검사
- **TypeScript** - 타입 체킹

## 프로젝트 구조

```text
src/
├── api/                    # API 호출 관련
├── assets/                 # 정적 파일
├── components/             # 재사용 가능한 컴포넌트
│   ├── study/             # 스터디 관련 컴포넌트
│   ├── study-detail/      # 스터디 상세 컴포넌트
│   ├── ui/                # UI 컴포넌트
│   └── wrappers/          # 페이지 래퍼 컴포넌트
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 설정
├── pages/                 # 페이지 컴포넌트
│   └── wrappers/          # 페이지 래퍼
├── stores/                # Zustand 스토어
├── types/                 # TypeScript 타입 정의
└── utils/                 # 유틸리티 함수
```

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

1. 저장소 클론
```bash
git clone [<repository-url>](https://github.com/dkuaegis/aegis-study.git)
cd aegis-study
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 브라우저에서 [http://localhost:5173](http://localhost:5173) 접속

### 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - 코드 린팅
- `npm run format` - 코드 포맷팅
- `npm run check` - 코드 품질 검사

## 라우팅

| 경로 | 설명 |
|------|------|
| `/` | 스터디 목록 페이지 |
| `/create` | 스터디 생성 페이지 |
| `/detail/:studyId` | 스터디 상세 페이지 |
| `/edit/:studyId` | 스터디 편집 페이지 |
| `/applications/:studyId` | 신청 상태 페이지 |
| `/members/:studyId` | 스터디 멤버 페이지 |
| `/attendance/:studyId` | 출석 관리 페이지 |

## 라이센스

이 프로젝트는 단국대학교 개발 보안 동아리 Aegis의 프로젝트 입니다.
