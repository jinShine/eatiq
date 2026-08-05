// v0.7 코드값 규약 기준 (2026-07-30 확정)
export const CATEGORY_OPTIONS = [
  { value: "beef_bbq", label: "소고기 구이" },
  { value: "pork_bbq", label: "돼지고기 구이" },
  { value: "korean_food", label: "한식" },
  { value: "bunsik", label: "분식" },
  { value: "chicken", label: "치킨" },
  { value: "cafe", label: "카페" },
  { value: "dessert", label: "디저트" },
  { value: "other", label: "기타" },
] as const;

export const PRICE_POSITIONING_OPTIONS = [
  { value: "mass", label: "대중 (~1만원)" },
  { value: "mid", label: "중가 (1~3만원)" },
  { value: "premium", label: "프리미엄 (3~6만원)" },
  { value: "high_end", label: "하이엔드 (6만원~)" },
] as const;

/** 운영 현황 — 최대 10개 선택 */
export const TARGET_CUSTOMER_OPTIONS = [
  { value: "young_adults", label: "20~30대 젊은 층" },
  { value: "office_workers", label: "직장인" },
  { value: "students", label: "학생" },
  { value: "families", label: "가족 단위" },
  { value: "couples", label: "연인·데이트" },
  { value: "solo", label: "1인 고객" },
  { value: "groups", label: "단체·모임" },
  { value: "tourists", label: "관광객" },
  { value: "middle_aged", label: "40~50대" },
  { value: "seniors", label: "시니어(60대+)" },
  { value: "other", label: "기타" },
] as const;

export const USAGE_OCCASION_OPTIONS = [
  { value: "everyday_meal", label: "일상 식사" },
  { value: "family_meal", label: "가족 식사" },
  { value: "solo_meal", label: "혼밥" },
  { value: "date", label: "데이트" },
  { value: "gathering", label: "회식·모임" },
  { value: "business_meeting", label: "비즈니스 미팅" },
  { value: "dining_out", label: "외식·나들이" },
  { value: "snack_dessert", label: "간식·디저트" },
  { value: "drinks", label: "술자리" },
  { value: "late_night", label: "야식" },
  { value: "takeout_delivery", label: "테이크아웃·배달" },
  { value: "special_occasion", label: "기념일·특별한 날" },
  { value: "other", label: "기타" },
] as const;

/** 연락처 — 담당자 사용 언어 */
export const CONTACT_LANGUAGE_OPTIONS = [
  { value: "ko", label: "한국어" },
  { value: "en", label: "영어" },
  { value: "ja", label: "일본어" },
  { value: "zh_hant", label: "중국어 번체" },
  { value: "zh_hans", label: "중국어 간체" },
  { value: "th", label: "태국어" },
  { value: "vi", label: "베트남어" },
] as const;
