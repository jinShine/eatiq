import { useCallback, useState } from "react";

/**
 * boolean 값을 토글하는 hook입니다.
 * 간단한 on/off 상태를 관리할 때 유용합니다.
 *
 * @param initialValue - 초기값 (기본값: false)
 * @returns 토글 상태와 제어 함수를 포함한 객체
 * @returns returns.value - 현재 boolean 값
 * @returns returns.toggle - 값을 토글하는 함수
 * @returns returns.setTrue - 값을 true로 설정하는 함수
 * @returns returns.setFalse - 값을 false로 설정하는 함수
 *
 * @example
 * ```tsx
 * const ToggleButton = () => {
 *   const { value, toggle, setTrue, setFalse } = useToggle(false);
 *
 *   return (
 *     <div>
 *       <p>상태: {value ? "켜짐" : "꺼짐"}</p>
 *       <button onClick={toggle}>토글</button>
 *       <button onClick={setTrue}>켜기</button>
 *       <button onClick={setFalse}>끄기</button>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
  };
}
