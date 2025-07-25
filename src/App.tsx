import { Route, Routes, useNavigate } from "react-router-dom";

import useAuth, { AuthStatus } from "./hooks/useAuth";
import CreateStudy from "./pages/CreateStudy";
import LoginPage from "./pages/LoginPage";
import StudyList from "./pages/StudyList";
import ApplicationStatusWrapper from "./pages/wrappers/ApplicationStatusWrapper";
import EditStudyWrapper from "./pages/wrappers/EditStudyWrapper";
import StudyDetailWrapper from "./pages/wrappers/StudyDetailWrapper";
import StudyMembersWrapper from "./pages/wrappers/StudyMemberWrapper";

function App() {
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
                        <StudyList
                            onCreateStudy={() => navigate("/create")}
                            onViewStudyDetail={(studyId: number) =>
                                navigate(`/detail/${studyId}`)
                            }
                        />
                    }
                />
                <Route
                    path="/create"
                    element={<CreateStudy onBack={() => navigate("/")} />}
                />
                <Route
                    path="/detail/:studyId"
                    element={
                        <StudyDetailWrapper onBack={() => navigate("/")} />
                    }
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
            </Routes>
        </div>
    );
}

export default App;
