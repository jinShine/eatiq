import { useInView } from "react-intersection-observer";

/**
 * 요소가 뷰포트에 보이는지 감지하는 hook입니다.
 * react-intersection-observer의 useInView를 재export합니다.
 *
 * @returns Intersection Observer 관련 값과 함수를 포함한 배열
 * @returns returns[0].ref - 관찰할 요소에 연결할 ref
 * @returns returns[0].inView - 요소가 뷰포트에 보이는지 여부
 * @returns returns[0].entry - IntersectionObserverEntry 객체
 * @returns returns[1] - ref (첫 번째 요소와 동일)
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { ref, inView, entry } = useInView({
 *     threshold: 0,
 *     triggerOnce: true
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {inView ? "요소가 보입니다!" : "요소가 보이지 않습니다."}
 *     </div>
 *   );
 * };
 * ```
 *
 * @see {@link https://github.com/thebuilder/react-intersection-observer} react-intersection-observer 문서
 */
export default useInView;
