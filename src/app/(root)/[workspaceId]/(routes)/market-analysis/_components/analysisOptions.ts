type Option = { value: string; label: string };

/*
 * 상권·층수·중요도 — 상권분석 목 데이터의 옛 코드값(v0.7).
 * 회사 정보 설정은 실제 API로 옮기며 스펙 값("오피스", "1층만 가능" 등)으로 바뀌었다(policyOptions).
 * TODO(API): 상권분석을 실제 API로 옮길 때(로드맵 5번) 스펙 값으로 바꾸고 이 목록을 지운다.
 */
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

// TODO(API): 상권 분석 API가 나오면 지원 국가·도시 목록을 서버에서 받는다
export const ANALYSIS_COUNTRY_OPTIONS: Option[] = [
  { value: "JP", label: "일본" },
  { value: "TW", label: "대만" },
  { value: "HK", label: "홍콩" },
  { value: "SG", label: "싱가포르" },
  { value: "TH", label: "태국" },
];

/** 국가를 고르면 그 나라 도시만 보여준다 */
export const ANALYSIS_CITY_OPTIONS: Record<string, Option[]> = {
  JP: [
    { value: "jp_tokyo", label: "도쿄" },
    { value: "jp_osaka", label: "오사카" },
    { value: "jp_yokohama", label: "요코하마" },
  ],
  TW: [
    { value: "tw_taipei", label: "타이베이" },
    { value: "tw_kaohsiung", label: "가오슝" },
  ],
  HK: [
    { value: "hk_central", label: "센트럴" },
    { value: "hk_tsimshatsui", label: "침사추이" },
  ],
  SG: [{ value: "sg_marinabay", label: "마리나베이" }],
  TH: [
    { value: "th_bangkok", label: "방콕" },
    { value: "th_pattaya", label: "파타야" },
  ],
};
