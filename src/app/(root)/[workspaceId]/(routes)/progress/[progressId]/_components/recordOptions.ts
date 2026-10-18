import { type CrmActionType } from "@services/api/crm/crm.type";

import { STAGE_META, type StageCode } from "../../_components/progressOptions";

type ActionTypeMeta = {
  label: string;
  /** 타임라인 카드 앞의 상태 점 색 — 단계 배지와 같은 계열 */
  dotClassName: string;
};

/**
 * 진행 기록 유형 — 서버 값(한국어) 그대로. 단계 8개 + 「지정안됨」.
 * 시안의 「통화 · 메일 발신」은 옛 유형이라 API를 따른다.
 */
export const ACTION_TYPE_META: Record<CrmActionType, ActionTypeMeta> = {
  지정안됨: { label: "지정 안 됨", dotClassName: "bg-[#d1d5db]" },
  리드: { label: STAGE_META.리드.label, dotClassName: "bg-[#6b7280]" },
  검토: { label: STAGE_META.검토.label, dotClassName: "bg-[#0e7490]" },
  접촉: { label: STAGE_META.접촉.label, dotClassName: "bg-[#d97700]" },
  미팅: { label: STAGE_META.미팅.label, dotClassName: "bg-[#0066cc]" },
  법무검토: { label: STAGE_META.법무검토.label, dotClassName: "bg-[#b45309]" },
  협상: { label: STAGE_META.협상.label, dotClassName: "bg-[#059669]" },
  계약완료: { label: STAGE_META.계약완료.label, dotClassName: "bg-[#047857]" },
  보류: { label: STAGE_META.보류.label, dotClassName: "bg-[#111827]" },
};

/** 서버가 스펙 밖 값을 주더라도 화면이 깨지지 않게 「지정 안 됨」으로 받는다 */
export const getActionTypeMeta = (type: string) => ACTION_TYPE_META[type as CrmActionType] ?? ACTION_TYPE_META.지정안됨;

/** 현재 단계 Select 옵션 — 목록과 같은 값을 쓴다 */
export const STAGE_SELECT_OPTIONS = (Object.keys(STAGE_META) as StageCode[]).map(code => ({
  value: code,
  label: STAGE_META[code].label,
}));
