import { create } from "zustand";
import { devtools } from "zustand/middleware";
export enum AuthStatus {
    LOADING = "loading",
    AUTHENTICATED = "authenticated",
    UNAUTHORIZED = "unauthorized",
}

interface AuthState {
    status: AuthStatus;

    // Actions
    setStatus: (status: AuthStatus) => void;
    setUnauthorized: () => void;
    setAuthenticated: () => void;
    setLoading: () => void;
    reset: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools(
        (set) => ({
            status: AuthStatus.LOADING,

            setStatus: (status) => set({ status }, false, "setStatus"),
            setUnauthorized: () =>
                set(
                    {
                        status: AuthStatus.UNAUTHORIZED,
                    },
                    false,
                    "setUnauthorized"
                ),
            setAuthenticated: () =>
                set(
                    {
                        status: AuthStatus.AUTHENTICATED,
                    },
                    false,
                    "setAuthenticated"
                ),
            setLoading: () =>
                set(
                    {
                        status: AuthStatus.LOADING,
                    },
                    false,
                    "setLoading"
                ),
            reset: () =>
                set(
                    {
                        status: AuthStatus.LOADING,
                    },
                    false,
                    "reset"
                ),
        }),
        { name: "auth-store" }
    )
);
