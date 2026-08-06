// TODO(API): 진행 관리 API가 나오면 서버 코드값에 맞춰 키를 교체한다.
// 현재 코드값은 디자인 기준 임시값이며, 표시명만 확정된 상태다.

/** 진행 단계 */
export type StageCode =
  | "lead"
  | "contacting"
  | "meeting"
  | "negotiating"
  | "legal_review"
  | "closed_won"
  | "closed_lost";

type StageMeta = {
  label: string;
  /** 배지 배경·글자색 (Figma Semantic 팔레트) */
  className: string;
};

// 배지는 2단계 강도로 설계돼 있다.
// soft  — 연한 배경 + 진한 글자. 아직 굴러가는 중인 초기 단계
// solid — 진한 배경 + 흰 글자. 검토·종결처럼 먼저 눈에 띄어야 하는 단계
export const STAGE_META: Record<StageCode, StageMeta> = {
  lead: { label: "리드", className: "bg-[#f3f4f6] text-[#6b7280]" },
  contacting: { label: "연락 중", className: "bg-[#fceedd] text-[#d97700]" },
  meeting: { label: "미팅", className: "bg-[#f0f6ff] text-[#0066cc]" },
  negotiating: { label: "계약 협상", className: "bg-[#ecfdf5] text-[#059669]" },
  legal_review: { label: "법리 문서 검토", className: "bg-[#b45309] text-[#fffbeb]" },
  closed_won: { label: "계약 완료", className: "bg-[#047857] text-white" },
  closed_lost: { label: "계약 이탈", className: "bg-[#dc2626] text-white" },
};

/** 진행이 끝난 단계 — 다음 액션·기한을 더 이상 요구하지 않는다 */
export const CLOSED_STAGES: StageCode[] = ["closed_won", "closed_lost"];

type FilterOption = { value: string; label: string };

/** 필터 기본값 — "전체"는 빈 문자열로 두고 쿼리에서 생략한다 */
export const ALL_VALUE = "";

export const COUNTRY_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_VALUE, label: "전체" },
  { value: "JP", label: "일본" },
  { value: "HK", label: "홍콩" },
  { value: "SG", label: "싱가포르" },
  { value: "TH", label: "태국" },
];

export const CATEGORY_FILTER_OPTIONS: FilterOption[] = [
  { value: ALL_VALUE, label: "전체" },
  { value: "korean_food", label: "한식" },
  { value: "beef_bbq", label: "소고기 구이" },
  { value: "pork_bbq", label: "돼지고기 구이" },
  { value: "cafe", label: "카페" },
  { value: "dessert", label: "디저트" },
];

// 계약 방식은 브랜드 설정과 같은 코드값을 쓴다.
// TODO(리팩토링): 두 도메인이 공유하므로 공용 상수 위치로 옮기는 게 맞다.
export { CONTRACT_TYPE_OPTIONS } from "../../brand-settings/_components/sections/policyOptions";
