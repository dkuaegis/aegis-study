import { useQuery } from "@tanstack/react-query";
import { QUERY_OPTIONS_SLOW } from "@/api/queryOptions";
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

    const { refetch } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
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
                    return data;
                } else {
                    setUnauthorized();
                    throw new Error("Authentication check failed");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                setUnauthorized();
                throw error;
            }
        },
        ...QUERY_OPTIONS_SLOW,
    });

    return {
        status,
        isLoading: status === AuthStatus.LOADING,
        isAuthenticated: status === AuthStatus.AUTHENTICATED,
        isUnauthorized: status === AuthStatus.UNAUTHORIZED,
        isPending: status === AuthStatus.PENDING,
        checkAuth: refetch,
    };
};

export default useAuth;
