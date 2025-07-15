import useAuth, { AuthStatus } from "./hooks/useAuth";
import {
    Route,
    Routes,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import StudyList from "./pages/StudyList";

function App() {
    const { isAuthenticated } = useAuth();

    return null;
    if (isAuthenticated !== AuthStatus.COMPLETED) {
        return <LoginPage />;
    }
    return <div>
        <Routes>
            <Route
                path="/"
                element={<StudyList />}
            />
        </Routes>
    </div>;
}

export default App;
