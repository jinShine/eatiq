import { type CrmStage } from "@services/api/crm/crm.type";

/** 진행 단계 — 서버 값(한국어) 그대로. 8개, 어느 단계에서 어느 단계로든 옮길 수 있다 */
export type StageCode = CrmStage;

type StageMeta = {
  /** 화면 표시명 — 서버 값은 붙여 쓰지만(「법무검토」) 시안은 띄어 쓴다 */
  label: string;
  /** 배지 배경·글자색 (Figma Semantic 팔레트) */
  className: string;
};

// 배지는 2단계 강도로 설계돼 있다.
// soft  — 연한 배경 + 진한 글자. 아직 굴러가는 중인 단계
// solid — 진한 배경 + 흰 글자. 법무 검토·종결처럼 먼저 눈에 띄어야 하는 단계
export const STAGE_META: Record<StageCode, StageMeta> = {
  리드: { label: "리드", className: "bg-[#f3f4f6] text-[#6b7280]" },
  // 시안에 「검토」 배지가 없어 정했다 — 이웃 단계(리드 회색·접촉 주황·미팅 파랑)와 겹치지 않는 청록 soft
  검토: { label: "검토", className: "bg-[#ecfeff] text-[#0e7490]" },
  접촉: { label: "접촉", className: "bg-[#fceedd] text-[#d97700]" },
  미팅: { label: "미팅", className: "bg-[#f0f6ff] text-[#0066cc]" },
  법무검토: { label: "법무 검토", className: "bg-[#b45309] text-[#fffbeb]" },
  협상: { label: "협상", className: "bg-[#ecfdf5] text-[#059669]" },
  계약완료: { label: "계약 완료", className: "bg-[#047857] text-white" },
  보류: { label: "보류", className: "bg-[#111827] text-white" },
};
