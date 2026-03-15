import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { HTTPError } from "ky";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import type { UserStudyRoles } from "@/types/user";
import { QUERY_OPTIONS_SLOW } from "./queryOptions";

export const USER_ROLES_QUERY_KEY = ["userRoles"] as const;

async function fetchUserStudyRoles(
    signal?: AbortSignal
): Promise<UserStudyRoles> {
    return apiClient
        .get(`${API_ENDPOINTS.STUDIES}/roles`, { signal })
        .json<UserStudyRoles>();
}

export const useUserStudyRolesQuery = (): UseQueryResult<
    UserStudyRoles,
    HTTPError
> => {
    return useQuery<UserStudyRoles, HTTPError>({
        queryKey: USER_ROLES_QUERY_KEY,
        queryFn: ({ signal }) => fetchUserStudyRoles(signal),
        ...QUERY_OPTIONS_SLOW,
    });
};
