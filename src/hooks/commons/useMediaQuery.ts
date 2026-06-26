import { useEffect, useState } from "react";

/**
 * 화면 크기 타입
 */
export type ScreenSize = "mobile" | "tablet" | "desktop";

/**
 * 미디어 쿼리 옵션
 */
export type UseMediaQueryOptions =
  | {
      /** 화면 크기 (mobile, tablet, desktop) */
      screenSize: ScreenSize;
    }
  | {
      /** 직접 CSS 미디어 쿼리 문자열 전달 */
      query: string;
    };

/**
 * 미디어 쿼리를 감지하는 hook입니다.
 * 반응형 디자인에서 브레이크포인트에 따라 UI를 변경할 때 유용합니다.
 *
 * @param options - 미디어 쿼리 옵션 (screenSize 또는 query)
 * @returns 미디어 쿼리가 일치하는지 여부
 *
 * @example
 * ```tsx
 * // screenSize 사용 (권장)
 * const ResponsiveComponent = () => {
 *   const isMobile = useMediaQuery({ screenSize: "mobile" });
 *   const isTablet = useMediaQuery({ screenSize: "tablet" });
 *   const isDesktop = useMediaQuery({ screenSize: "desktop" });
 *
 *   if (isMobile) {
 *     return <MobileView />;
 *   }
 *
 *   if (isTablet) {
 *     return <TabletView />;
 *   }
 *
 *   return <DesktopView />;
 * };
 * ```
 *
 * @example
 * ```tsx
 * // query 직접 사용
 * const CustomComponent = () => {
 *   const isLargeScreen = useMediaQuery({
 *     query: "(min-width: 1200px)"
 *   });
 *
 *   return <div>{isLargeScreen ? "Large" : "Small"}</div>;
 * };
 * ```
 */
export default function useMediaQuery(options: UseMediaQueryOptions): boolean {
  // screenSize 또는 query에서 실제 쿼리 문자열 추출
  const query = "screenSize" in options ? getMediaQueryByScreenSize(options.screenSize) : options.query;
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 최신 브라우저는 addEventListener 지원
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    // 구형 브라우저 호환성
    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * 화면 크기에 따라 미디어 쿼리 문자열을 반환합니다.
 *
 * @param screenSize - 화면 크기 (mobile, tablet, desktop)
 * @returns CSS 미디어 쿼리 문자열
 */
function getMediaQueryByScreenSize(screenSize: ScreenSize): string {
  switch (screenSize) {
    case "mobile":
      return "(max-width: 768px)";
    case "tablet":
      return "(min-width: 769px) and (max-width: 1024px)";
    case "desktop":
      return "(min-width: 1025px)";
    default:
      return "(min-width: 1025px)";
  }
}
