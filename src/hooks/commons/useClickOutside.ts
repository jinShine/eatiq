import { type RefObject, useEffect, useRef } from "react";

/**
 * 요소 외부 클릭을 감지하는 hook입니다.
 * 모달, 드롭다운, 팝오버 등을 닫을 때 유용합니다.
 *
 * @param handler - 외부 클릭 시 실행할 콜백 함수
 * @returns 감지할 요소에 연결할 ref
 *
 * @example
 * ```tsx
 * const Dropdown = () => {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const ref = useClickOutside(() => setIsOpen(false));
 *
 *   return (
 *     <div>
 *       <button onClick={() => setIsOpen(true)}>열기</button>
 *       {isOpen && (
 *         <div ref={ref} className="dropdown">
 *           드롭다운 내용
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export default function useClickOutside<T extends HTMLElement = HTMLElement>(handler: () => void): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler]);

  return ref;
}
