import {
  type UpdateBrandCommissionRequest,
  type UpdateBrandContractPolicyRequest,
  type UpdateBrandFacilityReqRequest,
  type UpdateBrandLocationStandardRequest,
} from "@services/api/brand/brand.type";

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

/************************************
 * 상권분석 기준 — 스펙(UpdateBrandLocationStandardDto·FacilityReqDto)의 값 그대로.
 ************************************/
type Location = UpdateBrandLocationStandardRequest;
type Facility = UpdateBrandFacilityReqRequest;

/**
 * 선호 상권 — 스펙은 선택지 없는 문자열(예시: "오피스, 주거 밀집, 대학가, 번화가 등")이고 서버는 아무 값이나 받는다.
 * 시안은 선택 박스라 스펙 예시를 선택지로 쓴다. TODO(백엔드): 정식 목록을 받으면 교체
 */
export const DISTRICT_VALUES = ["오피스", "주거 밀집", "대학가", "번화가"] as const;

export const FLOOR_RANGE_VALUES = [
  "1층만 가능",
  "1~2층",
  "제한 없음",
] as const satisfies readonly Location["floor_range"][];
/** 3단계 중요도(간판·매장 노출, 주중·주말 매출) */
export const IMPORTANCE_VALUES = ["낮음", "보통", "높음"] as const satisfies readonly Location["sign_imp"][];
/** 4단계 중요도(점심·심야 매출) — "없음"이 더 있다 */
export const SALES_IMPORTANCE_VALUES = [
  "없음",
  "낮음",
  "보통",
  "높음",
] as const satisfies readonly Location["lunch_imp"][];
/** 필요 여부(주차·대기공간, 설비 5종) */
export const REQUIREMENT_VALUES = ["필수", "선호", "불필요"] as const satisfies readonly (
  Location["parking_req"] | Facility["gas_req"]
)[];
