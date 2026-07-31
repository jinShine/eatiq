// TODO(백엔드): 서버가 허용하는 코드값 목록을 받으면 교체 (현재는 디자인 기준 임시값)
type Option = { value: string; label: string };

/** 계약 및 정책 */
export const CONTRACT_TYPE_OPTIONS: Option[] = [
  { value: "master_franchise", label: "마스터 프랜차이즈" },
  { value: "area_franchise", label: "지역 프랜차이즈" },
  { value: "single_store", label: "단일 매장" },
  { value: "joint_venture", label: "조인트 벤처" },
  { value: "direct", label: "직영 진출" },
];

export const YES_NO_OPTIONS: Option[] = [
  { value: "allowed", label: "가능" },
  { value: "not_allowed", label: "불가" },
  { value: "negotiable", label: "협의 가능" },
];

export const SUPPLY_SCOPE_OPTIONS: Option[] = [
  { value: "required", label: "필수" },
  { value: "core_only", label: "핵심 품목만" },
  { value: "optional", label: "선택" },
  { value: "not_required", label: "필요 없음" },
];

export const COMPLIANCE_OPTIONS: Option[] = [
  { value: "full", label: "전면 준수 필수" },
  { value: "partial", label: "부분 조정 가능" },
  { value: "flexible", label: "자율" },
];

export const ROYALTY_BASE_OPTIONS: Option[] = [
  { value: "gross_sales", label: "총매출" },
  { value: "net_sales", label: "순매출" },
  { value: "fixed", label: "정액" },
];

export const PAYMENT_CYCLE_OPTIONS: Option[] = [
  { value: "monthly", label: "매월" },
  { value: "quarterly", label: "매 분기" },
  { value: "yearly", label: "매년" },
];

/** 상권분석 기준 */
export const AREA_TYPE_OPTIONS: Option[] = [
  { value: "office", label: "오피스" },
  { value: "residential", label: "주거 밀집" },
  { value: "station", label: "역세권" },
  { value: "university", label: "대학가" },
  { value: "downtown", label: "번화가" },
  { value: "mall", label: "쇼핑몰·백화점" },
  { value: "tourist", label: "관광지" },
];

export const FLOOR_OPTIONS: Option[] = [
  { value: "first_only", label: "1층만 가능" },
  { value: "first_preferred", label: "1층 선호" },
  { value: "any", label: "층수 무관" },
  { value: "upper_ok", label: "2층 이상 가능" },
];

export const IMPORTANCE_OPTIONS: Option[] = [
  { value: "high", label: "높음" },
  { value: "medium", label: "보통" },
  { value: "low", label: "낮음" },
  { value: "none", label: "없음" },
];

export const REQUIREMENT_OPTIONS: Option[] = [
  { value: "required", label: "필수" },
  { value: "preferred", label: "선호" },
  { value: "optional", label: "무관" },
];
