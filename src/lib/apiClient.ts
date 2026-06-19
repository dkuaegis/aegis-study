import ky, { type KyRequest, type NormalizedOptions, type KyResponse } from "ky";
import { useAuthStore } from "@/stores/useAuthStore";

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  hooks: {
    afterResponse: [
      async (
        _request: KyRequest,
        _options: NormalizedOptions,
        response: KyResponse,
      ) => {
        if (response.status === 401) {
          useAuthStore.getState().setUnauthorized();
        }
        return response;
      },
    ],
  },
});
