import { useCallback, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { AuthStatus, useAuthStore } from "@/stores/useAuthStore";

export const useAuth = () => {
    const {
        status,
        setAuthenticated,
        setUnauthorized,
        setPending,
        setLoading,
    } = useAuthStore();

    const checkAuth = useCallback(async () => {
        setLoading();
        try {
            const response = await apiClient.get(API_ENDPOINTS.CHECK_AUTH);

            if (response.ok) {
                const data = await response.json<{ status: string }>();

                if (data.status === "COMPLETED") {
                    setAuthenticated();
                } else if (data.status === "PENDING") {
                    setPending();
                } else {
                    setUnauthorized();
                }
            } else {
                setUnauthorized();
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUnauthorized();
        }
    }, [setAuthenticated, setUnauthorized, setPending, setLoading]); // Zustand 액션들은 안정적임

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        status,
        isLoading: status === AuthStatus.LOADING,
        isAuthenticated: status === AuthStatus.AUTHENTICATED,
        isUnauthorized: status === AuthStatus.UNAUTHORIZED,
        isPending: status === AuthStatus.PENDING,
        checkAuth,
    };
};

export default useAuth;
