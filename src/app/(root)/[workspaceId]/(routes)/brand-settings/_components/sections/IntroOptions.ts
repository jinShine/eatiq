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
