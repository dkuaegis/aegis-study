import { useCallback, useEffect } from "react";
import { AuthStatus, useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
    const { status, setAuthenticated, setUnauthorized, setLoading } =
        useAuthStore();

    const checkAuth = useCallback(async () => {
        setLoading();
        try {
            const response = await fetch("/api/auth/check", {
                credentials: "include",
            });

            if (response.ok) {
                // We only care that the user is authenticated; the app no longer stores user payload here.
                setAuthenticated();
            } else {
                setUnauthorized();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUnauthorized();
        }
    }, [setAuthenticated, setUnauthorized, setLoading]); // Zustand 액션들은 안정적임

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        status,
        isLoading: status === AuthStatus.LOADING,
        isAuthenticated: status === AuthStatus.AUTHENTICATED,
        isUnauthorized: status === AuthStatus.UNAUTHORIZED,
        checkAuth,
    };
};
