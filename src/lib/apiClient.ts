import ky from "ky";
import type { AfterResponseHook } from "ky/distribution/types/hooks";
import { useAuthStore } from "@/stores/useAuthStore";

const afterResponse: AfterResponseHook = async (
  _request,
  _options,
  response,
  _state,
) => {
  if (response.status === 401) {
    useAuthStore.getState().setUnauthorized();
  }
  return response;
};

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  hooks: {
    afterResponse: [afterResponse],
  },
});
