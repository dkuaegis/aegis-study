import LoginPage from "./pages/LoginPage";
import useAuth, { AuthStatus } from "./hooks/useAuth";

function App() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated === AuthStatus.LOADING) {
        return null;
    }
    if (isAuthenticated === AuthStatus.UNAUTHORIZED) {
        return <LoginPage />;
    }
    return <div></div>;
}

export default App;
