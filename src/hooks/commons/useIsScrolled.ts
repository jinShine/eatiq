import { useEffect, useState } from "react";

/**
 * 스크롤 위치를 감지하여 특정 임계값을 넘었는지 확인하는 hook입니다.
 * 헤더나 네비게이션 바의 스타일을 스크롤 위치에 따라 변경할 때 유용합니다.
 *
 * @param options - 옵션 객체
 * @param options.threshold - 스크롤이 발생했다고 판단할 임계값 (픽셀 단위, 기본값: 20)
 * @returns 스크롤이 임계값을 넘었는지 여부
 *
 * @example
 * ```tsx
 * const Header = () => {
 *   const isScrolled = useIsScrolled({ threshold: 50 });
 *
 *   return (
 *     <header className={isScrolled ? "scrolled" : ""}>
 *       헤더 내용
 *     </header>
 *   );
 * };
 * ```
 */
export type UseIsScrolledProps = {
  threshold?: number;
};

export default function useIsScrolled({ threshold = 20 }: UseIsScrolledProps = {}) {
  const [isScrolled, setIsScrolled] = useState(() => {
    if (typeof window !== "undefined") {
      return window.scrollY > threshold;
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // 초기 마운트 시 현재 스크롤 위치 확인
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
