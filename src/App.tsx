import { Route, Routes, useNavigate } from "react-router-dom";
import useAuth, { AuthStatus } from "./hooks/useAuth";
import CreateStudyPage from "./pages/CreateStudyPage";
import LoginPage from "./pages/LoginPage";
import StudyListPage from "./pages/StudyListPage";
import ApplicationStatusWrapper from "./pages/wrappers/ApplicationStatusWrapper";
import EditStudyWrapper from "./pages/wrappers/EditStudyWrapper";
import StudyDetailWrapper from "./pages/wrappers/StudyDetailWrapper";
import StudyMembersWrapper from "./pages/wrappers/StudyMemberWrapper";
import AttendanceWrapper from "./pages/wrappers/AttendanceWrapper";

const App = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
                    path="/attendence/:studyId"
                    element={<AttendanceWrapper />}
                />
            </Routes>
        </div>
    );
};

export default App;
