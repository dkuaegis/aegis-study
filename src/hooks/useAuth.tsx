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
                    // 401 오류는 인증 실패로 간주
                    if (response.status === 401) {
                        setUnauthorized();
                        const error = new Error("Unauthorized");
                        error.name = "AuthError";
                        throw error;
                    }
                    // 다른 HTTP 오류는 재시도 가능
                    throw new Error("Authentication check failed");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                // AuthError(401)가 아닌 경우만 로그아웃 처리
                if (!(error instanceof Error && error.name === "AuthError")) {
                    setUnauthorized();
                }
                throw error;
            }
        },
        ...QUERY_OPTIONS_SLOW,
        retry: (failureCount, error) => {
            // 401(AuthError)은 재시도하지 않음
            if (error instanceof Error && error.name === "AuthError") {
                return false;
            }
            // 다른 오류는 2번까지 재시도
            return failureCount < 2;
        },
        enabled: status === AuthStatus.LOADING,
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
