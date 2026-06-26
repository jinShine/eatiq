import { useMemo } from "react";

import { useCountdown as useCountdownHook } from "usehooks-ts";

/**
 * 카운트다운 타이머를 관리하는 hook입니다.
 * 초 단위로 카운트다운하며, 분:초 형식으로 포맷된 문자열도 제공합니다.
 *
 * @param options - 옵션 객체
 * @param options.countStart - 시작 카운트 값 (초 단위, 기본값: 300)
 * @param options.intervalMs - 업데이트 간격 (밀리초 단위, 기본값: 1000)
 * @returns 카운트다운 상태와 제어 함수를 포함한 객체
 * @returns returns.count - 현재 남은 시간 (초 단위)
 * @returns returns.formattedCount - 포맷된 시간 문자열 (예: "5:00")
 * @returns returns.startCountdown - 카운트다운 시작 함수
 * @returns returns.resetCountdown - 카운트다운 리셋 함수
 *
 * @example
 * ```tsx
 * const Timer = () => {
 *   const { count, formattedCount, startCountdown, resetCountdown } = useCountdown({
 *     countStart: 300,
 *     intervalMs: 1000
 *   });
 *
 *   return (
 *     <div>
 *       <p>남은 시간: {formattedCount}</p>
 *       <button onClick={startCountdown}>시작</button>
 *       <button onClick={resetCountdown}>리셋</button>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useCountdown({
  countStart = 300,
  intervalMs = 1000,
}: {
  countStart?: number;
  intervalMs?: number;
} = {}) {
  const [count, { startCountdown, resetCountdown }] = useCountdownHook({
    countStart,
    intervalMs,
  });

  const formattedCount = useMemo(() => {
    const mins = Math.floor(count / 60);
    const secs = count - 60 * mins;

    return `${mins}:${String(secs).padStart(2, "0")}`;
  }, [count]);

  return {
    count,
    formattedCount,
    startCountdown,
    resetCountdown,
  };
}
