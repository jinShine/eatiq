// 상권·층수·중요도 옵션은 회사 정보 설정과 같은 코드값을 쓴다.
// TODO(리팩토링): 세 도메인이 공유하므로 공용 상수 위치로 옮기는 게 맞다.
export {
  AREA_TYPE_OPTIONS,
  FLOOR_OPTIONS,
  IMPORTANCE_OPTIONS,
} from "../../brand-settings/_components/sections/policyOptions";

type Option = { value: string; label: string };

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
