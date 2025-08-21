import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth, { AuthStatus } from "./hooks/useAuth";
import CreateStudyPage from "./pages/CreateStudyPage";
import LoginPage from "./pages/LoginPage";
import StudyListPage from "./pages/StudyListPage";
import ApplicationStatusWrapper from "./pages/wrappers/ApplicationStatusWrapper";
import AttendanceWrapper from "./pages/wrappers/AttendanceWrapper";
import EditStudyWrapper from "./pages/wrappers/EditStudyWrapper";
import StudyDetailWrapper from "./pages/wrappers/StudyDetailWrapper";
import StudyMembersWrapper from "./pages/wrappers/StudyMemberWrapper";

const App = () => {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // 로딩 중에는 로딩 화면 표시
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-gray-500">로딩 중...</div>
            </div>
        );
    }

    // 인증되지 않은 경우 로그인 페이지 표시
    if (isAuthenticated !== AuthStatus.COMPLETED) {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Routes>
                <Route
                    path="/"
                    element={
                        <StudyListPage
                            onCreateStudy={() => navigate("/create")}
                            onViewStudyDetail={(studyId: number) =>
                                navigate(`/detail/${studyId}`)
                            }
                        />
                    }
                />
                <Route path="/create" element={<CreateStudyPage />} />
                <Route
                    path="/detail/:studyId"
                    element={<StudyDetailWrapper />}
                />
                <Route path="/edit/:studyId" element={<EditStudyWrapper />} />
                <Route
                    path="/applications/:studyId"
                    element={<ApplicationStatusWrapper />}
                />
                <Route
                    path="/members/:studyId"
                    element={<StudyMembersWrapper />}
                />
                <Route
                    path="/attendance/:studyId"
                    element={<AttendanceWrapper />}
                />
            </Routes>
        </div>
    );
};

export default App;
