import { useEffect, useState } from "react";

/**
 * 윈도우 크기를 추적하는 hook입니다.
 * 반응형 UI를 구현할 때 유용합니다.
 *
 * @returns 윈도우 크기 정보를 포함한 객체
 * @returns returns.width - 윈도우 너비 (픽셀)
 * @returns returns.height - 윈도우 높이 (픽셀)
 *
 * @example
 * ```tsx
 * const ResponsiveLayout = () => {
 *   const { width, height } = useWindowSize();
 *
 *   if (width < 768) {
 *     return <MobileLayout />;
 *   }
 *
 *   if (width < 1024) {
 *     return <TabletLayout />;
 *   }
 *
 *   return <DesktopLayout />;
 * };
 * ```
 */
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: 0,
      height: 0,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // 초기 크기 설정
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}
