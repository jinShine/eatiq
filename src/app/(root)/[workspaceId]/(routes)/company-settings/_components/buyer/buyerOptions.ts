import { type UpdateBuyerContractPolicyRequest, type UpdateBuyerStatusRequest } from "@services/api/buyer/buyer.type";

/************************************
 * 바이어 선택지 — 스펙(UpdateBuyer*Dto)의 enum 값 그대로. 라벨도 값과 같다.
 *
 * 서버는 이 값만 받는다(400 응답으로 확인, 2026-10-08). Swagger 설명·서버 오류 문구에는
 * 다른(옛) 선택지가 적힌 항목이 있지만 그 값을 보내면 거부된다 — 설명이 아니라 enum을 따른다.
 * 순서도 스펙 그대로 둔다.
 ************************************/
type Status = UpdateBuyerStatusRequest;
type Policy = UpdateBuyerContractPolicyRequest;

/************************************
 * 회사 기본 정보 — 사업 유형·운영 국가.
 * 스펙은 자유 문자열이라 선택지를 프론트에서 관리한다(백엔드와 합의, 2026-10-08).
 ************************************/

/** 사업 유형 — 서버에는 코드값을 저장하고 화면에는 한국어 이름을 보여준다 */
export const BUSINESS_TYPE_OPTIONS = [
  { value: "restaurant_chain", label: "외식 체인 운영사" },
  { value: "fnb_distribution", label: "식음료 유통사" },
  { value: "real_estate_developer", label: "부동산 개발사" },
  { value: "investment_holding", label: "투자·지주회사" },
  { value: "franchise_operator", label: "프랜차이즈 운영사" },
  { value: "other", label: "기타" },
] as const;

export const BUSINESS_TYPE_VALUES = BUSINESS_TYPE_OPTIONS.map(option => option.value) as [
  (typeof BUSINESS_TYPE_OPTIONS)[number]["value"],
  ...(typeof BUSINESS_TYPE_OPTIONS)[number]["value"][],
];

/** 운영 국가 — 값과 라벨이 같다(브랜드 진출 목표 국가와 같은 목록) */
export const OPERATING_COUNTRY_VALUES = ["일본", "홍콩", "싱가포르", "태국"] as const;

export const INDUSTRY_VALUES = [
  "양식",
  "한식",
  "일식",
  "중식",
  "카페/베이커리",
  "패스트푸드",
  "주점",
  "식음료 유통/도소매",
  "기타",
] as const satisfies readonly Status["current_industry"][];

export const BRAND_EXPERIENCE_VALUES = [
  "프랜차이즈 가맹점 운영",
  "직영 매장 운영",
  "마스터 프랜차이즈 운영",
  "해외 브랜드 라이선스 운영",
  "자체 브랜드 개발/운영",
  "해당 없음",
] as const satisfies readonly Status["brand_experience_types"][number][];

export const ANNUAL_REVENUE_VALUES = [
  "10억 미만",
  "10억 ~ 50억",
  "50억 ~ 100억",
  "100억 ~ 500억",
  "500억 이상",
] as const satisfies readonly Status["annual_revenue_scale"][];

export const CONTRACT_TYPE_VALUES = [
  "마스터 프랜차이즈",
  "지역 개발권",
  "직영",
  "합작법인",
  "라이선스",
  "유통",
  "미정",
] as const satisfies readonly NonNullable<Policy["preferred_contract_type"]>[];

export const PARTNER_ROLE_VALUES = [
  "총판/마스터 파트너",
  "합작투자(JV) 파트너",
  "단일/복수 가맹점주",
  "유통/공급 대행",
] as const satisfies readonly Policy["target_partner_role"][];

export const INVESTMENT_BUDGET_VALUES = [
  "1억 미만",
  "1억 ~ 3억",
  "3억 ~ 5억",
  "5억 ~ 10억",
  "10억 이상",
] as const satisfies readonly Policy["investment_budget_scale"][];

export const ROYALTY_TYPE_VALUES = [
  "총매출 기준 비율",
  "순수익 기준 비율",
  "월정액",
  "로열티 없음",
  "협의 가능",
] as const satisfies readonly Policy["preferred_royalty_type"][];

export const PRICE_TIER_VALUES = [
  "1만원 미만",
  "1만 ~ 2만원",
  "2만 ~ 4만원",
  "4만원 이상",
] as const satisfies readonly Policy["target_price_tier"][];

export const EXCLUSIVITY_VALUES = [
  "국가 단위 독점 필수",
  "지역 단위 독점 희망",
  "비독점 수용 가능",
  "협의 필요",
] as const satisfies readonly Policy["exclusivity_requirement"][];

export const LOCALIZATION_VALUES = [
  "할랄 인증 필수",
  "비건/채식 메뉴 필수",
  "현지 입맛 조정 필수",
  "원작 유지 선호",
  "협의 가능",
] as const satisfies readonly Policy["localization_requirement"][];

export const INTERIOR_VALUES = [
  "현지 직접 조달 희망",
  "본사 지정 감리/구매 수용",
  "협의 가능",
] as const satisfies readonly Policy["interior_preference"][];

export const SUPPLY_CHAIN_VALUES = [
  "자체 유통망 보유",
  "협력 물류망 활용 가능",
  "본사 지원 필요",
] as const satisfies readonly Policy["has_supply_chain"][];
