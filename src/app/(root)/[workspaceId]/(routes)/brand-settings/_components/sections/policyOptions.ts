// v0.7 코드값 규약 기준 (2026-07-30 확정)
type Option = { value: string; label: string };

/** 계약 및 정책 */
export const CONTRACT_TYPE_OPTIONS: Option[] = [
  { value: "master_franchise", label: "마스터 프랜차이즈" },
  { value: "area_development", label: "지역 개발권" },
  { value: "direct_operation", label: "직영" },
  { value: "joint_venture", label: "합작법인 (JV)" },
  { value: "licensing", label: "라이선스" },
  { value: "distribution", label: "유통" },
  { value: "undecided", label: "미정" },
];

// 공통 척도: exclusivity · ingredientSupply · trademark
export const ALLOWANCE_OPTIONS: Option[] = [
  { value: "required", label: "필수" },
  { value: "preferred", label: "선호" },
  { value: "negotiable", label: "협의 가능" },
  { value: "not_required", label: "자유 적용" },
];

// 공통 척도: menuLocalization · interiorCompliance · manualCompliance
export const COMPLIANCE_OPTIONS: Option[] = [
  { value: "strict", label: "엄격 준수" },
  { value: "partial", label: "일부 조정 가능" },
  { value: "flexible", label: "유연 조정 가능" },
];

export const BRAND_TYPE_OPTIONS: Option[] = [
  { value: "franchise", label: "프랜차이즈" },
  { value: "direct", label: "직영" },
];

export const ROYALTY_BASE_OPTIONS: Option[] = [
  { value: "revenue_pct", label: "매출 비율 기준" },
  { value: "fixed", label: "고정 금액 기준" },
];

export const PAYMENT_CYCLE_OPTIONS: Option[] = [
  { value: "monthly", label: "월" },
  { value: "quarterly", label: "분기" },
  { value: "annual", label: "연" },
];

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
