import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 요소의 바운딩 박스(bounding box) 정보를 추적하는 hook입니다.
 * 스크롤 이벤트를 감지하여 요소의 위치와 크기 정보를 실시간으로 업데이트합니다.
 *
 * @param ref - 바운딩 박스를 추적할 요소의 ref
 * @param options - 옵션 객체
 * @param options.onceCondition - 조건이 만족되면 스크롤 이벤트 리스너를 제거하는 조건 함수
 * @returns 바운딩 박스 정보를 포함한 객체
 * @returns returns.rect - 현재 요소의 DOMRect 객체 (null일 수 있음)
 * @returns returns.originRect - 초기 마운트 시점의 DOMRect 객체 (null일 수 있음)
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const elementRef = useRef<HTMLDivElement>(null);
 *   const { rect, originRect } = useBoundingRect(elementRef, {
 *     onceCondition: (rect) => rect.top < 0
 *   });
 *
 *   return (
 *     <div ref={elementRef}>
 *       {rect && <p>위치: {rect.top}px</p>}
 *     </div>
 *   );
 * };
 * ```
 */
export default function useBoundingRect(
  ref: React.RefObject<HTMLElement | null>,
  { onceCondition }: { onceCondition?: (rect: DOMRect) => boolean } = {},
) {
  const [_rect, _setRect] = useState<DOMRect | null>(() => {
    if (ref.current) {
      return ref.current.getBoundingClientRect();
    }
    return null;
  });
  const hasFired = useRef(false);
  const _originRect = useRef<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    if (!ref.current) {
      return;
    }

    const newRect = ref.current.getBoundingClientRect();

    if (onceCondition && onceCondition(newRect)) {
      hasFired.current = true;
    }

    _setRect(newRect);
  }, [ref, onceCondition]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    // 초기 rect 설정
    const initialRect = ref.current.getBoundingClientRect();
    _setRect(initialRect);
    _originRect.current = initialRect;

    const handleScroll = () => {
      if (hasFired.current) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
        return;
      }

      updateRect();
    };

    const handleResize = () => {
      if (hasFired.current) {
        return;
      }

      updateRect();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateRect, ref]);

  return {
    rect: _rect,
    originRect: _originRect.current,
  };
}
