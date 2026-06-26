import { useEffect, useState } from "react";

/**
 * 값을 디바운싱하는 hook입니다.
 * 입력이 멈춘 후 일정 시간이 지나면 값을 업데이트합니다.
 * 검색 입력, API 호출 최적화 등에 유용합니다.
 *
 * @template T - 디바운싱할 값의 타입
 * @param value - 디바운싱할 값
 * @param delay - 디바운스 지연 시간 (밀리초 단위, 기본값: 500)
 * @returns 디바운싱된 값
 *
 * @example
 * ```tsx
 * const SearchInput = () => {
 *   const [searchTerm, setSearchTerm] = useState("");
 *   const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // API 호출
 *       fetchSearchResults(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="검색..."
 *     />
 *   );
 * };
 * ```
 */
export default function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
