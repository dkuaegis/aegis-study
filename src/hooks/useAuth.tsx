import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

export enum AuthStatus {
    UNAUTHORIZED = "UNAUTHORIZED",
    NOT_COMPLETED = "NOT_COMPLETED", // 가입 완료 안됨
    COMPLETED = "COMPLETED", // 가입 완료
}

const useAuth = () => {
    const [isAuthenticated, setAuthenticated] = useState<AuthStatus>(
        AuthStatus.UNAUTHORIZED
    );

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await apiClient.get(
                    API_ENDPOINTS.PAYMENTS_STATUS
                );

                if (response.status === 401) {
                    setAuthenticated(AuthStatus.UNAUTHORIZED);
                    return;
                }
                if (!response.ok) {
                    throw new Error("알 수 없는 에러 발생.");
                }
                const data: { status: string } = await response.json();
                if (data.status === "COMPLETED" || data.status === "OVERPAID") {
                    setAuthenticated(AuthStatus.COMPLETED);
                } else {
                    setAuthenticated(AuthStatus.NOT_COMPLETED);
                }
            } catch (error) {
                console.log("로그인 인증 에러:", error);
                setAuthenticated(AuthStatus.UNAUTHORIZED);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated };
};

export default useAuth;
