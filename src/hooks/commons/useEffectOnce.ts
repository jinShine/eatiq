import { type EffectCallback, useEffect } from "react";

/**
 * 컴포넌트가 마운트될 때 한 번만 실행되는 effect hook입니다.
 * useEffect의 의존성 배열을 빈 배열로 설정한 것과 동일하지만, 의도를 명확하게 표현합니다.
 *
 * @param effect - 실행할 effect 함수
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   useEffectOnce(() => {
 *     console.log("컴포넌트가 마운트되었습니다.");
 *     // 초기화 로직
 *
 *     return () => {
 *       console.log("컴포넌트가 언마운트됩니다.");
 *       // 정리 로직
 *     };
 *   });
 *
 *   return <div>컴포넌트 내용</div>;
 * };
 * ```
 */
export default function useEffectOnce(effect: EffectCallback) {
  useEffect(effect, []);
}
