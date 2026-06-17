import { useCallback, useEffect, useState } from "react";

// 인앱 브라우저 식별을 위한 User Agent 패턴과 표시 이름
const IN_APP_BROWSER_PATTERNS = [
  { pattern: "kakaotalk", name: "카카오톡" },
  { pattern: "instagram", name: "인스타그램" },
  { pattern: "everytimeapp", name: "에브리타임" },
  { pattern: "naver", name: "네이버" },
  { pattern: "fban", name: "페이스북" },
  { pattern: "fbav", name: "페이스북" },
  { pattern: "line", name: "라인" },
  { pattern: "snapchat", name: "스냅챗" },
  { pattern: "tiktok", name: "틱톡" },
  { pattern: "whatsapp", name: "왓츠앱" },
];

// 인앱 브라우저별 iOS URL 스킴 (앱으로 전환 시도)
const IOS_URL_SCHEMES: Record<string, string> = {
  카카오톡: "kakaotalk://",
  네이버: "naversearch://",
  라인: "line://",
  페이스북: "fb://",
  인스타그램: "instagram://",
  틱톡: "snssdk1233://",
};

export function useExternalBrowser() {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [browserName, setBrowserName] = useState<string>("인앱 브라우저");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const detected = IN_APP_BROWSER_PATTERNS.find((browser) =>
      ua.includes(browser.pattern)
    );

    if (detected) {
      setIsInAppBrowser(true);
      setBrowserName(detected.name);
    } else {
      setIsInAppBrowser(false);
      setBrowserName("인앱 브라우저");
    }
  }, []);

  const openInDefaultBrowser = useCallback(() => {
    if (!isInAppBrowser) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(ua);

    const currentUrl = window.location.href;

    if (isAndroid) {
      // Android: Intent 스킴으로 기본 브라우저 전환
      location.href =
        "intent://" +
        currentUrl.replace(/https?:\/\//i, "") +
        "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
        encodeURIComponent(currentUrl) +
        ";end;";
      return;
    }

    if (isIOS) {
      // iOS: 앱별 URL 스킴으로 앱 실행 시도
      // 인앱 브라우저에서 앱 스킴을 열면, 해당 앱이 열리면서 인앱 브라우저가 닫힘
      // 이후 사용자가 앱 내에서 Safari로 열 수 있음
      const scheme = IOS_URL_SCHEMES[browserName];
      if (scheme) {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = scheme;
        document.body.appendChild(iframe);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      }
      // URL 스킴이 없거나 실패 시 안내 페이지가 표시됨
      return;
    }
  }, [isInAppBrowser, browserName]);

  return { isInAppBrowser, browserName, openInDefaultBrowser };
}
