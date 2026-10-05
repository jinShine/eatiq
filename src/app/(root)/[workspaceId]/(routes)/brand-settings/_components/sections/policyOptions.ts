import {
  type UpdateBrandCommissionRequest,
  type UpdateBrandContractPolicyRequest,
} from "@services/api/brand/brand.type";

type Option = { value: string; label: string };

/************************************
 * 계약 및 정책 — 스펙(UpdateBrandContractPolicyDto·UpdateBrandCommissionDto)의 값 그대로.
 * 서버가 이 값만 받는다(아니면 400). 라벨도 값과 같다. 옛 영어 코드표(v0.7)는 폐기됐다.
 ************************************/
type Policy = UpdateBrandContractPolicyRequest;
type Commission = UpdateBrandCommissionRequest;

export const TARGET_COUNTRY_VALUES = ["일본", "홍콩", "싱가포르", "태국"] as const satisfies readonly NonNullable<
  Policy["target_country"]
>[];
export const CONTRACT_TYPE_VALUES = [
  "마스터 프랜차이즈",
  "지역 개발권",
  "직영",
  "합작법인",
  "라이선스",
  "유통",
  "미정",
] as const satisfies readonly NonNullable<Policy["preferred_contract_type"]>[];

// 선택지 순서도 스펙 그대로 둔다(항목마다 순서가 다르다)
export const EXCLUSIVITY_VALUES = [
  "불가",
  "협의 필요",
  "가능",
] as const satisfies readonly Policy["exclusivity_level"][];
export const MENU_LOCALIZATION_VALUES = [
  "불가",
  "협의 필요",
  "가능",
] as const satisfies readonly Policy["menu_localization_level"][];
export const INTERIOR_STANDARD_VALUES = [
  "가능",
  "협의 필요",
  "불가",
] as const satisfies readonly Policy["interior_standard_policy"][];
export const SUPPLY_CHAIN_VALUES = [
  "협의 필요",
  "필수",
  "불필요",
] as const satisfies readonly Policy["supply_chain_policy"][];
export const TRADEMARK_COMPLIANCE_VALUES = [
  "전면 준수 필수",
  "부분 협의 가능",
] as const satisfies readonly Policy["trademark_compliance_level"][];
export const MANUAL_COMPLIANCE_VALUES = [
  "전면 준수 필수",
  "부분 협의 가능",
] as const satisfies readonly Policy["manual_compliance_level"][];

export const ROYALTY_CALC_BASE_VALUES = [
  "총매출",
  "순매출",
] as const satisfies readonly Commission["royalty_calc_base"][];
export const ROYALTY_PAYMENT_CYCLE_VALUES = [
  "매월",
  "매 분기",
  "매 반기",
  "매년",
] as const satisfies readonly Commission["royalty_payment_cycle"][];

/** 상권분석 기준 */
export const AREA_TYPE_OPTIONS: Option[] = [
  { value: "transit", label: "역세권" },
  { value: "university", label: "대학가" },
  { value: "office", label: "오피스" },
  { value: "residential", label: "주거" },
  { value: "tourist", label: "관광" },
  { value: "shopping", label: "쇼핑" },
  { value: "high_street", label: "중심 상업가" },
  { value: "mixed_use", label: "복합" },
  { value: "no_preference", label: "상관없음" },
];

export const FLOOR_OPTIONS: Option[] = [
  { value: "ground_only", label: "1층만 가능" },
  { value: "ground_preferred", label: "1층 선호" },
  { value: "second_preferred", label: "2층 선호" },
  { value: "basement_allowed", label: "지하 가능" },
  { value: "rooftop_preferred", label: "루프탑 선호" },
  { value: "sky_lounge_preferred", label: "스카이라운지 선호" },
  { value: "no_preference", label: "상관없음" },
];

export const EXPANSION_STATUS_OPTIONS: Option[] = [
  { value: "active", label: "적극 추진" },
  { value: "exploring", label: "관심 단계" },
  { value: "paused", label: "보류 중" },
];

// 공통 척도: 중요도 13개 필드 전부 (매출·설비 포함)
export const IMPORTANCE_OPTIONS: Option[] = [
  { value: "must_have", label: "필수" },
  { value: "important", label: "중요" },
  { value: "normal", label: "보통" },
  { value: "low", label: "낮음" },
  { value: "ignore", label: "고려 안 함" },
];
