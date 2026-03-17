import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare function gtag(
    command: "event",
    action: string,
    params?: Record<string, unknown>
): void;

const PAGE_TITLES: Record<string, string> = {
    "/": "스터디 목록",
    "/create": "스터디 만들기",
};

const getPageTitle = (pathname: string): string => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.startsWith("/detail/")) return "스터디 상세";
    if (pathname.startsWith("/edit/")) return "스터디 수정";
    if (pathname.startsWith("/applications/")) return "신청 현황";
    if (pathname.startsWith("/members/")) return "스터디 멤버";
    if (pathname.startsWith("/attendance/")) return "출석 관리";
    return pathname;
};

export const useGoogleAnalytics = (enabled = true) => {
    const location = useLocation();

    useEffect(() => {
        if (!enabled) return;
        if (typeof gtag === "undefined") return;

        const pageTitle = getPageTitle(location.pathname);

        gtag("event", "page_view", {
            page_path: location.pathname,
            page_title: pageTitle,
        });
    }, [enabled, location.pathname]);
};
