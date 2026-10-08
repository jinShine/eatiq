import { type BrandCompletionStep } from "@services/api/brand/brand.type";
import { type BuyerCompletionStep } from "@services/api/buyer/buyer.type";

export type JourneyStage = { step: string; threshold: number };

/**
 * 브랜드 저니 단계 (피그마 769:3807 · 769:4398).
 *
 * 시작 0% → 성장 25% → 준비 60% → 완성 90%. 완성은 비율에 더해 필수 항목이 모두 채워져야 한다.
 * 단계 판정은 서버가 한다(stage.step). 여기 비율은 "다음 단계까지 N개"를 셀 때만 쓴다.
 */
export const BRAND_JOURNEY_STAGES = [
  { step: "시작", threshold: 0 },
  { step: "성장", threshold: 25 },
  { step: "준비", threshold: 60 },
  { step: "완성", threshold: 90 },
] as const satisfies readonly { step: BrandCompletionStep; threshold: number }[];

/**
 * 바이어 저니 단계 — 완성까지 3단계(피그마 「브랜드 / 바이어 차이점」).
 * 비율·이름은 API 기준: 시작 0~24% → 성장 25~89% → 완성 90%~.
 * 시안은 가운데 단계를 「준비」로 적었지만 API는 「성장」이다(디자인 확인 요청).
 */
export const BUYER_JOURNEY_STAGES = [
  { step: "시작", threshold: 0 },
  { step: "성장", threshold: 25 },
  { step: "완성", threshold: 90 },
] as const satisfies readonly { step: BuyerCompletionStep; threshold: number }[];

export const toStageIndex = (stages: readonly JourneyStage[], step: string) =>
  stages.findIndex(stage => stage.step === step);

/**
 * 다음 단계 비율에 닿으려면 몇 개를 더 채워야 하는지.
 *
 * API가 주지 않아 단계 비율로 계산한다. 비율 = 채운 필드 / 전체 필드라고 가정했다.
 * 완성은 필수 항목 조건이 따로 있어 개수만으로는 말할 수 없으므로 완성 직전 구간은 세지 않는다.
 */
export const countToNextStage = (
  stages: readonly JourneyStage[],
  stageIndex: number,
  totalFields: number,
  completedFields: number,
) => {
  const next = stages[stageIndex + 1];
  if (!next || next.step === "완성") {
    return null;
  }
  const needed = Math.ceil((next.threshold / 100) * totalFields) - completedFields;
  return needed > 0 ? needed : null;
};
