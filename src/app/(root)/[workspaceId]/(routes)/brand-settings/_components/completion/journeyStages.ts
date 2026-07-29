// 피그마 4단계. journeyStage enum 값은 백엔드 확인 대기 중이라
// 알려진 키(EMPTY)만 확정하고, 미확인 값은 completionRate 구간으로 추정한다.
// TODO(백엔드): journeyStage 전체 enum 확정 후 stageKeys 채우기
export const JOURNEY_STAGES = [
  { label: "시작", stageKeys: ["EMPTY", "START", "STARTED"] },
  { label: "성장", stageKeys: ["GROWING", "GROWTH"] },
  { label: "준비", stageKeys: ["READY", "PREPARING"] },
  { label: "완성", stageKeys: ["COMPLETE", "COMPLETED", "DONE"] },
] as const;

// 서버 stage 값 → 단계 인덱스. 모르는 값이면 rate 구간으로 추정(폴백)
export const resolveStageIndex = (stage: string | undefined, rate: number) => {
  const matched = JOURNEY_STAGES.findIndex(s => stage && (s.stageKeys as readonly string[]).includes(stage));
  if (matched >= 0) {
    return matched;
  }
  return Math.min(JOURNEY_STAGES.length - 1, Math.floor(rate / 25));
};
