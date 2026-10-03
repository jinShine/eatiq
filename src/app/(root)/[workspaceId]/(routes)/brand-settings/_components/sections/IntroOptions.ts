import { type UpdateBrandIntroRequest } from "@services/api/brand/brand.type";

/**
 * 브랜드 소개 선택지 — 스펙(UpdateBrandIntroDto)의 값 그대로. 라벨도 값과 같다.
 * 서버가 이 값만 받는다(아니면 400). 옛 코드표(v0.7, beef_bbq 등)는 폐기됐다.
 */
export const CATEGORY_VALUES = ["양식", "한식", "일식", "중식"] as const satisfies readonly NonNullable<
  UpdateBrandIntroRequest["category"]
>[];

export const PRICE_POSITIONING_VALUES = ["저가", "중가", "고가"] as const satisfies readonly NonNullable<
  UpdateBrandIntroRequest["price_positioning"]
>[];

/**
 * 운영 현황 — 주요 고객층·주 이용 상황.
 * 스펙은 선택지 없는 자유 문자열 배열이라 화면 라벨(한국어)을 그대로 저장한다.
 * 서버·AI가 번역표 없이 읽을 수 있다. (옛 영어 코드값 young_adults 등은 폐기)
 */
export const TARGET_AUDIENCE_VALUES = [
  "20~30대 젊은 층",
  "직장인",
  "학생",
  "가족 단위",
  "연인·데이트",
  "1인 고객",
  "단체·모임",
  "관광객",
  "40~50대",
  "시니어(60대+)",
  "기타",
];

export const USAGE_CONTEXT_VALUES = [
  "일상 식사",
  "가족 식사",
  "혼밥",
  "데이트",
  "회식·모임",
  "비즈니스 미팅",
  "외식·나들이",
  "간식·디저트",
  "술자리",
  "야식",
  "테이크아웃·배달",
  "기념일·특별한 날",
  "기타",
];

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
