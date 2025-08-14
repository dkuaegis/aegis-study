import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import type { StudyListItem } from "@/types/study";

export async function fetchStudies(): Promise<StudyListItem[]> {
    return ky
        .get(`${import.meta.env.VITE_API_URL}/studies`, {
            credentials: "include",
        })
        .json();
}

export const useStudyListQuery = (
    onError?: (error: unknown) => void
) => {
    return useQuery<StudyListItem[], Error>({
        queryKey: ["studies"],
        queryFn: fetchStudies,
        ...(onError && { onError }),
    });
};