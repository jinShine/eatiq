export const CATEGORY_OPTIONS = [
  { value: "korean", label: "한식" },
  { value: "western", label: "양식" },
  { value: "japanese", label: "일식" },
  { value: "chinese", label: "중식" },
  { value: "asian", label: "아시안" },
  { value: "cafe", label: "카페·디저트" },
  { value: "chicken", label: "치킨" },
  { value: "pizza", label: "피자" },
  { value: "burger", label: "버거" },
  { value: "bakery", label: "베이커리" },
  { value: "bar", label: "주류·바" },
  { value: "etc", label: "기타" },
] as const;

export const PRICE_POSITIONING_OPTIONS = [
  { value: "low", label: "저가 (객단가 1만원 이하)" },
  { value: "mid", label: "중가 (객단가 12,000원 ~ 15,000원)" },
  { value: "high", label: "고가 (객단가 2만원 이상)" },
] as const;
