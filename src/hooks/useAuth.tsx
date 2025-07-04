import { useEffect, useState } from "react";

export enum AuthStatus {
    UNAUTHORIZED = "UNAUTHORIZED",
    LOADING = "LOADING",
}

export default function useAuth() {
    const [isAuthenticated, setAuthenticated] = useState<AuthStatus>(
        AuthStatus.LOADING
    );

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/check`,
                    {
                        credentials: "include",
                    }
                );

                if (response.status === 401) {
                    setAuthenticated(AuthStatus.UNAUTHORIZED);
                    return;
                }
                if (!response.ok) {
                    throw new Error("알 수 없는 에러 발생.");
                }
            } catch (error) {
                console.log("로그인 인증 에러:", error);
                setAuthenticated(AuthStatus.UNAUTHORIZED);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated };
}
