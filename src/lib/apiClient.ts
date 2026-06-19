import ky from "ky";
import { useAuthStore } from "@/stores/useAuthStore";

export const apiClient = ky.create({
  prefix: import.meta.env.VITE_API_URL,
  credentials: "include",
  hooks: {
    afterResponse: [
      (async ({ response }) => {
        if (response.status === 401) {
          useAuthStore.getState().setUnauthorized();
        }
        return response;
      }) as any,
    ],
  },
});
