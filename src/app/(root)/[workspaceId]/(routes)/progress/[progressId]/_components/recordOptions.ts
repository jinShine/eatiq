import { type CrmActionType } from "@services/api/crm/crm.type";

import { STAGE_META, type StageCode } from "../../_components/progressOptions";

type ActionTypeMeta = {
  label: string;
  /** 타임라인 카드 앞의 상태 점 색 */
  dotClassName: string;
};

/** 진행 기록 유형 — 서버 값(한국어) 그대로. 미팅 · 통화 · 메일 (시안의 타임라인 유형과 같다) */
export const ACTION_TYPE_META: Record<CrmActionType, ActionTypeMeta> = {
  미팅: { label: "미팅", dotClassName: "bg-[#0066cc]" },
  통화: { label: "통화", dotClassName: "bg-[#059669]" },
  메일: { label: "메일", dotClassName: "bg-[#d97700]" },
};

/** 진행 기록 추가 드로어의 기본 유형 — 시안대로 미팅을 골라 둔다 */
export const DEFAULT_ACTION_TYPE: CrmActionType = "미팅";

/** 서버가 스펙 밖 값(구조 변경 전 기록 등)을 주더라도 화면이 깨지지 않게 회색 점 + 값 그대로 */
export const getActionTypeMeta = (type: string): ActionTypeMeta =>
  ACTION_TYPE_META[type as CrmActionType] ?? { label: type, dotClassName: "bg-[#d1d5db]" };

/** 현재 단계 Select 옵션 — 목록과 같은 값을 쓴다 */
export const STAGE_SELECT_OPTIONS = (Object.keys(STAGE_META) as StageCode[]).map(code => ({
  value: code,
  label: STAGE_META[code].label,
}));
