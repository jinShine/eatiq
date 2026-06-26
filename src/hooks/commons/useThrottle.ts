import { useEffect, useRef, useState } from "react";

/**
 * 값을 스로틀링하는 hook입니다.
 * 일정 시간 간격으로만 값을 업데이트합니다.
 * 스크롤, 리사이즈 이벤트 등에 유용합니다.
 *
 * @template T - 스로틀링할 값의 타입
 * @param value - 스로틀링할 값
 * @param delay - 스로틀 지연 시간 (밀리초 단위, 기본값: 500)
 * @returns 스로틀링된 값
 *
 * @example
 * ```tsx
 * const ScrollPosition = () => {
 *   const [scrollY, setScrollY] = useState(0);
 *   const throttledScrollY = useThrottle(scrollY, 100);
 *
 *   useEffect(() => {
 *     const handleScroll = () => {
 *       setScrollY(window.scrollY);
 *     };
 *
 *     window.addEventListener("scroll", handleScroll);
 *     return () => window.removeEventListener("scroll", handleScroll);
 *   }, []);
 *
 *   return <div>스크롤 위치: {throttledScrollY}px</div>;
 * };
 * ```
 */
export default function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRan.current;

    if (timeSinceLastRun >= delay) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = Date.now();
      }, delay - timeSinceLastRun);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
}
