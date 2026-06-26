import { type ReactElement, useEffect, useMemo, useState } from "react";

/**
 * 다단계 폼이나 스텝 기반 UI를 관리하는 hook입니다.
 * 여러 단계를 순차적으로 이동하고, 특정 단계로 직접 이동할 수 있습니다.
 *
 * @param steps - 단계별로 표시할 ReactElement 배열
 * @returns 다단계 상태와 제어 함수를 포함한 객체
 * @returns returns.currentStepIndex - 현재 단계의 인덱스 (0부터 시작)
 * @returns returns.step - 현재 단계의 ReactElement
 * @returns returns.steps - 전체 단계 배열
 * @returns returns.isFirstStep - 첫 번째 단계인지 여부
 * @returns returns.isLastStep - 마지막 단계인지 여부
 * @returns returns.next - 다음 단계로 이동하는 함수 (마지막 단계에서는 동작하지 않음)
 * @returns returns.back - 이전 단계로 이동하는 함수 (첫 번째 단계에서는 동작하지 않음)
 * @returns returns.goTo - 특정 인덱스의 단계로 이동하는 함수
 *
 * @example
 * ```tsx
 * const MultiStepForm = () => {
 *   const steps = [
 *     <Step1 key="step1" />,
 *     <Step2 key="step2" />,
 *     <Step3 key="step3" />
 *   ];
 *
 *   const { step, isFirstStep, isLastStep, next, back, goTo } = useMultipleStep(steps);
 *
 *   return (
 *     <div>
 *       {step}
 *       <div>
 *         {!isFirstStep && <button onClick={back}>이전</button>}
 *         {!isLastStep && <button onClick={next}>다음</button>}
 *         <button onClick={() => goTo(0)}>처음으로</button>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export default function useMultipleStep(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // steps 배열이 변경되면 인덱스가 유효한지 검증
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(Math.max(0, steps.length - 1));
    }
  }, [steps.length, currentStepIndex]);

  const isFirstStep = useMemo(() => currentStepIndex === 0, [currentStepIndex]);
  const isLastStep = useMemo(() => currentStepIndex === steps.length - 1, [currentStepIndex, steps.length]);

  function next() {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex >= steps.length - 1) {
        return prevIndex;
      }

      return prevIndex + 1;
    });
  }

  function back() {
    setCurrentStepIndex(prevIndex => {
      if (prevIndex <= 0) {
        return prevIndex;
      }

      return prevIndex - 1;
    });
  }

  function goTo(index: number) {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep,
    isLastStep,
    goTo,
    next,
    back,
  };
}
