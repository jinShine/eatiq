// v0.7 규약 기준. 스테퍼 배지는 4개(S1~S4)이고, EMPTY는 "아직 어떤 단계도 달성 못 함"으로 표현한다.
export const JOURNEY_STAGES = [
  { key: "S1", label: "시작" },
  { key: "S2", label: "성장" },
  { key: "S3", label: "준비" },
  { key: "S4", label: "완성" },
] as const;

// EMPTY 상태에서 배지 위에 띄울 라벨
export const EMPTY_STAGE_LABEL = "입력 필요";

/**
 * 서버 stage → 완료된 배지 인덱스.
 * EMPTY(또는 미확인 + rate 15% 미만)는 -1 = 어떤 배지도 완료되지 않음.
 * 서버가 stage를 안 주면 rate 구간(15/35/55/80)으로 추정한다.
 */
export const resolveStageIndex = (stage: string | undefined, rate: number) => {
  const matched = JOURNEY_STAGES.findIndex(s => s.key === stage);
  if (matched >= 0) {
    return matched;
  }
  if (stage === "EMPTY") {
    return -1;
  }
  // 폴백: v0.7 진척률 기준
  if (rate < 15) {
    return -1;
  }
  if (rate < 35) {
    return 0;
  }
  if (rate < 55) {
    return 1;
  }
  if (rate < 80) {
    return 2;
  }
  return 3;
};
