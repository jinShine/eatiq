import { useCallback, useRef } from "react";

/**
 * 요소로 부드럽게 스크롤하는 기능을 제공하는 hook입니다.
 * ref를 통해 요소를 참조하고, 해당 요소로 스크롤하는 함수를 제공합니다.
 *
 * @returns 스크롤 기능을 포함한 객체
 * @returns returns.ref - 스크롤할 대상 요소에 연결할 ref
 * @returns returns.onMoveToElement - 요소로 스크롤하는 함수
 * @returns returns.onMoveToElement.options - 스크롤 옵션
 * @returns returns.onMoveToElement.options.behavior - 스크롤 동작 방식 ("smooth" | "auto", 기본값: "smooth")
 * @returns returns.onMoveToElement.options.block - 수직 정렬 위치 ("start" | "center" | "end" | "nearest", 기본값: "start")
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { ref, onMoveToElement } = useMoveToScroll();
 *
 *   return (
 *     <div>
 *       <button onClick={() => onMoveToElement({ behavior: "smooth" })}>
 *         스크롤 이동
 *       </button>
 *       <div ref={ref} style={{ height: "1000px", marginTop: "500px" }}>
 *         스크롤할 대상 요소
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useMoveToScroll() {
  const ref = useRef<HTMLDivElement>(null);

  const onMoveToElement = useCallback(
    ({
      behavior = "smooth",
      block = "start",
    }: {
      behavior?: ScrollBehavior;
      block?: ScrollLogicalPosition;
    } = {}) => {
      ref.current?.scrollIntoView({ behavior, block });
    },
    [],
  );

  return { ref, onMoveToElement };
}
